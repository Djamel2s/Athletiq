<template>
  <div class="card-glass text-center">
    <div
      class="w-10 h-10 md:w-11 md:h-11 bg-gradient-primary rounded-xl flex items-center justify-center mb-3 mx-auto icon-container"
    >
      <slot name="icon">
        <div class="w-6 h-6 text-white" />
      </slot>
    </div>
    <p class="text-xs sm:text-sm text-primary-600 dark:text-primary-400 mb-2">{{ title }}</p>
    <p
      class="text-xl sm:text-2xl font-bold text-primary-900 dark:text-primary-100 mb-1 leading-tight"
    >
      {{ formattedValue }}
    </p>
    <p v-if="subtitle" class="text-[11px] sm:text-xs text-primary-500 dark:text-primary-400">
      {{ subtitle }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  value: number | string | undefined;
  subtitle?: string;
  format?: 'number' | 'time' | 'weight' | 'duration' | 'calories';
}

const props = withDefaults(defineProps<Props>(), {
  format: 'number',
});

const formattedValue = computed(() => {
  // Handle undefined value
  if (props.value === undefined || props.value === null) {
    return '—';
  }

  if (typeof props.value === 'string') return props.value;

  const numValue = Number(props.value);
  if (isNaN(numValue)) return '—';

  switch (props.format) {
    case 'weight':
      return `${numValue.toLocaleString('fr-FR')} kg`;
    case 'calories':
      return `${numValue.toLocaleString('fr-FR')} kcal`;
    case 'time':
      return formatTime(numValue);
    case 'duration':
      return formatDuration(numValue);
    default:
      return numValue.toLocaleString('fr-FR');
  }
});

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0 min';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}min`;
  }
  return `${minutes}min`;
}

function formatDuration(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0 min';

  const minutes = Math.round(seconds / 60);
  return `${minutes} min`;
}
</script>
