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
            <div class="hidden md:flex space-x-2 bg-white dark:bg-primary-900 bg-opacity-50 dark:bg-opacity-50 backdrop-blur-lg rounded-xl p-1">
              <button
                v-for="range in timeRanges"
                :key="range.value || 'all'"
                @click="selectedTimeRange = range.value"
                :class="[
                  'px-4 py-2 rounded-lg text-sm font-semibold transition-all',
                  selectedTimeRange === range.value
                    ? 'bg-gradient-primary text-white shadow-sm'
                    : 'text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100'
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
        <div class="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary-300 dark:border-primary-600 border-t-primary-600 dark:border-t-primary-400"></div>
        <p class="mt-4 text-primary-600 dark:text-primary-400 text-lg">Chargement des statistiques...</p>
      </div>

      <!-- Empty State - No Workouts -->
      <div v-else-if="!hasData && !selectedTimeRange" class="fade-in">
        <div class="card-glass text-center py-20 max-w-2xl mx-auto">
          <svg class="w-24 h-24 mx-auto mb-6 text-primary-300 dark:text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
          </svg>
          <h2 class="text-3xl font-bold text-primary-900 dark:text-primary-100 mb-4">
            Aucune statistique disponible
          </h2>
          <p class="text-lg text-primary-600 dark:text-primary-400 mb-8">
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
          <p class="text-xl text-primary-600 dark:text-primary-400 mb-6">
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
          <h2 class="text-4xl md:text-5xl font-bold text-primary-900 dark:text-primary-100 mb-4 text-display">
            Vos Statistiques
          </h2>
          <p class="text-lg text-primary-600 dark:text-primary-400">
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
                : 'bg-white dark:bg-primary-900 bg-opacity-50 dark:bg-opacity-50 text-primary-600 dark:text-primary-400'
            ]"
          >
            {{ range.label }}
          </button>
        </div>

        <!-- Overview Stats -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 slide-up">
          <StatsStatCard
            title="Entraînements"
            :value="overviewStats.totalWorkouts"
            :icon="icons.workout"
          />
          <StatsStatCard
            title="Calories brûlées"
            :value="estimateCalories(overviewStats.totalTime)"
            format="calories"
            :icon="icons.calories"
          />
          <StatsStatCard
            title="Temps total"
            :value="overviewStats.totalTime"
            format="time"
            :icon="icons.time"
          />
          <StatsStatCard
            title="Durée moyenne"
            :value="overviewStats.averageDuration"
            format="duration"
            :icon="icons.duration"
          />
          <StatsStatCard
            title="Série en cours"
            :value="overviewStats.currentStreak"
            :subtitle="overviewStats.currentStreak > 1 ? 'jours consécutifs' : 'jour'"
            :icon="icons.streak"
          />
        </div>

        <!-- Week Comparison -->
        <div class="space-y-6 slide-up">
          <h3 class="text-3xl font-bold text-primary-900 dark:text-primary-100">Cette semaine</h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatsWeekComparisonCard
              title="Entraînements"
              :value="weekComparison.currentWeek.workouts"
              :change="weekComparison.changes.workouts"
            />
            <StatsWeekComparisonCard
              title="Calories"
              :value="estimateCalories(weekComparison.currentWeek.totalTime)"
              :change="weekComparison.changes.totalTime"
              format="calories"
            />
            <StatsWeekComparisonCard
              title="Durée moyenne"
              :value="weekComparison.currentWeek.avgDuration"
              :change="weekComparison.changes.avgDuration"
              format="duration"
            />
          </div>
        </div>

        <!-- Progression Charts -->
        <div class="space-y-6 slide-up">
          <h3 class="text-3xl font-bold text-primary-900 dark:text-primary-100">Progression</h3>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="card-glass">
              <h4 class="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-6">Calories au fil du temps</h4>
              <div class="h-[300px]">
                <StatsVolumeChart v-if="volumeData.datasets?.length" :data="volumeData" />
                <div v-else class="flex items-center justify-center h-full text-primary-400">
                  Pas de données
                </div>
              </div>
            </div>
            <div class="card-glass">
              <h4 class="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-6">Fréquence par jour</h4>
              <div class="h-[300px]">
                <StatsFrequencyChart v-if="frequencyData.datasets?.length" :data="frequencyData" />
                <div v-else class="flex items-center justify-center h-full text-primary-400">
                  Pas de données
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Exercise Progression -->
        <div v-if="allExerciseNames.length > 0" class="space-y-6 slide-up">
          <h3 class="text-3xl font-bold text-primary-900 dark:text-primary-100">Progression par exercice</h3>
          <div class="card-glass">
            <div class="mb-6">
              <select
                v-model="selectedExercise"
                class="input-primary !w-auto min-w-[250px]"
              >
                <option value="__ALL__">Tous les exercices</option>
                <option v-for="name in allExerciseNames" :key="name" :value="name">{{ name }}</option>
              </select>
            </div>
            <div v-if="activeProgressionData" class="h-[400px]">
              <StatsExerciseProgressionChart :data="activeProgressionData" />
            </div>
            <div v-else class="flex items-center justify-center h-[200px] text-primary-400">
              Aucune donnée disponible
            </div>
          </div>
        </div>

        <!-- Exercise Analysis -->
        <div class="space-y-6 slide-up">
          <h3 class="text-3xl font-bold text-primary-900 dark:text-primary-100">Analyse des exercices</h3>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="card-glass">
              <h4 class="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-6">Séances par groupe musculaire</h4>
              <div class="h-[300px]">
                <StatsMuscleGroupChart v-if="muscleGroupData.datasets?.length" :data="muscleGroupData" />
                <div v-else class="flex items-center justify-center h-full text-primary-400">
                  Pas de données
                </div>
              </div>
            </div>
            <div class="card-glass">
              <h4 class="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-6">Distribution des exercices</h4>
              <div class="h-[300px]">
                <StatsExerciseDistributionChart v-if="exerciseDistributionData.datasets?.length" :data="exerciseDistributionData" />
                <div v-else class="flex items-center justify-center h-full text-primary-400">
                  Pas de données
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Top Exercises -->
        <div v-if="topExercises.length > 0" class="card-glass slide-up">
          <h3 class="text-2xl font-bold text-primary-900 dark:text-primary-100 mb-6">Top 5 Exercices</h3>
          <div class="space-y-4">
            <div
              v-for="(exercise, index) in topExercises"
              :key="exercise.name"
              class="flex items-center justify-between p-4 bg-primary-50 dark:bg-primary-800 rounded-xl"
            >
              <div class="flex items-center space-x-4">
                <span class="flex items-center justify-center w-8 h-8 bg-gradient-primary text-white font-bold rounded-lg text-sm">
                  {{ index + 1 }}
                </span>
                <div>
                  <p class="font-semibold text-primary-900 dark:text-primary-100">{{ exercise.name }}</p>
                  <p class="text-sm text-primary-600 dark:text-primary-400">{{ exercise.count }} fois réalisé</p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-bold text-primary-900 dark:text-primary-100">{{ exercise.count }} séances</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Personal Records -->
        <div v-if="personalRecords && personalRecords.length > 0" class="space-y-6 slide-up">
          <h3 class="text-3xl font-bold text-primary-900 dark:text-primary-100">Records Personnels</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="record in personalRecords"
              :key="record?.exerciseName || record?.exerciseId"
              class="card-glass !p-6 flex items-start space-x-4"
            >
              <div class="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-bold text-primary-900 dark:text-primary-100 truncate">{{ record?.exerciseName || 'Exercice inconnu' }}</p>
                <p class="text-2xl font-bold bg-gradient-to-r from-[#d4c4b0] to-[#9d8569] bg-clip-text text-transparent">
                  {{ record?.maxWeight || 0 }} kg
                </p>
                <div class="flex items-center space-x-3 text-sm text-primary-600 dark:text-primary-400 mt-1">
                  <span>{{ record?.reps || 0 }} reps</span>
                  <span>·</span>
                  <span>{{ record?.date ? formatDate(record.date) : 'Date inconnue' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Goals / Objectifs -->
        <div class="space-y-6 slide-up">
          <div class="flex items-center justify-between">
            <h3 class="text-3xl font-bold text-primary-900 dark:text-primary-100">Mes Objectifs</h3>
            <button @click="showGoalModal = true" class="btn-primary !py-2 !px-4 text-sm">
              + Nouvel objectif
            </button>
          </div>

          <!-- Active Goals -->
          <div v-if="goalStore.activeGoals.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <GoalsGoalCard
              v-for="goal in goalStore.activeGoals"
              :key="goal.id"
              :goal="goal"
              @delete="handleDeleteGoal"
            />
          </div>
          <div v-else class="card-glass text-center py-10">
            <p class="text-primary-500 dark:text-primary-400 mb-4">Aucun objectif en cours</p>
            <button @click="showGoalModal = true" class="btn-outline text-sm">
              Créer mon premier objectif
            </button>
          </div>

          <!-- Achieved Goals -->
          <div v-if="goalStore.achievedGoals.length > 0">
            <h4 class="text-lg font-semibold text-primary-700 dark:text-primary-300 mb-3">Objectifs atteints</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <GoalsGoalCard
                v-for="goal in goalStore.achievedGoals"
                :key="goal.id"
                :goal="goal"
                @delete="handleDeleteGoal"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Goal Create Modal -->
    <GoalsGoalCreateModal
      :show="showGoalModal"
      :exercise-names="allExerciseNames"
      :current-weight="currentWeight"
      :current-body-fat="currentBodyFat"
      @close="showGoalModal = false"
      @created="handleCreateGoal"
    />
  </div>
</template>

<script setup lang="ts">
import { useWorkoutStore } from '~/stores/workout'
import { useAuthStore } from '~/stores/auth'
import { useGoalStore } from '~/stores/goals'
import { useBodyStore } from '~/stores/body'
import type { TimeRange } from '~/types/statistics'
import type { CreateGoalPayload } from '~/types/goals'

const workoutStore = useWorkoutStore()
const authStore = useAuthStore()
const goalStore = useGoalStore()
const bodyStore = useBodyStore()
const router = useRouter()
const toast = useToast()

const selectedTimeRange = ref<TimeRange>(null)
const selectedExercise = ref<string | null>('__ALL__')
const showGoalModal = ref(false)

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

  await Promise.all([
    workoutStore.fetchWorkouts(),
    goalStore.fetchGoals(),
    bodyStore.fetchBodyStats()
  ])
})

// Calculate statistics — destructure all computeds so Vue auto-unwraps them in template
const {
  overviewStats,
  volumeData,
  frequencyData,
  muscleGroupData,
  exerciseDistributionData,
  topExercises,
  personalRecords,
  weekComparison,
  allExerciseNames,
  exerciseProgressionData,
  hasData
} = useStatistics(
  computed(() => workoutStore.workoutHistory),
  selectedTimeRange,
  selectedExercise
)

// Calories estimation: ~6 kcal/min for moderate weight training
const estimateCalories = (seconds: number) => Math.round((seconds / 60) * 6)

// "All exercises" multi-line chart data
const allExercisesProgressionData = computed(() => {
  if (allExerciseNames.value.length === 0) return null

  const workouts = computed(() => workoutStore.workoutHistory).value
  const colors = ['#d4c4b0', '#b8a48f', '#9b8772', '#e8a87c', '#85cdca', '#d4a5a5', '#a3c4bc', '#c9b1ff', '#ffb347', '#87ceeb']

  // Collect max weight per date per exercise
  const exerciseMap: Record<string, { date: string; maxWeight: number }[]> = {}
  const allDatesSet = new Set<string>()

  for (const w of workouts) {
    if (!w.completedAt) continue
    const dateKey = new Date(w.completedAt).toISOString().split('T')[0]
    allDatesSet.add(dateKey)

    w.exercises?.forEach(e => {
      const name = e.exerciseLibrary?.name || e.name
      let maxWeight = 0
      e.sets?.forEach(s => { if ((s.weight || 0) > maxWeight) maxWeight = s.weight || 0 })
      if (maxWeight > 0) {
        if (!exerciseMap[name]) exerciseMap[name] = []
        exerciseMap[name].push({ date: dateKey, maxWeight })
      }
    })
  }

  const sortedDates = Array.from(allDatesSet).sort()
  const labels = sortedDates.map(d => {
    const date = new Date(d)
    return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' }).format(date)
  })

  // Only include exercises that have data, take top 10 by frequency
  const exerciseNames = Object.entries(exerciseMap)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 10)
    .map(([name]) => name)

  const datasets = exerciseNames.map((name, i) => {
    const sessions = exerciseMap[name]
    const sessionsByDate: Record<string, number> = {}
    sessions.forEach(s => { sessionsByDate[s.date] = Math.max(sessionsByDate[s.date] || 0, s.maxWeight) })

    return {
      label: name,
      data: sortedDates.map(d => sessionsByDate[d] ?? null),
      borderColor: colors[i % colors.length],
      backgroundColor: 'transparent',
      borderWidth: 2,
      tension: 0.4,
      spanGaps: true,
      pointRadius: 2,
      pointHoverRadius: 6
    }
  })

  return { labels, datasets }
})

// Active chart data: single exercise or all
const activeProgressionData = computed(() => {
  if (selectedExercise.value === '__ALL__') return allExercisesProgressionData.value
  return exerciseProgressionData.value
})

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

// Body data for goal creation
const currentWeight = computed(() => bodyStore.latestWeight?.weight ?? null)
const currentBodyFat = computed(() => bodyStore.latestWeight?.bodyFat ?? null)

// Goal handlers
const handleCreateGoal = async (payload: CreateGoalPayload) => {
  try {
    await goalStore.addGoal(payload)
    showGoalModal.value = false
    toast.success('Objectif créé')
  } catch {
    toast.error('Erreur lors de la création')
  }
}

const handleDeleteGoal = async (id: number) => {
  try {
    await goalStore.removeGoal(id)
    toast.success('Objectif supprimé')
  } catch {
    toast.error('Erreur lors de la suppression')
  }
}

// Icons (inline SVG)
const icons = {
  workout: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>`,
  calories: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"/></svg>`,
  time: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
  duration: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>`,
  streak: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"/></svg>`
}

definePageMeta({
  middleware: 'auth'
})
</script>
