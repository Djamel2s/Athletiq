<template>
  <Bar :data="chartData" :options="chartOptions" />
</template>

<script setup lang="ts">
import { Bar } from 'vue-chartjs';
import type { ChartData } from '~/types/statistics';

interface Props {
  data: ChartData;
}

const props = defineProps<Props>();

const chartData = computed(() => props.data);

const colorMode = useColorMode();
const isDark = computed(() => colorMode.value === 'dark');
const { accentColors } = useTheme();

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y' as const,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: isDark.value ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.9)',
      titleColor: isDark.value ? '#f5f5f4' : '#1c1917',
      bodyColor: isDark.value ? '#d6d3d1' : '#57534e',
      borderColor: isDark.value ? '#44403c' : accentColors.value[500],
      borderWidth: 1,
      padding: 12,
      displayColors: false,
      callbacks: {
        label: (context: any) => `${context.parsed.x.toLocaleString('fr-FR')} kg`,
      },
    },
  },
  scales: {
    x: {
      beginAtZero: true,
      ticks: {
        color: isDark.value ? '#a8a29e' : '#57534e',
        font: {
          family: 'system-ui',
          size: 12,
        },
        callback: (value: any) => `${value} kg`,
      },
      grid: {
        color: isDark.value ? 'rgba(68, 64, 60, 0.3)' : `rgba(${accentColors.value.rgb500}, 0.2)`,
      },
    },
    y: {
      ticks: {
        color: isDark.value ? '#a8a29e' : '#57534e',
        font: {
          family: 'system-ui',
          size: 12,
        },
      },
      grid: {
        display: false,
      },
    },
  },
}));
</script>
