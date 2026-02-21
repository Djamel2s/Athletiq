<template>
  <div class="relative">
    <!-- Bell Button -->
    <button
      @click="togglePanel"
      class="relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors"
    >
      <svg class="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
      </svg>
      <!-- Badge -->
      <span
        v-if="notificationStore.unreadCount > 0"
        class="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
      >
        {{ notificationStore.unreadCount > 9 ? '9+' : notificationStore.unreadCount }}
      </span>
    </button>

    <!-- Dropdown Panel -->
    <Transition name="dropdown">
      <div
        v-if="isOpen"
        class="absolute right-0 top-12 w-80 max-h-96 glass-dark rounded-2xl shadow-2xl overflow-hidden z-50"
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b border-white/10">
          <h4 class="font-semibold text-primary-900 dark:text-primary-100">Notifications</h4>
          <button
            v-if="notificationStore.unreadCount > 0"
            @click="notificationStore.markAllRead()"
            class="text-xs text-primary-500 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
          >
            Tout marquer comme lu
          </button>
        </div>

        <!-- List -->
        <div class="overflow-y-auto max-h-72 custom-scrollbar">
          <div v-if="notificationStore.notifications.length === 0" class="p-6 text-center text-primary-400 text-sm">
            Aucune notification
          </div>
          <div
            v-for="notif in notificationStore.notifications"
            :key="notif.id"
            @click="notificationStore.markRead(notif.id)"
            :class="[
              'p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 dark:hover:bg-white/5 transition-colors',
              !notif.read ? 'bg-primary-50/50 dark:bg-primary-800/30' : ''
            ]"
          >
            <div class="flex items-start gap-3">
              <!-- Icon by type -->
              <div :class="notifIconClass(notif.type)" class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg v-if="notif.type === 'PR_ACHIEVED'" class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <svg v-else-if="notif.type === 'STREAK_MILESTONE'" class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"/>
                </svg>
                <svg v-else-if="notif.type === 'GOAL_ACHIEVED'" class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>

              <div class="flex-1 min-w-0">
                <p :class="['text-sm font-medium truncate', !notif.read ? 'text-primary-900 dark:text-primary-100' : 'text-primary-600 dark:text-primary-400']">
                  {{ notif.title }}
                </p>
                <p v-if="notif.message" class="text-xs text-primary-500 dark:text-primary-400 mt-0.5 line-clamp-2">
                  {{ notif.message }}
                </p>
                <p class="text-xs text-primary-400 mt-1">{{ timeAgo(notif.createdAt) }}</p>
              </div>

              <!-- Unread dot -->
              <div v-if="!notif.read" class="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Backdrop -->
    <div v-if="isOpen" class="fixed inset-0 z-40" @click="isOpen = false"></div>
  </div>
</template>

<script setup lang="ts">
import { useNotificationStore } from '~/stores/notifications'

const notificationStore = useNotificationStore()
const isOpen = ref(false)

const togglePanel = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value && notificationStore.notifications.length === 0) {
    notificationStore.fetchNotifications()
  }
}

const notifIconClass = (type: string) => {
  switch (type) {
    case 'PR_ACHIEVED': return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
    case 'STREAK_MILESTONE': return 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
    case 'GOAL_ACHIEVED': return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
    default: return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
  }
}

const timeAgo = (dateString: string) => {
  const now = new Date()
  const date = new Date(dateString)
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return 'À l\'instant'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `il y a ${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `il y a ${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 7) return `il y a ${days}j`
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' }).format(date)
}

// Fetch unread count on mount
onMounted(() => {
  notificationStore.fetchUnreadCount()
})
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
