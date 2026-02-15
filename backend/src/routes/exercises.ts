import express from 'express'
import { z } from 'zod'
import { AppDataSource } from '../config/database.js'
import { ExerciseLibrary, MuscleGroup, Equipment, Difficulty } from '../entities/ExerciseLibrary.js'
import { authenticate } from '../middlewares/auth.js'
import { Like } from 'typeorm'

const router = express.Router()

const exerciseLibraryRepo = AppDataSource.getRepository(ExerciseLibrary)

// Validation schema
const createExerciseSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  instructions: z.string().optional(),
  muscleGroups: z.array(z.nativeEnum(MuscleGroup)).optional(),
  primaryMuscle: z.nativeEnum(MuscleGroup).optional(),
  equipment: z.nativeEnum(Equipment),
  difficulty: z.nativeEnum(Difficulty),
  videoUrl: z.string().url().optional(),
  imageUrl: z.string().url().optional()
})

// Get all exercises (with optional filters)
router.get('/', authenticate, async (req, res) => {
  try {
    const {
      search,
      muscleGroup,
      equipment,
      difficulty,
      limit = '50',
      offset = '0'
    } = req.query

    const queryBuilder = exerciseLibraryRepo.createQueryBuilder('exercise')

    // Search by name
    if (search && typeof search === 'string') {
      queryBuilder.andWhere('exercise.name ILIKE :search', {
        search: `%${search}%`
      })
    }

    // Filter by muscle group
    if (muscleGroup && typeof muscleGroup === 'string') {
      queryBuilder.andWhere(':muscleGroup = ANY(exercise.muscleGroups)', {
        muscleGroup: muscleGroup.toUpperCase()
      })
    }

    // Filter by equipment
    if (equipment && typeof equipment === 'string') {
      queryBuilder.andWhere('exercise.equipment = :equipment', {
        equipment: equipment.toUpperCase()
      })
    }

    // Filter by difficulty
    if (difficulty && typeof difficulty === 'string') {
      queryBuilder.andWhere('exercise.difficulty = :difficulty', {
        difficulty: difficulty.toUpperCase()
      })
    }

    // Pagination
    queryBuilder
      .orderBy('exercise.name', 'ASC')
      .take(parseInt(limit as string))
      .skip(parseInt(offset as string))

    const [exercises, total] = await queryBuilder.getManyAndCount()

    res.json({
      exercises,
      total,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string)
    })
  } catch (error) {
    console.error('Error fetching exercises:', error)
    res.status(500).json({ error: 'Failed to fetch exercises' })
  }
})

// Get single exercise by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const exercise = await exerciseLibraryRepo.findOne({
      where: { id: parseInt(req.params.id) }
    })

    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' })
    }

    res.json(exercise)
  } catch (error) {
    console.error('Error fetching exercise:', error)
    res.status(500).json({ error: 'Failed to fetch exercise' })
  }
})

// Get exercises by muscle group
router.get('/muscle/:muscleGroup', authenticate, async (req, res) => {
  try {
    const muscleGroup = req.params.muscleGroup.toUpperCase()

    const exercises = await exerciseLibraryRepo
      .createQueryBuilder('exercise')
      .where(':muscleGroup = ANY(exercise.muscleGroups)', { muscleGroup })
      .orderBy('exercise.name', 'ASC')
      .getMany()

    res.json(exercises)
  } catch (error) {
    console.error('Error fetching exercises by muscle group:', error)
    res.status(500).json({ error: 'Failed to fetch exercises' })
  }
})

// Create new exercise (admin only - you might want to add admin middleware)
router.post('/', authenticate, async (req, res) => {
  try {
    const data = createExerciseSchema.parse(req.body)

    // Check if exercise already exists
    const existing = await exerciseLibraryRepo.findOne({
      where: { name: data.name }
    })

    if (existing) {
      return res.status(409).json({ error: 'Exercise already exists' })
    }

    const exercise = exerciseLibraryRepo.create(data)
    await exerciseLibraryRepo.save(exercise)

    res.status(201).json(exercise)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors })
    }
    console.error('Error creating exercise:', error)
    res.status(500).json({ error: 'Failed to create exercise' })
  }
})

// Update exercise (admin only)
router.put('/:id', authenticate, async (req, res) => {
  try {
    const data = createExerciseSchema.partial().parse(req.body)

    const exercise = await exerciseLibraryRepo.findOne({
      where: { id: parseInt(req.params.id) }
    })

    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' })
    }

    Object.assign(exercise, data)
    await exerciseLibraryRepo.save(exercise)

    res.json({ message: 'Exercise updated successfully', exercise })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors })
    }
    console.error('Error updating exercise:', error)
    res.status(500).json({ error: 'Failed to update exercise' })
  }
})

// Delete exercise (admin only)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const result = await exerciseLibraryRepo.delete({ id: parseInt(req.params.id) })

    if (result.affected === 0) {
      return res.status(404).json({ error: 'Exercise not found' })
    }

    res.json({ message: 'Exercise deleted successfully' })
  } catch (error) {
    console.error('Error deleting exercise:', error)
    res.status(500).json({ error: 'Failed to delete exercise' })
  }
})

export default router
