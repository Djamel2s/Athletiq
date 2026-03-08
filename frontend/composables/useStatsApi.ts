export interface StreakData {
  currentStreak: number
  bestStreak: number
  streakGoalPerWeek: number
  currentWeekWorkouts: number
  daysSinceLastWorkout: number | null
  weeklyHistory: { week: string; count: number; metGoal: boolean }[]
  milestones: { weeks: number; achieved: boolean; achievedAt?: string }[]
  nextMilestone: number | null
}

export interface WeeklyRecapData {
  weekLabel: string
  totalWorkouts: number
  totalDuration: number
  totalVolume: number
  totalCalories: number
  exerciseCount: number
  prsAchieved: number
  musclesTrained: string[]
  currentStreak: number
  bestExercise: { name: string; volume: number } | null
  comparison: {
    workouts: number | null
    duration: number | null
    volume: number | null
  }
}

export interface CorrelationData {
  weeks: { week: string; workoutCount: number; avgMaxWeight: number }[]
  insight: string
  highFreqAvgProgress: number
  lowFreqAvgProgress: number
}

export const useStatsApi = () => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${authStore.token}`
  })

  const getStreak = async () => {
    return await $fetch<StreakData>(`${config.public.apiUrl}/stats/streak`, {
      headers: getAuthHeaders()
    })
  }

  const getWeeklyRecap = async () => {
    return await $fetch<WeeklyRecapData>(`${config.public.apiUrl}/stats/weekly-recap`, {
      headers: getAuthHeaders()
    })
  }

  const getCorrelation = async () => {
    return await $fetch<CorrelationData>(`${config.public.apiUrl}/stats/correlation`, {
      headers: getAuthHeaders()
    })
  }

  return { getStreak, getWeeklyRecap, getCorrelation }
}
