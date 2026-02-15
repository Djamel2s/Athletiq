import express from 'express'
import multer from 'multer'
import cloudinary from '../config/cloudinary.js'
// import { prisma } from '../config/database.js' // TODO: Migrer vers TypeORM
import { authenticate, AuthRequest } from '../middlewares/auth.js'

const router = express.Router()

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB max
})

// Upload photo to workout
router.post(
  '/workout/:workoutId',
  authenticate,
  upload.single('photo'),
  async (req: AuthRequest, res) => {
    try {
      const { workoutId } = req.params
      const { isPrimary } = req.body

      if (!req.file) {
        return res.status(400).json({ error: 'No photo provided' })
      }

      // Verify workout belongs to user
      const workout = await prisma.workout.findFirst({
        where: {
          id: parseInt(workoutId),
          userId: req.user!.id
        }
      })

      if (!workout) {
        return res.status(404).json({ error: 'Workout not found' })
      }

      // If primary photo, remove previous primary flag
      if (isPrimary === 'true') {
        await prisma.workoutPhoto.updateMany({
          where: { workoutId: parseInt(workoutId) },
          data: { isPrimary: false }
        })
      }

      // Upload to Cloudinary
      const result: any = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: `athletiq/workouts/${workoutId}`,
            transformation: [
              { width: 1200, height: 1200, crop: 'limit' },
              { quality: 'auto:good' }
            ]
          },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          }
        )
        uploadStream.end(req.file!.buffer)
      })

      // Save to database
      const photo = await prisma.workoutPhoto.create({
        data: {
          workoutId: parseInt(workoutId),
          photoUrl: result.secure_url,
          isPrimary: isPrimary === 'true'
        }
      })

      res.status(201).json(photo)
    } catch (error) {
      console.error('Upload error:', error)
      res.status(500).json({ error: 'Failed to upload photo' })
    }
  }
)

// Get timelapse photos
router.get('/timelapse', authenticate, async (req: AuthRequest, res) => {
  try {
    const { startDate, endDate } = req.query

    const photos = await prisma.workoutPhoto.findMany({
      where: {
        isPrimary: true,
        workout: {
          userId: req.user!.id,
          date: {
            gte: startDate ? new Date(startDate as string) : undefined,
            lte: endDate ? new Date(endDate as string) : undefined
          }
        }
      },
      include: {
        workout: {
          select: {
            date: true,
            name: true
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    })

    res.json(photos)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch timelapse photos' })
  }
})

// Delete photo
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const photo = await prisma.workoutPhoto.findFirst({
      where: {
        id: parseInt(req.params.id),
        workout: {
          userId: req.user!.id
        }
      }
    })

    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' })
    }

    await prisma.workoutPhoto.delete({
      where: { id: parseInt(req.params.id) }
    })

    res.json({ message: 'Photo deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete photo' })
  }
})

export default router
