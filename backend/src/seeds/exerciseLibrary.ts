import { AppDataSource } from '../config/database.js'
import { ExerciseLibrary, MuscleGroup, Equipment, Difficulty } from '../entities/ExerciseLibrary.js'

export const exercisesData = [
  // ═══════════════════════════════════════════════════
  // PECTORAUX (CHEST)
  // ═══════════════════════════════════════════════════
  {
    name: 'Développé couché',
    description: 'Exercice composé roi pour les pectoraux',
    instructions: 'Allongez-vous sur un banc plat, descendez la barre jusqu\'à la poitrine puis poussez vers le haut',
    muscleGroups: [MuscleGroup.CHEST, MuscleGroup.TRICEPS, MuscleGroup.SHOULDERS],
    primaryMuscle: MuscleGroup.CHEST,
    equipment: Equipment.BARBELL,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: 'Développé couché haltères',
    description: 'Développé couché aux haltères pour une plus grande amplitude',
    instructions: 'Allongé sur un banc plat, poussez les haltères vers le haut en les rapprochant',
    muscleGroups: [MuscleGroup.CHEST, MuscleGroup.TRICEPS, MuscleGroup.SHOULDERS],
    primaryMuscle: MuscleGroup.CHEST,
    equipment: Equipment.DUMBBELL,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: 'Développé incliné barre',
    description: 'Développé incliné à la barre pour le haut des pectoraux',
    instructions: 'Sur un banc incliné à 30-45°, descendez la barre vers le haut de la poitrine',
    muscleGroups: [MuscleGroup.CHEST, MuscleGroup.SHOULDERS, MuscleGroup.TRICEPS],
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
    name: 'Développé décliné barre',
    description: 'Développé décliné pour le bas des pectoraux',
    instructions: 'Sur un banc décliné, descendez la barre vers le bas de la poitrine puis poussez',
    muscleGroups: [MuscleGroup.CHEST, MuscleGroup.TRICEPS],
    primaryMuscle: MuscleGroup.CHEST,
    equipment: Equipment.BARBELL,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: 'Développé décliné haltères',
    description: 'Développé décliné aux haltères',
    instructions: 'Sur un banc décliné, poussez les haltères vers le haut',
    muscleGroups: [MuscleGroup.CHEST, MuscleGroup.TRICEPS],
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
    name: 'Pompes diamant',
    description: 'Pompes mains rapprochées en forme de diamant',
    instructions: 'Mains proches sous la poitrine, doigts en forme de diamant, descendez puis remontez',
    muscleGroups: [MuscleGroup.CHEST, MuscleGroup.TRICEPS],
    primaryMuscle: MuscleGroup.CHEST,
    equipment: Equipment.BODYWEIGHT,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: 'Pompes inclinées',
    description: 'Pompes avec les mains surélevées pour les débutants',
    instructions: 'Mains sur un banc ou support, effectuez des pompes',
    muscleGroups: [MuscleGroup.CHEST, MuscleGroup.TRICEPS, MuscleGroup.SHOULDERS],
    primaryMuscle: MuscleGroup.CHEST,
    equipment: Equipment.BODYWEIGHT,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Pompes déclinées',
    description: 'Pompes pieds surélevés pour cibler le haut des pectoraux',
    instructions: 'Pieds sur un banc, effectuez des pompes',
    muscleGroups: [MuscleGroup.CHEST, MuscleGroup.SHOULDERS, MuscleGroup.TRICEPS],
    primaryMuscle: MuscleGroup.CHEST,
    equipment: Equipment.BODYWEIGHT,
    difficulty: Difficulty.INTERMEDIATE
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
    name: 'Écarté couché haltères',
    description: 'Écarté aux haltères allongé sur banc plat',
    instructions: 'Allongé, bras tendus au-dessus, écartez les haltères puis ramenez-les',
    muscleGroups: [MuscleGroup.CHEST],
    primaryMuscle: MuscleGroup.CHEST,
    equipment: Equipment.DUMBBELL,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: 'Écarté incliné haltères',
    description: 'Écarté aux haltères sur banc incliné',
    instructions: 'Sur banc incliné, bras tendus, écartez les haltères puis ramenez-les',
    muscleGroups: [MuscleGroup.CHEST],
    primaryMuscle: MuscleGroup.CHEST,
    equipment: Equipment.DUMBBELL,
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
  {
    name: 'Peck-deck (butterfly)',
    description: 'Machine butterfly pour isoler les pectoraux',
    instructions: 'Assis, ramenez les bras devant vous en contractant les pectoraux',
    muscleGroups: [MuscleGroup.CHEST],
    primaryMuscle: MuscleGroup.CHEST,
    equipment: Equipment.MACHINE,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Développé couché machine',
    description: 'Développé couché à la machine convergente',
    instructions: 'Assis, poussez les poignées vers l\'avant',
    muscleGroups: [MuscleGroup.CHEST, MuscleGroup.TRICEPS, MuscleGroup.SHOULDERS],
    primaryMuscle: MuscleGroup.CHEST,
    equipment: Equipment.MACHINE,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Pullover haltère',
    description: 'Pullover à l\'haltère pour étirer les pectoraux et le dos',
    instructions: 'Allongé, haltère au-dessus de la poitrine, descendez-le derrière la tête bras tendus',
    muscleGroups: [MuscleGroup.CHEST, MuscleGroup.BACK],
    primaryMuscle: MuscleGroup.CHEST,
    equipment: Equipment.DUMBBELL,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: 'Poulie vis-à-vis haute',
    description: 'Écarté poulie haute pour le bas des pectoraux',
    instructions: 'Poulies en position haute, ramenez les mains vers le bas devant vous',
    muscleGroups: [MuscleGroup.CHEST],
    primaryMuscle: MuscleGroup.CHEST,
    equipment: Equipment.CABLE,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: 'Poulie vis-à-vis basse',
    description: 'Écarté poulie basse pour le haut des pectoraux',
    instructions: 'Poulies en position basse, ramenez les mains vers le haut devant vous',
    muscleGroups: [MuscleGroup.CHEST],
    primaryMuscle: MuscleGroup.CHEST,
    equipment: Equipment.CABLE,
    difficulty: Difficulty.INTERMEDIATE
  },

  // ═══════════════════════════════════════════════════
  // DOS (BACK)
  // ═══════════════════════════════════════════════════
  {
    name: 'Soulevé de terre',
    description: 'Soulevé de terre conventionnel, exercice composé complet',
    instructions: 'Soulevez la barre du sol en gardant le dos droit et les hanches basses',
    muscleGroups: [MuscleGroup.BACK, MuscleGroup.LEGS, MuscleGroup.GLUTES, MuscleGroup.HAMSTRINGS],
    primaryMuscle: MuscleGroup.BACK,
    equipment: Equipment.BARBELL,
    difficulty: Difficulty.ADVANCED
  },
  {
    name: 'Soulevé de terre sumo',
    description: 'Soulevé de terre en position sumo, pieds écartés',
    instructions: 'Pieds très écartés, mains entre les jambes, soulevez la barre',
    muscleGroups: [MuscleGroup.BACK, MuscleGroup.LEGS, MuscleGroup.GLUTES],
    primaryMuscle: MuscleGroup.BACK,
    equipment: Equipment.BARBELL,
    difficulty: Difficulty.ADVANCED
  },
  {
    name: 'Tractions',
    description: 'Tractions à la barre fixe en pronation',
    instructions: 'Suspendez-vous à une barre et tirez-vous vers le haut jusqu\'à ce que le menton dépasse',
    muscleGroups: [MuscleGroup.BACK, MuscleGroup.BICEPS],
    primaryMuscle: MuscleGroup.BACK,
    equipment: Equipment.BODYWEIGHT,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: 'Tractions supination',
    description: 'Tractions en prise supination (chin-ups)',
    instructions: 'Paumes vers vous, tirez-vous vers le haut',
    muscleGroups: [MuscleGroup.BACK, MuscleGroup.BICEPS],
    primaryMuscle: MuscleGroup.BACK,
    equipment: Equipment.BODYWEIGHT,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: 'Tractions prise neutre',
    description: 'Tractions en prise neutre (paumes face à face)',
    instructions: 'Paumes face à face sur une barre parallèle, tirez-vous vers le haut',
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
    name: 'Rowing haltère',
    description: 'Rowing un bras avec haltère',
    instructions: 'Un genou et une main sur le banc, tirez l\'haltère vers la hanche',
    muscleGroups: [MuscleGroup.BACK, MuscleGroup.BICEPS],
    primaryMuscle: MuscleGroup.BACK,
    equipment: Equipment.DUMBBELL,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Rowing T-bar',
    description: 'Rowing T-bar pour l\'épaisseur du dos',
    instructions: 'Penché, tirez la barre T vers le torse',
    muscleGroups: [MuscleGroup.BACK, MuscleGroup.BICEPS],
    primaryMuscle: MuscleGroup.BACK,
    equipment: Equipment.BARBELL,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: 'Tirage vertical',
    description: 'Tirage vertical à la poulie haute (lat pulldown)',
    instructions: 'Tirez la barre vers la poitrine en gardant le dos droit',
    muscleGroups: [MuscleGroup.BACK, MuscleGroup.BICEPS],
    primaryMuscle: MuscleGroup.BACK,
    equipment: Equipment.CABLE,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Tirage vertical prise serrée',
    description: 'Tirage vertical en prise serrée pour le milieu du dos',
    instructions: 'Avec une poignée en V, tirez vers la poitrine',
    muscleGroups: [MuscleGroup.BACK, MuscleGroup.BICEPS],
    primaryMuscle: MuscleGroup.BACK,
    equipment: Equipment.CABLE,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Tirage vertical supination',
    description: 'Tirage vertical prise supination',
    instructions: 'Paumes vers vous, tirez la barre vers la poitrine',
    muscleGroups: [MuscleGroup.BACK, MuscleGroup.BICEPS],
    primaryMuscle: MuscleGroup.BACK,
    equipment: Equipment.CABLE,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Rowing poulie basse',
    description: 'Rowing assis à la poulie basse',
    instructions: 'Assis, tirez la poignée vers le bas du ventre en gardant le dos droit',
    muscleGroups: [MuscleGroup.BACK, MuscleGroup.BICEPS],
    primaryMuscle: MuscleGroup.BACK,
    equipment: Equipment.CABLE,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Rowing machine',
    description: 'Rowing à la machine convergente',
    instructions: 'Assis, tirez les poignées vers vous en serrant les omoplates',
    muscleGroups: [MuscleGroup.BACK, MuscleGroup.BICEPS],
    primaryMuscle: MuscleGroup.BACK,
    equipment: Equipment.MACHINE,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Rowing inversé',
    description: 'Rowing inversé au poids du corps (Australian pull-up)',
    instructions: 'Sous une barre basse, tirez votre poitrine vers la barre',
    muscleGroups: [MuscleGroup.BACK, MuscleGroup.BICEPS],
    primaryMuscle: MuscleGroup.BACK,
    equipment: Equipment.BODYWEIGHT,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Pullover poulie',
    description: 'Pullover à la poulie haute pour le grand dorsal',
    instructions: 'Debout face à la poulie, tirez la barre vers les cuisses bras tendus',
    muscleGroups: [MuscleGroup.BACK],
    primaryMuscle: MuscleGroup.BACK,
    equipment: Equipment.CABLE,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: 'Hyperextension',
    description: 'Extension lombaire sur banc à lombaires',
    instructions: 'Sur le banc, descendez le buste puis remontez en contractant les lombaires',
    muscleGroups: [MuscleGroup.BACK, MuscleGroup.GLUTES, MuscleGroup.HAMSTRINGS],
    primaryMuscle: MuscleGroup.BACK,
    equipment: Equipment.BODYWEIGHT,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Good morning',
    description: 'Good morning à la barre pour les lombaires',
    instructions: 'Barre sur les épaules, penchez-vous en avant en gardant le dos droit puis remontez',
    muscleGroups: [MuscleGroup.BACK, MuscleGroup.HAMSTRINGS, MuscleGroup.GLUTES],
    primaryMuscle: MuscleGroup.BACK,
    equipment: Equipment.BARBELL,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: 'Shrug barre',
    description: 'Haussement d\'épaules à la barre pour les trapèzes',
    instructions: 'Debout, barre en main, haussez les épaules le plus haut possible',
    muscleGroups: [MuscleGroup.BACK, MuscleGroup.SHOULDERS],
    primaryMuscle: MuscleGroup.BACK,
    equipment: Equipment.BARBELL,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Shrug haltères',
    description: 'Haussement d\'épaules aux haltères pour les trapèzes',
    instructions: 'Debout, haltères en main, haussez les épaules le plus haut possible',
    muscleGroups: [MuscleGroup.BACK, MuscleGroup.SHOULDERS],
    primaryMuscle: MuscleGroup.BACK,
    equipment: Equipment.DUMBBELL,
    difficulty: Difficulty.BEGINNER
  },

  // ═══════════════════════════════════════════════════
  // ÉPAULES (SHOULDERS)
  // ═══════════════════════════════════════════════════
  {
    name: 'Développé militaire',
    description: 'Développé militaire à la barre debout',
    instructions: 'Debout, poussez la barre au-dessus de la tête',
    muscleGroups: [MuscleGroup.SHOULDERS, MuscleGroup.TRICEPS],
    primaryMuscle: MuscleGroup.SHOULDERS,
    equipment: Equipment.BARBELL,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: 'Développé épaules haltères',
    description: 'Développé épaules assis aux haltères',
    instructions: 'Assis, poussez les haltères au-dessus de la tête',
    muscleGroups: [MuscleGroup.SHOULDERS, MuscleGroup.TRICEPS],
    primaryMuscle: MuscleGroup.SHOULDERS,
    equipment: Equipment.DUMBBELL,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: 'Développé Arnold',
    description: 'Développé Arnold aux haltères avec rotation',
    instructions: 'Partez paumes vers vous, poussez en tournant les paumes vers l\'avant',
    muscleGroups: [MuscleGroup.SHOULDERS, MuscleGroup.TRICEPS],
    primaryMuscle: MuscleGroup.SHOULDERS,
    equipment: Equipment.DUMBBELL,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: 'Développé épaules machine',
    description: 'Développé épaules à la machine',
    instructions: 'Assis, poussez les poignées vers le haut',
    muscleGroups: [MuscleGroup.SHOULDERS, MuscleGroup.TRICEPS],
    primaryMuscle: MuscleGroup.SHOULDERS,
    equipment: Equipment.MACHINE,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Élévations latérales',
    description: 'Élévations latérales aux haltères pour les deltoïdes moyens',
    instructions: 'Levez les haltères sur les côtés jusqu\'à hauteur des épaules',
    muscleGroups: [MuscleGroup.SHOULDERS],
    primaryMuscle: MuscleGroup.SHOULDERS,
    equipment: Equipment.DUMBBELL,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Élévations latérales poulie',
    description: 'Élévations latérales à la poulie basse',
    instructions: 'Debout de côté, levez le bras à la poulie jusqu\'à hauteur de l\'épaule',
    muscleGroups: [MuscleGroup.SHOULDERS],
    primaryMuscle: MuscleGroup.SHOULDERS,
    equipment: Equipment.CABLE,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Élévations latérales machine',
    description: 'Élévations latérales à la machine',
    instructions: 'Assis, levez les bras sur les côtés contre la résistance',
    muscleGroups: [MuscleGroup.SHOULDERS],
    primaryMuscle: MuscleGroup.SHOULDERS,
    equipment: Equipment.MACHINE,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Élévations frontales',
    description: 'Élévations frontales pour le deltoïde antérieur',
    instructions: 'Levez les haltères devant vous jusqu\'à hauteur des épaules',
    muscleGroups: [MuscleGroup.SHOULDERS],
    primaryMuscle: MuscleGroup.SHOULDERS,
    equipment: Equipment.DUMBBELL,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Élévations frontales barre',
    description: 'Élévations frontales à la barre',
    instructions: 'Levez la barre devant vous jusqu\'à hauteur des épaules',
    muscleGroups: [MuscleGroup.SHOULDERS],
    primaryMuscle: MuscleGroup.SHOULDERS,
    equipment: Equipment.BARBELL,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Élévations frontales poulie',
    description: 'Élévations frontales à la poulie basse',
    instructions: 'Dos à la poulie, levez la poignée devant vous',
    muscleGroups: [MuscleGroup.SHOULDERS],
    primaryMuscle: MuscleGroup.SHOULDERS,
    equipment: Equipment.CABLE,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Oiseau haltères',
    description: 'Élévations arrière (oiseau) pour le deltoïde postérieur',
    instructions: 'Penché en avant, écartez les haltères sur les côtés',
    muscleGroups: [MuscleGroup.SHOULDERS, MuscleGroup.BACK],
    primaryMuscle: MuscleGroup.SHOULDERS,
    equipment: Equipment.DUMBBELL,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Oiseau poulie',
    description: 'Oiseau aux câbles croisés pour l\'arrière d\'épaule',
    instructions: 'Câbles croisés, écartez les bras vers l\'arrière',
    muscleGroups: [MuscleGroup.SHOULDERS, MuscleGroup.BACK],
    primaryMuscle: MuscleGroup.SHOULDERS,
    equipment: Equipment.CABLE,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Oiseau machine',
    description: 'Oiseau à la machine (reverse peck-deck)',
    instructions: 'Assis face à la machine, écartez les bras vers l\'arrière',
    muscleGroups: [MuscleGroup.SHOULDERS, MuscleGroup.BACK],
    primaryMuscle: MuscleGroup.SHOULDERS,
    equipment: Equipment.MACHINE,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Tirage visage',
    description: 'Tirage visage à la corde pour l\'arrière d\'épaule',
    instructions: 'Tirez la corde vers le visage en écartant les mains',
    muscleGroups: [MuscleGroup.SHOULDERS, MuscleGroup.BACK],
    primaryMuscle: MuscleGroup.SHOULDERS,
    equipment: Equipment.CABLE,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: 'Rowing vertical barre',
    description: 'Tirage menton à la barre (upright row)',
    instructions: 'Debout, tirez la barre le long du corps jusqu\'au menton',
    muscleGroups: [MuscleGroup.SHOULDERS, MuscleGroup.BACK],
    primaryMuscle: MuscleGroup.SHOULDERS,
    equipment: Equipment.BARBELL,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: 'Rowing vertical haltères',
    description: 'Tirage menton aux haltères',
    instructions: 'Debout, tirez les haltères le long du corps jusqu\'au menton',
    muscleGroups: [MuscleGroup.SHOULDERS, MuscleGroup.BACK],
    primaryMuscle: MuscleGroup.SHOULDERS,
    equipment: Equipment.DUMBBELL,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: 'Handstand push-ups',
    description: 'Pompes en équilibre sur les mains',
    instructions: 'En appui sur les mains contre un mur, descendez puis remontez',
    muscleGroups: [MuscleGroup.SHOULDERS, MuscleGroup.TRICEPS],
    primaryMuscle: MuscleGroup.SHOULDERS,
    equipment: Equipment.BODYWEIGHT,
    difficulty: Difficulty.ADVANCED
  },
  {
    name: 'Pike push-ups',
    description: 'Pompes en pike pour les épaules',
    instructions: 'En position de V inversé, descendez la tête vers le sol puis poussez',
    muscleGroups: [MuscleGroup.SHOULDERS, MuscleGroup.TRICEPS],
    primaryMuscle: MuscleGroup.SHOULDERS,
    equipment: Equipment.BODYWEIGHT,
    difficulty: Difficulty.INTERMEDIATE
  },

  // ═══════════════════════════════════════════════════
  // BICEPS
  // ═══════════════════════════════════════════════════
  {
    name: 'Curl barre',
    description: 'Curl barre droite pour les biceps',
    instructions: 'Debout, fléchissez les coudes en remontant la barre vers les épaules',
    muscleGroups: [MuscleGroup.BICEPS],
    primaryMuscle: MuscleGroup.BICEPS,
    equipment: Equipment.BARBELL,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Curl barre EZ',
    description: 'Curl à la barre EZ pour moins de stress sur les poignets',
    instructions: 'Avec la barre EZ, fléchissez les coudes en remontant la barre',
    muscleGroups: [MuscleGroup.BICEPS],
    primaryMuscle: MuscleGroup.BICEPS,
    equipment: Equipment.BARBELL,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Curl haltères',
    description: 'Curl classique aux haltères en alternance',
    instructions: 'Debout, fléchissez un bras après l\'autre en supination',
    muscleGroups: [MuscleGroup.BICEPS],
    primaryMuscle: MuscleGroup.BICEPS,
    equipment: Equipment.DUMBBELL,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Curl marteau',
    description: 'Curl marteau pour le brachial et le long supinateur',
    instructions: 'Fléchissez les coudes avec les haltères en position neutre (pouces vers le haut)',
    muscleGroups: [MuscleGroup.BICEPS],
    primaryMuscle: MuscleGroup.BICEPS,
    equipment: Equipment.DUMBBELL,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Curl concentration',
    description: 'Curl concentration assis pour isolation maximale',
    instructions: 'Assis, coude appuyé sur l\'intérieur de la cuisse, fléchissez le bras',
    muscleGroups: [MuscleGroup.BICEPS],
    primaryMuscle: MuscleGroup.BICEPS,
    equipment: Equipment.DUMBBELL,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Curl incliné',
    description: 'Curl incliné aux haltères pour étirer les biceps',
    instructions: 'Assis sur banc incliné, bras pendants, fléchissez les coudes',
    muscleGroups: [MuscleGroup.BICEPS],
    primaryMuscle: MuscleGroup.BICEPS,
    equipment: Equipment.DUMBBELL,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: 'Curl au pupitre',
    description: 'Curl au pupitre (preacher curl) pour isolation',
    instructions: 'Bras appuyés sur le pupitre, fléchissez les coudes',
    muscleGroups: [MuscleGroup.BICEPS],
    primaryMuscle: MuscleGroup.BICEPS,
    equipment: Equipment.BARBELL,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Curl au pupitre haltère',
    description: 'Curl au pupitre un bras avec haltère',
    instructions: 'Un bras appuyé sur le pupitre, fléchissez le coude',
    muscleGroups: [MuscleGroup.BICEPS],
    primaryMuscle: MuscleGroup.BICEPS,
    equipment: Equipment.DUMBBELL,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Curl poulie basse',
    description: 'Curl à la poulie basse',
    instructions: 'Debout face à la poulie, fléchissez les coudes en ramenant la barre',
    muscleGroups: [MuscleGroup.BICEPS],
    primaryMuscle: MuscleGroup.BICEPS,
    equipment: Equipment.CABLE,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Curl poulie haute',
    description: 'Curl à la poulie haute bras écartés',
    instructions: 'Entre deux poulies hautes, fléchissez les bras en position de double biceps',
    muscleGroups: [MuscleGroup.BICEPS],
    primaryMuscle: MuscleGroup.BICEPS,
    equipment: Equipment.CABLE,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: 'Curl inversé',
    description: 'Curl inversé en pronation pour les avant-bras',
    instructions: 'Paumes vers le bas, fléchissez les coudes en remontant la barre',
    muscleGroups: [MuscleGroup.BICEPS],
    primaryMuscle: MuscleGroup.BICEPS,
    equipment: Equipment.BARBELL,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: 'Curl marteau corde poulie',
    description: 'Curl marteau à la corde sur poulie basse',
    instructions: 'Avec la corde, fléchissez les coudes en prise neutre',
    muscleGroups: [MuscleGroup.BICEPS],
    primaryMuscle: MuscleGroup.BICEPS,
    equipment: Equipment.CABLE,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Curl spider',
    description: 'Spider curl sur banc incliné face vers le bas',
    instructions: 'Allongé face contre un banc incliné, bras pendants, fléchissez les coudes',
    muscleGroups: [MuscleGroup.BICEPS],
    primaryMuscle: MuscleGroup.BICEPS,
    equipment: Equipment.DUMBBELL,
    difficulty: Difficulty.INTERMEDIATE
  },

  // ═══════════════════════════════════════════════════
  // TRICEPS
  // ═══════════════════════════════════════════════════
  {
    name: 'Extension triceps poulie',
    description: 'Extension triceps à la poulie haute avec barre',
    instructions: 'Poussez la barre vers le bas en gardant les coudes fixes',
    muscleGroups: [MuscleGroup.TRICEPS],
    primaryMuscle: MuscleGroup.TRICEPS,
    equipment: Equipment.CABLE,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Extension triceps corde',
    description: 'Extension triceps à la corde sur poulie haute',
    instructions: 'Poussez la corde vers le bas en écartant les mains en bas du mouvement',
    muscleGroups: [MuscleGroup.TRICEPS],
    primaryMuscle: MuscleGroup.TRICEPS,
    equipment: Equipment.CABLE,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Extension triceps overhead',
    description: 'Extension triceps au-dessus de la tête avec haltère',
    instructions: 'Tendez les bras au-dessus de la tête avec un haltère, fléchissez les coudes derrière la tête',
    muscleGroups: [MuscleGroup.TRICEPS],
    primaryMuscle: MuscleGroup.TRICEPS,
    equipment: Equipment.DUMBBELL,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Extension triceps overhead corde',
    description: 'Extension triceps overhead à la corde sur poulie basse',
    instructions: 'Dos à la poulie, tendez les bras au-dessus de la tête avec la corde',
    muscleGroups: [MuscleGroup.TRICEPS],
    primaryMuscle: MuscleGroup.TRICEPS,
    equipment: Equipment.CABLE,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Skull crusher',
    description: 'Barre au front pour les triceps',
    instructions: 'Allongé, descendez la barre EZ vers le front en pliant les coudes puis remontez',
    muscleGroups: [MuscleGroup.TRICEPS],
    primaryMuscle: MuscleGroup.TRICEPS,
    equipment: Equipment.BARBELL,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: 'Développé couché prise serrée',
    description: 'Développé couché prise serrée pour les triceps',
    instructions: 'Comme le développé couché mais avec les mains rapprochées',
    muscleGroups: [MuscleGroup.TRICEPS, MuscleGroup.CHEST],
    primaryMuscle: MuscleGroup.TRICEPS,
    equipment: Equipment.BARBELL,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: 'Kickback triceps',
    description: 'Kickback triceps avec haltère',
    instructions: 'Penché en avant, tendez le bras vers l\'arrière en gardant le coude fixe',
    muscleGroups: [MuscleGroup.TRICEPS],
    primaryMuscle: MuscleGroup.TRICEPS,
    equipment: Equipment.DUMBBELL,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Dips banc',
    description: 'Dips sur un banc pour les triceps',
    instructions: 'Mains sur un banc derrière vous, descendez en pliant les coudes',
    muscleGroups: [MuscleGroup.TRICEPS],
    primaryMuscle: MuscleGroup.TRICEPS,
    equipment: Equipment.BODYWEIGHT,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Dips triceps',
    description: 'Dips aux barres parallèles buste droit pour les triceps',
    instructions: 'Buste droit, descendez en pliant les coudes puis remontez',
    muscleGroups: [MuscleGroup.TRICEPS, MuscleGroup.CHEST],
    primaryMuscle: MuscleGroup.TRICEPS,
    equipment: Equipment.BODYWEIGHT,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: 'Extension triceps haltère un bras',
    description: 'Extension triceps un bras derrière la tête',
    instructions: 'Un haltère dans une main, tendez le bras au-dessus de la tête',
    muscleGroups: [MuscleGroup.TRICEPS],
    primaryMuscle: MuscleGroup.TRICEPS,
    equipment: Equipment.DUMBBELL,
    difficulty: Difficulty.BEGINNER
  },

  // ═══════════════════════════════════════════════════
  // JAMBES (LEGS / QUADS)
  // ═══════════════════════════════════════════════════
  {
    name: 'Squat',
    description: 'Squat à la barre, roi des exercices jambes',
    instructions: 'Barre sur les épaules, descendez en pliant les genoux jusqu\'à ce que les cuisses soient parallèles au sol',
    muscleGroups: [MuscleGroup.LEGS, MuscleGroup.QUADS, MuscleGroup.GLUTES],
    primaryMuscle: MuscleGroup.LEGS,
    equipment: Equipment.BARBELL,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: 'Squat avant (front squat)',
    description: 'Squat barre sur l\'avant des épaules',
    instructions: 'Barre sur l\'avant des épaules, descendez en gardant le buste droit',
    muscleGroups: [MuscleGroup.LEGS, MuscleGroup.QUADS],
    primaryMuscle: MuscleGroup.QUADS,
    equipment: Equipment.BARBELL,
    difficulty: Difficulty.ADVANCED
  },
  {
    name: 'Squat goblet',
    description: 'Squat goblet avec haltère ou kettlebell',
    instructions: 'Haltère contre la poitrine, descendez en squat profond',
    muscleGroups: [MuscleGroup.LEGS, MuscleGroup.QUADS, MuscleGroup.GLUTES],
    primaryMuscle: MuscleGroup.LEGS,
    equipment: Equipment.DUMBBELL,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Squat bulgare',
    description: 'Squat bulgare (split squat pied arrière surélevé)',
    instructions: 'Pied arrière sur un banc, descendez en pliant le genou avant',
    muscleGroups: [MuscleGroup.LEGS, MuscleGroup.QUADS, MuscleGroup.GLUTES],
    primaryMuscle: MuscleGroup.LEGS,
    equipment: Equipment.DUMBBELL,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: 'Squat sumo',
    description: 'Squat en position sumo, pieds très écartés',
    instructions: 'Pieds très écartés, pointes vers l\'extérieur, descendez en squat',
    muscleGroups: [MuscleGroup.LEGS, MuscleGroup.GLUTES, MuscleGroup.QUADS],
    primaryMuscle: MuscleGroup.LEGS,
    equipment: Equipment.BARBELL,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: 'Squat au poids du corps',
    description: 'Squat sans charge, idéal pour les débutants',
    instructions: 'Debout, descendez en squat en gardant le dos droit',
    muscleGroups: [MuscleGroup.LEGS, MuscleGroup.QUADS, MuscleGroup.GLUTES],
    primaryMuscle: MuscleGroup.LEGS,
    equipment: Equipment.BODYWEIGHT,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Hack squat',
    description: 'Hack squat à la machine',
    instructions: 'Dos contre le dossier, pieds sur la plateforme, descendez et remontez',
    muscleGroups: [MuscleGroup.LEGS, MuscleGroup.QUADS],
    primaryMuscle: MuscleGroup.QUADS,
    equipment: Equipment.MACHINE,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: 'Presse à cuisses',
    description: 'Presse à cuisses (leg press)',
    instructions: 'Poussez la plateforme avec les pieds en gardant le dos plaqué',
    muscleGroups: [MuscleGroup.LEGS, MuscleGroup.QUADS, MuscleGroup.GLUTES],
    primaryMuscle: MuscleGroup.LEGS,
    equipment: Equipment.MACHINE,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Extension de jambes',
    description: 'Extension de jambes à la machine (leg extension)',
    instructions: 'Assis, étendez les jambes en contractant les quadriceps',
    muscleGroups: [MuscleGroup.QUADS],
    primaryMuscle: MuscleGroup.QUADS,
    equipment: Equipment.MACHINE,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Fentes',
    description: 'Fentes avant au poids du corps ou avec haltères',
    instructions: 'Faites un grand pas en avant et descendez jusqu\'à ce que le genou arrière touche presque le sol',
    muscleGroups: [MuscleGroup.LEGS, MuscleGroup.QUADS, MuscleGroup.GLUTES],
    primaryMuscle: MuscleGroup.LEGS,
    equipment: Equipment.BODYWEIGHT,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Fentes marchées',
    description: 'Fentes en marchant avec haltères',
    instructions: 'Avancez en faisant des fentes alternées',
    muscleGroups: [MuscleGroup.LEGS, MuscleGroup.QUADS, MuscleGroup.GLUTES],
    primaryMuscle: MuscleGroup.LEGS,
    equipment: Equipment.DUMBBELL,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: 'Fentes latérales',
    description: 'Fentes de côté pour les adducteurs',
    instructions: 'Faites un grand pas sur le côté et descendez en pliant un genou',
    muscleGroups: [MuscleGroup.LEGS, MuscleGroup.QUADS, MuscleGroup.GLUTES],
    primaryMuscle: MuscleGroup.LEGS,
    equipment: Equipment.BODYWEIGHT,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Fentes arrière',
    description: 'Fentes en reculant',
    instructions: 'Faites un grand pas en arrière et descendez',
    muscleGroups: [MuscleGroup.LEGS, MuscleGroup.QUADS, MuscleGroup.GLUTES],
    primaryMuscle: MuscleGroup.LEGS,
    equipment: Equipment.BODYWEIGHT,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Step-up',
    description: 'Montée sur banc avec haltères',
    instructions: 'Montez sur un banc un pied après l\'autre en poussant',
    muscleGroups: [MuscleGroup.LEGS, MuscleGroup.QUADS, MuscleGroup.GLUTES],
    primaryMuscle: MuscleGroup.LEGS,
    equipment: Equipment.DUMBBELL,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Sissy squat',
    description: 'Sissy squat pour l\'isolation des quadriceps',
    instructions: 'Inclinez-vous en arrière en pliant les genoux, talons décollés',
    muscleGroups: [MuscleGroup.QUADS],
    primaryMuscle: MuscleGroup.QUADS,
    equipment: Equipment.BODYWEIGHT,
    difficulty: Difficulty.ADVANCED
  },
  {
    name: 'Squat Smith machine',
    description: 'Squat à la Smith machine guidée',
    instructions: 'Pieds légèrement avancés, descendez en squat guidé par la barre',
    muscleGroups: [MuscleGroup.LEGS, MuscleGroup.QUADS, MuscleGroup.GLUTES],
    primaryMuscle: MuscleGroup.LEGS,
    equipment: Equipment.MACHINE,
    difficulty: Difficulty.BEGINNER
  },

  // ═══════════════════════════════════════════════════
  // ISCHIO-JAMBIERS (HAMSTRINGS)
  // ═══════════════════════════════════════════════════
  {
    name: 'Soulevé de terre roumain',
    description: 'Soulevé de terre roumain pour les ischio-jambiers',
    instructions: 'Descendez la barre le long des jambes en gardant les genoux légèrement fléchis',
    muscleGroups: [MuscleGroup.HAMSTRINGS, MuscleGroup.GLUTES, MuscleGroup.BACK],
    primaryMuscle: MuscleGroup.HAMSTRINGS,
    equipment: Equipment.BARBELL,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: 'Soulevé de terre roumain haltères',
    description: 'Soulevé de terre roumain aux haltères',
    instructions: 'Haltères en main, descendez en gardant les genoux légèrement fléchis',
    muscleGroups: [MuscleGroup.HAMSTRINGS, MuscleGroup.GLUTES, MuscleGroup.BACK],
    primaryMuscle: MuscleGroup.HAMSTRINGS,
    equipment: Equipment.DUMBBELL,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: 'Soulevé de terre jambes tendues',
    description: 'Soulevé de terre jambes tendues (stiff leg)',
    instructions: 'Jambes quasi-tendues, descendez la barre en pivotant aux hanches',
    muscleGroups: [MuscleGroup.HAMSTRINGS, MuscleGroup.GLUTES, MuscleGroup.BACK],
    primaryMuscle: MuscleGroup.HAMSTRINGS,
    equipment: Equipment.BARBELL,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: 'Soulevé de terre un bras haltère',
    description: 'Soulevé de terre un bras sur une jambe',
    instructions: 'Sur une jambe, penchez-vous en avant avec un haltère',
    muscleGroups: [MuscleGroup.HAMSTRINGS, MuscleGroup.GLUTES],
    primaryMuscle: MuscleGroup.HAMSTRINGS,
    equipment: Equipment.DUMBBELL,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: 'Curl ischio-jambiers',
    description: 'Curl ischio-jambiers allongé à la machine',
    instructions: 'Allongé, fléchissez les jambes en ramenant les talons vers les fesses',
    muscleGroups: [MuscleGroup.HAMSTRINGS],
    primaryMuscle: MuscleGroup.HAMSTRINGS,
    equipment: Equipment.MACHINE,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Curl ischio-jambiers assis',
    description: 'Curl ischio-jambiers assis à la machine',
    instructions: 'Assis, fléchissez les jambes sous le coussin',
    muscleGroups: [MuscleGroup.HAMSTRINGS],
    primaryMuscle: MuscleGroup.HAMSTRINGS,
    equipment: Equipment.MACHINE,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Curl nordique',
    description: 'Nordic hamstring curl au poids du corps',
    instructions: 'À genoux, pieds bloqués, descendez lentement vers le sol en contrôlant',
    muscleGroups: [MuscleGroup.HAMSTRINGS],
    primaryMuscle: MuscleGroup.HAMSTRINGS,
    equipment: Equipment.BODYWEIGHT,
    difficulty: Difficulty.ADVANCED
  },
  {
    name: 'Glute-ham raise',
    description: 'GHR sur banc glute-ham raise',
    instructions: 'Sur le banc GHD, fléchissez les genoux et relevez le buste',
    muscleGroups: [MuscleGroup.HAMSTRINGS, MuscleGroup.GLUTES],
    primaryMuscle: MuscleGroup.HAMSTRINGS,
    equipment: Equipment.MACHINE,
    difficulty: Difficulty.ADVANCED
  },

  // ═══════════════════════════════════════════════════
  // FESSIERS (GLUTES)
  // ═══════════════════════════════════════════════════
  {
    name: 'Hip thrust',
    description: 'Hip thrust à la barre pour les fessiers',
    instructions: 'Dos contre un banc, barre sur les hanches, poussez les hanches vers le haut',
    muscleGroups: [MuscleGroup.GLUTES, MuscleGroup.HAMSTRINGS],
    primaryMuscle: MuscleGroup.GLUTES,
    equipment: Equipment.BARBELL,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: 'Hip thrust machine',
    description: 'Hip thrust à la machine',
    instructions: 'Installez-vous dans la machine et poussez les hanches vers le haut',
    muscleGroups: [MuscleGroup.GLUTES, MuscleGroup.HAMSTRINGS],
    primaryMuscle: MuscleGroup.GLUTES,
    equipment: Equipment.MACHINE,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Pont fessier',
    description: 'Pont fessier (glute bridge) au sol',
    instructions: 'Allongé sur le dos, pieds au sol, soulevez les hanches',
    muscleGroups: [MuscleGroup.GLUTES, MuscleGroup.HAMSTRINGS],
    primaryMuscle: MuscleGroup.GLUTES,
    equipment: Equipment.BODYWEIGHT,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Donkey kick',
    description: 'Donkey kick au sol pour les fessiers',
    instructions: 'À quatre pattes, poussez un pied vers le plafond genou fléchi',
    muscleGroups: [MuscleGroup.GLUTES],
    primaryMuscle: MuscleGroup.GLUTES,
    equipment: Equipment.BODYWEIGHT,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Fire hydrant',
    description: 'Fire hydrant pour le moyen fessier',
    instructions: 'À quatre pattes, écartez le genou sur le côté',
    muscleGroups: [MuscleGroup.GLUTES],
    primaryMuscle: MuscleGroup.GLUTES,
    equipment: Equipment.BODYWEIGHT,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Kickback fessier poulie',
    description: 'Extension de hanche à la poulie basse',
    instructions: 'Sangle à la cheville, poussez la jambe vers l\'arrière',
    muscleGroups: [MuscleGroup.GLUTES, MuscleGroup.HAMSTRINGS],
    primaryMuscle: MuscleGroup.GLUTES,
    equipment: Equipment.CABLE,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Abduction hanche poulie',
    description: 'Abduction de hanche à la poulie basse',
    instructions: 'Sangle à la cheville, écartez la jambe sur le côté',
    muscleGroups: [MuscleGroup.GLUTES],
    primaryMuscle: MuscleGroup.GLUTES,
    equipment: Equipment.CABLE,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Abducteur machine',
    description: 'Machine d\'abduction des cuisses (abducteur)',
    instructions: 'Assise, écartez les cuisses contre la résistance',
    muscleGroups: [MuscleGroup.GLUTES],
    primaryMuscle: MuscleGroup.GLUTES,
    equipment: Equipment.MACHINE,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Adducteur machine',
    description: 'Machine d\'adduction des cuisses (adducteur)',
    instructions: 'Assise, serrez les cuisses l\'une vers l\'autre contre la résistance',
    muscleGroups: [MuscleGroup.LEGS],
    primaryMuscle: MuscleGroup.LEGS,
    equipment: Equipment.MACHINE,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Fente croisée',
    description: 'Fente croisée (curtsy lunge) pour le moyen fessier',
    instructions: 'Croisez une jambe derrière l\'autre en descendant en fente',
    muscleGroups: [MuscleGroup.GLUTES, MuscleGroup.QUADS],
    primaryMuscle: MuscleGroup.GLUTES,
    equipment: Equipment.BODYWEIGHT,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: 'Clamshell',
    description: 'Clamshell avec bande élastique',
    instructions: 'Allongé sur le côté, genoux pliés, écartez le genou supérieur',
    muscleGroups: [MuscleGroup.GLUTES],
    primaryMuscle: MuscleGroup.GLUTES,
    equipment: Equipment.RESISTANCE_BAND,
    difficulty: Difficulty.BEGINNER
  },

  // ═══════════════════════════════════════════════════
  // MOLLETS (CALVES)
  // ═══════════════════════════════════════════════════
  {
    name: 'Mollets debout',
    description: 'Élévation des mollets debout à la machine',
    instructions: 'Debout, montez sur la pointe des pieds puis redescendez',
    muscleGroups: [MuscleGroup.CALVES],
    primaryMuscle: MuscleGroup.CALVES,
    equipment: Equipment.MACHINE,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Mollets assis',
    description: 'Élévation des mollets assis à la machine',
    instructions: 'Assis, genoux sous le coussin, montez sur la pointe des pieds',
    muscleGroups: [MuscleGroup.CALVES],
    primaryMuscle: MuscleGroup.CALVES,
    equipment: Equipment.MACHINE,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Mollets debout haltères',
    description: 'Élévation des mollets debout avec haltères',
    instructions: 'Haltères en main, montez sur la pointe des pieds',
    muscleGroups: [MuscleGroup.CALVES],
    primaryMuscle: MuscleGroup.CALVES,
    equipment: Equipment.DUMBBELL,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Mollets presse à cuisses',
    description: 'Élévation des mollets sur la presse à cuisses',
    instructions: 'Pieds en bas de la plateforme, poussez avec la pointe des pieds',
    muscleGroups: [MuscleGroup.CALVES],
    primaryMuscle: MuscleGroup.CALVES,
    equipment: Equipment.MACHINE,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Mollets un pied',
    description: 'Élévation des mollets sur un pied',
    instructions: 'Sur un pied, montez sur la pointe puis redescendez lentement',
    muscleGroups: [MuscleGroup.CALVES],
    primaryMuscle: MuscleGroup.CALVES,
    equipment: Equipment.BODYWEIGHT,
    difficulty: Difficulty.BEGINNER
  },

  // ═══════════════════════════════════════════════════
  // ABDOMINAUX (ABS)
  // ═══════════════════════════════════════════════════
  {
    name: 'Gainage',
    description: 'Gainage statique (planche)',
    instructions: 'Maintenez la position planche en contractant les abdos',
    muscleGroups: [MuscleGroup.ABS],
    primaryMuscle: MuscleGroup.ABS,
    equipment: Equipment.BODYWEIGHT,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Gainage latéral',
    description: 'Gainage latéral pour les obliques',
    instructions: 'En appui sur un avant-bras, maintenez le corps droit sur le côté',
    muscleGroups: [MuscleGroup.ABS],
    primaryMuscle: MuscleGroup.ABS,
    equipment: Equipment.BODYWEIGHT,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Crunchs',
    description: 'Crunchs abdominaux classiques',
    instructions: 'Allongé sur le dos, relevez le buste en contractant les abdos',
    muscleGroups: [MuscleGroup.ABS],
    primaryMuscle: MuscleGroup.ABS,
    equipment: Equipment.BODYWEIGHT,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Crunchs obliques',
    description: 'Crunchs avec rotation pour les obliques',
    instructions: 'Allongé, relevez le buste en tournant un coude vers le genou opposé',
    muscleGroups: [MuscleGroup.ABS],
    primaryMuscle: MuscleGroup.ABS,
    equipment: Equipment.BODYWEIGHT,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Crunchs poulie haute',
    description: 'Crunchs à genoux à la poulie haute',
    instructions: 'À genoux, corde derrière la tête, enroulez le buste vers le sol',
    muscleGroups: [MuscleGroup.ABS],
    primaryMuscle: MuscleGroup.ABS,
    equipment: Equipment.CABLE,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: 'Crunchs inversés',
    description: 'Crunchs inversés (relevé de bassin)',
    instructions: 'Allongé, ramenez les genoux vers la poitrine en soulevant le bassin',
    muscleGroups: [MuscleGroup.ABS],
    primaryMuscle: MuscleGroup.ABS,
    equipment: Equipment.BODYWEIGHT,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Relevé de jambes suspendu',
    description: 'Relevé de jambes suspendu à la barre',
    instructions: 'Suspendu à une barre, relevez les jambes vers le haut',
    muscleGroups: [MuscleGroup.ABS],
    primaryMuscle: MuscleGroup.ABS,
    equipment: Equipment.BODYWEIGHT,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: 'Relevé de jambes allongé',
    description: 'Relevé de jambes allongé au sol',
    instructions: 'Allongé, jambes tendues, relevez-les à 90° puis redescendez sans toucher le sol',
    muscleGroups: [MuscleGroup.ABS],
    primaryMuscle: MuscleGroup.ABS,
    equipment: Equipment.BODYWEIGHT,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Relevé de genoux suspendu',
    description: 'Relevé de genoux suspendu à la barre',
    instructions: 'Suspendu, ramenez les genoux vers la poitrine',
    muscleGroups: [MuscleGroup.ABS],
    primaryMuscle: MuscleGroup.ABS,
    equipment: Equipment.BODYWEIGHT,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Rotations russes',
    description: 'Rotations russes (Russian twists)',
    instructions: 'Assis, pieds levés, tournez le buste de gauche à droite avec ou sans poids',
    muscleGroups: [MuscleGroup.ABS],
    primaryMuscle: MuscleGroup.ABS,
    equipment: Equipment.BODYWEIGHT,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: 'Mountain climbers',
    description: 'Mountain climbers (escalade au sol)',
    instructions: 'En position planche, alternez les genoux vers la poitrine rapidement',
    muscleGroups: [MuscleGroup.ABS, MuscleGroup.CARDIO],
    primaryMuscle: MuscleGroup.ABS,
    equipment: Equipment.BODYWEIGHT,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Ab wheel (rollout)',
    description: 'Roulette abdominale',
    instructions: 'À genoux, roulez la roue devant vous puis ramenez-la',
    muscleGroups: [MuscleGroup.ABS],
    primaryMuscle: MuscleGroup.ABS,
    equipment: Equipment.OTHER,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: 'Bicycle crunch',
    description: 'Crunchs en pédalant',
    instructions: 'Allongé, pédalez avec les jambes en touchant le coude au genou opposé',
    muscleGroups: [MuscleGroup.ABS],
    primaryMuscle: MuscleGroup.ABS,
    equipment: Equipment.BODYWEIGHT,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Dead bug',
    description: 'Dead bug pour le gainage profond',
    instructions: 'Allongé, bras et jambes levés, étendez alternativement un bras et la jambe opposée',
    muscleGroups: [MuscleGroup.ABS],
    primaryMuscle: MuscleGroup.ABS,
    equipment: Equipment.BODYWEIGHT,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Hollow hold',
    description: 'Hollow hold (position creuse)',
    instructions: 'Allongé, bras et jambes tendus légèrement levés, maintenez la position',
    muscleGroups: [MuscleGroup.ABS],
    primaryMuscle: MuscleGroup.ABS,
    equipment: Equipment.BODYWEIGHT,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: 'V-up',
    description: 'V-up (toucher les pieds)',
    instructions: 'Allongé, levez simultanément le buste et les jambes pour toucher les pieds',
    muscleGroups: [MuscleGroup.ABS],
    primaryMuscle: MuscleGroup.ABS,
    equipment: Equipment.BODYWEIGHT,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: 'Dragon flag',
    description: 'Dragon flag pour les abdos avancés',
    instructions: 'Allongé sur un banc, levez tout le corps à la verticale puis redescendez lentement',
    muscleGroups: [MuscleGroup.ABS],
    primaryMuscle: MuscleGroup.ABS,
    equipment: Equipment.BODYWEIGHT,
    difficulty: Difficulty.ADVANCED
  },
  {
    name: 'Essuie-glaces',
    description: 'Essuie-glaces (windshield wipers) pour les obliques',
    instructions: 'Allongé, jambes levées, tournez-les d\'un côté puis de l\'autre',
    muscleGroups: [MuscleGroup.ABS],
    primaryMuscle: MuscleGroup.ABS,
    equipment: Equipment.BODYWEIGHT,
    difficulty: Difficulty.ADVANCED
  },
  {
    name: 'Crunchs machine',
    description: 'Crunchs à la machine abdominale',
    instructions: 'Assis, enroulez le buste vers l\'avant contre la résistance',
    muscleGroups: [MuscleGroup.ABS],
    primaryMuscle: MuscleGroup.ABS,
    equipment: Equipment.MACHINE,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Pallof press',
    description: 'Pallof press à la poulie pour l\'anti-rotation',
    instructions: 'De côté à la poulie, poussez la poignée devant vous en résistant à la rotation',
    muscleGroups: [MuscleGroup.ABS],
    primaryMuscle: MuscleGroup.ABS,
    equipment: Equipment.CABLE,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: 'Sit-ups',
    description: 'Sit-ups classiques',
    instructions: 'Allongé, pieds au sol, relevez tout le buste jusqu\'en position assise',
    muscleGroups: [MuscleGroup.ABS],
    primaryMuscle: MuscleGroup.ABS,
    equipment: Equipment.BODYWEIGHT,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Toes to bar',
    description: 'Toes to bar suspendu à la barre',
    instructions: 'Suspendu, levez les pieds jusqu\'à toucher la barre',
    muscleGroups: [MuscleGroup.ABS],
    primaryMuscle: MuscleGroup.ABS,
    equipment: Equipment.BODYWEIGHT,
    difficulty: Difficulty.ADVANCED
  },

  // ═══════════════════════════════════════════════════
  // AVANT-BRAS (FOREARMS)
  // ═══════════════════════════════════════════════════
  {
    name: 'Curl poignets barre',
    description: 'Curl des poignets (wrist curl) à la barre',
    instructions: 'Avant-bras sur les genoux, fléchissez les poignets vers le haut',
    muscleGroups: [MuscleGroup.BICEPS],
    primaryMuscle: MuscleGroup.BICEPS,
    equipment: Equipment.BARBELL,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Curl poignets inversé',
    description: 'Curl inversé des poignets pour l\'extenseur',
    instructions: 'Avant-bras sur les genoux, paumes vers le bas, fléchissez les poignets vers le haut',
    muscleGroups: [MuscleGroup.BICEPS],
    primaryMuscle: MuscleGroup.BICEPS,
    equipment: Equipment.BARBELL,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Farmer walk',
    description: 'Marche du fermier avec haltères lourds',
    instructions: 'Haltères lourds en main, marchez en gardant les épaules hautes',
    muscleGroups: [MuscleGroup.FULL_BODY],
    primaryMuscle: MuscleGroup.FULL_BODY,
    equipment: Equipment.DUMBBELL,
    difficulty: Difficulty.INTERMEDIATE
  },

  // ═══════════════════════════════════════════════════
  // FULL BODY / FONCTIONNEL
  // ═══════════════════════════════════════════════════
  {
    name: 'Clean and press',
    description: 'Épaulé-jeté complet à la barre',
    instructions: 'Soulevez la barre du sol aux épaules, puis poussez au-dessus de la tête',
    muscleGroups: [MuscleGroup.FULL_BODY, MuscleGroup.SHOULDERS, MuscleGroup.LEGS],
    primaryMuscle: MuscleGroup.FULL_BODY,
    equipment: Equipment.BARBELL,
    difficulty: Difficulty.ADVANCED
  },
  {
    name: 'Thruster',
    description: 'Thruster (squat + développé) aux haltères ou à la barre',
    instructions: 'Faites un squat, puis en remontant poussez la barre au-dessus de la tête',
    muscleGroups: [MuscleGroup.FULL_BODY, MuscleGroup.LEGS, MuscleGroup.SHOULDERS],
    primaryMuscle: MuscleGroup.FULL_BODY,
    equipment: Equipment.BARBELL,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: 'Turkish get-up',
    description: 'Turkish get-up avec kettlebell',
    instructions: 'Allongé, levez-vous en gardant le kettlebell bras tendu au-dessus',
    muscleGroups: [MuscleGroup.FULL_BODY, MuscleGroup.SHOULDERS, MuscleGroup.ABS],
    primaryMuscle: MuscleGroup.FULL_BODY,
    equipment: Equipment.KETTLEBELL,
    difficulty: Difficulty.ADVANCED
  },
  {
    name: 'Kettlebell swing',
    description: 'Swing avec kettlebell',
    instructions: 'Balancez le kettlebell entre les jambes puis poussez les hanches pour le remonter',
    muscleGroups: [MuscleGroup.FULL_BODY, MuscleGroup.GLUTES, MuscleGroup.HAMSTRINGS],
    primaryMuscle: MuscleGroup.FULL_BODY,
    equipment: Equipment.KETTLEBELL,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: 'Snatch kettlebell',
    description: 'Arraché au kettlebell',
    instructions: 'D\'un mouvement explosif, amenez le kettlebell du sol au-dessus de la tête',
    muscleGroups: [MuscleGroup.FULL_BODY, MuscleGroup.SHOULDERS],
    primaryMuscle: MuscleGroup.FULL_BODY,
    equipment: Equipment.KETTLEBELL,
    difficulty: Difficulty.ADVANCED
  },
  {
    name: 'Clean kettlebell',
    description: 'Épaulé au kettlebell',
    instructions: 'Amenez le kettlebell du sol à l\'épaule en position rack',
    muscleGroups: [MuscleGroup.FULL_BODY, MuscleGroup.SHOULDERS],
    primaryMuscle: MuscleGroup.FULL_BODY,
    equipment: Equipment.KETTLEBELL,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: 'Man maker',
    description: 'Man maker (pompe + row + clean + press)',
    instructions: 'Pompe, rowing chaque bras, saut pieds vers les mains, clean and press',
    muscleGroups: [MuscleGroup.FULL_BODY],
    primaryMuscle: MuscleGroup.FULL_BODY,
    equipment: Equipment.DUMBBELL,
    difficulty: Difficulty.ADVANCED
  },
  {
    name: 'Épaulé barre',
    description: 'Épaulé (power clean) à la barre',
    instructions: 'Du sol, amenez la barre aux épaules en un mouvement explosif',
    muscleGroups: [MuscleGroup.FULL_BODY, MuscleGroup.LEGS, MuscleGroup.BACK],
    primaryMuscle: MuscleGroup.FULL_BODY,
    equipment: Equipment.BARBELL,
    difficulty: Difficulty.ADVANCED
  },
  {
    name: 'Arraché barre',
    description: 'Arraché (snatch) à la barre',
    instructions: 'Du sol, amenez la barre au-dessus de la tête en un mouvement explosif',
    muscleGroups: [MuscleGroup.FULL_BODY, MuscleGroup.LEGS, MuscleGroup.SHOULDERS],
    primaryMuscle: MuscleGroup.FULL_BODY,
    equipment: Equipment.BARBELL,
    difficulty: Difficulty.ADVANCED
  },
  {
    name: 'Squat goblet kettlebell',
    description: 'Squat goblet avec kettlebell',
    instructions: 'Kettlebell contre la poitrine, descendez en squat profond',
    muscleGroups: [MuscleGroup.LEGS, MuscleGroup.QUADS, MuscleGroup.GLUTES],
    primaryMuscle: MuscleGroup.LEGS,
    equipment: Equipment.KETTLEBELL,
    difficulty: Difficulty.BEGINNER
  },

  // ═══════════════════════════════════════════════════
  // EXERCICES ÉLASTIQUE (RESISTANCE BAND)
  // ═══════════════════════════════════════════════════
  {
    name: 'Tirage élastique',
    description: 'Tirage dos avec bande élastique',
    instructions: 'Élastique fixé en hauteur, tirez vers vous en serrant les omoplates',
    muscleGroups: [MuscleGroup.BACK],
    primaryMuscle: MuscleGroup.BACK,
    equipment: Equipment.RESISTANCE_BAND,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Curl élastique',
    description: 'Curl biceps avec bande élastique',
    instructions: 'Debout sur l\'élastique, fléchissez les coudes',
    muscleGroups: [MuscleGroup.BICEPS],
    primaryMuscle: MuscleGroup.BICEPS,
    equipment: Equipment.RESISTANCE_BAND,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Squat élastique',
    description: 'Squat avec bande élastique',
    instructions: 'Élastique sous les pieds et sur les épaules, descendez en squat',
    muscleGroups: [MuscleGroup.LEGS, MuscleGroup.QUADS, MuscleGroup.GLUTES],
    primaryMuscle: MuscleGroup.LEGS,
    equipment: Equipment.RESISTANCE_BAND,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Élévations latérales élastique',
    description: 'Élévations latérales avec bande élastique',
    instructions: 'Debout sur l\'élastique, levez les bras sur les côtés',
    muscleGroups: [MuscleGroup.SHOULDERS],
    primaryMuscle: MuscleGroup.SHOULDERS,
    equipment: Equipment.RESISTANCE_BAND,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Extension triceps élastique',
    description: 'Extension triceps avec bande élastique',
    instructions: 'Élastique fixé en haut, poussez vers le bas en gardant les coudes fixes',
    muscleGroups: [MuscleGroup.TRICEPS],
    primaryMuscle: MuscleGroup.TRICEPS,
    equipment: Equipment.RESISTANCE_BAND,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Pompes élastique',
    description: 'Pompes avec résistance de bande élastique',
    instructions: 'Élastique dans le dos et sous les mains, faites des pompes',
    muscleGroups: [MuscleGroup.CHEST, MuscleGroup.TRICEPS],
    primaryMuscle: MuscleGroup.CHEST,
    equipment: Equipment.RESISTANCE_BAND,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: 'Pull-apart élastique',
    description: 'Écartement de bande élastique pour l\'arrière d\'épaule',
    instructions: 'Bras tendus devant, écartez l\'élastique en serrant les omoplates',
    muscleGroups: [MuscleGroup.SHOULDERS, MuscleGroup.BACK],
    primaryMuscle: MuscleGroup.SHOULDERS,
    equipment: Equipment.RESISTANCE_BAND,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Hip thrust élastique',
    description: 'Hip thrust avec bande élastique autour des genoux',
    instructions: 'Élastique autour des genoux, effectuez un hip thrust en écartant les genoux',
    muscleGroups: [MuscleGroup.GLUTES],
    primaryMuscle: MuscleGroup.GLUTES,
    equipment: Equipment.RESISTANCE_BAND,
    difficulty: Difficulty.BEGINNER
  },

  // ═══════════════════════════════════════════════════
  // CARDIO
  // ═══════════════════════════════════════════════════
  {
    name: 'Course à pied',
    description: 'Course à pied en extérieur ou sur tapis',
    instructions: 'Courez à votre rythme en gardant une bonne posture',
    muscleGroups: [MuscleGroup.CARDIO, MuscleGroup.LEGS],
    primaryMuscle: MuscleGroup.CARDIO,
    equipment: Equipment.OTHER,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Vélo',
    description: 'Vélo d\'appartement ou d\'extérieur',
    instructions: 'Pédalez à votre rythme en ajustant la résistance',
    muscleGroups: [MuscleGroup.CARDIO, MuscleGroup.LEGS],
    primaryMuscle: MuscleGroup.CARDIO,
    equipment: Equipment.MACHINE,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Rameur',
    description: 'Rameur (rowing machine)',
    instructions: 'Tirez la poignée en poussant sur les jambes, puis revenez en position initiale',
    muscleGroups: [MuscleGroup.CARDIO, MuscleGroup.BACK, MuscleGroup.LEGS],
    primaryMuscle: MuscleGroup.CARDIO,
    equipment: Equipment.MACHINE,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Corde à sauter',
    description: 'Corde à sauter',
    instructions: 'Sautez à la corde à votre rythme, pieds joints ou alternés',
    muscleGroups: [MuscleGroup.CARDIO, MuscleGroup.CALVES],
    primaryMuscle: MuscleGroup.CARDIO,
    equipment: Equipment.OTHER,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Elliptique',
    description: 'Machine elliptique',
    instructions: 'Utilisez l\'elliptique en alternant les pieds et les bras',
    muscleGroups: [MuscleGroup.CARDIO, MuscleGroup.LEGS],
    primaryMuscle: MuscleGroup.CARDIO,
    equipment: Equipment.MACHINE,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Tapis de course',
    description: 'Marche ou course sur tapis roulant',
    instructions: 'Marchez ou courez sur le tapis en ajustant vitesse et inclinaison',
    muscleGroups: [MuscleGroup.CARDIO, MuscleGroup.LEGS],
    primaryMuscle: MuscleGroup.CARDIO,
    equipment: Equipment.MACHINE,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Burpees',
    description: 'Burpees complets pour le cardio et le full body',
    instructions: 'Descendez au sol, pompe, sautez les pieds vers les mains, sautez en l\'air',
    muscleGroups: [MuscleGroup.CARDIO, MuscleGroup.FULL_BODY],
    primaryMuscle: MuscleGroup.CARDIO,
    equipment: Equipment.BODYWEIGHT,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: 'Jumping jacks',
    description: 'Jumping jacks (sauts en étoile)',
    instructions: 'Sautez en écartant les bras et les jambes puis revenez',
    muscleGroups: [MuscleGroup.CARDIO],
    primaryMuscle: MuscleGroup.CARDIO,
    equipment: Equipment.BODYWEIGHT,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Sprint',
    description: 'Sprint haute intensité',
    instructions: 'Courez à vitesse maximale sur une distance courte',
    muscleGroups: [MuscleGroup.CARDIO, MuscleGroup.LEGS],
    primaryMuscle: MuscleGroup.CARDIO,
    equipment: Equipment.OTHER,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: 'Box jump',
    description: 'Sauts sur boîte (box jump)',
    instructions: 'Sautez sur une boîte puis redescendez',
    muscleGroups: [MuscleGroup.CARDIO, MuscleGroup.LEGS],
    primaryMuscle: MuscleGroup.CARDIO,
    equipment: Equipment.OTHER,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: 'Battling ropes',
    description: 'Battle ropes (cordes ondulatoires)',
    instructions: 'Faites onduler les cordes avec les bras alternativement ou ensemble',
    muscleGroups: [MuscleGroup.CARDIO, MuscleGroup.SHOULDERS],
    primaryMuscle: MuscleGroup.CARDIO,
    equipment: Equipment.OTHER,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: 'Assault bike',
    description: 'Vélo assault bike (air bike)',
    instructions: 'Pédalez et poussez/tirez les bras le plus vite possible',
    muscleGroups: [MuscleGroup.CARDIO, MuscleGroup.FULL_BODY],
    primaryMuscle: MuscleGroup.CARDIO,
    equipment: Equipment.MACHINE,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: 'Natation',
    description: 'Natation (tous styles)',
    instructions: 'Nagez à votre rythme en variant les nages',
    muscleGroups: [MuscleGroup.CARDIO, MuscleGroup.FULL_BODY],
    primaryMuscle: MuscleGroup.CARDIO,
    equipment: Equipment.OTHER,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Marche rapide',
    description: 'Marche rapide ou inclinée',
    instructions: 'Marchez à allure rapide en gardant une bonne posture',
    muscleGroups: [MuscleGroup.CARDIO, MuscleGroup.LEGS],
    primaryMuscle: MuscleGroup.CARDIO,
    equipment: Equipment.OTHER,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Montée d\'escaliers',
    description: 'Montée d\'escaliers pour le cardio et les jambes',
    instructions: 'Montez des escaliers à rythme soutenu',
    muscleGroups: [MuscleGroup.CARDIO, MuscleGroup.LEGS],
    primaryMuscle: MuscleGroup.CARDIO,
    equipment: Equipment.OTHER,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Stairmaster',
    description: 'Machine simulateur d\'escaliers',
    instructions: 'Montez les marches à un rythme constant',
    muscleGroups: [MuscleGroup.CARDIO, MuscleGroup.LEGS, MuscleGroup.GLUTES],
    primaryMuscle: MuscleGroup.CARDIO,
    equipment: Equipment.MACHINE,
    difficulty: Difficulty.BEGINNER
  },

  // ═══════════════════════════════════════════════════
  // STRETCHING / MOBILITE
  // ═══════════════════════════════════════════════════
  {
    name: 'Étirement quadriceps',
    description: 'Étirement du quadriceps debout',
    instructions: 'Debout, attrapez votre pied derrière et tirez vers les fesses',
    muscleGroups: [MuscleGroup.QUADS],
    primaryMuscle: MuscleGroup.QUADS,
    equipment: Equipment.BODYWEIGHT,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Étirement ischio-jambiers',
    description: 'Étirement des ischio-jambiers assis',
    instructions: 'Assis, jambes tendues, penchez-vous vers l\'avant',
    muscleGroups: [MuscleGroup.HAMSTRINGS],
    primaryMuscle: MuscleGroup.HAMSTRINGS,
    equipment: Equipment.BODYWEIGHT,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Étirement pectoraux',
    description: 'Étirement des pectoraux contre un mur',
    instructions: 'Bras contre un mur à 90°, tournez le buste pour étirer le pectoral',
    muscleGroups: [MuscleGroup.CHEST],
    primaryMuscle: MuscleGroup.CHEST,
    equipment: Equipment.BODYWEIGHT,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Étirement dos',
    description: 'Étirement du dos (chat-vache)',
    instructions: 'À quatre pattes, alternez dos rond et dos creux',
    muscleGroups: [MuscleGroup.BACK],
    primaryMuscle: MuscleGroup.BACK,
    equipment: Equipment.BODYWEIGHT,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Étirement épaules',
    description: 'Étirement des épaules bras croisé',
    instructions: 'Tirez un bras vers le côté opposé avec l\'autre main',
    muscleGroups: [MuscleGroup.SHOULDERS],
    primaryMuscle: MuscleGroup.SHOULDERS,
    equipment: Equipment.BODYWEIGHT,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Étirement hanches (pigeon)',
    description: 'Étirement du pigeon pour les hanches',
    instructions: 'Une jambe pliée devant, l\'autre tendue derrière, penchez-vous en avant',
    muscleGroups: [MuscleGroup.GLUTES],
    primaryMuscle: MuscleGroup.GLUTES,
    equipment: Equipment.BODYWEIGHT,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Foam rolling',
    description: 'Auto-massage au rouleau de massage',
    instructions: 'Roulez lentement sur les zones tendues pour relâcher les tensions',
    muscleGroups: [MuscleGroup.FULL_BODY],
    primaryMuscle: MuscleGroup.FULL_BODY,
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
  let created = 0
  let skipped = 0
  for (const exerciseData of exercisesData) {
    const existing = await exerciseRepo.findOne({
      where: { name: exerciseData.name }
    })

    if (!existing) {
      const exercise = exerciseRepo.create(exerciseData)
      await exerciseRepo.save(exercise)
      created++
    } else {
      skipped++
    }
  }

  console.log(`🎉 Exercise library seeding complete! Created: ${created}, Skipped: ${skipped}, Total: ${exercisesData.length}`)
}
