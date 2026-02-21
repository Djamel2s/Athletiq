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
import type { BodyStat } from '~/types/body'

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
  stats: BodyStat[]
}

const props = defineProps<Props>()

const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

const chartData = computed(() => {
  const sorted = [...props.stats].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return {
    labels: sorted.map(s => new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' }).format(new Date(s.date))),
    datasets: [
      {
        label: 'Poids (kg)',
        data: sorted.map(s => s.weight),
        borderColor: '#d4c4b0',
        backgroundColor: isDark.value ? 'rgba(212, 196, 176, 0.1)' : 'rgba(212, 196, 176, 0.2)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#d4c4b0',
        pointBorderColor: isDark.value ? '#1c1c1c' : '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  }
})

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
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
        label: (context: any) => {
          const index = context.dataIndex
          const sorted = [...props.stats].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          const stat = sorted[index]
          const lines = [`Poids: ${context.parsed.y} kg`]
          if (stat?.bodyFat) lines.push(`Body fat: ${stat.bodyFat}%`)
          return lines
        }
      }
    }
  },
  scales: {
    y: {
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
