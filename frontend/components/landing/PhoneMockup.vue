<template>
  <div class="relative mx-auto" :style="{ width: `${width}px`, maxWidth: '100%' }">
    <div class="relative rounded-[2.75rem] bg-iron-950 p-2.5 shadow-2xl">
      <!-- Encoche -->
      <div
        class="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-5 bg-iron-950 rounded-b-2xl z-10"
      />
      <div class="rounded-[2.25rem] overflow-hidden bg-primary-900 aspect-[9/19.5]">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ width?: number }>(), { width: 280 });
</script>
