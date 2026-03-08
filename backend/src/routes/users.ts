import express from 'express'
import { z } from 'zod'
import { AppDataSource } from '../config/database.js'
import { User } from '../entities/User.js'
import { authenticate, AuthRequest } from '../middlewares/auth.js'

const router = express.Router()
const userRepository = AppDataSource.getRepository(User)

// Get current user profile
router.get('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await userRepository.findOne({
      where: { id: req.user!.id },
      select: ['id', 'email', 'firstName', 'lastName', 'avatarUrl', 'goal', 'streakGoalPerWeek', 'bestStreak', 'reminderEnabled', 'reminderTime', 'inactivityThresholdDays', 'createdAt', 'updatedAt']
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json(user)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user profile' })
  }
})

// Update user profile
router.put('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    const updateSchema = z.object({
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      avatarUrl: z.string().url().optional(),
      goal: z.enum(['BULK', 'STRENGTH', 'RECOMP', 'CUT']).optional(),
      streakGoalPerWeek: z.number().int().min(1).max(7).optional(),
      reminderEnabled: z.boolean().optional(),
      reminderTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
      inactivityThresholdDays: z.number().int().min(1).max(14).optional()
    })

    const data = updateSchema.parse(req.body)

    await userRepository.update(req.user!.id, data as any)

    const user = await userRepository.findOne({
      where: { id: req.user!.id },
      select: ['id', 'email', 'firstName', 'lastName', 'avatarUrl', 'goal', 'streakGoalPerWeek', 'bestStreak', 'reminderEnabled', 'reminderTime', 'inactivityThresholdDays', 'updatedAt']
    })

    res.json(user)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors })
    }
    res.status(500).json({ error: 'Failed to update profile' })
  }
})

// Delete user account
router.delete('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    await userRepository.delete(req.user!.id)
    res.json({ message: 'Account deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete account' })
  }
})

export default router
