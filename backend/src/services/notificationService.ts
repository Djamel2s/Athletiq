import { AppDataSource } from '../config/database.js'
import { Notification, NotificationType } from '../entities/Notification.js'
import { Workout } from '../entities/Workout.js'

const notificationRepo = () => AppDataSource.getRepository(Notification)

export async function createNotification(
  userId: number,
  type: NotificationType,
  title: string,
  message?: string
) {
  const notification = notificationRepo().create({ userId, type, title, message })
  return await notificationRepo().save(notification)
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

    for (const exercise of workout.exercises) {
      const name = exercise.exerciseLibrary?.name || exercise.name
      const maxWeightInWorkout = Math.max(...(exercise.sets?.map(s => s.weight || 0) || [0]))

      if (maxWeightInWorkout <= 0) continue

      // Check if this is a PR (higher than any previous workout)
      const result = await AppDataSource.query(`
        SELECT MAX(s.weight) as "prevMax"
        FROM sets s
        INNER JOIN exercises e ON s."exerciseId" = e.id
        INNER JOIN workouts w ON e."workoutId" = w.id
        WHERE w."userId" = $1
          AND e.name = $2
          AND w."completedAt" IS NOT NULL
          AND w.id != $3
          AND s.weight > 0
      `, [userId, name, workoutId])

      const prevMax = result[0]?.prevMax || 0

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
      select: ['completedAt']
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
