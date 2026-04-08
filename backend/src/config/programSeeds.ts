import { ProgramDifficulty, ProgramGoal } from '../entities/WorkoutProgram.js';

/**
 * Programmes prédéfinis — seedés au démarrage si absents.
 */
export const PROGRAM_SEEDS = [
  {
    name: 'Push / Pull / Legs (6j)',
    slug: 'ppl-6j',
    description:
      "Le classique PPL en 6 jours. Idéal pour l'hypertrophie avec un bon volume par groupe musculaire.",
    difficulty: ProgramDifficulty.INTERMEDIATE,
    goal: ProgramGoal.HYPERTROPHY,
    daysPerWeek: 6,
    durationWeeks: 8,
    icon: 'lucide:dumbbell',
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
          { exerciseName: 'Overhead Tricep Extension', sets: 3, reps: '10-12', restSeconds: 60 },
        ],
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
          { exerciseName: 'Hammer Curl', sets: 3, reps: '10-12', restSeconds: 60 },
        ],
      },
      {
        name: 'Legs A',
        dayIndex: 2,
        exercises: [
          { exerciseName: 'Squat', sets: 4, reps: '6-8', restSeconds: 180 },
          { exerciseName: 'Romanian Deadlift', sets: 3, reps: '8-10', restSeconds: 120 },
          { exerciseName: 'Leg Press', sets: 3, reps: '10-12', restSeconds: 120 },
          { exerciseName: 'Leg Curl', sets: 3, reps: '10-12', restSeconds: 60 },
          { exerciseName: 'Calf Raise', sets: 4, reps: '12-15', restSeconds: 60 },
        ],
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
          { exerciseName: 'Tricep Pushdown', sets: 3, reps: '12-15', restSeconds: 60 },
        ],
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
          { exerciseName: 'Preacher Curl', sets: 3, reps: '10-12', restSeconds: 60 },
        ],
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
          { exerciseName: 'Calf Raise', sets: 4, reps: '15-20', restSeconds: 60 },
        ],
      },
    ],
  },
  {
    name: 'Upper / Lower (4j)',
    slug: 'upper-lower-4j',
    description: 'Programme équilibré en 4 jours. Bon compromis entre volume et récupération.',
    difficulty: ProgramDifficulty.INTERMEDIATE,
    goal: ProgramGoal.HYPERTROPHY,
    daysPerWeek: 4,
    durationWeeks: 10,
    icon: 'lucide:zap',
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
          { exerciseName: 'Tricep Pushdown', sets: 2, reps: '10-12', restSeconds: 60 },
        ],
      },
      {
        name: 'Lower A (Force)',
        dayIndex: 1,
        exercises: [
          { exerciseName: 'Squat', sets: 4, reps: '5-6', restSeconds: 180 },
          { exerciseName: 'Romanian Deadlift', sets: 3, reps: '8-10', restSeconds: 120 },
          { exerciseName: 'Leg Press', sets: 3, reps: '10-12', restSeconds: 120 },
          { exerciseName: 'Leg Curl', sets: 3, reps: '10-12', restSeconds: 60 },
          { exerciseName: 'Calf Raise', sets: 4, reps: '12-15', restSeconds: 60 },
        ],
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
          { exerciseName: 'Overhead Tricep Extension', sets: 2, reps: '12-15', restSeconds: 60 },
        ],
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
          { exerciseName: 'Calf Raise', sets: 4, reps: '15-20', restSeconds: 60 },
        ],
      },
    ],
  },
  {
    name: 'Full Body (3j)',
    slug: 'full-body-3j',
    description:
      'Programme full body 3x par semaine. Parfait pour les débutants ou ceux avec peu de temps.',
    difficulty: ProgramDifficulty.BEGINNER,
    goal: ProgramGoal.GENERAL,
    daysPerWeek: 3,
    durationWeeks: 12,
    icon: 'lucide:heart-pulse',
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
          { exerciseName: 'Plank', sets: 3, reps: '30-60s', restSeconds: 60 },
        ],
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
          { exerciseName: 'Barbell Curl', sets: 2, reps: '10-12', restSeconds: 60 },
        ],
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
          { exerciseName: 'Tricep Pushdown', sets: 2, reps: '10-12', restSeconds: 60 },
        ],
      },
    ],
  },
  {
    name: 'Force 5/3/1 (4j)',
    slug: '531-4j',
    description:
      'Programme de force basé sur le 5/3/1 de Jim Wendler. Progression lente mais solide sur les mouvements composés.',
    difficulty: ProgramDifficulty.ADVANCED,
    goal: ProgramGoal.STRENGTH,
    daysPerWeek: 4,
    durationWeeks: 12,
    icon: 'lucide:trophy',
    days: [
      {
        name: 'Squat Day',
        dayIndex: 0,
        exercises: [
          {
            exerciseName: 'Squat',
            sets: 3,
            reps: '5/3/1',
            restSeconds: 240,
            notes: 'Semaine 1: 5-5-5+, Semaine 2: 3-3-3+, Semaine 3: 5-3-1+',
          },
          {
            exerciseName: 'Leg Press',
            sets: 5,
            reps: '10',
            restSeconds: 90,
            notes: 'Assistance — BBB 5x10 @50%',
          },
          { exerciseName: 'Leg Curl', sets: 3, reps: '10-12', restSeconds: 60 },
          { exerciseName: 'Plank', sets: 3, reps: '60s', restSeconds: 60 },
        ],
      },
      {
        name: 'Bench Day',
        dayIndex: 1,
        exercises: [
          {
            exerciseName: 'Bench Press',
            sets: 3,
            reps: '5/3/1',
            restSeconds: 240,
            notes: 'Semaine 1: 5-5-5+, Semaine 2: 3-3-3+, Semaine 3: 5-3-1+',
          },
          {
            exerciseName: 'Dumbbell Bench Press',
            sets: 5,
            reps: '10',
            restSeconds: 90,
            notes: 'Assistance — BBB 5x10',
          },
          { exerciseName: 'Dumbbell Row', sets: 3, reps: '10-12', restSeconds: 60 },
          { exerciseName: 'Tricep Pushdown', sets: 3, reps: '10-12', restSeconds: 60 },
        ],
      },
      {
        name: 'Deadlift Day',
        dayIndex: 2,
        exercises: [
          {
            exerciseName: 'Deadlift',
            sets: 3,
            reps: '5/3/1',
            restSeconds: 300,
            notes: 'Semaine 1: 5-5-5+, Semaine 2: 3-3-3+, Semaine 3: 5-3-1+',
          },
          {
            exerciseName: 'Romanian Deadlift',
            sets: 5,
            reps: '10',
            restSeconds: 90,
            notes: 'Assistance — BBB 5x10 @50%',
          },
          { exerciseName: 'Hip Thrust', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Hanging Leg Raise', sets: 3, reps: '10-15', restSeconds: 60 },
        ],
      },
      {
        name: 'OHP Day',
        dayIndex: 3,
        exercises: [
          {
            exerciseName: 'Overhead Press',
            sets: 3,
            reps: '5/3/1',
            restSeconds: 240,
            notes: 'Semaine 1: 5-5-5+, Semaine 2: 3-3-3+, Semaine 3: 5-3-1+',
          },
          {
            exerciseName: 'Dumbbell Shoulder Press',
            sets: 5,
            reps: '10',
            restSeconds: 90,
            notes: 'Assistance — BBB 5x10',
          },
          { exerciseName: 'Lat Pulldown', sets: 3, reps: '10-12', restSeconds: 60 },
          { exerciseName: 'Lateral Raise', sets: 3, reps: '15-20', restSeconds: 60 },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════
  // 5. PHUL — Power Hypertrophy Upper Lower
  // ═══════════════════════════════════════
  {
    name: 'PHUL (4j)',
    slug: 'phul-4j',
    description:
      'Power Hypertrophy Upper Lower. 2 jours force + 2 jours hypertrophie pour le meilleur des deux mondes.',
    difficulty: ProgramDifficulty.INTERMEDIATE,
    goal: ProgramGoal.HYPERTROPHY,
    daysPerWeek: 4,
    durationWeeks: 10,
    icon: 'lucide:flame',
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
          { exerciseName: 'Skull Crusher', sets: 2, reps: '6-8', restSeconds: 60 },
        ],
      },
      {
        name: 'Lower Power',
        dayIndex: 1,
        exercises: [
          { exerciseName: 'Squat', sets: 4, reps: '3-5', restSeconds: 240 },
          { exerciseName: 'Deadlift', sets: 3, reps: '3-5', restSeconds: 240 },
          { exerciseName: 'Leg Press', sets: 3, reps: '8-10', restSeconds: 120 },
          { exerciseName: 'Leg Curl', sets: 3, reps: '6-8', restSeconds: 90 },
          { exerciseName: 'Calf Raise', sets: 4, reps: '6-10', restSeconds: 60 },
        ],
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
          { exerciseName: 'Overhead Tricep Extension', sets: 3, reps: '10-12', restSeconds: 60 },
        ],
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
          { exerciseName: 'Calf Raise', sets: 4, reps: '15-20', restSeconds: 60 },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════
  // 6. PPL Débutant (3j)
  // ═══════════════════════════════════════
  {
    name: 'PPL Débutant (3j)',
    slug: 'ppl-debutant-3j',
    description:
      'Version allégée du Push Pull Legs en 3 jours. Idéal pour ceux qui débutent la musculation.',
    difficulty: ProgramDifficulty.BEGINNER,
    goal: ProgramGoal.GENERAL,
    daysPerWeek: 3,
    durationWeeks: 12,
    icon: 'lucide:sprout',
    days: [
      {
        name: 'Push',
        dayIndex: 0,
        exercises: [
          { exerciseName: 'Bench Press', sets: 3, reps: '8-10', restSeconds: 120 },
          { exerciseName: 'Dumbbell Shoulder Press', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Incline Dumbbell Press', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Lateral Raise', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseName: 'Tricep Pushdown', sets: 3, reps: '10-12', restSeconds: 60 },
        ],
      },
      {
        name: 'Pull',
        dayIndex: 1,
        exercises: [
          { exerciseName: 'Lat Pulldown', sets: 3, reps: '8-10', restSeconds: 120 },
          { exerciseName: 'Cable Row', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Face Pull', sets: 3, reps: '15-20', restSeconds: 60 },
          { exerciseName: 'Barbell Curl', sets: 3, reps: '10-12', restSeconds: 60 },
          { exerciseName: 'Hammer Curl', sets: 2, reps: '10-12', restSeconds: 60 },
        ],
      },
      {
        name: 'Legs',
        dayIndex: 2,
        exercises: [
          { exerciseName: 'Leg Press', sets: 3, reps: '10-12', restSeconds: 120 },
          { exerciseName: 'Romanian Deadlift', sets: 3, reps: '10-12', restSeconds: 120 },
          { exerciseName: 'Leg Extension', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseName: 'Leg Curl', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseName: 'Calf Raise', sets: 3, reps: '15-20', restSeconds: 60 },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════
  // 7. Bro Split (5j)
  // ═══════════════════════════════════════
  {
    name: 'Bro Split (5j)',
    slug: 'bro-split-5j',
    description:
      'Le classique un muscle par jour. Gros volume par groupe musculaire avec récupération maximale.',
    difficulty: ProgramDifficulty.INTERMEDIATE,
    goal: ProgramGoal.HYPERTROPHY,
    daysPerWeek: 5,
    durationWeeks: 8,
    icon: 'lucide:target',
    days: [
      {
        name: 'Chest',
        dayIndex: 0,
        exercises: [
          { exerciseName: 'Bench Press', sets: 4, reps: '8-10', restSeconds: 120 },
          { exerciseName: 'Incline Dumbbell Press', sets: 4, reps: '8-12', restSeconds: 90 },
          { exerciseName: 'Cable Fly', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseName: 'Dips', sets: 3, reps: '8-12', restSeconds: 90 },
          { exerciseName: 'Dumbbell Bench Press', sets: 3, reps: '10-12', restSeconds: 90 },
        ],
      },
      {
        name: 'Back',
        dayIndex: 1,
        exercises: [
          { exerciseName: 'Deadlift', sets: 4, reps: '5-6', restSeconds: 180 },
          { exerciseName: 'Barbell Row', sets: 4, reps: '8-10', restSeconds: 120 },
          { exerciseName: 'Lat Pulldown', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Cable Row', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Face Pull', sets: 3, reps: '15-20', restSeconds: 60 },
        ],
      },
      {
        name: 'Shoulders',
        dayIndex: 2,
        exercises: [
          { exerciseName: 'Overhead Press', sets: 4, reps: '6-8', restSeconds: 150 },
          { exerciseName: 'Dumbbell Shoulder Press', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Lateral Raise', sets: 4, reps: '12-15', restSeconds: 60 },
          { exerciseName: 'Rear Delt Fly', sets: 3, reps: '15-20', restSeconds: 60 },
          { exerciseName: 'Cable Lateral Raise', sets: 3, reps: '12-15', restSeconds: 60 },
        ],
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
          { exerciseName: 'Calf Raise', sets: 4, reps: '15-20', restSeconds: 60 },
        ],
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
          { exerciseName: 'Overhead Tricep Extension', sets: 3, reps: '10-12', restSeconds: 60 },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════
  // 8. Arnold Split (6j)
  // ═══════════════════════════════════════
  {
    name: 'Arnold Split (6j)',
    slug: 'arnold-split-6j',
    description:
      'Le split popularisé par Arnold Schwarzenegger. Chest/Back, Shoulders/Arms, Legs — chaque muscle 2x/semaine.',
    difficulty: ProgramDifficulty.ADVANCED,
    goal: ProgramGoal.HYPERTROPHY,
    daysPerWeek: 6,
    durationWeeks: 8,
    icon: 'lucide:crown',
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
          { exerciseName: 'Cable Row', sets: 3, reps: '10-12', restSeconds: 90 },
        ],
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
          { exerciseName: 'Tricep Pushdown', sets: 2, reps: '10-12', restSeconds: 60 },
        ],
      },
      {
        name: 'Legs A',
        dayIndex: 2,
        exercises: [
          { exerciseName: 'Squat', sets: 4, reps: '6-8', restSeconds: 180 },
          { exerciseName: 'Romanian Deadlift', sets: 4, reps: '8-10', restSeconds: 120 },
          { exerciseName: 'Leg Press', sets: 3, reps: '10-12', restSeconds: 120 },
          { exerciseName: 'Leg Curl', sets: 3, reps: '10-12', restSeconds: 60 },
          { exerciseName: 'Calf Raise', sets: 4, reps: '12-15', restSeconds: 60 },
        ],
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
          { exerciseName: 'Face Pull', sets: 3, reps: '15-20', restSeconds: 60 },
        ],
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
          { exerciseName: 'Preacher Curl', sets: 2, reps: '10-12', restSeconds: 60 },
        ],
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
          { exerciseName: 'Calf Raise', sets: 4, reps: '15-20', restSeconds: 60 },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════
  // 9. Starting Strength (3j)
  // ═══════════════════════════════════════
  {
    name: 'Starting Strength (3j)',
    slug: 'starting-strength-3j',
    description:
      'Le programme de Mark Rippetoe. Axé sur les mouvements composés fondamentaux avec progression linéaire.',
    difficulty: ProgramDifficulty.BEGINNER,
    goal: ProgramGoal.STRENGTH,
    daysPerWeek: 3,
    durationWeeks: 12,
    icon: 'lucide:brick-wall',
    days: [
      {
        name: 'Workout A',
        dayIndex: 0,
        exercises: [
          {
            exerciseName: 'Squat',
            sets: 3,
            reps: '5',
            restSeconds: 240,
            notes: 'Ajouter 2.5kg à chaque séance',
          },
          {
            exerciseName: 'Bench Press',
            sets: 3,
            reps: '5',
            restSeconds: 240,
            notes: 'Ajouter 2.5kg à chaque séance',
          },
          {
            exerciseName: 'Deadlift',
            sets: 1,
            reps: '5',
            restSeconds: 300,
            notes: 'Ajouter 5kg à chaque séance',
          },
        ],
      },
      {
        name: 'Workout B',
        dayIndex: 1,
        exercises: [
          {
            exerciseName: 'Squat',
            sets: 3,
            reps: '5',
            restSeconds: 240,
            notes: 'Ajouter 2.5kg à chaque séance',
          },
          {
            exerciseName: 'Overhead Press',
            sets: 3,
            reps: '5',
            restSeconds: 240,
            notes: 'Ajouter 2.5kg à chaque séance',
          },
          {
            exerciseName: 'Barbell Row',
            sets: 3,
            reps: '5',
            restSeconds: 180,
            notes: 'Ajouter 2.5kg à chaque séance',
          },
        ],
      },
      {
        name: 'Workout A (bis)',
        dayIndex: 2,
        exercises: [
          { exerciseName: 'Squat', sets: 3, reps: '5', restSeconds: 240 },
          { exerciseName: 'Bench Press', sets: 3, reps: '5', restSeconds: 240 },
          { exerciseName: 'Deadlift', sets: 1, reps: '5', restSeconds: 300 },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════
  // 10. PHAT (5j) — Power Hypertrophy Adaptive Training
  // ═══════════════════════════════════════
  {
    name: 'PHAT (5j)',
    slug: 'phat-5j',
    description:
      'Programme de Layne Norton. 2 jours force + 3 jours hypertrophie pour des gains optimaux.',
    difficulty: ProgramDifficulty.ADVANCED,
    goal: ProgramGoal.HYPERTROPHY,
    daysPerWeek: 5,
    durationWeeks: 10,
    icon: 'lucide:swords',
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
          { exerciseName: 'Skull Crusher', sets: 3, reps: '6-8', restSeconds: 90 },
        ],
      },
      {
        name: 'Lower Power',
        dayIndex: 1,
        exercises: [
          { exerciseName: 'Squat', sets: 3, reps: '3-5', restSeconds: 240 },
          { exerciseName: 'Romanian Deadlift', sets: 3, reps: '5-8', restSeconds: 180 },
          { exerciseName: 'Leg Press', sets: 2, reps: '6-10', restSeconds: 120 },
          { exerciseName: 'Leg Curl', sets: 2, reps: '6-10', restSeconds: 90 },
          { exerciseName: 'Calf Raise', sets: 3, reps: '6-10', restSeconds: 60 },
        ],
      },
      {
        name: 'Back / Shoulders Hyper',
        dayIndex: 2,
        exercises: [
          {
            exerciseName: 'Barbell Row',
            sets: 2,
            reps: '8-12',
            restSeconds: 120,
            notes: 'Speed sets — explosif',
          },
          { exerciseName: 'Cable Row', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Lat Pulldown', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Dumbbell Shoulder Press', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Lateral Raise', sets: 3, reps: '12-20', restSeconds: 60 },
          { exerciseName: 'Face Pull', sets: 3, reps: '15-20', restSeconds: 60 },
        ],
      },
      {
        name: 'Lower Hyper',
        dayIndex: 3,
        exercises: [
          {
            exerciseName: 'Squat',
            sets: 2,
            reps: '8-12',
            restSeconds: 120,
            notes: 'Speed sets — explosif',
          },
          { exerciseName: 'Hip Thrust', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Leg Press', sets: 3, reps: '12-15', restSeconds: 90 },
          { exerciseName: 'Leg Extension', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseName: 'Leg Curl', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseName: 'Calf Raise', sets: 3, reps: '15-20', restSeconds: 60 },
        ],
      },
      {
        name: 'Chest / Arms Hyper',
        dayIndex: 4,
        exercises: [
          {
            exerciseName: 'Bench Press',
            sets: 2,
            reps: '8-12',
            restSeconds: 120,
            notes: 'Speed sets — explosif',
          },
          { exerciseName: 'Incline Dumbbell Press', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Cable Fly', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseName: 'Incline Dumbbell Curl', sets: 3, reps: '10-12', restSeconds: 60 },
          { exerciseName: 'Hammer Curl', sets: 2, reps: '12-15', restSeconds: 60 },
          { exerciseName: 'Overhead Tricep Extension', sets: 3, reps: '10-12', restSeconds: 60 },
          { exerciseName: 'Tricep Pushdown', sets: 2, reps: '12-15', restSeconds: 60 },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════
  // 11. German Volume Training (4j)
  // ═══════════════════════════════════════
  {
    name: 'German Volume Training (4j)',
    slug: 'gvt-4j',
    description:
      "10 séries de 10 répétitions. Programme d'hypertrophie intense, aussi connu sous le nom de « méthode des 10x10 ».",
    difficulty: ProgramDifficulty.ADVANCED,
    goal: ProgramGoal.HYPERTROPHY,
    daysPerWeek: 4,
    durationWeeks: 6,
    icon: 'lucide:repeat',
    days: [
      {
        name: 'Chest / Back',
        dayIndex: 0,
        exercises: [
          {
            exerciseName: 'Bench Press',
            sets: 10,
            reps: '10',
            restSeconds: 90,
            notes: '60% de ton 1RM — tempo 4-0-2-0',
          },
          {
            exerciseName: 'Barbell Row',
            sets: 10,
            reps: '10',
            restSeconds: 90,
            notes: '60% de ton 1RM — tempo 4-0-2-0',
          },
          { exerciseName: 'Cable Fly', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseName: 'Face Pull', sets: 3, reps: '12-15', restSeconds: 60 },
        ],
      },
      {
        name: 'Legs',
        dayIndex: 1,
        exercises: [
          {
            exerciseName: 'Squat',
            sets: 10,
            reps: '10',
            restSeconds: 90,
            notes: '60% de ton 1RM — tempo 4-0-2-0',
          },
          {
            exerciseName: 'Leg Curl',
            sets: 10,
            reps: '10',
            restSeconds: 90,
            notes: '60% de ton 1RM',
          },
          { exerciseName: 'Calf Raise', sets: 3, reps: '15-20', restSeconds: 60 },
        ],
      },
      {
        name: 'Shoulders / Arms',
        dayIndex: 2,
        exercises: [
          {
            exerciseName: 'Dumbbell Shoulder Press',
            sets: 10,
            reps: '10',
            restSeconds: 90,
            notes: '60% de ton 1RM — tempo 4-0-2-0',
          },
          {
            exerciseName: 'Barbell Curl',
            sets: 10,
            reps: '10',
            restSeconds: 90,
            notes: '60% de ton 1RM',
          },
          { exerciseName: 'Lateral Raise', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseName: 'Tricep Pushdown', sets: 3, reps: '12-15', restSeconds: 60 },
        ],
      },
      {
        name: 'Back / Legs B',
        dayIndex: 3,
        exercises: [
          {
            exerciseName: 'Deadlift',
            sets: 10,
            reps: '10',
            restSeconds: 90,
            notes: '60% de ton 1RM — tempo 4-0-2-0',
          },
          {
            exerciseName: 'Leg Press',
            sets: 10,
            reps: '10',
            restSeconds: 90,
            notes: '60% de ton 1RM',
          },
          { exerciseName: 'Lat Pulldown', sets: 3, reps: '10-12', restSeconds: 60 },
          { exerciseName: 'Calf Raise', sets: 3, reps: '15-20', restSeconds: 60 },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════
  // 12. nSuns 5/3/1 (5j)
  // ═══════════════════════════════════════
  {
    name: 'nSuns 5/3/1 (5j)',
    slug: 'nsuns-531-5j',
    description:
      'Programme de force à haut volume basé sur le 5/3/1. Progression rapide sur les 4 mouvements composés principaux.',
    difficulty: ProgramDifficulty.ADVANCED,
    goal: ProgramGoal.STRENGTH,
    daysPerWeek: 5,
    durationWeeks: 12,
    icon: 'lucide:rocket',
    days: [
      {
        name: 'Bench / OHP',
        dayIndex: 0,
        exercises: [
          {
            exerciseName: 'Bench Press',
            sets: 9,
            reps: '5/3/1',
            restSeconds: 150,
            notes: 'T1 — 9 séries pyramidales selon pourcentages nSuns',
          },
          {
            exerciseName: 'Overhead Press',
            sets: 8,
            reps: '3-8',
            restSeconds: 120,
            notes: 'T2 — 8 séries complémentaires',
          },
          { exerciseName: 'Cable Row', sets: 4, reps: '8-12', restSeconds: 60 },
          { exerciseName: 'Face Pull', sets: 4, reps: '15-20', restSeconds: 60 },
        ],
      },
      {
        name: 'Squat / Sumo Deadlift',
        dayIndex: 1,
        exercises: [
          {
            exerciseName: 'Squat',
            sets: 9,
            reps: '5/3/1',
            restSeconds: 180,
            notes: 'T1 — 9 séries pyramidales',
          },
          {
            exerciseName: 'Deadlift',
            sets: 8,
            reps: '3-8',
            restSeconds: 150,
            notes: 'T2 — sumo ou conventionnel',
          },
          { exerciseName: 'Leg Press', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Leg Curl', sets: 3, reps: '10-12', restSeconds: 60 },
        ],
      },
      {
        name: 'OHP / Incline Bench',
        dayIndex: 2,
        exercises: [
          {
            exerciseName: 'Overhead Press',
            sets: 9,
            reps: '5/3/1',
            restSeconds: 150,
            notes: 'T1 — 9 séries pyramidales',
          },
          {
            exerciseName: 'Incline Dumbbell Press',
            sets: 8,
            reps: '3-8',
            restSeconds: 120,
            notes: 'T2 — volume',
          },
          { exerciseName: 'Lat Pulldown', sets: 4, reps: '8-12', restSeconds: 60 },
          { exerciseName: 'Lateral Raise', sets: 4, reps: '12-15', restSeconds: 60 },
        ],
      },
      {
        name: 'Deadlift / Front Squat',
        dayIndex: 3,
        exercises: [
          {
            exerciseName: 'Deadlift',
            sets: 9,
            reps: '5/3/1',
            restSeconds: 180,
            notes: 'T1 — 9 séries pyramidales',
          },
          {
            exerciseName: 'Front Squat',
            sets: 8,
            reps: '3-8',
            restSeconds: 150,
            notes: 'T2 — volume',
          },
          { exerciseName: 'Hip Thrust', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Hanging Leg Raise', sets: 3, reps: '10-15', restSeconds: 60 },
        ],
      },
      {
        name: 'Bench / Close Grip',
        dayIndex: 4,
        exercises: [
          {
            exerciseName: 'Bench Press',
            sets: 9,
            reps: '5/3/1',
            restSeconds: 150,
            notes: 'T1 — 9 séries pyramidales',
          },
          {
            exerciseName: 'Dumbbell Bench Press',
            sets: 8,
            reps: '3-8',
            restSeconds: 120,
            notes: 'T2 — prise serrée',
          },
          { exerciseName: 'Barbell Curl', sets: 3, reps: '8-12', restSeconds: 60 },
          { exerciseName: 'Tricep Pushdown', sets: 3, reps: '10-12', restSeconds: 60 },
          { exerciseName: 'Face Pull', sets: 3, reps: '15-20', restSeconds: 60 },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════
  // 13. Stronglifts 5x5 (3j)
  // ═══════════════════════════════════════
  {
    name: 'Stronglifts 5x5 (3j)',
    slug: 'stronglifts-5x5-3j',
    description:
      'Programme minimaliste et efficace : 5 séries de 5 sur les mouvements composés. Progression linéaire chaque séance.',
    difficulty: ProgramDifficulty.BEGINNER,
    goal: ProgramGoal.STRENGTH,
    daysPerWeek: 3,
    durationWeeks: 12,
    icon: 'lucide:bar-chart-3',
    days: [
      {
        name: 'Workout A',
        dayIndex: 0,
        exercises: [
          {
            exerciseName: 'Squat',
            sets: 5,
            reps: '5',
            restSeconds: 180,
            notes: '+2.5kg à chaque séance réussie',
          },
          { exerciseName: 'Bench Press', sets: 5, reps: '5', restSeconds: 180 },
          { exerciseName: 'Barbell Row', sets: 5, reps: '5', restSeconds: 180 },
        ],
      },
      {
        name: 'Workout B',
        dayIndex: 1,
        exercises: [
          { exerciseName: 'Squat', sets: 5, reps: '5', restSeconds: 180 },
          { exerciseName: 'Overhead Press', sets: 5, reps: '5', restSeconds: 180 },
          { exerciseName: 'Deadlift', sets: 1, reps: '5', restSeconds: 300 },
        ],
      },
      {
        name: 'Workout A (bis)',
        dayIndex: 2,
        exercises: [
          { exerciseName: 'Squat', sets: 5, reps: '5', restSeconds: 180 },
          { exerciseName: 'Bench Press', sets: 5, reps: '5', restSeconds: 180 },
          { exerciseName: 'Barbell Row', sets: 5, reps: '5', restSeconds: 180 },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════
  // 14. Push Pull (4j)
  // ═══════════════════════════════════════
  {
    name: 'Push / Pull (4j)',
    slug: 'push-pull-4j',
    description:
      'Split en 2 types de séances : mouvements de poussée et de tirage. Simple et efficace.',
    difficulty: ProgramDifficulty.INTERMEDIATE,
    goal: ProgramGoal.HYPERTROPHY,
    daysPerWeek: 4,
    durationWeeks: 8,
    icon: 'lucide:arrow-left-right',
    days: [
      {
        name: 'Push A (Force)',
        dayIndex: 0,
        exercises: [
          { exerciseName: 'Bench Press', sets: 4, reps: '5-6', restSeconds: 180 },
          { exerciseName: 'Overhead Press', sets: 3, reps: '6-8', restSeconds: 150 },
          { exerciseName: 'Squat', sets: 4, reps: '5-6', restSeconds: 180 },
          { exerciseName: 'Incline Dumbbell Press', sets: 3, reps: '8-10', restSeconds: 90 },
          { exerciseName: 'Lateral Raise', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseName: 'Tricep Pushdown', sets: 3, reps: '10-12', restSeconds: 60 },
        ],
      },
      {
        name: 'Pull A (Force)',
        dayIndex: 1,
        exercises: [
          { exerciseName: 'Deadlift', sets: 4, reps: '5-6', restSeconds: 240 },
          { exerciseName: 'Barbell Row', sets: 4, reps: '5-6', restSeconds: 150 },
          { exerciseName: 'Pull-up', sets: 3, reps: '6-10', restSeconds: 120 },
          { exerciseName: 'Face Pull', sets: 3, reps: '15-20', restSeconds: 60 },
          { exerciseName: 'Barbell Curl', sets: 3, reps: '8-10', restSeconds: 60 },
          { exerciseName: 'Leg Curl', sets: 3, reps: '10-12', restSeconds: 60 },
        ],
      },
      {
        name: 'Push B (Volume)',
        dayIndex: 2,
        exercises: [
          { exerciseName: 'Dumbbell Bench Press', sets: 4, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Dumbbell Shoulder Press', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Leg Press', sets: 4, reps: '10-12', restSeconds: 120 },
          { exerciseName: 'Cable Fly', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseName: 'Cable Lateral Raise', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseName: 'Overhead Tricep Extension', sets: 3, reps: '10-12', restSeconds: 60 },
        ],
      },
      {
        name: 'Pull B (Volume)',
        dayIndex: 3,
        exercises: [
          { exerciseName: 'Romanian Deadlift', sets: 4, reps: '10-12', restSeconds: 120 },
          { exerciseName: 'Cable Row', sets: 4, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Lat Pulldown', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Rear Delt Fly', sets: 3, reps: '15-20', restSeconds: 60 },
          { exerciseName: 'Hammer Curl', sets: 3, reps: '10-12', restSeconds: 60 },
          { exerciseName: 'Leg Curl', sets: 3, reps: '12-15', restSeconds: 60 },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════
  // 15. Hypertrophie Pure (6j)
  // ═══════════════════════════════════════
  {
    name: 'Hypertrophie Pure (6j)',
    slug: 'hypertrophie-pure-6j',
    description:
      'Programme axé 100% volume pour la prise de masse musculaire. Séries hautes, repos courts.',
    difficulty: ProgramDifficulty.ADVANCED,
    goal: ProgramGoal.HYPERTROPHY,
    daysPerWeek: 6,
    durationWeeks: 6,
    icon: 'lucide:trending-up',
    days: [
      {
        name: 'Chest / Triceps',
        dayIndex: 0,
        exercises: [
          { exerciseName: 'Incline Dumbbell Press', sets: 4, reps: '10-12', restSeconds: 75 },
          { exerciseName: 'Bench Press', sets: 4, reps: '8-10', restSeconds: 90 },
          { exerciseName: 'Cable Fly', sets: 4, reps: '12-15', restSeconds: 60 },
          { exerciseName: 'Dips', sets: 3, reps: '10-12', restSeconds: 75 },
          { exerciseName: 'Tricep Pushdown', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseName: 'Overhead Tricep Extension', sets: 3, reps: '12-15', restSeconds: 60 },
        ],
      },
      {
        name: 'Back / Biceps',
        dayIndex: 1,
        exercises: [
          { exerciseName: 'Barbell Row', sets: 4, reps: '8-10', restSeconds: 90 },
          { exerciseName: 'Lat Pulldown', sets: 4, reps: '10-12', restSeconds: 75 },
          { exerciseName: 'Cable Row', sets: 3, reps: '10-12', restSeconds: 75 },
          { exerciseName: 'Face Pull', sets: 3, reps: '15-20', restSeconds: 60 },
          { exerciseName: 'Barbell Curl', sets: 3, reps: '10-12', restSeconds: 60 },
          { exerciseName: 'Incline Dumbbell Curl', sets: 3, reps: '10-12', restSeconds: 60 },
        ],
      },
      {
        name: 'Legs A (Quads)',
        dayIndex: 2,
        exercises: [
          { exerciseName: 'Squat', sets: 4, reps: '8-10', restSeconds: 120 },
          { exerciseName: 'Leg Press', sets: 4, reps: '12-15', restSeconds: 90 },
          { exerciseName: 'Leg Extension', sets: 4, reps: '12-15', restSeconds: 60 },
          { exerciseName: 'Bulgarian Split Squat', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Calf Raise', sets: 4, reps: '15-20', restSeconds: 45 },
        ],
      },
      {
        name: 'Shoulders',
        dayIndex: 3,
        exercises: [
          { exerciseName: 'Overhead Press', sets: 4, reps: '8-10', restSeconds: 90 },
          { exerciseName: 'Dumbbell Shoulder Press', sets: 3, reps: '10-12', restSeconds: 75 },
          { exerciseName: 'Lateral Raise', sets: 4, reps: '12-15', restSeconds: 60 },
          { exerciseName: 'Cable Lateral Raise', sets: 3, reps: '15-20', restSeconds: 45 },
          { exerciseName: 'Rear Delt Fly', sets: 4, reps: '15-20', restSeconds: 60 },
        ],
      },
      {
        name: 'Legs B (Posterior)',
        dayIndex: 4,
        exercises: [
          { exerciseName: 'Romanian Deadlift', sets: 4, reps: '8-10', restSeconds: 120 },
          { exerciseName: 'Hip Thrust', sets: 4, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Leg Curl', sets: 4, reps: '12-15', restSeconds: 60 },
          { exerciseName: 'Bulgarian Split Squat', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Calf Raise', sets: 4, reps: '15-20', restSeconds: 45 },
        ],
      },
      {
        name: 'Arms',
        dayIndex: 5,
        exercises: [
          { exerciseName: 'Barbell Curl', sets: 4, reps: '8-10', restSeconds: 75 },
          { exerciseName: 'Skull Crusher', sets: 4, reps: '8-10', restSeconds: 75 },
          { exerciseName: 'Hammer Curl', sets: 3, reps: '10-12', restSeconds: 60 },
          { exerciseName: 'Tricep Pushdown', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseName: 'Incline Dumbbell Curl', sets: 3, reps: '10-12', restSeconds: 60 },
          { exerciseName: 'Overhead Tricep Extension', sets: 3, reps: '10-12', restSeconds: 60 },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════
  // 16. Legs Spécialisation (4j)
  // ═══════════════════════════════════════
  {
    name: 'Spécialisation Jambes (4j)',
    slug: 'specialisation-jambes-4j',
    description:
      'Programme pour rattraper un retard sur les jambes. 2 jours jambes + 2 jours haut du corps maintenance.',
    difficulty: ProgramDifficulty.INTERMEDIATE,
    goal: ProgramGoal.HYPERTROPHY,
    daysPerWeek: 4,
    durationWeeks: 8,
    icon: 'lucide:footprints',
    days: [
      {
        name: 'Legs A (Force)',
        dayIndex: 0,
        exercises: [
          { exerciseName: 'Squat', sets: 5, reps: '5-6', restSeconds: 240 },
          { exerciseName: 'Romanian Deadlift', sets: 4, reps: '6-8', restSeconds: 150 },
          { exerciseName: 'Leg Press', sets: 4, reps: '8-10', restSeconds: 120 },
          { exerciseName: 'Leg Curl', sets: 3, reps: '10-12', restSeconds: 60 },
          { exerciseName: 'Calf Raise', sets: 4, reps: '10-15', restSeconds: 60 },
        ],
      },
      {
        name: 'Upper (Maintenance)',
        dayIndex: 1,
        exercises: [
          { exerciseName: 'Bench Press', sets: 3, reps: '8-10', restSeconds: 120 },
          { exerciseName: 'Barbell Row', sets: 3, reps: '8-10', restSeconds: 120 },
          { exerciseName: 'Overhead Press', sets: 3, reps: '8-10', restSeconds: 90 },
          { exerciseName: 'Pull-up', sets: 3, reps: '6-10', restSeconds: 90 },
          { exerciseName: 'Lateral Raise', sets: 2, reps: '12-15', restSeconds: 60 },
        ],
      },
      {
        name: 'Legs B (Volume)',
        dayIndex: 2,
        exercises: [
          { exerciseName: 'Front Squat', sets: 4, reps: '8-10', restSeconds: 150 },
          { exerciseName: 'Hip Thrust', sets: 4, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Bulgarian Split Squat', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Leg Extension', sets: 4, reps: '12-15', restSeconds: 60 },
          { exerciseName: 'Leg Curl', sets: 4, reps: '12-15', restSeconds: 60 },
          { exerciseName: 'Calf Raise', sets: 4, reps: '15-20', restSeconds: 45 },
        ],
      },
      {
        name: 'Upper + Arms',
        dayIndex: 3,
        exercises: [
          { exerciseName: 'Incline Dumbbell Press', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Cable Row', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Dumbbell Shoulder Press', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Barbell Curl', sets: 2, reps: '10-12', restSeconds: 60 },
          { exerciseName: 'Tricep Pushdown', sets: 2, reps: '10-12', restSeconds: 60 },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════
  // 17. Torso / Limbs (4j)
  // ═══════════════════════════════════════
  {
    name: 'Torso / Limbs (4j)',
    slug: 'torso-limbs-4j',
    description:
      'Split en Torse (chest, back, shoulders) et Membres (arms, legs). Alternative au Upper/Lower.',
    difficulty: ProgramDifficulty.INTERMEDIATE,
    goal: ProgramGoal.GENERAL,
    daysPerWeek: 4,
    durationWeeks: 10,
    icon: 'lucide:scan',
    days: [
      {
        name: 'Torso A',
        dayIndex: 0,
        exercises: [
          { exerciseName: 'Bench Press', sets: 4, reps: '6-8', restSeconds: 150 },
          { exerciseName: 'Barbell Row', sets: 4, reps: '6-8', restSeconds: 150 },
          { exerciseName: 'Overhead Press', sets: 3, reps: '8-10', restSeconds: 120 },
          { exerciseName: 'Lat Pulldown', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Cable Fly', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseName: 'Face Pull', sets: 3, reps: '15-20', restSeconds: 60 },
        ],
      },
      {
        name: 'Limbs A',
        dayIndex: 1,
        exercises: [
          { exerciseName: 'Squat', sets: 4, reps: '6-8', restSeconds: 180 },
          { exerciseName: 'Romanian Deadlift', sets: 3, reps: '8-10', restSeconds: 120 },
          { exerciseName: 'Barbell Curl', sets: 3, reps: '8-10', restSeconds: 90 },
          { exerciseName: 'Skull Crusher', sets: 3, reps: '8-10', restSeconds: 90 },
          { exerciseName: 'Calf Raise', sets: 4, reps: '12-15', restSeconds: 60 },
        ],
      },
      {
        name: 'Torso B',
        dayIndex: 2,
        exercises: [
          { exerciseName: 'Incline Dumbbell Press', sets: 4, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Cable Row', sets: 4, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Dumbbell Shoulder Press', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Pull-up', sets: 3, reps: '6-10', restSeconds: 90 },
          { exerciseName: 'Lateral Raise', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseName: 'Rear Delt Fly', sets: 3, reps: '15-20', restSeconds: 60 },
        ],
      },
      {
        name: 'Limbs B',
        dayIndex: 3,
        exercises: [
          { exerciseName: 'Leg Press', sets: 4, reps: '10-12', restSeconds: 120 },
          { exerciseName: 'Hip Thrust', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Leg Curl', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseName: 'Hammer Curl', sets: 3, reps: '10-12', restSeconds: 60 },
          { exerciseName: 'Overhead Tricep Extension', sets: 3, reps: '10-12', restSeconds: 60 },
          { exerciseName: 'Calf Raise', sets: 4, reps: '15-20', restSeconds: 45 },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════
  // 18. Femme — Glutes & Shape (4j)
  // ═══════════════════════════════════════
  {
    name: 'Glutes & Shape (4j)',
    slug: 'glutes-shape-4j',
    description:
      'Programme axé fessiers, jambes et silhouette. Spécialement conçu pour sculpter le bas du corps.',
    difficulty: ProgramDifficulty.BEGINNER,
    goal: ProgramGoal.HYPERTROPHY,
    daysPerWeek: 4,
    durationWeeks: 10,
    icon: 'lucide:sparkles',
    days: [
      {
        name: 'Lower (Glutes focus)',
        dayIndex: 0,
        exercises: [
          { exerciseName: 'Hip Thrust', sets: 4, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Romanian Deadlift', sets: 4, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Bulgarian Split Squat', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Leg Curl', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseName: 'Calf Raise', sets: 3, reps: '15-20', restSeconds: 45 },
        ],
      },
      {
        name: 'Upper',
        dayIndex: 1,
        exercises: [
          { exerciseName: 'Dumbbell Bench Press', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Cable Row', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Dumbbell Shoulder Press', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Lat Pulldown', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Lateral Raise', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseName: 'Face Pull', sets: 3, reps: '15-20', restSeconds: 60 },
        ],
      },
      {
        name: 'Lower (Quads + Glutes)',
        dayIndex: 2,
        exercises: [
          { exerciseName: 'Squat', sets: 4, reps: '8-10', restSeconds: 120 },
          { exerciseName: 'Hip Thrust', sets: 3, reps: '12-15', restSeconds: 90 },
          { exerciseName: 'Leg Press', sets: 3, reps: '12-15', restSeconds: 90 },
          { exerciseName: 'Leg Extension', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseName: 'Leg Curl', sets: 3, reps: '12-15', restSeconds: 60 },
        ],
      },
      {
        name: 'Full Body Light',
        dayIndex: 3,
        exercises: [
          { exerciseName: 'Romanian Deadlift', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Incline Dumbbell Press', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Pull-up', sets: 3, reps: '6-10', restSeconds: 90 },
          { exerciseName: 'Bulgarian Split Squat', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Lateral Raise', sets: 3, reps: '12-15', restSeconds: 60 },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════
  // 19. Minimaliste (2j)
  // ═══════════════════════════════════════
  {
    name: 'Minimaliste (2j)',
    slug: 'minimaliste-2j',
    description:
      'Seulement 2 séances par semaine, mouvements composés essentiels. Pour ceux qui ont peu de temps.',
    difficulty: ProgramDifficulty.BEGINNER,
    goal: ProgramGoal.GENERAL,
    daysPerWeek: 2,
    durationWeeks: 16,
    icon: 'lucide:minus-circle',
    days: [
      {
        name: 'Séance A',
        dayIndex: 0,
        exercises: [
          { exerciseName: 'Squat', sets: 3, reps: '5-8', restSeconds: 180 },
          { exerciseName: 'Bench Press', sets: 3, reps: '5-8', restSeconds: 180 },
          { exerciseName: 'Barbell Row', sets: 3, reps: '5-8', restSeconds: 180 },
          { exerciseName: 'Overhead Press', sets: 2, reps: '8-10', restSeconds: 120 },
          { exerciseName: 'Barbell Curl', sets: 2, reps: '10-12', restSeconds: 60 },
        ],
      },
      {
        name: 'Séance B',
        dayIndex: 1,
        exercises: [
          { exerciseName: 'Deadlift', sets: 3, reps: '5', restSeconds: 240 },
          { exerciseName: 'Incline Dumbbell Press', sets: 3, reps: '8-10', restSeconds: 120 },
          { exerciseName: 'Pull-up', sets: 3, reps: '6-10', restSeconds: 120 },
          { exerciseName: 'Leg Press', sets: 3, reps: '10-12', restSeconds: 120 },
          { exerciseName: 'Face Pull', sets: 2, reps: '15-20', restSeconds: 60 },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════
  // 20. Functional Fitness (4j)
  // ═══════════════════════════════════════
  {
    name: 'Functional Fitness (4j)',
    slug: 'functional-fitness-4j',
    description:
      'Programme orienté performance fonctionnelle. Mouvements polyarticulaires, stabilité et endurance musculaire.',
    difficulty: ProgramDifficulty.INTERMEDIATE,
    goal: ProgramGoal.ENDURANCE,
    daysPerWeek: 4,
    durationWeeks: 8,
    icon: 'lucide:activity',
    days: [
      {
        name: 'Push + Core',
        dayIndex: 0,
        exercises: [
          { exerciseName: 'Overhead Press', sets: 4, reps: '6-8', restSeconds: 120 },
          { exerciseName: 'Dumbbell Bench Press', sets: 3, reps: '8-10', restSeconds: 90 },
          { exerciseName: 'Dips', sets: 3, reps: '10-15', restSeconds: 90 },
          { exerciseName: 'Lateral Raise', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseName: 'Plank', sets: 3, reps: '45-60s', restSeconds: 60 },
          { exerciseName: 'Hanging Leg Raise', sets: 3, reps: '10-15', restSeconds: 60 },
        ],
      },
      {
        name: 'Pull + Core',
        dayIndex: 1,
        exercises: [
          { exerciseName: 'Deadlift', sets: 4, reps: '5-6', restSeconds: 180 },
          { exerciseName: 'Pull-up', sets: 4, reps: '6-10', restSeconds: 120 },
          { exerciseName: 'Dumbbell Row', sets: 3, reps: '8-10', restSeconds: 90 },
          { exerciseName: 'Face Pull', sets: 3, reps: '15-20', restSeconds: 60 },
          { exerciseName: 'Barbell Curl', sets: 2, reps: '10-12', restSeconds: 60 },
          { exerciseName: 'Plank', sets: 3, reps: '45-60s', restSeconds: 60 },
        ],
      },
      {
        name: 'Lower + Explosivité',
        dayIndex: 2,
        exercises: [
          { exerciseName: 'Front Squat', sets: 4, reps: '6-8', restSeconds: 150 },
          { exerciseName: 'Romanian Deadlift', sets: 3, reps: '8-10', restSeconds: 120 },
          { exerciseName: 'Bulgarian Split Squat', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Leg Curl', sets: 3, reps: '10-12', restSeconds: 60 },
          { exerciseName: 'Calf Raise', sets: 3, reps: '15-20', restSeconds: 60 },
        ],
      },
      {
        name: 'Full Body Circuit',
        dayIndex: 3,
        exercises: [
          {
            exerciseName: 'Squat',
            sets: 3,
            reps: '10',
            restSeconds: 60,
            notes: 'Enchaîner en circuit, repos minimal',
          },
          { exerciseName: 'Bench Press', sets: 3, reps: '10', restSeconds: 60 },
          { exerciseName: 'Barbell Row', sets: 3, reps: '10', restSeconds: 60 },
          { exerciseName: 'Overhead Press', sets: 3, reps: '10', restSeconds: 60 },
          { exerciseName: 'Hanging Leg Raise', sets: 3, reps: '15', restSeconds: 60 },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════
  // 21. Recomp (5j)
  // ═══════════════════════════════════════
  {
    name: 'Recomposition (5j)',
    slug: 'recomp-5j',
    description:
      'Programme pour perdre du gras et gagner du muscle simultanément. Mix force et volume avec séries légères.',
    difficulty: ProgramDifficulty.INTERMEDIATE,
    goal: ProgramGoal.GENERAL,
    daysPerWeek: 5,
    durationWeeks: 12,
    icon: 'lucide:refresh-cw',
    days: [
      {
        name: 'Upper Force',
        dayIndex: 0,
        exercises: [
          { exerciseName: 'Bench Press', sets: 4, reps: '5-6', restSeconds: 180 },
          { exerciseName: 'Barbell Row', sets: 4, reps: '5-6', restSeconds: 180 },
          { exerciseName: 'Overhead Press', sets: 3, reps: '6-8', restSeconds: 150 },
          { exerciseName: 'Pull-up', sets: 3, reps: '6-10', restSeconds: 120 },
          { exerciseName: 'Barbell Curl', sets: 2, reps: '8-10', restSeconds: 60 },
        ],
      },
      {
        name: 'Lower Force',
        dayIndex: 1,
        exercises: [
          { exerciseName: 'Squat', sets: 4, reps: '5-6', restSeconds: 240 },
          { exerciseName: 'Romanian Deadlift', sets: 3, reps: '6-8', restSeconds: 180 },
          { exerciseName: 'Leg Press', sets: 3, reps: '8-10', restSeconds: 120 },
          { exerciseName: 'Leg Curl', sets: 3, reps: '8-10', restSeconds: 90 },
          { exerciseName: 'Calf Raise', sets: 3, reps: '10-15', restSeconds: 60 },
        ],
      },
      {
        name: 'Upper Volume',
        dayIndex: 2,
        exercises: [
          { exerciseName: 'Incline Dumbbell Press', sets: 4, reps: '10-12', restSeconds: 75 },
          { exerciseName: 'Cable Row', sets: 4, reps: '10-12', restSeconds: 75 },
          { exerciseName: 'Dumbbell Shoulder Press', sets: 3, reps: '10-12', restSeconds: 75 },
          { exerciseName: 'Lat Pulldown', sets: 3, reps: '10-12', restSeconds: 75 },
          { exerciseName: 'Cable Fly', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseName: 'Lateral Raise', sets: 3, reps: '12-15', restSeconds: 60 },
        ],
      },
      {
        name: 'Lower Volume',
        dayIndex: 3,
        exercises: [
          { exerciseName: 'Front Squat', sets: 4, reps: '8-10', restSeconds: 120 },
          { exerciseName: 'Hip Thrust', sets: 4, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Bulgarian Split Squat', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Leg Extension', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseName: 'Leg Curl', sets: 3, reps: '12-15', restSeconds: 60 },
        ],
      },
      {
        name: 'Full Body Métabolique',
        dayIndex: 4,
        exercises: [
          { exerciseName: 'Deadlift', sets: 3, reps: '8', restSeconds: 90 },
          { exerciseName: 'Dumbbell Bench Press', sets: 3, reps: '12', restSeconds: 60 },
          { exerciseName: 'Dumbbell Row', sets: 3, reps: '12', restSeconds: 60 },
          { exerciseName: 'Squat', sets: 3, reps: '12', restSeconds: 60 },
          { exerciseName: 'Face Pull', sets: 3, reps: '15', restSeconds: 45 },
          { exerciseName: 'Plank', sets: 3, reps: '45s', restSeconds: 45 },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════
  // 22. Powerbuilding (5j)
  // ═══════════════════════════════════════
  {
    name: 'Powerbuilding (5j)',
    slug: 'powerbuilding-5j',
    description:
      'Le meilleur des deux mondes : force sur les composés + hypertrophie en accessoires. Pour devenir fort ET musclé.',
    difficulty: ProgramDifficulty.ADVANCED,
    goal: ProgramGoal.STRENGTH,
    daysPerWeek: 5,
    durationWeeks: 10,
    icon: 'lucide:shield',
    days: [
      {
        name: 'Squat + Legs',
        dayIndex: 0,
        exercises: [
          {
            exerciseName: 'Squat',
            sets: 5,
            reps: '3-5',
            restSeconds: 300,
            notes: 'Progression: +2.5kg/semaine',
          },
          { exerciseName: 'Leg Press', sets: 4, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Romanian Deadlift', sets: 3, reps: '8-10', restSeconds: 120 },
          { exerciseName: 'Leg Extension', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseName: 'Leg Curl', sets: 3, reps: '12-15', restSeconds: 60 },
        ],
      },
      {
        name: 'Bench + Chest/Triceps',
        dayIndex: 1,
        exercises: [
          {
            exerciseName: 'Bench Press',
            sets: 5,
            reps: '3-5',
            restSeconds: 300,
            notes: 'Progression: +2.5kg/semaine',
          },
          { exerciseName: 'Incline Dumbbell Press', sets: 4, reps: '8-10', restSeconds: 90 },
          { exerciseName: 'Cable Fly', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseName: 'Dips', sets: 3, reps: '8-12', restSeconds: 90 },
          { exerciseName: 'Tricep Pushdown', sets: 3, reps: '12-15', restSeconds: 60 },
        ],
      },
      {
        name: 'Deadlift + Back',
        dayIndex: 2,
        exercises: [
          {
            exerciseName: 'Deadlift',
            sets: 5,
            reps: '3-5',
            restSeconds: 300,
            notes: 'Progression: +5kg/semaine',
          },
          { exerciseName: 'Barbell Row', sets: 4, reps: '8-10', restSeconds: 120 },
          { exerciseName: 'Lat Pulldown', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Cable Row', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Face Pull', sets: 3, reps: '15-20', restSeconds: 60 },
        ],
      },
      {
        name: 'OHP + Shoulders/Arms',
        dayIndex: 3,
        exercises: [
          {
            exerciseName: 'Overhead Press',
            sets: 5,
            reps: '3-5',
            restSeconds: 240,
            notes: 'Progression: +1.25kg/semaine',
          },
          { exerciseName: 'Lateral Raise', sets: 4, reps: '12-15', restSeconds: 60 },
          { exerciseName: 'Rear Delt Fly', sets: 3, reps: '15-20', restSeconds: 60 },
          { exerciseName: 'Barbell Curl', sets: 3, reps: '8-10', restSeconds: 90 },
          { exerciseName: 'Skull Crusher', sets: 3, reps: '8-10', restSeconds: 90 },
        ],
      },
      {
        name: 'Volume Day',
        dayIndex: 4,
        exercises: [
          { exerciseName: 'Front Squat', sets: 3, reps: '8-10', restSeconds: 120 },
          { exerciseName: 'Dumbbell Bench Press', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Pull-up', sets: 3, reps: '8-12', restSeconds: 90 },
          { exerciseName: 'Hip Thrust', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseName: 'Hammer Curl', sets: 3, reps: '10-12', restSeconds: 60 },
          { exerciseName: 'Overhead Tricep Extension', sets: 3, reps: '10-12', restSeconds: 60 },
        ],
      },
    ],
  },
];
