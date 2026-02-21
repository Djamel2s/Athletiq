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
              <h1 class="text-2xl font-bold text-display bg-gradient-to-l from-[#d4c4b0] to-[#9d8569] bg-clip-text text-transparent">Lancer un entraînement</h1>
            </div>
          </div>

          <button @click="navigateTo('/dashboard')" class="btn-outline">
            Retour
          </button>
        </div>
      </div>
    </nav>

    <!-- Content -->
    <div class="pt-32 px-6 pb-20 max-w-7xl mx-auto">
      <!-- Loading -->
      <div v-if="workoutStore.isLoading" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary-200 dark:border-primary-700 border-t-primary-600 dark:border-t-primary-400"></div>
        <p class="mt-4 text-primary-600 dark:text-primary-400 text-lg">Chargement...</p>
      </div>

      <!-- No workouts -->
      <div v-else-if="availableWorkouts.length === 0" class="text-center py-20 fade-in">
        <div class="card-glass max-w-2xl mx-auto py-16">
          <svg class="w-24 h-24 mx-auto mb-6 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
          <h2 class="text-3xl font-bold text-primary-900 dark:text-primary-100 mb-4">Aucun workout disponible</h2>
          <p class="text-lg text-primary-600 dark:text-primary-400 mb-8">Crée d'abord des workouts avant de venir à la salle!</p>
          <button @click="navigateTo('/workouts/builder')" class="btn-primary px-8 py-4">
            Créer un workout
          </button>
        </div>
      </div>

      <!-- Workouts list -->
      <div v-else class="space-y-6">
        <!-- Header -->
        <div class="fade-in text-center mb-8">
          <h2 class="text-4xl md:text-5xl font-bold text-primary-900 dark:text-primary-100 mb-4 text-display">
            Choisis ton entraînement
          </h2>
          <p class="text-lg text-primary-600 dark:text-primary-400">
            Sélectionne un workout pour commencer ta séance
          </p>
        </div>

        <!-- Workouts Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 slide-up">
          <div
            v-for="workout in availableWorkouts"
            :key="workout.id"
            @click="launchWorkout(workout)"
            class="card-glass hover:shadow-2xl hover:scale-[1.02] transition-all cursor-pointer group"
          >
            <div class="flex items-center space-x-3 mb-4">
              <div class="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center icon-container">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <div class="flex-1">
                <h3 class="text-2xl font-bold text-primary-900 dark:text-primary-100 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">
                  {{ workout.name }}
                </h3>
              </div>
              <span v-if="workout.isTemplate" class="px-3 py-1 bg-primary-200 dark:bg-primary-700 text-primary-700 dark:text-primary-300 text-xs font-semibold rounded-full">
                TEMPLATE
              </span>
            </div>

            <p v-if="workout.description" class="text-primary-600 dark:text-primary-400 mb-4">
              {{ workout.description }}
            </p>

            <!-- Exercise preview -->
            <div v-if="workout.exercises && workout.exercises.length > 0" class="flex flex-wrap gap-2 mb-4">
              <div
                v-for="exercise in workout.exercises.slice(0, 5)"
                :key="exercise.id"
                class="px-3 py-1 bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-300 text-sm rounded-lg font-medium"
              >
                {{ exercise.exerciseLibrary?.name || exercise.name }}
              </div>
              <div v-if="workout.exercises.length > 5" class="px-3 py-1 bg-primary-200 dark:bg-primary-700 text-primary-700 dark:text-primary-300 text-sm rounded-lg font-medium">
                +{{ workout.exercises.length - 5 }} autres
              </div>
            </div>

            <!-- Stats -->
            <div class="flex flex-wrap gap-4 text-sm text-primary-600 dark:text-primary-400 pt-4 border-t border-primary-200 dark:border-primary-700">
              <span v-if="workout.exercises?.length" class="flex items-center space-x-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
                <span class="font-semibold">{{ workout.exercises.length }} exercices</span>
              </span>

              <span v-if="getEstimatedDuration(workout)" class="flex items-center space-x-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span class="font-semibold">~{{ getEstimatedDuration(workout) }} min</span>
              </span>
            </div>

            <!-- Action hint -->
            <div class="mt-4 pt-4 border-t border-primary-200 dark:border-primary-700">
              <div class="flex items-center justify-between text-sm">
                <span class="text-primary-500 dark:text-primary-400">Clique pour démarrer</span>
                <svg class="w-5 h-5 text-primary-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick action: create new -->
        <div class="text-center pt-8 slide-up">
          <button
            @click="navigateTo('/workouts/builder')"
            class="btn-outline inline-flex items-center space-x-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            <span>Créer un nouveau workout</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWorkoutStore } from '~/stores/workout'
import { useAuthStore } from '~/stores/auth'
import type { Workout } from '~/types/workout'

const workoutStore = useWorkoutStore()
const authStore = useAuthStore()
const router = useRouter()

// Auth check
onMounted(async () => {
  authStore.loadFromLocalStorage()
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }

  await workoutStore.fetchWorkouts()
})

// Only show templates (all workouts created in builder are templates)
const availableWorkouts = computed(() => {
  return workoutStore.workouts.filter(w => w.isTemplate === true)
})

const launchWorkout = async (workout: Workout) => {
  try {
    // Always create a new instance for the session (isTemplate: false)
    const workoutToStart = await workoutStore.createWorkout({
      name: workout.name,
      description: workout.description,
      isTemplate: false  // This is a session instance, not a reusable template
    })

    // Copy exercises
    if (workout.exercises) {
      for (const exercise of workout.exercises) {
        const exerciseData = {
          exerciseLibraryId: exercise.exerciseLibraryId!,
          name: exercise.name,
          notes: exercise.notes,
          targetSets: exercise.targetSets,
          targetReps: exercise.targetReps,
          targetWeight: exercise.targetWeight,
          restTime: exercise.restTime,
          plannedSets: exercise.plannedSets,
          orderIndex: exercise.orderIndex
        }
        await workoutStore.addExerciseToWorkout(workoutToStart.id, exerciseData)
      }
    }

    // Start the workout
    await workoutStore.startWorkout(workoutToStart.id)

    // Navigate to live session
    navigateTo(`/workouts/${workoutToStart.id}/live`)
  } catch (error) {
    console.error('Failed to launch workout:', error)
    alert('Erreur lors du lancement du workout')
  }
}

const getEstimatedDuration = (workout: Workout): number | null => {
  if (!workout.exercises || workout.exercises.length === 0) return null

  // Estimate: 3 sets per exercise, 1 min per set, 2 min rest between exercises
  const setsPerExercise = 3
  const timePerSet = 1 // minutes
  const restBetweenExercises = 2 // minutes

  const totalSets = workout.exercises.length * setsPerExercise
  const totalTime = (totalSets * timePerSet) + ((workout.exercises.length - 1) * restBetweenExercises)

  return Math.round(totalTime)
}

definePageMeta({
  middleware: 'auth'
})
</script>
