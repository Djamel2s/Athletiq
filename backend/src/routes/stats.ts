import express from 'express'
import { AppDataSource } from '../config/database.js'
import { User } from '../entities/User.js'
import { Workout } from '../entities/Workout.js'
import { Notification, NotificationType } from '../entities/Notification.js'
import { authenticate, AuthRequest } from '../middlewares/auth.js'
import { createNotification } from '../services/notificationService.js'

const router = express.Router()

// Helper: get ISO week string "YYYY-Www" from a date
function getISOWeek(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`
}

// Helper: get Monday of a given ISO week
function getWeekStart(isoWeek: string): Date {
  const [yearStr, weekStr] = isoWeek.split('-W')
  const year = parseInt(yearStr)
  const week = parseInt(weekStr)
  const jan4 = new Date(Date.UTC(year, 0, 4))
  const dayOfWeek = jan4.getUTCDay() || 7
  const monday = new Date(jan4)
  monday.setUTCDate(jan4.getUTCDate() - dayOfWeek + 1 + (week - 1) * 7)
  return monday
}

/**
 * GET /stats/streak
 * Weekly streak data, milestones, heatmap
 */
router.get('/streak', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id
    const userRepo = AppDataSource.getRepository(User)
    const workoutRepo = AppDataSource.getRepository(Workout)

    const user = await userRepo.findOne({ where: { id: userId } })
    if (!user) return res.status(404).json({ error: 'User not found' })

    const goalPerWeek = user.streakGoalPerWeek || 2

    // Fetch completed workouts (last 2 years max for performance)
    const twoYearsAgo = new Date()
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2)

    const workouts = await workoutRepo
      .createQueryBuilder('w')
      .select(['w.id', 'w.completedAt'])
      .where('w.userId = :userId', { userId })
      .andWhere('w.completedAt IS NOT NULL')
      .andWhere('w.completedAt >= :since', { since: twoYearsAgo })
      .orderBy('w.completedAt', 'DESC')
      .getMany()

    const completedWorkouts = workouts

    // Group workouts by ISO week
    const weekMap = new Map<string, number>()
    for (const w of completedWorkouts) {
      const week = getISOWeek(new Date(w.completedAt!))
      weekMap.set(week, (weekMap.get(week) || 0) + 1)
    }

    // Current week info
    const now = new Date()
    const currentWeek = getISOWeek(now)
    const currentWeekWorkouts = weekMap.get(currentWeek) || 0

    // Calculate weekly streak (consecutive weeks meeting goal)
    let currentStreak = 0
    const checkWeek = new Date(now)
    // If current week hasn't met goal yet, start checking from last week
    const currentWeekMet = currentWeekWorkouts >= goalPerWeek
    if (!currentWeekMet) {
      checkWeek.setDate(checkWeek.getDate() - 7)
    }

    while (true) {
      const weekKey = getISOWeek(checkWeek)
      const count = weekMap.get(weekKey) || 0
      if (count >= goalPerWeek) {
        currentStreak++
        checkWeek.setDate(checkWeek.getDate() - 7)
      } else {
        break
      }
    }

    // Update best streak if needed
    if (currentStreak > (user.bestStreak || 0)) {
      await userRepo.update(userId, { bestStreak: currentStreak })
    }

    // Days since last workout
    let daysSinceLastWorkout: number | null = null
    if (completedWorkouts.length > 0) {
      const lastDate = new Date(completedWorkouts[0].completedAt!)
      daysSinceLastWorkout = Math.floor((now.getTime() - lastDate.getTime()) / 86400000)
    }

    // Weekly history (last 12 weeks)
    const weeklyHistory: { week: string; count: number; metGoal: boolean }[] = []
    const historyDate = new Date(now)
    for (let i = 0; i < 12; i++) {
      const weekKey = getISOWeek(historyDate)
      const count = weekMap.get(weekKey) || 0
      weeklyHistory.unshift({ week: weekKey, count, metGoal: count >= goalPerWeek })
      historyDate.setDate(historyDate.getDate() - 7)
    }

    // Milestones (in weeks)
    const milestoneWeeks = [2, 4, 8, 12, 26, 52]
    const bestStreak = Math.max(currentStreak, user.bestStreak || 0)
    const milestones = milestoneWeeks.map(weeks => ({
      weeks,
      achieved: bestStreak >= weeks
    }))

    const nextMilestone = milestoneWeeks.find(w => w > currentStreak) || null

    res.json({
      currentStreak,
      bestStreak,
      streakGoalPerWeek: goalPerWeek,
      currentWeekWorkouts,
      daysSinceLastWorkout,
      weeklyHistory,
      milestones,
      nextMilestone
    })
  } catch (error) {
    console.error('Streak error:', error)
    res.status(500).json({ error: 'Failed to fetch streak data' })
  }
})

/**
 * GET /stats/weekly-recap
 * Summary of the current/last completed week
 */
router.get('/weekly-recap', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id

    // Get current week boundaries (Monday to Sunday)
    const now = new Date()
    const dayOfWeek = now.getDay() || 7 // Monday = 1, Sunday = 7
    const monday = new Date(now)
    monday.setDate(now.getDate() - dayOfWeek + 1)
    monday.setHours(0, 0, 0, 0)

    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)
    sunday.setHours(23, 59, 59, 999)

    // Previous week boundaries
    const prevMonday = new Date(monday)
    prevMonday.setDate(monday.getDate() - 7)
    const prevSunday = new Date(monday)
    prevSunday.setDate(monday.getDate() - 1)
    prevSunday.setHours(23, 59, 59, 999)

    const workoutRepo = AppDataSource.getRepository(Workout)

    // Current week workouts
    const currentWorkouts = await workoutRepo
      .createQueryBuilder('w')
      .leftJoinAndSelect('w.exercises', 'e')
      .leftJoinAndSelect('e.sets', 's')
      .leftJoinAndSelect('e.exerciseLibrary', 'lib')
      .where('w.userId = :userId', { userId })
      .andWhere('w.completedAt IS NOT NULL')
      .andWhere('w.completedAt >= :start', { start: monday })
      .andWhere('w.completedAt <= :end', { end: sunday })
      .getMany()

    // Previous week workouts (for comparison)
    const prevWorkouts = await workoutRepo
      .createQueryBuilder('w')
      .where('w.userId = :userId', { userId })
      .andWhere('w.completedAt IS NOT NULL')
      .andWhere('w.completedAt >= :start', { start: prevMonday })
      .andWhere('w.completedAt <= :end', { end: prevSunday })
      .getMany()

    // Aggregate current week
    let totalDuration = 0
    let totalVolume = 0
    let exerciseCount = 0
    let prsAchieved = 0
    const musclesSet = new Set<string>()
    let bestExercise: { name: string; volume: number } | null = null
    const exerciseVolumeMap = new Map<string, number>()

    for (const w of currentWorkouts) {
      totalDuration += w.duration || 0
      totalVolume += w.totalVolume || 0
      if (w.exercises) {
        exerciseCount += w.exercises.length
        for (const ex of w.exercises) {
          const lib = ex.exerciseLibrary
          if (lib?.primaryMuscle) musclesSet.add(lib.primaryMuscle)
          if (lib?.muscleGroups) lib.muscleGroups.forEach((m: string) => musclesSet.add(m))

          const name = lib?.name || ex.name
          let exVolume = 0
          if (ex.sets) {
            for (const s of ex.sets) {
              exVolume += (s.weight || 0) * (s.reps || 0)
            }
          }
          exerciseVolumeMap.set(name, (exerciseVolumeMap.get(name) || 0) + exVolume)
        }
      }
    }

    // Find best exercise by volume
    for (const [name, volume] of exerciseVolumeMap) {
      if (!bestExercise || volume > bestExercise.volume) {
        bestExercise = { name, volume }
      }
    }

    // Count PRs this week
    const prNotifs = await AppDataSource.getRepository(Notification).count({
      where: {
        userId,
        type: NotificationType.PR_ACHIEVED
      }
    })
    // Simple approximation: count PR notifications created this week
    const prThisWeek = await AppDataSource.getRepository(Notification)
      .createQueryBuilder('n')
      .where('n.userId = :userId', { userId })
      .andWhere('n.type = :type', { type: NotificationType.PR_ACHIEVED })
      .andWhere('n.createdAt >= :start', { start: monday })
      .andWhere('n.createdAt <= :end', { end: sunday })
      .getCount()

    // Comparison with previous week
    let prevDuration = 0
    let prevVolume = 0
    for (const w of prevWorkouts) {
      prevDuration += w.duration || 0
      prevVolume += w.totalVolume || 0
    }

    const totalCalories = Math.round((totalDuration / 60) * 6)

    // Streak (reuse simple calculation)
    const weekKey = getISOWeek(now)

    const weekLabel = `${monday.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} - ${sunday.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}`

    res.json({
      weekLabel,
      totalWorkouts: currentWorkouts.length,
      totalDuration,
      totalVolume,
      totalCalories,
      exerciseCount,
      prsAchieved: prThisWeek,
      musclesTrained: Array.from(musclesSet),
      currentStreak: 0, // Will be filled by frontend from streak endpoint
      bestExercise,
      comparison: {
        workouts: prevWorkouts.length > 0 ? currentWorkouts.length - prevWorkouts.length : null,
        duration: prevDuration > 0 ? Math.round(((totalDuration - prevDuration) / prevDuration) * 100) : null,
        volume: prevVolume > 0 ? Math.round(((totalVolume - prevVolume) / prevVolume) * 100) : null
      }
    })
  } catch (error) {
    console.error('Weekly recap error:', error)
    res.status(500).json({ error: 'Failed to fetch weekly recap' })
  }
})

/**
 * GET /stats/correlation
 * Frequency vs progression analysis over last 12 weeks
 */
router.get('/correlation', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id

    // Get workouts from last 12 weeks with sets
    const twelveWeeksAgo = new Date()
    twelveWeeksAgo.setDate(twelveWeeksAgo.getDate() - 84)

    const workouts = await AppDataSource.getRepository(Workout)
      .createQueryBuilder('w')
      .leftJoinAndSelect('w.exercises', 'e')
      .leftJoinAndSelect('e.sets', 's')
      .where('w.userId = :userId', { userId })
      .andWhere('w.completedAt IS NOT NULL')
      .andWhere('w.completedAt >= :since', { since: twelveWeeksAgo })
      .orderBy('w.completedAt', 'ASC')
      .getMany()

    // Group by week
    const weekData = new Map<string, { count: number; maxWeights: number[] }>()

    for (const w of workouts) {
      const week = getISOWeek(new Date(w.completedAt!))
      if (!weekData.has(week)) {
        weekData.set(week, { count: 0, maxWeights: [] })
      }
      const data = weekData.get(week)!
      data.count++

      if (w.exercises) {
        for (const ex of w.exercises) {
          if (ex.sets) {
            const maxWeight = Math.max(...ex.sets.map(s => s.weight || 0))
            if (maxWeight > 0) data.maxWeights.push(maxWeight)
          }
        }
      }
    }

    // Build weeks array
    const weeks: { week: string; workoutCount: number; avgMaxWeight: number }[] = []
    const now = new Date()
    const iterDate = new Date(twelveWeeksAgo)

    while (iterDate <= now) {
      const weekKey = getISOWeek(iterDate)
      const data = weekData.get(weekKey)
      weeks.push({
        week: weekKey,
        workoutCount: data?.count || 0,
        avgMaxWeight: data?.maxWeights.length
          ? Math.round(data.maxWeights.reduce((a, b) => a + b, 0) / data.maxWeights.length * 10) / 10
          : 0
      })
      iterDate.setDate(iterDate.getDate() + 7)
    }

    // Deduplicate weeks (iterDate might hit same week twice)
    const uniqueWeeks = new Map<string, typeof weeks[0]>()
    for (const w of weeks) {
      uniqueWeeks.set(w.week, w)
    }
    const finalWeeks = Array.from(uniqueWeeks.values())

    // Calculate insight: high frequency weeks vs low frequency weeks
    const highFreqWeeks = finalWeeks.filter(w => w.workoutCount >= 3 && w.avgMaxWeight > 0)
    const lowFreqWeeks = finalWeeks.filter(w => w.workoutCount > 0 && w.workoutCount < 3 && w.avgMaxWeight > 0)

    const highFreqAvgProgress = highFreqWeeks.length > 0
      ? Math.round(highFreqWeeks.reduce((sum, w) => sum + w.avgMaxWeight, 0) / highFreqWeeks.length * 10) / 10
      : 0

    const lowFreqAvgProgress = lowFreqWeeks.length > 0
      ? Math.round(lowFreqWeeks.reduce((sum, w) => sum + w.avgMaxWeight, 0) / lowFreqWeeks.length * 10) / 10
      : 0

    let insight = ''
    if (highFreqAvgProgress > 0 && lowFreqAvgProgress > 0) {
      const ratio = highFreqAvgProgress / lowFreqAvgProgress
      if (ratio > 1.1) {
        insight = `Tu progresses ${ratio.toFixed(1)}x plus vite quand tu t'entraînes 3x+ par semaine`
      } else {
        insight = `Ta progression est régulière, continue comme ça !`
      }
    } else if (finalWeeks.filter(w => w.workoutCount > 0).length < 3) {
      insight = `Pas assez de données pour l'instant. Continue à t'entraîner !`
    } else {
      insight = `Continue à t'entraîner régulièrement pour voir la corrélation.`
    }

    res.json({
      weeks: finalWeeks,
      insight,
      highFreqAvgProgress,
      lowFreqAvgProgress
    })
  } catch (error) {
    console.error('Correlation error:', error)
    res.status(500).json({ error: 'Failed to fetch correlation data' })
  }
})

/**
 * POST /stats/check-inactivity
 * Check and send inactivity notifications if needed
 */
router.post('/check-inactivity', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id
    const userRepo = AppDataSource.getRepository(User)
    const workoutRepo = AppDataSource.getRepository(Workout)

    const user = await userRepo.findOne({ where: { id: userId } })
    if (!user || !user.reminderEnabled) {
      return res.json({ sent: false, reason: 'Reminders disabled' })
    }

    // Find last completed workout
    const lastWorkout = await workoutRepo.findOne({
      where: { userId },
      order: { completedAt: 'DESC' },
      select: ['completedAt']
    })

    if (!lastWorkout?.completedAt) {
      return res.json({ sent: false, reason: 'No completed workouts' })
    }

    const daysSince = Math.floor(
      (Date.now() - new Date(lastWorkout.completedAt).getTime()) / 86400000
    )

    if (daysSince < (user.inactivityThresholdDays || 3)) {
      return res.json({ sent: false, reason: 'Within threshold' })
    }

    // Check if we already sent an inactivity notification today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const existingToday = await AppDataSource.getRepository(Notification)
      .createQueryBuilder('n')
      .where('n.userId = :userId', { userId })
      .andWhere('n.type = :type', { type: NotificationType.INACTIVITY })
      .andWhere('n.createdAt >= :today', { today })
      .getCount()

    if (existingToday > 0) {
      return res.json({ sent: false, reason: 'Already notified today' })
    }

    // Contextual messages
    const messages = [
      `Ça fait ${daysSince} jours sans entraînement. Une séance rapide ?`,
      `${daysSince} jours de pause... Ton corps est prêt pour la prochaine séance !`,
      `Hey ! Ta dernière séance remonte à ${daysSince} jours. On s'y remet ?`,
      `${daysSince} jours sans training. Même 30 min comptent !`
    ]
    const message = messages[Math.floor(Math.random() * messages.length)]

    await createNotification(
      userId,
      NotificationType.INACTIVITY,
      'Tu nous manques !',
      message
    )

    res.json({ sent: true, daysSince })
  } catch (error) {
    console.error('Inactivity check error:', error)
    res.status(500).json({ error: 'Failed to check inactivity' })
  }
})

/**
 * GET /stats/recovery
 * Daily recovery score based on recent workout history per muscle group
 */
router.get('/recovery', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id

    const now = new Date()
    const fourteenDaysAgo = new Date(now)
    fourteenDaysAgo.setDate(now.getDate() - 14)
    const sevenDaysAgo = new Date(now)
    sevenDaysAgo.setDate(now.getDate() - 7)

    // Fetch workouts from last 14 days with exercises and sets (cap à 50 séances)
    const workouts = await AppDataSource.getRepository(Workout)
      .createQueryBuilder('w')
      .leftJoinAndSelect('w.exercises', 'e')
      .leftJoinAndSelect('e.sets', 's')
      .leftJoinAndSelect('e.exerciseLibrary', 'lib')
      .where('w.userId = :userId', { userId })
      .andWhere('w.completedAt IS NOT NULL')
      .andWhere('w.completedAt >= :since', { since: fourteenDaysAgo })
      .orderBy('w.completedAt', 'DESC')
      .take(50)
      .getMany()

    // Check if no workouts in last 7 days
    const recentWorkouts = workouts.filter(
      w => new Date(w.completedAt!).getTime() >= sevenDaysAgo.getTime()
    )

    if (recentWorkouts.length === 0) {
      return res.json({
        score: 100,
        muscleRecovery: [],
        recommendation: 'Pleinement récupéré. Prêt pour une séance intense !'
      })
    }

    // Build per-muscle data: most recent workout date and volume
    const muscleData = new Map<string, { lastDate: Date; totalVolume: number }>()

    for (const w of workouts) {
      const workoutDate = new Date(w.completedAt!)
      if (w.exercises) {
        for (const ex of w.exercises) {
          const muscles: string[] = []
          const lib = ex.exerciseLibrary
          if (lib?.primaryMuscle) muscles.push(lib.primaryMuscle)
          if (lib?.muscleGroups) {
            for (const m of lib.muscleGroups) {
              if (!muscles.includes(m)) muscles.push(m)
            }
          }
          // Fallback: if no muscle info, skip
          if (muscles.length === 0) continue

          // Calculate volume for this exercise
          let exVolume = 0
          if (ex.sets) {
            for (const s of ex.sets) {
              exVolume += (s.weight || 0) * (s.reps || 0)
            }
          }

          for (const muscle of muscles) {
            const existing = muscleData.get(muscle)
            if (!existing || workoutDate.getTime() > existing.lastDate.getTime()) {
              muscleData.set(muscle, {
                lastDate: workoutDate,
                totalVolume: exVolume
              })
            } else if (workoutDate.getTime() === existing.lastDate.getTime()) {
              existing.totalVolume += exVolume
            }
          }
        }
      }
    }

    // Calculate recovery score per muscle group
    const muscleRecovery: { muscle: string; score: number; daysSince: number; lastVolume: number }[] = []

    for (const [muscle, data] of muscleData) {
      const daysSince = Math.floor(
        (now.getTime() - data.lastDate.getTime()) / 86400000
      )

      // Volume factor: higher volume means slower recovery
      // Normalize volume: consider >5000 kg as high volume
      const volumeFactor = Math.min(data.totalVolume / 5000, 1) // 0 to 1

      let score: number
      if (daysSince <= 1) {
        // 0-1 days ago: 20-40% (lower end if high volume)
        score = 40 - 20 * volumeFactor
      } else if (daysSince === 2) {
        // 2 days ago: 50-70%
        score = 70 - 20 * volumeFactor
      } else if (daysSince === 3) {
        // 3 days ago: 70-90%
        score = 90 - 20 * volumeFactor
      } else {
        // 4+ days ago: 90-100%
        score = 100 - 10 * volumeFactor
      }

      score = Math.round(Math.max(0, Math.min(100, score)))

      muscleRecovery.push({
        muscle,
        score,
        daysSince,
        lastVolume: Math.round(data.totalVolume)
      })
    }

    // Sort by score ascending (least recovered first)
    muscleRecovery.sort((a, b) => a.score - b.score)

    // Overall score = average of all muscle group recovery scores
    const overallScore = muscleRecovery.length > 0
      ? Math.round(muscleRecovery.reduce((sum, m) => sum + m.score, 0) / muscleRecovery.length)
      : 100

    // Recommendation in French
    let recommendation: string
    if (overallScore >= 90) {
      recommendation = 'Pleinement récupéré. Prêt pour une séance intense !'
    } else if (overallScore >= 70) {
      recommendation = 'Bonne récupération. Vous pouvez vous entraîner normalement.'
    } else if (overallScore >= 50) {
      recommendation = 'Récupération partielle. Privilégiez les groupes musculaires reposés.'
    } else {
      recommendation = 'Fatigue musculaire. Un jour de repos serait bénéfique.'
    }

    res.json({
      score: overallScore,
      muscleRecovery,
      recommendation
    })
  } catch (error) {
    console.error('Recovery error:', error)
    res.status(500).json({ error: 'Failed to fetch recovery data' })
  }
})

export default router
