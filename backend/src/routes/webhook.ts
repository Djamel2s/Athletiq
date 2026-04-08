import express from 'express';
import Stripe from 'stripe';
import { AppDataSource } from '../config/database.js';
import { Subscription, SubscriptionStatus, SubscriptionPlan } from '../entities/Subscription.js';
import { User } from '../entities/User.js';
import { ProcessedWebhookEvent } from '../entities/ProcessedWebhookEvent.js';
import { logger } from '../utils/logger.js';

const router = express.Router();
const subscriptionRepo = AppDataSource.getRepository(Subscription);
const processedWebhookEventRepo = AppDataSource.getRepository(ProcessedWebhookEvent);

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';
if (process.env.NODE_ENV === 'production' && !process.env.STRIPE_WEBHOOK_SECRET) {
  logger.warn('STRIPE_WEBHOOK_SECRET non configure — les webhooks Stripe renverront 503');
}

// ============================================================
// POST /api/webhook/stripe — Reçoit les événements Stripe
// IMPORTANT : ce endpoint utilise le body RAW (pas JSON parsé)
// ============================================================
router.post(
  '/stripe',
  express.raw({ type: 'application/json', limit: '1mb' }),
  async (req, res) => {
    if (!stripe || !WEBHOOK_SECRET) {
      return res.status(503).json({ error: 'Webhook non configuré' });
    }

    let event: Stripe.Event;

    try {
      const signature = req.headers['stripe-signature'] as string;
      event = stripe.webhooks.constructEvent(req.body, signature, WEBHOOK_SECRET);
    } catch (err) {
      logger.error({ route: 'webhook' }, 'Webhook signature verification failed');
      return res.status(400).json({ error: 'Signature invalide' });
    }

    const alreadyProcessed = await processedWebhookEventRepo.findOne({
      where: { eventId: event.id, provider: 'stripe' },
      select: ['id'],
    });
    if (alreadyProcessed) {
      return res.json({ received: true, skipped: 'duplicate' });
    }

    try {
      switch (event.type) {
        // Paiement réussi → activer l'abonnement
        case 'checkout.session.completed': {
          const session = event.data.object as Stripe.Checkout.Session;
          const userId = parseInt(session.metadata?.userId || '0', 10);
          if (!userId || isNaN(userId)) break;

          // Vérifier que l'utilisateur existe en base
          const userExists = await AppDataSource.getRepository(User).findOne({
            where: { id: userId },
            select: ['id'],
          });
          if (!userExists) {
            logger.error({ userId, route: 'webhook' }, 'Webhook: userId introuvable en base');
            break;
          }

          const stripeSubscriptionId = session.subscription as string;
          const stripeSub = await stripe.subscriptions.retrieve(stripeSubscriptionId);

          let subscription = await subscriptionRepo.findOne({ where: { userId } });
          if (!subscription) {
            subscription = subscriptionRepo.create({ userId });
          }

          // Idempotency: skip if already active with same subscription ID
          if (
            subscription.stripeSubscriptionId === stripeSubscriptionId &&
            subscription.status === SubscriptionStatus.ACTIVE
          ) {
            logger.info({ userId }, 'Subscription already active, skipping');
            break;
          }

          subscription.stripeCustomerId = session.customer as string;
          subscription.stripeSubscriptionId = stripeSubscriptionId;
          subscription.status = SubscriptionStatus.ACTIVE;

          // Déterminer le plan selon l'intervalle
          const interval = stripeSub.items.data[0]?.price?.recurring?.interval;
          if (interval === 'year') {
            subscription.plan = SubscriptionPlan.YEARLY;
          } else {
            subscription.plan = SubscriptionPlan.MONTHLY;
          }

          subscription.currentPeriodStart = new Date(
            (stripeSub as any).current_period_start * 1000
          );
          subscription.currentPeriodEnd = new Date((stripeSub as any).current_period_end * 1000);

          await subscriptionRepo.save(subscription);
          logger.info({ userId }, 'Abonnement active');
          break;
        }

        // Renouvellement réussi
        case 'invoice.paid': {
          const invoice = event.data.object as Stripe.Invoice;
          const subId = (invoice as any).subscription as string;
          if (!subId) break;

          const subscription = await subscriptionRepo.findOne({
            where: { stripeSubscriptionId: subId },
          });
          if (subscription) {
            subscription.status = SubscriptionStatus.ACTIVE;
            const stripeSub = await stripe.subscriptions.retrieve(subId);
            subscription.currentPeriodStart = new Date(
              (stripeSub as any).current_period_start * 1000
            );
            subscription.currentPeriodEnd = new Date((stripeSub as any).current_period_end * 1000);
            await subscriptionRepo.save(subscription);
          }
          break;
        }

        // Paiement échoué
        case 'invoice.payment_failed': {
          const invoice = event.data.object as Stripe.Invoice;
          const subId = (invoice as any).subscription as string;
          if (!subId) break;

          const subscription = await subscriptionRepo.findOne({
            where: { stripeSubscriptionId: subId },
          });
          if (subscription) {
            subscription.status = SubscriptionStatus.PAST_DUE;
            await subscriptionRepo.save(subscription);
            logger.warn({ subId }, 'Paiement echoue pour subscription');
          }
          break;
        }

        // Abonnement annulé/expiré
        case 'customer.subscription.deleted': {
          const stripeSub = event.data.object as Stripe.Subscription;
          const subscription = await subscriptionRepo.findOne({
            where: { stripeSubscriptionId: stripeSub.id },
          });
          if (subscription) {
            subscription.status = SubscriptionStatus.CANCELED;
            subscription.canceledAt = new Date();
            await subscriptionRepo.save(subscription);
            logger.info({ stripeSubId: stripeSub.id }, 'Abonnement annule');
          }
          break;
        }
      }

      try {
        const processedEvent = processedWebhookEventRepo.create({
          eventId: event.id,
          provider: 'stripe',
        });
        await processedWebhookEventRepo.save(processedEvent);
      } catch (error) {
        const code = (error as { code?: string })?.code;
        if (code !== '23505') {
          throw error;
        }
        return res.json({ received: true, skipped: 'duplicate' });
      }

      res.json({ received: true });
    } catch (error) {
      logger.error({ err: error, route: 'webhook' }, 'Error processing webhook');
      res.status(500).json({ error: 'Erreur traitement webhook' });
    }
  }
);

export default router;
