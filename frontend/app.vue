<template>
  <div class="min-h-screen bg-dark-900">
    <AuthLoader>
      <NuxtPage />
    </AuthLoader>
    <UiToastContainer />
  </div>
</template>

<script setup lang="ts">
useHead({
  htmlAttrs: {
    lang: 'fr'
  }
})

// Apply gender-based theme (rose for female users)
const { applyTheme } = useTheme()
onMounted(() => applyTheme())
</script>
