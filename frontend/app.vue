<template>
  <div class="min-h-screen bg-dark-900">
    <OfflineBanner />
    <TopNav />
    <AuthLoader>
      <div class="pt-header">
        <Breadcrumbs />
        <NuxtPage />
      </div>
    </AuthLoader>
    <UiToastContainer />
  </div>
</template>

<script setup lang="ts">
import TopNav from '~/components/TopNav.vue'
import Breadcrumbs from '~/components/Breadcrumbs.vue'
useHead({
  htmlAttrs: {
    lang: 'fr'
  }
})

// Apply gender-based theme (rose for female users)
const { applyTheme } = useTheme()
onMounted(() => applyTheme())
</script>

<style>
:root {
  --header-height: 5rem;
}

@media (min-width: 768px) {
  :root {
    --header-height: 6rem;
  }
}

:root {
  --header-gap: 1rem; /* small visual gap under header */
}

.pt-header {
  padding-top: calc(var(--header-height) + var(--header-gap));
}

.top-offset {
  top: var(--header-height) !important;
}
</style>
