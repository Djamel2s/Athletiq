<template>
  <div class="min-h-screen overflow-x-hidden">
    <!-- Navigation -->
    <nav class="fixed top-0 left-0 right-0 z-50 nav-blur">
      <div class="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-5">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <!-- Logo -->
            <NuxtLink to="/dashboard">
              <AppLogo />
            </NuxtLink>
          </div>

          <NavActions />
        </div>
      </div>
    </nav>

    <!-- Loading -->
    <div v-if="!pageReady" class="pt-24 md:pt-32 pb-28 lg:pb-20 flex items-center justify-center min-h-[60vh]">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-200 dark:border-primary-700 border-t-sand-500"></div>
      </div>
    </div>

    <!-- Contenu principal -->
    <div v-else class="pt-24 md:pt-32 pb-28 lg:pb-20 max-w-7xl mx-auto">
      <div class="flex px-4 md:px-4">
        <!-- Vertical Sidebar Navigation -->
        <div class="hidden lg:block lg:mr-8 flex-shrink-0 self-start sticky top-32">
          <div class="group bg-white/70 dark:bg-primary-800/70 backdrop-blur-md rounded-xl border border-primary-200 dark:border-primary-700 hover:shadow-lg hover:border-primary-400 dark:hover:border-primary-500 p-4 flex flex-col w-[72px] hover:w-[200px] overflow-hidden" style="height: calc(100vh - 10rem); transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease, border-color 0.3s ease;">
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

              <!-- Motivation / Streak Button -->
              <button
                @click="navigateTo('/streak')"
                class="flex items-center space-x-3 transition-all"
              >
                <div class="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"/>
                  </svg>
                </div>
                <span class="text-primary-900 dark:text-primary-100 font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300">
                  Motivation
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

              <!-- Wrapped Button -->
              <button
                @click="navigateTo('/wrapped')"
                class="flex items-center space-x-3 transition-all"
              >
                <div class="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
                  </svg>
                </div>
                <span class="text-primary-900 dark:text-primary-100 font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300">
                  Wrapped
                </span>
              </button>

              <!-- Programmes Button -->
              <button
                @click="navigateTo('/programs')"
                class="flex items-center space-x-3 transition-all"
              >
                <div class="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                  </svg>
                </div>
                <span class="text-primary-900 dark:text-primary-100 font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300">
                  Programmes
                </span>
              </button>

              <!-- Badges Button -->
              <button
                @click="navigateTo('/achievements')"
                class="flex items-center space-x-3 transition-all"
              >
                <div class="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                  </svg>
                </div>
                <span class="text-primary-900 dark:text-primary-100 font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300">
                  Badges
                </span>
              </button>

              <!-- Feed Button -->
              <button
                @click="navigateTo('/feed')"
                class="flex items-center space-x-3 transition-all"
              >
                <div class="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
                  </svg>
                </div>
                <span class="text-primary-900 dark:text-primary-100 font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300">
                  Feed
                </span>
              </button>

              <!-- Gym Bros Button -->
              <button
                @click="navigateTo('/friends')"
                class="flex items-center space-x-3 transition-all"
              >
                <div class="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </div>
                <span class="text-primary-900 dark:text-primary-100 font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300">
                  Gym Bros
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
        <div class="flex-1 min-w-0">
      <!-- Bienvenue -->
      <div class="mb-8 md:mb-12 fade-in">
        <h1 class="text-3xl md:text-5xl lg:text-6xl font-bold mb-2 md:mb-4 text-display text-primary-900 dark:text-primary-100">
          Bienvenue {{ authStore.user?.firstName || 'sur Athletiq' }} !
        </h1>
        <p class="text-base md:text-xl text-primary-600 dark:text-primary-400 text-body-relaxed">
          {{ motivationMessage }}
        </p>
      </div>

      <!-- Comeback Banner -->
      <ComebackBanner
        v-if="lastWorkoutDate"
        :last-workout-date="lastWorkoutDate"
        :user-name="authStore.user?.firstName || ''"
      />

      <!-- Streak Banner -->
      <div v-if="currentStreak > 0" class="mb-6 md:mb-8 fade-in cursor-pointer" @click="navigateTo('/streak')">
        <div class="flex items-center gap-4 px-5 py-4 rounded-2xl bg-gradient-to-r from-sand-500/10 to-sand-600/10 dark:from-sand-500/15 dark:to-sand-600/15 border border-sand-500/30 dark:border-sand-600/20 hover:shadow-lg hover:scale-[1.01] transition-all">
          <div class="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"/>
            </svg>
          </div>
          <div class="flex-1">
            <p class="text-lg font-bold text-primary-900 dark:text-primary-100">
              {{ currentStreak }} jour{{ currentStreak > 1 ? 's' : '' }} de suite !
            </p>
            <p class="text-sm text-primary-600 dark:text-primary-400">
              {{ currentStreak >= 7 ? 'Incroyable, continuez comme ça !' : currentStreak >= 3 ? 'Belle série, ne lâchez rien !' : 'Bon début, gardez le rythme !' }}
            </p>
          </div>
          <svg class="w-5 h-5 text-primary-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </div>
      </div>

      <!-- Actions rapides -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-12 slide-up">
        <!-- Nouvel entraînement - caché sur mobile (déjà dans la bottom nav) -->
        <div class="hidden lg:block card-glass group text-center">
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
        <div class="lg:col-span-2">
          <WorkoutHeatmap
            v-if="workoutStore.workoutHistory"
            :workouts="workoutStore.workoutHistory"
            @click="navigateTo('/calendar')"
          />
        </div>
      </div>

      <!-- Illustration musculaire + Récupération -->
      <div class="mb-8 md:mb-12 slide-up">
        <LazyDashboardMuscleRecoveryFigure :muscle-recovery="recoveryData?.muscleRecovery || []" />
      </div>

      <!-- Coach IA Insights -->
      <div class="mb-8 md:mb-12 slide-up">
        <CoachInsights />
      </div>

      <!-- Seances planifiees -->
      <div v-if="plannedWorkouts.length > 0" class="mb-8 md:mb-12 slide-up">
        <h2 class="text-xl md:text-2xl font-bold text-primary-900 dark:text-primary-100 mb-4">Seances planifiees</h2>
        <div class="space-y-3">
          <div
            v-for="pw in plannedWorkouts"
            :key="pw.id"
            class="rounded-2xl border border-primary-200/60 dark:border-primary-700/60 bg-white/70 dark:bg-primary-800/70 backdrop-blur-sm p-4"
          >
            <div class="flex items-start gap-3">
              <!-- Bro avatar -->
              <div class="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0 overflow-hidden">
                <img v-if="plannedBro(pw).avatarUrl" :src="plannedBro(pw).avatarUrl" class="w-full h-full object-cover" />
                <span v-else class="text-xs font-bold text-white">{{ (plannedBro(pw).firstName?.[0] || plannedBro(pw).username?.[0] || '?').toUpperCase() }}</span>
              </div>

              <div class="flex-1 min-w-0">
                <h3 class="text-base font-bold text-primary-900 dark:text-primary-100 truncate">{{ pw.name }}</h3>
                <p class="text-sm text-primary-500 dark:text-primary-400">
                  avec {{ plannedBro(pw).username || `${plannedBro(pw).firstName || ''} ${plannedBro(pw).lastName || ''}`.trim() }}
                </p>
                <p class="text-xs text-primary-400 dark:text-primary-500 mt-1">
                  {{ formatPlannedDate(pw.scheduledAt) }}
                </p>
                <p v-if="pw.notes" class="text-xs text-primary-400 dark:text-primary-500 mt-0.5 italic">{{ pw.notes }}</p>
              </div>

              <div class="flex items-center gap-2 flex-shrink-0">
                <!-- Status badge -->
                <span
                  :class="[
                    'text-xs font-semibold px-2 py-1 rounded-lg',
                    pw.status === 'ACCEPTED'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                  ]"
                >
                  {{ pw.status === 'ACCEPTED' ? 'Accepte' : 'En attente' }}
                </span>

                <!-- Accept/Decline buttons if invitee -->
                <template v-if="pw.inviteeId === currentUserId && pw.status === 'PENDING'">
                  <button
                    @click="handleAcceptPlanned(pw.id)"
                    class="w-8 h-8 flex items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                    title="Accepter"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                  </button>
                  <button
                    @click="handleDeclinePlanned(pw.id)"
                    class="w-8 h-8 flex items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                    title="Decliner"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </template>

                <!-- Cancel button if inviter -->
                <button
                  v-if="pw.inviterId === currentUserId"
                  @click="handleCancelPlanned(pw.id)"
                  class="w-8 h-8 flex items-center justify-center rounded-lg text-primary-300 dark:text-primary-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  title="Annuler"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Activité récente -->
      <div v-if="workoutStore.isLoading" class="card-glass text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-200 dark:border-primary-700 border-t-primary-600"></div>
        <p class="mt-4 text-primary-600 dark:text-primary-400">Chargement...</p>
      </div>

      <LazyActivityTimeline
        v-else
        :workouts="workoutStore.recentWorkouts"
        empty-message="Aucun entraînement pour le moment"
        :show-create-button="true"
      />
        </div>
      </div>
    </div>

    <!-- Mobile Bottom Navigation -->
    <MobileBottomNav active-path="/dashboard" />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useWorkoutStore } from '~/stores/workout'
import WorkoutHeatmap from '~/components/WorkoutHeatmap.vue'

useHead({ meta: [{ name: 'robots', content: 'noindex, nofollow' }] })

const authStore = useAuthStore()
const workoutStore = useWorkoutStore()
const statsApi = useStatsApi()

const pageReady = ref(false)
const recoveryData = ref<{ score: number; muscleRecovery: Array<{ muscle: string; score: number; daysSince: number; lastVolume: number }>; recommendation: string } | null>(null)

// ── Planned workouts ──
const socialApi = useSocialApi()
const plannedWorkouts = ref<any[]>([])
const currentUserId = computed(() => authStore.user?.id)

const plannedBro = (pw: any) => {
  return pw.inviterId === currentUserId.value ? pw.invitee : pw.inviter
}

const formatPlannedDate = (dateStr: string) => {
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateStr))
}

const loadPlannedWorkouts = async () => {
  try {
    const data = await socialApi.getPlannedWorkouts()
    plannedWorkouts.value = data.plannedWorkouts || []
  } catch {
    plannedWorkouts.value = []
  }
}

const handleAcceptPlanned = async (id: number) => {
  try {
    await socialApi.acceptPlannedWorkout(id)
    await loadPlannedWorkouts()
  } catch (err) {
    logger.error('Accept planned workout failed:', err)
  }
}

const handleDeclinePlanned = async (id: number) => {
  try {
    await socialApi.declinePlannedWorkout(id)
    await loadPlannedWorkouts()
  } catch (err) {
    logger.error('Decline planned workout failed:', err)
  }
}

const handleCancelPlanned = async (id: number) => {
  try {
    await socialApi.cancelPlannedWorkout(id)
    await loadPlannedWorkouts()
  } catch (err) {
    logger.error('Cancel planned workout failed:', err)
  }
}

// Le middleware 'auth' gère déjà initAuth() + redirection
onMounted(async () => {
  // Charger les workouts récents
  await workoutStore.fetchWorkouts()
  pageReady.value = true

  // Charger les seances planifiees (en arrière-plan)
  loadPlannedWorkouts()

  // Charger le score de récupération (en arrière-plan)
  statsApi.getRecovery().then(data => {
    recoveryData.value = data
  }).catch(err => logger.error('Recovery fetch failed:', err))
})

const handleLogout = () => {
  authStore.logout()
}


const completedWorkouts = computed(() =>
  workoutStore.workouts
    .filter(w => w.completedAt)
    .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
)

const lastWorkoutDate = computed(() => {
  if (completedWorkouts.value.length === 0) return null
  return completedWorkouts.value[0]?.completedAt || null
})

const currentStreak = computed(() => {
  const sorted = completedWorkouts.value
  if (sorted.length === 0) return 0

  const workoutDates = new Set(
    sorted.map(w => {
      const d = new Date(w.completedAt!)
      d.setHours(0, 0, 0, 0)
      return d.getTime()
    })
  )

  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const today = now.getTime()
  const yesterday = today - 86400000

  if (!workoutDates.has(today) && !workoutDates.has(yesterday)) return 0

  let streak = 0
  let checkDate = workoutDates.has(today) ? today : yesterday
  while (workoutDates.has(checkDate)) {
    streak++
    checkDate -= 86400000
  }
  return streak
})

const motivationMessage = computed(() => {
  const streak = currentStreak.value
  const total = completedWorkouts.value.length
  if (total === 0) return 'Commencez votre premier entraînement !'
  if (streak >= 7) return 'Vous êtes en feu, continuez !'
  if (streak >= 3) return 'Belle régularité, gardez le cap !'
  if (streak > 0) return 'Prêt pour votre prochain entraînement ?'
  return 'On reprend ? Votre prochain entraînement vous attend !'
})

definePageMeta({
  middleware: 'auth'
})
</script>
