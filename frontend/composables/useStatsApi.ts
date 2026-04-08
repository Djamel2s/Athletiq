export interface StreakData {
  currentStreak: number;
  bestStreak: number;
  streakGoalPerWeek: number;
  currentWeekWorkouts: number;
  daysSinceLastWorkout: number | null;
  weeklyHistory: { week: string; count: number; metGoal: boolean }[];
  milestones: { weeks: number; achieved: boolean; achievedAt?: string }[];
  nextMilestone: number | null;
}

export interface WeeklyRecapData {
  weekLabel: string;
  totalWorkouts: number;
  totalDuration: number;
  totalVolume: number;
  totalCalories: number;
  exerciseCount: number;
  prsAchieved: number;
  musclesTrained: string[];
  currentStreak: number;
  bestExercise: { name: string; volume: number } | null;
  comparison: {
    workouts: number | null;
    duration: number | null;
    volume: number | null;
  };
}

export interface CorrelationData {
  weeks: { week: string; workoutCount: number; avgMaxWeight: number }[];
  insight: string;
  highFreqAvgProgress: number;
  lowFreqAvgProgress: number;
}

export interface RecoveryData {
  score: number;
  muscleRecovery: { muscle: string; score: number; daysSince: number; lastVolume: number }[];
  recommendation: string;
}

export const useStatsApi = () => {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();

  const API_TIMEOUT = 30000;

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${authStore.token}`,
  });

  const fetchOpts = () => ({
    timeout: API_TIMEOUT,
    headers: getAuthHeaders(),
  });

  const getStreak = async () => {
    return await $fetch<StreakData>(`${config.public.apiUrl}/stats/streak`, fetchOpts());
  };

  const getWeeklyRecap = async () => {
    return await $fetch<WeeklyRecapData>(`${config.public.apiUrl}/stats/weekly-recap`, fetchOpts());
  };

  const getCorrelation = async () => {
    return await $fetch<CorrelationData>(`${config.public.apiUrl}/stats/correlation`, fetchOpts());
  };

  const getRecovery = async () => {
    return await $fetch<RecoveryData>(`${config.public.apiUrl}/stats/recovery`, fetchOpts());
  };

  return { getStreak, getWeeklyRecap, getCorrelation, getRecovery };
};
