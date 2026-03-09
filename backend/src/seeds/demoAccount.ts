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

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

// ──────────────── Workout Templates ────────────────

interface WorkoutTemplate {
  name: string
  exercises: { name: string; sets: number; repsRange: [number, number]; weightRange: [number, number] }[]
}

const PUSH_DAY: WorkoutTemplate = {
  name: 'Push Day',
  exercises: [
    { name: 'Développé couché', sets: 4, repsRange: [6, 10], weightRange: [60, 90] },
    { name: 'Développé incliné haltères', sets: 4, repsRange: [8, 12], weightRange: [20, 34] },
    { name: 'Écarté poulie', sets: 3, repsRange: [10, 15], weightRange: [10, 20] },
    { name: 'Développé militaire', sets: 4, repsRange: [6, 10], weightRange: [30, 50] },
    { name: 'Élévations latérales', sets: 3, repsRange: [12, 15], weightRange: [8, 14] },
    { name: 'Extension triceps poulie', sets: 3, repsRange: [10, 15], weightRange: [20, 35] },
  ]
}

const PULL_DAY: WorkoutTemplate = {
  name: 'Pull Day',
  exercises: [
    { name: 'Soulevé de terre', sets: 4, repsRange: [4, 8], weightRange: [80, 130] },
    { name: 'Rowing barre', sets: 4, repsRange: [6, 10], weightRange: [50, 80] },
    { name: 'Tractions', sets: 4, repsRange: [6, 12], weightRange: [0, 0] },
    { name: 'Tirage visage', sets: 3, repsRange: [12, 20], weightRange: [10, 20] },
    { name: 'Curl barre', sets: 3, repsRange: [8, 12], weightRange: [20, 35] },
    { name: 'Curl marteau', sets: 3, repsRange: [10, 12], weightRange: [10, 18] },
  ]
}

const LEG_DAY: WorkoutTemplate = {
  name: 'Leg Day',
  exercises: [
    { name: 'Squat', sets: 4, repsRange: [5, 10], weightRange: [70, 120] },
    { name: 'Soulevé de terre roumain', sets: 4, repsRange: [8, 12], weightRange: [60, 90] },
    { name: 'Presse à cuisses', sets: 4, repsRange: [8, 12], weightRange: [100, 200] },
    { name: 'Curl ischio-jambiers', sets: 3, repsRange: [10, 15], weightRange: [30, 50] },
    { name: 'Extension de jambes', sets: 3, repsRange: [10, 15], weightRange: [30, 50] },
    { name: 'Mollets debout', sets: 4, repsRange: [12, 20], weightRange: [40, 80] },
  ]
}

const UPPER_DAY: WorkoutTemplate = {
  name: 'Upper Body',
  exercises: [
    { name: 'Développé couché', sets: 4, repsRange: [6, 10], weightRange: [60, 85] },
    { name: 'Rowing barre', sets: 4, repsRange: [6, 10], weightRange: [50, 75] },
    { name: 'Développé militaire', sets: 3, repsRange: [8, 10], weightRange: [30, 45] },
    { name: 'Tractions', sets: 3, repsRange: [6, 12], weightRange: [0, 0] },
    { name: 'Dips', sets: 3, repsRange: [8, 15], weightRange: [0, 0] },
    { name: 'Élévations latérales', sets: 3, repsRange: [12, 15], weightRange: [8, 14] },
  ]
}

const FULL_BODY: WorkoutTemplate = {
  name: 'Full Body',
  exercises: [
    { name: 'Squat', sets: 3, repsRange: [6, 10], weightRange: [70, 100] },
    { name: 'Développé couché', sets: 3, repsRange: [6, 10], weightRange: [60, 80] },
    { name: 'Rowing barre', sets: 3, repsRange: [8, 10], weightRange: [50, 70] },
    { name: 'Développé militaire', sets: 3, repsRange: [8, 10], weightRange: [30, 40] },
    { name: 'Soulevé de terre roumain', sets: 3, repsRange: [8, 12], weightRange: [60, 80] },
  ]
}

const TEMPLATES = [PUSH_DAY, PULL_DAY, LEG_DAY, UPPER_DAY, FULL_BODY]

// PPL rotation for consistent training
const PPL_ROTATION = [PUSH_DAY, PULL_DAY, LEG_DAY, PUSH_DAY, PULL_DAY, LEG_DAY]

// ──────────────── Main Seed ────────────────

export async function seedDemoAccount() {
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

  // ── Check if demo user already exists ──
  const existingUser = await userRepo.findOne({ where: { email: 'demo@athletiq.app' } })
  if (existingUser) {
    // Delete all related data first
    console.log('  Cleaning existing demo data...')
    await subRepo.delete({ userId: existingUser.id })
    await workoutRepo.delete({ userId: existingUser.id })
    await bodyStatRepo.delete({ userId: existingUser.id })
    await measurementRepo.delete({ userId: existingUser.id })
    await goalRepo.delete({ userId: existingUser.id })
    await notifRepo.delete({ userId: existingUser.id })
    await userRepo.delete(existingUser.id)
  }

  // ── Create demo user ──
  console.log('  Creating demo user...')
  const hashedPassword = await bcrypt.hash('Athletiq!Demo2025', 10)
  const user = userRepo.create({
    email: 'demo@athletiq.app',
    password: hashedPassword,
    firstName: 'Alexandre',
    lastName: 'Martin',
    goal: Goal.BULK,
    streakGoalPerWeek: 4,
    bestStreak: 8,
    reminderEnabled: true,
    reminderTime: '18:00',
    inactivityThresholdDays: 3,
  })
  await userRepo.save(user)
  console.log(`  User created: demo@athletiq.app / Athletiq!Demo2025`)

  // ── Load exercise library for linking ──
  const allLibExercises = await exerciseLibraryRepo.find()
  const libMap = new Map<string, number>()
  for (const ex of allLibExercises) {
    libMap.set(ex.name, ex.id)
  }

  // ── Generate 90 days of workouts (4-5x/week) ──
  console.log('  Generating workouts over 90 days...')
  const TOTAL_DAYS = 90
  let workoutCount = 0
  let totalVolume = 0
  let pplIndex = 0

  // Build a training schedule: ~4-5 days/week with rest days
  // Pattern: train 3 days, rest 1, train 3 days, rest 1
  const trainingDays: number[] = []
  for (let day = TOTAL_DAYS; day >= 0; day--) {
    const cyclePos = day % 8
    // Train on positions 0,1,2,4,5,6 — rest on 3,7
    if (cyclePos !== 3 && cyclePos !== 7) {
      trainingDays.push(day)
    }
  }

  // Occasionally skip a day (realism: ~10% skip rate)
  const actualTrainingDays = trainingDays.filter(() => Math.random() > 0.1)

  // Progressive overload: weights increase ~2-5% per month
  const progressMultiplier = (daysAgoN: number) => {
    const monthsAgo = daysAgoN / 30
    return 1 - monthsAgo * 0.03 // 3% lighter per month ago
  }

  for (const dayOffset of actualTrainingDays) {
    const template = PPL_ROTATION[pplIndex % PPL_ROTATION.length]
    pplIndex++

    const workoutDate = daysAgo(dayOffset)
    workoutDate.setHours(randInt(7, 20), randInt(0, 59), 0, 0)

    const durationSec = randInt(3600, 5400) // 60-90min
    const startedAt = new Date(workoutDate)
    const completedAt = new Date(startedAt.getTime() + durationSec * 1000)

    let workoutVolume = 0

    // Create workout
    const workout = workoutRepo.create({
      userId: user.id,
      name: template.name,
      date: workoutDate,
      startedAt,
      completedAt,
      duration: durationSec,
      totalVolume: 0, // will update after
    })
    await workoutRepo.save(workout)

    // Create exercises + sets
    for (let eIdx = 0; eIdx < template.exercises.length; eIdx++) {
      const tmplEx = template.exercises[eIdx]
      const progress = progressMultiplier(dayOffset)

      const exercise = exerciseRepo.create({
        workoutId: workout.id,
        exerciseLibraryId: libMap.get(tmplEx.name) || undefined,
        name: tmplEx.name,
        orderIndex: eIdx,
        targetSets: tmplEx.sets,
        targetReps: tmplEx.repsRange[1],
        restTime: randInt(60, 180),
      })
      await exerciseRepo.save(exercise)

      // Create sets with slight variation
      for (let s = 1; s <= tmplEx.sets; s++) {
        const baseWeight = tmplEx.weightRange[0] + (tmplEx.weightRange[1] - tmplEx.weightRange[0]) * progress
        const weight = tmplEx.weightRange[1] === 0 ? 0 : Math.round(baseWeight + rand(-3, 3))
        const reps = randInt(tmplEx.repsRange[0], tmplEx.repsRange[1])
        // Slight fatigue on later sets
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

    // Update workout total volume
    workout.totalVolume = Math.round(workoutVolume)
    await workoutRepo.save(workout)

    totalVolume += workoutVolume
    workoutCount++
  }

  console.log(`  Created ${workoutCount} workouts (total volume: ${Math.round(totalVolume / 1000)}t)`)

  // ── Body Stats (weekly weigh-ins over 90 days) ──
  console.log('  Generating body stats...')
  let currentWeight = 78 // starting weight 3 months ago
  for (let day = TOTAL_DAYS; day >= 0; day -= randInt(3, 7)) {
    // Slow bulk: gain ~0.25kg/week
    currentWeight += rand(0.05, 0.15)
    const bodyFat = 15 - (TOTAL_DAYS - day) * 0.02 + rand(-0.3, 0.3) // slight recomp

    const stat = bodyStatRepo.create({
      userId: user.id,
      date: daysAgo(day),
      weight: Math.round(currentWeight * 10) / 10,
      bodyFat: Math.round(Math.max(10, bodyFat) * 10) / 10,
    })
    await bodyStatRepo.save(stat)
  }
  console.log(`  Final weight: ${currentWeight.toFixed(1)}kg`)

  // ── Measurements (every 2-3 weeks) ──
  console.log('  Generating measurements...')
  let chest = 98, waist = 82, hips = 96, biceps = 35, thighs = 58, calves = 37
  for (let day = TOTAL_DAYS; day >= 0; day -= randInt(14, 21)) {
    // Slow gains
    chest += rand(0.1, 0.4)
    biceps += rand(0.05, 0.2)
    thighs += rand(0.1, 0.3)
    calves += rand(0, 0.1)
    waist += rand(-0.1, 0.1) // stays stable (recomp)
    hips += rand(0, 0.15)

    const m = measurementRepo.create({
      userId: user.id,
      date: daysAgo(day),
      chest: Math.round(chest * 10) / 10,
      waist: Math.round(waist * 10) / 10,
      hips: Math.round(hips * 10) / 10,
      biceps: Math.round(biceps * 10) / 10,
      thighs: Math.round(thighs * 10) / 10,
      calves: Math.round(calves * 10) / 10,
    })
    await measurementRepo.save(m)
  }

  // ── Goals ──
  console.log('  Creating goals...')
  const goals = [
    { type: 'PR', title: 'Développé couché 100kg', targetValue: 100, startValue: 70, exerciseName: 'Développé couché', achieved: true, achievedAt: daysAgo(12) },
    { type: 'PR', title: 'Squat 140kg', targetValue: 140, startValue: 90, exerciseName: 'Squat', achieved: false },
    { type: 'PR', title: 'Soulevé de terre 160kg', targetValue: 160, startValue: 100, exerciseName: 'Soulevé de terre', achieved: false },
    { type: 'WEIGHT', title: 'Atteindre 82kg', targetValue: 82, startValue: 78, achieved: false },
    { type: 'BODY_FAT', title: 'Body fat sous 14%', targetValue: 14, startValue: 15, achieved: false },
  ]

  for (const g of goals) {
    const goal = goalRepo.create({
      userId: user.id,
      type: g.type as any,
      title: g.title,
      targetValue: g.targetValue,
      startValue: g.startValue,
      exerciseName: g.exerciseName || undefined,
      deadline: daysAgo(-60), // 60 days from now
      achieved: g.achieved,
      achievedAt: g.achievedAt || undefined,
    })
    await goalRepo.save(goal)
  }

  // ── Notifications ──
  console.log('  Creating notifications...')
  const notifications = [
    { type: NotificationType.PR_ACHIEVED, title: 'Nouveau record personnel !', message: 'Développé couché : 100kg - Bravo !', daysAgo: 12 },
    { type: NotificationType.STREAK_MILESTONE, title: 'Série de 4 semaines !', message: 'Vous vous entraînez depuis 4 semaines consécutives.', daysAgo: 28 },
    { type: NotificationType.STREAK_MILESTONE, title: 'Série de 8 semaines !', message: '8 semaines de suite, impressionnant !', daysAgo: 5 },
    { type: NotificationType.GOAL_ACHIEVED, title: 'Objectif atteint !', message: 'Développé couché 100kg - Objectif accompli !', daysAgo: 12 },
    { type: NotificationType.GOAL_PROGRESS, title: 'Progression Squat', message: 'Vous êtes à 85% de votre objectif Squat 140kg', daysAgo: 3 },
    { type: NotificationType.PR_ACHIEVED, title: 'Nouveau record !', message: 'Squat : 120kg', daysAgo: 8 },
    { type: NotificationType.PR_ACHIEVED, title: 'Nouveau record !', message: 'Soulevé de terre : 130kg', daysAgo: 15 },
  ]

  for (const n of notifications) {
    const notif = notifRepo.create({
      userId: user.id,
      type: n.type,
      title: n.title,
      message: n.message,
      read: n.daysAgo > 7, // older ones are read
      createdAt: daysAgo(n.daysAgo),
    })
    await notifRepo.save(notif)
  }

  // ── Create some workout templates ──
  console.log('  Creating workout templates...')
  for (const tmpl of [PUSH_DAY, PULL_DAY, LEG_DAY]) {
    const templateWorkout = workoutRepo.create({
      userId: user.id,
      name: tmpl.name,
      isTemplate: true,
      date: new Date(),
    })
    await workoutRepo.save(templateWorkout)

    for (let i = 0; i < tmpl.exercises.length; i++) {
      const ex = tmpl.exercises[i]
      const exercise = exerciseRepo.create({
        workoutId: templateWorkout.id,
        exerciseLibraryId: libMap.get(ex.name) || undefined,
        name: ex.name,
        orderIndex: i,
        targetSets: ex.sets,
        targetReps: ex.repsRange[1],
        targetWeight: Math.round((ex.weightRange[0] + ex.weightRange[1]) / 2),
        restTime: 120,
      })
      await exerciseRepo.save(exercise)
    }
  }

  // ── Subscription (Pro Monthly active) ──
  console.log('  Creating subscription...')
  const now = new Date()
  const periodStart = new Date(now)
  periodStart.setDate(periodStart.getDate() - 15) // mid-cycle
  const periodEnd = new Date(periodStart)
  periodEnd.setMonth(periodEnd.getMonth() + 1)

  const subscription = subRepo.create({
    userId: user.id,
    plan: SubscriptionPlan.MONTHLY,
    status: SubscriptionStatus.ACTIVE,
    trialStartDate: daysAgo(45),
    trialEndDate: daysAgo(38),
    currentPeriodStart: periodStart,
    currentPeriodEnd: periodEnd,
  })
  await subRepo.save(subscription)

  console.log('  Demo account seeded successfully!')
  console.log('  ────────────────────────────────')
  console.log('  Email:    demo@athletiq.app')
  console.log('  Password: Athletiq!Demo2025')
  console.log(`  Workouts: ${workoutCount}`)
  console.log('  ────────────────────────────────')
}
