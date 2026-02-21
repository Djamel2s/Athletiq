<template>
  <div class="card-glass">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-xl md:text-2xl font-bold text-primary-900 dark:text-primary-100">Calendrier</h3>
      <div class="flex items-center gap-2">
        <button
          @click="prevMonth"
          class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors"
        >
          <svg class="w-4 h-4 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <span class="text-sm md:text-base font-semibold text-primary-800 dark:text-primary-200 min-w-[140px] text-center capitalize">
          {{ monthLabel }}
        </span>
        <button
          @click="nextMonth"
          class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors"
        >
          <svg class="w-4 h-4 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Weekday Headers -->
    <div class="grid grid-cols-7 gap-1 mb-2">
      <div
        v-for="day in weekDays"
        :key="day"
        class="text-center text-xs font-semibold text-primary-500 dark:text-primary-400 py-1"
      >
        {{ day }}
      </div>
    </div>

    <!-- Calendar Grid -->
    <div class="grid grid-cols-7 gap-1">
      <button
        v-for="(cell, index) in calendarDays"
        :key="index"
        @click="cell.isCurrentMonth ? selectDay(cell) : null"
        :disabled="!cell.isCurrentMonth"
        :class="[
          'relative flex flex-col items-center justify-center rounded-xl text-sm transition-all aspect-square',
          cell.isCurrentMonth
            ? 'cursor-pointer hover:bg-primary-100 dark:hover:bg-primary-800'
            : 'opacity-0 cursor-default',
          cell.isToday && !isSelected(cell)
            ? 'ring-2 ring-[#d4c4b0] dark:ring-[#b8a48f]'
            : '',
          isSelected(cell)
            ? 'bg-gradient-to-br from-[#d4c4b0] to-[#b8a48f] text-white shadow-sm'
            : 'text-primary-800 dark:text-primary-200'
        ]"
      >
        <span class="text-xs md:text-sm font-medium">{{ cell.day || '' }}</span>
        <!-- Workout indicator dot -->
        <span
          v-if="cell.workouts.length > 0 && !isSelected(cell)"
          class="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-[#d4c4b0] dark:bg-[#b8a48f]"
        ></span>
        <span
          v-if="cell.workouts.length > 0 && isSelected(cell)"
          class="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-white"
        ></span>
      </button>
    </div>

    <!-- Selected Day Detail Panel -->
    <Transition name="slide">
      <div v-if="selectedWorkouts.length > 0" class="mt-4 space-y-3">
        <div class="h-px bg-primary-200 dark:bg-primary-700"></div>
        <p class="text-sm font-semibold text-primary-600 dark:text-primary-400">
          {{ selectedDateLabel }}
        </p>
        <div
          v-for="workout in selectedWorkouts"
          :key="workout.id"
          class="flex items-center justify-between p-3 bg-primary-50 dark:bg-primary-800 rounded-xl cursor-pointer hover:bg-primary-100 dark:hover:bg-primary-700 transition-colors"
          @click="navigateTo(`/workouts/${workout.id}`)"
        >
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-9 h-9 bg-gradient-to-br from-[#d4c4b0] to-[#b8a48f] rounded-lg flex items-center justify-center flex-shrink-0">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h8M6 9v6m12-6v6M4.5 10v4m15-4v4"/>
              </svg>
            </div>
            <div class="min-w-0">
              <p class="font-semibold text-primary-900 dark:text-primary-100 text-sm truncate">{{ workout.name }}</p>
              <p class="text-xs text-primary-500 dark:text-primary-400">
                {{ workout.exercises?.length || 0 }} exercices
              </p>
            </div>
          </div>
          <div class="text-right flex-shrink-0 ml-2">
            <p v-if="workout.duration" class="text-sm font-medium text-primary-800 dark:text-primary-200">
              {{ formatDuration(workout.duration) }}
            </p>
            <p v-if="workout.duration" class="text-xs text-primary-500 dark:text-primary-400">
              {{ Math.round((workout.duration / 60) * 6) }} kcal
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { Workout } from '~/types/workout'

interface CalendarCell {
  day: number
  isToday: boolean
  isCurrentMonth: boolean
  dateKey: string
  workouts: Workout[]
}

interface Props {
  workouts: Workout[]
}

const props = defineProps<Props>()

const currentMonth = ref(new Date().getMonth())
const currentYear = ref(new Date().getFullYear())
const selectedDate = ref<string | null>(null)

const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

// Index workouts by date key for O(1) lookup
const workoutsByDate = computed(() => {
  const map: Record<string, Workout[]> = {}
  for (const w of props.workouts) {
    if (!w.completedAt) continue
    const dateKey = toDateKey(new Date(w.completedAt))
    if (!map[dateKey]) map[dateKey] = []
    map[dateKey].push(w)
  }
  return map
})

// Generate calendar grid
const calendarDays = computed((): CalendarCell[] => {
  const firstDay = new Date(currentYear.value, currentMonth.value, 1)
  const startOffset = (firstDay.getDay() + 6) % 7 // Monday-first
  const daysInMonth = new Date(currentYear.value, currentMonth.value + 1, 0).getDate()

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayKey = toDateKey(today)

  const cells: CalendarCell[] = []

  // Leading empty cells
  for (let i = 0; i < startOffset; i++) {
    cells.push({ day: 0, isToday: false, isCurrentMonth: false, dateKey: '', workouts: [] })
  }

  // Days of month
  for (let d = 1; d <= daysInMonth; d++) {
    const dateKey = `${currentYear.value}-${String(currentMonth.value + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    cells.push({
      day: d,
      isToday: dateKey === todayKey,
      isCurrentMonth: true,
      dateKey,
      workouts: workoutsByDate.value[dateKey] || []
    })
  }

  // Trailing empty cells to fill 6 rows
  while (cells.length < 42) {
    cells.push({ day: 0, isToday: false, isCurrentMonth: false, dateKey: '', workouts: [] })
  }

  return cells
})

const selectedWorkouts = computed(() => {
  if (!selectedDate.value) return []
  return workoutsByDate.value[selectedDate.value] || []
})

const monthLabel = computed(() => {
  return new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' })
    .format(new Date(currentYear.value, currentMonth.value, 1))
})

const selectedDateLabel = computed(() => {
  if (!selectedDate.value) return ''
  return new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
    .format(new Date(selectedDate.value + 'T00:00:00'))
})

const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
  selectedDate.value = null
}

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
  selectedDate.value = null
}

const selectDay = (cell: CalendarCell) => {
  if (!cell.isCurrentMonth) return
  selectedDate.value = selectedDate.value === cell.dateKey ? null : cell.dateKey
}

const isSelected = (cell: CalendarCell) => {
  return cell.isCurrentMonth && cell.dateKey === selectedDate.value
}

const toDateKey = (d: Date) => {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`
}
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
