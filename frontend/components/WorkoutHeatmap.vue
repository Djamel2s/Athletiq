<template>
  <div class="card-glass cursor-pointer hover:shadow-2xl transition-all" @click="$emit('click')">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h3 class="text-2xl font-semibold text-primary-900 mb-1">Suivi d'activité</h3>
        <p class="text-sm text-primary-600">{{ workoutsThisWeek }} entraînement{{ workoutsThisWeek > 1 ? 's' : '' }} cette semaine</p>
      </div>
      <svg class="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
      </svg>
    </div>

    <!-- Heatmap des 7 derniers jours -->
    <div class="space-y-3">
      <div class="flex justify-between items-center">
        <span class="text-xs text-primary-500 font-medium">7 derniers jours</span>
        <span class="text-xs text-primary-500">Aujourd'hui</span>
      </div>
      <div class="grid grid-cols-7 gap-2">
        <div
          v-for="(day, index) in last7Days"
          :key="index"
          class="aspect-square rounded-lg transition-all relative group"
          :class="day.hasWorkout ? 'bg-gradient-primary shadow-sm' : 'bg-primary-100'"
        >
          <!-- Tooltip au hover -->
          <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-primary-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
            {{ day.label }}
            <div class="text-primary-300">{{ day.hasWorkout ? '✓ Entraînement' : 'Repos' }}</div>
          </div>
        </div>
      </div>
      <div class="flex justify-between text-xs text-primary-500">
        <span>{{ last7Days[0]?.dayName }}</span>
        <span>{{ last7Days[6]?.dayName }}</span>
      </div>
    </div>

    <!-- Stats rapides -->
    <div class="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-primary-200">
      <div class="text-center">
        <p class="text-2xl font-bold text-primary-900">{{ currentStreak }}</p>
        <p class="text-xs text-primary-600">Série</p>
      </div>
      <div class="text-center">
        <p class="text-2xl font-bold text-primary-900">{{ workoutsThisMonth }}</p>
        <p class="text-xs text-primary-600">Ce mois</p>
      </div>
      <div class="text-center">
        <p class="text-2xl font-bold text-primary-900">{{ totalWorkouts }}</p>
        <p class="text-xs text-primary-600">Total</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Workout {
  id: number
  completedAt?: string
  startedAt?: string
}

interface Props {
  workouts: Workout[]
}

const props = defineProps<Props>()
defineEmits(['click'])

// Calculer les 7 derniers jours
const last7Days = computed(() => {
  const days = []
  const today = new Date()

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    date.setHours(0, 0, 0, 0)

    const hasWorkout = props.workouts.some(w => {
      if (!w.completedAt) return false
      const workoutDate = new Date(w.completedAt)
      workoutDate.setHours(0, 0, 0, 0)
      return workoutDate.getTime() === date.getTime()
    })

    days.push({
      date,
      hasWorkout,
      label: new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric',
        month: 'short'
      }).format(date),
      dayName: new Intl.DateTimeFormat('fr-FR', {
        weekday: 'short'
      }).format(date)
    })
  }

  return days
})

// Nombre d'entraînements cette semaine
const workoutsThisWeek = computed(() => {
  return last7Days.value.filter(d => d.hasWorkout).length
})

// Nombre d'entraînements ce mois
const workoutsThisMonth = computed(() => {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  return props.workouts.filter(w => {
    if (!w.completedAt) return false
    const workoutDate = new Date(w.completedAt)
    return workoutDate >= startOfMonth && workoutDate <= now
  }).length
})

// Total d'entraînements
const totalWorkouts = computed(() => {
  return props.workouts.filter(w => w.completedAt).length
})

// Série actuelle
const currentStreak = computed(() => {
  const sortedWorkouts = [...props.workouts]
    .filter(w => w.completedAt)
    .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())

  if (sortedWorkouts.length === 0) return 0

  let streak = 0
  let currentDate = new Date()
  currentDate.setHours(0, 0, 0, 0)

  const workoutDates = new Set(
    sortedWorkouts.map(w => {
      const d = new Date(w.completedAt!)
      d.setHours(0, 0, 0, 0)
      return d.getTime()
    })
  )

  const today = currentDate.getTime()
  const yesterday = currentDate.getTime() - 24 * 60 * 60 * 1000

  if (!workoutDates.has(today) && !workoutDates.has(yesterday)) {
    return 0
  }

  let checkDate = workoutDates.has(today) ? today : yesterday

  while (workoutDates.has(checkDate)) {
    streak++
    checkDate -= 24 * 60 * 60 * 1000
  }

  return streak
})
</script>
