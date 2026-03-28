import express from 'express'
import crypto from 'crypto'
import { AppDataSource } from '../config/database.js'
import { Workout } from '../entities/Workout.js'
import { Exercise } from '../entities/Exercise.js'
import { logger } from '../utils/logger.js'
import { authenticate, AuthRequest } from '../middlewares/auth.js'
import { checkTemplateLimit, withUserLock } from '../services/limitService.js'

const router = express.Router()
const workoutRepo = AppDataSource.getRepository(Workout)
const exerciseRepo = AppDataSource.getRepository(Exercise)

// ============================================================
// POST /api/share/:workoutId — Générer un lien de partage pour un template
// ============================================================
router.post('/:workoutId', authenticate, async (req: AuthRequest, res) => {
  try {
    const workoutId = parseInt(req.params.workoutId, 10)
    if (isNaN(workoutId)) return res.status(400).json({ error: 'ID invalide' })

    const workout = await workoutRepo.findOne({
      where: { id: workoutId, userId: req.user!.id, isTemplate: true }
    })

    if (!workout) {
      return res.status(404).json({ error: 'Template non trouvé' })
    }

    // Si déjà partagé, retourner le token existant
    if (workout.shareToken) {
      return res.json({ shareToken: workout.shareToken })
    }

    // Générer un token court et unique
    const token = crypto.randomBytes(6).toString('base64url') // ~8 chars
    workout.shareToken = token
    await workoutRepo.save(workout)

    res.json({ shareToken: token })
  } catch (error) {
    logger.error({ err: error, route: 'share' }, 'Error sharing workout')
    res.status(500).json({ error: 'Erreur lors du partage' })
  }
})

// ============================================================
// DELETE /api/share/:workoutId — Supprimer le lien de partage
// ============================================================
router.delete('/:workoutId', authenticate, async (req: AuthRequest, res) => {
  try {
    const workoutId = parseInt(req.params.workoutId, 10)
    if (isNaN(workoutId)) return res.status(400).json({ error: 'ID invalide' })

    const workout = await workoutRepo.findOne({
      where: { id: workoutId, userId: req.user!.id }
    })

    if (!workout) return res.status(404).json({ error: 'Template non trouvé' })

    workout.shareToken = undefined
    await workoutRepo.save(workout)

    res.json({ message: 'Partage désactivé' })
  } catch (error) {
    logger.error({ err: error, route: 'share' }, 'Error unsharing workout')
    res.status(500).json({ error: 'Erreur' })
  }
})

// ============================================================
// GET /api/share/view/:token — Voir un template partagé (public)
// ============================================================
router.get('/view/:token', async (req, res) => {
  try {
    const { token } = req.params
    if (!token || !/^[A-Za-z0-9_-]{6,20}$/.test(token)) return res.status(400).json({ error: 'Token invalide' })

    const workout = await workoutRepo.findOne({
      where: { shareToken: token, isTemplate: true },
      relations: ['exercises', 'exercises.exerciseLibrary', 'user']
    })

    if (!workout) {
      return res.status(404).json({ error: 'Template non trouvé ou partage désactivé' })
    }

    // Trier les exercices par orderIndex
    if (workout.exercises) {
      workout.exercises.sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
    }

    // Retourner sans données sensibles de l'utilisateur
    res.json({
      id: workout.id,
      name: workout.name,
      description: workout.description,
      notes: workout.notes,
      sharedBy: {
        firstName: (workout.user as any)?.firstName || null,
        avatarUrl: (workout.user as any)?.avatarUrl || null,
      },
      exercises: workout.exercises.map(e => ({
        name: e.name,
        orderIndex: e.orderIndex,
        targetSets: e.targetSets,
        targetReps: e.targetReps,
        targetWeight: e.targetWeight,
        restTime: e.restTime,
        notes: e.notes,
        plannedSets: e.plannedSets,
        exerciseLibraryId: e.exerciseLibraryId,
        exerciseLibrary: e.exerciseLibrary ? {
          id: e.exerciseLibrary.id,
          name: e.exerciseLibrary.name,
          imageUrl: e.exerciseLibrary.imageUrl,
          primaryMuscle: e.exerciseLibrary.primaryMuscle,
          equipment: e.exerciseLibrary.equipment,
        } : null,
      })),
      createdAt: workout.createdAt,
    })
  } catch (error) {
    logger.error({ err: error, route: 'share' }, 'Error viewing shared workout')
    res.status(500).json({ error: 'Erreur' })
  }
})

// ============================================================
// POST /api/share/import/:token — Importer un template partagé
// ============================================================
router.post('/import/:token', authenticate, async (req: AuthRequest, res) => {
  try {
    const { token } = req.params
    if (!token || !/^[A-Za-z0-9_-]{6,20}$/.test(token)) return res.status(400).json({ error: 'Token invalide' })

    const userId = req.user!.id

    const result = await withUserLock(userId, 'import-template', async () => {
      // Vérifier la limite de templates
      const templateCheck = await checkTemplateLimit(userId)
      if (!templateCheck.allowed) {
        return {
          status: 403,
          body: {
            error: 'Limite de templates atteinte',
            code: 'LIMIT_TEMPLATES',
            current: templateCheck.current,
            limit: templateCheck.limit
          }
        }
      }

      // Charger le template source
      const source = await workoutRepo.findOne({
        where: { shareToken: token, isTemplate: true },
        relations: ['exercises', 'exercises.exerciseLibrary']
      })

      if (!source) {
        return { status: 404, body: { error: 'Template non trouvé ou partage désactivé' } }
      }

      // Créer la copie
      const newWorkout = workoutRepo.create({
        userId,
        name: source.name,
        description: source.description,
        notes: source.notes,
        isTemplate: true,
        date: new Date(),
      })
      await workoutRepo.save(newWorkout)

      // Copier les exercices
      const sortedExercises = [...(source.exercises || [])].sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))

      for (const srcExercise of sortedExercises) {
        const exercise = exerciseRepo.create({
          workoutId: newWorkout.id,
          exerciseLibraryId: srcExercise.exerciseLibraryId || undefined,
          name: srcExercise.name,
          orderIndex: srcExercise.orderIndex,
          notes: srcExercise.notes,
          targetSets: srcExercise.targetSets,
          targetReps: srcExercise.targetReps,
          targetWeight: srcExercise.targetWeight,
          restTime: srcExercise.restTime,
          plannedSets: srcExercise.plannedSets,
        })
        await exerciseRepo.save(exercise)
      }

      // Charger le workout complet pour la réponse
      const saved = await workoutRepo.findOne({
        where: { id: newWorkout.id },
        relations: ['exercises', 'exercises.exerciseLibrary']
      })

      return { status: 201, body: saved }
    })

    res.status(result.status).json(result.body)
  } catch (error) {
    logger.error({ err: error, route: 'share' }, 'Error importing shared workout')
    res.status(500).json({ error: 'Erreur lors de l\'import' })
  }
})

export default router
