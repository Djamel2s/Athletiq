<template>
  <div class="card-glass !p-6 space-y-4">
    <!-- Header -->
    <div class="flex items-start justify-between">
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-2">
          <span :class="typeBadgeClass" class="px-2.5 py-0.5 rounded-lg text-xs font-semibold">
            {{ typeLabel }}
          </span>
          <span v-if="goal.achieved" class="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            Atteint
          </span>
        </div>
        <h4 class="font-bold text-primary-900 dark:text-primary-100 truncate">{{ goal.title }}</h4>
      </div>
      <button
        @click="$emit('delete', goal.id)"
        class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 text-primary-400 hover:text-red-500 transition-colors flex-shrink-0 ml-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
        </svg>
      </button>
    </div>

    <!-- Progress Bar -->
    <div>
      <div class="flex justify-between text-sm mb-2">
        <span class="text-primary-600 dark:text-primary-400">{{ formattedCurrent }}</span>
        <span class="font-semibold text-primary-900 dark:text-primary-100">{{ formattedTarget }}</span>
      </div>
      <div class="w-full h-3 bg-primary-200 dark:bg-primary-700 rounded-full overflow-hidden">
        <div
          class="h-full rounded-full transition-all duration-500"
          :class="goal.achieved ? 'bg-gradient-to-r from-green-400 to-green-500' : 'bg-gradient-to-r from-[#d4c4b0] to-[#b8a48f]'"
          :style="{ width: `${Math.min(goal.progress, 100)}%` }"
        ></div>
      </div>
      <p class="text-xs text-primary-500 dark:text-primary-400 mt-1 text-right">{{ goal.progress }}%</p>
    </div>

    <!-- Deadline -->
    <div v-if="goal.deadline" class="flex items-center gap-1.5 text-sm text-primary-500 dark:text-primary-400">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
      </svg>
      <span>{{ formattedDeadline }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UserGoal } from '~/types/goals'
import { GoalType } from '~/types/goals'

interface Props {
  goal: UserGoal
}

const props = defineProps<Props>()

defineEmits<{
  delete: [id: number]
}>()

const typeLabel = computed(() => {
  switch (props.goal.type) {
    case GoalType.WEIGHT: return 'Poids'
    case GoalType.PR: return 'PR'
    case GoalType.BODY_FAT: return 'Body Fat'
    default: return props.goal.type
  }
})

const typeBadgeClass = computed(() => {
  switch (props.goal.type) {
    case GoalType.WEIGHT: return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
    case GoalType.PR: return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
    case GoalType.BODY_FAT: return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
    default: return 'bg-primary-100 text-primary-700 dark:bg-primary-800 dark:text-primary-300'
  }
})

const formatValue = (value: number, type: GoalType) => {
  switch (type) {
    case GoalType.WEIGHT: return `${value} kg`
    case GoalType.PR: return `${value} kg`
    case GoalType.BODY_FAT: return `${value}%`
    default: return `${value}`
  }
}

const formattedCurrent = computed(() => formatValue(props.goal.currentValue, props.goal.type as GoalType))
const formattedTarget = computed(() => formatValue(props.goal.targetValue, props.goal.type as GoalType))

const formattedDeadline = computed(() => {
  if (!props.goal.deadline) return ''
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(props.goal.deadline))
})
</script>
