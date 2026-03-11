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
              <span class="text-2xl text-[#d4c4b0] font-light hidden md:inline">|</span>
              <h1 class="text-lg md:text-2xl font-bold text-display bg-gradient-to-r from-[#d4c4b0] to-white dark:to-primary-100 bg-clip-text text-transparent truncate max-w-[200px] md:max-w-none">
                {{ workout?.name || 'Détail' }}
              </h1>
            </div>
          </div>

          <NavActions />
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="pt-24 md:pt-32 px-4 md:px-6 pb-28 lg:pb-20 max-w-4xl mx-auto">
      <!-- Loading -->
      <div v-if="loading" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary-300 dark:border-primary-600 border-t-primary-600 dark:border-t-primary-400"></div>
        <p class="mt-4 text-primary-600 dark:text-primary-400 text-lg">Chargement...</p>
      </div>

      <!-- Error -->
      <div v-else-if="!workout" class="text-center py-20">
        <p class="text-primary-500 dark:text-primary-400 text-lg mb-4">Entraînement introuvable</p>
        <button @click="navigateTo('/workouts')" class="btn-primary">Retour aux workouts</button>
      </div>

      <template v-else>
        <!-- Header Card -->
        <div class="card-glass mb-6 fade-in">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 class="text-2xl md:text-3xl font-bold text-primary-900 dark:text-primary-100">{{ workout.name }}</h2>
              <p v-if="workout.description" class="text-primary-600 dark:text-primary-400 mt-1">{{ workout.description }}</p>
            </div>
            <div class="flex gap-3">
              <button
                v-if="workout.completedAt"
                @click="navigateTo(`/workouts/${workout.id}/live`)"
                class="btn-primary text-sm"
              >
                Refaire
              </button>
              <button
                v-else
                @click="navigateTo(`/workouts/${workout.id}/live`)"
                class="btn-primary text-sm"
              >
                Lancer
              </button>
            </div>
          </div>

          <!-- Stats Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div v-if="workout.completedAt" class="text-center p-3 bg-primary-50 dark:bg-primary-800/50 rounded-xl">
              <p class="text-xs text-primary-500 dark:text-primary-400 mb-1">Date</p>
              <p class="text-sm font-bold text-primary-900 dark:text-primary-100">{{ formatDate(workout.completedAt) }}</p>
            </div>
            <div v-if="workout.duration" class="text-center p-3 bg-primary-50 dark:bg-primary-800/50 rounded-xl">
              <p class="text-xs text-primary-500 dark:text-primary-400 mb-1">Durée</p>
              <p class="text-sm font-bold text-primary-900 dark:text-primary-100">{{ formatDuration(workout.duration) }}</p>
            </div>
            <div v-if="workout.duration" class="text-center p-3 bg-primary-50 dark:bg-primary-800/50 rounded-xl">
              <p class="text-xs text-primary-500 dark:text-primary-400 mb-1">Calories</p>
              <p class="text-sm font-bold text-primary-900 dark:text-primary-100">{{ estimateCalories(workout.duration) }} kcal</p>
            </div>
            <div class="text-center p-3 bg-primary-50 dark:bg-primary-800/50 rounded-xl">
              <p class="text-xs text-primary-500 dark:text-primary-400 mb-1">Exercices</p>
              <p class="text-sm font-bold text-primary-900 dark:text-primary-100">{{ workout.exercises?.length || 0 }}</p>
            </div>
            <div v-if="totalVolume > 0" class="text-center p-3 bg-primary-50 dark:bg-primary-800/50 rounded-xl">
              <p class="text-xs text-primary-500 dark:text-primary-400 mb-1">Volume total</p>
              <p class="text-sm font-bold text-primary-900 dark:text-primary-100">{{ totalVolume.toLocaleString('fr-FR') }} kg</p>
            </div>
          </div>
        </div>

        <!-- Exercises -->
        <div class="space-y-4 slide-up">
          <div
            v-for="exercise in sortedExercises"
            :key="exercise.id"
            class="card-glass"
          >
            <div class="flex items-start justify-between gap-3 mb-4">
              <div>
                <h3 class="text-lg font-bold text-primary-900 dark:text-primary-100">
                  {{ exercise.exerciseLibrary?.name || exercise.name }}
                </h3>
                <div class="flex flex-wrap gap-2 mt-1">
                  <span v-if="exercise.exerciseLibrary?.primaryMuscle" class="px-2 py-0.5 bg-primary-100 dark:bg-primary-800 rounded-full text-xs text-primary-600 dark:text-primary-400">
                    {{ formatMuscle(exercise.exerciseLibrary.primaryMuscle) }}
                  </span>
                  <span v-if="exercise.exerciseLibrary?.equipment" class="px-2 py-0.5 bg-primary-100 dark:bg-primary-800 rounded-full text-xs text-primary-600 dark:text-primary-400">
                    {{ formatEquipment(exercise.exerciseLibrary.equipment) }}
                  </span>
                </div>
              </div>
              <span v-if="exercise.sets?.length" class="text-xs text-primary-500 dark:text-primary-400 flex-shrink-0">
                {{ exercise.sets.length }} série{{ exercise.sets.length > 1 ? 's' : '' }}
              </span>
            </div>

            <!-- Sets Table -->
            <div v-if="exercise.sets?.length" class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="text-primary-500 dark:text-primary-400 text-xs">
                    <th class="text-left py-2 pr-3">Série</th>
                    <th class="text-right py-2 px-3">Poids</th>
                    <th class="text-right py-2 px-3">Reps</th>
                    <th v-if="hasDuration(exercise)" class="text-right py-2 px-3">Durée</th>
                    <th v-if="hasRpe(exercise)" class="text-right py-2 pl-3">RPE</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="set in sortedSets(exercise)"
                    :key="set.id"
                    class="border-t border-primary-100 dark:border-primary-800"
                  >
                    <td class="py-2 pr-3 font-medium text-primary-900 dark:text-primary-100">{{ set.setNumber }}</td>
                    <td class="text-right py-2 px-3 text-primary-700 dark:text-primary-300">{{ set.weight ? `${set.weight} kg` : '—' }}</td>
                    <td class="text-right py-2 px-3 text-primary-700 dark:text-primary-300">{{ set.reps ?? '—' }}</td>
                    <td v-if="hasDuration(exercise)" class="text-right py-2 px-3 text-primary-700 dark:text-primary-300">{{ set.duration ? `${set.duration}s` : '—' }}</td>
                    <td v-if="hasRpe(exercise)" class="text-right py-2 pl-3 text-primary-700 dark:text-primary-300">{{ set.rpe ?? '—' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Planned sets if no actual sets -->
            <div v-else-if="exercise.targetSets" class="text-sm text-primary-500 dark:text-primary-400">
              {{ exercise.targetSets }} séries × {{ exercise.targetReps }} reps {{ exercise.targetWeight ? `@ ${exercise.targetWeight} kg` : '' }}
            </div>

            <p v-if="exercise.notes" class="mt-3 text-sm text-primary-500 dark:text-primary-400 italic">{{ exercise.notes }}</p>
          </div>
        </div>
      </template>
    </div>

    <MobileBottomNav active-path="/workouts" />
  </div>
</template>

<script setup lang="ts">
import { useWorkoutStore } from '~/stores/workout'
import { useAuthStore } from '~/stores/auth'
import type { Exercise, Set } from '~/types/workout'

useHead({ meta: [{ name: 'robots', content: 'noindex, nofollow' }] })

const route = useRoute()
const workoutStore = useWorkoutStore()
const authStore = useAuthStore()
const loading = ref(true)

const workout = computed(() => workoutStore.currentWorkout)

onMounted(async () => {
  authStore.loadFromLocalStorage()
  if (!authStore.isAuthenticated) {
    navigateTo('/login')
    return
  }

  const id = Number(route.params.id)
  if (isNaN(id)) {
    navigateTo('/workouts')
    return
  }

  try {
    await workoutStore.fetchWorkout(id)
  } catch {
    // workout stays null, error state shown
  } finally {
    loading.value = false
  }
})

const sortedExercises = computed(() =>
  [...(workout.value?.exercises || [])].sort((a, b) => a.orderIndex - b.orderIndex)
)

const totalVolume = computed(() => {
  if (workout.value?.totalVolume) return workout.value.totalVolume
  let vol = 0
  for (const ex of workout.value?.exercises || []) {
    for (const set of ex.sets || []) {
      vol += (set.weight || 0) * (set.reps || 0)
    }
  }
  return Math.round(vol)
})

const sortedSets = (exercise: Exercise) =>
  [...(exercise.sets || [])].sort((a, b) => a.setNumber - b.setNumber)

const hasDuration = (exercise: Exercise) =>
  exercise.sets?.some(s => s.duration)

const hasRpe = (exercise: Exercise) =>
  exercise.sets?.some(s => s.rpe)

const estimateCalories = (seconds: number) => Math.round((seconds / 60) * 6)

const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`
}

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date(dateString))
}

const muscleLabels: Record<string, string> = {
  CHEST: 'Pectoraux', BACK: 'Dos', SHOULDERS: 'Épaules', LEGS: 'Jambes',
  QUADS: 'Quadriceps', HAMSTRINGS: 'Ischio-jambiers', GLUTES: 'Fessiers',
  CALVES: 'Mollets', BICEPS: 'Biceps', TRICEPS: 'Triceps', ABS: 'Abdos', CARDIO: 'Cardio'
}

const equipmentLabels: Record<string, string> = {
  BARBELL: 'Barre', DUMBBELL: 'Haltères', CABLE: 'Câble', MACHINE: 'Machine',
  BODYWEIGHT: 'Poids du corps', RESISTANCE_BAND: 'Élastique', OTHER: 'Autre'
}

const formatMuscle = (muscle: string) => muscleLabels[muscle] || muscle
const formatEquipment = (eq: string) => equipmentLabels[eq] || eq

definePageMeta({
  middleware: 'auth'
})
</script>
