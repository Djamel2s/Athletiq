<template>
  <div class="w-full h-64">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { Line } from 'vue-chartjs';
import type { ChartOptions } from 'chart.js';

interface Props {
  weeklyData: { week: string; adherence: number }[];
}

const props = defineProps<Props>();

const colorMode = useColorMode();
const isDark = computed(() => colorMode.value === 'dark');
const { accentColors } = useTheme();

const chartData = computed(() => ({
  labels: props.weeklyData.map((w) => w.week),
  datasets: [
    {
      label: 'Team Adherence',
      data: props.weeklyData.map((w) => w.adherence),
      borderColor: accentColors.value[500],
      backgroundColor: `${accentColors.value[500]}15`,
      borderWidth: 2.5,
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: accentColors.value[500],
      pointBorderColor: isDark.value ? '#1f2937' : '#ffffff',
      pointBorderWidth: 2,
      pointHoverRadius: 6,
      pointHoverBackgroundColor: accentColors.value[600],
    },
  ],
}));

const chartOptions: ChartOptions<'line'> = {
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
      borderColor: isDark.value ? '#44403c' : accentColors.value[500],
      borderWidth: 1,
      padding: 12,
      callbacks: {
        label: (context: any) => {
          return `${Math.round(context.parsed.y)}%`;
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      grid: {
        color: isDark.value ? 'rgba(107, 114, 128, 0.1)' : 'rgba(209, 213, 219, 0.2)',
        drawBorder: false,
      },
      ticks: {
        color: isDark.value ? '#9ca3af' : '#6b7280',
        font: {
          size: 11,
        },
        callback: (value: any) => `${value}%`,
      },
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: isDark.value ? '#9ca3af' : '#6b7280',
        font: {
          size: 11,
        },
      },
    },
  },
};
</script>
