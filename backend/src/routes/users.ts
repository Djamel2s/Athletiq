import express from 'express'
import multer from 'multer'
import { z } from 'zod'
import cloudinary from '../config/cloudinary.js'
import { AppDataSource } from '../config/database.js'
import { User } from '../entities/User.js'
import { authenticate, AuthRequest } from '../middlewares/auth.js'

const router = express.Router()
const userRepository = AppDataSource.getRepository(User)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB max
})

// Get current user profile
router.get('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await userRepository.findOne({
      where: { id: req.user!.id },
      select: ['id', 'email', 'firstName', 'lastName', 'avatarUrl', 'goal', 'gender', 'streakGoalPerWeek', 'bestStreak', 'reminderEnabled', 'reminderTime', 'inactivityThresholdDays', 'createdAt', 'updatedAt']
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
      firstName: z.string().nullish(),
      lastName: z.string().nullish(),
      avatarUrl: z.string().url().nullish(),
      goal: z.enum(['BULK', 'STRENGTH', 'RECOMP', 'CUT']).nullish(),
      gender: z.enum(['male', 'female']).nullish(),
      streakGoalPerWeek: z.number().int().min(1).max(7).nullish(),
      reminderEnabled: z.boolean().nullish(),
      reminderTime: z.string().regex(/^\d{2}:\d{2}$/).nullish(),
      inactivityThresholdDays: z.number().int().min(1).max(14).nullish()
    })

    const data = updateSchema.parse(req.body)

    await userRepository.update(req.user!.id, data as any)

    const user = await userRepository.findOne({
      where: { id: req.user!.id },
      select: ['id', 'email', 'firstName', 'lastName', 'avatarUrl', 'goal', 'gender', 'streakGoalPerWeek', 'bestStreak', 'reminderEnabled', 'reminderTime', 'inactivityThresholdDays', 'updatedAt']
    })

    res.json(user)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors })
    }
    res.status(500).json({ error: 'Failed to update profile' })
  }
})

// Upload avatar
router.post('/me/avatar', authenticate, upload.single('avatar'), async (req: AuthRequest, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' })
    }

    // Delete old avatar from Cloudinary if exists
    const currentUser = await userRepository.findOne({ where: { id: req.user!.id }, select: ['avatarUrl'] })
    if (currentUser?.avatarUrl) {
      const parts = currentUser.avatarUrl.split('/')
      const folderAndFile = parts.slice(parts.indexOf('athletiq')).join('/')
      const publicId = folderAndFile.replace(/\.[^.]+$/, '')
      await cloudinary.uploader.destroy(publicId).catch(() => {})
    }

    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'athletiq/avatars',
          transformation: [
            { width: 400, height: 400, crop: 'fill', gravity: 'face' },
            { quality: 'auto', fetch_format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      )
      uploadStream.end(req.file!.buffer)
    })

    await userRepository.update(req.user!.id, { avatarUrl: result.secure_url })

    const user = await userRepository.findOne({
      where: { id: req.user!.id },
      select: ['id', 'email', 'firstName', 'lastName', 'avatarUrl', 'goal', 'gender']
    })

    res.json(user)
  } catch (error) {
    console.error('Avatar upload error:', error)
    res.status(500).json({ error: 'Failed to upload avatar' })
  }
})

// Delete avatar
router.delete('/me/avatar', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await userRepository.findOne({ where: { id: req.user!.id }, select: ['id', 'avatarUrl'] })
    if (!user?.avatarUrl) {
      return res.status(400).json({ error: 'No avatar to delete' })
    }

    // Delete from Cloudinary
    const parts = user.avatarUrl.split('/')
    const folderAndFile = parts.slice(parts.indexOf('athletiq')).join('/')
    const publicId = folderAndFile.replace(/\.[^.]+$/, '')
    await cloudinary.uploader.destroy(publicId).catch(() => {})

    // Remove from DB
    await userRepository.update(req.user!.id, { avatarUrl: null as any })

    res.json({ message: 'Avatar deleted' })
  } catch (error) {
    console.error('Avatar delete error:', error)
    res.status(500).json({ error: 'Failed to delete avatar' })
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
