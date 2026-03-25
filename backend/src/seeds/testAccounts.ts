import bcrypt from 'bcrypt'
import { AppDataSource } from '../config/database.js'
import { User, Goal } from '../entities/User.js'
import { Workout } from '../entities/Workout.js'
import { Exercise } from '../entities/Exercise.js'
import { Set } from '../entities/Set.js'
import { BodyStat } from '../entities/BodyStat.js'
import { Measurement } from '../entities/Measurement.js'
import { ExerciseLibrary } from '../entities/ExerciseLibrary.js'
import { UserGoal } from '../entities/UserGoal.js'
import { Notification, NotificationType } from '../entities/Notification.js'
import { Subscription, SubscriptionPlan, SubscriptionStatus } from '../entities/Subscription.js'
import { UserAchievement } from '../entities/Achievement.js'

// ──────────────── Helpers ────────────────

function daysAgo(n: number): Date {
  const d = new Date()
  d.setDate(d.getDate() - n)
  d.setHours(0, 0, 0, 0)
  return d
}

function rand(min: number, max: number) {
  return Math.round((Math.random() * (max - min) + min) * 10) / 10
}

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// ──────────────── Workout Templates ────────────────

interface WorkoutTemplate {
  name: string
  exercises: { name: string; sets: number; repsRange: [number, number]; weightRange: [number, number] }[]
}

const PUSH: WorkoutTemplate = {
  name: 'Push Day',
  exercises: [
    { name: 'Développé couché', sets: 4, repsRange: [6, 10], weightRange: [60, 90] },
    { name: 'Développé incliné haltères', sets: 3, repsRange: [8, 12], weightRange: [20, 34] },
    { name: 'Écarté poulie', sets: 3, repsRange: [10, 15], weightRange: [10, 20] },
    { name: 'Développé militaire', sets: 3, repsRange: [6, 10], weightRange: [30, 50] },
    { name: 'Élévations latérales', sets: 3, repsRange: [12, 15], weightRange: [8, 14] },
    { name: 'Extension triceps poulie', sets: 3, repsRange: [10, 15], weightRange: [20, 35] },
  ]
}

const PULL: WorkoutTemplate = {
  name: 'Pull Day',
  exercises: [
    { name: 'Rowing barre', sets: 4, repsRange: [6, 10], weightRange: [50, 80] },
    { name: 'Tractions', sets: 4, repsRange: [6, 12], weightRange: [0, 0] },
    { name: 'Tirage visage', sets: 3, repsRange: [12, 20], weightRange: [10, 20] },
    { name: 'Curl barre', sets: 3, repsRange: [8, 12], weightRange: [20, 35] },
    { name: 'Curl marteau', sets: 3, repsRange: [10, 12], weightRange: [10, 18] },
  ]
}

const LEGS: WorkoutTemplate = {
  name: 'Leg Day',
  exercises: [
    { name: 'Squat', sets: 4, repsRange: [5, 10], weightRange: [70, 120] },
    { name: 'Soulevé de terre roumain', sets: 3, repsRange: [8, 12], weightRange: [60, 90] },
    { name: 'Presse à cuisses', sets: 3, repsRange: [8, 12], weightRange: [100, 200] },
    { name: 'Curl ischio-jambiers', sets: 3, repsRange: [10, 15], weightRange: [30, 50] },
    { name: 'Mollets debout', sets: 4, repsRange: [12, 20], weightRange: [40, 80] },
  ]
}

const UPPER: WorkoutTemplate = {
  name: 'Upper Body',
  exercises: [
    { name: 'Développé couché', sets: 4, repsRange: [6, 10], weightRange: [50, 75] },
    { name: 'Rowing barre', sets: 4, repsRange: [6, 10], weightRange: [40, 65] },
    { name: 'Développé militaire', sets: 3, repsRange: [8, 10], weightRange: [25, 40] },
    { name: 'Tractions', sets: 3, repsRange: [6, 12], weightRange: [0, 0] },
    { name: 'Élévations latérales', sets: 3, repsRange: [12, 15], weightRange: [6, 12] },
  ]
}

const LOWER: WorkoutTemplate = {
  name: 'Lower Body',
  exercises: [
    { name: 'Squat', sets: 4, repsRange: [6, 10], weightRange: [60, 100] },
    { name: 'Soulevé de terre roumain', sets: 3, repsRange: [8, 12], weightRange: [50, 80] },
    { name: 'Presse à cuisses', sets: 3, repsRange: [10, 12], weightRange: [80, 160] },
    { name: 'Curl ischio-jambiers', sets: 3, repsRange: [10, 15], weightRange: [25, 45] },
    { name: 'Mollets debout', sets: 4, repsRange: [12, 20], weightRange: [30, 60] },
  ]
}

const FULL_BODY: WorkoutTemplate = {
  name: 'Full Body',
  exercises: [
    { name: 'Squat', sets: 3, repsRange: [6, 10], weightRange: [60, 90] },
    { name: 'Développé couché', sets: 3, repsRange: [6, 10], weightRange: [50, 70] },
    { name: 'Rowing barre', sets: 3, repsRange: [8, 10], weightRange: [40, 60] },
    { name: 'Développé militaire', sets: 3, repsRange: [8, 10], weightRange: [25, 35] },
    { name: 'Soulevé de terre roumain', sets: 3, repsRange: [8, 12], weightRange: [50, 70] },
  ]
}

const PPL_ROTATION = [PUSH, PULL, LEGS, PUSH, PULL, LEGS]
const UL_ROTATION = [UPPER, LOWER, UPPER, LOWER]

// ──────────────── Account Profiles ────────────────

interface AccountProfile {
  email: string
  firstName: string
  lastName: string
  gender: 'male' | 'female'
  goal: Goal
  historyDays: number
  startWeight: number
  weightTrend: number // kg/week: positive = bulk, negative = cut
  startBodyFat: number
  subscription: {
    plan: SubscriptionPlan
    status: SubscriptionStatus
  }
  rotation: WorkoutTemplate[]
  trainingFrequency: number // days per week
  isAdmin?: boolean
  maxedOut?: boolean // hit all free limits
  streakGoalPerWeek?: number
  bestStreak?: number
}

const ACCOUNTS: AccountProfile[] = [
  // ═══════ PREMIUM ACCOUNTS (5) ═══════
  {
    email: 'demo2@athletiq.fr',
    firstName: 'Emma', lastName: 'Dubois', gender: 'female', goal: Goal.CUT,
    historyDays: 60, startWeight: 65, weightTrend: -0.15, startBodyFat: 24,
    subscription: { plan: SubscriptionPlan.YEARLY, status: SubscriptionStatus.ACTIVE },
    rotation: PPL_ROTATION, trainingFrequency: 5,
    streakGoalPerWeek: 5, bestStreak: 6,
  },
  {
    email: 'partner1@athletiq.fr',
    firstName: 'Hugo', lastName: 'Bernard', gender: 'male', goal: Goal.STRENGTH,
    historyDays: 90, startWeight: 88, weightTrend: 0.1, startBodyFat: 18,
    subscription: { plan: SubscriptionPlan.MONTHLY, status: SubscriptionStatus.ACTIVE },
    rotation: UL_ROTATION, trainingFrequency: 4,
    streakGoalPerWeek: 4, bestStreak: 10,
  },
  {
    email: 'partner2@athletiq.fr',
    firstName: 'Chloé', lastName: 'Petit', gender: 'female', goal: Goal.RECOMP,
    historyDays: 60, startWeight: 58, weightTrend: 0.05, startBodyFat: 22,
    subscription: { plan: SubscriptionPlan.YEARLY, status: SubscriptionStatus.ACTIVE },
    rotation: PPL_ROTATION, trainingFrequency: 5,
    streakGoalPerWeek: 4, bestStreak: 7,
  },
  {
    email: 'partner3@athletiq.fr',
    firstName: 'Raphaël', lastName: 'Moreau', gender: 'male', goal: Goal.BULK,
    historyDays: 30, startWeight: 72, weightTrend: 0.3, startBodyFat: 14,
    subscription: { plan: SubscriptionPlan.MONTHLY, status: SubscriptionStatus.ACTIVE },
    rotation: PPL_ROTATION, trainingFrequency: 6,
    streakGoalPerWeek: 5, bestStreak: 4,
  },
  {
    email: 'partner4@athletiq.fr',
    firstName: 'Inès', lastName: 'Robert', gender: 'female', goal: Goal.STRENGTH,
    historyDays: 45, startWeight: 62, weightTrend: 0.05, startBodyFat: 20,
    subscription: { plan: SubscriptionPlan.MONTHLY, status: SubscriptionStatus.ACTIVE },
    rotation: UL_ROTATION, trainingFrequency: 4,
    streakGoalPerWeek: 3, bestStreak: 5,
  },

  // ═══════ FREE ACCOUNTS (5) ═══════
  {
    email: 'free1@athletiq.fr',
    firstName: 'Sarah', lastName: 'Leroy', gender: 'female', goal: Goal.CUT,
    historyDays: 14, startWeight: 70, weightTrend: -0.2, startBodyFat: 26,
    subscription: { plan: SubscriptionPlan.FREE, status: SubscriptionStatus.EXPIRED },
    rotation: [FULL_BODY, FULL_BODY, FULL_BODY], trainingFrequency: 3,
  },
  {
    email: 'free2@athletiq.fr',
    firstName: 'Théo', lastName: 'Roux', gender: 'male', goal: Goal.BULK,
    historyDays: 7, startWeight: 68, weightTrend: 0.3, startBodyFat: 16,
    subscription: { plan: SubscriptionPlan.FREE_TRIAL, status: SubscriptionStatus.TRIAL },
    rotation: PPL_ROTATION, trainingFrequency: 4,
  },
  {
    email: 'free3@athletiq.fr',
    firstName: 'Léa', lastName: 'Fontaine', gender: 'female', goal: Goal.RECOMP,
    historyDays: 21, startWeight: 56, weightTrend: 0.0, startBodyFat: 23,
    subscription: { plan: SubscriptionPlan.FREE, status: SubscriptionStatus.EXPIRED },
    rotation: UL_ROTATION, trainingFrequency: 3,
  },
  {
    email: 'free4@athletiq.fr',
    firstName: 'Nathan', lastName: 'Garcia', gender: 'male', goal: Goal.STRENGTH,
    historyDays: 3, startWeight: 80, weightTrend: 0.0, startBodyFat: 19,
    subscription: { plan: SubscriptionPlan.FREE, status: SubscriptionStatus.EXPIRED },
    rotation: [FULL_BODY], trainingFrequency: 2,
  },
  {
    email: 'free5@athletiq.fr',
    firstName: 'Manon', lastName: 'Laurent', gender: 'female', goal: Goal.BULK,
    historyDays: 5, startWeight: 52, weightTrend: 0.2, startBodyFat: 20,
    subscription: { plan: SubscriptionPlan.FREE_TRIAL, status: SubscriptionStatus.TRIAL },
    rotation: [FULL_BODY, UPPER, LOWER], trainingFrequency: 3,
  },

  // ═══════ FREE MAXED — hits every paywall (1) ═══════
  {
    email: 'freefull@athletiq.fr',
    firstName: 'Maxime', lastName: 'Dupont', gender: 'male', goal: Goal.BULK,
    historyDays: 28, startWeight: 75, weightTrend: 0.25, startBodyFat: 17,
    subscription: { plan: SubscriptionPlan.FREE, status: SubscriptionStatus.EXPIRED },
    rotation: PPL_ROTATION, trainingFrequency: 4,
    maxedOut: true,
    streakGoalPerWeek: 3, bestStreak: 3,
  },
]

// ──────────────── Weight multiplier by gender ────────────────

function genderWeightFactor(gender: 'male' | 'female'): number {
  return gender === 'female' ? 0.55 : 1
}

// ──────────────── Main Seed ────────────────

export async function seedTestAccounts() {
  const userRepo = AppDataSource.getRepository(User)
  const workoutRepo = AppDataSource.getRepository(Workout)
  const exerciseRepo = AppDataSource.getRepository(Exercise)
  const setRepo = AppDataSource.getRepository(Set)
  const bodyStatRepo = AppDataSource.getRepository(BodyStat)
  const measurementRepo = AppDataSource.getRepository(Measurement)
  const exerciseLibraryRepo = AppDataSource.getRepository(ExerciseLibrary)
  const goalRepo = AppDataSource.getRepository(UserGoal)
  const notifRepo = AppDataSource.getRepository(Notification)
  const subRepo = AppDataSource.getRepository(Subscription)
  const achievementRepo = AppDataSource.getRepository(UserAchievement)

  // Load exercise library for linking
  const allLibExercises = await exerciseLibraryRepo.find()
  const libMap = new Map<string, number>()
  for (const ex of allLibExercises) libMap.set(ex.name, ex.id)

  const hashedPassword = await bcrypt.hash('Athletiq!Test2025', 12)

  for (const profile of ACCOUNTS) {
    // ── Skip if already exists ──
    const existing = await userRepo.findOne({ where: { email: profile.email } })
    if (existing) {
      console.log(`  Skipping ${profile.email} (already exists)`)
      continue
    }

    // ── Create user ──
    const user = userRepo.create({
      email: profile.email,
      password: hashedPassword,
      firstName: profile.firstName,
      lastName: profile.lastName,
      gender: profile.gender,
      goal: profile.goal,
      isAdmin: profile.isAdmin || false,
      emailVerified: true,
      streakGoalPerWeek: profile.streakGoalPerWeek || 3,
      bestStreak: profile.bestStreak || 0,
    })
    await userRepo.save(user)

    const wf = genderWeightFactor(profile.gender)

    // ── Subscription ──
    const now = new Date()
    const sub = subRepo.create({
      userId: user.id,
      plan: profile.subscription.plan,
      status: profile.subscription.status,
    })

    if (profile.subscription.status === SubscriptionStatus.ACTIVE) {
      const periodStart = new Date(now)
      periodStart.setDate(periodStart.getDate() - 15)
      const periodEnd = new Date(periodStart)
      periodEnd.setMonth(periodEnd.getMonth() + (profile.subscription.plan === SubscriptionPlan.YEARLY ? 12 : 1))
      sub.currentPeriodStart = periodStart
      sub.currentPeriodEnd = periodEnd
    } else if (profile.subscription.status === SubscriptionStatus.TRIAL) {
      sub.trialStartDate = daysAgo(profile.historyDays)
      sub.trialEndDate = daysAgo(profile.historyDays - 14)
    } else if (profile.subscription.status === SubscriptionStatus.EXPIRED) {
      sub.trialStartDate = daysAgo(profile.historyDays + 14)
      sub.trialEndDate = daysAgo(profile.historyDays)
    }
    await subRepo.save(sub)

    // ── Generate workouts ──
    const trainingDays: number[] = []
    for (let day = profile.historyDays; day >= 0; day--) {
      const weekDay = new Date(daysAgo(day)).getDay()
      if (weekDay === 0) continue // skip Sunday
      trainingDays.push(day)
    }

    // Keep only enough days for the desired frequency
    const maxWorkouts = Math.ceil(profile.historyDays / 7 * profile.trainingFrequency)
    const selectedDays = trainingDays
      .filter(() => Math.random() > 0.12) // ~12% skip
      .slice(0, maxWorkouts)

    let rotIndex = 0
    let workoutCount = 0
    const completedThisWeek: Date[] = []

    for (const dayOffset of selectedDays) {
      // For maxed free account: limit to 2 completed workouts per current week
      if (profile.maxedOut && dayOffset <= 7) {
        const weekStart = daysAgo(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1)
        const thisWeekCompleted = completedThisWeek.filter(d => d >= weekStart).length
        if (thisWeekCompleted >= 2) continue
      }

      const template = profile.rotation[rotIndex % profile.rotation.length]
      rotIndex++

      const workoutDate = daysAgo(dayOffset)
      workoutDate.setHours(randInt(7, 20), randInt(0, 59), 0, 0)
      const durationSec = randInt(3000, 5400)
      const startedAt = new Date(workoutDate)
      const completedAt = new Date(startedAt.getTime() + durationSec * 1000)

      let workoutVolume = 0

      const workout = workoutRepo.create({
        userId: user.id,
        name: template.name,
        date: workoutDate,
        startedAt,
        completedAt,
        duration: durationSec,
        totalVolume: 0,
      })
      await workoutRepo.save(workout)

      // Progressive overload
      const progress = 1 - (dayOffset / Math.max(profile.historyDays, 1)) * 0.08

      for (let eIdx = 0; eIdx < template.exercises.length; eIdx++) {
        const tmplEx = template.exercises[eIdx]

        const exercise = exerciseRepo.create({
          workoutId: workout.id,
          exerciseLibraryId: libMap.get(tmplEx.name) || undefined,
          name: tmplEx.name,
          orderIndex: eIdx,
          targetSets: tmplEx.sets,
          targetReps: tmplEx.repsRange[1],
          restTime: randInt(60, 150),
        })
        await exerciseRepo.save(exercise)

        for (let s = 1; s <= tmplEx.sets; s++) {
          const baseWeight = tmplEx.weightRange[0] + (tmplEx.weightRange[1] - tmplEx.weightRange[0]) * progress
          const weight = tmplEx.weightRange[1] === 0 ? 0 : Math.round(baseWeight * wf + rand(-2, 2))
          const reps = randInt(tmplEx.repsRange[0], tmplEx.repsRange[1])
          const fatigueReps = s <= 2 ? reps : Math.max(tmplEx.repsRange[0], reps - randInt(0, 2))

          const set = setRepo.create({
            exerciseId: exercise.id,
            setNumber: s,
            reps: fatigueReps,
            weight: Math.max(0, weight),
            rpe: s === tmplEx.sets ? randInt(8, 10) : randInt(6, 9),
          })
          await setRepo.save(set)
          workoutVolume += fatigueReps * Math.max(weight, 0)
        }
      }

      workout.totalVolume = Math.round(workoutVolume)
      await workoutRepo.save(workout)
      completedThisWeek.push(completedAt)
      workoutCount++
    }

    // ── Templates (maxed = 2, premium = 3, free = 1) ──
    const templateCount = profile.maxedOut ? 2 : (profile.subscription.status === SubscriptionStatus.ACTIVE ? 3 : 1)
    const templateTemplates = [PUSH, PULL, LEGS].slice(0, templateCount)

    for (const tmpl of templateTemplates) {
      const tw = workoutRepo.create({
        userId: user.id,
        name: tmpl.name,
        isTemplate: true,
        date: new Date(),
      })
      await workoutRepo.save(tw)

      for (let i = 0; i < tmpl.exercises.length; i++) {
        const ex = tmpl.exercises[i]
        await exerciseRepo.save(exerciseRepo.create({
          workoutId: tw.id,
          exerciseLibraryId: libMap.get(ex.name) || undefined,
          name: ex.name,
          orderIndex: i,
          targetSets: ex.sets,
          targetReps: ex.repsRange[1],
          targetWeight: Math.round((ex.weightRange[0] + ex.weightRange[1]) / 2 * wf),
          restTime: 120,
        }))
      }
    }

    // ── Body Stats ──
    let w = profile.startWeight
    for (let day = profile.historyDays; day >= 0; day -= randInt(2, 5)) {
      w += profile.weightTrend / 3.5 + rand(-0.15, 0.15)
      const bf = profile.startBodyFat + (profile.historyDays - day) * (profile.weightTrend < 0 ? -0.03 : 0.01) + rand(-0.3, 0.3)

      await bodyStatRepo.save(bodyStatRepo.create({
        userId: user.id,
        date: daysAgo(day),
        weight: Math.round(w * 10) / 10,
        bodyFat: Math.round(Math.max(8, bf) * 10) / 10,
      }))
    }

    // ── Measurements (every ~2 weeks) ──
    let ch = profile.gender === 'female' ? 85 : 98
    let wa = profile.gender === 'female' ? 68 : 82
    let hi = profile.gender === 'female' ? 94 : 96
    let bi = profile.gender === 'female' ? 27 : 35
    let th = profile.gender === 'female' ? 54 : 58
    let ca = profile.gender === 'female' ? 34 : 37

    for (let day = profile.historyDays; day >= 0; day -= randInt(12, 18)) {
      ch += rand(0.05, 0.3)
      bi += rand(0.02, 0.15)
      th += rand(0.05, 0.25)
      ca += rand(0, 0.08)
      wa += profile.weightTrend < 0 ? rand(-0.2, 0) : rand(-0.05, 0.1)
      hi += rand(0, 0.1)

      await measurementRepo.save(measurementRepo.create({
        userId: user.id,
        date: daysAgo(day),
        chest: Math.round(ch * 10) / 10,
        waist: Math.round(wa * 10) / 10,
        hips: Math.round(hi * 10) / 10,
        biceps: Math.round(bi * 10) / 10,
        thighs: Math.round(th * 10) / 10,
        calves: Math.round(ca * 10) / 10,
      }))
    }

    // ── Goals (maxed = exactly 1, premium = 3-4, free = 1) ──
    const goalCount = profile.maxedOut ? 1 : (profile.subscription.status === SubscriptionStatus.ACTIVE ? randInt(3, 4) : 1)
    const possibleGoals = [
      { type: 'PR' as const, title: 'Développé couché 80kg', targetValue: 80, startValue: 50, exerciseName: 'Développé couché' },
      { type: 'PR' as const, title: 'Squat 120kg', targetValue: 120, startValue: 70, exerciseName: 'Squat' },
      { type: 'WEIGHT' as const, title: `Atteindre ${Math.round(profile.startWeight + 5)}kg`, targetValue: Math.round(profile.startWeight + 5), startValue: profile.startWeight },
      { type: 'BODY_FAT' as const, title: 'Body fat sous 15%', targetValue: 15, startValue: profile.startBodyFat },
    ]

    for (let i = 0; i < goalCount && i < possibleGoals.length; i++) {
      const g = possibleGoals[i]
      await goalRepo.save(goalRepo.create({
        userId: user.id,
        type: g.type as any,
        title: g.title,
        targetValue: g.targetValue * wf,
        startValue: g.startValue * wf,
        exerciseName: g.exerciseName || undefined,
        deadline: daysAgo(-60),
      }))
    }

    // ── Notifications ──
    if (profile.historyDays >= 7) {
      const notifs = [
        { type: NotificationType.STREAK_MILESTONE, title: 'Série de 1 semaine !', message: `${profile.firstName}, tu t'entraînes régulièrement depuis 1 semaine.`, daysAgo: Math.min(7, profile.historyDays) },
      ]
      if (profile.historyDays >= 28) {
        notifs.push({ type: NotificationType.PR_ACHIEVED, title: 'Nouveau record !', message: 'Tu as battu ton record sur un exercice.', daysAgo: randInt(5, 20) })
        notifs.push({ type: NotificationType.STREAK_MILESTONE, title: 'Série de 4 semaines !', message: '4 semaines consécutives, bravo !', daysAgo: 1 })
      }
      if (profile.historyDays >= 60) {
        notifs.push({ type: NotificationType.GOAL_PROGRESS, title: 'Progression !', message: 'Tu approches de ton objectif.', daysAgo: 3 })
      }

      for (const n of notifs) {
        await notifRepo.save(notifRepo.create({
          userId: user.id,
          type: n.type,
          title: n.title,
          message: n.message,
          read: n.daysAgo > 5,
          createdAt: daysAgo(n.daysAgo),
        }))
      }
    }

    // ── Achievements (based on seniority) ──
    const achievementIds: string[] = ['first_workout']
    if (workoutCount >= 10) achievementIds.push('workouts_10')
    if (workoutCount >= 25) achievementIds.push('workouts_25')
    if (workoutCount >= 50) achievementIds.push('workouts_50')
    if (profile.historyDays >= 7) achievementIds.push('streak_1_week')
    if (profile.historyDays >= 30) achievementIds.push('streak_4_weeks')
    if (profile.historyDays >= 60) achievementIds.push('streak_8_weeks')

    for (const aId of achievementIds) {
      await achievementRepo.save(achievementRepo.create({
        userId: user.id,
        achievementId: aId,
      }))
    }

    const subLabel = `${profile.subscription.plan}/${profile.subscription.status}`
    console.log(`  ✅ ${profile.email} (${profile.firstName} ${profile.lastName}) — ${workoutCount} workouts, ${subLabel}${profile.maxedOut ? ' [MAXED]' : ''}`)
  }
}
