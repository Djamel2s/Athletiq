import express from 'express'
import { authenticate, AuthRequest } from '../middlewares/auth.js'
import analyticsService from '../services/analyticsService.js'

const router = express.Router()

// Get latest fatigue for authenticated user
router.get('/fatigue/latest', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id
    const latest = await analyticsService.getLatestFatigueForUser(userId)
    if (!latest) return res.status(404).json({ error: 'No fatigue data' })
    res.json(latest)
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch fatigue' })
  }
})

// Admin-only: trigger compute for all users (for testing); in prod this should be scheduled
router.post('/compute/all', authenticate, async (req: AuthRequest, res) => {
  try {
    // TODO: restrict to admin; for now allow
    const results = await analyticsService.computeForAllUsers()
    res.json({ computed: results.length })
  } catch (e) {
    res.status(500).json({ error: 'Failed to compute analytics' })
  }
})

export default router
