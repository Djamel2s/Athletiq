import express from 'express'
import { z } from 'zod'
import { AppDataSource } from '../config/database.js'
import { Workout } from '../entities/Workout.js'
import { Exercise } from '../entities/Exercise.js'
import { Set } from '../entities/Set.js'
import { WorkoutPhoto } from '../entities/WorkoutPhoto.js'
import { authenticate, AuthRequest } from '../middlewares/auth.js'
import { checkAndCreatePRNotifications, checkStreakMilestone } from '../services/notificationService.js'
import { checkWorkoutLimit, checkTemplateLimit, getUserPlanType, withUserLock } from '../services/limitService.js'
import { PLAN_LIMITS } from '../config/planLimits.js'
import { MoreThanOrEqual } from 'typeorm'
import { parseId } from '../utils/validation.js'

const router = express.Router()

// Repositories
const workoutRepo = AppDataSource.getRepository(Workout)
const exerciseRepo = AppDataSource.getRepository(Exercise)
const setRepo = AppDataSource.getRepository(Set)
const photoRepo = AppDataSource.getRepository(WorkoutPhoto)

// Validation schemas
const createWorkoutSchema = z.object({
  name: z.string().max(200),
  description: z.string().max(2000).nullish(),
  isTemplate: z.boolean().nullish(),
  date: z.string().datetime().nullish(),
  duration: z.number().nullish(),
  notes: z.string().max(2000).nullish()
})

const addExerciseSchema = z.object({
  exerciseLibraryId: z.number().nullish(),
  name: z.string().max(200),
  orderIndex: z.number().nullish(),
  notes: z.string().max(2000).nullish(),
  targetSets: z.number().nullish(),
  targetReps: z.number().nullish(),
  targetWeight: z.number().nullish(),
  restTime: z.number().nullish(),
  plannedSets: z.array(z.object({
    setNumber: z.number(),
    targetReps: z.number(),
    targetWeight: z.number(),
    restTime: z.number().optional()
  })).max(20).nullish()
})

const updateExerciseSchema = z.object({
  exerciseLibraryId: z.number().nullish(),
  name: z.string().max(200).nullish(),
  orderIndex: z.number().nullish(),
  notes: z.string().max(2000).nullish(),
  targetSets: z.number().nullish(),
  targetReps: z.number().nullish(),
  targetWeight: z.number().nullish(),
  restTime: z.number().nullish(),
  plannedSets: z.array(z.object({
    setNumber: z.number(),
    targetReps: z.number(),
    targetWeight: z.number(),
    restTime: z.number().optional()
  })).max(20).nullish()
}).partial()

const addSetSchema = z.object({
  setNumber: z.number(),
  reps: z.number(),
  weight: z.number(),
  rpe: z.number().min(1).max(10).nullish(),
  notes: z.string().max(2000).nullish()
})

// Get all workouts for user
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const planType = await getUserPlanType(req.user!.id)
    const historyDays = PLAN_LIMITS[planType].historyDays

    const limit = Math.min(Math.max(parseInt(req.query.limit as string) || 50, 1), 100)
    const offset = Math.max(parseInt(req.query.offset as string) || 0, 0)

    const where: any = { userId: req.user!.id }

    // Limiter l'historique pour le plan gratuit
    if (historyDays !== Infinity) {
      const cutoff = new Date()
      cutoff.setDate(cutoff.getDate() - historyDays)
      where.date = MoreThanOrEqual(cutoff)
    }

    const [workouts, total] = await workoutRepo.findAndCount({
      where,
      relations: ['exercises', 'exercises.sets', 'exercises.exerciseLibrary', 'photos'],
      order: { date: 'DESC' },
      take: limit,
      skip: offset
    })

    res.json({ workouts, historyLimited: historyDays !== Infinity, total, limit, offset })
  } catch (error) {
    console.error('Error fetching workouts:', error)
    res.status(500).json({ error: 'Erreur lors de la récupération des séances' })
  }
})

// Get single workout
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const workout = await workoutRepo.findOne({
      where: {
        id: parseId(req.params.id),
        userId: req.user!.id
      },
      relations: ['exercises', 'exercises.sets', 'exercises.exerciseLibrary', 'photos']
    })

    if (!workout) {
      return res.status(404).json({ error: 'Séance non trouvée' })
    }

    if (workout.exercises) {
      workout.exercises.sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
    }

    res.json(workout)
  } catch (error) {
    console.error('Error fetching workout:', error)
    res.status(500).json({ error: 'Erreur lors de la récupération de la séance' })
  }
})

// Create workout
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const data = createWorkoutSchema.parse(req.body)
    const userId = req.user!.id

    // Vérifier les limites du plan (avec verrou pour éviter TOCTOU)
    if (data.isTemplate) {
      const result = await withUserLock(userId, 'create-template', async () => {
        const templateCheck = await checkTemplateLimit(userId)
        if (!templateCheck.allowed) {
          return {
            status: 403,
            body: {
              error: 'Limite atteinte',
              code: 'LIMIT_TEMPLATES',
              current: templateCheck.current,
              limit: templateCheck.limit
            }
          }
        }

        const workout = workoutRepo.create({
          name: data.name,
          description: data.description ?? undefined,
          isTemplate: true,
          notes: data.notes ?? undefined,
          duration: data.duration ?? undefined,
          date: data.date ? new Date(data.date) : new Date(),
          userId
        })

        await workoutRepo.save(workout)

        const savedWorkout = await workoutRepo.findOne({
          where: { id: workout.id },
          relations: ['exercises', 'exercises.sets', 'exercises.exerciseLibrary']
        })

        return { status: 201, body: savedWorkout }
      })

      return res.status(result.status).json(result.body)
    }

    const workout = workoutRepo.create({
      name: data.name,
      description: data.description ?? undefined,
      isTemplate: data.isTemplate ?? undefined,
      notes: data.notes ?? undefined,
      duration: data.duration ?? undefined,
      date: data.date ? new Date(data.date) : new Date(),
      userId
    })

    await workoutRepo.save(workout)

    const savedWorkout = await workoutRepo.findOne({
      where: { id: workout.id },
      relations: ['exercises', 'exercises.sets', 'exercises.exerciseLibrary']
    })

    res.status(201).json(savedWorkout)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Erreur de validation', details: error.errors })
    }
    console.error('Error creating workout:', error)
    res.status(500).json({ error: 'Erreur lors de la création de la séance' })
  }
})

// Update workout
router.put('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const data = createWorkoutSchema.partial().parse(req.body)

    const workout = await workoutRepo.findOne({
      where: {
        id: parseId(req.params.id),
        userId: req.user!.id
      }
    })

    if (!workout) {
      return res.status(404).json({ error: 'Séance non trouvée' })
    }

    // Only assign defined (non-null) values
    if (data.name != null) workout.name = data.name
    if (data.description !== undefined) workout.description = data.description ?? undefined
    if (data.notes !== undefined) workout.notes = data.notes ?? undefined
    if (data.duration != null) workout.duration = data.duration
    if (data.isTemplate != null) workout.isTemplate = data.isTemplate
    if (data.date) workout.date = new Date(data.date)

    await workoutRepo.save(workout)

    res.json({ message: 'Séance mise à jour', workout })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Erreur de validation', details: error.errors })
    }
    console.error('Error updating workout:', error)
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la séance' })
  }
})

// Delete workout
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const result = await workoutRepo.delete({
      id: parseId(req.params.id),
      userId: req.user!.id
    })

    if (result.affected === 0) {
      return res.status(404).json({ error: 'Séance non trouvée' })
    }

    res.json({ message: 'Séance supprimée' })
  } catch (error) {
    console.error('Error deleting workout:', error)
    res.status(500).json({ error: 'Erreur lors de la suppression de la séance' })
  }
})

// Start workout
router.post('/:id/start', authenticate, async (req: AuthRequest, res) => {
  try {
    const workout = await workoutRepo.findOne({
      where: {
        id: parseId(req.params.id),
        userId: req.user!.id
      }
    })

    if (!workout) {
      return res.status(404).json({ error: 'Séance non trouvée' })
    }

    workout.startedAt = new Date()
    await workoutRepo.save(workout)

    const updatedWorkout = await workoutRepo.findOne({
      where: { id: workout.id },
      relations: ['exercises', 'exercises.sets', 'exercises.exerciseLibrary']
    })

    res.json({ message: 'Séance démarrée', workout: updatedWorkout })
  } catch (error) {
    console.error('Error starting workout:', error)
    res.status(500).json({ error: 'Erreur lors du démarrage de la séance' })
  }
})

// Complete workout
router.post('/:id/complete', authenticate, async (req: AuthRequest, res) => {
  try {
    const workoutId = parseId(req.params.id)
    const userId = req.user!.id

    // Verrou pour éviter le double-clic qui contourne la limite
    const result = await withUserLock(userId, 'complete-workout', async () => {
      const workout = await workoutRepo.findOne({
        where: { id: workoutId, userId },
        relations: ['exercises', 'exercises.sets']
      })

      if (!workout) {
        return { status: 404, body: { error: 'Séance non trouvée' } }
      }

      // Vérifier la limite de séances par semaine
      const workoutCheck = await checkWorkoutLimit(userId)
      if (!workoutCheck.allowed) {
        return {
          status: 403,
          body: {
            error: 'Limite atteinte',
            code: 'LIMIT_WORKOUTS_WEEK',
            current: workoutCheck.current,
            limit: workoutCheck.limit
          }
        }
      }

      // Empêcher de compléter une séance déjà terminée
      if (workout.completedAt) {
        return { status: 400, body: { error: 'Séance déjà terminée' } }
      }

      workout.completedAt = new Date()

      // Calculate duration if started (plafonner à 24h pour éviter les valeurs absurdes)
      if (workout.startedAt) {
        const duration = Math.floor((workout.completedAt.getTime() - workout.startedAt.getTime()) / 1000)
        workout.duration = Math.max(0, Math.min(duration, 86400))
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
      checkAndCreatePRNotifications(userId, workout.id).catch(err => console.error('Background job failed:', err))
      checkStreakMilestone(userId).catch(err => console.error('Background job failed:', err))

      return { status: 200, body: { message: 'Séance terminée', workout: updatedWorkout } }
    })

    res.status(result.status).json(result.body)
  } catch (error) {
    console.error('Error completing workout:', error)
    res.status(500).json({ error: 'Erreur lors de la complétion de la séance' })
  }
})

// ===== EXERCISE ROUTES =====

// Add exercise to workout
router.post('/:workoutId/exercises', authenticate, async (req: AuthRequest, res) => {
  try {
    const workoutId = parseId(req.params.workoutId)
    const data = addExerciseSchema.parse(req.body)

    // Verify workout belongs to user
    const workout = await workoutRepo.findOne({
      where: { id: workoutId, userId: req.user!.id }
    })

    if (!workout) {
      return res.status(404).json({ error: 'Séance non trouvée' })
    }

    const exercise = exerciseRepo.create({
      workoutId,
      name: data.name,
      exerciseLibraryId: data.exerciseLibraryId ?? undefined,
      orderIndex: data.orderIndex ?? undefined,
      notes: data.notes ?? undefined,
      targetSets: data.targetSets ?? undefined,
      targetReps: data.targetReps ?? undefined,
      targetWeight: data.targetWeight ?? undefined,
      restTime: data.restTime ?? undefined,
      plannedSets: data.plannedSets ?? undefined,
    })

    await exerciseRepo.save(exercise)

    const savedExercise = await exerciseRepo.findOne({
      where: { id: exercise.id },
      relations: ['exerciseLibrary', 'sets']
    })

    res.status(201).json(savedExercise)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Erreur de validation', details: error.errors })
    }
    console.error('Error adding exercise:', error)
    res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'exercice' })
  }
})

// Update exercise
router.put('/:workoutId/exercises/:exerciseId', authenticate, async (req: AuthRequest, res) => {
  try {
    const workoutId = parseId(req.params.workoutId)
    const exerciseId = parseId(req.params.exerciseId)
    const data = updateExerciseSchema.parse(req.body)

    // Verify workout belongs to user
    const workout = await workoutRepo.findOne({
      where: { id: workoutId, userId: req.user!.id }
    })

    if (!workout) {
      return res.status(404).json({ error: 'Séance non trouvée' })
    }

    const exercise = await exerciseRepo.findOne({
      where: { id: exerciseId, workoutId }
    })

    if (!exercise) {
      return res.status(404).json({ error: 'Exercice non trouvé' })
    }

    Object.assign(exercise, data)
    await exerciseRepo.save(exercise)

    res.json({ message: 'Exercice mis à jour', exercise })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Erreur de validation', details: error.errors })
    }
    console.error('Error updating exercise:', error)
    res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'exercice' })
  }
})

// Delete exercise
router.delete('/:workoutId/exercises/:exerciseId', authenticate, async (req: AuthRequest, res) => {
  try {
    const workoutId = parseId(req.params.workoutId)
    const exerciseId = parseId(req.params.exerciseId)

    // Verify workout belongs to user
    const workout = await workoutRepo.findOne({
      where: { id: workoutId, userId: req.user!.id }
    })

    if (!workout) {
      return res.status(404).json({ error: 'Séance non trouvée' })
    }

    const result = await exerciseRepo.delete({
      id: exerciseId,
      workoutId
    })

    if (result.affected === 0) {
      return res.status(404).json({ error: 'Exercice non trouvé' })
    }

    res.json({ message: 'Exercice supprimé' })
  } catch (error) {
    console.error('Error deleting exercise:', error)
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'exercice' })
  }
})

// ===== SET ROUTES =====

// Add set to exercise
router.post('/:workoutId/exercises/:exerciseId/sets', authenticate, async (req: AuthRequest, res) => {
  try {
    const workoutId = parseId(req.params.workoutId)
    const exerciseId = parseId(req.params.exerciseId)
    const data = addSetSchema.parse(req.body)

    // Verify workout belongs to user
    const workout = await workoutRepo.findOne({
      where: { id: workoutId, userId: req.user!.id }
    })

    if (!workout) {
      return res.status(404).json({ error: 'Séance non trouvée' })
    }

    // Verify exercise belongs to workout
    const exercise = await exerciseRepo.findOne({
      where: { id: exerciseId, workoutId }
    })

    if (!exercise) {
      return res.status(404).json({ error: 'Exercice non trouvé' })
    }

    const set = setRepo.create({
      exerciseId,
      setNumber: data.setNumber,
      reps: data.reps,
      weight: data.weight,
      rpe: data.rpe ?? undefined,
      notes: data.notes ?? undefined,
    })

    await setRepo.save(set)

    res.status(201).json(set)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Erreur de validation', details: error.errors })
    }
    console.error('Error adding set:', error)
    res.status(500).json({ error: 'Erreur lors de l\'ajout de la série' })
  }
})

// Update set
router.put('/:workoutId/exercises/:exerciseId/sets/:setId', authenticate, async (req: AuthRequest, res) => {
  try {
    const workoutId = parseId(req.params.workoutId)
    const exerciseId = parseId(req.params.exerciseId)
    const setId = parseId(req.params.setId)
    const data = addSetSchema.partial().parse(req.body)

    // Verify workout belongs to user
    const workout = await workoutRepo.findOne({
      where: { id: workoutId, userId: req.user!.id }
    })

    if (!workout) {
      return res.status(404).json({ error: 'Séance non trouvée' })
    }

    const set = await setRepo.findOne({
      where: { id: setId, exerciseId },
      relations: ['exercise']
    })

    if (!set || set.exercise.workoutId !== workoutId) {
      return res.status(404).json({ error: 'Série non trouvée' })
    }

    Object.assign(set, data)
    await setRepo.save(set)

    res.json({ message: 'Série mise à jour', set })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Erreur de validation', details: error.errors })
    }
    console.error('Error updating set:', error)
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la série' })
  }
})

// Delete set
router.delete('/:workoutId/exercises/:exerciseId/sets/:setId', authenticate, async (req: AuthRequest, res) => {
  try {
    const workoutId = parseId(req.params.workoutId)
    const exerciseId = parseId(req.params.exerciseId)
    const setId = parseId(req.params.setId)

    // Verify workout belongs to user
    const workout = await workoutRepo.findOne({
      where: { id: workoutId, userId: req.user!.id }
    })

    if (!workout) {
      return res.status(404).json({ error: 'Séance non trouvée' })
    }

    const set = await setRepo.findOne({
      where: { id: setId, exerciseId },
      relations: ['exercise']
    })

    if (!set || set.exercise.workoutId !== workoutId) {
      return res.status(404).json({ error: 'Série non trouvée' })
    }

    await setRepo.remove(set)

    res.json({ message: 'Série supprimée' })
  } catch (error) {
    console.error('Error deleting set:', error)
    res.status(500).json({ error: 'Erreur lors de la suppression de la série' })
  }
})

// Get exercise history (last sets for a specific exercise)
router.get('/history/exercise/:exerciseLibraryId', authenticate, async (req: AuthRequest, res) => {
  try {
    const exerciseLibraryId = parseId(req.params.exerciseLibraryId)

    // Find the most recent completed workout with this exercise
    // Step 1: get the most recent exercise ID (subquery avoids LIMIT+JOIN bug in TypeORM)
    const latestExercise = await exerciseRepo
      .createQueryBuilder('exercise')
      .innerJoin('exercise.workout', 'workout')
      .select('exercise.id')
      .where('workout.userId = :userId', { userId: req.user!.id })
      .andWhere('exercise.exerciseLibraryId = :exerciseLibraryId', { exerciseLibraryId })
      .andWhere('workout.completedAt IS NOT NULL')
      .orderBy('workout.completedAt', 'DESC')
      .limit(1)
      .getRawOne()

    // Step 2: load that exercise with its sets
    const recentExercise = latestExercise
      ? await exerciseRepo.findOne({
          where: { id: latestExercise.exercise_id },
          relations: ['sets', 'workout'],
          order: { sets: { setNumber: 'ASC' } }
        })
      : null

    // Get ALL sets from the most recent exercise
    const lastSets = recentExercise?.sets || []

    res.json({
      exerciseLibraryId,
      lastSets,
      lastWorkoutDate: recentExercise?.workout?.completedAt || null
    })
  } catch (error) {
    console.error('Error fetching exercise history:', error)
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'historique' })
  }
})

export default router
