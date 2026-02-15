import express from 'express'
import { z } from 'zod'
import { prisma } from '../config/database.js'
import { authenticate, AuthRequest } from '../middlewares/auth.js'

const router = express.Router()

// Get current user profile
router.get('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        goal: true,
        createdAt: true,
        updatedAt: true
      }
    })

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

    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        goal: true,
        updatedAt: true
      }
    })

    res.json(user)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors })
    }
    res.status(500).json({ error: 'Failed to update profile' })
  }
})

export default router
