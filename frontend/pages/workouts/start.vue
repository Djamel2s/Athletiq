<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900">
    <!-- Header -->
    <nav class="fixed top-0 left-0 right-0 z-50 bg-primary-900 bg-opacity-95 backdrop-blur-lg border-b border-primary-700">
      <div class="max-w-7xl mx-auto px-6 py-5">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <button @click="navigateTo('/dashboard')" class="text-white hover:text-primary-300">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <h1 class="text-2xl font-bold text-white">Lancer un entrainement</h1>
          </div>
        </div>
      </div>
    </nav>

    <!-- Content -->
    <div class="pt-28 px-6 pb-20 max-w-5xl mx-auto">
      <!-- Loading -->
      <div v-if="workoutStore.isLoading" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary-300 border-t-white"></div>
        <p class="mt-4 text-white text-lg">Chargement...</p>
      </div>

      <!-- No workouts -->
      <div v-else-if="availableWorkouts.length === 0" class="text-center py-20">
        <div class="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-12 max-w-md mx-auto">
          <svg class="w-20 h-20 text-white mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
          <h2 class="text-2xl font-bold text-white mb-4">Aucun workout disponible</h2>
          <p class="text-primary-200 mb-6">Crée d'abord des workouts chez toi avant de venir à la salle!</p>
          <button @click="navigateTo('/workouts/builder')" class="btn-primary w-full">
            Créer un workout
          </button>
        </div>
      </div>

      <!-- Workouts list -->
      <div v-else class="space-y-4">
        <div
          v-for="workout in availableWorkouts"
          :key="workout.id"
          @click="launchWorkout(workout)"
          class="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 hover:bg-opacity-20 hover:scale-[1.02] transition-all border border-white border-opacity-20 cursor-pointer"
        >
          <div class="flex items-center space-x-3 mb-3">
            <h2 class="text-2xl font-bold text-white">{{ workout.name }}</h2>
            <span v-if="workout.isTemplate" class="px-3 py-1 bg-primary-400 bg-opacity-30 text-white text-xs font-semibold rounded-full">
              TEMPLATE
            </span>
          </div>

          <p v-if="workout.description" class="text-primary-200 mb-4">
            {{ workout.description }}
          </p>

          <!-- Exercise preview -->
          <div v-if="workout.exercises && workout.exercises.length > 0" class="flex flex-wrap gap-2 mb-4">
            <div
              v-for="exercise in workout.exercises.slice(0, 5)"
              :key="exercise.id"
              class="px-3 py-1 bg-white bg-opacity-20 text-white text-sm rounded-lg"
            >
              {{ exercise.exerciseLibrary?.name || exercise.name }}
            </div>
            <div v-if="workout.exercises.length > 5" class="px-3 py-1 bg-white bg-opacity-20 text-white text-sm rounded-lg">
              +{{ workout.exercises.length - 5 }} autres
            </div>
          </div>

          <!-- Stats -->
          <div class="flex flex-wrap gap-4 text-sm text-primary-200">
            <span v-if="workout.exercises?.length" class="flex items-center space-x-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
              <span>{{ workout.exercises.length }} exercices</span>
            </span>

            <span v-if="getEstimatedDuration(workout)" class="flex items-center space-x-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>~{{ getEstimatedDuration(workout) }} min</span>
            </span>
          </div>
        </div>
      </div>

      <!-- Quick action: create new -->
      <div class="mt-8 text-center">
        <button
          @click="navigateTo('/workouts/builder')"
          class="text-white hover:text-primary-300 font-semibold flex items-center space-x-2 mx-auto"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          <span>Créer un nouveau workout</span>
        </button>
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
          restTime: exercise.restTime,  // ✅ Copier le temps de repos
          plannedSets: exercise.plannedSets,  // ✅ Copier les séries personnalisées
          orderIndex: exercise.orderIndex
        }
        console.log('Adding exercise:', exerciseData)
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
