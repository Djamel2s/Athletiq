import express from 'express'
import { AppDataSource } from '../config/database.js'
import { authenticate, AuthRequest } from '../middlewares/auth.js'
import { FcmToken } from '../entities/FcmToken.js'

const router = express.Router()

// POST /api/fcm-tokens - Register/upsert a token
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { token, platform } = req.body
    const userId = req.user!.id

    if (!token || typeof token !== 'string') {
      return res.status(400).json({ error: 'Token is required' })
    }

    const repo = AppDataSource.getRepository(FcmToken)

    // Check if token already exists
    const existing = await repo.findOne({ where: { token } })

    if (existing) {
      // Update ownership if token belongs to a different user
      existing.userId = userId
      existing.platform = platform || existing.platform
      await repo.save(existing)
    } else {
      const fcmToken = repo.create({
        userId,
        token,
        platform: platform || 'android'
      })
      await repo.save(fcmToken)
    }

    res.json({ message: 'Token registered' })
  } catch (error) {
    console.error('[FCM Tokens] Register error:', error)
    res.status(500).json({ error: 'Failed to register token' })
  }
})

// DELETE /api/fcm-tokens - Remove a token (logout)
router.delete('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { token } = req.body

    if (!token || typeof token !== 'string') {
      return res.status(400).json({ error: 'Token is required' })
    }

    const repo = AppDataSource.getRepository(FcmToken)
    await repo.delete({ token, userId: req.user!.id })

    res.json({ message: 'Token removed' })
  } catch (error) {
    console.error('[FCM Tokens] Delete error:', error)
    res.status(500).json({ error: 'Failed to remove token' })
  }
})

export default router
