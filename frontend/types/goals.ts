export enum GoalType {
  WEIGHT = 'WEIGHT',
  PR = 'PR',
  BODY_FAT = 'BODY_FAT'
}

export interface UserGoal {
  id: number
  userId: number
  type: GoalType
  title: string
  targetValue: number
  startValue: number
  currentValue: number
  progress: number
  exerciseName?: string
  exerciseLibraryId?: number
  deadline?: string
  achieved: boolean
  achievedAt?: string
  createdAt: string
}

export interface CreateGoalPayload {
  type: GoalType
  title: string
  targetValue: number
  startValue: number
  exerciseName?: string
  exerciseLibraryId?: number
  deadline?: string
}
