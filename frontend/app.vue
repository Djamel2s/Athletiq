<template>
  <div class="min-h-screen bg-primary-900">
    <OfflineBanner />
    <TopNav />
    <AuthLoader>
      <div class="pt-header">
        <Breadcrumbs :key="route.fullPath"/>
        <NuxtPage />
      </div>
    </AuthLoader>
    <UiToastContainer />
  </div>
</template>

<script setup lang="ts">
import TopNav from '~/components/TopNav.vue';
import Breadcrumbs from '~/components/Breadcrumbs.vue';
const route = useRoute();
useHead({
  htmlAttrs: {
    lang: 'fr',
  },
});

// Apply gender-based theme (rose for female users)
const { applyTheme } = useTheme();

function setVh() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

onMounted(() => {
  applyTheme();
  setVh();
  window.addEventListener('resize', setVh);
});

onUnmounted(() => {
  window.removeEventListener('resize', setVh);
});
</script>

<style>
:root {
  --header-height: 4rem;
}

@media (min-width: 768px) {
  :root {
    --header-height: 4rem;
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
