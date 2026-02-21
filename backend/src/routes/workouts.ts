import express from 'express'
import { z } from 'zod'
import { AppDataSource } from '../config/database.js'
import { Workout } from '../entities/Workout.js'
import { Exercise } from '../entities/Exercise.js'
import { Set } from '../entities/Set.js'
import { WorkoutPhoto } from '../entities/WorkoutPhoto.js'
import { authenticate, AuthRequest } from '../middlewares/auth.js'
import { checkAndCreatePRNotifications, checkStreakMilestone } from '../services/notificationService.js'

const router = express.Router()

// Repositories
const workoutRepo = AppDataSource.getRepository(Workout)
const exerciseRepo = AppDataSource.getRepository(Exercise)
const setRepo = AppDataSource.getRepository(Set)
const photoRepo = AppDataSource.getRepository(WorkoutPhoto)

// Validation schemas
const createWorkoutSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  isTemplate: z.boolean().optional(),
  date: z.string().datetime().optional(),
  duration: z.number().optional(),
  notes: z.string().optional()
})

const addExerciseSchema = z.object({
  exerciseLibraryId: z.number().optional(),
  name: z.string(),
  orderIndex: z.number().nullish(),
  notes: z.string().nullish(),
  targetSets: z.number().nullish(),
  targetReps: z.number().nullish(),
  targetWeight: z.number().nullish(),
  restTime: z.number().nullish(),
  plannedSets: z.array(z.object({
    setNumber: z.number(),
    targetReps: z.number(),
    targetWeight: z.number()
  })).nullish()
})

const updateExerciseSchema = z.object({
  exerciseLibraryId: z.number().optional(),
  name: z.string().optional(),
  orderIndex: z.number().nullish(),
  notes: z.string().nullish(),
  targetSets: z.number().nullish(),
  targetReps: z.number().nullish(),
  targetWeight: z.number().nullish(),
  restTime: z.number().nullish(),
  plannedSets: z.array(z.object({
    setNumber: z.number(),
    targetReps: z.number(),
    targetWeight: z.number()
  })).nullish()
}).partial()

const addSetSchema = z.object({
  setNumber: z.number(),
  reps: z.number(),
  weight: z.number(),
  rpe: z.number().min(1).max(10).optional(),
  notes: z.string().optional()
})

// Get all workouts for user
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const workouts = await workoutRepo.find({
      where: { userId: req.user!.id },
      relations: ['exercises', 'exercises.sets', 'exercises.exerciseLibrary', 'photos'],
      order: { date: 'DESC' }
    })

    res.json({ workouts })
  } catch (error) {
    console.error('Error fetching workouts:', error)
    res.status(500).json({ error: 'Failed to fetch workouts' })
  }
})

// Get single workout
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const workout = await workoutRepo.findOne({
      where: {
        id: parseInt(req.params.id),
        userId: req.user!.id
      },
      relations: ['exercises', 'exercises.sets', 'exercises.exerciseLibrary', 'photos']
    })

    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' })
    }

    res.json(workout)
  } catch (error) {
    console.error('Error fetching workout:', error)
    res.status(500).json({ error: 'Failed to fetch workout' })
  }
})

// Create workout
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const data = createWorkoutSchema.parse(req.body)

    const workout = workoutRepo.create({
      ...data,
      date: data.date ? new Date(data.date) : new Date(),
      userId: req.user!.id
    })

    await workoutRepo.save(workout)

    const savedWorkout = await workoutRepo.findOne({
      where: { id: workout.id },
      relations: ['exercises', 'exercises.sets', 'exercises.exerciseLibrary']
    })

    res.status(201).json(savedWorkout)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors })
    }
    console.error('Error creating workout:', error)
    res.status(500).json({ error: 'Failed to create workout' })
  }
})

// Update workout
router.put('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const data = createWorkoutSchema.partial().parse(req.body)

    const workout = await workoutRepo.findOne({
      where: {
        id: parseInt(req.params.id),
        userId: req.user!.id
      }
    })

    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' })
    }

    Object.assign(workout, {
      ...data,
      date: data.date ? new Date(data.date) : workout.date
    })

    await workoutRepo.save(workout)

    res.json({ message: 'Workout updated successfully', workout })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors })
    }
    console.error('Error updating workout:', error)
    res.status(500).json({ error: 'Failed to update workout' })
  }
})

// Delete workout
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const result = await workoutRepo.delete({
      id: parseInt(req.params.id),
      userId: req.user!.id
    })

    if (result.affected === 0) {
      return res.status(404).json({ error: 'Workout not found' })
    }

    res.json({ message: 'Workout deleted successfully' })
  } catch (error) {
    console.error('Error deleting workout:', error)
    res.status(500).json({ error: 'Failed to delete workout' })
  }
})

// Start workout
router.post('/:id/start', authenticate, async (req: AuthRequest, res) => {
  try {
    const workout = await workoutRepo.findOne({
      where: {
        id: parseInt(req.params.id),
        userId: req.user!.id
      }
    })

    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' })
    }

    workout.startedAt = new Date()
    await workoutRepo.save(workout)

    const updatedWorkout = await workoutRepo.findOne({
      where: { id: workout.id },
      relations: ['exercises', 'exercises.sets', 'exercises.exerciseLibrary']
    })

    res.json({ message: 'Workout started', workout: updatedWorkout })
  } catch (error) {
    console.error('Error starting workout:', error)
    res.status(500).json({ error: 'Failed to start workout' })
  }
})

// Complete workout
router.post('/:id/complete', authenticate, async (req: AuthRequest, res) => {
  try {
    const workout = await workoutRepo.findOne({
      where: {
        id: parseInt(req.params.id),
        userId: req.user!.id
      },
      relations: ['exercises', 'exercises.sets']
    })

    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' })
    }

    workout.completedAt = new Date()

    // Calculate duration if started
    if (workout.startedAt) {
      const duration = Math.floor((workout.completedAt.getTime() - workout.startedAt.getTime()) / 1000)
      workout.duration = duration
    }

    // Calculate total volume
    let totalVolume = 0
    if (workout.exercises) {
      for (const exercise of workout.exercises) {
        if (exercise.sets) {
          for (const set of exercise.sets) {
            if (set.weight && set.reps) {
              totalVolume += set.weight * set.reps
            }
          }
        }
      }
    }
    workout.totalVolume = totalVolume

    await workoutRepo.save(workout)

    const updatedWorkout = await workoutRepo.findOne({
      where: { id: workout.id },
      relations: ['exercises', 'exercises.sets', 'exercises.exerciseLibrary']
    })

    // Fire-and-forget: check for PR and streak notifications
    checkAndCreatePRNotifications(req.user!.id, workout.id).catch(() => {})
    checkStreakMilestone(req.user!.id).catch(() => {})

    res.json({ message: 'Workout completed', workout: updatedWorkout })
  } catch (error) {
    console.error('Error completing workout:', error)
    res.status(500).json({ error: 'Failed to complete workout' })
  }
})

// ===== EXERCISE ROUTES =====

// Add exercise to workout
router.post('/:workoutId/exercises', authenticate, async (req: AuthRequest, res) => {
  try {
    const workoutId = parseInt(req.params.workoutId)
    console.log('Received exercise data:', req.body)
    const data = addExerciseSchema.parse(req.body)

    // Verify workout belongs to user
    const workout = await workoutRepo.findOne({
      where: { id: workoutId, userId: req.user!.id }
    })

    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' })
    }

    const exercise = exerciseRepo.create({
      ...data,
      workoutId
    })

    await exerciseRepo.save(exercise)

    const savedExercise = await exerciseRepo.findOne({
      where: { id: exercise.id },
      relations: ['exerciseLibrary', 'sets']
    })

    res.status(201).json(savedExercise)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors })
    }
    console.error('Error adding exercise:', error)
    res.status(500).json({ error: 'Failed to add exercise' })
  }
})

// Update exercise
router.put('/:workoutId/exercises/:exerciseId', authenticate, async (req: AuthRequest, res) => {
  try {
    const workoutId = parseInt(req.params.workoutId)
    const exerciseId = parseInt(req.params.exerciseId)
    const data = updateExerciseSchema.parse(req.body)

    // Verify workout belongs to user
    const workout = await workoutRepo.findOne({
      where: { id: workoutId, userId: req.user!.id }
    })

    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' })
    }

    const exercise = await exerciseRepo.findOne({
      where: { id: exerciseId, workoutId }
    })

    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' })
    }

    Object.assign(exercise, data)
    await exerciseRepo.save(exercise)

    res.json({ message: 'Exercise updated successfully', exercise })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors })
    }
    console.error('Error updating exercise:', error)
    res.status(500).json({ error: 'Failed to update exercise' })
  }
})

// Delete exercise
router.delete('/:workoutId/exercises/:exerciseId', authenticate, async (req: AuthRequest, res) => {
  try {
    const workoutId = parseInt(req.params.workoutId)
    const exerciseId = parseInt(req.params.exerciseId)

    // Verify workout belongs to user
    const workout = await workoutRepo.findOne({
      where: { id: workoutId, userId: req.user!.id }
    })

    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' })
    }

    const result = await exerciseRepo.delete({
      id: exerciseId,
      workoutId
    })

    if (result.affected === 0) {
      return res.status(404).json({ error: 'Exercise not found' })
    }

    res.json({ message: 'Exercise deleted successfully' })
  } catch (error) {
    console.error('Error deleting exercise:', error)
    res.status(500).json({ error: 'Failed to delete exercise' })
  }
})

// ===== SET ROUTES =====

// Add set to exercise
router.post('/:workoutId/exercises/:exerciseId/sets', authenticate, async (req: AuthRequest, res) => {
  try {
    const workoutId = parseInt(req.params.workoutId)
    const exerciseId = parseInt(req.params.exerciseId)
    const data = addSetSchema.parse(req.body)

    // Verify workout belongs to user
    const workout = await workoutRepo.findOne({
      where: { id: workoutId, userId: req.user!.id }
    })

    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' })
    }

    // Verify exercise belongs to workout
    const exercise = await exerciseRepo.findOne({
      where: { id: exerciseId, workoutId }
    })

    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' })
    }

    const set = setRepo.create({
      ...data,
      exerciseId
    })

    await setRepo.save(set)

    res.status(201).json(set)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors })
    }
    console.error('Error adding set:', error)
    res.status(500).json({ error: 'Failed to add set' })
  }
})

// Update set
router.put('/:workoutId/exercises/:exerciseId/sets/:setId', authenticate, async (req: AuthRequest, res) => {
  try {
    const workoutId = parseInt(req.params.workoutId)
    const exerciseId = parseInt(req.params.exerciseId)
    const setId = parseInt(req.params.setId)
    const data = addSetSchema.partial().parse(req.body)

    // Verify workout belongs to user
    const workout = await workoutRepo.findOne({
      where: { id: workoutId, userId: req.user!.id }
    })

    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' })
    }

    const set = await setRepo.findOne({
      where: { id: setId, exerciseId },
      relations: ['exercise']
    })

    if (!set || set.exercise.workoutId !== workoutId) {
      return res.status(404).json({ error: 'Set not found' })
    }

    Object.assign(set, data)
    await setRepo.save(set)

    res.json({ message: 'Set updated successfully', set })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors })
    }
    console.error('Error updating set:', error)
    res.status(500).json({ error: 'Failed to update set' })
  }
})

// Delete set
router.delete('/:workoutId/exercises/:exerciseId/sets/:setId', authenticate, async (req: AuthRequest, res) => {
  try {
    const workoutId = parseInt(req.params.workoutId)
    const exerciseId = parseInt(req.params.exerciseId)
    const setId = parseInt(req.params.setId)

    // Verify workout belongs to user
    const workout = await workoutRepo.findOne({
      where: { id: workoutId, userId: req.user!.id }
    })

    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' })
    }

    const set = await setRepo.findOne({
      where: { id: setId, exerciseId },
      relations: ['exercise']
    })

    if (!set || set.exercise.workoutId !== workoutId) {
      return res.status(404).json({ error: 'Set not found' })
    }

    await setRepo.remove(set)

    res.json({ message: 'Set deleted successfully' })
  } catch (error) {
    console.error('Error deleting set:', error)
    res.status(500).json({ error: 'Failed to delete set' })
  }
})

// Get exercise history (last sets for a specific exercise)
router.get('/history/exercise/:exerciseLibraryId', authenticate, async (req: AuthRequest, res) => {
  try {
    const exerciseLibraryId = parseInt(req.params.exerciseLibraryId)

    // Find the most recent completed workout with this exercise
    const recentExercises = await exerciseRepo
      .createQueryBuilder('exercise')
      .leftJoinAndSelect('exercise.workout', 'workout')
      .leftJoinAndSelect('exercise.sets', 'sets')
      .where('workout.userId = :userId', { userId: req.user!.id })
      .andWhere('exercise.exerciseLibraryId = :exerciseLibraryId', { exerciseLibraryId })
      .andWhere('workout.completedAt IS NOT NULL')
      .orderBy('workout.completedAt', 'DESC')
      .addOrderBy('sets.setNumber', 'ASC')
      .getMany() // Récupère tous les exercices pour éviter le bug LIMIT avec JOIN

    // Prendre le premier exercice (le plus récent)
    const recentExercise = recentExercises[0]

    console.log('📊 Exercise loaded:', recentExercise?.id)
    console.log('📋 Sets loaded:', recentExercise?.sets?.length, 'sets')
    console.log('🔍 Sets data:', recentExercise?.sets)

    // Get ALL sets from the most recent exercise
    const lastSets = recentExercise?.sets || []

    res.json({
      exerciseLibraryId,
      lastSets,
      lastWorkoutDate: recentExercise?.workout?.completedAt || null
    })
  } catch (error) {
    console.error('Error fetching exercise history:', error)
    res.status(500).json({ error: 'Failed to fetch exercise history' })
  }
})

export default router
