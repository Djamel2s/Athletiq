import express from 'express'
import multer from 'multer'
import cloudinary from '../config/cloudinary.js'
import { AppDataSource } from '../config/database.js'
import { WorkoutPhoto } from '../entities/WorkoutPhoto.js'
import { Workout } from '../entities/Workout.js'
import { authenticate, AuthRequest } from '../middlewares/auth.js'

const router = express.Router()
const photoRepository = AppDataSource.getRepository(WorkoutPhoto)
const workoutRepository = AppDataSource.getRepository(Workout)

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
      const workout = await workoutRepository.findOne({
        where: { id: parseInt(workoutId), userId: req.user!.id }
      })

      if (!workout) {
        return res.status(404).json({ error: 'Workout not found' })
      }

      // If primary photo, remove previous primary flag
      if (isPrimary === 'true') {
        await photoRepository.update(
          { workoutId: parseInt(workoutId) },
          { isPrimary: false }
        )
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
      const photo = photoRepository.create({
        workoutId: parseInt(workoutId),
        photoUrl: result.secure_url,
        isPrimary: isPrimary === 'true'
      })

      const saved = await photoRepository.save(photo)
      res.status(201).json(saved)
    } catch (error) {
      console.error('Upload error:', error)
      res.status(500).json({ error: 'Failed to upload photo' })
    }
  }
)

// Get timelapse photos (primary photos ordered chronologically)
router.get('/timelapse', authenticate, async (req: AuthRequest, res) => {
  try {
    const { startDate, endDate } = req.query

    const query = photoRepository
      .createQueryBuilder('photo')
      .innerJoinAndSelect('photo.workout', 'workout')
      .where('workout.userId = :userId', { userId: req.user!.id })
      .andWhere('photo.isPrimary = :isPrimary', { isPrimary: true })

    if (startDate) {
      query.andWhere('workout.date >= :startDate', { startDate: new Date(startDate as string) })
    }
    if (endDate) {
      query.andWhere('workout.date <= :endDate', { endDate: new Date(endDate as string) })
    }

    const photos = await query
      .orderBy('photo.createdAt', 'ASC')
      .getMany()

    res.json(photos)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch timelapse photos' })
  }
})

// Get recent photos
router.get('/recent', authenticate, async (req: AuthRequest, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10

    const photos = await photoRepository
      .createQueryBuilder('photo')
      .innerJoinAndSelect('photo.workout', 'workout')
      .where('workout.userId = :userId', { userId: req.user!.id })
      .orderBy('photo.createdAt', 'DESC')
      .take(limit)
      .getMany()

    res.json(photos)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recent photos' })
  }
})

// Delete photo
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const photo = await photoRepository
      .createQueryBuilder('photo')
      .innerJoin('photo.workout', 'workout')
      .where('photo.id = :id', { id: parseInt(req.params.id) })
      .andWhere('workout.userId = :userId', { userId: req.user!.id })
      .getOne()

    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' })
    }

    await photoRepository.remove(photo)
    res.json({ message: 'Photo deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete photo' })
  }
})

export default router
