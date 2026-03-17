import express from 'express'
import Stripe from 'stripe'
import { AppDataSource } from '../config/database.js'
import { Subscription, SubscriptionStatus, SubscriptionPlan } from '../entities/Subscription.js'
import { User } from '../entities/User.js'

const router = express.Router()
const subscriptionRepo = AppDataSource.getRepository(Subscription)

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || ''
if (process.env.NODE_ENV === 'production' && !process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error('STRIPE_WEBHOOK_SECRET is required in production')
}

// ============================================================
// POST /api/webhook/stripe — Reçoit les événements Stripe
// IMPORTANT : ce endpoint utilise le body RAW (pas JSON parsé)
// ============================================================
router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  if (!stripe || !WEBHOOK_SECRET) {
    return res.status(503).json({ error: 'Webhook non configuré' })
  }

  let event: Stripe.Event

  try {
    const signature = req.headers['stripe-signature'] as string
    event = stripe.webhooks.constructEvent(req.body, signature, WEBHOOK_SECRET)
  } catch (err) {
    console.error('⚠️ Webhook signature verification failed')
    return res.status(400).json({ error: 'Signature invalide' })
  }

  try {
    switch (event.type) {
      // Paiement réussi → activer l'abonnement
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = parseInt(session.metadata?.userId || '0')
        if (!userId || isNaN(userId)) break

        // Vérifier que l'utilisateur existe en base
        const userExists = await AppDataSource.getRepository(User).findOne({ where: { id: userId }, select: ['id'] })
        if (!userExists) {
          console.error(`⚠️ Webhook: userId ${userId} introuvable en base`)
          break
        }

        const stripeSubscriptionId = session.subscription as string
        const stripeSub = await stripe.subscriptions.retrieve(stripeSubscriptionId)

        let subscription = await subscriptionRepo.findOne({ where: { userId } })
        if (!subscription) {
          subscription = subscriptionRepo.create({ userId })
        }

        // Idempotency: skip if already active with same subscription ID
        if (
          subscription.stripeSubscriptionId === stripeSubscriptionId &&
          subscription.status === SubscriptionStatus.ACTIVE
        ) {
          console.log(`⏭️ Subscription already active for user ${userId}, skipping`)
          break
        }

        subscription.stripeCustomerId = session.customer as string
        subscription.stripeSubscriptionId = stripeSubscriptionId
        subscription.status = SubscriptionStatus.ACTIVE

        // Déterminer le plan selon l'intervalle
        const interval = (stripeSub.items.data[0]?.price?.recurring?.interval)
        if (interval === 'year') {
          subscription.plan = SubscriptionPlan.YEARLY
        } else {
          subscription.plan = SubscriptionPlan.MONTHLY
        }

        subscription.currentPeriodStart = new Date((stripeSub as any).current_period_start * 1000)
        subscription.currentPeriodEnd = new Date((stripeSub as any).current_period_end * 1000)

        await subscriptionRepo.save(subscription)
        console.log(`✅ Abonnement activé pour user ${userId}`)
        break
      }

      // Renouvellement réussi
      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice
        const subId = (invoice as any).subscription as string
        if (!subId) break

        const subscription = await subscriptionRepo.findOne({
          where: { stripeSubscriptionId: subId }
        })
        if (subscription) {
          subscription.status = SubscriptionStatus.ACTIVE
          const stripeSub = await stripe.subscriptions.retrieve(subId)
          subscription.currentPeriodStart = new Date((stripeSub as any).current_period_start * 1000)
          subscription.currentPeriodEnd = new Date((stripeSub as any).current_period_end * 1000)
          await subscriptionRepo.save(subscription)
        }
        break
      }

      // Paiement échoué
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const subId = (invoice as any).subscription as string
        if (!subId) break

        const subscription = await subscriptionRepo.findOne({
          where: { stripeSubscriptionId: subId }
        })
        if (subscription) {
          subscription.status = SubscriptionStatus.PAST_DUE
          await subscriptionRepo.save(subscription)
          console.log(`⚠️ Paiement échoué pour subscription ${subId}`)
        }
        break
      }

      // Abonnement annulé/expiré
      case 'customer.subscription.deleted': {
        const stripeSub = event.data.object as Stripe.Subscription
        const subscription = await subscriptionRepo.findOne({
          where: { stripeSubscriptionId: stripeSub.id }
        })
        if (subscription) {
          subscription.status = SubscriptionStatus.CANCELED
          subscription.canceledAt = new Date()
          await subscriptionRepo.save(subscription)
          console.log(`🚫 Abonnement annulé: ${stripeSub.id}`)
        }
        break
      }
    }

    res.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    res.status(500).json({ error: 'Erreur traitement webhook' })
  }
})

export default router
