import { AppDataSource } from '../config/database.js'
import { Subscription, SubscriptionStatus, SubscriptionPlan } from '../entities/Subscription.js'
import { Workout } from '../entities/Workout.js'
import { WorkoutPhoto } from '../entities/WorkoutPhoto.js'
import { UserGoal } from '../entities/UserGoal.js'
import { PLAN_LIMITS, PlanType } from '../config/planLimits.js'
import { MoreThanOrEqual } from 'typeorm'

// Verrou par utilisateur pour éviter les race conditions (TOCTOU)
const userLocks = new Map<string, Promise<void>>()

export async function withUserLock<T>(userId: number, action: string, fn: () => Promise<T>): Promise<T> {
  const key = `${userId}:${action}`
  // Attendre le verrou précédent s'il existe
  const previous = userLocks.get(key) || Promise.resolve()
  let resolve: () => void
  const current = new Promise<void>(r => { resolve = r })
  userLocks.set(key, current)
  try {
    await previous
    return await fn()
  } finally {
    resolve!()
    if (userLocks.get(key) === current) {
      userLocks.delete(key)
    }
  }
}

// Détermine si l'utilisateur est premium
export async function getUserPlanType(userId: number): Promise<PlanType> {
  const subscription = await AppDataSource.getRepository(Subscription).findOne({
    where: { userId }
  })

  if (!subscription) return 'FREE'

  const isActive = subscription.status === SubscriptionStatus.ACTIVE
  const isTrial = subscription.status === SubscriptionStatus.TRIAL &&
    subscription.trialEndDate != null && new Date() < subscription.trialEndDate

  return (isActive || isTrial) ? 'PREMIUM' : 'FREE'
}

// Vérifie la limite de séances par semaine
export async function checkWorkoutLimit(userId: number): Promise<{ allowed: boolean; current: number; limit: number }> {
  const planType = await getUserPlanType(userId)
  const limit = PLAN_LIMITS[planType].workoutsPerWeek

  if (limit === Infinity) return { allowed: true, current: 0, limit: -1 }

  const now = new Date()
  const dayOfWeek = now.getDay()
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  const monday = new Date(now)
  monday.setHours(0, 0, 0, 0)
  monday.setDate(monday.getDate() + mondayOffset)

  const current = await AppDataSource.getRepository(Workout).count({
    where: {
      userId,
      isTemplate: false,
      completedAt: MoreThanOrEqual(monday)
    }
  })

  return { allowed: current < limit, current, limit }
}

// Vérifie la limite de templates
export async function checkTemplateLimit(userId: number): Promise<{ allowed: boolean; current: number; limit: number }> {
  const planType = await getUserPlanType(userId)
  const limit = PLAN_LIMITS[planType].workoutTemplates

  if (limit === Infinity) return { allowed: true, current: 0, limit: -1 }

  const current = await AppDataSource.getRepository(Workout).count({
    where: { userId, isTemplate: true }
  })

  return { allowed: current < limit, current, limit }
}

// Vérifie la limite de photos
export async function checkPhotoLimit(userId: number): Promise<{ allowed: boolean; current: number; limit: number }> {
  const planType = await getUserPlanType(userId)
  const limit = PLAN_LIMITS[planType].photos

  if (limit === Infinity) return { allowed: true, current: 0, limit: -1 }

  const current = await AppDataSource.getRepository(WorkoutPhoto)
    .createQueryBuilder('photo')
    .innerJoin('photo.workout', 'workout')
    .where('workout.userId = :userId', { userId })
    .getCount()

  return { allowed: current < limit, current, limit }
}

// Vérifie la limite d'objectifs
export async function checkGoalLimit(userId: number): Promise<{ allowed: boolean; current: number; limit: number }> {
  const planType = await getUserPlanType(userId)
  const limit = PLAN_LIMITS[planType].goals

  if (limit === Infinity) return { allowed: true, current: 0, limit: -1 }

  const current = await AppDataSource.getRepository(UserGoal).count({
    where: { userId, achieved: false }
  })

  return { allowed: current < limit, current, limit }
}
