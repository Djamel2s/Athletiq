import express from 'express'
import { z } from 'zod'
import { AppDataSource } from '../config/database.js'
import { authenticate, AuthRequest } from '../middlewares/auth.js'
import { UserGoal, GoalType } from '../entities/UserGoal.js'
import { BodyStat } from '../entities/BodyStat.js'
import { checkGoalLimit } from '../services/limitService.js'
import { parseId } from '../utils/validation.js'

const router = express.Router()

const createGoalSchema = z.object({
  type: z.nativeEnum(GoalType),
  title: z.string().min(1).max(100),
  targetValue: z.number().positive(),
  startValue: z.number().min(0),
  exerciseName: z.string().max(200).nullish(),
  exerciseLibraryId: z.number().nullish(),
  deadline: z.string().nullish()
})

const updateGoalSchema = z.object({
  title: z.string().min(1).max(100).nullish(),
  targetValue: z.number().positive().nullish(),
  deadline: z.string().nullish()
})

// Helper: calculate current value for a goal
async function calculateCurrentValue(goal: UserGoal, latestBodyStat?: BodyStat | null): Promise<number> {
  const repo = AppDataSource

  switch (goal.type) {
    case GoalType.WEIGHT: {
      const latest = latestBodyStat !== undefined ? latestBodyStat : await repo.getRepository(BodyStat).findOne({
        where: { userId: goal.userId },
        order: { date: 'DESC' }
      })
      return latest?.weight ?? goal.startValue
    }
    case GoalType.BODY_FAT: {
      const latest = latestBodyStat !== undefined ? latestBodyStat : await repo.getRepository(BodyStat).findOne({
        where: { userId: goal.userId },
        order: { date: 'DESC' }
      })
      return latest?.bodyFat ?? goal.startValue
    }
    case GoalType.PR: {
      if (!goal.exerciseName) return goal.startValue
      const result = await repo.query(`
        SELECT MAX(s.weight) as "maxWeight"
        FROM sets s
        INNER JOIN exercises e ON s."exerciseId" = e.id
        INNER JOIN workouts w ON e."workoutId" = w.id
        WHERE w."userId" = $1
          AND e.name = $2
          AND w."completedAt" IS NOT NULL
          AND s.weight > 0
      `, [goal.userId, goal.exerciseName])
      return result[0]?.maxWeight ?? goal.startValue
    }
    default:
      return goal.startValue
  }
}

function calculateProgress(startValue: number, currentValue: number, targetValue: number): number {
  const totalRange = Math.abs(targetValue - startValue)
  if (totalRange === 0) return currentValue === targetValue ? 100 : 0
  const progress = Math.abs(currentValue - startValue) / totalRange * 100
  return Math.min(Math.round(progress), 100)
}

// GET /api/goals - List all goals with calculated progress
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const goals = await AppDataSource.getRepository(UserGoal).find({
      where: { userId: req.user!.id },
      order: { createdAt: 'DESC' },
      take: 100
    })

    // Pre-fetch latest BodyStat once to avoid N+1 queries for WEIGHT/BODY_FAT goals
    const latestBodyStat = await AppDataSource.getRepository(BodyStat).findOne({
      where: { userId: req.user!.id },
      order: { date: 'DESC' }
    })

    // Pre-fetch all PR maxes in a single query to avoid N+1
    const prGoals = goals.filter(g => g.type === GoalType.PR && g.exerciseName)
    const prExerciseNames = [...new Set(prGoals.map(g => g.exerciseName!))]
    const prMaxMap = new Map<string, number>()

    if (prExerciseNames.length > 0) {
      const prResults: Array<{ name: string; maxWeight: number }> = await AppDataSource.query(`
        SELECT e.name, MAX(s.weight) as "maxWeight"
        FROM sets s
        INNER JOIN exercises e ON s."exerciseId" = e.id
        INNER JOIN workouts w ON e."workoutId" = w.id
        WHERE w."userId" = $1
          AND e.name = ANY($2)
          AND w."completedAt" IS NOT NULL
          AND s.weight > 0
        GROUP BY e.name
      `, [req.user!.id, prExerciseNames])
      for (const r of prResults) {
        prMaxMap.set(r.name, Number(r.maxWeight) || 0)
      }
    }

    const goalsWithProgress = await Promise.all(goals.map(async (goal) => {
      let currentValue: number
      if (goal.type === GoalType.PR && goal.exerciseName) {
        currentValue = prMaxMap.get(goal.exerciseName) ?? goal.startValue
      } else {
        currentValue = await calculateCurrentValue(goal, latestBodyStat)
      }
      const progress = calculateProgress(goal.startValue, currentValue, goal.targetValue)
      return { ...goal, currentValue, progress }
    }))

    res.json(goalsWithProgress)
  } catch (error) {
    console.error('Goals fetch error:', error)
    res.status(500).json({ error: 'Erreur lors de la récupération des objectifs' })
  }
})

// POST /api/goals - Create a goal
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    // Vérifier la limite d'objectifs
    const goalCheck = await checkGoalLimit(req.user!.id)
    if (!goalCheck.allowed) {
      return res.status(403).json({
        error: 'Limite atteinte',
        code: 'LIMIT_GOALS',
        current: goalCheck.current,
        limit: goalCheck.limit
      })
    }

    const data = createGoalSchema.parse(req.body)
    const repo = AppDataSource.getRepository(UserGoal)

    const goal = repo.create({
      type: data.type,
      title: data.title,
      targetValue: data.targetValue,
      startValue: data.startValue,
      exerciseName: data.exerciseName ?? undefined,
      exerciseLibraryId: data.exerciseLibraryId ?? undefined,
      userId: req.user!.id,
      deadline: data.deadline ? new Date(data.deadline) : undefined
    })

    const saved = await repo.save(goal)
    const currentValue = await calculateCurrentValue(saved)
    const progress = calculateProgress(saved.startValue, currentValue, saved.targetValue)

    res.status(201).json({ ...saved, currentValue, progress })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Erreur de validation', details: error.errors })
    }
    console.error('Goal create error:', error)
    res.status(500).json({ error: 'Erreur lors de la création de l\'objectif' })
  }
})

// PUT /api/goals/:id - Update a goal
router.put('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const data = updateGoalSchema.parse(req.body)
    const repo = AppDataSource.getRepository(UserGoal)

    const goal = await repo.findOne({
      where: { id: parseId(req.params.id), userId: req.user!.id }
    })

    if (!goal) return res.status(404).json({ error: 'Objectif non trouvé' })

    if (data.title != null) goal.title = data.title
    if (data.targetValue != null) goal.targetValue = data.targetValue
    if (data.deadline !== undefined) goal.deadline = data.deadline ? new Date(data.deadline) : undefined

    const saved = await repo.save(goal)
    const currentValue = await calculateCurrentValue(saved)
    const progress = calculateProgress(saved.startValue, currentValue, saved.targetValue)

    res.json({ ...saved, currentValue, progress })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Erreur de validation', details: error.errors })
    }
    console.error('Goal update error:', error)
    res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'objectif' })
  }
})

// PUT /api/goals/:id/achieve - Mark as achieved
router.put('/:id/achieve', authenticate, async (req: AuthRequest, res) => {
  try {
    const repo = AppDataSource.getRepository(UserGoal)
    const goal = await repo.findOne({
      where: { id: parseId(req.params.id), userId: req.user!.id }
    })

    if (!goal) return res.status(404).json({ error: 'Objectif non trouvé' })

    goal.achieved = true
    goal.achievedAt = new Date()

    const saved = await repo.save(goal)
    res.json(saved)
  } catch (error) {
    console.error('Goal achieve error:', error)
    res.status(500).json({ error: 'Erreur lors de la validation de l\'objectif' })
  }
})

// DELETE /api/goals/:id - Delete a goal
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const repo = AppDataSource.getRepository(UserGoal)
    const goal = await repo.findOne({
      where: { id: parseId(req.params.id), userId: req.user!.id }
    })

    if (!goal) return res.status(404).json({ error: 'Objectif non trouvé' })

    await repo.remove(goal)
    res.json({ message: 'Objectif supprimé' })
  } catch (error) {
    console.error('Goal delete error:', error)
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'objectif' })
  }
})

export default router
