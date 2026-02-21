import { defineStore } from 'pinia'
import type { AppNotification } from '~/composables/useNotificationApi'

interface NotificationState {
  notifications: AppNotification[]
  unreadCount: number
  isLoading: boolean
}

export const useNotificationStore = defineStore('notifications', {
  state: (): NotificationState => ({
    notifications: [],
    unreadCount: 0,
    isLoading: false
  }),

  actions: {
    async fetchNotifications() {
      this.isLoading = true
      try {
        const api = useNotificationApi()
        this.notifications = await api.getNotifications()
        this.unreadCount = this.notifications.filter(n => !n.read).length
      } catch (error) {
        console.error('Fetch notifications error:', error)
      } finally {
        this.isLoading = false
      }
    },

    async fetchUnreadCount() {
      try {
        const api = useNotificationApi()
        const { count } = await api.getUnreadCount()
        this.unreadCount = count
      } catch (error) {
        console.error('Fetch unread count error:', error)
      }
    },

    async markRead(id: number) {
      try {
        const api = useNotificationApi()
        await api.markAsRead(id)
        const notif = this.notifications.find(n => n.id === id)
        if (notif && !notif.read) {
          notif.read = true
          this.unreadCount = Math.max(0, this.unreadCount - 1)
        }
      } catch (error) {
        console.error('Mark read error:', error)
      }
    },

    async markAllRead() {
      try {
        const api = useNotificationApi()
        await api.markAllAsRead()
        this.notifications.forEach(n => { n.read = true })
        this.unreadCount = 0
      } catch (error) {
        console.error('Mark all read error:', error)
      }
    }
  }
})
