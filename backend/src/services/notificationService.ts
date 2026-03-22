import { AppDataSource } from '../config/database.js'
import { Notification, NotificationType } from '../entities/Notification.js'
import { Workout } from '../entities/Workout.js'
import { sendPushToUser } from './pushService.js'

const notificationRepo = () => AppDataSource.getRepository(Notification)

export async function createNotification(
  userId: number,
  type: NotificationType,
  title: string,
  message?: string
) {
  const notification = notificationRepo().create({ userId, type, title, message })
  const saved = await notificationRepo().save(notification)

  // Fire-and-forget push notification
  sendPushToUser(userId, title, message || '').catch(() => {})

  return saved
}

/**
 * Check for new personal records after a workout is completed.
 * Compares the just-completed workout's max weights against all previous workouts.
 */
export async function checkAndCreatePRNotifications(userId: number, workoutId: number) {
  try {
    // Get the just-completed workout with exercises and sets
    const workout = await AppDataSource.getRepository(Workout).findOne({
      where: { id: workoutId, userId },
      relations: ['exercises', 'exercises.sets', 'exercises.exerciseLibrary']
    })

    if (!workout?.exercises) return

    // Build a map of exercise name → max weight in this workout
    const exerciseMaxes = new Map<string, number>()
    for (const exercise of workout.exercises) {
      const name = exercise.exerciseLibrary?.name || exercise.name
      const maxWeight = Math.max(...(exercise.sets?.map(s => s.weight || 0) || [0]))
      if (maxWeight <= 0) continue
      const existing = exerciseMaxes.get(name) || 0
      if (maxWeight > existing) exerciseMaxes.set(name, maxWeight)
    }

    if (exerciseMaxes.size === 0) return

    // Single batch query: get previous max weight for all exercise names at once
    const names = Array.from(exerciseMaxes.keys())
    const prevMaxes: Array<{ name: string; prevMax: number }> = await AppDataSource.query(`
      SELECT e.name, MAX(s.weight) as "prevMax"
      FROM sets s
      INNER JOIN exercises e ON s."exerciseId" = e.id
      INNER JOIN workouts w ON e."workoutId" = w.id
      WHERE w."userId" = $1
        AND e.name = ANY($2)
        AND w."completedAt" IS NOT NULL
        AND w.id != $3
        AND s.weight > 0
      GROUP BY e.name
    `, [userId, names, workoutId])

    const prevMaxMap = new Map(prevMaxes.map(r => [r.name, Number(r.prevMax) || 0]))

    for (const [name, maxWeightInWorkout] of exerciseMaxes) {
      const prevMax = prevMaxMap.get(name) || 0
      if (maxWeightInWorkout > prevMax && prevMax > 0) {
        await createNotification(
          userId,
          NotificationType.PR_ACHIEVED,
          `Nouveau record : ${name}`,
          `${maxWeightInWorkout} kg (+${(maxWeightInWorkout - prevMax).toFixed(1)} kg)`
        )
      }
    }
  } catch (error) {
    console.error('PR notification check error:', error)
  }
}

/**
 * Check if the user reached a streak milestone.
 */
export async function checkStreakMilestone(userId: number) {
  try {
    const milestones = [3, 7, 14, 30, 60, 100]

    // Calculate current streak
    const workouts = await AppDataSource.getRepository(Workout).find({
      where: { userId },
      order: { completedAt: 'DESC' },
      select: ['completedAt'],
      take: 200
    })

    const completedWorkouts = workouts.filter(w => w.completedAt)
    if (completedWorkouts.length === 0) return

    const workoutDates = new Set(
      completedWorkouts.map(w => {
        const d = new Date(w.completedAt!)
        d.setHours(0, 0, 0, 0)
        return d.getTime()
      })
    )

    let streak = 0
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    const today = now.getTime()
    const yesterday = today - 24 * 60 * 60 * 1000

    if (!workoutDates.has(today) && !workoutDates.has(yesterday)) return

    let checkDate = workoutDates.has(today) ? today : yesterday
    while (workoutDates.has(checkDate)) {
      streak++
      checkDate -= 24 * 60 * 60 * 1000
    }

    if (milestones.includes(streak)) {
      // Check we haven't already sent this milestone notification
      const existing = await notificationRepo().findOne({
        where: {
          userId,
          type: NotificationType.STREAK_MILESTONE,
          title: `Série de ${streak} jours !`
        }
      })

      if (!existing) {
        await createNotification(
          userId,
          NotificationType.STREAK_MILESTONE,
          `Série de ${streak} jours !`,
          `Vous vous entraînez depuis ${streak} jours consécutifs. Continuez !`
        )
      }
    }
  } catch (error) {
    console.error('Streak milestone check error:', error)
  }
}
