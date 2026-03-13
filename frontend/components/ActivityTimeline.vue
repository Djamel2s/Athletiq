<template>
  <div class="card-glass">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl md:text-3xl font-bold text-primary-900 dark:text-primary-100">{{ title }}</h2>
      <button @click="navigateTo('/workouts')" class="text-sm text-primary-500 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-200 font-semibold transition-colors">
        Voir tout →
      </button>
    </div>

    <div v-if="workouts.length === 0" class="text-center py-8">
      <p class="text-primary-500 dark:text-primary-400 text-lg mb-4">{{ emptyMessage }}</p>
      <button v-if="showCreateButton" @click="navigateTo('/workouts/builder')" class="btn-primary">
        Créer mon premier entraînement
      </button>
    </div>

    <div v-else class="space-y-0">
      <div
        v-for="(workout, index) in workouts"
        :key="workout.id"
        class="flex gap-4 cursor-pointer group"
        @click="navigateTo(`/workouts/${workout.id}`)"
      >
        <!-- Timeline line + dot -->
        <div class="flex flex-col items-center">
          <div class="w-3 h-3 rounded-full bg-gradient-primary flex-shrink-0 mt-1.5 group-hover:scale-125 transition-transform"></div>
          <div v-if="index < workouts.length - 1" class="w-0.5 flex-1 bg-primary-200 dark:bg-primary-700 my-1"></div>
        </div>

        <!-- Content -->
        <div :class="['flex-1 pb-6', index < workouts.length - 1 ? '' : 'pb-0']">
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <p class="font-semibold text-primary-900 dark:text-primary-100 group-hover:text-sand-600 transition-colors truncate">{{ workout.name }}</p>
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

<script setup lang="ts">
import type { Workout } from '~/types/workout'

withDefaults(defineProps<{
  workouts: Workout[]
  title?: string
  emptyMessage?: string
  showCreateButton?: boolean
}>(), {
  title: 'Activité récente',
  emptyMessage: 'Aucune activité récente',
  showCreateButton: false
})

const estimateCalories = (seconds: number) => Math.round((seconds / 60) * 6)

const formatFullDate = (dateString: string) => {
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString))
}

const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`
}
</script>
