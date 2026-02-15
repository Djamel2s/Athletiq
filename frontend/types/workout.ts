export enum MuscleGroup {
  CHEST = 'CHEST',
  BACK = 'BACK',
  SHOULDERS = 'SHOULDERS',
  LEGS = 'LEGS',
  QUADS = 'QUADS',
  HAMSTRINGS = 'HAMSTRINGS',
  GLUTES = 'GLUTES',
  CALVES = 'CALVES',
  BICEPS = 'BICEPS',
  TRICEPS = 'TRICEPS',
  ABS = 'ABS',
  CARDIO = 'CARDIO'
}

export enum Equipment {
  BARBELL = 'BARBELL',
  DUMBBELL = 'DUMBBELL',
  CABLE = 'CABLE',
  MACHINE = 'MACHINE',
  BODYWEIGHT = 'BODYWEIGHT',
  RESISTANCE_BAND = 'RESISTANCE_BAND',
  OTHER = 'OTHER'
}

export enum Difficulty {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED'
}

export interface ExerciseLibrary {
  id: number
  name: string
  description?: string
  instructions?: string
  muscleGroups: MuscleGroup[]
  primaryMuscle?: MuscleGroup
  equipment: Equipment
  difficulty: Difficulty
  videoUrl?: string
  imageUrl?: string
  createdAt: string
  updatedAt: string
}

export interface Set {
  id: number
  exerciseId: number
  setNumber: number
  reps?: number
  weight?: number
  duration?: number
  distance?: number
  rpe?: number
  notes?: string
  completed: boolean
  createdAt: string
  updatedAt: string
}

export interface PlannedSet {
  setNumber: number
  targetReps: number
  targetWeight: number
}

export interface Exercise {
  id: number
  workoutId: number
  exerciseLibraryId?: number
  name: string
  notes?: string
  targetSets?: number
  targetReps?: number
  targetWeight?: number
  restTime?: number
  plannedSets?: PlannedSet[]
  orderIndex: number
  createdAt: string
  updatedAt: string
  exerciseLibrary?: ExerciseLibrary
  sets?: Set[]
}

export interface Workout {
  id: number
  userId: number
  name: string
  description?: string
  isTemplate: boolean
  startedAt?: string
  completedAt?: string
  duration?: number
  totalVolume?: number
  createdAt: string
  updatedAt: string
  exercises?: Exercise[]
}

export interface WorkoutFilters {
  search?: string
  muscleGroup?: string
  equipment?: string
  difficulty?: string
}
