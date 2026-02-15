<template>
  <div class="min-h-screen">
    <!-- Navigation -->
    <nav class="fixed top-0 left-0 right-0 z-50 nav-blur">
      <div class="max-w-7xl mx-auto px-6 py-5">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <!-- Logo -->
            <NuxtLink to="/dashboard">
              <img src="/athletiq-icon.svg" alt="Athletiq" class="h-14 w-auto transition-transform duration-300 hover:scale-105" />
            </NuxtLink>
          </div>

          <div class="flex items-center space-x-6">
            <span class="text-primary-700 font-medium">{{ authStore.fullName }}</span>
            <button @click="handleLogout" class="btn-outline">
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Contenu principal -->
    <div class="pt-32 px-6 pb-20 max-w-7xl mx-auto">
      <!-- Bienvenue -->
      <div class="mb-12 fade-in">
        <h1 class="text-5xl md:text-6xl font-bold mb-4 text-display text-primary-900">
          Bienvenue {{ authStore.user?.firstName || 'sur Athletiq' }} !
        </h1>
        <p class="text-xl text-primary-600 text-body-relaxed">
          Prêt pour votre prochain entraînement ?
        </p>
      </div>

      <!-- Actions rapides -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 slide-up">
        <div class="card-glass group text-center">
          <div class="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-6 mx-auto icon-container">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h8M6 9v6m12-6v6M4.5 10v4m15-4v4"/>
            </svg>
          </div>
          <h3 class="text-2xl font-semibold mb-3 text-primary-900">Nouvel entraînement</h3>
          <p class="text-primary-600 text-body-relaxed mb-6">
            Commencez une nouvelle séance
          </p>
          <button @click="navigateTo('/workouts/start')" class="btn-primary w-full">
            GO
          </button>
        </div>

        <div class="card-glass group text-center">
          <div class="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-6 mx-auto icon-container">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
          </div>
          <h3 class="text-2xl font-semibold mb-3 text-primary-900">Mes statistiques</h3>
          <p class="text-primary-600 text-body-relaxed mb-6">
            Visualisez votre progression
          </p>
          <button class="btn-outline w-full">
            Voir
          </button>
        </div>

        <div class="card-glass group text-center">
          <div class="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-6 mx-auto icon-container">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </div>
          <h3 class="text-2xl font-semibold mb-3 text-primary-900">Mes photos</h3>
          <p class="text-primary-600 text-body-relaxed mb-6">
            Suivez votre transformation
          </p>
          <button class="btn-outline w-full">
            Galerie
          </button>
        </div>
      </div>

      <!-- Entraînements récents -->
      <div class="card-glass">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-3xl font-bold text-primary-900">Entraînements récents</h2>
          <button @click="navigateTo('/workouts')" class="text-primary-600 hover:text-primary-800 font-semibold">
            Voir tout →
          </button>
        </div>

        <div v-if="workoutStore.isLoading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
          <p class="mt-4 text-primary-600">Chargement...</p>
        </div>

        <div v-else-if="workoutStore.recentWorkouts.length === 0" class="text-center py-12">
          <p class="text-primary-500 text-lg mb-4">Aucun entraînement pour le moment</p>
          <button @click="navigateTo('/workouts/builder')" class="btn-primary">
            Créer mon premier entraînement
          </button>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="workout in workoutStore.recentWorkouts"
            :key="workout.id"
            class="p-4 bg-primary-50 rounded-xl border border-primary-200 hover:border-primary-400 hover:shadow-lg transition-all cursor-pointer"
            @click="navigateTo(`/workouts/${workout.id}`)"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h3 class="text-lg font-bold text-primary-900 mb-1">{{ workout.name }}</h3>
                <div class="flex flex-wrap gap-3 text-sm text-primary-600">
                  <span class="flex items-center space-x-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>{{ formatDate(workout.completedAt!) }}</span>
                  </span>

                  <span v-if="workout.duration" class="flex items-center space-x-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                    <span>{{ formatDuration(workout.duration) }}</span>
                  </span>

                  <span v-if="workout.exercises?.length" class="flex items-center space-x-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                    </svg>
                    <span>{{ workout.exercises.length }} exercices</span>
                  </span>

                  <span v-if="workout.totalVolume" class="flex items-center space-x-1 font-semibold text-primary-700">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                    </svg>
                    <span>{{ workout.totalVolume.toLocaleString() }} kg</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useWorkoutStore } from '~/stores/workout'

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

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
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
