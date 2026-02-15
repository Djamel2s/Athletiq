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

// Register Chart.js components
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
        label: (context: any) => `${context.parsed.y.toLocaleString('fr-FR')} kg`
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
        callback: (value: any) => `${value} kg`
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
        color: 'rgba(212, 196, 176, 0.1)'
      }
    }
  }
}
</script>
