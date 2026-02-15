<template>
  <div class="min-h-screen">
    <!-- Navigation -->
    <nav class="fixed top-0 left-0 right-0 z-50 nav-blur">
      <div class="max-w-7xl mx-auto px-6 py-5">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <NuxtLink to="/dashboard">
              <img src="/athletiq-icon.svg" alt="Athletiq" class="h-14 w-auto transition-transform duration-300 hover:scale-105" />
            </NuxtLink>
            <div class="flex items-center space-x-3">
              <span class="text-2xl text-primary-400 font-light">|</span>
              <h1 class="text-2xl font-bold text-display bg-gradient-to-l from-[#d4c4b0] to-[#9d8569] bg-clip-text text-transparent">Statistiques</h1>
            </div>
          </div>

          <div class="flex items-center space-x-4">
            <!-- Time Range Selector -->
            <div class="hidden md:flex space-x-2 bg-white bg-opacity-50 backdrop-blur-lg rounded-xl p-1">
              <button
                v-for="range in timeRanges"
                :key="range.value || 'all'"
                @click="selectedTimeRange = range.value"
                :class="[
                  'px-4 py-2 rounded-lg text-sm font-semibold transition-all',
                  selectedTimeRange === range.value
                    ? 'bg-gradient-primary text-white shadow-sm'
                    : 'text-primary-600 hover:text-primary-900'
                ]"
              >
                {{ range.label }}
              </button>
            </div>

            <button @click="navigateTo('/dashboard')" class="btn-outline">
              Retour
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="pt-32 px-6 pb-20 max-w-7xl mx-auto">
      <!-- Loading State -->
      <div v-if="workoutStore.isLoading" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary-300 border-t-primary-600"></div>
        <p class="mt-4 text-primary-600 text-lg">Chargement des statistiques...</p>
      </div>

      <!-- Empty State - No Workouts -->
      <div v-else-if="!hasData && !selectedTimeRange" class="fade-in">
        <div class="card-glass text-center py-20 max-w-2xl mx-auto">
          <svg class="w-24 h-24 mx-auto mb-6 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
          </svg>
          <h2 class="text-3xl font-bold text-primary-900 mb-4">
            Aucune statistique disponible
          </h2>
          <p class="text-lg text-primary-600 mb-8">
            Commencez votre premier entraînement pour voir vos statistiques
          </p>
          <button @click="navigateTo('/workouts/start')" class="btn-primary px-8 py-4">
            Démarrer un entraînement
          </button>
        </div>
      </div>

      <!-- Empty State - No Workouts in Time Range -->
      <div v-else-if="!hasData && selectedTimeRange" class="fade-in">
        <div class="card-glass text-center py-16">
          <p class="text-xl text-primary-600 mb-6">
            Aucun entraînement dans cette période
          </p>
          <button @click="selectedTimeRange = null" class="btn-outline">
            Voir toutes les statistiques
          </button>
        </div>
      </div>

      <!-- Statistics Content -->
      <div v-else class="space-y-12">
        <!-- Page Header -->
        <div class="fade-in text-center">
          <h2 class="text-4xl md:text-5xl font-bold text-primary-900 mb-4 text-display">
            Vos Statistiques
          </h2>
          <p class="text-lg text-primary-600">
            {{ timeRangeLabel }}
          </p>
        </div>

        <!-- Mobile Time Range Selector -->
        <div class="md:hidden flex flex-wrap gap-2 justify-center slide-up">
          <button
            v-for="range in timeRanges"
            :key="range.value || 'all'"
            @click="selectedTimeRange = range.value"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-semibold transition-all',
              selectedTimeRange === range.value
                ? 'bg-gradient-primary text-white'
                : 'bg-white bg-opacity-50 text-primary-600'
            ]"
          >
            {{ range.label }}
          </button>
        </div>

        <!-- Overview Stats -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 slide-up">
          <StatsStatCard
            title="Entraînements"
            :value="stats.overviewStats.totalWorkouts"
            :icon="icons.workout"
          />
          <StatsStatCard
            title="Volume levé"
            :value="stats.overviewStats.totalVolume"
            format="weight"
            :icon="icons.weight"
          />
          <StatsStatCard
            title="Temps total"
            :value="stats.overviewStats.totalTime"
            format="time"
            :icon="icons.time"
          />
          <StatsStatCard
            title="Durée moyenne"
            :value="stats.overviewStats.averageDuration"
            format="duration"
            :icon="icons.duration"
          />
          <StatsStatCard
            title="Série en cours"
            :value="stats.overviewStats.currentStreak"
            :subtitle="stats.overviewStats.currentStreak > 1 ? 'jours consécutifs' : 'jour'"
            :icon="icons.streak"
          />
        </div>

        <!-- Progression Charts -->
        <div class="space-y-6 slide-up">
          <h3 class="text-3xl font-bold text-primary-900">Progression</h3>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="card-glass">
              <h4 class="text-xl font-semibold text-primary-900 mb-6">Volume au fil du temps</h4>
              <div class="h-[300px]">
                <StatsVolumeChart v-if="stats.volumeData && stats.volumeData.datasets" :data="stats.volumeData" />
                <div v-else class="flex items-center justify-center h-full text-primary-400">
                  Chargement...
                </div>
              </div>
            </div>
            <div class="card-glass">
              <h4 class="text-xl font-semibold text-primary-900 mb-6">Fréquence par jour</h4>
              <div class="h-[300px]">
                <StatsFrequencyChart v-if="stats.frequencyData && stats.frequencyData.datasets" :data="stats.frequencyData" />
                <div v-else class="flex items-center justify-center h-full text-primary-400">
                  Chargement...
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Exercise Analysis -->
        <div class="space-y-6 slide-up">
          <h3 class="text-3xl font-bold text-primary-900">Analyse des exercices</h3>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="card-glass">
              <h4 class="text-xl font-semibold text-primary-900 mb-6">Volume par groupe musculaire</h4>
              <div class="h-[300px]">
                <StatsMuscleGroupChart v-if="stats.muscleGroupData && stats.muscleGroupData.datasets" :data="stats.muscleGroupData" />
                <div v-else class="flex items-center justify-center h-full text-primary-400">
                  Chargement...
                </div>
              </div>
            </div>
            <div class="card-glass">
              <h4 class="text-xl font-semibold text-primary-900 mb-6">Distribution des exercices</h4>
              <div class="h-[300px]">
                <StatsExerciseDistributionChart v-if="stats.exerciseDistributionData && stats.exerciseDistributionData.datasets" :data="stats.exerciseDistributionData" />
                <div v-else class="flex items-center justify-center h-full text-primary-400">
                  Chargement...
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Top Exercises -->
        <div v-if="stats.topExercises && stats.topExercises.length > 0" class="card-glass slide-up">
          <h3 class="text-2xl font-bold text-primary-900 mb-6">Top 5 Exercices</h3>
          <div class="space-y-4">
            <div
              v-for="(exercise, index) in stats.topExercises"
              :key="exercise?.name || index"
              class="flex items-center justify-between p-4 bg-primary-50 rounded-xl"
            >
              <div class="flex items-center space-x-4">
                <span class="flex items-center justify-center w-8 h-8 bg-gradient-primary text-white font-bold rounded-lg text-sm">
                  {{ index + 1 }}
                </span>
                <div>
                  <p class="font-semibold text-primary-900">{{ exercise?.name || 'Exercice inconnu' }}</p>
                  <p class="text-sm text-primary-600">{{ exercise?.count || 0 }} fois réalisé</p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-bold text-primary-900">{{ (exercise?.totalVolume || 0).toLocaleString() }} kg</p>
                <p class="text-sm text-primary-600">volume total</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Personal Records -->
        <div v-if="stats.personalRecords && stats.personalRecords.length > 0" class="card-glass slide-up">
          <h3 class="text-2xl font-bold text-primary-900 mb-6">Records Personnels</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="record in stats.personalRecords"
              :key="record?.exerciseName || record?.exerciseId"
              class="flex items-center justify-between p-4 bg-primary-50 rounded-xl"
            >
              <div>
                <p class="font-semibold text-primary-900">{{ record?.exerciseName || 'Exercice inconnu' }}</p>
                <p class="text-sm text-primary-600">{{ record?.date ? formatDate(record.date) : 'Date inconnue' }}</p>
              </div>
              <div class="text-right">
                <p class="font-bold text-xl text-primary-900">{{ record?.maxWeight || 0 }} kg</p>
                <p class="text-sm text-primary-600">{{ record?.reps || 0 }} reps</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWorkoutStore } from '~/stores/workout'
import { useAuthStore } from '~/stores/auth'
import type { TimeRange } from '~/types/statistics'

const workoutStore = useWorkoutStore()
const authStore = useAuthStore()
const router = useRouter()

const selectedTimeRange = ref<TimeRange>(null)

const timeRanges = [
  { label: '7j', value: 7 as TimeRange },
  { label: '30j', value: 30 as TimeRange },
  { label: '90j', value: 90 as TimeRange },
  { label: 'Tout', value: null }
]

// Auth check
onMounted(async () => {
  authStore.loadFromLocalStorage()
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }

  await workoutStore.fetchWorkouts()
})

// Calculate statistics
const stats = useStatistics(
  computed(() => workoutStore.workoutHistory),
  selectedTimeRange
)

const { hasData } = stats

const timeRangeLabel = computed(() => {
  if (!selectedTimeRange.value) return 'Toutes les statistiques'
  return `Statistiques des ${selectedTimeRange.value} derniers jours`
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date)
}

// Icons (inline SVG)
const icons = {
  workout: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>`,
  weight: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>`,
  time: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
  duration: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>`,
  streak: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"/></svg>`
}

definePageMeta({
  middleware: 'auth'
})
</script>
