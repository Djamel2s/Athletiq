<template>
  <div class="relative">
    <!-- Photo Display -->
    <div class="relative aspect-[3/4] bg-primary-100 dark:bg-primary-800 rounded-2xl overflow-hidden">
      <img
        v-if="photos.length > 0"
        :src="photos[currentIndex]?.photoUrl"
        :alt="`Photo ${currentIndex + 1}`"
        class="w-full h-full object-cover transition-opacity duration-300"
      />
      <div v-else class="flex items-center justify-center h-full text-primary-400">
        Aucune photo
      </div>

      <!-- Date Overlay -->
      <div v-if="photos.length > 0" class="absolute top-4 left-4 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-xl text-white text-sm font-medium">
        {{ formatDate(photos[currentIndex]?.createdAt || photos[currentIndex]?.workout?.date) }}
      </div>

      <!-- Counter -->
      <div v-if="photos.length > 1" class="absolute top-4 right-4 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-xl text-white text-sm font-medium">
        {{ currentIndex + 1 }} / {{ photos.length }}
      </div>
    </div>

    <!-- Controls -->
    <div v-if="photos.length > 1" class="mt-4 space-y-3">
      <!-- Progress Bar -->
      <div class="w-full h-1.5 bg-primary-200 dark:bg-primary-700 rounded-full overflow-hidden">
        <div
          class="h-full bg-gradient-to-r from-[#d4c4b0] to-[#b8a48f] rounded-full transition-all duration-300"
          :style="{ width: `${((currentIndex + 1) / photos.length) * 100}%` }"
        ></div>
      </div>

      <!-- Buttons -->
      <div class="flex items-center justify-center space-x-4">
        <button
          @click="prev"
          class="w-10 h-10 flex items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-800 hover:bg-primary-200 dark:hover:bg-primary-700 transition-colors"
        >
          <svg class="w-5 h-5 text-primary-700 dark:text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>

        <button
          @click="togglePlay"
          class="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-r from-[#d4c4b0] to-[#b8a48f] text-white hover:shadow-lg transition-all"
        >
          <svg v-if="!isPlaying" class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
          <svg v-else class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
          </svg>
        </button>

        <button
          @click="next"
          class="w-10 h-10 flex items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-800 hover:bg-primary-200 dark:hover:bg-primary-700 transition-colors"
        >
          <svg class="w-5 h-5 text-primary-700 dark:text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>

        <!-- Speed Control -->
        <select
          v-model="speed"
          class="input-primary !w-auto !py-2 !px-3 text-sm"
        >
          <option :value="2000">0.5x</option>
          <option :value="1000">1x</option>
          <option :value="500">2x</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProgressPhoto } from '~/types/body'

interface Props {
  photos: ProgressPhoto[]
}

const props = defineProps<Props>()

const currentIndex = ref(0)
const isPlaying = ref(false)
const speed = ref(1000)
let interval: ReturnType<typeof setInterval> | null = null

const next = () => {
  if (props.photos.length === 0) return
  currentIndex.value = (currentIndex.value + 1) % props.photos.length
}

const prev = () => {
  if (props.photos.length === 0) return
  currentIndex.value = (currentIndex.value - 1 + props.photos.length) % props.photos.length
}

const togglePlay = () => {
  isPlaying.value = !isPlaying.value
  if (isPlaying.value) {
    startAutoplay()
  } else {
    stopAutoplay()
  }
}

const startAutoplay = () => {
  stopAutoplay()
  interval = setInterval(next, speed.value)
}

const stopAutoplay = () => {
  if (interval) {
    clearInterval(interval)
    interval = null
  }
}

watch(speed, () => {
  if (isPlaying.value) {
    startAutoplay()
  }
})

onUnmounted(() => {
  stopAutoplay()
})

const formatDate = (dateString?: string) => {
  if (!dateString) return ''
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date(dateString))
}
</script>
