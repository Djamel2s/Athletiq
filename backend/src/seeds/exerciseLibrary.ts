import { AppDataSource } from '../config/database.js'
import { ExerciseLibrary, MuscleGroup, Equipment, Difficulty } from '../entities/ExerciseLibrary.js'

export const exercisesData = [
  // CHEST
  {
    name: 'Bench Press',
    description: 'Un exercice composé qui cible principalement les pectoraux',
    instructions: 'Allongez-vous sur un banc plat, descendez la barre jusqu\'à la poitrine puis poussez vers le haut',
    muscleGroups: [MuscleGroup.CHEST, MuscleGroup.TRICEPS, MuscleGroup.SHOULDERS],
    primaryMuscle: MuscleGroup.CHEST,
    equipment: Equipment.BARBELL,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: 'Incline Dumbbell Press',
    description: 'Développé incliné aux haltères pour cibler le haut des pectoraux',
    instructions: 'Sur un banc incliné, poussez les haltères vers le haut en gardant les coudes à 45°',
    muscleGroups: [MuscleGroup.CHEST, MuscleGroup.SHOULDERS, MuscleGroup.TRICEPS],
    primaryMuscle: MuscleGroup.CHEST,
    equipment: Equipment.DUMBBELL,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: 'Push-ups',
    description: 'Pompes classiques au poids du corps',
    instructions: 'Position planche, descendez en pliant les coudes puis remontez',
    muscleGroups: [MuscleGroup.CHEST, MuscleGroup.TRICEPS, MuscleGroup.SHOULDERS],
    primaryMuscle: MuscleGroup.CHEST,
    equipment: Equipment.BODYWEIGHT,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Cable Flyes',
    description: 'Écarté aux câbles pour isoler les pectoraux',
    instructions: 'Debout entre deux câbles, écartez les bras puis ramenez-les devant vous',
    muscleGroups: [MuscleGroup.CHEST],
    primaryMuscle: MuscleGroup.CHEST,
    equipment: Equipment.CABLE,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: 'Dips',
    description: 'Dips pour pectoraux et triceps',
    instructions: 'Penchez-vous en avant et descendez en pliant les coudes',
    muscleGroups: [MuscleGroup.CHEST, MuscleGroup.TRICEPS],
    primaryMuscle: MuscleGroup.CHEST,
    equipment: Equipment.BODYWEIGHT,
    difficulty: Difficulty.INTERMEDIATE
  },

  // BACK
  {
    name: 'Deadlift',
    description: 'Soulevé de terre, exercice composé complet',
    instructions: 'Soulevez la barre du sol en gardant le dos droit et les hanches basses',
    muscleGroups: [MuscleGroup.BACK, MuscleGroup.LEGS, MuscleGroup.GLUTES, MuscleGroup.HAMSTRINGS],
    primaryMuscle: MuscleGroup.BACK,
    equipment: Equipment.BARBELL,
    difficulty: Difficulty.ADVANCED
  },
  {
    name: 'Pull-ups',
    description: 'Tractions à la barre fixe',
    instructions: 'Suspendez-vous à une barre et tirez-vous vers le haut jusqu\'à ce que le menton dépasse',
    muscleGroups: [MuscleGroup.BACK, MuscleGroup.BICEPS],
    primaryMuscle: MuscleGroup.BACK,
    equipment: Equipment.BODYWEIGHT,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: 'Bent Over Row',
    description: 'Rowing barre buste penché',
    instructions: 'Penchez-vous en avant et tirez la barre vers le bas du ventre',
    muscleGroups: [MuscleGroup.BACK, MuscleGroup.BICEPS],
    primaryMuscle: MuscleGroup.BACK,
    equipment: Equipment.BARBELL,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: 'Lat Pulldown',
    description: 'Tirage vertical à la poulie haute',
    instructions: 'Tirez la barre vers la poitrine en gardant le dos droit',
    muscleGroups: [MuscleGroup.BACK, MuscleGroup.BICEPS],
    primaryMuscle: MuscleGroup.BACK,
    equipment: Equipment.CABLE,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Seated Cable Row',
    description: 'Rowing assis à la poulie',
    instructions: 'Assis, tirez la poignée vers le bas du ventre en gardant le dos droit',
    muscleGroups: [MuscleGroup.BACK, MuscleGroup.BICEPS],
    primaryMuscle: MuscleGroup.BACK,
    equipment: Equipment.CABLE,
    difficulty: Difficulty.BEGINNER
  },

  // SHOULDERS
  {
    name: 'Overhead Press',
    description: 'Développé militaire à la barre',
    instructions: 'Debout, poussez la barre au-dessus de la tête',
    muscleGroups: [MuscleGroup.SHOULDERS, MuscleGroup.TRICEPS],
    primaryMuscle: MuscleGroup.SHOULDERS,
    equipment: Equipment.BARBELL,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: 'Lateral Raises',
    description: 'Élévations latérales aux haltères',
    instructions: 'Levez les haltères sur les côtés jusqu\'à hauteur des épaules',
    muscleGroups: [MuscleGroup.SHOULDERS],
    primaryMuscle: MuscleGroup.SHOULDERS,
    equipment: Equipment.DUMBBELL,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Front Raises',
    description: 'Élévations frontales',
    instructions: 'Levez les haltères devant vous jusqu\'à hauteur des épaules',
    muscleGroups: [MuscleGroup.SHOULDERS],
    primaryMuscle: MuscleGroup.SHOULDERS,
    equipment: Equipment.DUMBBELL,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Face Pulls',
    description: 'Tirage visage à la corde',
    instructions: 'Tirez la corde vers le visage en écartant les mains',
    muscleGroups: [MuscleGroup.SHOULDERS, MuscleGroup.BACK],
    primaryMuscle: MuscleGroup.SHOULDERS,
    equipment: Equipment.CABLE,
    difficulty: Difficulty.INTERMEDIATE
  },

  // LEGS
  {
    name: 'Squat',
    description: 'Squat à la barre, roi des exercices jambes',
    instructions: 'Descendez en pliant les genoux jusqu\'à ce que les cuisses soient parallèles au sol',
    muscleGroups: [MuscleGroup.LEGS, MuscleGroup.QUADS, MuscleGroup.GLUTES],
    primaryMuscle: MuscleGroup.LEGS,
    equipment: Equipment.BARBELL,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: 'Leg Press',
    description: 'Presse à cuisses',
    instructions: 'Poussez la plateforme avec les pieds',
    muscleGroups: [MuscleGroup.LEGS, MuscleGroup.QUADS, MuscleGroup.GLUTES],
    primaryMuscle: MuscleGroup.LEGS,
    equipment: Equipment.MACHINE,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Romanian Deadlift',
    description: 'Soulevé de terre roumain pour ischio-jambiers',
    instructions: 'Descendez la barre le long des jambes en gardant les genoux légèrement fléchis',
    muscleGroups: [MuscleGroup.HAMSTRINGS, MuscleGroup.GLUTES, MuscleGroup.BACK],
    primaryMuscle: MuscleGroup.HAMSTRINGS,
    equipment: Equipment.BARBELL,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: 'Leg Curl',
    description: 'Curl ischio-jambiers à la machine',
    instructions: 'Allongé, fléchissez les jambes en ramenant les talons vers les fesses',
    muscleGroups: [MuscleGroup.HAMSTRINGS],
    primaryMuscle: MuscleGroup.HAMSTRINGS,
    equipment: Equipment.MACHINE,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Leg Extension',
    description: 'Extension de jambes à la machine',
    instructions: 'Assis, étendez les jambes en contractant les quadriceps',
    muscleGroups: [MuscleGroup.QUADS],
    primaryMuscle: MuscleGroup.QUADS,
    equipment: Equipment.MACHINE,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Calf Raises',
    description: 'Élévation des mollets',
    instructions: 'Montez sur la pointe des pieds puis redescendez',
    muscleGroups: [MuscleGroup.CALVES],
    primaryMuscle: MuscleGroup.CALVES,
    equipment: Equipment.MACHINE,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Lunges',
    description: 'Fentes avant',
    instructions: 'Faites un grand pas en avant et descendez jusqu\'à ce que le genou arrière touche presque le sol',
    muscleGroups: [MuscleGroup.LEGS, MuscleGroup.QUADS, MuscleGroup.GLUTES],
    primaryMuscle: MuscleGroup.LEGS,
    equipment: Equipment.BODYWEIGHT,
    difficulty: Difficulty.BEGINNER
  },

  // BICEPS
  {
    name: 'Barbell Curl',
    description: 'Curl barre pour biceps',
    instructions: 'Fléchissez les coudes en remontant la barre vers les épaules',
    muscleGroups: [MuscleGroup.BICEPS],
    primaryMuscle: MuscleGroup.BICEPS,
    equipment: Equipment.BARBELL,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Hammer Curl',
    description: 'Curl marteau aux haltères',
    instructions: 'Fléchissez les coudes avec les haltères en position neutre',
    muscleGroups: [MuscleGroup.BICEPS],
    primaryMuscle: MuscleGroup.BICEPS,
    equipment: Equipment.DUMBBELL,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Concentration Curl',
    description: 'Curl concentration assis',
    instructions: 'Assis, coude appuyé sur la cuisse, fléchissez le bras',
    muscleGroups: [MuscleGroup.BICEPS],
    primaryMuscle: MuscleGroup.BICEPS,
    equipment: Equipment.DUMBBELL,
    difficulty: Difficulty.BEGINNER
  },

  // TRICEPS
  {
    name: 'Tricep Pushdown',
    description: 'Extension triceps à la poulie haute',
    instructions: 'Poussez la barre ou corde vers le bas en gardant les coudes fixes',
    muscleGroups: [MuscleGroup.TRICEPS],
    primaryMuscle: MuscleGroup.TRICEPS,
    equipment: Equipment.CABLE,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Overhead Tricep Extension',
    description: 'Extension triceps au-dessus de la tête',
    instructions: 'Tendez les bras au-dessus de la tête avec un haltère',
    muscleGroups: [MuscleGroup.TRICEPS],
    primaryMuscle: MuscleGroup.TRICEPS,
    equipment: Equipment.DUMBBELL,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Close Grip Bench Press',
    description: 'Développé couché prise serrée',
    instructions: 'Comme le développé couché mais avec les mains rapprochées',
    muscleGroups: [MuscleGroup.TRICEPS, MuscleGroup.CHEST],
    primaryMuscle: MuscleGroup.TRICEPS,
    equipment: Equipment.BARBELL,
    difficulty: Difficulty.INTERMEDIATE
  },

  // ABS
  {
    name: 'Plank',
    description: 'Gainage statique',
    instructions: 'Maintenez la position planche en contractant les abdos',
    muscleGroups: [MuscleGroup.ABS],
    primaryMuscle: MuscleGroup.ABS,
    equipment: Equipment.BODYWEIGHT,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Crunches',
    description: 'Crunchs abdominaux',
    instructions: 'Allongé sur le dos, relevez le buste en contractant les abdos',
    muscleGroups: [MuscleGroup.ABS],
    primaryMuscle: MuscleGroup.ABS,
    equipment: Equipment.BODYWEIGHT,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Hanging Leg Raises',
    description: 'Relevé de jambes suspendu',
    instructions: 'Suspendu à une barre, relevez les jambes vers le haut',
    muscleGroups: [MuscleGroup.ABS],
    primaryMuscle: MuscleGroup.ABS,
    equipment: Equipment.BODYWEIGHT,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: 'Russian Twists',
    description: 'Rotations russes',
    instructions: 'Assis, pieds levés, tournez le buste de gauche à droite',
    muscleGroups: [MuscleGroup.ABS],
    primaryMuscle: MuscleGroup.ABS,
    equipment: Equipment.BODYWEIGHT,
    difficulty: Difficulty.INTERMEDIATE
  },

  // CARDIO
  {
    name: 'Running',
    description: 'Course à pied',
    instructions: 'Courez à votre rythme',
    muscleGroups: [MuscleGroup.CARDIO, MuscleGroup.LEGS],
    primaryMuscle: MuscleGroup.CARDIO,
    equipment: Equipment.OTHER,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Cycling',
    description: 'Vélo',
    instructions: 'Pédalez à votre rythme',
    muscleGroups: [MuscleGroup.CARDIO, MuscleGroup.LEGS],
    primaryMuscle: MuscleGroup.CARDIO,
    equipment: Equipment.MACHINE,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Rowing Machine',
    description: 'Rameur',
    instructions: 'Tirez la poignée en poussant sur les jambes',
    muscleGroups: [MuscleGroup.CARDIO, MuscleGroup.BACK, MuscleGroup.LEGS],
    primaryMuscle: MuscleGroup.CARDIO,
    equipment: Equipment.MACHINE,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Jump Rope',
    description: 'Corde à sauter',
    instructions: 'Sautez à la corde à votre rythme',
    muscleGroups: [MuscleGroup.CARDIO, MuscleGroup.CALVES],
    primaryMuscle: MuscleGroup.CARDIO,
    equipment: Equipment.OTHER,
    difficulty: Difficulty.BEGINNER
  }
]

export async function seedExerciseLibrary() {
  const exerciseRepo = AppDataSource.getRepository(ExerciseLibrary)

  console.log('🌱 Seeding exercise library...')

  for (const exerciseData of exercisesData) {
    // Check if exercise already exists
    const existing = await exerciseRepo.findOne({
      where: { name: exerciseData.name }
    })

    if (!existing) {
      const exercise = exerciseRepo.create(exerciseData)
      await exerciseRepo.save(exercise)
      console.log(`✅ Created: ${exerciseData.name}`)
    } else {
      console.log(`⏭️  Skipped (already exists): ${exerciseData.name}`)
    }
  }

  console.log('🎉 Exercise library seeding complete!')
}
