import express from 'express'
import { z } from 'zod'
import { AppDataSource } from '../config/database.js'
import { ExerciseLibrary, MuscleGroup, Equipment, Difficulty } from '../entities/ExerciseLibrary.js'
import { authenticate } from '../middlewares/auth.js'
import { logger } from '../utils/logger.js'
import { requireAdmin } from '../middlewares/admin.js'
import { parseId } from '../utils/validation.js'
import { Like } from 'typeorm'
import { isHttpError } from '../utils/errors.js'

const router = express.Router()

const exerciseLibraryRepo = AppDataSource.getRepository(ExerciseLibrary)

const handleRouteError = (res: express.Response, error: unknown, fallbackMessage: string) => {
  if (isHttpError(error)) {
    return res.status(error.statusCode).json({ error: error.message })
  }
  return res.status(500).json({ error: fallbackMessage })
}

// Validation schema
const createExerciseSchema = z.object({
  name: z.string().max(200),
  description: z.string().max(2000).nullish(),
  instructions: z.string().max(2000).nullish(),
  muscleGroups: z.array(z.nativeEnum(MuscleGroup)).nullish(),
  primaryMuscle: z.nativeEnum(MuscleGroup).nullish(),
  equipment: z.nativeEnum(Equipment),
  difficulty: z.nativeEnum(Difficulty),
  videoUrl: z.string().url().nullish(),
  imageUrl: z.string().url().nullish()
})

// Get all exercises (with optional filters)
router.get('/', authenticate, async (req, res) => {
  try {
    const {
      search,
      muscleGroup,
      equipment,
      difficulty
    } = req.query

    const limit = Math.min(Math.max(parseInt(req.query.limit as string, 10) || 50, 1), 100)
    const offset = Math.max(parseInt(req.query.offset as string, 10) || 0, 0)

    const queryBuilder = exerciseLibraryRepo.createQueryBuilder('exercise')

    // Search by name
    if (search && typeof search === 'string' && search.length > 100) {
      return res.status(400).json({ error: 'La recherche ne peut pas dépasser 100 caractères' })
    }
    if (search && typeof search === 'string') {
      queryBuilder.andWhere('exercise.name ILIKE :search', {
        search: `%${search}%`
      })
    }

    // Filter by muscle group (validated against enum)
    if (muscleGroup && typeof muscleGroup === 'string') {
      const mg = muscleGroup.toUpperCase()
      if (Object.values(MuscleGroup).includes(mg as MuscleGroup)) {
        queryBuilder.andWhere(':muscleGroup = ANY(exercise.muscleGroups)', { muscleGroup: mg })
      }
    }

    // Filter by equipment (validated against enum)
    if (equipment && typeof equipment === 'string') {
      const eq = equipment.toUpperCase()
      if (Object.values(Equipment).includes(eq as Equipment)) {
        queryBuilder.andWhere('exercise.equipment = :equipment', { equipment: eq })
      }
    }

    // Filter by difficulty (validated against enum)
    if (difficulty && typeof difficulty === 'string') {
      const diff = difficulty.toUpperCase()
      if (Object.values(Difficulty).includes(diff as Difficulty)) {
        queryBuilder.andWhere('exercise.difficulty = :difficulty', { difficulty: diff })
      }
    }

    // Pagination
    queryBuilder
      .orderBy('exercise.name', 'ASC')
      .take(limit)
      .skip(offset)

    const [exercises, total] = await queryBuilder.getManyAndCount()

    res.json({
      exercises,
      total,
      limit,
      offset
    })
  } catch (error) {
    logger.error({ err: error, route: 'exercises' }, 'Error fetching exercises')
    res.status(500).json({ error: 'Erreur lors de la récupération des exercices' })
  }
})

// Get single exercise by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const exercise = await exerciseLibraryRepo.findOne({
      where: { id: parseId(req.params.id) }
    })

    if (!exercise) {
      return res.status(404).json({ error: 'Exercice non trouvé' })
    }

    res.json(exercise)
  } catch (error) {
    logger.error({ err: error, route: 'exercises' }, 'Error fetching exercise')
    handleRouteError(res, error, 'Erreur lors de la récupération de l\'exercice')
  }
})

// Get exercises by muscle group
router.get('/muscle/:muscleGroup', authenticate, async (req, res) => {
  try {
    const muscleGroup = req.params.muscleGroup.toUpperCase()

    // Valider que le groupe musculaire est dans la whitelist
    if (!Object.values(MuscleGroup).includes(muscleGroup as MuscleGroup)) {
      return res.status(400).json({ error: 'Groupe musculaire invalide' })
    }

    const exercises = await exerciseLibraryRepo
      .createQueryBuilder('exercise')
      .where(':muscleGroup = ANY(exercise.muscleGroups)', { muscleGroup })
      .orderBy('exercise.name', 'ASC')
      .getMany()

    res.json(exercises)
  } catch (error) {
    logger.error({ err: error, route: 'exercises' }, 'Error fetching exercises by muscle group')
    res.status(500).json({ error: 'Erreur lors de la récupération des exercices' })
  }
})

// Create new exercise (admin only)
router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const data = createExerciseSchema.parse(req.body)

    // Check if exercise already exists
    const existing = await exerciseLibraryRepo.findOne({
      where: { name: data.name }
    })

    if (existing) {
      return res.status(409).json({ error: 'Exercice déjà existant' })
    }

    const exercise = exerciseLibraryRepo.create({
      name: data.name,
      equipment: data.equipment,
      difficulty: data.difficulty,
      description: data.description ?? undefined,
      instructions: data.instructions ?? undefined,
      muscleGroups: data.muscleGroups ?? undefined,
      primaryMuscle: data.primaryMuscle ?? undefined,
      videoUrl: data.videoUrl ?? undefined,
      imageUrl: data.imageUrl ?? undefined,
    })
    await exerciseLibraryRepo.save(exercise)

    res.status(201).json(exercise)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Erreur de validation', details: error.errors })
    }
    logger.error({ err: error, route: 'exercises' }, 'Error creating exercise')
    res.status(500).json({ error: 'Erreur lors de la création de l\'exercice' })
  }
})

// Update exercise (admin only)
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const data = createExerciseSchema.partial().parse(req.body)

    const exercise = await exerciseLibraryRepo.findOne({
      where: { id: parseId(req.params.id) }
    })

    if (!exercise) {
      return res.status(404).json({ error: 'Exercice non trouvé' })
    }

    if (data.name != null) exercise.name = data.name
    if (data.description !== undefined) exercise.description = data.description ?? undefined
    if (data.instructions !== undefined) exercise.instructions = data.instructions ?? undefined
    if (data.muscleGroups != null) exercise.muscleGroups = data.muscleGroups
    if (data.primaryMuscle !== undefined) exercise.primaryMuscle = data.primaryMuscle ?? undefined
    if (data.equipment != null) exercise.equipment = data.equipment
    if (data.difficulty != null) exercise.difficulty = data.difficulty
    if (data.videoUrl !== undefined) exercise.videoUrl = data.videoUrl ?? undefined
    if (data.imageUrl !== undefined) exercise.imageUrl = data.imageUrl ?? undefined
    await exerciseLibraryRepo.save(exercise)

    res.json({ message: 'Exercice mis à jour', exercise })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Erreur de validation', details: error.errors })
    }
    logger.error({ err: error, route: 'exercises' }, 'Error updating exercise')
    handleRouteError(res, error, 'Erreur lors de la mise à jour de l\'exercice')
  }
})

// Delete exercise (admin only)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const result = await exerciseLibraryRepo.delete({ id: parseId(req.params.id) })

    if (result.affected === 0) {
      return res.status(404).json({ error: 'Exercice non trouvé' })
    }

    res.json({ message: 'Exercice supprimé' })
  } catch (error) {
    logger.error({ err: error, route: 'exercises' }, 'Error deleting exercise')
    handleRouteError(res, error, 'Erreur lors de la suppression de l\'exercice')
  }
})

export default router
