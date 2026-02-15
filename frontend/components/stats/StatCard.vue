<template>
  <div class="card-glass text-center">
    <div class="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-4 mx-auto icon-container">
      <div v-html="icon" class="w-6 h-6 text-white"></div>
    </div>
    <p class="text-sm text-primary-600 mb-2">{{ title }}</p>
    <p class="text-3xl font-bold text-primary-900 mb-1">{{ formattedValue }}</p>
    <p v-if="subtitle" class="text-xs text-primary-500">{{ subtitle }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  value: number | string | undefined
  icon: string
  subtitle?: string
  format?: 'number' | 'time' | 'weight' | 'duration'
}

const props = withDefaults(defineProps<Props>(), {
  format: 'number'
})

const formattedValue = computed(() => {
  // Handle undefined value
  if (props.value === undefined || props.value === null) {
    return '—'
  }

  if (typeof props.value === 'string') return props.value

  const numValue = Number(props.value)
  if (isNaN(numValue)) return '—'

  switch (props.format) {
    case 'weight':
      return `${numValue.toLocaleString('fr-FR')} kg`
    case 'time':
      return formatTime(numValue)
    case 'duration':
      return formatDuration(numValue)
    default:
      return numValue.toLocaleString('fr-FR')
  }
})

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0 min'

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  if (hours > 0) {
    return `${hours}h ${minutes}min`
  }
  return `${minutes}min`
}

function formatDuration(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0 min'

  const minutes = Math.round(seconds / 60)
  return `${minutes} min`
}
</script>
