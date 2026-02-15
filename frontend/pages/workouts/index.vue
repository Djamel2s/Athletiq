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
              <h1 class="text-2xl font-bold text-display bg-gradient-to-l from-[#d4c4b0] to-[#9d8569] bg-clip-text text-transparent">Mes Entraînements</h1>
            </div>
          </div>

          <div class="flex items-center space-x-4">
            <button @click="navigateTo('/workouts/builder')" class="btn-primary">
              + Créer un workout
            </button>
            <button @click="navigateTo('/dashboard')" class="btn-outline">
              Retour
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Contenu principal -->
    <div class="pt-32 px-6 pb-20 max-w-7xl mx-auto">
      <!-- Workout actif -->
      <div v-if="workoutStore.activeWorkout" class="mb-8 fade-in">
        <div class="card-glass border-2 border-primary-500">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h2 class="text-2xl font-bold text-primary-900 mb-2">Entraînement en cours</h2>
              <p class="text-lg font-semibold text-primary-700">{{ workoutStore.activeWorkout.name }}</p>
            </div>
            <button @click="continueWorkout(workoutStore.activeWorkout.id)" class="btn-primary">
              Continuer
            </button>
          </div>
          <p class="text-sm text-primary-600">
            Commencé {{ formatDate(workoutStore.activeWorkout.startedAt!) }}
          </p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="mb-8 slide-up">
        <div class="flex space-x-4 border-b border-primary-200">
          <button
            @click="activeTab = 'workouts'"
            :class="[
              'px-6 py-3 font-semibold transition-colors',
              activeTab === 'workouts'
                ? 'text-primary-900 border-b-2 border-primary-600'
                : 'text-primary-500 hover:text-primary-700'
            ]"
          >
            Mes workouts
          </button>
          <button
            @click="activeTab = 'history'"
            :class="[
              'px-6 py-3 font-semibold transition-colors',
              activeTab === 'history'
                ? 'text-primary-900 border-b-2 border-primary-600'
                : 'text-primary-500 hover:text-primary-700'
            ]"
          >
            Historique
          </button>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="workoutStore.isLoading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
        <p class="mt-4 text-primary-600">Chargement...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="workoutStore.error" class="card-glass border-l-4 border-red-500 bg-red-50">
        <p class="text-red-700">{{ workoutStore.error }}</p>
        <button @click="loadWorkouts" class="btn-outline mt-4">Réessayer</button>
      </div>

      <!-- Mes workouts -->
      <div v-else-if="activeTab === 'workouts'" class="space-y-6 slide-up">
        <div v-if="workoutStore.templates.length === 0" class="card-glass text-center py-12">
          <p class="text-primary-500 text-lg mb-4">Aucun workout créé</p>
          <button @click="navigateTo('/workouts/builder')" class="btn-primary">
            Créer mon premier workout
          </button>
        </div>

        <div
          v-for="workout in workoutStore.templates"
          :key="workout.id"
          class="card-glass hover:shadow-xl transition-all group"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h3 class="text-xl font-bold text-primary-900 mb-2">
                {{ workout.name }}
              </h3>

              <p v-if="workout.description" class="text-primary-600 mb-3">{{ workout.description }}</p>

              <div class="flex flex-wrap gap-4 text-sm text-primary-600">
                <span v-if="workout.exercises?.length" class="flex items-center space-x-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                  </svg>
                  <span>{{ workout.exercises.length }} exercices</span>
                </span>
              </div>
            </div>

            <div class="flex space-x-2 ml-4">
              <button
                @click="editWorkout(workout.id)"
                class="btn-outline"
                title="Modifier"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
              </button>
              <button
                @click="deleteTemplate(workout.id)"
                class="btn-outline text-red-600 hover:bg-red-50"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Historique -->
      <div v-else-if="activeTab === 'history'" class="space-y-6 slide-up">
        <div v-if="workoutStore.workoutHistory.length === 0" class="card-glass text-center py-12">
          <p class="text-primary-500 text-lg mb-4">Aucun entraînement terminé</p>
          <button @click="navigateTo('/workouts/builder')" class="btn-primary">
            Créer mon premier workout
          </button>
        </div>

        <div
          v-for="workout in workoutStore.workoutHistory"
          :key="workout.id"
          class="card-glass hover:shadow-xl transition-all cursor-pointer group"
          @click="viewWorkout(workout.id)"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h3 class="text-xl font-bold text-primary-900 mb-2 group-hover:text-primary-700 transition-colors">
                {{ workout.name }}
              </h3>
              <p v-if="workout.description" class="text-primary-600 mb-3">{{ workout.description }}</p>

              <div class="flex flex-wrap gap-4 text-sm text-primary-600">
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

            <div class="flex space-x-2 ml-4">
              <button
                @click.stop="startFromHistory(workout)"
                class="btn-outline"
              >
                Refaire
              </button>
              <button
                @click.stop="deleteFromHistory(workout.id)"
                class="btn-outline text-red-600 hover:bg-red-50"
                title="Supprimer"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
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
import type { Workout } from '~/types/workout'

const workoutStore = useWorkoutStore()
const authStore = useAuthStore()
const router = useRouter()

const activeTab = ref<'workouts' | 'history'>('workouts')

// Auth check
onMounted(() => {
  authStore.loadFromLocalStorage()
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }

  loadWorkouts()
})

const loadWorkouts = async () => {
  await workoutStore.fetchWorkouts()
}

const viewWorkout = (id: number) => {
  navigateTo(`/workouts/${id}`)
}

const continueWorkout = (id: number) => {
  navigateTo(`/workouts/${id}/live`)
}

const startFromHistory = async (workout: Workout) => {
  try {
    // Create a new workout based on the historical one
    const newWorkout = await workoutStore.createWorkout({
      name: workout.name,
      description: workout.description,
      isTemplate: false  // Session instance, not a template
    })

    // Copy exercises from the historical workout
    if (workout.exercises) {
      for (const exercise of workout.exercises) {
        await workoutStore.addExerciseToWorkout(newWorkout.id, {
          exerciseLibraryId: exercise.exerciseLibraryId!,
          name: exercise.name,
          notes: exercise.notes,
          targetSets: exercise.targetSets,
          targetReps: exercise.targetReps,
          targetWeight: exercise.targetWeight,
          restTime: exercise.restTime,  // ✅ Copier le temps de repos
          plannedSets: exercise.plannedSets,  // ✅ Copier les séries personnalisées
          orderIndex: exercise.orderIndex
        })
      }
    }

    // Start and navigate to the new workout
    await workoutStore.startWorkout(newWorkout.id)
    navigateTo(`/workouts/${newWorkout.id}/live`)
  } catch (error) {
    console.error('Failed to create workout from history:', error)
  }
}

const editWorkout = (id: number) => {
  navigateTo(`/workouts/${id}/edit`)
}

const deleteTemplate = async (id: number) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce template ?')) {
    try {
      await workoutStore.deleteWorkout(id)
    } catch (error) {
      console.error('Failed to delete template:', error)
    }
  }
}

const deleteFromHistory = async (id: number) => {
  if (confirm('Supprimer cet entraînement de l\'historique ?')) {
    try {
      await workoutStore.deleteWorkout(id)
    } catch (error) {
      console.error('Failed to delete workout from history:', error)
    }
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
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
