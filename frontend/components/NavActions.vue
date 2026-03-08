<template>
  <div class="flex items-center space-x-3">
    <!-- Notifications -->
    <UiNotificationBell />

    <!-- Account Dropdown -->
    <div class="relative" ref="dropdownRef">
      <button @click="isOpen = !isOpen" class="flex items-center space-x-2 p-2 rounded-xl hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors">
        <div class="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
        </div>
      </button>

      <!-- Dropdown Menu -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div v-if="isOpen" class="absolute right-0 mt-2 w-56 bg-white/90 dark:bg-primary-900/90 backdrop-blur-md rounded-xl border border-primary-200 dark:border-primary-700 shadow-xl z-50">
          <div class="py-2">
            <button @click="goTo('/profile')" class="w-full text-left px-4 py-3 hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors flex items-center space-x-3">
              <svg class="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              <span class="text-primary-900 dark:text-primary-100 font-medium">Modifier mon profil</span>
            </button>

            <button @click="goTo('/streak')" class="w-full text-left px-4 py-3 hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors flex items-center space-x-3">
              <svg class="w-5 h-5 text-primary-600 dark:text-primary-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"/>
              </svg>
              <span class="text-primary-900 dark:text-primary-100 font-medium">Motivation</span>
            </button>

            <button @click="goTo('/settings')" class="w-full text-left px-4 py-3 hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors flex items-center space-x-3">
              <svg class="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <span class="text-primary-900 dark:text-primary-100 font-medium">Parametres</span>
            </button>

            <div class="border-t border-primary-200 dark:border-primary-700 my-2"></div>

            <button @click="handleLogout" class="w-full text-left px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors flex items-center space-x-3 group/logout">
              <svg class="w-5 h-5 text-primary-600 dark:text-primary-400 group-hover/logout:text-red-600 dark:group-hover/logout:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
              <span class="text-primary-900 dark:text-primary-100 font-medium group-hover/logout:text-red-600 dark:group-hover/logout:text-red-400">Deconnexion</span>
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const goTo = (path: string) => {
  isOpen.value = false
  navigateTo(path)
}

const handleLogout = () => {
  isOpen.value = false
  authStore.logout()
}

// Close dropdown when clicking outside
const onClickOutside = (e: Event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', onClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', onClickOutside)
})
</script>
