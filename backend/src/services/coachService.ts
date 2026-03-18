import { AppDataSource } from '../config/database.js'
import { Workout } from '../entities/Workout.js'
import { MuscleGroup } from '../entities/ExerciseLibrary.js'
import { MoreThanOrEqual } from 'typeorm'

export interface CoachInsight {
  id: string
  type: 'warning' | 'tip' | 'encouragement'
  icon: string
  title: string
  message: string
  priority: number  // 1 = haute, 3 = basse
}

/**
 * Génère des insights personnalisés basés sur les données de l'utilisateur.
 * Purement basé sur des règles, pas d'IA externe.
 */
export async function generateInsights(userId: number): Promise<CoachInsight[]> {
  const insights: CoachInsight[] = []

  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)

  const workoutRepo = AppDataSource.getRepository(Workout)

  // Récupérer les séances des 30 derniers jours avec exercices (max 50 pour perf)
  const recentWorkouts = await workoutRepo.find({
    where: { userId, completedAt: MoreThanOrEqual(thirtyDaysAgo), isTemplate: false },
    relations: ['exercises', 'exercises.exerciseLibrary'],
    order: { completedAt: 'DESC' },
    take: 50
  })

  const thisWeekWorkouts = recentWorkouts.filter(w =>
    w.completedAt && new Date(w.completedAt) >= sevenDaysAgo
  )

  const lastTwoWeeksWorkouts = recentWorkouts.filter(w =>
    w.completedAt && new Date(w.completedAt) >= fourteenDaysAgo
  )

  // === 1. Détection de déséquilibre musculaire (Push vs Pull) ===
  const muscleCount: Record<string, number> = {}
  for (const workout of recentWorkouts) {
    for (const exercise of workout.exercises || []) {
      const groups = exercise.exerciseLibrary?.muscleGroups || []
      for (const group of groups) {
        muscleCount[group] = (muscleCount[group] || 0) + 1
      }
    }
  }

  const pushMuscles = (muscleCount[MuscleGroup.CHEST] || 0) + (muscleCount[MuscleGroup.SHOULDERS] || 0) + (muscleCount[MuscleGroup.TRICEPS] || 0)
  const pullMuscles = (muscleCount[MuscleGroup.BACK] || 0) + (muscleCount[MuscleGroup.BICEPS] || 0)

  if (pushMuscles > 0 && pullMuscles > 0 && pushMuscles > pullMuscles * 2) {
    insights.push({
      id: 'imbalance_push_pull',
      type: 'warning',
      icon: '⚖️',
      title: 'Déséquilibre push/pull',
      message: `Tu fais ${pushMuscles} exercices push pour ${pullMuscles} pull ce mois. Ajoute plus de rowing et tirages pour équilibrer.`,
      priority: 1
    })
  } else if (pullMuscles > 0 && pushMuscles > 0 && pullMuscles > pushMuscles * 2) {
    insights.push({
      id: 'imbalance_pull_push',
      type: 'warning',
      icon: '⚖️',
      title: 'Déséquilibre pull/push',
      message: `Tu fais ${pullMuscles} exercices pull pour ${pushMuscles} push ce mois. Ajoute plus de développés et press.`,
      priority: 1
    })
  }

  // === 2. Jambes négligées ===
  const legMuscles = (muscleCount[MuscleGroup.LEGS] || 0) + (muscleCount[MuscleGroup.QUADS] || 0) + (muscleCount[MuscleGroup.HAMSTRINGS] || 0) + (muscleCount[MuscleGroup.GLUTES] || 0)
  const upperMuscles = pushMuscles + pullMuscles
  if (recentWorkouts.length >= 4 && upperMuscles > 0 && legMuscles === 0) {
    insights.push({
      id: 'skip_leg_day',
      type: 'warning',
      icon: '🦵',
      title: 'Leg day oublié ?',
      message: `Aucun exercice jambes sur tes ${recentWorkouts.length} dernières séances. N'oublie pas le bas du corps !`,
      priority: 1
    })
  }

  // === 3. Stagnation détectée ===
  if (recentWorkouts.length >= 6) {
    const exerciseNames = new Map<string, number[]>()
    for (const workout of recentWorkouts) {
      for (const exercise of workout.exercises || []) {
        for (const set of exercise.sets || []) {
          if (set.weight > 0) {
            const existing = exerciseNames.get(exercise.name) || []
            existing.push(set.weight)
            exerciseNames.set(exercise.name, existing)
          }
        }
      }
    }

    for (const [name, weights] of exerciseNames) {
      if (weights.length >= 8) {
        const recent = weights.slice(0, 4)
        const older = weights.slice(4, 8)
        const recentMax = Math.max(...recent)
        const olderMax = Math.max(...older)
        if (recentMax <= olderMax && olderMax > 0) {
          insights.push({
            id: `stagnation_${name.toLowerCase().replace(/\s/g, '_')}`,
            type: 'tip',
            icon: '📉',
            title: `${name} : plateau détecté`,
            message: `Ton max sur ${name} stagne depuis 3+ semaines. Essaie de varier : rep ranges, pauses, tempo.`,
            priority: 2
          })
          break // Un seul insight de stagnation
        }
      }
    }
  }

  // === 4. Fréquence d'entraînement ===
  if (thisWeekWorkouts.length === 0 && recentWorkouts.length > 0) {
    const lastWorkout = recentWorkouts[0]
    const daysSince = Math.floor((now.getTime() - new Date(lastWorkout.completedAt!).getTime()) / (1000 * 60 * 60 * 24))
    if (daysSince >= 5) {
      insights.push({
        id: 'inactivity',
        type: 'warning',
        icon: '⏰',
        title: `${daysSince} jours sans séance`,
        message: 'La régularité est la clé. Même une séance courte vaut mieux que rien !',
        priority: 1
      })
    }
  }

  // === 5. Volume en hausse (encouragement) ===
  if (lastTwoWeeksWorkouts.length >= 2) {
    const thisWeekVolume = thisWeekWorkouts.reduce((sum, w) => sum + (w.totalVolume || 0), 0)
    const lastWeekWorkouts = lastTwoWeeksWorkouts.filter(w =>
      w.completedAt && new Date(w.completedAt) < sevenDaysAgo
    )
    const lastWeekVolume = lastWeekWorkouts.reduce((sum, w) => sum + (w.totalVolume || 0), 0)

    if (lastWeekVolume > 0 && thisWeekVolume > lastWeekVolume * 1.1) {
      const increase = Math.round(((thisWeekVolume - lastWeekVolume) / lastWeekVolume) * 100)
      insights.push({
        id: 'volume_up',
        type: 'encouragement',
        icon: '📈',
        title: 'Volume en hausse !',
        message: `+${increase}% de volume cette semaine par rapport à la précédente. Continue comme ça !`,
        priority: 3
      })
    }
  }

  // === 6. Durée de séance trop longue ===
  const longWorkouts = thisWeekWorkouts.filter(w => w.duration && w.duration > 7200) // > 2h
  if (longWorkouts.length >= 2) {
    insights.push({
      id: 'long_workouts',
      type: 'tip',
      icon: '⏱️',
      title: 'Séances longues',
      message: 'Tes séances dépassent souvent 2h. Des séances plus courtes et intenses sont souvent plus efficaces.',
      priority: 2
    })
  }

  // === 7. Bonne régularité ===
  if (thisWeekWorkouts.length >= 3 && !insights.some(i => i.type === 'encouragement')) {
    insights.push({
      id: 'good_frequency',
      type: 'encouragement',
      icon: '🔥',
      title: 'Bonne régularité',
      message: `${thisWeekWorkouts.length} séances cette semaine, tu es sur la bonne voie !`,
      priority: 3
    })
  }

  // Trier par priorité
  insights.sort((a, b) => a.priority - b.priority)

  return insights.slice(0, 5) // Max 5 insights
}
