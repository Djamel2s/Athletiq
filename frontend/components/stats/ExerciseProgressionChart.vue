<template>
  <Line :data="chartData" :options="chartOptions" />
</template>

<script setup lang="ts">
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import type { ChartData } from '~/types/statistics'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface Props {
  data: ChartData
}

const props = defineProps<Props>()

const chartData = computed(() => props.data)

const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      labels: {
        color: isDark.value ? '#a8a29e' : '#57534e'
      }
    },
    tooltip: {
      backgroundColor: isDark.value ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.9)',
      titleColor: isDark.value ? '#f5f5f4' : '#1c1917',
      bodyColor: isDark.value ? '#d6d3d1' : '#57534e',
      borderColor: isDark.value ? '#44403c' : '#d4c4b0',
      borderWidth: 1,
      padding: 12,
      displayColors: false,
      callbacks: {
        label: (context: any) => `${context.parsed.y} kg`
      }
    }
  },
  scales: {
    y: {
      beginAtZero: false,
      ticks: {
        color: isDark.value ? '#a8a29e' : '#57534e',
        font: { family: 'system-ui', size: 12 },
        callback: (value: any) => `${value} kg`
      },
      grid: {
        color: isDark.value ? 'rgba(68, 64, 60, 0.3)' : 'rgba(212, 196, 176, 0.2)'
      }
    },
    x: {
      ticks: {
        color: isDark.value ? '#a8a29e' : '#57534e',
        font: { family: 'system-ui', size: 12 }
      },
      grid: {
        color: isDark.value ? 'rgba(68, 64, 60, 0.15)' : 'rgba(212, 196, 176, 0.1)'
      }
    }
  }
}))
</script>
