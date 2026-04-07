import { AppDataSource } from '../config/database.js'
import { User } from '../entities/User.js'
import { Workout } from '../entities/Workout.js'
import { WorkoutSession } from '../entities/WorkoutSession.js'
import { Notification, NotificationType } from '../entities/Notification.js'
import { createNotification } from './notificationService.js'
import { sendPushToUser } from './pushService.js'
import { logger } from '../utils/logger.js'

/**
 * Check if a user has completed a workout today.
 */
async function hasWorkoutToday(userId: number): Promise<boolean> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const count = await AppDataSource.getRepository(Workout)
    .createQueryBuilder('w')
    .where('w.userId = :userId', { userId })
    .andWhere('w.completedAt >= :today', { today })
    .getCount()

  return count > 0
}

/**
 * Workout reminder: runs every 60s.
 * For users with reminderEnabled=true, if reminderTime matches current HH:MM
 * and they haven't worked out today, send a reminder.
 */
async function checkWorkoutReminders() {
  try {
    const now = new Date()
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

    const users = await AppDataSource.getRepository(User).find({
      where: { reminderEnabled: true, reminderTime: currentTime }
    })

    for (const user of users) {
      const workedOut = await hasWorkoutToday(user.id)
      if (workedOut) continue

      // Check if we already sent a reminder today
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const existingReminder = await AppDataSource.getRepository(Notification)
        .createQueryBuilder('n')
        .where('n.userId = :userId', { userId: user.id })
        .andWhere('n.type = :type', { type: NotificationType.INACTIVITY })
        .andWhere("n.title = :title", { title: "C'est l'heure de s'entraîner !" })
        .andWhere('n.createdAt >= :today', { today })
        .getCount()

      if (existingReminder > 0) continue

      const title = "C'est l'heure de s'entraîner !"
      const message = "N'oubliez pas votre séance d'aujourd'hui."

      await createNotification(user.id, NotificationType.INACTIVITY, title, message)
      sendPushToUser(user.id, title, message).catch(() => {})
    }
  } catch (error) {
    logger.error({ err: error, route: 'scheduler' }, 'Workout reminder error')
  }
}

/**
 * Inactivity check: runs every hour.
 * Finds users with no workout for X days (inactivityThresholdDays).
 * Sends a notification if one hasn't been sent in the last 24 hours.
 */
async function checkInactivity() {
  try {
    const users = await AppDataSource.getRepository(User).find()

    for (const user of users) {
      const threshold = user.inactivityThresholdDays || 3
      const cutoff = new Date()
      cutoff.setDate(cutoff.getDate() - threshold)

      // Check if user has any workout after cutoff
      const recentWorkout = await AppDataSource.getRepository(Workout)
        .createQueryBuilder('w')
        .where('w.userId = :userId', { userId: user.id })
        .andWhere('w.completedAt >= :cutoff', { cutoff })
        .getCount()

      if (recentWorkout > 0) continue

      // Check if user has any completed workout at all (don't nag brand new users)
      const anyWorkout = await AppDataSource.getRepository(Workout)
        .createQueryBuilder('w')
        .where('w.userId = :userId', { userId: user.id })
        .andWhere('w.completedAt IS NOT NULL')
        .getCount()

      if (anyWorkout === 0) continue

      // Check we haven't sent an inactivity notification in the last 24h
      const oneDayAgo = new Date()
      oneDayAgo.setDate(oneDayAgo.getDate() - 1)

      const recentNotif = await AppDataSource.getRepository(Notification)
        .createQueryBuilder('n')
        .where('n.userId = :userId', { userId: user.id })
        .andWhere('n.type = :type', { type: NotificationType.INACTIVITY })
        .andWhere("n.title = :title", { title: 'Vous nous manquez !' })
        .andWhere('n.createdAt >= :oneDayAgo', { oneDayAgo })
        .getCount()

      if (recentNotif > 0) continue

      const title = 'Vous nous manquez !'
      const message = `Vous n'avez pas fait de séance depuis ${threshold} jours. Reprenez le rythme !`

      await createNotification(user.id, NotificationType.INACTIVITY, title, message)
      sendPushToUser(user.id, title, message).catch(() => {})
    }
  } catch (error) {
    logger.error({ err: error, route: 'scheduler' }, 'Inactivity check error')
  }
}

/**
 * Session cleanup: runs every hour.
 * Deletes completed sessions older than 7 days and
 * waiting/paused sessions older than 24 hours.
 */
async function cleanupSessions() {
  try {
    const sessionRepo = AppDataSource.getRepository(WorkoutSession)
    // Delete completed sessions older than 7 days
    await sessionRepo.createQueryBuilder().delete()
      .where('status = :completed AND "createdAt" < NOW() - INTERVAL \'7 days\'', { completed: 'COMPLETED' })
      .execute()
    // Delete waiting/paused sessions older than 24 hours
    await sessionRepo.createQueryBuilder().delete()
      .where('status IN (:...statuses) AND "createdAt" < NOW() - INTERVAL \'24 hours\'', { statuses: ['WAITING', 'PAUSED'] })
      .execute()
  } catch (err) {
    logger.error({ err, route: 'scheduler' }, 'Session cleanup error')
  }
}

let reminderInterval: ReturnType<typeof setInterval> | null = null
let inactivityInterval: ReturnType<typeof setInterval> | null = null
let sessionCleanupInterval: ReturnType<typeof setInterval> | null = null
let analyticsInterval: ReturnType<typeof setInterval> | null = null

export async function startScheduler() {
  logger.info('Scheduler started')

  // Workout reminders: every 60 seconds
  reminderInterval = setInterval(checkWorkoutReminders, 60 * 1000)

  // Inactivity check: every hour
  inactivityInterval = setInterval(checkInactivity, 60 * 60 * 1000)

  // Session cleanup: every hour
  sessionCleanupInterval = setInterval(cleanupSessions, 60 * 60 * 1000)

  // Run inactivity check once on startup (delayed by 30s to let things settle)
  setTimeout(checkInactivity, 30 * 1000)
  // Run session cleanup once on startup (delayed by 60s)
  setTimeout(cleanupSessions, 60 * 1000)
  // Analytics: compute daily (every 24h). Run once after 2 minutes on startup.
  const { computeForAllUsers } = await import('./analyticsService.js')
  analyticsInterval = setInterval(() => {
    computeForAllUsers().catch(() => {})
  }, 24 * 60 * 60 * 1000)
  setTimeout(() => computeForAllUsers().catch(() => {}), 2 * 60 * 1000)
}

export function stopScheduler() {
  if (reminderInterval) clearInterval(reminderInterval)
  if (inactivityInterval) clearInterval(inactivityInterval)
  if (sessionCleanupInterval) clearInterval(sessionCleanupInterval)
  if (analyticsInterval) clearInterval(analyticsInterval)
  reminderInterval = null
  inactivityInterval = null
  sessionCleanupInterval = null
  logger.info('Scheduler stopped')
}
