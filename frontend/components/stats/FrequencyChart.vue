<template>
  <Bar :data="chartData" :options="chartOptions" />
</template>

<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import type { ChartData } from '~/types/statistics'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface Props {
  data: ChartData
}

const props = defineProps<Props>()

const chartData = computed(() => props.data)

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      titleColor: '#1c1917',
      bodyColor: '#57534e',
      borderColor: '#d4c4b0',
      borderWidth: 1,
      padding: 12,
      displayColors: false,
      callbacks: {
        label: (context: any) => `${context.parsed.y} entraînement${context.parsed.y > 1 ? 's' : ''}`
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        color: '#57534e',
        font: {
          family: 'system-ui',
          size: 12
        },
        stepSize: 1
      },
      grid: {
        color: 'rgba(212, 196, 176, 0.2)'
      }
    },
    x: {
      ticks: {
        color: '#57534e',
        font: {
          family: 'system-ui',
          size: 12
        }
      },
      grid: {
        display: false
      }
    }
  }
}
</script>
