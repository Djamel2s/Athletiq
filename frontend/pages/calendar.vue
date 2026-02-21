<template>
  <div class="min-h-screen">
    <!-- Navigation -->
    <nav class="fixed top-0 left-0 right-0 z-50 nav-blur">
      <div class="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-5">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <NuxtLink to="/dashboard">
              <img src="/athletiq-icon.svg" alt="Athletiq" class="h-10 md:h-14 w-auto transition-transform duration-300 hover:scale-105" />
            </NuxtLink>
            <div class="flex items-center space-x-3">
              <span class="text-2xl text-primary-400 font-light hidden md:inline">|</span>
              <h1 class="text-lg md:text-2xl font-bold text-display bg-gradient-to-l from-[#d4c4b0] to-[#9d8569] bg-clip-text text-transparent">Suivi d'activité</h1>
            </div>
          </div>

          <button @click="navigateTo('/dashboard')" class="btn-outline text-sm md:text-base">
            Retour
          </button>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="pt-24 md:pt-32 px-4 md:px-6 pb-28 lg:pb-20 max-w-7xl mx-auto">

      <!-- Loading State -->
      <div v-if="workoutStore.isLoading && !workoutStore.workouts.length" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary-300 dark:border-primary-600 border-t-primary-600 dark:border-t-primary-400"></div>
        <p class="mt-4 text-primary-600 dark:text-primary-400 text-lg">Chargement...</p>
      </div>

      <template v-else>
        <!-- Quick Stats Row -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8 fade-in">
          <!-- Streak -->
          <div class="card-glass text-center">
            <div class="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"/>
              </svg>
            </div>
            <p class="text-2xl md:text-3xl font-bold text-primary-900 dark:text-primary-100">{{ currentStreak }}</p>
            <p class="text-xs md:text-sm text-primary-500 dark:text-primary-400 mt-1">Série en cours</p>
          </div>

          <!-- This Week -->
          <div class="card-glass text-center">
            <div class="w-12 h-12 mx-auto mb-3 bg-gradient-primary rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            <p class="text-2xl md:text-3xl font-bold text-primary-900 dark:text-primary-100">{{ workoutsThisWeek }}</p>
            <p class="text-xs md:text-sm text-primary-500 dark:text-primary-400 mt-1">Cette semaine</p>
          </div>

          <!-- This Month -->
          <div class="card-glass text-center">
            <div class="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
              </svg>
            </div>
            <p class="text-2xl md:text-3xl font-bold text-primary-900 dark:text-primary-100">{{ workoutsThisMonth }}</p>
            <p class="text-xs md:text-sm text-primary-500 dark:text-primary-400 mt-1">Ce mois</p>
          </div>

          <!-- Total -->
          <div class="card-glass text-center">
            <div class="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <p class="text-2xl md:text-3xl font-bold text-primary-900 dark:text-primary-100">{{ totalWorkouts }}</p>
            <p class="text-xs md:text-sm text-primary-500 dark:text-primary-400 mt-1">Total</p>
          </div>
        </div>

        <!-- Calendar + Week Comparison -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8 slide-up">
          <!-- Calendar (takes 2 cols on large screens) -->
          <div class="lg:col-span-2">
            <DashboardWorkoutCalendar
              v-if="completedWorkouts.length"
              :workouts="completedWorkouts"
            />
            <div v-else class="card-glass flex flex-col items-center justify-center py-16">
              <svg class="w-16 h-16 text-primary-300 dark:text-primary-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              <p class="text-primary-500 dark:text-primary-400 text-lg font-medium mb-2">Aucun entraînement</p>
              <p class="text-primary-400 dark:text-primary-500 text-sm mb-4">Commencez à vous entraîner pour voir votre calendrier</p>
              <button @click="navigateTo('/workouts/start')" class="btn-primary">Commencer</button>
            </div>
          </div>

          <!-- Side Panel -->
          <div class="space-y-6">
            <!-- Week Comparison -->
            <div class="card-glass">
              <h3 class="text-lg font-bold text-primary-900 dark:text-primary-100 mb-4">Cette semaine vs précédente</h3>
              <div class="space-y-4">
                <!-- Workouts comparison -->
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm text-primary-500 dark:text-primary-400">Séances</p>
                    <p class="text-xl font-bold text-primary-900 dark:text-primary-100">{{ weekStats.current.workouts }}</p>
                  </div>
                  <div v-if="weekStats.changes.workouts !== null" :class="weekStats.changes.workouts >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'" class="flex items-center text-sm font-semibold">
                    <svg v-if="weekStats.changes.workouts >= 0" class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
                    </svg>
                    <svg v-else class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
                    </svg>
                    {{ Math.abs(weekStats.changes.workouts) }}%
                  </div>
                  <span v-else class="text-xs text-primary-400">—</span>
                </div>

                <div class="h-px bg-primary-200 dark:bg-primary-700"></div>

                <!-- Calories comparison -->
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm text-primary-500 dark:text-primary-400">Calories</p>
                    <p class="text-xl font-bold text-primary-900 dark:text-primary-100">{{ estimateCalories(weekStats.current.totalTime).toLocaleString('fr-FR') }} <span class="text-sm font-normal text-primary-500">kcal</span></p>
                  </div>
                  <div v-if="weekStats.changes.totalTime !== null" :class="weekStats.changes.totalTime >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'" class="flex items-center text-sm font-semibold">
                    <svg v-if="weekStats.changes.totalTime >= 0" class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
                    </svg>
                    <svg v-else class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
                    </svg>
                    {{ Math.abs(weekStats.changes.totalTime) }}%
                  </div>
                  <span v-else class="text-xs text-primary-400">—</span>
                </div>

                <div class="h-px bg-primary-200 dark:bg-primary-700"></div>

                <!-- Duration comparison -->
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm text-primary-500 dark:text-primary-400">Durée moy.</p>
                    <p class="text-xl font-bold text-primary-900 dark:text-primary-100">{{ formatDuration(weekStats.current.avgDuration) }}</p>
                  </div>
                  <div v-if="weekStats.changes.avgDuration !== null" :class="weekStats.changes.avgDuration >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'" class="flex items-center text-sm font-semibold">
                    <svg v-if="weekStats.changes.avgDuration >= 0" class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
                    </svg>
                    <svg v-else class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
                    </svg>
                    {{ Math.abs(weekStats.changes.avgDuration) }}%
                  </div>
                  <span v-else class="text-xs text-primary-400">—</span>
                </div>
              </div>
            </div>

            <!-- Favourite Day -->
            <div class="card-glass">
              <h3 class="text-lg font-bold text-primary-900 dark:text-primary-100 mb-4">Jour favori</h3>
              <div v-if="favouriteDay" class="flex items-center gap-4">
                <div class="w-14 h-14 bg-gradient-primary rounded-xl flex items-center justify-center">
                  <span class="text-white font-bold text-lg">{{ favouriteDay.short }}</span>
                </div>
                <div>
                  <p class="text-lg font-bold text-primary-900 dark:text-primary-100 capitalize">{{ favouriteDay.name }}</p>
                  <p class="text-sm text-primary-500 dark:text-primary-400">{{ favouriteDay.count }} entraînement{{ favouriteDay.count > 1 ? 's' : '' }}</p>
                </div>
              </div>
              <p v-else class="text-sm text-primary-400">Pas encore de données</p>
            </div>

            <!-- Monthly Calories -->
            <div class="card-glass">
              <h3 class="text-lg font-bold text-primary-900 dark:text-primary-100 mb-4">Calories mensuelles</h3>
              <p class="text-3xl font-bold text-primary-900 dark:text-primary-100">
                {{ monthlyCalories.toLocaleString('fr-FR') }}
                <span class="text-base font-normal text-primary-500 dark:text-primary-400">kcal</span>
              </p>
              <p class="text-sm text-primary-500 dark:text-primary-400 mt-1">
                {{ workoutsThisMonth }} séance{{ workoutsThisMonth > 1 ? 's' : '' }} ce mois
              </p>
            </div>
          </div>
        </div>

        <!-- Recent Activity Timeline -->
        <div class="card-glass slide-up">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-primary-900 dark:text-primary-100">Activité récente</h3>
            <button @click="navigateTo('/workouts')" class="text-sm text-primary-500 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-200 font-semibold transition-colors">
              Voir tout →
            </button>
          </div>

          <div v-if="recentWorkouts.length === 0" class="text-center py-8 text-primary-400 text-sm">
            Aucune activité récente
          </div>

          <div v-else class="space-y-0">
            <div
              v-for="(workout, index) in recentWorkouts"
              :key="workout.id"
              class="flex gap-4 cursor-pointer group"
              @click="navigateTo(`/workouts/${workout.id}`)"
            >
              <!-- Timeline line + dot -->
              <div class="flex flex-col items-center">
                <div class="w-3 h-3 rounded-full bg-gradient-primary flex-shrink-0 mt-1.5 group-hover:scale-125 transition-transform"></div>
                <div v-if="index < recentWorkouts.length - 1" class="w-0.5 flex-1 bg-primary-200 dark:bg-primary-700 my-1"></div>
              </div>

              <!-- Content -->
              <div :class="['flex-1 pb-6', index < recentWorkouts.length - 1 ? '' : 'pb-0']">
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
      </template>
    </div>

    <!-- Mobile Bottom Navigation -->
    <div class="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white/90 dark:bg-primary-900/90 backdrop-blur-md border-t border-primary-200 dark:border-primary-700">
      <div class="flex items-center justify-around py-2">
        <button @click="navigateTo('/dashboard')" class="flex flex-col items-center p-2 text-primary-600 dark:text-primary-400">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
          <span class="text-xs mt-1">Accueil</span>
        </button>

        <button @click="navigateTo('/calendar')" class="flex flex-col items-center p-2 text-primary-900 dark:text-primary-100">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          <span class="text-xs mt-1 font-medium">Activité</span>
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
import type { Workout } from '~/types/workout'

const authStore = useAuthStore()
const workoutStore = useWorkoutStore()

onMounted(async () => {
  authStore.loadFromLocalStorage()
  if (!authStore.isAuthenticated) {
    navigateTo('/login')
    return
  }
  if (!workoutStore.workouts.length) {
    await workoutStore.fetchWorkouts()
  }
})

// Completed workouts sorted by date desc
const completedWorkouts = computed(() =>
  workoutStore.workouts
    .filter(w => w.completedAt)
    .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
)

// Recent 10 workouts for timeline
const recentWorkouts = computed(() => completedWorkouts.value.slice(0, 10))

// Streak calculation
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

// This week count
const workoutsThisWeek = computed(() => {
  const now = new Date()
  const dayOfWeek = now.getDay()
  const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  const monday = new Date(now)
  monday.setHours(0, 0, 0, 0)
  monday.setDate(now.getDate() - mondayOffset)

  return completedWorkouts.value.filter(w => new Date(w.completedAt!) >= monday).length
})

// This month count
const workoutsThisMonth = computed(() => {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  return completedWorkouts.value.filter(w => new Date(w.completedAt!) >= startOfMonth).length
})

// Total
const totalWorkouts = computed(() => completedWorkouts.value.length)

// Calories estimation: ~6 kcal/min for moderate weight training
const estimateCalories = (seconds: number) => Math.round((seconds / 60) * 6)

// Monthly calories
const monthlyCalories = computed(() => {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const totalSeconds = completedWorkouts.value
    .filter(w => new Date(w.completedAt!) >= startOfMonth)
    .reduce((sum, w) => sum + (w.duration || 0), 0)
  return estimateCalories(totalSeconds)
})

// Week-over-week comparison
const weekStats = computed(() => {
  const now = new Date()
  const dayOfWeek = now.getDay()
  const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1

  const currentWeekStart = new Date(now)
  currentWeekStart.setHours(0, 0, 0, 0)
  currentWeekStart.setDate(now.getDate() - mondayOffset)

  const previousWeekStart = new Date(currentWeekStart)
  previousWeekStart.setDate(currentWeekStart.getDate() - 7)

  const currentWeek = completedWorkouts.value.filter(w => {
    const d = new Date(w.completedAt!)
    return d >= currentWeekStart && d <= now
  })

  const previousWeek = completedWorkouts.value.filter(w => {
    const d = new Date(w.completedAt!)
    return d >= previousWeekStart && d < currentWeekStart
  })

  const calc = (list: Workout[]) => ({
    workouts: list.length,
    volume: Math.round(list.reduce((s, w) => s + (w.totalVolume || 0), 0)),
    totalTime: Math.round(list.reduce((s, w) => s + (w.duration || 0), 0)),
    avgDuration: list.length > 0 ? Math.round(list.reduce((s, w) => s + (w.duration || 0), 0) / list.length) : 0
  })

  const current = calc(currentWeek)
  const previous = calc(previousWeek)

  const pctChange = (cur: number, prev: number): number | null => {
    if (prev === 0) return cur > 0 ? 100 : null
    return Math.round(((cur - prev) / prev) * 100)
  }

  return {
    current,
    previous,
    changes: {
      workouts: pctChange(current.workouts, previous.workouts),
      volume: pctChange(current.volume, previous.volume),
      totalTime: pctChange(current.totalTime, previous.totalTime),
      avgDuration: pctChange(current.avgDuration, previous.avgDuration)
    }
  }
})

// Favourite day of week
const favouriteDay = computed(() => {
  const dayCount = new Array(7).fill(0)
  completedWorkouts.value.forEach(w => {
    const day = new Date(w.completedAt!).getDay()
    dayCount[day]++
  })

  const maxCount = Math.max(...dayCount)
  if (maxCount === 0) return null

  const maxDayIndex = dayCount.indexOf(maxCount)
  const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
  const dayShorts = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']

  return {
    name: dayNames[maxDayIndex],
    short: dayShorts[maxDayIndex],
    count: maxCount
  }
})

// Formatters
const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`
}

const formatFullDate = (dateString: string) => {
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString))
}

definePageMeta({
  middleware: 'auth'
})
</script>
