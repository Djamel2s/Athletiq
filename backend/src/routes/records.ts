import express from 'express'
import { AppDataSource } from '../config/database.js'
import { authenticate, AuthRequest } from '../middlewares/auth.js'

const router = express.Router()

// Get personal records (max weight per exercise)
router.get('/personal', authenticate, async (req: AuthRequest, res) => {
  try {
    const records = await AppDataSource.query(`
      SELECT DISTINCT ON (e.name)
        e.name AS "exerciseName",
        e."exerciseLibraryId" AS "exerciseId",
        s.weight AS "maxWeight",
        s.reps,
        w.date,
        w.id AS "workoutId"
      FROM sets s
      INNER JOIN exercises e ON s."exerciseId" = e.id
      INNER JOIN workouts w ON e."workoutId" = w.id
      WHERE w."userId" = $1
        AND w."completedAt" IS NOT NULL
        AND s.weight > 0
      ORDER BY e.name, s.weight DESC, s.reps DESC
    `, [req.user!.id])

    res.json(records)
  } catch (error) {
    console.error('Records error:', error)
    res.status(500).json({ error: 'Failed to fetch personal records' })
  }
})

export default router
