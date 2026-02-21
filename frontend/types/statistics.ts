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
    data: (number | null)[]
    backgroundColor?: string | string[]
    borderColor?: string
    borderWidth?: number
    fill?: boolean
    tension?: number
    spanGaps?: boolean
    pointRadius?: number
    pointHoverRadius?: number
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

export interface WeekComparison {
  currentWeek: { workouts: number; volume: number; totalTime: number; avgDuration: number }
  previousWeek: { workouts: number; volume: number; totalTime: number; avgDuration: number }
  changes: { workouts: number | null; volume: number | null; totalTime: number | null; avgDuration: number | null }
}

export type TimeRange = 7 | 30 | 90 | null
