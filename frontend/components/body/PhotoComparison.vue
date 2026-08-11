<template>
  <div class="card-glass">
    <h3 class="text-xl font-bold text-primary-900 dark:text-primary-100 mb-6">
      Comparaison Avant / Après
    </h3>

    <!-- Photo Selectors -->
    <div class="flex flex-col sm:flex-row gap-3 mb-6">
      <div class="flex-1">
        <label class="block text-xs font-semibold text-primary-500 dark:text-primary-400 mb-1">{{
          t('photoComparison.before')
        }}</label>
        <select v-model="beforePhotoId" class="input-primary text-sm">
          <option v-for="photo in sortedPhotos" :key="photo.id" :value="photo.id">
            {{ formatDate(photo.workout?.date || photo.createdAt)
            }}{{ photo.workout?.name ? ` — ${photo.workout.name}` : '' }}
          </option>
        </select>
      </div>
      <div class="flex-1">
        <label class="block text-xs font-semibold text-primary-500 dark:text-primary-400 mb-1">{{
          t('photoComparison.after')
        }}</label>
        <select v-model="afterPhotoId" class="input-primary text-sm">
          <option v-for="photo in sortedPhotos" :key="photo.id" :value="photo.id">
            {{ formatDate(photo.workout?.date || photo.createdAt)
            }}{{ photo.workout?.name ? ` — ${photo.workout.name}` : '' }}
          </option>
        </select>
      </div>
    </div>

    <!-- View mode toggle -->
    <div v-if="beforePhoto && afterPhoto" class="flex justify-center gap-2 mb-4">
      <button
        @click="viewMode = 'slider'"
        class="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
        :class="
          viewMode === 'slider'
            ? 'bg-gradient-primary text-white shadow-sm'
            : 'bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-primary-400'
        "
      >
        Slider
      </button>
      <button
        @click="viewMode = 'split'"
        class="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
        :class="
          viewMode === 'split'
            ? 'bg-gradient-primary text-white shadow-sm'
            : 'bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-primary-400'
        "
      >
        Assemblé
      </button>
    </div>

    <!-- Slider Mode -->
    <div
      v-if="beforePhoto && afterPhoto && viewMode === 'slider'"
      ref="containerRef"
      class="comparison-container relative aspect-[3/4] rounded-2xl overflow-hidden bg-primary-100 dark:bg-primary-800 select-none"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
    >
      <img
        :src="afterPhoto.photoUrl"
        :alt="'Après'"
        class="absolute inset-0 w-full h-full object-cover"
        draggable="false"
      />
      <div class="absolute inset-0" :style="{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }">
        <img
          :src="beforePhoto.photoUrl"
          :alt="'Avant'"
          class="absolute inset-0 w-full h-full object-cover"
          draggable="false"
        />
      </div>
      <div
        class="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg pointer-events-none"
        :style="{ left: `${sliderPosition}%` }"
      ></div>
      <div
        class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center pointer-events-none"
        :style="{ left: `${sliderPosition}%` }"
      >
        <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 9l4-4 4 4M8 15l4 4 4-4"
          />
        </svg>
      </div>
      <div
        class="absolute top-3 left-3 px-2.5 py-1 bg-black/50 backdrop-blur-sm rounded-lg text-white text-xs font-medium pointer-events-none"
      >
        Avant · {{ formatDateShort(beforePhoto.workout?.date || beforePhoto.createdAt) }}
      </div>
      <div
        class="absolute top-3 right-3 px-2.5 py-1 bg-black/50 backdrop-blur-sm rounded-lg text-white text-xs font-medium pointer-events-none"
      >
        Après · {{ formatDateShort(afterPhoto.workout?.date || afterPhoto.createdAt) }}
      </div>
    </div>

    <!-- Split/Assembled Mode -->
    <div
      v-if="beforePhoto && afterPhoto && viewMode === 'split'"
      class="relative aspect-[3/4] rounded-2xl overflow-hidden bg-primary-100 dark:bg-primary-800"
    >
      <div class="flex h-full">
        <!-- Left half (before) - right half of image -->
        <div class="w-1/2 h-full overflow-hidden relative">
          <img
            :src="beforePhoto.photoUrl"
            :alt="t('photoComparison.before')"
            class="absolute inset-0 w-[200%] h-full object-cover"
            style="object-position: center"
          />
          <div
            class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent"
          >
            <p class="text-white text-xs font-semibold uppercase tracking-wider">
              {{ t('photoComparison.before') }}
            </p>
            <p class="text-white/70 text-[10px]">
              {{ formatDateShort(beforePhoto.workout?.date || beforePhoto.createdAt) }}
            </p>
          </div>
        </div>
        <!-- Divider -->
        <div class="w-0.5 bg-white/80 z-10 flex-shrink-0"></div>
        <!-- Right half (after) - left half of image -->
        <div class="w-1/2 h-full overflow-hidden relative">
          <img
            :src="afterPhoto.photoUrl"
            :alt="t('photoComparison.after')"
            class="absolute inset-0 w-[200%] h-full object-cover"
            style="object-position: center; left: -100%"
          />
          <div
            class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent text-right"
          >
            <p class="text-white text-xs font-semibold uppercase tracking-wider">
              {{ t('photoComparison.after') }}
            </p>
            <p class="text-white/70 text-[10px]">
              {{ formatDateShort(afterPhoto.workout?.date || afterPhoto.createdAt) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Share Buttons -->
    <div v-if="beforePhoto && afterPhoto" class="mt-4 flex justify-center gap-3">
      <button
        @click="
          shareMode = 'side';
          showShareModal = true;
        "
        class="btn-primary inline-flex items-center gap-2 text-sm"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
          />
        </svg>
        Côte à côte
      </button>
      <button
        @click="
          shareMode = 'split';
          showShareModal = true;
        "
        class="btn-outline inline-flex items-center gap-2 text-sm"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7"
          />
        </svg>
        Assemblé
      </button>
    </div>

    <!-- Empty state -->
    <div
      v-if="!beforePhoto || !afterPhoto"
      class="flex items-center justify-center h-48 text-primary-400 text-sm"
    >
      Selectionnez deux photos pour comparer
    </div>

    <!-- Share Modal -->
    <Teleport to="body">
      <div
        v-if="showShareModal && beforePhoto && afterPhoto"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4"
      >
        <div
          class="absolute inset-0 bg-black/60 backdrop-blur-sm"
          @click="showShareModal = false"
        ></div>
        <div
          class="relative bg-white dark:bg-primary-900 rounded-2xl p-4 md:p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-primary-200 dark:border-primary-700"
        >
          <button
            @click="showShareModal = false"
            class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors z-10"
          >
            <svg
              class="w-5 h-5 text-primary-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <h3 class="text-xl font-bold text-primary-900 dark:text-primary-100 mb-4">
            {{ t('photoComparison.shareTransformation') }}
          </h3>
          <ShareCard
            :type="shareMode === 'split' ? 'beforeAfterSplit' : 'beforeAfter'"
            :title="t('photoComparison.myTransformation')"
            :before-image="beforePhoto.photoUrl"
            :after-image="afterPhoto.photoUrl"
            :data="{
              beforeDate: formatDate(beforePhoto.workout?.date || beforePhoto.createdAt),
              afterDate: formatDate(afterPhoto.workout?.date || afterPhoto.createdAt),
              userName: userName,
            }"
          />
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
const { t, locale } = useLocale();
import type { ProgressPhoto } from '~/types/body';

interface Props {
  photos: ProgressPhoto[];
  userName?: string;
}

const props = defineProps<Props>();
const showShareModal = ref(false);
const viewMode = ref<'slider' | 'split'>('slider');
const shareMode = ref<'side' | 'split'>('side');

const getPhotoDate = (photo: ProgressPhoto) => {
  return new Date(photo.workout?.date || photo.createdAt).getTime();
};

const sortedPhotos = computed(() => {
  return [...props.photos].sort((a, b) => getPhotoDate(a) - getPhotoDate(b));
});

const beforePhotoId = ref<number | null>(null);
const afterPhotoId = ref<number | null>(null);

// Auto-select first and last photos
watch(
  () => props.photos,
  (photos) => {
    if (photos.length >= 2) {
      const sorted = [...photos].sort((a, b) => getPhotoDate(a) - getPhotoDate(b));
      if (!beforePhotoId.value) beforePhotoId.value = sorted[0].id;
      if (!afterPhotoId.value) afterPhotoId.value = sorted[sorted.length - 1].id;
    }
  },
  { immediate: true }
);

const beforePhoto = computed(() => props.photos.find((p) => p.id === beforePhotoId.value) || null);
const afterPhoto = computed(() => props.photos.find((p) => p.id === afterPhotoId.value) || null);

// Slider
const sliderPosition = ref(50);
const isDragging = ref(false);
const containerRef = ref<HTMLElement | null>(null);

const onPointerDown = (e: PointerEvent) => {
  isDragging.value = true;
  updateSliderPosition(e);
  (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
};

const onPointerMove = (e: PointerEvent) => {
  if (!isDragging.value) return;
  updateSliderPosition(e);
};

const onPointerUp = () => {
  isDragging.value = false;
};

const updateSliderPosition = (e: PointerEvent) => {
  if (!containerRef.value) return;
  const rect = containerRef.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  sliderPosition.value = Math.max(2, Math.min(98, (x / rect.width) * 100));
};

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat(locale.value === 'fr' ? 'fr-FR' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateString));
};

const formatDateShort = (dateString: string) => {
  return new Intl.DateTimeFormat(locale.value === 'fr' ? 'fr-FR' : 'en-US', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(dateString));
};
</script>

<style scoped>
.comparison-container {
  touch-action: none;
  -webkit-user-select: none;
  user-select: none;
  cursor: col-resize;
}
</style>
