<template>
  <nav class="fixed top-0 left-0 right-0 z-50 nav-blur">
    <div class="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-5">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <NuxtLink to="/dashboard">
            <AppLogo />
          </NuxtLink>
        </div>

        <div class="flex items-center flex-1 px-4">
          <ClientOnly>
            <HeaderSearch />
          </ClientOnly>
        </div>

        <NavActions />
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import AppLogo from '~/components/AppLogo.vue';
import NavActions from '~/components/NavActions.vue';
import HeaderSearch from '~/components/HeaderSearch.vue';
</script>
