<template>
  <div class="min-h-screen bg-dark-900">
    <NuxtPage />
    <UiToastContainer />
  </div>
</template>

<script setup lang="ts">
useHead({
  htmlAttrs: {
    lang: 'fr'
  }
})
</script>
