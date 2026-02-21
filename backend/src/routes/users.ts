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
      select: ['id', 'email', 'firstName', 'lastName', 'avatarUrl', 'goal', 'createdAt', 'updatedAt']
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
      goal: z.enum(['BULK', 'STRENGTH', 'RECOMP', 'CUT']).optional()
    })

    const data = updateSchema.parse(req.body)

    await userRepository.update(req.user!.id, data)

    const user = await userRepository.findOne({
      where: { id: req.user!.id },
      select: ['id', 'email', 'firstName', 'lastName', 'avatarUrl', 'goal', 'updatedAt']
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
