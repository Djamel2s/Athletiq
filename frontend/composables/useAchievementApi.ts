import { apiFetch } from '~/utils/apiFetch';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  xp: number;
  unlocked: boolean;
  unlockedAt: string | null;
  progress: {
    current: number;
    target: number;
    percent: number;
  };
}

export interface AchievementResponse {
  achievements: Achievement[];
  stats: {
    total: number;
    unlocked: number;
    totalXP: number;
  };
}

export const useAchievementApi = () => {
  const getAchievements = async () => {
    return await apiFetch<AchievementResponse>('/achievements');
  };

  const checkAchievements = async () => {
    return await apiFetch<{ newlyUnlocked: string[] }>('/achievements/check', {
      method: 'POST',
    });
  };

  return { getAchievements, checkAchievements };
};
