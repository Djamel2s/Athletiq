export interface BodyStat {
  id: number
  userId: number
  date: string
  weight: number
  bodyFat?: number
  notes?: string
}

export interface Measurement {
  id: number
  userId: number
  date: string
  chest?: number
  waist?: number
  hips?: number
  biceps?: number
  thighs?: number
  calves?: number
}

export interface ProgressPhoto {
  id: number
  workoutId: number
  photoUrl: string
  isPrimary: boolean
  createdAt: string
  workout?: {
    date: string
    name: string
  }
}

export interface PersonalRecord {
  exerciseName: string
  exerciseId: number
  maxWeight: number
  reps: number
  date: string
  workoutId: number
}
