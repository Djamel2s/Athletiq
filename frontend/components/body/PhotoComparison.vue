<template>
  <div class="card-glass">
    <h3 class="text-xl font-bold text-primary-900 dark:text-primary-100 mb-6">Comparaison Avant / Après</h3>

    <!-- Photo Selectors -->
    <div class="flex flex-col sm:flex-row gap-3 mb-6">
      <div class="flex-1">
        <label class="block text-xs font-semibold text-primary-500 dark:text-primary-400 mb-1">Avant</label>
        <select v-model="beforePhotoId" class="input-primary text-sm">
          <option v-for="photo in sortedPhotos" :key="photo.id" :value="photo.id">
            {{ formatDate(photo.workout?.date || photo.createdAt) }}{{ photo.workout?.name ? ` — ${photo.workout.name}` : '' }}
          </option>
        </select>
      </div>
      <div class="flex-1">
        <label class="block text-xs font-semibold text-primary-500 dark:text-primary-400 mb-1">Après</label>
        <select v-model="afterPhotoId" class="input-primary text-sm">
          <option v-for="photo in sortedPhotos" :key="photo.id" :value="photo.id">
            {{ formatDate(photo.workout?.date || photo.createdAt) }}{{ photo.workout?.name ? ` — ${photo.workout.name}` : '' }}
          </option>
        </select>
      </div>
    </div>

    <!-- Comparison Viewer -->
    <div
      v-if="beforePhoto && afterPhoto"
      ref="containerRef"
      class="comparison-container relative aspect-[3/4] rounded-2xl overflow-hidden bg-primary-100 dark:bg-primary-800 select-none"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
    >
      <!-- After Image (base layer) -->
      <img
        :src="afterPhoto.photoUrl"
        :alt="'Après - ' + formatDate(afterPhoto.createdAt)"
        class="absolute inset-0 w-full h-full object-cover"
        draggable="false"
      />

      <!-- Before Image (clipped layer) -->
      <div
        class="absolute inset-0"
        :style="{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }"
      >
        <img
          :src="beforePhoto.photoUrl"
          :alt="'Avant - ' + formatDate(beforePhoto.createdAt)"
          class="absolute inset-0 w-full h-full object-cover"
          draggable="false"
        />
      </div>

      <!-- Slider Line -->
      <div
        class="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg pointer-events-none"
        :style="{ left: `${sliderPosition}%` }"
      ></div>

      <!-- Slider Handle -->
      <div
        class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center pointer-events-none"
        :style="{ left: `${sliderPosition}%` }"
      >
        <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4M8 15l4 4 4-4"/>
        </svg>
      </div>

      <!-- Date Labels -->
      <div class="absolute top-3 left-3 px-2.5 py-1 bg-black/50 backdrop-blur-sm rounded-lg text-white text-xs font-medium pointer-events-none">
        Avant · {{ formatDateShort(beforePhoto.workout?.date || beforePhoto.createdAt) }}
      </div>
      <div class="absolute top-3 right-3 px-2.5 py-1 bg-black/50 backdrop-blur-sm rounded-lg text-white text-xs font-medium pointer-events-none">
        Après · {{ formatDateShort(afterPhoto.workout?.date || afterPhoto.createdAt) }}
      </div>
    </div>

    <!-- Share Button -->
    <div v-if="beforePhoto && afterPhoto" class="mt-4 flex justify-center">
      <button @click="showShareModal = true" class="btn-primary inline-flex items-center gap-2 text-sm">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
        </svg>
        Partager ma transformation
      </button>
    </div>

    <!-- Empty state -->
    <div v-if="!beforePhoto || !afterPhoto" class="flex items-center justify-center h-48 text-primary-400 text-sm">
      Selectionnez deux photos pour comparer
    </div>

    <!-- Share Modal -->
    <Teleport to="body">
      <div v-if="showShareModal && beforePhoto && afterPhoto" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showShareModal = false"></div>
        <div class="relative bg-white dark:bg-primary-900 rounded-2xl p-4 md:p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-primary-200 dark:border-primary-700">
          <button @click="showShareModal = false" class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors z-10">
            <svg class="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
          <h3 class="text-xl font-bold text-primary-900 dark:text-primary-100 mb-4">Partager ma transformation</h3>
          <ShareCard
            type="beforeAfter"
            title="Ma transformation Athletiq"
            :before-image="beforePhoto.photoUrl"
            :after-image="afterPhoto.photoUrl"
            :data="{
              beforeDate: formatDate(beforePhoto.workout?.date || beforePhoto.createdAt),
              afterDate: formatDate(afterPhoto.workout?.date || afterPhoto.createdAt),
              userName: userName
            }"
          />
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { ProgressPhoto } from '~/types/body'

interface Props {
  photos: ProgressPhoto[]
  userName?: string
}

const props = defineProps<Props>()
const showShareModal = ref(false)

const getPhotoDate = (photo: ProgressPhoto) => {
  return new Date(photo.workout?.date || photo.createdAt).getTime()
}

const sortedPhotos = computed(() => {
  return [...props.photos].sort((a, b) => getPhotoDate(a) - getPhotoDate(b))
})

const beforePhotoId = ref<number | null>(null)
const afterPhotoId = ref<number | null>(null)

// Auto-select first and last photos
watch(() => props.photos, (photos) => {
  if (photos.length >= 2) {
    const sorted = [...photos].sort((a, b) => getPhotoDate(a) - getPhotoDate(b))
    if (!beforePhotoId.value) beforePhotoId.value = sorted[0].id
    if (!afterPhotoId.value) afterPhotoId.value = sorted[sorted.length - 1].id
  }
}, { immediate: true })

const beforePhoto = computed(() => props.photos.find(p => p.id === beforePhotoId.value) || null)
const afterPhoto = computed(() => props.photos.find(p => p.id === afterPhotoId.value) || null)

// Slider
const sliderPosition = ref(50)
const isDragging = ref(false)
const containerRef = ref<HTMLElement | null>(null)

const onPointerDown = (e: PointerEvent) => {
  isDragging.value = true
  updateSliderPosition(e)
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
}

const onPointerMove = (e: PointerEvent) => {
  if (!isDragging.value) return
  updateSliderPosition(e)
}

const onPointerUp = () => {
  isDragging.value = false
}

const updateSliderPosition = (e: PointerEvent) => {
  if (!containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  sliderPosition.value = Math.max(2, Math.min(98, (x / rect.width) * 100))
}

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date(dateString))
}

const formatDateShort = (dateString: string) => {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short'
  }).format(new Date(dateString))
}
</script>

<style scoped>
.comparison-container {
  touch-action: none;
  -webkit-user-select: none;
  user-select: none;
  cursor: col-resize;
}
</style>
