import express from 'express'
import multer from 'multer'
import cloudinary from '../config/cloudinary.js'
import { AppDataSource } from '../config/database.js'
import { WorkoutPhoto } from '../entities/WorkoutPhoto.js'
import { Workout } from '../entities/Workout.js'
import { authenticate, AuthRequest } from '../middlewares/auth.js'
import { checkPhotoLimit } from '../services/limitService.js'
import { parseId } from '../utils/validation.js'

const router = express.Router()
const photoRepository = AppDataSource.getRepository(WorkoutPhoto)
const workoutRepository = AppDataSource.getRepository(Workout)

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Type de fichier non autorisé. Utilisez JPG, PNG, WebP ou GIF.'))
    }
  }
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
        return res.status(400).json({ error: 'Aucune photo fournie' })
      }

      // Vérifier la limite de photos
      const photoCheck = await checkPhotoLimit(req.user!.id)
      if (!photoCheck.allowed) {
        return res.status(403).json({
          error: 'Limite atteinte',
          code: 'LIMIT_PHOTOS',
          current: photoCheck.current,
          limit: photoCheck.limit
        })
      }

      // Verify workout belongs to user
      const workout = await workoutRepository.findOne({
        where: { id: parseId(workoutId), userId: req.user!.id }
      })

      if (!workout) {
        return res.status(404).json({ error: 'Séance non trouvée' })
      }

      // If primary photo, remove previous primary flag
      if (isPrimary === 'true') {
        await photoRepository.update(
          { workoutId: parseId(workoutId) },
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

      if (!result?.secure_url) {
        return res.status(500).json({ error: 'Erreur Cloudinary : réponse invalide' })
      }

      // Save to database
      const photo = photoRepository.create({
        workoutId: parseId(workoutId),
        photoUrl: result.secure_url,
        isPrimary: isPrimary === 'true'
      })

      const saved = await photoRepository.save(photo)
      res.status(201).json(saved)
    } catch (error) {
      console.error('Upload error:', error)
      res.status(500).json({ error: 'Erreur lors du téléchargement de la photo' })
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
      const d = new Date(startDate as string)
      if (isNaN(d.getTime())) return res.status(400).json({ error: 'Date invalide' })
      query.andWhere('workout.date >= :startDate', { startDate: d })
    }
    if (endDate) {
      const d = new Date(endDate as string)
      if (isNaN(d.getTime())) return res.status(400).json({ error: 'Date invalide' })
      query.andWhere('workout.date <= :endDate', { endDate: d })
    }

    const limit = Math.min(Math.max(parseInt(req.query.limit as string) || 100, 1), 500)
    const offset = Math.max(parseInt(req.query.offset as string) || 0, 0)

    const [photos, total] = await query
      .orderBy('workout.date', 'ASC')
      .take(limit)
      .skip(offset)
      .getManyAndCount()

    res.json({ photos, total, limit, offset })
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des photos timelapse' })
  }
})

// Get recent photos
router.get('/recent', authenticate, async (req: AuthRequest, res) => {
  try {
    const limit = Math.min(Math.max(parseInt(req.query.limit as string) || 10, 1), 100)

    const photos = await photoRepository
      .createQueryBuilder('photo')
      .innerJoinAndSelect('photo.workout', 'workout')
      .where('workout.userId = :userId', { userId: req.user!.id })
      .orderBy('photo.createdAt', 'DESC')
      .take(limit)
      .getMany()

    res.json(photos)
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des photos récentes' })
  }
})

// Delete photo
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const photo = await photoRepository
      .createQueryBuilder('photo')
      .innerJoin('photo.workout', 'workout')
      .where('photo.id = :id', { id: parseId(req.params.id) })
      .andWhere('workout.userId = :userId', { userId: req.user!.id })
      .getOne()

    if (!photo) {
      return res.status(404).json({ error: 'Photo non trouvée' })
    }

    // Delete from Cloudinary before removing DB record
    if (photo.photoUrl) {
      const parts = photo.photoUrl.split('/')
      const athletiqIndex = parts.indexOf('athletiq')
      if (athletiqIndex !== -1) {
        const publicId = parts.slice(athletiqIndex).join('/').replace(/\.[^.]+$/, '')
        await cloudinary.uploader.destroy(publicId).catch(() => {})
      }
    }

    await photoRepository.remove(photo)
    res.json({ message: 'Photo supprimée' })
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de la photo' })
  }
})

export default router
