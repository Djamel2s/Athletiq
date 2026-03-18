import express from 'express'
import { AppDataSource } from '../config/database.js'
import { WorkoutProgram } from '../entities/WorkoutProgram.js'
import { ProgramDay } from '../entities/ProgramDay.js'
import { Workout } from '../entities/Workout.js'
import { Exercise } from '../entities/Exercise.js'
import { ExerciseLibrary } from '../entities/ExerciseLibrary.js'
import { authenticate, AuthRequest } from '../middlewares/auth.js'
import { PROGRAM_SEEDS } from '../config/programSeeds.js'

const router = express.Router()
const programRepo = AppDataSource.getRepository(WorkoutProgram)
const programDayRepo = AppDataSource.getRepository(ProgramDay)
const workoutRepo = AppDataSource.getRepository(Workout)
const exerciseRepo = AppDataSource.getRepository(Exercise)
const exerciseLibraryRepo = AppDataSource.getRepository(ExerciseLibrary)

// Seed les programmes si la table est vide
export async function seedPrograms() {
  const count = await programRepo.count()
  if (count > 0) return

  for (const seed of PROGRAM_SEEDS) {
    const program = programRepo.create({
      name: seed.name,
      slug: seed.slug,
      description: seed.description,
      difficulty: seed.difficulty,
      goal: seed.goal,
      daysPerWeek: seed.daysPerWeek,
      durationWeeks: seed.durationWeeks,
      icon: seed.icon
    })
    await programRepo.save(program)

    for (const day of seed.days) {
      const programDay = programDayRepo.create({
        programId: program.id,
        name: day.name,
        dayIndex: day.dayIndex,
        exercises: day.exercises
      })
      await programDayRepo.save(programDay)
    }
  }
  console.log(`✅ ${PROGRAM_SEEDS.length} programmes seedés`)
}

// GET /api/programs — Liste tous les programmes
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const programs = await programRepo.find({
      where: { isActive: true },
      relations: ['days'],
      order: { popularity: 'DESC' }
    })
    res.json(programs)
  } catch (error) {
    console.error('Error fetching programs:', error)
    res.status(500).json({ error: 'Erreur lors de la récupération des programmes' })
  }
})

// Validation du slug : alphanumériques + tirets uniquement
function isValidSlug(slug: string): boolean {
  return /^[a-z0-9-]{1,50}$/.test(slug)
}

// GET /api/programs/:slug — Détail d'un programme
router.get('/:slug', authenticate, async (req: AuthRequest, res) => {
  try {
    if (!isValidSlug(req.params.slug)) {
      return res.status(400).json({ error: 'Slug invalide' })
    }
    const program = await programRepo.findOne({
      where: { slug: req.params.slug, isActive: true },
      relations: ['days']
    })
    if (!program) {
      return res.status(404).json({ error: 'Programme non trouvé' })
    }
    // Trier les jours par index
    program.days.sort((a, b) => a.dayIndex - b.dayIndex)
    res.json(program)
  } catch (error) {
    console.error('Error fetching program:', error)
    res.status(500).json({ error: 'Erreur' })
  }
})

// POST /api/programs/:slug/adopt — Adopter un programme (créer les templates)
router.post('/:slug/adopt', authenticate, async (req: AuthRequest, res) => {
  try {
    if (!isValidSlug(req.params.slug)) {
      return res.status(400).json({ error: 'Slug invalide' })
    }
    const program = await programRepo.findOne({
      where: { slug: req.params.slug, isActive: true },
      relations: ['days']
    })
    if (!program) {
      return res.status(404).json({ error: 'Programme non trouvé' })
    }

    const userId = req.user!.id
    const createdWorkouts: Workout[] = []

    // Créer un template pour chaque jour du programme
    for (const day of program.days.sort((a, b) => a.dayIndex - b.dayIndex)) {
      const workout = workoutRepo.create({
        name: `${program.name} — ${day.name}`,
        description: program.description,
        isTemplate: true,
        userId,
        date: new Date()
      })
      await workoutRepo.save(workout)

      // Créer les exercices du jour
      for (let i = 0; i < day.exercises.length; i++) {
        const ex = day.exercises[i]

        // Tenter de lier à la bibliothèque d'exercices
        const libraryExercise = await exerciseLibraryRepo.findOne({
          where: { name: ex.exerciseName }
        })

        const exercise = exerciseRepo.create({
          workoutId: workout.id,
          name: ex.exerciseName,
          exerciseLibraryId: libraryExercise?.id ?? undefined,
          orderIndex: i,
          targetSets: ex.sets,
          restTime: ex.restSeconds,
          notes: ex.notes ?? undefined
        })
        await exerciseRepo.save(exercise)
      }

      createdWorkouts.push(workout)
    }

    // Incrémenter la popularité
    program.popularity += 1
    await programRepo.save(program)

    res.status(201).json({
      message: `Programme "${program.name}" adopté avec ${createdWorkouts.length} templates créés`,
      workoutIds: createdWorkouts.map(w => w.id)
    })
  } catch (error) {
    console.error('Error adopting program:', error)
    res.status(500).json({ error: 'Erreur lors de l\'adoption du programme' })
  }
})

export default router
