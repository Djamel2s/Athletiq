export interface AppNotification {
  id: number
  userId: number
  type: string
  title: string
  message?: string
  read: boolean
  createdAt: string
}

export const useNotificationApi = () => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  const API_TIMEOUT = 30000

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${authStore.token}`
  })

  const fetchOpts = (opts: Record<string, any> = {}) => ({
    timeout: API_TIMEOUT,
    headers: getAuthHeaders(),
    ...opts
  })

  const getNotifications = async () => {
    return await $fetch<AppNotification[]>(`${config.public.apiUrl}/notifications`, fetchOpts())
  }

  const getUnreadCount = async () => {
    return await $fetch<{ count: number }>(`${config.public.apiUrl}/notifications/unread-count`, fetchOpts())
  }

  const markAsRead = async (id: number) => {
    return await $fetch<AppNotification>(`${config.public.apiUrl}/notifications/${id}/read`, {
      method: 'PUT',
      ...fetchOpts()
    })
  }

  const markAllAsRead = async () => {
    return await $fetch<{ message: string }>(`${config.public.apiUrl}/notifications/read-all`, {
      method: 'PUT',
      ...fetchOpts()
    })
  }

  const deleteNotification = async (id: number) => {
    return await $fetch<{ message: string }>(`${config.public.apiUrl}/notifications/${id}`, {
      method: 'DELETE',
      ...fetchOpts()
    })
  }

  return { getNotifications, getUnreadCount, markAsRead, markAllAsRead, deleteNotification }
}
