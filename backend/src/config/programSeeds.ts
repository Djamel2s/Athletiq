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
  },

  // ═══════════════════════════════════════
  // 5. PHUL — Power Hypertrophy Upper Lower
  // ═══════════════════════════════════════
  {
    name: 'PHUL (4j)',
    slug: 'phul-4j',
    description: 'Power Hypertrophy Upper Lower. 2 jours force + 2 jours hypertrophie pour le meilleur des deux mondes.',
    difficulty: ProgramDifficulty.INTERMEDIATE,
    goal: ProgramGoal.HYPERTROPHY,
    daysPerWeek: 4,
    durationWeeks: 10,
    icon: '🔥',
    days: [
      {
        name: 'Upper Power',
        dayIndex: 0,
        exercises: [
          { exerciseName: 'Bench Press', sets: 4, reps: '3-5', restSeconds: 180 },
          { exerciseName: 'Barbell Row', sets: 4, reps: '3-5', restSeconds: 180 },
          { exerciseName: 'Overhead Press', sets: 3, reps: '5-8', restSeconds: 120 },
          { exerciseName: 'Pull-up', sets: 3, reps: '5-8', restSeconds: 120 },
          { exerciseName: 'Barbell Curl', sets: 2, reps: '6-8', restSeconds: 60 },
          { exerciseName: 'Skull Crusher', sets: 2, reps: '6-8', restSeconds: 60 }
        ]
      },
      {
        name: 'Lower Power',
        dayIndex: 1,
        exercises: [
          { exerciseName: 'Squat', sets: 4, reps: '3-5', restSeconds: 240 },
          { exerciseName: 'Deadlift', sets: 3, reps: '3-5', restSeconds: 240 },
          { exerciseName: 'Leg Press', sets: 3, reps: '8-10', restSeconds: 120 },
          { exerciseName: 'Leg Curl', sets: 3, reps: '6-8', restSeconds: 90 },
          { exerciseName: 'Calf Raise', sets: 4, reps: '6-10', restSeconds: 60 }
        ]
      },
      {
        name: 'Upper Hypertrophy',
        dayIndex: 2,
        exercises: [
          { exerciseName: 'Incline Dumbbell Press', sets: 4, reps: '8-12', restSeconds: 90 },
          { exerciseName: 'Cable Row', sets: 4, reps: '8-12', restSeconds: 90 },
          { exerciseName: 'Dumbbell Shoulder Press', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Lat Pulldown', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Cable Fly', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseName: 'Lateral Raise', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseName: 'Incline Dumbbell Curl', sets: 3, reps: '10-12', restSeconds: 60 },
          { exerciseName: 'Overhead Tricep Extension', sets: 3, reps: '10-12', restSeconds: 60 }
        ]
      },
      {
        name: 'Lower Hypertrophy',
        dayIndex: 3,
        exercises: [
          { exerciseName: 'Front Squat', sets: 4, reps: '8-12', restSeconds: 120 },
          { exerciseName: 'Romanian Deadlift', sets: 4, reps: '8-12', restSeconds: 120 },
          { exerciseName: 'Hip Thrust', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Leg Extension', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseName: 'Leg Curl', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseName: 'Calf Raise', sets: 4, reps: '15-20', restSeconds: 60 }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════
  // 6. PPL Débutant (3j)
  // ═══════════════════════════════════════
  {
    name: 'PPL Débutant (3j)',
    slug: 'ppl-debutant-3j',
    description: 'Version allégée du Push Pull Legs en 3 jours. Idéal pour ceux qui débutent la musculation.',
    difficulty: ProgramDifficulty.BEGINNER,
    goal: ProgramGoal.GENERAL,
    daysPerWeek: 3,
    durationWeeks: 12,
    icon: '🌱',
    days: [
      {
        name: 'Push',
        dayIndex: 0,
        exercises: [
          { exerciseName: 'Bench Press', sets: 3, reps: '8-10', restSeconds: 120 },
          { exerciseName: 'Dumbbell Shoulder Press', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Incline Dumbbell Press', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Lateral Raise', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseName: 'Tricep Pushdown', sets: 3, reps: '10-12', restSeconds: 60 }
        ]
      },
      {
        name: 'Pull',
        dayIndex: 1,
        exercises: [
          { exerciseName: 'Lat Pulldown', sets: 3, reps: '8-10', restSeconds: 120 },
          { exerciseName: 'Cable Row', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Face Pull', sets: 3, reps: '15-20', restSeconds: 60 },
          { exerciseName: 'Barbell Curl', sets: 3, reps: '10-12', restSeconds: 60 },
          { exerciseName: 'Hammer Curl', sets: 2, reps: '10-12', restSeconds: 60 }
        ]
      },
      {
        name: 'Legs',
        dayIndex: 2,
        exercises: [
          { exerciseName: 'Leg Press', sets: 3, reps: '10-12', restSeconds: 120 },
          { exerciseName: 'Romanian Deadlift', sets: 3, reps: '10-12', restSeconds: 120 },
          { exerciseName: 'Leg Extension', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseName: 'Leg Curl', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseName: 'Calf Raise', sets: 3, reps: '15-20', restSeconds: 60 }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════
  // 7. Bro Split (5j)
  // ═══════════════════════════════════════
  {
    name: 'Bro Split (5j)',
    slug: 'bro-split-5j',
    description: 'Le classique un muscle par jour. Gros volume par groupe musculaire avec récupération maximale.',
    difficulty: ProgramDifficulty.INTERMEDIATE,
    goal: ProgramGoal.HYPERTROPHY,
    daysPerWeek: 5,
    durationWeeks: 8,
    icon: '💥',
    days: [
      {
        name: 'Chest',
        dayIndex: 0,
        exercises: [
          { exerciseName: 'Bench Press', sets: 4, reps: '8-10', restSeconds: 120 },
          { exerciseName: 'Incline Dumbbell Press', sets: 4, reps: '8-12', restSeconds: 90 },
          { exerciseName: 'Cable Fly', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseName: 'Dips', sets: 3, reps: '8-12', restSeconds: 90 },
          { exerciseName: 'Dumbbell Bench Press', sets: 3, reps: '10-12', restSeconds: 90 }
        ]
      },
      {
        name: 'Back',
        dayIndex: 1,
        exercises: [
          { exerciseName: 'Deadlift', sets: 4, reps: '5-6', restSeconds: 180 },
          { exerciseName: 'Barbell Row', sets: 4, reps: '8-10', restSeconds: 120 },
          { exerciseName: 'Lat Pulldown', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Cable Row', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Face Pull', sets: 3, reps: '15-20', restSeconds: 60 }
        ]
      },
      {
        name: 'Shoulders',
        dayIndex: 2,
        exercises: [
          { exerciseName: 'Overhead Press', sets: 4, reps: '6-8', restSeconds: 150 },
          { exerciseName: 'Dumbbell Shoulder Press', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Lateral Raise', sets: 4, reps: '12-15', restSeconds: 60 },
          { exerciseName: 'Rear Delt Fly', sets: 3, reps: '15-20', restSeconds: 60 },
          { exerciseName: 'Cable Lateral Raise', sets: 3, reps: '12-15', restSeconds: 60 }
        ]
      },
      {
        name: 'Legs',
        dayIndex: 3,
        exercises: [
          { exerciseName: 'Squat', sets: 4, reps: '6-8', restSeconds: 180 },
          { exerciseName: 'Leg Press', sets: 4, reps: '10-12', restSeconds: 120 },
          { exerciseName: 'Romanian Deadlift', sets: 3, reps: '8-10', restSeconds: 120 },
          { exerciseName: 'Leg Extension', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseName: 'Leg Curl', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseName: 'Calf Raise', sets: 4, reps: '15-20', restSeconds: 60 }
        ]
      },
      {
        name: 'Arms',
        dayIndex: 4,
        exercises: [
          { exerciseName: 'Barbell Curl', sets: 4, reps: '8-10', restSeconds: 90 },
          { exerciseName: 'Skull Crusher', sets: 4, reps: '8-10', restSeconds: 90 },
          { exerciseName: 'Hammer Curl', sets: 3, reps: '10-12', restSeconds: 60 },
          { exerciseName: 'Tricep Pushdown', sets: 3, reps: '10-12', restSeconds: 60 },
          { exerciseName: 'Incline Dumbbell Curl', sets: 3, reps: '10-12', restSeconds: 60 },
          { exerciseName: 'Overhead Tricep Extension', sets: 3, reps: '10-12', restSeconds: 60 }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════
  // 8. Arnold Split (6j)
  // ═══════════════════════════════════════
  {
    name: 'Arnold Split (6j)',
    slug: 'arnold-split-6j',
    description: 'Le split popularisé par Arnold Schwarzenegger. Chest/Back, Shoulders/Arms, Legs — chaque muscle 2x/semaine.',
    difficulty: ProgramDifficulty.ADVANCED,
    goal: ProgramGoal.HYPERTROPHY,
    daysPerWeek: 6,
    durationWeeks: 8,
    icon: '🏛️',
    days: [
      {
        name: 'Chest / Back A',
        dayIndex: 0,
        exercises: [
          { exerciseName: 'Bench Press', sets: 4, reps: '6-8', restSeconds: 150 },
          { exerciseName: 'Pull-up', sets: 4, reps: '6-10', restSeconds: 120 },
          { exerciseName: 'Incline Dumbbell Press', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Barbell Row', sets: 3, reps: '8-10', restSeconds: 120 },
          { exerciseName: 'Cable Fly', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseName: 'Cable Row', sets: 3, reps: '10-12', restSeconds: 90 }
        ]
      },
      {
        name: 'Shoulders / Arms A',
        dayIndex: 1,
        exercises: [
          { exerciseName: 'Overhead Press', sets: 4, reps: '6-8', restSeconds: 150 },
          { exerciseName: 'Lateral Raise', sets: 4, reps: '12-15', restSeconds: 60 },
          { exerciseName: 'Barbell Curl', sets: 3, reps: '8-10', restSeconds: 90 },
          { exerciseName: 'Skull Crusher', sets: 3, reps: '8-10', restSeconds: 90 },
          { exerciseName: 'Hammer Curl', sets: 2, reps: '10-12', restSeconds: 60 },
          { exerciseName: 'Tricep Pushdown', sets: 2, reps: '10-12', restSeconds: 60 }
        ]
      },
      {
        name: 'Legs A',
        dayIndex: 2,
        exercises: [
          { exerciseName: 'Squat', sets: 4, reps: '6-8', restSeconds: 180 },
          { exerciseName: 'Romanian Deadlift', sets: 4, reps: '8-10', restSeconds: 120 },
          { exerciseName: 'Leg Press', sets: 3, reps: '10-12', restSeconds: 120 },
          { exerciseName: 'Leg Curl', sets: 3, reps: '10-12', restSeconds: 60 },
          { exerciseName: 'Calf Raise', sets: 4, reps: '12-15', restSeconds: 60 }
        ]
      },
      {
        name: 'Chest / Back B',
        dayIndex: 3,
        exercises: [
          { exerciseName: 'Dumbbell Bench Press', sets: 4, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Lat Pulldown', sets: 4, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Cable Fly', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseName: 'Dumbbell Row', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Dips', sets: 3, reps: '8-12', restSeconds: 90 },
          { exerciseName: 'Face Pull', sets: 3, reps: '15-20', restSeconds: 60 }
        ]
      },
      {
        name: 'Shoulders / Arms B',
        dayIndex: 4,
        exercises: [
          { exerciseName: 'Dumbbell Shoulder Press', sets: 4, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Cable Lateral Raise', sets: 4, reps: '12-15', restSeconds: 60 },
          { exerciseName: 'Rear Delt Fly', sets: 3, reps: '15-20', restSeconds: 60 },
          { exerciseName: 'Incline Dumbbell Curl', sets: 3, reps: '10-12', restSeconds: 60 },
          { exerciseName: 'Overhead Tricep Extension', sets: 3, reps: '10-12', restSeconds: 60 },
          { exerciseName: 'Preacher Curl', sets: 2, reps: '10-12', restSeconds: 60 }
        ]
      },
      {
        name: 'Legs B',
        dayIndex: 5,
        exercises: [
          { exerciseName: 'Front Squat', sets: 4, reps: '8-10', restSeconds: 150 },
          { exerciseName: 'Hip Thrust', sets: 4, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Bulgarian Split Squat', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Leg Extension', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseName: 'Leg Curl', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseName: 'Calf Raise', sets: 4, reps: '15-20', restSeconds: 60 }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════
  // 9. Starting Strength (3j)
  // ═══════════════════════════════════════
  {
    name: 'Starting Strength (3j)',
    slug: 'starting-strength-3j',
    description: 'Le programme de Mark Rippetoe. Axé sur les mouvements composés fondamentaux avec progression linéaire.',
    difficulty: ProgramDifficulty.BEGINNER,
    goal: ProgramGoal.STRENGTH,
    daysPerWeek: 3,
    durationWeeks: 12,
    icon: '🏗️',
    days: [
      {
        name: 'Workout A',
        dayIndex: 0,
        exercises: [
          { exerciseName: 'Squat', sets: 3, reps: '5', restSeconds: 240, notes: 'Ajouter 2.5kg à chaque séance' },
          { exerciseName: 'Bench Press', sets: 3, reps: '5', restSeconds: 240, notes: 'Ajouter 2.5kg à chaque séance' },
          { exerciseName: 'Deadlift', sets: 1, reps: '5', restSeconds: 300, notes: 'Ajouter 5kg à chaque séance' }
        ]
      },
      {
        name: 'Workout B',
        dayIndex: 1,
        exercises: [
          { exerciseName: 'Squat', sets: 3, reps: '5', restSeconds: 240, notes: 'Ajouter 2.5kg à chaque séance' },
          { exerciseName: 'Overhead Press', sets: 3, reps: '5', restSeconds: 240, notes: 'Ajouter 2.5kg à chaque séance' },
          { exerciseName: 'Barbell Row', sets: 3, reps: '5', restSeconds: 180, notes: 'Ajouter 2.5kg à chaque séance' }
        ]
      },
      {
        name: 'Workout A (bis)',
        dayIndex: 2,
        exercises: [
          { exerciseName: 'Squat', sets: 3, reps: '5', restSeconds: 240 },
          { exerciseName: 'Bench Press', sets: 3, reps: '5', restSeconds: 240 },
          { exerciseName: 'Deadlift', sets: 1, reps: '5', restSeconds: 300 }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════
  // 10. PHAT (5j) — Power Hypertrophy Adaptive Training
  // ═══════════════════════════════════════
  {
    name: 'PHAT (5j)',
    slug: 'phat-5j',
    description: 'Programme de Layne Norton. 2 jours force + 3 jours hypertrophie pour des gains optimaux.',
    difficulty: ProgramDifficulty.ADVANCED,
    goal: ProgramGoal.HYPERTROPHY,
    daysPerWeek: 5,
    durationWeeks: 10,
    icon: '⚔️',
    days: [
      {
        name: 'Upper Power',
        dayIndex: 0,
        exercises: [
          { exerciseName: 'Barbell Row', sets: 3, reps: '3-5', restSeconds: 180 },
          { exerciseName: 'Pull-up', sets: 2, reps: '6-10', restSeconds: 120 },
          { exerciseName: 'Bench Press', sets: 3, reps: '3-5', restSeconds: 180 },
          { exerciseName: 'Dumbbell Shoulder Press', sets: 3, reps: '6-8', restSeconds: 120 },
          { exerciseName: 'Barbell Curl', sets: 3, reps: '6-8', restSeconds: 90 },
          { exerciseName: 'Skull Crusher', sets: 3, reps: '6-8', restSeconds: 90 }
        ]
      },
      {
        name: 'Lower Power',
        dayIndex: 1,
        exercises: [
          { exerciseName: 'Squat', sets: 3, reps: '3-5', restSeconds: 240 },
          { exerciseName: 'Romanian Deadlift', sets: 3, reps: '5-8', restSeconds: 180 },
          { exerciseName: 'Leg Press', sets: 2, reps: '6-10', restSeconds: 120 },
          { exerciseName: 'Leg Curl', sets: 2, reps: '6-10', restSeconds: 90 },
          { exerciseName: 'Calf Raise', sets: 3, reps: '6-10', restSeconds: 60 }
        ]
      },
      {
        name: 'Back / Shoulders Hyper',
        dayIndex: 2,
        exercises: [
          { exerciseName: 'Barbell Row', sets: 2, reps: '8-12', restSeconds: 120, notes: 'Speed sets — explosif' },
          { exerciseName: 'Cable Row', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Lat Pulldown', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Dumbbell Shoulder Press', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Lateral Raise', sets: 3, reps: '12-20', restSeconds: 60 },
          { exerciseName: 'Face Pull', sets: 3, reps: '15-20', restSeconds: 60 }
        ]
      },
      {
        name: 'Lower Hyper',
        dayIndex: 3,
        exercises: [
          { exerciseName: 'Squat', sets: 2, reps: '8-12', restSeconds: 120, notes: 'Speed sets — explosif' },
          { exerciseName: 'Hip Thrust', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Leg Press', sets: 3, reps: '12-15', restSeconds: 90 },
          { exerciseName: 'Leg Extension', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseName: 'Leg Curl', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseName: 'Calf Raise', sets: 3, reps: '15-20', restSeconds: 60 }
        ]
      },
      {
        name: 'Chest / Arms Hyper',
        dayIndex: 4,
        exercises: [
          { exerciseName: 'Bench Press', sets: 2, reps: '8-12', restSeconds: 120, notes: 'Speed sets — explosif' },
          { exerciseName: 'Incline Dumbbell Press', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Cable Fly', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseName: 'Incline Dumbbell Curl', sets: 3, reps: '10-12', restSeconds: 60 },
          { exerciseName: 'Hammer Curl', sets: 2, reps: '12-15', restSeconds: 60 },
          { exerciseName: 'Overhead Tricep Extension', sets: 3, reps: '10-12', restSeconds: 60 },
          { exerciseName: 'Tricep Pushdown', sets: 2, reps: '12-15', restSeconds: 60 }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════
  // 11. German Volume Training (4j)
  // ═══════════════════════════════════════
  {
    name: 'German Volume Training (4j)',
    slug: 'gvt-4j',
    description: '10 séries de 10 répétitions. Programme d\'hypertrophie intense, aussi connu sous le nom de « méthode des 10x10 ».',
    difficulty: ProgramDifficulty.ADVANCED,
    goal: ProgramGoal.HYPERTROPHY,
    daysPerWeek: 4,
    durationWeeks: 6,
    icon: '🇩🇪',
    days: [
      {
        name: 'Chest / Back',
        dayIndex: 0,
        exercises: [
          { exerciseName: 'Bench Press', sets: 10, reps: '10', restSeconds: 90, notes: '60% de ton 1RM — tempo 4-0-2-0' },
          { exerciseName: 'Barbell Row', sets: 10, reps: '10', restSeconds: 90, notes: '60% de ton 1RM — tempo 4-0-2-0' },
          { exerciseName: 'Cable Fly', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseName: 'Face Pull', sets: 3, reps: '12-15', restSeconds: 60 }
        ]
      },
      {
        name: 'Legs',
        dayIndex: 1,
        exercises: [
          { exerciseName: 'Squat', sets: 10, reps: '10', restSeconds: 90, notes: '60% de ton 1RM — tempo 4-0-2-0' },
          { exerciseName: 'Leg Curl', sets: 10, reps: '10', restSeconds: 90, notes: '60% de ton 1RM' },
          { exerciseName: 'Calf Raise', sets: 3, reps: '15-20', restSeconds: 60 }
        ]
      },
      {
        name: 'Shoulders / Arms',
        dayIndex: 2,
        exercises: [
          { exerciseName: 'Dumbbell Shoulder Press', sets: 10, reps: '10', restSeconds: 90, notes: '60% de ton 1RM — tempo 4-0-2-0' },
          { exerciseName: 'Barbell Curl', sets: 10, reps: '10', restSeconds: 90, notes: '60% de ton 1RM' },
          { exerciseName: 'Lateral Raise', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseName: 'Tricep Pushdown', sets: 3, reps: '12-15', restSeconds: 60 }
        ]
      },
      {
        name: 'Back / Legs B',
        dayIndex: 3,
        exercises: [
          { exerciseName: 'Deadlift', sets: 10, reps: '10', restSeconds: 90, notes: '60% de ton 1RM — tempo 4-0-2-0' },
          { exerciseName: 'Leg Press', sets: 10, reps: '10', restSeconds: 90, notes: '60% de ton 1RM' },
          { exerciseName: 'Lat Pulldown', sets: 3, reps: '10-12', restSeconds: 60 },
          { exerciseName: 'Calf Raise', sets: 3, reps: '15-20', restSeconds: 60 }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════
  // 12. nSuns 5/3/1 (5j)
  // ═══════════════════════════════════════
  {
    name: 'nSuns 5/3/1 (5j)',
    slug: 'nsuns-531-5j',
    description: 'Programme de force à haut volume basé sur le 5/3/1. Progression rapide sur les 4 mouvements composés principaux.',
    difficulty: ProgramDifficulty.ADVANCED,
    goal: ProgramGoal.STRENGTH,
    daysPerWeek: 5,
    durationWeeks: 12,
    icon: '🚀',
    days: [
      {
        name: 'Bench / OHP',
        dayIndex: 0,
        exercises: [
          { exerciseName: 'Bench Press', sets: 9, reps: '5/3/1', restSeconds: 150, notes: 'T1 — 9 séries pyramidales selon pourcentages nSuns' },
          { exerciseName: 'Overhead Press', sets: 8, reps: '3-8', restSeconds: 120, notes: 'T2 — 8 séries complémentaires' },
          { exerciseName: 'Cable Row', sets: 4, reps: '8-12', restSeconds: 60 },
          { exerciseName: 'Face Pull', sets: 4, reps: '15-20', restSeconds: 60 }
        ]
      },
      {
        name: 'Squat / Sumo Deadlift',
        dayIndex: 1,
        exercises: [
          { exerciseName: 'Squat', sets: 9, reps: '5/3/1', restSeconds: 180, notes: 'T1 — 9 séries pyramidales' },
          { exerciseName: 'Deadlift', sets: 8, reps: '3-8', restSeconds: 150, notes: 'T2 — sumo ou conventionnel' },
          { exerciseName: 'Leg Press', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Leg Curl', sets: 3, reps: '10-12', restSeconds: 60 }
        ]
      },
      {
        name: 'OHP / Incline Bench',
        dayIndex: 2,
        exercises: [
          { exerciseName: 'Overhead Press', sets: 9, reps: '5/3/1', restSeconds: 150, notes: 'T1 — 9 séries pyramidales' },
          { exerciseName: 'Incline Dumbbell Press', sets: 8, reps: '3-8', restSeconds: 120, notes: 'T2 — volume' },
          { exerciseName: 'Lat Pulldown', sets: 4, reps: '8-12', restSeconds: 60 },
          { exerciseName: 'Lateral Raise', sets: 4, reps: '12-15', restSeconds: 60 }
        ]
      },
      {
        name: 'Deadlift / Front Squat',
        dayIndex: 3,
        exercises: [
          { exerciseName: 'Deadlift', sets: 9, reps: '5/3/1', restSeconds: 180, notes: 'T1 — 9 séries pyramidales' },
          { exerciseName: 'Front Squat', sets: 8, reps: '3-8', restSeconds: 150, notes: 'T2 — volume' },
          { exerciseName: 'Hip Thrust', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Hanging Leg Raise', sets: 3, reps: '10-15', restSeconds: 60 }
        ]
      },
      {
        name: 'Bench / Close Grip',
        dayIndex: 4,
        exercises: [
          { exerciseName: 'Bench Press', sets: 9, reps: '5/3/1', restSeconds: 150, notes: 'T1 — 9 séries pyramidales' },
          { exerciseName: 'Dumbbell Bench Press', sets: 8, reps: '3-8', restSeconds: 120, notes: 'T2 — prise serrée' },
          { exerciseName: 'Barbell Curl', sets: 3, reps: '8-12', restSeconds: 60 },
          { exerciseName: 'Tricep Pushdown', sets: 3, reps: '10-12', restSeconds: 60 },
          { exerciseName: 'Face Pull', sets: 3, reps: '15-20', restSeconds: 60 }
        ]
      }
    ]
  }
]
