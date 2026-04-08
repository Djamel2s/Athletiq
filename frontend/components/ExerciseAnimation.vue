<template>
  <div
    class="exercise-animation relative overflow-hidden rounded-2xl bg-primary-100 dark:bg-primary-800"
    :class="sizeClass"
  >
    <!-- Image animée (alternance start/end) -->
    <div v-if="imageId" class="w-full h-full relative">
      <img
        :src="frame0Url"
        :alt="name"
        class="absolute inset-0 w-full h-full object-contain transition-opacity duration-500"
        :class="showFrame0 ? 'opacity-100' : 'opacity-0'"
        loading="lazy"
        @error="onImageError"
      />
      <img
        :src="frame1Url"
        :alt="name"
        class="absolute inset-0 w-full h-full object-contain transition-opacity duration-500"
        :class="showFrame0 ? 'opacity-0' : 'opacity-100'"
        loading="lazy"
        @error="onImageError"
      />
    </div>

    <!-- Fallback: icône muscle group -->
    <div v-else class="w-full h-full flex flex-col items-center justify-center gap-2 p-4">
      <div class="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
      <p class="text-xs text-primary-500 dark:text-primary-400 text-center">{{ name }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const CDN_BASE = 'https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises';

const props = defineProps<{
  imageId?: string | null;
  name: string;
  size?: 'sm' | 'md' | 'lg';
}>();

const showFrame0 = ref(true);
const hasError = ref(false);
let interval: ReturnType<typeof setInterval> | null = null;

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'h-32';
    case 'lg':
      return 'h-48 md:h-64';
    default:
      return 'h-40 md:h-48';
  }
});

const imageId = computed(() => {
  if (hasError.value) return null;
  return props.imageId;
});

const frame0Url = computed(() => `${CDN_BASE}/${props.imageId}/0.jpg`);
const frame1Url = computed(() => `${CDN_BASE}/${props.imageId}/1.jpg`);

const onImageError = () => {
  hasError.value = true;
  if (interval) clearInterval(interval);
};

onMounted(() => {
  if (props.imageId) {
    interval = setInterval(() => {
      showFrame0.value = !showFrame0.value;
    }, 1500);
  }
});

onUnmounted(() => {
  if (interval) clearInterval(interval);
});

watch(
  () => props.imageId,
  (newVal) => {
    hasError.value = false;
    if (interval) clearInterval(interval);
    if (newVal) {
      showFrame0.value = true;
      interval = setInterval(() => {
        showFrame0.value = !showFrame0.value;
      }, 1500);
    }
  }
);
</script>
