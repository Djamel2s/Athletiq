import type { UserGoal, CreateGoalPayload } from '~/types/goals';

export const useGoalApi = () => {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();

  const API_TIMEOUT = 30000;

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${authStore.token}`,
  });

  const fetchOpts = (opts: Record<string, any> = {}) => ({
    timeout: API_TIMEOUT,
    headers: getAuthHeaders(),
    ...opts,
  });

  const getGoals = async () => {
    return await $fetch<UserGoal[]>(`${config.public.apiUrl}/goals`, fetchOpts());
  };

  const createGoal = async (data: CreateGoalPayload) => {
    return await $fetch<UserGoal>(`${config.public.apiUrl}/goals`, {
      method: 'POST',
      ...fetchOpts(),
      body: data,
    });
  };

  const updateGoal = async (
    id: number,
    data: Partial<{ title: string; targetValue: number; deadline: string | null }>
  ) => {
    return await $fetch<UserGoal>(`${config.public.apiUrl}/goals/${id}`, {
      method: 'PUT',
      ...fetchOpts(),
      body: data,
    });
  };

  const achieveGoal = async (id: number) => {
    return await $fetch<UserGoal>(`${config.public.apiUrl}/goals/${id}/achieve`, {
      method: 'PUT',
      ...fetchOpts(),
    });
  };

  const deleteGoal = async (id: number) => {
    return await $fetch<{ message: string }>(`${config.public.apiUrl}/goals/${id}`, {
      method: 'DELETE',
      ...fetchOpts(),
    });
  };

  return { getGoals, createGoal, updateGoal, achieveGoal, deleteGoal };
};
