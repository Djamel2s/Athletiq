import { Response, NextFunction } from 'express'
import { AppDataSource } from '../config/database.js'
import { Subscription, SubscriptionStatus, SubscriptionPlan } from '../entities/Subscription.js'
import { AuthRequest } from './auth.js'
import { logger } from '../utils/logger.js'

const subscriptionRepo = AppDataSource.getRepository(Subscription)

// Vérifie que l'utilisateur a un compte (même gratuit) — laisse passer tout le monde
// Les limites sont vérifiées dans chaque route individuellement
export const requireActiveSubscription = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Non authentifié' })
    }

    let subscription = await subscriptionRepo.findOne({
      where: { userId: req.userId }
    })

    // Si pas d'abonnement, créer un essai gratuit
    if (!subscription) {
      subscription = subscriptionRepo.create({
        userId: req.userId,
        plan: SubscriptionPlan.FREE_TRIAL,
        status: SubscriptionStatus.TRIAL,
        trialStartDate: new Date(),
        trialEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      })
      await subscriptionRepo.save(subscription)
    }

    // Si essai expiré, passer en FREE (pas bloquer)
    if (subscription.status === SubscriptionStatus.TRIAL && subscription.trialEndDate) {
      if (new Date() > subscription.trialEndDate) {
        subscription.status = SubscriptionStatus.EXPIRED
        subscription.plan = SubscriptionPlan.FREE
        await subscriptionRepo.save(subscription)
      }
    }

    // On laisse passer — les limites sont gérées par route
    next()
  } catch (error) {
    logger.error({ err: error, route: 'subscription' }, 'Subscription check error')
    res.status(500).json({ error: 'Erreur de vérification d\'abonnement' })
  }
}

// Middleware strict : uniquement premium (pour des features futures 100% premium)
export const requirePremium = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Non authentifié' })
    }

    const subscription = await subscriptionRepo.findOne({
      where: { userId: req.userId }
    })

    if (!subscription) {
      return res.status(403).json({ error: 'Abonnement requis', code: 'NO_SUBSCRIPTION' })
    }

    const isActive = subscription.status === SubscriptionStatus.ACTIVE
    const isTrial = subscription.status === SubscriptionStatus.TRIAL &&
      subscription.trialEndDate != null && new Date() < subscription.trialEndDate

    if (!isActive && !isTrial) {
      return res.status(403).json({
        error: 'Fonctionnalité premium',
        code: 'PREMIUM_REQUIRED',
        status: subscription.status
      })
    }

    next()
  } catch (error) {
    logger.error({ err: error, route: 'subscription' }, 'Premium check error')
    res.status(500).json({ error: 'Erreur de vérification d\'abonnement' })
  }
}
