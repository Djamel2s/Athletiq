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

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${authStore.token}`
  })

  const getNotifications = async () => {
    return await $fetch<AppNotification[]>(`${config.public.apiUrl}/notifications`, {
      headers: getAuthHeaders()
    })
  }

  const getUnreadCount = async () => {
    return await $fetch<{ count: number }>(`${config.public.apiUrl}/notifications/unread-count`, {
      headers: getAuthHeaders()
    })
  }

  const markAsRead = async (id: number) => {
    return await $fetch<AppNotification>(`${config.public.apiUrl}/notifications/${id}/read`, {
      method: 'PUT',
      headers: getAuthHeaders()
    })
  }

  const markAllAsRead = async () => {
    return await $fetch<{ message: string }>(`${config.public.apiUrl}/notifications/read-all`, {
      method: 'PUT',
      headers: getAuthHeaders()
    })
  }

  const deleteNotification = async (id: number) => {
    return await $fetch<{ message: string }>(`${config.public.apiUrl}/notifications/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
  }

  return { getNotifications, getUnreadCount, markAsRead, markAllAsRead, deleteNotification }
}
