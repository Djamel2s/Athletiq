import express from 'express'
import { z } from 'zod'
import { AppDataSource } from '../config/database.js'
import { Workout } from '../entities/Workout.js'
import { Exercise } from '../entities/Exercise.js'
import { logger } from '../utils/logger.js'
import { Set } from '../entities/Set.js'

import { authenticate, AuthRequest } from '../middlewares/auth.js'
import { checkAndCreatePRNotifications, checkStreakMilestone, createFeedPostForWorkout } from '../services/notificationService.js'
import { checkAndUnlockAchievements } from '../services/achievementService.js'
import { checkWorkoutLimit, checkTemplateLimit, getUserPlanType, withUserLock } from '../services/limitService.js'
import { PLAN_LIMITS } from '../config/planLimits.js'
import { MoreThanOrEqual, Not, IsNull } from 'typeorm'
import { parseId } from '../utils/validation.js'
import rateLimit from 'express-rate-limit'

const router = express.Router()

const exportLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5, message: { error: 'Too many export requests' } })

// Repositories
const workoutRepo = AppDataSource.getRepository(Workout)
const exerciseRepo = AppDataSource.getRepository(Exercise)
const setRepo = AppDataSource.getRepository(Set)


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
  supersetGroup: z.number().nullish(),
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
  supersetGroup: z.number().nullish(),
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

    const limit = Math.min(Math.max(parseInt(req.query.limit as string, 10) || 50, 1), 100)
    const offset = Math.min(Math.max(parseInt(req.query.offset as string, 10) || 0, 0), 10000)

    const where: any = { userId: req.user!.id }

    // Limiter l'historique pour le plan gratuit
    if (historyDays !== Infinity) {
      const cutoff = new Date()
      cutoff.setDate(cutoff.getDate() - historyDays)
      where.date = MoreThanOrEqual(cutoff)
    }

    const [workouts, total] = await workoutRepo.findAndCount({
      where,
      relations: ['exercises'],
      order: { date: 'DESC' },
      take: limit,
      skip: offset
    })

    res.json({ workouts, historyLimited: historyDays !== Infinity, total, limit, offset })
  } catch (error) {
    logger.error({ err: error, route: 'workouts' }, 'Error fetching workouts')
    res.status(500).json({ error: 'Erreur lors de la récupération des séances' })
  }
})

// Export workouts as CSV
router.get('/export/csv', authenticate, exportLimiter, async (req: AuthRequest, res) => {
  try {
    const workouts = await workoutRepo.find({
      where: { userId: req.user!.id, completedAt: Not(IsNull()) },
      relations: ['exercises', 'exercises.sets'],
      order: { date: 'DESC' }
    })

    const csvEscape = (val: string | undefined | null): string => {
      if (val == null) return ''
      const str = String(val)
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`
      }
      return str
    }

    const rows: string[] = ['Date,Workout,Exercise,Set,Reps,Weight(kg),Volume(kg),RPE,Notes']

    for (const workout of workouts) {
      const dateStr = workout.date ? new Date(workout.date).toISOString().split('T')[0] : ''
      const workoutName = csvEscape(workout.name)

      if (!workout.exercises || workout.exercises.length === 0) {
        rows.push(`${dateStr},${workoutName},,,,,,, `)
        continue
      }

      for (const exercise of workout.exercises) {
        const exerciseName = csvEscape(exercise.name)

        if (!exercise.sets || exercise.sets.length === 0) {
          rows.push(`${dateStr},${workoutName},${exerciseName},,,,,,`)
          continue
        }

        const sortedSets = [...exercise.sets].sort((a, b) => a.setNumber - b.setNumber)
        for (const set of sortedSets) {
          const volume = (set.weight && set.reps) ? set.weight * set.reps : ''
          rows.push(
            `${dateStr},${workoutName},${exerciseName},${set.setNumber},${set.reps ?? ''},${set.weight ?? ''},${volume},${set.rpe ?? ''},${csvEscape(set.notes)}`
          )
        }
      }
    }

    const csv = rows.join('\n')

    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment; filename="athletiq-export.csv"')
    res.send(csv)
  } catch (error) {
    logger.error({ err: error, route: 'workouts' }, 'Error exporting workouts CSV')
    res.status(500).json({ error: 'Erreur lors de l\'export des séances' })
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
    logger.error({ err: error, route: 'workouts' }, 'Error fetching workout')
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
    logger.error({ err: error, route: 'workouts' }, 'Error creating workout')
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
    logger.error({ err: error, route: 'workouts' }, 'Error updating workout')
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
    logger.error({ err: error, route: 'workouts' }, 'Error deleting workout')
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
    logger.error({ err: error, route: 'workouts' }, 'Error starting workout')
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

      // Fire-and-forget: check for PR, streak notifications and achievements
      checkAndCreatePRNotifications(userId, workout.id).catch(err => logger.error({ err, userId, workoutId: workout.id, route: 'workouts' }, 'PR notification job failed'))
      checkStreakMilestone(userId).catch(err => logger.error({ err, userId, route: 'workouts' }, 'Streak check job failed'))
      checkAndUnlockAchievements(userId).catch(err => logger.error({ err, userId, route: 'workouts' }, 'Achievement check failed'))

      // Auto-post to feed
      createFeedPostForWorkout(
        userId,
        workout.name,
        workout.duration,
        workout.exercises?.length || 0,
        workout.totalVolume
      ).catch(err => logger.error({ err, userId, route: 'workouts' }, 'Feed post creation failed'))

      return { status: 200, body: { message: 'Séance terminée', workout: updatedWorkout } }
    })

    res.status(result.status).json(result.body)
  } catch (error) {
    logger.error({ err: error, route: 'workouts' }, 'Error completing workout')
    res.status(500).json({ error: 'Erreur lors de la complétion de la séance' })
  }
})

// Duplicate workout template
router.post('/:id/duplicate', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id
    const workoutId = parseId(req.params.id)

    // Find the original workout with exercises
    const original = await workoutRepo.findOne({
      where: { id: workoutId, userId },
      relations: ['exercises']
    })

    if (!original) {
      return res.status(404).json({ error: 'Séance non trouvée' })
    }

    // Check template limit
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

      // Create the duplicate workout
      const duplicate = workoutRepo.create({
        name: original.name + ' (copie)',
        description: original.description,
        isTemplate: true,
        date: new Date(),
        userId
      })

      await workoutRepo.save(duplicate)

      // Copy exercises
      if (original.exercises && original.exercises.length > 0) {
        for (const ex of original.exercises) {
          const newExercise = exerciseRepo.create({
            workoutId: duplicate.id,
            name: ex.name,
            exerciseLibraryId: ex.exerciseLibraryId ?? undefined,
            orderIndex: ex.orderIndex ?? undefined,
            targetSets: ex.targetSets ?? undefined,
            targetReps: ex.targetReps ?? undefined,
            targetWeight: ex.targetWeight ?? undefined,
            restTime: ex.restTime ?? undefined,
            supersetGroup: ex.supersetGroup ?? undefined,
            plannedSets: ex.plannedSets ?? undefined
          })
          await exerciseRepo.save(newExercise)
        }
      }

      // Return the full duplicate with relations
      const savedDuplicate = await workoutRepo.findOne({
        where: { id: duplicate.id },
        relations: ['exercises', 'exercises.sets', 'exercises.exerciseLibrary']
      })

      return { status: 201, body: savedDuplicate }
    })

    res.status(result.status).json(result.body)
  } catch (error) {
    logger.error({ err: error, route: 'workouts' }, 'Error duplicating workout')
    res.status(500).json({ error: 'Erreur lors de la duplication de la séance' })
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
      supersetGroup: data.supersetGroup ?? undefined,
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
    logger.error({ err: error, route: 'workouts' }, 'Error adding exercise')
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

    if (data.exerciseLibraryId !== undefined) exercise.exerciseLibraryId = data.exerciseLibraryId ?? undefined
    if (data.name != null) exercise.name = data.name
    if (data.orderIndex != null) exercise.orderIndex = data.orderIndex
    if (data.notes !== undefined) exercise.notes = data.notes ?? undefined
    if (data.targetSets !== undefined) exercise.targetSets = data.targetSets ?? undefined
    if (data.targetReps !== undefined) exercise.targetReps = data.targetReps ?? undefined
    if (data.targetWeight !== undefined) exercise.targetWeight = data.targetWeight ?? undefined
    if (data.restTime !== undefined) exercise.restTime = data.restTime ?? undefined
    if (data.supersetGroup !== undefined) exercise.supersetGroup = data.supersetGroup ?? undefined
    if (data.plannedSets !== undefined) exercise.plannedSets = data.plannedSets ?? undefined
    await exerciseRepo.save(exercise)

    res.json({ message: 'Exercice mis à jour', exercise })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Erreur de validation', details: error.errors })
    }
    logger.error({ err: error, route: 'workouts' }, 'Error updating exercise')
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
    logger.error({ err: error, route: 'workouts' }, 'Error deleting exercise')
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
    logger.error({ err: error, route: 'workouts' }, 'Error adding set')
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

    if (data.setNumber != null) set.setNumber = data.setNumber
    if (data.reps != null) set.reps = data.reps
    if (data.weight != null) set.weight = data.weight
    if (data.rpe !== undefined) set.rpe = data.rpe ?? undefined
    if (data.notes !== undefined) set.notes = data.notes ?? undefined
    await setRepo.save(set)

    res.json({ message: 'Série mise à jour', set })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Erreur de validation', details: error.errors })
    }
    logger.error({ err: error, route: 'workouts' }, 'Error updating set')
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
    logger.error({ err: error, route: 'workouts' }, 'Error deleting set')
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
    logger.error({ err: error, route: 'workouts' }, 'Error fetching exercise history')
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'historique' })
  }
})

export default router
