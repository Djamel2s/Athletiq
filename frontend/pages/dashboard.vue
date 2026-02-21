<template>
  <div class="min-h-screen">
    <!-- Navigation -->
    <nav class="fixed top-0 left-0 right-0 z-50 nav-blur">
      <div class="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-5">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <!-- Logo -->
            <NuxtLink to="/dashboard">
              <img src="/athletiq-icon.svg" alt="Athletiq" class="h-10 md:h-14 w-auto transition-transform duration-300 hover:scale-105" />
            </NuxtLink>
          </div>

          <div class="flex items-center space-x-3">
            <!-- Notifications -->
            <UiNotificationBell />

            <!-- Account Dropdown -->
            <div class="relative group">
              <button class="flex items-center space-x-2 p-2 rounded-xl hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors">
                <div class="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                </div>
              </button>

              <!-- Dropdown Menu -->
              <div class="absolute right-0 mt-2 w-56 bg-white/90 dark:bg-primary-900/90 backdrop-blur-md rounded-xl border border-primary-200 dark:border-primary-700 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div class="py-2">
                  <button @click="navigateTo('/profile')" class="w-full text-left px-4 py-3 hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors flex items-center space-x-3">
                    <svg class="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                    <span class="text-primary-900 dark:text-primary-100 font-medium">Modifier mon profil</span>
                  </button>

                  <button @click="navigateTo('/settings')" class="w-full text-left px-4 py-3 hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors flex items-center space-x-3">
                    <svg class="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    <span class="text-primary-900 dark:text-primary-100 font-medium">Paramètres</span>
                  </button>

                  <button class="w-full text-left px-4 py-3 hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors flex items-center space-x-3">
                    <svg class="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                    <span class="text-primary-900 dark:text-primary-100 font-medium">Confidentialité</span>
                  </button>

                  <div class="border-t border-primary-200 dark:border-primary-700 my-2"></div>

                  <button @click="handleLogout" class="w-full text-left px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors flex items-center space-x-3 group/logout">
                    <svg class="w-5 h-5 text-primary-600 dark:text-primary-400 group-hover/logout:text-red-600 dark:group-hover/logout:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                    </svg>
                    <span class="text-primary-900 dark:text-primary-100 font-medium group-hover/logout:text-red-600 dark:group-hover/logout:text-red-400">Déconnexion</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Contenu principal -->
    <div class="pt-24 md:pt-32 pb-28 lg:pb-20 max-w-7xl mx-auto">
      <div class="flex px-4 md:px-6">
        <!-- Vertical Sidebar Navigation -->
        <div class="hidden lg:block lg:mr-8 flex-shrink-0">
          <div class="sticky top-32 group bg-white/70 dark:bg-primary-800/70 backdrop-blur-md rounded-xl border border-primary-200 dark:border-primary-700 hover:shadow-lg hover:border-primary-400 dark:hover:border-primary-500 p-4 flex flex-col w-[72px] hover:w-[200px] overflow-hidden" style="height: calc(100vh - 10rem); transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease, border-color 0.3s ease;">
            <!-- Navigation Buttons -->
            <div class="flex flex-col space-y-6">
              <!-- Statistics Button -->
              <button
                @click="navigateTo('/statistics')"
                class="flex items-center space-x-3 transition-all"
              >
                <div class="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                  </svg>
                </div>
                <span class="text-primary-900 dark:text-primary-100 font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300">
                  Statistiques
                </span>
              </button>

              <!-- Calendrier / Activité Button -->
              <button
                @click="navigateTo('/calendar')"
                class="flex items-center space-x-3 transition-all"
              >
                <div class="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </div>
                <span class="text-primary-900 dark:text-primary-100 font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300">
                  Activité
                </span>
              </button>

              <!-- Suivi Corporel Button -->
              <button
                @click="navigateTo('/body')"
                class="flex items-center space-x-3 transition-all"
              >
                <div class="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                </div>
                <span class="text-primary-900 dark:text-primary-100 font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300">
                  Suivi
                </span>
              </button>

              <!-- Workouts Button -->
              <button
                @click="navigateTo('/workouts')"
                class="flex items-center space-x-3 transition-all"
              >
                <div class="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                  </svg>
                </div>
                <span class="text-primary-900 dark:text-primary-100 font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300">
                  Workouts
                </span>
              </button>
            </div>

            <!-- Spacer -->
            <div class="flex-1"></div>

            <!-- Separator -->
            <div class="border-t border-primary-200 dark:border-primary-700 my-4"></div>

            <!-- Logout Button -->
            <button
              @click="handleLogout"
              class="flex items-center space-x-0 transition-all group/logout"
            >
              <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-primary-700 dark:text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
              </div>
              <span class="text-primary-900 dark:text-primary-100 font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300">
                Déconnexion
              </span>
            </button>
          </div>
        </div>

        <!-- Main Content -->
        <div class="flex-1">
      <!-- Bienvenue -->
      <div class="mb-8 md:mb-12 fade-in">
        <h1 class="text-3xl md:text-5xl lg:text-6xl font-bold mb-2 md:mb-4 text-display text-primary-900 dark:text-primary-100">
          Bienvenue {{ authStore.user?.firstName || 'sur Athletiq' }} !
        </h1>
        <p class="text-base md:text-xl text-primary-600 dark:text-primary-400 text-body-relaxed">
          Prêt pour votre prochain entraînement ?
        </p>
      </div>

      <!-- Actions rapides -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-12 slide-up">
        <div class="card-glass group text-center">
          <div class="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-6 mx-auto icon-container">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h8M6 9v6m12-6v6M4.5 10v4m15-4v4"/>
            </svg>
          </div>
          <h3 class="text-2xl font-semibold mb-3 text-primary-900 dark:text-primary-100">Nouvel entraînement</h3>
          <p class="text-primary-600 dark:text-primary-400 text-body-relaxed mb-6">
            Commencez une nouvelle séance
          </p>
          <button @click="navigateTo('/workouts/start')" class="btn-primary w-full">
            GO
          </button>
        </div>

        <!-- Activity Heatmap -->
        <div class="md:col-span-2">
          <WorkoutHeatmap
            v-if="workoutStore.workoutHistory"
            :workouts="workoutStore.workoutHistory"
            @click="navigateTo('/calendar')"
          />
        </div>
      </div>

      <!-- Activité récente -->
      <div class="card-glass">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl md:text-3xl font-bold text-primary-900 dark:text-primary-100">Activité récente</h2>
          <button @click="navigateTo('/workouts')" class="text-sm text-primary-500 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-200 font-semibold transition-colors">
            Voir tout →
          </button>
        </div>

        <div v-if="workoutStore.isLoading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-200 dark:border-primary-700 border-t-primary-600"></div>
          <p class="mt-4 text-primary-600 dark:text-primary-400">Chargement...</p>
        </div>

        <div v-else-if="workoutStore.recentWorkouts.length === 0" class="text-center py-12">
          <p class="text-primary-500 dark:text-primary-400 text-lg mb-4">Aucun entraînement pour le moment</p>
          <button @click="navigateTo('/workouts/builder')" class="btn-primary">
            Créer mon premier entraînement
          </button>
        </div>

        <div v-else class="space-y-0">
          <div
            v-for="(workout, index) in workoutStore.recentWorkouts"
            :key="workout.id"
            class="flex gap-4 cursor-pointer group"
            @click="navigateTo(`/workouts/${workout.id}`)"
          >
            <!-- Timeline line + dot -->
            <div class="flex flex-col items-center">
              <div class="w-3 h-3 rounded-full bg-gradient-primary flex-shrink-0 mt-1.5 group-hover:scale-125 transition-transform"></div>
              <div v-if="index < workoutStore.recentWorkouts.length - 1" class="w-0.5 flex-1 bg-primary-200 dark:bg-primary-700 my-1"></div>
            </div>

            <!-- Content -->
            <div :class="['flex-1 pb-6', index < workoutStore.recentWorkouts.length - 1 ? '' : 'pb-0']">
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <p class="font-semibold text-primary-900 dark:text-primary-100 group-hover:text-[#b8a48f] transition-colors truncate">{{ workout.name }}</p>
                  <p class="text-xs text-primary-500 dark:text-primary-400 mt-0.5">
                    {{ formatFullDate(workout.completedAt!) }}
                  </p>
                </div>
                <div class="flex items-center gap-3 text-xs text-primary-500 dark:text-primary-400 flex-shrink-0">
                  <span v-if="workout.duration" class="flex items-center gap-1">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    {{ formatDuration(workout.duration) }}
                  </span>
                  <span v-if="workout.duration" class="flex items-center gap-1 font-semibold text-primary-700 dark:text-primary-300">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"/>
                    </svg>
                    {{ estimateCalories(workout.duration) }} kcal
                  </span>
                  <span v-if="workout.exercises?.length" class="hidden md:flex items-center gap-1">
                    {{ workout.exercises.length }} ex.
                  </span>
                </div>
              </div>

              <!-- Exercise pills -->
              <div v-if="workout.exercises?.length" class="flex flex-wrap gap-1.5 mt-2">
                <span
                  v-for="exercise in workout.exercises.slice(0, 4)"
                  :key="exercise.id"
                  class="px-2 py-0.5 bg-primary-100 dark:bg-primary-800 rounded-full text-xs text-primary-600 dark:text-primary-400"
                >
                  {{ exercise.exerciseLibrary?.name || exercise.name }}
                </span>
                <span
                  v-if="workout.exercises.length > 4"
                  class="px-2 py-0.5 bg-primary-100 dark:bg-primary-800 rounded-full text-xs text-primary-500 dark:text-primary-400"
                >
                  +{{ workout.exercises.length - 4 }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
        </div>
      </div>
    </div>

    <!-- Mobile Bottom Navigation -->
    <div class="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white/90 dark:bg-primary-900/90 backdrop-blur-md border-t border-primary-200 dark:border-primary-700">
      <div class="flex items-center justify-around py-2">
        <button @click="navigateTo('/dashboard')" class="flex flex-col items-center p-2 text-primary-900 dark:text-primary-100">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
          <span class="text-xs mt-1 font-medium">Accueil</span>
        </button>

        <button @click="navigateTo('/calendar')" class="flex flex-col items-center p-2 text-primary-600 dark:text-primary-400">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          <span class="text-xs mt-1">Activité</span>
        </button>

        <button @click="navigateTo('/workouts/start')" class="flex flex-col items-center -mt-6">
          <div class="w-14 h-14 bg-gradient-primary rounded-full flex items-center justify-center shadow-lg">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h8M6 9v6m12-6v6M4.5 10v4m15-4v4"/>
            </svg>
          </div>
          <span class="text-xs mt-1 font-semibold text-primary-900 dark:text-primary-100">GO</span>
        </button>

        <button @click="navigateTo('/workouts')" class="flex flex-col items-center p-2 text-primary-600 dark:text-primary-400">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
          <span class="text-xs mt-1">Workouts</span>
        </button>

        <button @click="navigateTo('/body')" class="flex flex-col items-center p-2 text-primary-600 dark:text-primary-400">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
          <span class="text-xs mt-1">Suivi</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useWorkoutStore } from '~/stores/workout'
import WorkoutHeatmap from '~/components/WorkoutHeatmap.vue'

const authStore = useAuthStore()
const workoutStore = useWorkoutStore()
const router = useRouter()

// Charger l'utilisateur depuis le localStorage
onMounted(async () => {
  authStore.loadFromLocalStorage()

  // Rediriger vers login si non authentifié
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }

  // Charger les workouts récents
  await workoutStore.fetchWorkouts()
})

const handleLogout = () => {
  authStore.logout()
}

const estimateCalories = (seconds: number) => Math.round((seconds / 60) * 6)

const formatFullDate = (dateString: string) => {
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString))
}

const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  if (hours > 0) {
    return `${hours}h ${minutes}min`
  }
  return `${minutes}min`
}

definePageMeta({
  middleware: 'auth'
})
</script>
