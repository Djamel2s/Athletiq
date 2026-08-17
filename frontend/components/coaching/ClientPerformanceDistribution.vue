<template>
  <div class="w-full h-64">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { Bar } from 'vue-chartjs';
import type { ChartOptions } from 'chart.js';

interface Props {
  distribution: {
    strong: number;
    stable: number;
    risk: number;
  };
}

const props = defineProps<Props>();

const colorMode = useColorMode();
const isDark = computed(() => colorMode.value === 'dark');

const chartData = computed(() => ({
  labels: ['Strong', 'Stable', 'At Risk'],
  datasets: [
    {
      label: 'Client Count',
      data: [props.distribution.strong, props.distribution.stable, props.distribution.risk],
      backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
      borderRadius: 6,
      borderSkipped: false,
      barPercentage: 0.7,
      categoryPercentage: 0.8,
    },
  ],
}));

const chartOptions: ChartOptions<'bar'> = {
  indexAxis: 'y' as const,
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: isDark.value ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.9)',
      titleColor: isDark.value ? '#f5f5f4' : '#1c1917',
      bodyColor: isDark.value ? '#d6d3d1' : '#57534e',
      borderColor: isDark.value ? '#44403c' : '#e5e7eb',
      borderWidth: 1,
      padding: 12,
      callbacks: {
        label: (context: any) => {
          return `${context.parsed.x} clients`;
        },
      },
    },
  },
  scales: {
    x: {
      beginAtZero: true,
      grid: {
        color: isDark.value ? 'rgba(107, 114, 128, 0.1)' : 'rgba(209, 213, 219, 0.2)',
        drawBorder: false,
      },
      ticks: {
        color: isDark.value ? '#9ca3af' : '#6b7280',
        font: {
          size: 11,
        },
        stepSize: 1,
      },
    },
    y: {
      grid: {
        display: false,
      },
      ticks: {
        color: isDark.value ? '#9ca3af' : '#6b7280',
        font: {
          size: 12,
          weight: 600,
        },
      },
    },
  },
};
</script>
