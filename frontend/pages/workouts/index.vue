<template>
  <div class="min-h-screen">
    <!-- Navigation -->
    <nav class="fixed top-0 left-0 right-0 z-50 nav-blur">
      <div class="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-5">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2 md:space-x-4">
            <NuxtLink to="/dashboard">
              <img src="/athletiq-icon.svg" alt="Athletiq" class="h-10 md:h-14 w-auto transition-transform duration-300 hover:scale-105" />
            </NuxtLink>
            <div class="flex items-center space-x-2 md:space-x-3">
              <span class="text-2xl text-[#d4c4b0] font-light hidden md:inline">|</span>
              <h1 class="text-lg md:text-2xl font-bold text-display bg-gradient-to-r from-[#d4c4b0] to-white dark:to-primary-100 bg-clip-text text-transparent">Mes Entraînements</h1>
            </div>
          </div>

          <div class="flex items-center space-x-2 md:space-x-4">
            <div v-if="!isPremium" class="hidden md:block text-xs text-primary-500 dark:text-primary-400">
              Templates : {{ templateUsageText }}
            </div>
            <button @click="handleCreateWorkout" :disabled="!canCreateTemplate && !isPremium" class="btn-primary text-sm md:text-base disabled:opacity-50">
              <span class="hidden md:inline">+ Créer un workout</span>
              <span class="md:hidden">+ Créer</span>
            </button>
            <NavActions />
          </div>
        </div>
      </div>
    </nav>

    <!-- Contenu principal -->
    <div class="pt-24 md:pt-32 px-4 md:px-6 pb-28 lg:pb-20 max-w-7xl mx-auto">
      <!-- Tabs -->
      <div class="mb-8 slide-up">
        <div class="flex space-x-4 border-b border-primary-200 dark:border-primary-700">
          <button
            @click="activeTab = 'workouts'"
            :class="[
              'px-3 md:px-6 py-2 md:py-3 font-semibold transition-colors text-sm md:text-base',
              activeTab === 'workouts'
                ? 'text-primary-900 dark:text-primary-100 border-b-2 border-primary-600 dark:border-primary-400'
                : 'text-primary-500 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300'
            ]"
          >
            Mes workouts
          </button>
          <button
            @click="activeTab = 'history'"
            :class="[
              'px-3 md:px-6 py-2 md:py-3 font-semibold transition-colors text-sm md:text-base',
              activeTab === 'history'
                ? 'text-primary-900 dark:text-primary-100 border-b-2 border-primary-600 dark:border-primary-400'
                : 'text-primary-500 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300'
            ]"
          >
            Historique
          </button>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="workoutStore.isLoading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-200 dark:border-primary-700 border-t-primary-600 dark:border-t-primary-400"></div>
        <p class="mt-4 text-primary-600 dark:text-primary-400">Chargement...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="workoutStore.error" class="card-glass border-l-4 border-red-500 bg-red-50 dark:bg-red-900/30">
        <p class="text-red-700 dark:text-red-400">{{ workoutStore.error }}</p>
        <button @click="loadWorkouts" class="btn-outline mt-4">Réessayer</button>
      </div>

      <!-- Upgrade banner templates -->
      <div v-if="!isPremium && !canCreateTemplate && activeTab === 'workouts'" class="mb-6">
        <UpgradeBanner
          title="Limite de templates atteinte"
          :message="`Vous avez ${templateUsageText} templates. Passez Pro pour en créer autant que vous voulez.`"
        />
      </div>

      <!-- Mes workouts -->
      <div v-if="!workoutStore.isLoading && !workoutStore.error && activeTab === 'workouts'" class="slide-up">
        <div v-if="workoutStore.templates.length === 0" class="card-glass text-center py-16">
          <svg class="w-20 h-20 mx-auto mb-6 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
          <p class="text-xl text-primary-600 dark:text-primary-400 mb-6">Aucun workout créé</p>
          <button @click="navigateTo('/workouts/builder')" class="btn-primary px-8 py-4">
            Créer mon premier workout
          </button>
        </div>

        <!-- Grid de cartes -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <div
            v-for="workout in workoutStore.templates"
            :key="workout.id"
            class="card-glass hover:shadow-2xl hover:scale-[1.02] transition-all group cursor-pointer relative"
          >
            <!-- Contenu de la carte -->
            <div @click="editWorkout(workout.id)">
              <div class="flex items-center space-x-3 mb-4">
                <div class="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center icon-container">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                  </svg>
                </div>
                <h3 class="text-xl font-bold text-primary-900 dark:text-primary-100 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors flex-1">
                  {{ workout.name }}
                </h3>
              </div>

              <p v-if="workout.description" class="text-primary-600 dark:text-primary-400 mb-4 line-clamp-2">
                {{ workout.description }}
              </p>

              <div class="flex items-center space-x-2 text-sm text-primary-600 dark:text-primary-400 pt-4 border-t border-primary-200 dark:border-primary-700">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
                <span class="font-semibold">
                  {{ workout.exercises?.length || 0 }} exercice{{ (workout.exercises?.length || 0) > 1 ? 's' : '' }}
                </span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex space-x-2 mt-4 pt-4 border-t border-primary-200 dark:border-primary-700">
              <button
                @click.stop="editWorkout(workout.id)"
                class="btn-outline flex-1 text-sm"
                title="Modifier"
              >
                <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
                Modifier
              </button>
              <button
                @click.stop="deleteTemplate(workout.id)"
                :disabled="deletingId === workout.id"
                class="btn-outline text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 text-sm px-3 disabled:opacity-50"
                title="Supprimer"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Historique -->
      <div v-if="!workoutStore.isLoading && !workoutStore.error && activeTab === 'history'" class="space-y-6 slide-up">
        <div v-if="workoutStore.workoutHistory.length === 0" class="card-glass text-center py-16">
          <svg class="w-20 h-20 mx-auto mb-6 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p class="text-xl text-primary-600 dark:text-primary-400 mb-6">Aucun entraînement terminé</p>
          <button @click="navigateTo('/workouts/builder')" class="btn-primary px-8 py-4">
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
              <h3 class="text-xl font-bold text-primary-900 dark:text-primary-100 mb-2 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">
                {{ workout.name }}
              </h3>
              <p v-if="workout.description" class="text-primary-600 dark:text-primary-400 mb-3">{{ workout.description }}</p>

              <div class="flex flex-wrap gap-4 text-sm text-primary-600 dark:text-primary-400">
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

                <span v-if="workout.duration" class="flex items-center space-x-1 font-semibold text-primary-700 dark:text-primary-300">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"/>
                  </svg>
                  <span>{{ Math.round((workout.duration / 60) * 6) }} kcal</span>
                </span>
              </div>
            </div>

            <div class="flex space-x-2 ml-2 md:ml-4 flex-shrink-0">
              <button
                @click.stop="startFromHistory(workout)"
                class="btn-outline text-sm"
              >
                Refaire
              </button>
              <button
                @click.stop="deleteFromHistory(workout.id)"
                :disabled="deletingId === workout.id"
                class="btn-outline text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 disabled:opacity-50"
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

    <MobileBottomNav active-path="/workouts" />
  </div>
</template>

<script setup lang="ts">
import { useWorkoutStore } from '~/stores/workout'
import { useAuthStore } from '~/stores/auth'
import { useSubscriptionStore } from '~/stores/subscription'
import { useSubscriptionLimits } from '~/composables/useSubscriptionLimits'
import type { Workout } from '~/types/workout'

useHead({ meta: [{ name: 'robots', content: 'noindex, nofollow' }] })

const workoutStore = useWorkoutStore()
const authStore = useAuthStore()
const subscriptionStore = useSubscriptionStore()
const { isPremium, canCreateTemplate, templateUsageText, fetchUsage } = useSubscriptionLimits()
const toast = useToast()
const deletingId = ref<number | null>(null)

const activeTab = ref<'workouts' | 'history'>('workouts')

// Auth check
onMounted(async () => {
  authStore.loadFromLocalStorage()
  if (!authStore.isAuthenticated) {
    navigateTo('/login')
    return
  }

  loadWorkouts()
  await subscriptionStore.fetchSubscription()
  await fetchUsage()
})

const loadWorkouts = async () => {
  await workoutStore.fetchWorkouts()
}

const handleCreateWorkout = () => {
  if (!canCreateTemplate.value) {
    toast.error('Limite atteinte', 'Passez Pro pour créer plus de templates')
    return
  }
  navigateTo('/workouts/builder')
}

const viewWorkout = (id: number) => {
  navigateTo(`/workouts/${id}`)
}

const startFromHistory = async (workout: Workout) => {
  try {
    // Create a new workout based on the historical one
    const newWorkout = await workoutStore.createWorkout({
      name: workout.name,
      description: workout.description,
      isTemplate: false
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
          restTime: exercise.restTime,
          plannedSets: exercise.plannedSets,
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
  if (!confirm('Êtes-vous sûr de vouloir supprimer ce template ?')) return
  deletingId.value = id
  try {
    await workoutStore.deleteWorkout(id)
    toast.success('Supprimé', 'Template supprimé avec succès')
  } catch (error) {
    console.error('Failed to delete template:', error)
    toast.error('Erreur', 'Impossible de supprimer le template')
  } finally {
    deletingId.value = null
  }
}

const deleteFromHistory = async (id: number) => {
  if (!confirm('Supprimer cet entraînement de l\'historique ?')) return
  deletingId.value = id
  try {
    await workoutStore.deleteWorkout(id)
    toast.success('Supprimé', 'Entraînement supprimé de l\'historique')
  } catch (error) {
    console.error('Failed to delete workout from history:', error)
    toast.error('Erreur', 'Impossible de supprimer l\'entraînement')
  } finally {
    deletingId.value = null
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
