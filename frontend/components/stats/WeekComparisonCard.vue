<template>
  <div class="card-glass !p-6 text-center">
    <p class="text-sm text-primary-600 dark:text-primary-400 mb-2">{{ title }}</p>
    <p class="text-3xl font-bold text-primary-900 dark:text-primary-100 mb-1">{{ formattedValue }}</p>
    <div v-if="change !== null" class="flex items-center justify-center gap-1 text-sm">
      <svg v-if="change > 0" class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
      </svg>
      <svg v-else-if="change < 0" class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
      </svg>
      <span :class="change >= 0 ? 'text-green-500' : 'text-red-500'">
        {{ change >= 0 ? '+' : '' }}{{ change }}%
      </span>
      <span class="text-primary-400">vs sem. prec.</span>
    </div>
    <div v-else class="text-xs text-primary-400">Pas de donnees precedentes</div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  value: number
  change: number | null
  format?: 'number' | 'weight' | 'duration'
}

const props = withDefaults(defineProps<Props>(), { format: 'number' })

const formattedValue = computed(() => {
  switch (props.format) {
    case 'weight':
      return `${props.value.toLocaleString('fr-FR')} kg`
    case 'duration':
      return `${Math.round(props.value / 60)} min`
    default:
      return props.value.toLocaleString('fr-FR')
  }
})
</script>
