<template>
  <div class="card-glass !p-6 !rounded-2xl relative overflow-hidden" :class="{ 'animate-flash': isFlashing }">
    <!-- Last set suggestion banner -->
    <div
      v-if="lastSetData"
      class="mb-4 px-4 py-2 rounded-xl text-sm text-center text-primary-600 dark:text-primary-400"
      style="background: var(--input-bg); border: 1px solid var(--input-border)"
    >
      Dernière fois : {{ lastSetData.weight }} kg × {{ lastSetData.reps }} reps
    </div>

    <!-- SVG Circular Timer -->
    <div class="flex flex-col items-center">
      <div class="relative w-48 h-48">
        <svg class="w-full h-full -rotate-90" viewBox="0 0 200 200">
          <defs>
            <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="rgb(var(--sand-500))" />
              <stop offset="100%" stop-color="rgb(var(--sand-600))" />
            </linearGradient>
          </defs>
          <!-- Background ring -->
          <circle
            cx="100"
            cy="100"
            r="88"
            fill="none"
            stroke-width="10"
            class="stroke-primary-200 dark:stroke-primary-700/50"
          />
          <!-- Active ring -->
          <circle
            cx="100"
            cy="100"
            r="88"
            fill="none"
            stroke-width="10"
            stroke-linecap="round"
            class="timer-ring"
            :style="{
              strokeDasharray: circumference,
              strokeDashoffset: dashOffset,
            }"
          />
        </svg>

        <!-- Time display -->
        <div class="absolute inset-0 flex flex-col items-center justify-center">
          <span class="text-4xl font-bold tabular-nums text-primary-900 dark:text-primary-100">
            {{ formattedTime }}
          </span>
          <span v-if="!isRunning && remaining === currentDuration" class="text-xs text-primary-400 dark:text-primary-500 mt-1">
            Appuyer pour démarrer
          </span>
          <span v-else-if="remaining === 0" class="text-xs text-sand-600 dark:text-sand-400 mt-1 font-medium">
            Terminé !
          </span>
        </div>
      </div>

      <!-- Quick time adjustments -->
      <div class="flex items-center gap-2 mt-4">
        <button
          v-for="adj in timeAdjustments"
          :key="adj.value"
          class="btn-glass !px-3 !py-1.5 !rounded-xl text-xs font-medium"
          :disabled="remaining === 0"
          @click="adjustTime(adj.value)"
        >
          {{ adj.label }}
        </button>
      </div>

      <!-- Control buttons -->
      <div class="flex items-center gap-3 mt-4">
        <button
          v-if="remaining > 0"
          class="btn-primary !px-6 !py-2.5 !rounded-xl text-sm font-semibold"
          @click="toggleTimer"
        >
          {{ isRunning ? 'Pause' : (remaining === currentDuration ? 'Démarrer' : 'Reprendre') }}
        </button>

        <button
          v-if="remaining !== currentDuration"
          class="btn-glass !px-4 !py-2.5 !rounded-xl text-sm"
          @click="resetTimer"
        >
          Réinitialiser
        </button>

        <button
          class="btn-glass !px-4 !py-2.5 !rounded-xl text-sm"
          @click="emit('dismiss')"
        >
          Fermer
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  duration?: number
  autoStart?: boolean
  lastSetData?: { weight: number; reps: number } | null
}

const props = withDefaults(defineProps<Props>(), {
  duration: 90,
  autoStart: false,
  lastSetData: null,
})

const emit = defineEmits<{
  complete: []
  dismiss: []
}>()

const RADIUS = 88
const circumference = 2 * Math.PI * RADIUS

const currentDuration = ref(props.duration)
const remaining = ref(props.duration)
const isRunning = ref(false)
const isFlashing = ref(false)
let intervalId: ReturnType<typeof setInterval> | null = null
let dismissTimeoutId: ReturnType<typeof setTimeout> | null = null

const timeAdjustments = [
  { label: '-30s', value: -30 },
  { label: '-15s', value: -15 },
  { label: '+15s', value: 15 },
  { label: '+30s', value: 30 },
]

const dashOffset = computed(() => {
  if (currentDuration.value === 0) return circumference
  const progress = remaining.value / currentDuration.value
  return circumference * (1 - progress)
})

const formattedTime = computed(() => {
  const mins = Math.floor(remaining.value / 60)
  const secs = remaining.value % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
})

function startTimer() {
  if (intervalId) return
  isRunning.value = true
  intervalId = setInterval(() => {
    if (remaining.value > 0) {
      remaining.value--
    }
    if (remaining.value === 0) {
      stopInterval()
      onComplete()
    }
  }, 1000)
}

function stopInterval() {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
  isRunning.value = false
}

function toggleTimer() {
  if (isRunning.value) {
    stopInterval()
  } else {
    startTimer()
  }
}

function resetTimer() {
  stopInterval()
  if (dismissTimeoutId) {
    clearTimeout(dismissTimeoutId)
    dismissTimeoutId = null
  }
  remaining.value = currentDuration.value
  isFlashing.value = false
}

function adjustTime(seconds: number) {
  const newDuration = Math.max(15, currentDuration.value + seconds)
  currentDuration.value = newDuration
  if (remaining.value > 0) {
    remaining.value = Math.max(1, Math.min(remaining.value + seconds, newDuration))
  }
}

function playBeep() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = ctx.createOscillator()
    const gain = ctx.createGain()

    oscillator.connect(gain)
    gain.connect(ctx.destination)

    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(880, ctx.currentTime)

    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.5)

    // Play a second shorter beep
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.connect(gain2)
    gain2.connect(ctx.destination)
    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(1100, ctx.currentTime + 0.6)
    gain2.gain.setValueAtTime(0.25, ctx.currentTime + 0.6)
    gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.9)
    osc2.start(ctx.currentTime + 0.6)
    osc2.stop(ctx.currentTime + 0.9)

    setTimeout(() => ctx.close(), 1500)
  } catch {
    // Web Audio API not available, silently fail
  }
}

function onComplete() {
  emit('complete')

  // Vibrate if available
  if (navigator.vibrate) {
    navigator.vibrate([200, 100, 200])
  }

  // Play beep
  playBeep()

  // Flash animation
  isFlashing.value = true
  setTimeout(() => {
    isFlashing.value = false
  }, 1500)

  // Auto-dismiss after 3 seconds
  dismissTimeoutId = setTimeout(() => {
    emit('dismiss')
  }, 3000)
}

// Auto-start if prop is set
onMounted(() => {
  if (props.autoStart) {
    startTimer()
  }
})

// Cleanup on unmount
onUnmounted(() => {
  stopInterval()
  if (dismissTimeoutId) {
    clearTimeout(dismissTimeoutId)
  }
})

// Watch for duration prop changes
watch(() => props.duration, (newVal) => {
  if (!isRunning.value && remaining.value === currentDuration.value) {
    currentDuration.value = newVal
    remaining.value = newVal
  }
})
</script>

<style scoped>
.timer-ring {
  stroke: url(#timerGradient);
  transition: stroke-dashoffset 0.8s ease-in-out;
}

@keyframes flash {
  0%, 100% {
    opacity: 1;
  }
  25% {
    opacity: 0.6;
    box-shadow: 0 0 30px rgba(var(--sand-500), 0.5);
  }
  50% {
    opacity: 1;
    box-shadow: 0 0 40px rgba(var(--sand-500), 0.7);
  }
  75% {
    opacity: 0.7;
    box-shadow: 0 0 20px rgba(var(--sand-500), 0.4);
  }
}

.animate-flash {
  animation: flash 0.5s ease-in-out 3;
}
</style>
