import express from 'express'
import { z } from 'zod'
import Stripe from 'stripe'
import { AppDataSource } from '../config/database.js'
import { Subscription, SubscriptionStatus, SubscriptionPlan } from '../entities/Subscription.js'
import { logger } from '../utils/logger.js'
import { Workout } from '../entities/Workout.js'
import { WorkoutPhoto } from '../entities/WorkoutPhoto.js'
import { UserGoal } from '../entities/UserGoal.js'
import { User } from '../entities/User.js'
import { authenticate, AuthRequest } from '../middlewares/auth.js'
import { PLAN_LIMITS } from '../config/planLimits.js'
import { MoreThanOrEqual } from 'typeorm'

const router = express.Router()
const subscriptionRepo = AppDataSource.getRepository(Subscription)
const userRepo = AppDataSource.getRepository(User)

// Stripe init — clé depuis .env
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null

// Prix configurables
const TRIAL_DAYS = 14
const PRICES = {
  monthly: process.env.STRIPE_PRICE_MONTHLY || '',  // price_xxx depuis Stripe Dashboard
  yearly: process.env.STRIPE_PRICE_YEARLY || ''
}

if (process.env.NODE_ENV === 'production' && !PRICES.monthly) {
  logger.warn('STRIPE_PRICE_MONTHLY non configure — les paiements Stripe seront desactives')
}

// ============================================================
// GET /api/subscription — Récupérer l'abonnement de l'utilisateur
// ============================================================
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    // Vérifier que l'utilisateur existe
    const user = await userRepo.findOne({ where: { id: req.user!.id } })
    if (!user) {
      return res.status(401).json({ error: 'Utilisateur non trouvé' })
    }

    let subscription = await subscriptionRepo.findOne({
      where: { userId: req.user!.id }
    })

    // Si pas d'abonnement, créer un essai gratuit
    if (!subscription) {
      subscription = subscriptionRepo.create({
        userId: req.user!.id,
        plan: SubscriptionPlan.FREE_TRIAL,
        status: SubscriptionStatus.TRIAL,
        trialStartDate: new Date(),
        trialEndDate: new Date(Date.now() + TRIAL_DAYS * 24 * 60 * 60 * 1000)
      })
      await subscriptionRepo.save(subscription)
    }

    // Vérifier si l'essai a expiré → passer en plan FREE
    if (subscription.status === SubscriptionStatus.TRIAL && subscription.trialEndDate) {
      if (new Date() > subscription.trialEndDate) {
        subscription.status = SubscriptionStatus.EXPIRED
        subscription.plan = SubscriptionPlan.FREE
        await subscriptionRepo.save(subscription)
      }
    }

    // Déterminer si premium (ACTIVE payant ou TRIAL en cours)
    const isPremium = subscription.status === SubscriptionStatus.ACTIVE ||
      (subscription.status === SubscriptionStatus.TRIAL && subscription.trialEndDate && new Date() < subscription.trialEndDate)

    const daysLeft = subscription.trialEndDate
      ? Math.max(0, Math.ceil((subscription.trialEndDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)))
      : 0

    const limits = isPremium ? PLAN_LIMITS.PREMIUM : PLAN_LIMITS.FREE

    res.json({
      subscription: {
        id: subscription.id,
        plan: subscription.plan,
        status: subscription.status,
        isPremium,
        trialDaysLeft: daysLeft,
        trialEndDate: subscription.trialEndDate,
        currentPeriodEnd: subscription.currentPeriodEnd,
        canceledAt: subscription.canceledAt,
        limits: {
          workoutsPerWeek: limits.workoutsPerWeek === Infinity ? -1 : limits.workoutsPerWeek,
          workoutTemplates: limits.workoutTemplates === Infinity ? -1 : limits.workoutTemplates,
          historyDays: limits.historyDays === Infinity ? -1 : limits.historyDays,
          photos: limits.photos === Infinity ? -1 : limits.photos,
          goals: limits.goals === Infinity ? -1 : limits.goals,
        }
      }
    })
  } catch (error) {
    logger.error({ err: error, route: 'subscription' }, 'Error fetching subscription')
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'abonnement' })
  }
})

// ============================================================
// GET /api/subscription/usage — Usage actuel de l'utilisateur
// ============================================================
router.get('/usage', authenticate, async (req: AuthRequest, res) => {
  try {
    // Séances cette semaine (lundi → dimanche)
    const now = new Date()
    const dayOfWeek = now.getDay() // 0=dim, 1=lun...
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
    const monday = new Date(now)
    monday.setHours(0, 0, 0, 0)
    monday.setDate(monday.getDate() + mondayOffset)

    const workoutsThisWeek = await AppDataSource.getRepository(Workout).count({
      where: {
        userId: req.user!.id,
        isTemplate: false,
        completedAt: MoreThanOrEqual(monday)
      }
    })

    // Templates total
    const templates = await AppDataSource.getRepository(Workout).count({
      where: { userId: req.user!.id, isTemplate: true }
    })

    // Photos total
    const photos = await AppDataSource.getRepository(WorkoutPhoto)
      .createQueryBuilder('photo')
      .innerJoin('photo.workout', 'workout')
      .where('workout.userId = :userId', { userId: req.user!.id })
      .getCount()

    // Objectifs actifs (non achevés)
    const goals = await AppDataSource.getRepository(UserGoal).count({
      where: { userId: req.user!.id, achieved: false }
    })

    res.json({
      usage: {
        workoutsThisWeek,
        templates,
        photos,
        goals
      }
    })
  } catch (error) {
    logger.error({ err: error, route: 'subscription' }, 'Error fetching usage')
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'usage' })
  }
})

// ============================================================
// POST /api/subscription/checkout — Créer une session de paiement Stripe
// ============================================================
router.post('/checkout', authenticate, async (req: AuthRequest, res) => {
  try {
    if (!stripe) {
      return res.status(503).json({ error: 'Système de paiement non configuré' })
    }

    const checkoutSchema = z.object({
      plan: z.enum(['monthly', 'yearly'])
    })
    const { plan } = checkoutSchema.parse(req.body)
    const priceId = plan === 'yearly' ? PRICES.yearly : PRICES.monthly

    if (!priceId) {
      return res.status(400).json({ error: 'Plan invalide ou non configuré' })
    }

    const user = await userRepo.findOne({ where: { id: req.user!.id } })
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' })

    // Récupérer ou créer le customer Stripe
    let subscription = await subscriptionRepo.findOne({ where: { userId: req.user!.id } })
    let customerId = subscription?.stripeCustomerId

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: [user.firstName, user.lastName].filter(Boolean).join(' ') || undefined,
        metadata: { userId: String(user.id) }
      })
      customerId = customer.id

      if (subscription) {
        subscription.stripeCustomerId = customerId
        await subscriptionRepo.save(subscription)
      }
    }

    // Créer la session Checkout
    // Stripe Checkout gère carte bancaire, Apple Pay, Google Pay, SEPA, etc.
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      allow_promotion_codes: true,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.APP_URL || 'http://localhost:3000'}/subscription?success=true`,
      cancel_url: `${process.env.APP_URL || 'http://localhost:3000'}/subscription?canceled=true`,
      metadata: { userId: String(user.id) }
    })

    res.json({ url: session.url })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Plan invalide. Choisissez monthly ou yearly.' })
    }
    logger.error({ err: error, route: 'subscription' }, 'Error creating checkout session')
    res.status(500).json({ error: 'Erreur lors de la création de la session de paiement' })
  }
})

// ============================================================
// POST /api/subscription/portal — Portail client Stripe (gérer son abo)
// ============================================================
router.post('/portal', authenticate, async (req: AuthRequest, res) => {
  try {
    if (!stripe) {
      return res.status(503).json({ error: 'Système de paiement non configuré' })
    }

    const subscription = await subscriptionRepo.findOne({ where: { userId: req.user!.id } })
    if (!subscription?.stripeCustomerId) {
      return res.status(400).json({ error: 'Pas d\'abonnement actif' })
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: `${process.env.APP_URL || 'http://localhost:3000'}/subscription`
    })

    res.json({ url: session.url })
  } catch (error) {
    logger.error({ err: error, route: 'subscription' }, 'Error creating portal session')
    res.status(500).json({ error: 'Erreur lors de l\'accès au portail' })
  }
})

// ============================================================
// POST /api/subscription/cancel — Annuler l'abonnement
// ============================================================
router.post('/cancel', authenticate, async (req: AuthRequest, res) => {
  try {
    if (!stripe) {
      return res.status(503).json({ error: 'Système de paiement non configuré' })
    }

    const subscription = await subscriptionRepo.findOne({ where: { userId: req.user!.id } })
    if (!subscription?.stripeSubscriptionId) {
      return res.status(400).json({ error: 'Pas d\'abonnement actif' })
    }

    // Annule à la fin de la période en cours (pas immédiatement)
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true
    })

    subscription.canceledAt = new Date()
    await subscriptionRepo.save(subscription)

    res.json({ message: 'Abonnement annulé. Il reste actif jusqu\'à la fin de la période.' })
  } catch (error) {
    logger.error({ err: error, route: 'subscription' }, 'Error canceling subscription')
    res.status(500).json({ error: 'Erreur lors de l\'annulation' })
  }
})

export default router
