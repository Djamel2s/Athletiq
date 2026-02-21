import express from 'express'
import { z } from 'zod'
import { AppDataSource } from '../config/database.js'
import { authenticate, AuthRequest } from '../middlewares/auth.js'
import { UserGoal, GoalType } from '../entities/UserGoal.js'
import { BodyStat } from '../entities/BodyStat.js'

const router = express.Router()

const createGoalSchema = z.object({
  type: z.nativeEnum(GoalType),
  title: z.string().min(1).max(100),
  targetValue: z.number().positive(),
  startValue: z.number().min(0),
  exerciseName: z.string().optional(),
  exerciseLibraryId: z.number().optional(),
  deadline: z.string().optional()
})

const updateGoalSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  targetValue: z.number().positive().optional(),
  deadline: z.string().nullable().optional()
})

// Helper: calculate current value for a goal
async function calculateCurrentValue(goal: UserGoal): Promise<number> {
  const repo = AppDataSource

  switch (goal.type) {
    case GoalType.WEIGHT: {
      const latest = await repo.getRepository(BodyStat).findOne({
        where: { userId: goal.userId },
        order: { date: 'DESC' }
      })
      return latest?.weight ?? goal.startValue
    }
    case GoalType.BODY_FAT: {
      const latest = await repo.getRepository(BodyStat).findOne({
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
      order: { createdAt: 'DESC' }
    })

    const goalsWithProgress = await Promise.all(goals.map(async (goal) => {
      const currentValue = await calculateCurrentValue(goal)
      const progress = calculateProgress(goal.startValue, currentValue, goal.targetValue)
      return { ...goal, currentValue, progress }
    }))

    res.json(goalsWithProgress)
  } catch (error) {
    console.error('Goals fetch error:', error)
    res.status(500).json({ error: 'Failed to fetch goals' })
  }
})

// POST /api/goals - Create a goal
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const data = createGoalSchema.parse(req.body)
    const repo = AppDataSource.getRepository(UserGoal)

    const goal = repo.create({
      ...data,
      userId: req.user!.id,
      deadline: data.deadline ? new Date(data.deadline) : undefined
    })

    const saved = await repo.save(goal)
    const currentValue = await calculateCurrentValue(saved)
    const progress = calculateProgress(saved.startValue, currentValue, saved.targetValue)

    res.status(201).json({ ...saved, currentValue, progress })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.errors })
    }
    console.error('Goal create error:', error)
    res.status(500).json({ error: 'Failed to create goal' })
  }
})

// PUT /api/goals/:id - Update a goal
router.put('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const data = updateGoalSchema.parse(req.body)
    const repo = AppDataSource.getRepository(UserGoal)

    const goal = await repo.findOne({
      where: { id: parseInt(req.params.id), userId: req.user!.id }
    })

    if (!goal) return res.status(404).json({ error: 'Goal not found' })

    if (data.title !== undefined) goal.title = data.title
    if (data.targetValue !== undefined) goal.targetValue = data.targetValue
    if (data.deadline !== undefined) goal.deadline = data.deadline ? new Date(data.deadline) : undefined

    const saved = await repo.save(goal)
    const currentValue = await calculateCurrentValue(saved)
    const progress = calculateProgress(saved.startValue, currentValue, saved.targetValue)

    res.json({ ...saved, currentValue, progress })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.errors })
    }
    console.error('Goal update error:', error)
    res.status(500).json({ error: 'Failed to update goal' })
  }
})

// PUT /api/goals/:id/achieve - Mark as achieved
router.put('/:id/achieve', authenticate, async (req: AuthRequest, res) => {
  try {
    const repo = AppDataSource.getRepository(UserGoal)
    const goal = await repo.findOne({
      where: { id: parseInt(req.params.id), userId: req.user!.id }
    })

    if (!goal) return res.status(404).json({ error: 'Goal not found' })

    goal.achieved = true
    goal.achievedAt = new Date()

    const saved = await repo.save(goal)
    res.json(saved)
  } catch (error) {
    console.error('Goal achieve error:', error)
    res.status(500).json({ error: 'Failed to achieve goal' })
  }
})

// DELETE /api/goals/:id - Delete a goal
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const repo = AppDataSource.getRepository(UserGoal)
    const goal = await repo.findOne({
      where: { id: parseInt(req.params.id), userId: req.user!.id }
    })

    if (!goal) return res.status(404).json({ error: 'Goal not found' })

    await repo.remove(goal)
    res.json({ message: 'Goal deleted' })
  } catch (error) {
    console.error('Goal delete error:', error)
    res.status(500).json({ error: 'Failed to delete goal' })
  }
})

export default router
