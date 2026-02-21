import type { UserGoal, CreateGoalPayload } from '~/types/goals'

export const useGoalApi = () => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${authStore.token}`
  })

  const getGoals = async () => {
    return await $fetch<UserGoal[]>(`${config.public.apiUrl}/goals`, {
      headers: getAuthHeaders()
    })
  }

  const createGoal = async (data: CreateGoalPayload) => {
    return await $fetch<UserGoal>(`${config.public.apiUrl}/goals`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: data
    })
  }

  const updateGoal = async (id: number, data: Partial<{ title: string; targetValue: number; deadline: string | null }>) => {
    return await $fetch<UserGoal>(`${config.public.apiUrl}/goals/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: data
    })
  }

  const achieveGoal = async (id: number) => {
    return await $fetch<UserGoal>(`${config.public.apiUrl}/goals/${id}/achieve`, {
      method: 'PUT',
      headers: getAuthHeaders()
    })
  }

  const deleteGoal = async (id: number) => {
    return await $fetch<{ message: string }>(`${config.public.apiUrl}/goals/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
  }

  return { getGoals, createGoal, updateGoal, achieveGoal, deleteGoal }
}
