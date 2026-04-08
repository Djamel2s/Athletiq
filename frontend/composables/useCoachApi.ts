import { apiFetch } from '~/utils/apiFetch';

export interface CoachInsight {
  id: string;
  type: 'warning' | 'tip' | 'encouragement';
  icon: string;
  title: string;
  message: string;
  priority: number;
}

export const useCoachApi = () => {
  const getInsights = async () => {
    return await apiFetch<{ insights: CoachInsight[] }>('/coach/insights');
  };

  return { getInsights };
};
