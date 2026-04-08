<template>
  <div class="min-h-screen bg-dark-900">
    <OfflineBanner />
    <TopNav />
    <ClientOnly>
      <HeaderSearch />
    </ClientOnly>
    <AuthLoader>
      <NuxtPage />
    </AuthLoader>
    <UiToastContainer />
  </div>
</template>

<script setup lang="ts">
import TopNav from '~/components/TopNav.vue'
import HeaderSearch from '~/components/HeaderSearch.vue'
useHead({
  htmlAttrs: {
    lang: 'fr'
  }
})

// Apply gender-based theme (rose for female users)
const { applyTheme } = useTheme()
onMounted(() => applyTheme())
</script>
