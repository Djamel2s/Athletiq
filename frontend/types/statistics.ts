export interface OverviewStats {
  totalWorkouts: number
  totalVolume: number
  totalTime: number
  averageDuration: number
  currentStreak: number
}

export interface ChartDataPoint {
  label: string
  value: number
}

export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string | string[]
    borderColor?: string
    borderWidth?: number
    fill?: boolean
    tension?: number
  }[]
}

export interface ExerciseStats {
  name: string
  count: number
  totalVolume: number
  lastPerformed?: string
}

export interface PersonalRecord {
  exerciseName: string
  exerciseId: number
  maxWeight: number
  reps: number
  date: string
  workoutId: number
}

export interface MuscleGroupStats {
  muscleGroup: string
  totalVolume: number
  workoutCount: number
  percentage: number
}

export type TimeRange = 7 | 30 | 90 | null
