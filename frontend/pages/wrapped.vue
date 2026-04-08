<template>
  <div class="min-h-screen">
    <!-- Navigation -->
    <TopNav />

    <div class="pt-24 md:pt-32 px-4 md:px-6 pb-28 lg:pb-20 max-w-5xl mx-auto">
      <!-- Page Header -->
      <div class="fade-in text-center mb-8">
        <h1 class="text-3xl md:text-5xl lg:text-6xl font-bold text-display bg-gradient-to-r from-sand-500 to-primary-900 dark:to-primary-100 bg-clip-text text-transparent mb-2">Athletiq Wrapped</h1>
        <p class="text-lg text-primary-600 dark:text-primary-400">Votre bilan sportif</p>
      </div>

      <!-- Loading -->
      <div v-if="workoutStore.isLoading" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary-300 dark:border-primary-600 border-t-primary-600 dark:border-t-primary-400"></div>
        <p class="mt-4 text-primary-600 dark:text-primary-400 text-lg">Chargement de ton bilan...</p>
      </div>

      <template v-else>
        <!-- Period Selector -->
        <div class="flex justify-center mb-8 fade-in">
          <div class="flex space-x-2 bg-white dark:bg-primary-900 bg-opacity-50 dark:bg-opacity-50 backdrop-blur-lg rounded-xl p-1">
            <button
              v-for="p in periods"
              :key="p.value"
              @click="selectedPeriod = p.value"
              :class="[
                'px-5 py-2.5 rounded-lg text-sm font-semibold transition-all',
                selectedPeriod === p.value
                  ? 'bg-gradient-primary text-white shadow-sm'
                  : 'text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100'
              ]"
            >
              {{ p.label }}
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredWorkouts.length === 0" class="card-glass text-center py-20 max-w-2xl mx-auto fade-in">
          <svg class="w-24 h-24 mx-auto mb-6 text-primary-300 dark:text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
          </svg>
          <h2 class="text-3xl font-bold text-primary-900 dark:text-primary-100 mb-4">Aucune donnee pour cette periode</h2>
          <p class="text-lg text-primary-600 dark:text-primary-400">Complete des seances pour voir ton bilan !</p>
        </div>

        <template v-if="filteredWorkouts.length > 0">
          <!-- Hero Section - Total Workouts -->
          <div class="text-center mb-8 fade-in">
            <div class="relative inline-block mb-4">
              <div class="w-20 h-20 md:w-28 md:h-28 bg-gradient-primary rounded-3xl flex items-center justify-center">
                <svg class="w-10 h-10 md:w-14 md:h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
            </div>

            <h2 class="text-6xl md:text-8xl font-bold text-primary-900 dark:text-primary-100 mb-2 transition-all duration-700">
              {{ totalWorkouts }}
            </h2>
            <p class="text-xl md:text-2xl text-primary-500 dark:text-primary-400">
              entrainement{{ totalWorkouts > 1 ? 's' : '' }}
            </p>
            <p class="text-sm text-primary-400 dark:text-primary-500 mt-1">
              {{ selectedPeriod === 'month' ? 'ce mois-ci' : 'depuis le debut' }}
            </p>
          </div>

          <!-- Stats Cards Grid -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8 slide-up">
            <div class="card-glass text-center">
              <p class="text-3xl md:text-4xl font-bold text-primary-900 dark:text-primary-100">{{ totalTimeFormatted }}</p>
              <p class="text-xs md:text-sm text-primary-500 dark:text-primary-400 mt-1">Temps total</p>
            </div>
            <div class="card-glass text-center">
              <p class="text-3xl md:text-4xl font-bold text-primary-900 dark:text-primary-100">{{ totalVolumeFormatted }}</p>
              <p class="text-xs md:text-sm text-primary-500 dark:text-primary-400 mt-1">Volume souleve</p>
            </div>
            <div class="card-glass text-center">
              <p class="text-3xl md:text-4xl font-bold text-primary-900 dark:text-primary-100">{{ avgDurationFormatted }}</p>
              <p class="text-xs md:text-sm text-primary-500 dark:text-primary-400 mt-1">Duree moyenne</p>
            </div>
            <div class="card-glass text-center">
              <p class="text-3xl md:text-4xl font-bold text-primary-900 dark:text-primary-100">{{ bestStreakWeeks }}</p>
              <p class="text-xs md:text-sm text-primary-500 dark:text-primary-400 mt-1">Meilleure serie (sem.)</p>
            </div>
            <div class="card-glass text-center">
              <p class="text-3xl md:text-4xl font-bold text-primary-900 dark:text-primary-100">{{ totalCalories.toLocaleString('fr-FR') }}</p>
              <p class="text-xs md:text-sm text-primary-500 dark:text-primary-400 mt-1">Calories brulees</p>
            </div>
            <div class="card-glass text-center">
              <p class="text-3xl md:text-4xl font-bold text-primary-900 dark:text-primary-100">{{ totalExercises }}</p>
              <p class="text-xs md:text-sm text-primary-500 dark:text-primary-400 mt-1">Exercices realises</p>
            </div>
          </div>

          <!-- Top 3 Exercises -->
          <div v-if="topExercises.length" class="card-glass mb-8 slide-up">
            <h3 class="text-xl font-bold text-primary-900 dark:text-primary-100 mb-6">Top 3 exercices</h3>
            <div class="flex flex-wrap gap-4">
              <div
                v-for="(ex, i) in topExercises"
                :key="ex.name"
                class="flex items-center gap-4 w-full p-4 rounded-2xl border-2 transition-all bg-gradient-to-b from-sand-500/20 to-sand-600/20 dark:from-sand-500/10 dark:to-sand-600/10 border-sand-500 dark:border-sand-600"
              >
                <div class="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-primary flex-shrink-0">
                  <span class="text-white font-bold text-lg">{{ i + 1 }}</span>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-lg font-bold text-primary-900 dark:text-primary-100 truncate">{{ ex.name }}</p>
                  <p class="text-sm text-primary-500 dark:text-primary-400">{{ ex.count }} fois</p>
                </div>
                <div class="text-right flex-shrink-0">
                  <p class="text-sm font-semibold text-sand-700 dark:text-sand-500">{{ ex.maxWeight > 0 ? ex.maxWeight + ' kg' : '---' }}</p>
                  <p class="text-xs text-primary-400">PR</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Muscle Group Distribution -->
          <div v-if="muscleDistribution.length" class="card-glass mb-8 slide-up">
            <h3 class="text-xl font-bold text-primary-900 dark:text-primary-100 mb-6">Repartition musculaire</h3>
            <div class="space-y-3">
              <div v-for="muscle in muscleDistribution" :key="muscle.name" class="flex items-center gap-3">
                <span class="w-24 text-sm text-primary-600 dark:text-primary-400 text-right flex-shrink-0 truncate">{{ muscle.label }}</span>
                <div class="flex-1 h-6 bg-primary-200 dark:bg-primary-800 rounded-full overflow-hidden">
                  <div
                    class="h-full rounded-full bg-gradient-to-r from-sand-500 to-sand-600 transition-all duration-700"
                    :style="{ width: `${muscle.percent}%` }"
                  ></div>
                </div>
                <span class="w-12 text-sm font-semibold text-primary-900 dark:text-primary-100 text-right">{{ muscle.percent }}%</span>
              </div>
            </div>
          </div>

          <!-- Best Improvements -->
          <div v-if="bestImprovements.length" class="card-glass mb-8 slide-up">
            <h3 class="text-xl font-bold text-primary-900 dark:text-primary-100 mb-6">Meilleures progressions</h3>
            <div class="space-y-3">
              <div
                v-for="(imp, i) in bestImprovements"
                :key="imp.name"
                class="flex items-center gap-4 p-4 rounded-2xl border-2 transition-all bg-gradient-to-b from-sand-500/20 to-sand-600/20 dark:from-sand-500/10 dark:to-sand-600/10 border-sand-500 dark:border-sand-600"
              >
                <div class="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-primary flex-shrink-0">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-lg font-bold text-primary-900 dark:text-primary-100 truncate">{{ imp.name }}</p>
                </div>
                <div class="text-right flex-shrink-0">
                  <p class="text-sm font-semibold text-primary-500 dark:text-primary-400">
                    {{ imp.before }} kg
                    <span class="text-sand-700 dark:text-sand-500 mx-1">&rarr;</span>
                    <span class="text-sand-700 dark:text-sand-500 font-bold">{{ imp.after }} kg</span>
                  </p>
                  <p class="text-xs text-primary-400">+{{ imp.diff }} kg</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Share Button -->
          <div class="text-center mb-8 fade-in">
            <button @click="showShareModal = true" class="btn-primary inline-flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
              </svg>
              Partager mon bilan
            </button>
          </div>
        </template>
      </template>
    </div>

    <!-- Share Modal -->
    <Teleport to="body">
      <div v-if="showShareModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showShareModal = false"></div>
        <div class="relative bg-white dark:bg-primary-900 rounded-2xl p-4 md:p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-primary-200 dark:border-primary-700">
          <button @click="showShareModal = false" class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors">
            <svg class="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>

          <h3 class="text-xl font-bold text-primary-900 dark:text-primary-100 mb-4">Partager mon bilan</h3>

          <ShareCard
            type="wrapped"
            title="Mon Bilan Athletiq"
            :data="shareData"
          />
        </div>
      </div>
    </Teleport>

    <MobileBottomNav active-path="/statistics" />
  </div>
</template>

<script setup lang="ts">
import TopNav from '~/components/TopNav.vue'
import type { Workout, Exercise, Set } from '~/types/workout'

useHead({ meta: [{ name: 'robots', content: 'noindex, nofollow' }] })

const authStore = useAuthStore()
const workoutStore = useWorkoutStore()

const showShareModal = ref(false)

const periods = [
  { label: 'Ce mois', value: 'month' as const },
  { label: 'Tout le temps', value: 'all' as const },
]
const selectedPeriod = ref<'month' | 'all'>('month')

onMounted(async () => {
  if (!workoutStore.workouts.length) {
    await workoutStore.fetchWorkouts()
  }
})

// --- Filtered workouts based on period ---
const filteredWorkouts = computed(() => {
  const history = workoutStore.workoutHistory || []
  if (selectedPeriod.value === 'all') return history

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  return history.filter((w: Workout) => {
    if (!w.completedAt) return false
    return new Date(w.completedAt) >= startOfMonth
  })
})

// --- Core stats ---
const totalWorkouts = computed(() => filteredWorkouts.value.length)

const totalDurationSeconds = computed(() =>
  filteredWorkouts.value.reduce((sum: number, w: Workout) => sum + (w.duration || 0), 0)
)

const totalTimeFormatted = computed(() => {
  const hours = Math.round(totalDurationSeconds.value / 3600)
  return hours > 0 ? `${hours}h` : `${Math.round(totalDurationSeconds.value / 60)}min`
})

const totalVolumeKg = computed(() =>
  filteredWorkouts.value.reduce((sum: number, w: Workout) => sum + (w.totalVolume || 0), 0)
)

const totalVolumeFormatted = computed(() => {
  const tonnes = totalVolumeKg.value / 1000
  return tonnes >= 1 ? `${tonnes.toFixed(1)}T` : `${totalVolumeKg.value}kg`
})

const avgDurationFormatted = computed(() => {
  if (totalWorkouts.value === 0) return '0min'
  const avgSec = totalDurationSeconds.value / totalWorkouts.value
  const mins = Math.round(avgSec / 60)
  return mins >= 60 ? `${Math.floor(mins / 60)}h${mins % 60}min` : `${mins}min`
})

const bestStreakWeeks = computed(() => {
  if (filteredWorkouts.value.length === 0) return 0
  const sorted = [...filteredWorkouts.value]
    .filter((w: Workout) => w.completedAt)
    .sort((a: Workout, b: Workout) => new Date(a.completedAt!).getTime() - new Date(b.completedAt!).getTime())

  // Group by ISO week
  const weekSet = new Set<string>()
  sorted.forEach((w: Workout) => {
    const d = new Date(w.completedAt!)
    const yearWeek = getISOWeekKey(d)
    weekSet.add(yearWeek)
  })

  const weeks = Array.from(weekSet).sort()
  let best = 1
  let current = 1
  for (let i = 1; i < weeks.length; i++) {
    if (areConsecutiveWeeks(weeks[i - 1], weeks[i])) {
      current++
      best = Math.max(best, current)
    } else {
      current = 1
    }
  }
  return best
})

// Calories: duration (minutes) * 6 kcal/min
const totalCalories = computed(() =>
  Math.round((totalDurationSeconds.value / 60) * 6)
)

const totalExercises = computed(() =>
  filteredWorkouts.value.reduce((sum: number, w: Workout) => sum + (w.exercises?.length || 0), 0)
)

// --- Top 3 exercises ---
const topExercises = computed(() => {
  const counts: Record<string, { count: number; maxWeight: number }> = {}
  filteredWorkouts.value.forEach((w: Workout) => {
    w.exercises?.forEach((ex: Exercise) => {
      const name = ex.name
      if (!counts[name]) counts[name] = { count: 0, maxWeight: 0 }
      counts[name].count++
      ex.sets?.forEach((s: Set) => {
        if (s.weight && s.weight > counts[name].maxWeight) {
          counts[name].maxWeight = s.weight
        }
      })
    })
  })
  return Object.entries(counts)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
})

// --- Muscle group distribution ---
const muscleGroupLabels: Record<string, string> = {
  CHEST: 'Pectoraux',
  BACK: 'Dos',
  SHOULDERS: 'Epaules',
  LEGS: 'Jambes',
  QUADS: 'Quadriceps',
  HAMSTRINGS: 'Ischio-jambiers',
  GLUTES: 'Fessiers',
  CALVES: 'Mollets',
  BICEPS: 'Biceps',
  TRICEPS: 'Triceps',
  ABS: 'Abdos',
  CARDIO: 'Cardio',
}

const muscleDistribution = computed(() => {
  const counts: Record<string, number> = {}
  let total = 0
  filteredWorkouts.value.forEach((w: Workout) => {
    w.exercises?.forEach((ex: Exercise) => {
      const muscles = ex.exerciseLibrary?.muscleGroups || []
      muscles.forEach((mg: string) => {
        counts[mg] = (counts[mg] || 0) + 1
        total++
      })
    })
  })
  if (total === 0) return []

  return Object.entries(counts)
    .map(([name, count]) => ({
      name,
      label: muscleGroupLabels[name] || name,
      percent: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.percent - a.percent)
})

// --- Best improvements (max weight increase per exercise) ---
const bestImprovements = computed(() => {
  // We need at least 2 workouts to compute improvement
  const sorted = [...filteredWorkouts.value]
    .filter((w: Workout) => w.completedAt)
    .sort((a: Workout, b: Workout) => new Date(a.completedAt!).getTime() - new Date(b.completedAt!).getTime())

  // Track first and last max weight per exercise
  const exerciseWeights: Record<string, { first: number; last: number }> = {}

  sorted.forEach((w: Workout) => {
    w.exercises?.forEach((ex: Exercise) => {
      const name = ex.name
      let maxW = 0
      ex.sets?.forEach((s: Set) => {
        if (s.weight && s.weight > maxW) maxW = s.weight
      })
      if (maxW > 0) {
        if (!exerciseWeights[name]) {
          exerciseWeights[name] = { first: maxW, last: maxW }
        } else {
          exerciseWeights[name].last = Math.max(exerciseWeights[name].last, maxW)
        }
      }
    })
  })

  return Object.entries(exerciseWeights)
    .map(([name, data]) => ({
      name,
      before: data.first,
      after: data.last,
      diff: data.last - data.first,
    }))
    .filter(x => x.diff > 0)
    .sort((a, b) => b.diff - a.diff)
    .slice(0, 3)
})

// --- Share data for ShareCard ---
const shareData = computed(() => ({
  period: selectedPeriod.value === 'month' ? 'CE MOIS' : 'TOUT LE TEMPS',
  totalWorkouts: totalWorkouts.value,
  totalTime: totalTimeFormatted.value,
  totalVolume: totalVolumeFormatted.value,
  avgDuration: avgDurationFormatted.value,
  streak: bestStreakWeeks.value,
  topExercise: topExercises.value[0]
    ? { name: topExercises.value[0].name, count: topExercises.value[0].count, pr: topExercises.value[0].maxWeight > 0 ? `${topExercises.value[0].maxWeight}kg` : '---' }
    : null,
  improvements: bestImprovements.value.map(imp => ({
    name: imp.name,
    before: `${imp.before}`,
    after: `${imp.after}`,
  })),
  userName: authStore.user?.firstName || '',
}))

// --- Helpers ---
function getISOWeekKey(d: Date): string {
  const tmp = new Date(d.getTime())
  tmp.setHours(0, 0, 0, 0)
  tmp.setDate(tmp.getDate() + 3 - ((tmp.getDay() + 6) % 7))
  const week1 = new Date(tmp.getFullYear(), 0, 4)
  const weekNum = 1 + Math.round(((tmp.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7)
  return `${tmp.getFullYear()}-W${String(weekNum).padStart(2, '0')}`
}

function areConsecutiveWeeks(a: string, b: string): boolean {
  const [yearA, weekA] = a.split('-W').map(Number)
  const [yearB, weekB] = b.split('-W').map(Number)
  if (yearA === yearB) return weekB === weekA + 1
  if (yearB === yearA + 1 && weekB === 1) {
    // Last week of yearA could be 52 or 53
    const lastDay = new Date(yearA, 11, 31)
    const lastWeekKey = getISOWeekKey(lastDay)
    const lastWeek = parseInt(lastWeekKey.split('-W')[1])
    return weekA === lastWeek
  }
  return false
}

definePageMeta({
  middleware: 'auth'
})
</script>
