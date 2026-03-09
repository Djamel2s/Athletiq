import { AppDataSource } from '../config/database.js'
import { ExerciseLibrary, MuscleGroup, Equipment, Difficulty } from '../entities/ExerciseLibrary.js'

export const exercisesData = [
  // CHEST
  {
    name: 'Développé couché',
    description: 'Un exercice composé qui cible principalement les pectoraux',
    instructions: 'Allongez-vous sur un banc plat, descendez la barre jusqu\'à la poitrine puis poussez vers le haut',
    muscleGroups: [MuscleGroup.CHEST, MuscleGroup.TRICEPS, MuscleGroup.SHOULDERS],
    primaryMuscle: MuscleGroup.CHEST,
    equipment: Equipment.BARBELL,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: 'Développé incliné haltères',
    description: 'Développé incliné aux haltères pour cibler le haut des pectoraux',
    instructions: 'Sur un banc incliné, poussez les haltères vers le haut en gardant les coudes à 45°',
    muscleGroups: [MuscleGroup.CHEST, MuscleGroup.SHOULDERS, MuscleGroup.TRICEPS],
    primaryMuscle: MuscleGroup.CHEST,
    equipment: Equipment.DUMBBELL,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: 'Pompes',
    description: 'Pompes classiques au poids du corps',
    instructions: 'Position planche, descendez en pliant les coudes puis remontez',
    muscleGroups: [MuscleGroup.CHEST, MuscleGroup.TRICEPS, MuscleGroup.SHOULDERS],
    primaryMuscle: MuscleGroup.CHEST,
    equipment: Equipment.BODYWEIGHT,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Écarté poulie',
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
    name: 'Soulevé de terre',
    description: 'Soulevé de terre, exercice composé complet',
    instructions: 'Soulevez la barre du sol en gardant le dos droit et les hanches basses',
    muscleGroups: [MuscleGroup.BACK, MuscleGroup.LEGS, MuscleGroup.GLUTES, MuscleGroup.HAMSTRINGS],
    primaryMuscle: MuscleGroup.BACK,
    equipment: Equipment.BARBELL,
    difficulty: Difficulty.ADVANCED
  },
  {
    name: 'Tractions',
    description: 'Tractions à la barre fixe',
    instructions: 'Suspendez-vous à une barre et tirez-vous vers le haut jusqu\'à ce que le menton dépasse',
    muscleGroups: [MuscleGroup.BACK, MuscleGroup.BICEPS],
    primaryMuscle: MuscleGroup.BACK,
    equipment: Equipment.BODYWEIGHT,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: 'Rowing barre',
    description: 'Rowing barre buste penché',
    instructions: 'Penchez-vous en avant et tirez la barre vers le bas du ventre',
    muscleGroups: [MuscleGroup.BACK, MuscleGroup.BICEPS],
    primaryMuscle: MuscleGroup.BACK,
    equipment: Equipment.BARBELL,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: 'Tirage vertical',
    description: 'Tirage vertical à la poulie haute',
    instructions: 'Tirez la barre vers la poitrine en gardant le dos droit',
    muscleGroups: [MuscleGroup.BACK, MuscleGroup.BICEPS],
    primaryMuscle: MuscleGroup.BACK,
    equipment: Equipment.CABLE,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Rowing poulie basse',
    description: 'Rowing assis à la poulie',
    instructions: 'Assis, tirez la poignée vers le bas du ventre en gardant le dos droit',
    muscleGroups: [MuscleGroup.BACK, MuscleGroup.BICEPS],
    primaryMuscle: MuscleGroup.BACK,
    equipment: Equipment.CABLE,
    difficulty: Difficulty.BEGINNER
  },

  // SHOULDERS
  {
    name: 'Développé militaire',
    description: 'Développé militaire à la barre',
    instructions: 'Debout, poussez la barre au-dessus de la tête',
    muscleGroups: [MuscleGroup.SHOULDERS, MuscleGroup.TRICEPS],
    primaryMuscle: MuscleGroup.SHOULDERS,
    equipment: Equipment.BARBELL,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: 'Élévations latérales',
    description: 'Élévations latérales aux haltères',
    instructions: 'Levez les haltères sur les côtés jusqu\'à hauteur des épaules',
    muscleGroups: [MuscleGroup.SHOULDERS],
    primaryMuscle: MuscleGroup.SHOULDERS,
    equipment: Equipment.DUMBBELL,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Élévations frontales',
    description: 'Élévations frontales',
    instructions: 'Levez les haltères devant vous jusqu\'à hauteur des épaules',
    muscleGroups: [MuscleGroup.SHOULDERS],
    primaryMuscle: MuscleGroup.SHOULDERS,
    equipment: Equipment.DUMBBELL,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Tirage visage',
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
    name: 'Presse à cuisses',
    description: 'Presse à cuisses',
    instructions: 'Poussez la plateforme avec les pieds',
    muscleGroups: [MuscleGroup.LEGS, MuscleGroup.QUADS, MuscleGroup.GLUTES],
    primaryMuscle: MuscleGroup.LEGS,
    equipment: Equipment.MACHINE,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Soulevé de terre roumain',
    description: 'Soulevé de terre roumain pour ischio-jambiers',
    instructions: 'Descendez la barre le long des jambes en gardant les genoux légèrement fléchis',
    muscleGroups: [MuscleGroup.HAMSTRINGS, MuscleGroup.GLUTES, MuscleGroup.BACK],
    primaryMuscle: MuscleGroup.HAMSTRINGS,
    equipment: Equipment.BARBELL,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: 'Curl ischio-jambiers',
    description: 'Curl ischio-jambiers à la machine',
    instructions: 'Allongé, fléchissez les jambes en ramenant les talons vers les fesses',
    muscleGroups: [MuscleGroup.HAMSTRINGS],
    primaryMuscle: MuscleGroup.HAMSTRINGS,
    equipment: Equipment.MACHINE,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Extension de jambes',
    description: 'Extension de jambes à la machine',
    instructions: 'Assis, étendez les jambes en contractant les quadriceps',
    muscleGroups: [MuscleGroup.QUADS],
    primaryMuscle: MuscleGroup.QUADS,
    equipment: Equipment.MACHINE,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Mollets debout',
    description: 'Élévation des mollets',
    instructions: 'Montez sur la pointe des pieds puis redescendez',
    muscleGroups: [MuscleGroup.CALVES],
    primaryMuscle: MuscleGroup.CALVES,
    equipment: Equipment.MACHINE,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Fentes',
    description: 'Fentes avant',
    instructions: 'Faites un grand pas en avant et descendez jusqu\'à ce que le genou arrière touche presque le sol',
    muscleGroups: [MuscleGroup.LEGS, MuscleGroup.QUADS, MuscleGroup.GLUTES],
    primaryMuscle: MuscleGroup.LEGS,
    equipment: Equipment.BODYWEIGHT,
    difficulty: Difficulty.BEGINNER
  },

  // BICEPS
  {
    name: 'Curl barre',
    description: 'Curl barre pour biceps',
    instructions: 'Fléchissez les coudes en remontant la barre vers les épaules',
    muscleGroups: [MuscleGroup.BICEPS],
    primaryMuscle: MuscleGroup.BICEPS,
    equipment: Equipment.BARBELL,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Curl marteau',
    description: 'Curl marteau aux haltères',
    instructions: 'Fléchissez les coudes avec les haltères en position neutre',
    muscleGroups: [MuscleGroup.BICEPS],
    primaryMuscle: MuscleGroup.BICEPS,
    equipment: Equipment.DUMBBELL,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Curl concentration',
    description: 'Curl concentration assis',
    instructions: 'Assis, coude appuyé sur la cuisse, fléchissez le bras',
    muscleGroups: [MuscleGroup.BICEPS],
    primaryMuscle: MuscleGroup.BICEPS,
    equipment: Equipment.DUMBBELL,
    difficulty: Difficulty.BEGINNER
  },

  // TRICEPS
  {
    name: 'Extension triceps poulie',
    description: 'Extension triceps à la poulie haute',
    instructions: 'Poussez la barre ou corde vers le bas en gardant les coudes fixes',
    muscleGroups: [MuscleGroup.TRICEPS],
    primaryMuscle: MuscleGroup.TRICEPS,
    equipment: Equipment.CABLE,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Extension triceps overhead',
    description: 'Extension triceps au-dessus de la tête',
    instructions: 'Tendez les bras au-dessus de la tête avec un haltère',
    muscleGroups: [MuscleGroup.TRICEPS],
    primaryMuscle: MuscleGroup.TRICEPS,
    equipment: Equipment.DUMBBELL,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Développé couché prise serrée',
    description: 'Développé couché prise serrée',
    instructions: 'Comme le développé couché mais avec les mains rapprochées',
    muscleGroups: [MuscleGroup.TRICEPS, MuscleGroup.CHEST],
    primaryMuscle: MuscleGroup.TRICEPS,
    equipment: Equipment.BARBELL,
    difficulty: Difficulty.INTERMEDIATE
  },

  // ABS
  {
    name: 'Gainage',
    description: 'Gainage statique',
    instructions: 'Maintenez la position planche en contractant les abdos',
    muscleGroups: [MuscleGroup.ABS],
    primaryMuscle: MuscleGroup.ABS,
    equipment: Equipment.BODYWEIGHT,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Crunchs',
    description: 'Crunchs abdominaux',
    instructions: 'Allongé sur le dos, relevez le buste en contractant les abdos',
    muscleGroups: [MuscleGroup.ABS],
    primaryMuscle: MuscleGroup.ABS,
    equipment: Equipment.BODYWEIGHT,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Relevé de jambes suspendu',
    description: 'Relevé de jambes suspendu',
    instructions: 'Suspendu à une barre, relevez les jambes vers le haut',
    muscleGroups: [MuscleGroup.ABS],
    primaryMuscle: MuscleGroup.ABS,
    equipment: Equipment.BODYWEIGHT,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: 'Rotations russes',
    description: 'Rotations russes',
    instructions: 'Assis, pieds levés, tournez le buste de gauche à droite',
    muscleGroups: [MuscleGroup.ABS],
    primaryMuscle: MuscleGroup.ABS,
    equipment: Equipment.BODYWEIGHT,
    difficulty: Difficulty.INTERMEDIATE
  },

  // CARDIO
  {
    name: 'Course à pied',
    description: 'Course à pied',
    instructions: 'Courez à votre rythme',
    muscleGroups: [MuscleGroup.CARDIO, MuscleGroup.LEGS],
    primaryMuscle: MuscleGroup.CARDIO,
    equipment: Equipment.OTHER,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Vélo',
    description: 'Vélo',
    instructions: 'Pédalez à votre rythme',
    muscleGroups: [MuscleGroup.CARDIO, MuscleGroup.LEGS],
    primaryMuscle: MuscleGroup.CARDIO,
    equipment: Equipment.MACHINE,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Rameur',
    description: 'Rameur',
    instructions: 'Tirez la poignée en poussant sur les jambes',
    muscleGroups: [MuscleGroup.CARDIO, MuscleGroup.BACK, MuscleGroup.LEGS],
    primaryMuscle: MuscleGroup.CARDIO,
    equipment: Equipment.MACHINE,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Corde à sauter',
    description: 'Corde à sauter',
    instructions: 'Sautez à la corde à votre rythme',
    muscleGroups: [MuscleGroup.CARDIO, MuscleGroup.CALVES],
    primaryMuscle: MuscleGroup.CARDIO,
    equipment: Equipment.OTHER,
    difficulty: Difficulty.BEGINNER
  }
]

// Map old English names to new French names for migration
const NAME_MIGRATION: Record<string, string> = {
  'Bench Press': 'Développé couché',
  'Incline Dumbbell Press': 'Développé incliné haltères',
  'Push-ups': 'Pompes',
  'Cable Flyes': 'Écarté poulie',
  'Deadlift': 'Soulevé de terre',
  'Pull-ups': 'Tractions',
  'Bent Over Row': 'Rowing barre',
  'Lat Pulldown': 'Tirage vertical',
  'Seated Cable Row': 'Rowing poulie basse',
  'Overhead Press': 'Développé militaire',
  'Lateral Raises': 'Élévations latérales',
  'Front Raises': 'Élévations frontales',
  'Face Pulls': 'Tirage visage',
  'Leg Press': 'Presse à cuisses',
  'Romanian Deadlift': 'Soulevé de terre roumain',
  'Leg Curl': 'Curl ischio-jambiers',
  'Leg Extension': 'Extension de jambes',
  'Calf Raises': 'Mollets debout',
  'Lunges': 'Fentes',
  'Barbell Curl': 'Curl barre',
  'Hammer Curl': 'Curl marteau',
  'Concentration Curl': 'Curl concentration',
  'Tricep Pushdown': 'Extension triceps poulie',
  'Overhead Tricep Extension': 'Extension triceps overhead',
  'Close Grip Bench Press': 'Développé couché prise serrée',
  'Plank': 'Gainage',
  'Crunches': 'Crunchs',
  'Hanging Leg Raises': 'Relevé de jambes suspendu',
  'Russian Twists': 'Rotations russes',
  'Running': 'Course à pied',
  'Cycling': 'Vélo',
  'Rowing Machine': 'Rameur',
  'Jump Rope': 'Corde à sauter',
}

export async function seedExerciseLibrary() {
  const exerciseRepo = AppDataSource.getRepository(ExerciseLibrary)

  console.log('🌱 Seeding exercise library...')

  // First, rename any old English-named exercises to French
  for (const [oldName, newName] of Object.entries(NAME_MIGRATION)) {
    const existing = await exerciseRepo.findOne({ where: { name: oldName } })
    if (existing) {
      existing.name = newName
      await exerciseRepo.save(existing)
      console.log(`🔄 Renamed: ${oldName} → ${newName}`)
    }
  }

  // Then create any missing exercises
  for (const exerciseData of exercisesData) {
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
