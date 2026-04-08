<template>
  <div class="min-h-screen">
    <!-- Navigation -->
    <TopNav />

    <div class="pt-24 md:pt-32 px-4 md:px-6 pb-28 lg:pb-20 max-w-5xl mx-auto">
      <!-- Page Header -->
      <div class="fade-in text-center mb-8">
        <h1 class="text-3xl md:text-5xl lg:text-6xl font-bold text-display bg-gradient-to-r from-sand-500 to-primary-900 dark:to-primary-100 bg-clip-text text-transparent mb-2">Motivation</h1>
        <p class="text-lg text-primary-600 dark:text-primary-400">Gardez le rythme</p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary-300 dark:border-primary-600 border-t-primary-600 dark:border-t-primary-400"></div>
      </div>

      <template v-else>
        <!-- Streak Hero -->
        <div class="text-center mb-8 fade-in">
          <!-- Celebration animation for milestones -->
          <div v-if="showCelebration" class="fixed inset-0 z-[200] pointer-events-none flex items-center justify-center">
            <div class="text-center animate-bounce">
              <div class="w-32 h-32 md:w-48 md:h-48 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-16 h-16 md:w-24 md:h-24 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <p class="text-3xl md:text-5xl font-bold text-primary-900 dark:text-primary-100">Milestone atteint !</p>
            </div>
          </div>

          <div class="relative inline-block mb-4">
            <div class="w-20 h-20 md:w-28 md:h-28 bg-gradient-primary rounded-3xl flex items-center justify-center">
              <svg class="w-10 h-10 md:w-14 md:h-14 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"/>
              </svg>
            </div>
            <div v-if="streakData && streakData.currentStreak > 0" class="absolute -top-2 -right-4 w-10 h-10 bg-sand-600 rounded-full flex items-center justify-center text-white font-bold text-sm animate-pulse">
              {{ streakData.currentStreak }}
            </div>
          </div>

          <h2 class="text-4xl md:text-6xl font-bold text-primary-900 dark:text-primary-100 mb-2">
            {{ streakData?.currentStreak || 0 }}
            <span class="text-2xl md:text-3xl font-normal text-primary-500">
              semaine{{ (streakData?.currentStreak || 0) > 1 ? 's' : '' }}
            </span>
          </h2>
          <p class="text-lg text-primary-600 dark:text-primary-400 mb-2">de régularité</p>

          <!-- Progress toward goal this week -->
          <div v-if="streakData" class="max-w-md mx-auto mt-6">
            <div class="flex items-center justify-between text-sm text-primary-600 dark:text-primary-400 mb-2">
              <span>Cette semaine</span>
              <span class="font-semibold">{{ streakData.currentWeekWorkouts }} / {{ streakData.streakGoalPerWeek }}</span>
            </div>
            <div class="h-3 bg-primary-200 dark:bg-primary-800 rounded-full overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-700"
                :class="weekProgress >= 100 ? 'bg-gradient-to-r from-sand-500 to-sand-700' : 'bg-gradient-to-r from-sand-500 to-sand-600'"
                :style="{ width: `${Math.min(weekProgress, 100)}%` }"
              ></div>
            </div>
            <p v-if="weekProgress >= 100" class="text-sm text-sand-700 dark:text-sand-500 mt-2 font-semibold">
              Objectif atteint cette semaine !
            </p>
            <p v-else class="text-sm text-primary-500 dark:text-primary-400 mt-2">
              Encore {{ streakData.streakGoalPerWeek - streakData.currentWeekWorkouts }} séance{{ (streakData.streakGoalPerWeek - streakData.currentWeekWorkouts) > 1 ? 's' : '' }} pour maintenir ta streak
            </p>
          </div>

          <!-- Share streak button -->
          <button @click="showShareModal = 'streak'" class="btn-primary mt-6 inline-flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
            </svg>
            Partager ma streak
          </button>
        </div>

        <!-- Stats Row -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8 slide-up">
          <div class="card-glass text-center">
            <p class="text-3xl md:text-4xl font-bold text-primary-900 dark:text-primary-100">{{ streakData?.bestStreak || 0 }}</p>
            <p class="text-xs md:text-sm text-primary-500 dark:text-primary-400 mt-1">Record (semaines)</p>
          </div>
          <div class="card-glass text-center">
            <p class="text-3xl md:text-4xl font-bold text-primary-900 dark:text-primary-100">{{ totalWorkoutsAll }}</p>
            <p class="text-xs md:text-sm text-primary-500 dark:text-primary-400 mt-1">Total séances</p>
          </div>
          <div class="card-glass text-center">
            <p class="text-3xl md:text-4xl font-bold text-primary-900 dark:text-primary-100">{{ totalHoursAll }}h</p>
            <p class="text-xs md:text-sm text-primary-500 dark:text-primary-400 mt-1">Heures totales</p>
          </div>
          <div class="card-glass text-center">
            <p class="text-3xl md:text-4xl font-bold text-primary-900 dark:text-primary-100">{{ streakData?.daysSinceLastWorkout ?? '—' }}</p>
            <p class="text-xs md:text-sm text-primary-500 dark:text-primary-400 mt-1">Jours depuis dernier</p>
          </div>
        </div>

        <!-- Milestones -->
        <div v-if="streakData?.milestones?.length" class="card-glass mb-8 slide-up">
          <h3 class="text-xl font-bold text-primary-900 dark:text-primary-100 mb-6">Milestones</h3>
          <div class="flex flex-wrap gap-4">
            <div
              v-for="m in streakData.milestones"
              :key="m.weeks"
              :class="[
                'flex flex-col items-center p-4 rounded-2xl border-2 transition-all min-w-[100px]',
                m.achieved
                  ? 'bg-gradient-to-b from-sand-500/20 to-sand-600/20 dark:from-sand-500/10 dark:to-sand-600/10 border-sand-500 dark:border-sand-600'
                  : streakData!.currentStreak >= m.weeks * 0.8
                    ? 'border-primary-300 dark:border-primary-600 bg-primary-50 dark:bg-primary-800/50'
                    : 'border-primary-200 dark:border-primary-700 opacity-50'
              ]"
            >
              <div :class="['w-10 h-10 rounded-xl flex items-center justify-center mb-1', m.achieved ? 'bg-gradient-primary' : 'bg-primary-200 dark:bg-primary-700']">
                <svg v-if="m.achieved" class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                <svg v-else class="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
              </div>
              <span class="text-lg font-bold text-primary-900 dark:text-primary-100">{{ m.weeks }}sem</span>
              <span v-if="m.achieved" class="text-xs text-sand-700 dark:text-sand-500 font-medium mt-1">Obtenu</span>
              <span v-else class="text-xs text-primary-400 mt-1">{{ m.weeks - (streakData?.currentStreak || 0) }} restantes</span>
            </div>
          </div>
        </div>

        <!-- Weekly Heatmap -->
        <div v-if="streakData?.weeklyHistory?.length" class="card-glass mb-8 slide-up">
          <h3 class="text-xl font-bold text-primary-900 dark:text-primary-100 mb-6">Activité hebdomadaire</h3>
          <div class="flex flex-wrap gap-2 justify-center">
            <div
              v-for="week in streakData.weeklyHistory"
              :key="week.week"
              class="group relative"
            >
              <div
                :class="[
                  'w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center text-xs md:text-sm font-bold transition-transform hover:scale-110',
                  week.metGoal
                    ? 'bg-gradient-to-br from-sand-500 to-sand-600 text-primary-900'
                    : week.count > 0
                      ? 'bg-primary-200 dark:bg-primary-700 text-primary-700 dark:text-primary-300'
                      : 'bg-primary-100 dark:bg-primary-800/50 text-primary-300 dark:text-primary-600'
                ]"
              >
                {{ week.count }}
              </div>
              <!-- Tooltip -->
              <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-primary-900 dark:bg-primary-100 text-white dark:text-primary-900 text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-10">
                {{ week.week }}
              </div>
            </div>
          </div>
          <div class="flex items-center justify-center gap-4 mt-4 text-xs text-primary-500 dark:text-primary-400">
            <div class="flex items-center gap-1">
              <div class="w-4 h-4 rounded bg-primary-100 dark:bg-primary-800/50"></div>
              <span>0</span>
            </div>
            <div class="flex items-center gap-1">
              <div class="w-4 h-4 rounded bg-primary-200 dark:bg-primary-700"></div>
              <span>Partiel</span>
            </div>
            <div class="flex items-center gap-1">
              <div class="w-4 h-4 rounded bg-gradient-to-br from-sand-500 to-sand-600"></div>
              <span>Objectif atteint</span>
            </div>
          </div>
        </div>

        <!-- Correlation Section -->
        <div v-if="correlationData" class="card-glass mb-8 slide-up">
          <h3 class="text-xl font-bold text-primary-900 dark:text-primary-100 mb-2">Fréquence vs Progression</h3>
          <p class="text-primary-600 dark:text-primary-400 mb-6">{{ correlationData.insight }}</p>

          <!-- Bar chart -->
          <div class="flex items-end gap-2 h-48 px-4">
            <div
              v-for="week in correlationData.weeks"
              :key="week.week"
              class="flex-1 flex flex-col items-center gap-1"
            >
              <div
                :class="[
                  'w-full rounded-t-lg transition-all min-h-[4px]',
                  week.workoutCount >= 3 ? 'bg-gradient-to-t from-sand-600 to-sand-500' : 'bg-primary-300 dark:bg-primary-600'
                ]"
                :style="{ height: `${Math.max((week.avgMaxWeight / maxWeight) * 100, 4)}%` }"
              ></div>
              <span class="text-[10px] text-primary-400 whitespace-nowrap">{{ week.workoutCount }}x</span>
            </div>
          </div>

          <!-- Comparison boxes -->
          <div class="grid grid-cols-2 gap-4 mt-6">
            <div class="p-4 rounded-xl bg-primary-100/50 dark:bg-primary-800/30 text-center">
              <p class="text-xs text-primary-500 dark:text-primary-400 mb-1">Semaines &lt; 3x</p>
              <p class="text-2xl font-bold text-primary-700 dark:text-primary-300">{{ correlationData.lowFreqAvgProgress.toFixed(1) }}%</p>
              <p class="text-xs text-primary-400">progression moy.</p>
            </div>
            <div class="p-4 rounded-xl bg-gradient-to-br from-sand-500/20 to-sand-600/20 border border-sand-500/30 text-center">
              <p class="text-xs text-primary-500 dark:text-primary-400 mb-1">Semaines 3x+</p>
              <p class="text-2xl font-bold text-primary-900 dark:text-primary-100">{{ correlationData.highFreqAvgProgress.toFixed(1) }}%</p>
              <p class="text-xs text-primary-400">progression moy.</p>
            </div>
          </div>
        </div>

        <!-- Weekly Recap CTA -->
        <div class="card-glass mb-8 slide-up">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 bg-gradient-primary rounded-2xl flex items-center justify-center flex-shrink-0">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-bold text-primary-900 dark:text-primary-100">Recap de la semaine</h3>
              <p class="text-sm text-primary-600 dark:text-primary-400">Génère un résumé visuel partageable en story</p>
            </div>
            <button @click="showShareModal = 'recap'" class="btn-primary text-sm">
              Générer
            </button>
          </div>
        </div>

        <!-- Streak Goal Setting -->
        <div class="card-glass mb-8 slide-up">
          <h3 class="text-lg font-bold text-primary-900 dark:text-primary-100 mb-4">Objectif hebdomadaire</h3>
          <p class="text-sm text-primary-600 dark:text-primary-400 mb-4">
            Nombre minimum de séances par semaine pour maintenir ta streak
          </p>
          <div class="flex items-center gap-3">
            <button
              v-for="n in [1, 2, 3, 4, 5, 6]"
              :key="n"
              @click="updateStreakGoal(n)"
              :class="[
                'w-12 h-12 rounded-xl font-bold text-lg transition-all',
                n === (streakData?.streakGoalPerWeek || 2)
                  ? 'bg-gradient-primary text-white shadow-lg scale-110'
                  : 'bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-700'
              ]"
            >
              {{ n }}
            </button>
            <span class="text-sm text-primary-500 dark:text-primary-400 ml-2">x / semaine</span>
          </div>
        </div>
      </template>
    </div>

    <!-- Share Modal -->
    <Teleport to="body">
      <div v-if="showShareModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showShareModal = null"></div>
        <div class="relative bg-white dark:bg-primary-900 rounded-2xl p-4 md:p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-primary-200 dark:border-primary-700">
          <button @click="showShareModal = null" class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors">
            <svg class="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>

          <h3 class="text-xl font-bold text-primary-900 dark:text-primary-100 mb-4">
            {{ showShareModal === 'streak' ? 'Partager ma streak' : 'Recap de la semaine' }}
          </h3>

          <ShareCard
            v-if="showShareModal === 'streak' && streakData"
            type="streak"
            title="Ma streak Athletiq"
            :data="shareStreakData"
          />

          <ShareCard
            v-if="showShareModal === 'recap' && recapData"
            type="recap"
            title="Mon recap Athletiq"
            :data="shareRecapData"
          />

          <div v-if="showShareModal === 'recap' && !recapData" class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-10 w-10 border-4 border-primary-200 border-t-primary-600 mb-4"></div>
            <p class="text-primary-500">Chargement du recap...</p>
          </div>
        </div>
      </div>
    </Teleport>

    <MobileBottomNav active-path="/statistics" />
  </div>
</template>

<script setup lang="ts">
import TopNav from '~/components/TopNav.vue'
import type { StreakData, WeeklyRecapData, CorrelationData } from '~/composables/useStatsApi'

useHead({ meta: [{ name: 'robots', content: 'noindex, nofollow' }] })

const authStore = useAuthStore()
const workoutStore = useWorkoutStore()
const statsApi = useStatsApi()
const toast = useToast()

const loading = ref(true)
const streakData = ref<StreakData | null>(null)
const recapData = ref<WeeklyRecapData | null>(null)
const correlationData = ref<CorrelationData | null>(null)
const showShareModal = ref<'streak' | 'recap' | null>(null)
const showCelebration = ref(false)

onMounted(async () => {
  try {
    const [streak, correlation] = await Promise.all([
      statsApi.getStreak().catch(() => null),
      statsApi.getCorrelation().catch(() => null),
    ])
    streakData.value = streak
    correlationData.value = correlation

    // Check for new milestone celebration
    if (streak?.milestones?.some((m: any) => m.achieved && isRecent(m.achievedAt))) {
      showCelebration.value = true
      setTimeout(() => showCelebration.value = false, 3000)
    }
  } catch (e) {
    logger.error('Failed to load streak data:', e)
  } finally {
    loading.value = false
  }

  // Lazy-load workouts for total stats
  if (!workoutStore.workouts.length) {
    await workoutStore.fetchWorkouts()
  }
})

// Load recap when modal opens
watch(showShareModal, async (val) => {
  if (val === 'recap' && !recapData.value) {
    try {
      recapData.value = await statsApi.getWeeklyRecap()
    } catch {
      toast.error('Erreur', 'Impossible de charger le recap')
    }
  }
})

const isRecent = (dateStr?: string) => {
  if (!dateStr) return false
  return Date.now() - new Date(dateStr).getTime() < 24 * 60 * 60 * 1000
}

const weekProgress = computed(() => {
  if (!streakData.value) return 0
  return (streakData.value.currentWeekWorkouts / streakData.value.streakGoalPerWeek) * 100
})

const completedWorkouts = computed(() =>
  workoutStore.workouts.filter(w => w.completedAt)
)

const totalWorkoutsAll = computed(() => completedWorkouts.value.length)

const totalHoursAll = computed(() => {
  const totalSec = completedWorkouts.value.reduce((s, w) => s + (w.duration || 0), 0)
  return Math.round(totalSec / 3600)
})

const maxWeight = computed(() => {
  if (!correlationData.value) return 1
  return Math.max(...correlationData.value.weeks.map(w => w.avgMaxWeight), 1)
})

const shareStreakData = computed(() => ({
  streak: streakData.value?.currentStreak || 0,
  bestStreak: streakData.value?.bestStreak || 0,
  totalWorkouts: totalWorkoutsAll.value,
  totalHours: totalHoursAll.value,
  weeklyHistory: streakData.value?.weeklyHistory?.slice(-12) || [],
  userName: authStore.user?.firstName || '',
  message: getMotivationMessage(),
}))

const shareRecapData = computed(() => {
  if (!recapData.value) return {}
  const r = recapData.value
  const totalMin = Math.round(r.totalDuration / 60)
  const hours = Math.floor(totalMin / 60)
  const mins = totalMin % 60
  return {
    ...r,
    totalDurationFormatted: hours > 0 ? `${hours}h${mins}min` : `${mins}min`,
    userName: authStore.user?.firstName || '',
  }
})

const getMotivationMessage = () => {
  const s = streakData.value?.currentStreak || 0
  if (s >= 52) return 'Un an de régularité. Légende.'
  if (s >= 26) return '6 mois non-stop. Machine.'
  if (s >= 12) return '3 mois de discipline. Respect.'
  if (s >= 8) return '2 mois de suite, tu gères !'
  if (s >= 4) return '1 mois de régularité !'
  if (s >= 2) return 'La streak commence bien !'
  return 'La régularité fait la différence.'
}

const updateStreakGoal = async (n: number) => {
  try {
    const config = useRuntimeConfig()
    await $fetch(`${config.public.apiUrl}/users/me`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${authStore.token}` },
      body: { streakGoalPerWeek: n }
    })
    if (streakData.value) {
      streakData.value.streakGoalPerWeek = n
    }
    // Refresh streak data since goal change affects streak calc
    streakData.value = await statsApi.getStreak().catch(() => streakData.value)
    toast.success('Objectif mis à jour', `${n}x par semaine`)
  } catch {
    toast.error('Erreur', 'Impossible de mettre à jour l\'objectif')
  }
}

definePageMeta({
  middleware: 'auth'
})
</script>
