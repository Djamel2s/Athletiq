import { ProgramDifficulty, ProgramGoal } from '../entities/WorkoutProgram.js'

/**
 * Programmes prédéfinis — seedés au démarrage si absents.
 */
export const PROGRAM_SEEDS = [
  {
    name: 'Push / Pull / Legs (6j)',
    slug: 'ppl-6j',
    description: 'Le classique PPL en 6 jours. Idéal pour l\'hypertrophie avec un bon volume par groupe musculaire.',
    difficulty: ProgramDifficulty.INTERMEDIATE,
    goal: ProgramGoal.HYPERTROPHY,
    daysPerWeek: 6,
    durationWeeks: 8,
    icon: '💪',
    days: [
      {
        name: 'Push A',
        dayIndex: 0,
        exercises: [
          { exerciseName: 'Bench Press', sets: 4, reps: '8-10', restSeconds: 120 },
          { exerciseName: 'Overhead Press', sets: 3, reps: '8-10', restSeconds: 90 },
          { exerciseName: 'Incline Dumbbell Press', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Cable Lateral Raise', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseName: 'Tricep Pushdown', sets: 3, reps: '10-12', restSeconds: 60 },
          { exerciseName: 'Overhead Tricep Extension', sets: 3, reps: '10-12', restSeconds: 60 }
        ]
      },
      {
        name: 'Pull A',
        dayIndex: 1,
        exercises: [
          { exerciseName: 'Barbell Row', sets: 4, reps: '8-10', restSeconds: 120 },
          { exerciseName: 'Pull-up', sets: 3, reps: '6-10', restSeconds: 90 },
          { exerciseName: 'Cable Row', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Face Pull', sets: 3, reps: '15-20', restSeconds: 60 },
          { exerciseName: 'Barbell Curl', sets: 3, reps: '10-12', restSeconds: 60 },
          { exerciseName: 'Hammer Curl', sets: 3, reps: '10-12', restSeconds: 60 }
        ]
      },
      {
        name: 'Legs A',
        dayIndex: 2,
        exercises: [
          { exerciseName: 'Squat', sets: 4, reps: '6-8', restSeconds: 180 },
          { exerciseName: 'Romanian Deadlift', sets: 3, reps: '8-10', restSeconds: 120 },
          { exerciseName: 'Leg Press', sets: 3, reps: '10-12', restSeconds: 120 },
          { exerciseName: 'Leg Curl', sets: 3, reps: '10-12', restSeconds: 60 },
          { exerciseName: 'Calf Raise', sets: 4, reps: '12-15', restSeconds: 60 }
        ]
      },
      {
        name: 'Push B',
        dayIndex: 3,
        exercises: [
          { exerciseName: 'Overhead Press', sets: 4, reps: '6-8', restSeconds: 120 },
          { exerciseName: 'Dumbbell Bench Press', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Cable Fly', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseName: 'Lateral Raise', sets: 4, reps: '12-15', restSeconds: 60 },
          { exerciseName: 'Dips', sets: 3, reps: '8-12', restSeconds: 90 },
          { exerciseName: 'Tricep Pushdown', sets: 3, reps: '12-15', restSeconds: 60 }
        ]
      },
      {
        name: 'Pull B',
        dayIndex: 4,
        exercises: [
          { exerciseName: 'Deadlift', sets: 4, reps: '5-6', restSeconds: 180 },
          { exerciseName: 'Lat Pulldown', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Dumbbell Row', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Rear Delt Fly', sets: 3, reps: '15-20', restSeconds: 60 },
          { exerciseName: 'Incline Dumbbell Curl', sets: 3, reps: '10-12', restSeconds: 60 },
          { exerciseName: 'Preacher Curl', sets: 3, reps: '10-12', restSeconds: 60 }
        ]
      },
      {
        name: 'Legs B',
        dayIndex: 5,
        exercises: [
          { exerciseName: 'Front Squat', sets: 4, reps: '8-10', restSeconds: 150 },
          { exerciseName: 'Hip Thrust', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Bulgarian Split Squat', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Leg Extension', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseName: 'Leg Curl', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseName: 'Calf Raise', sets: 4, reps: '15-20', restSeconds: 60 }
        ]
      }
    ]
  },
  {
    name: 'Upper / Lower (4j)',
    slug: 'upper-lower-4j',
    description: 'Programme équilibré en 4 jours. Bon compromis entre volume et récupération.',
    difficulty: ProgramDifficulty.INTERMEDIATE,
    goal: ProgramGoal.HYPERTROPHY,
    daysPerWeek: 4,
    durationWeeks: 10,
    icon: '⚡',
    days: [
      {
        name: 'Upper A (Force)',
        dayIndex: 0,
        exercises: [
          { exerciseName: 'Bench Press', sets: 4, reps: '5-6', restSeconds: 180 },
          { exerciseName: 'Barbell Row', sets: 4, reps: '5-6', restSeconds: 180 },
          { exerciseName: 'Overhead Press', sets: 3, reps: '8-10', restSeconds: 120 },
          { exerciseName: 'Pull-up', sets: 3, reps: '6-10', restSeconds: 90 },
          { exerciseName: 'Lateral Raise', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseName: 'Barbell Curl', sets: 2, reps: '10-12', restSeconds: 60 },
          { exerciseName: 'Tricep Pushdown', sets: 2, reps: '10-12', restSeconds: 60 }
        ]
      },
      {
        name: 'Lower A (Force)',
        dayIndex: 1,
        exercises: [
          { exerciseName: 'Squat', sets: 4, reps: '5-6', restSeconds: 180 },
          { exerciseName: 'Romanian Deadlift', sets: 3, reps: '8-10', restSeconds: 120 },
          { exerciseName: 'Leg Press', sets: 3, reps: '10-12', restSeconds: 120 },
          { exerciseName: 'Leg Curl', sets: 3, reps: '10-12', restSeconds: 60 },
          { exerciseName: 'Calf Raise', sets: 4, reps: '12-15', restSeconds: 60 }
        ]
      },
      {
        name: 'Upper B (Hypertrophie)',
        dayIndex: 2,
        exercises: [
          { exerciseName: 'Incline Dumbbell Press', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Cable Row', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Dumbbell Shoulder Press', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Lat Pulldown', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Cable Fly', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseName: 'Face Pull', sets: 3, reps: '15-20', restSeconds: 60 },
          { exerciseName: 'Hammer Curl', sets: 2, reps: '12-15', restSeconds: 60 },
          { exerciseName: 'Overhead Tricep Extension', sets: 2, reps: '12-15', restSeconds: 60 }
        ]
      },
      {
        name: 'Lower B (Hypertrophie)',
        dayIndex: 3,
        exercises: [
          { exerciseName: 'Front Squat', sets: 3, reps: '8-10', restSeconds: 150 },
          { exerciseName: 'Hip Thrust', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Bulgarian Split Squat', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Leg Extension', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseName: 'Leg Curl', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseName: 'Calf Raise', sets: 4, reps: '15-20', restSeconds: 60 }
        ]
      }
    ]
  },
  {
    name: 'Full Body (3j)',
    slug: 'full-body-3j',
    description: 'Programme full body 3x par semaine. Parfait pour les débutants ou ceux avec peu de temps.',
    difficulty: ProgramDifficulty.BEGINNER,
    goal: ProgramGoal.GENERAL,
    daysPerWeek: 3,
    durationWeeks: 12,
    icon: '🏋️',
    days: [
      {
        name: 'Full Body A',
        dayIndex: 0,
        exercises: [
          { exerciseName: 'Squat', sets: 3, reps: '8-10', restSeconds: 150 },
          { exerciseName: 'Bench Press', sets: 3, reps: '8-10', restSeconds: 120 },
          { exerciseName: 'Barbell Row', sets: 3, reps: '8-10', restSeconds: 120 },
          { exerciseName: 'Overhead Press', sets: 2, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Lat Pulldown', sets: 2, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Plank', sets: 3, reps: '30-60s', restSeconds: 60 }
        ]
      },
      {
        name: 'Full Body B',
        dayIndex: 1,
        exercises: [
          { exerciseName: 'Deadlift', sets: 3, reps: '6-8', restSeconds: 180 },
          { exerciseName: 'Incline Dumbbell Press', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Cable Row', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Leg Press', sets: 3, reps: '10-12', restSeconds: 120 },
          { exerciseName: 'Lateral Raise', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseName: 'Barbell Curl', sets: 2, reps: '10-12', restSeconds: 60 }
        ]
      },
      {
        name: 'Full Body C',
        dayIndex: 2,
        exercises: [
          { exerciseName: 'Front Squat', sets: 3, reps: '8-10', restSeconds: 150 },
          { exerciseName: 'Dumbbell Bench Press', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Pull-up', sets: 3, reps: '6-10', restSeconds: 90 },
          { exerciseName: 'Romanian Deadlift', sets: 3, reps: '10-12', restSeconds: 120 },
          { exerciseName: 'Face Pull', sets: 3, reps: '15-20', restSeconds: 60 },
          { exerciseName: 'Tricep Pushdown', sets: 2, reps: '10-12', restSeconds: 60 }
        ]
      }
    ]
  },
  {
    name: 'Force 5/3/1 (4j)',
    slug: '531-4j',
    description: 'Programme de force basé sur le 5/3/1 de Jim Wendler. Progression lente mais solide sur les mouvements composés.',
    difficulty: ProgramDifficulty.ADVANCED,
    goal: ProgramGoal.STRENGTH,
    daysPerWeek: 4,
    durationWeeks: 12,
    icon: '🏆',
    days: [
      {
        name: 'Squat Day',
        dayIndex: 0,
        exercises: [
          { exerciseName: 'Squat', sets: 3, reps: '5/3/1', restSeconds: 240, notes: 'Semaine 1: 5-5-5+, Semaine 2: 3-3-3+, Semaine 3: 5-3-1+' },
          { exerciseName: 'Leg Press', sets: 5, reps: '10', restSeconds: 90, notes: 'Assistance — BBB 5x10 @50%' },
          { exerciseName: 'Leg Curl', sets: 3, reps: '10-12', restSeconds: 60 },
          { exerciseName: 'Plank', sets: 3, reps: '60s', restSeconds: 60 }
        ]
      },
      {
        name: 'Bench Day',
        dayIndex: 1,
        exercises: [
          { exerciseName: 'Bench Press', sets: 3, reps: '5/3/1', restSeconds: 240, notes: 'Semaine 1: 5-5-5+, Semaine 2: 3-3-3+, Semaine 3: 5-3-1+' },
          { exerciseName: 'Dumbbell Bench Press', sets: 5, reps: '10', restSeconds: 90, notes: 'Assistance — BBB 5x10' },
          { exerciseName: 'Dumbbell Row', sets: 3, reps: '10-12', restSeconds: 60 },
          { exerciseName: 'Tricep Pushdown', sets: 3, reps: '10-12', restSeconds: 60 }
        ]
      },
      {
        name: 'Deadlift Day',
        dayIndex: 2,
        exercises: [
          { exerciseName: 'Deadlift', sets: 3, reps: '5/3/1', restSeconds: 300, notes: 'Semaine 1: 5-5-5+, Semaine 2: 3-3-3+, Semaine 3: 5-3-1+' },
          { exerciseName: 'Romanian Deadlift', sets: 5, reps: '10', restSeconds: 90, notes: 'Assistance — BBB 5x10 @50%' },
          { exerciseName: 'Hip Thrust', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Hanging Leg Raise', sets: 3, reps: '10-15', restSeconds: 60 }
        ]
      },
      {
        name: 'OHP Day',
        dayIndex: 3,
        exercises: [
          { exerciseName: 'Overhead Press', sets: 3, reps: '5/3/1', restSeconds: 240, notes: 'Semaine 1: 5-5-5+, Semaine 2: 3-3-3+, Semaine 3: 5-3-1+' },
          { exerciseName: 'Dumbbell Shoulder Press', sets: 5, reps: '10', restSeconds: 90, notes: 'Assistance — BBB 5x10' },
          { exerciseName: 'Lat Pulldown', sets: 3, reps: '10-12', restSeconds: 60 },
          { exerciseName: 'Lateral Raise', sets: 3, reps: '15-20', restSeconds: 60 }
        ]
      }
    ]
  }
]
