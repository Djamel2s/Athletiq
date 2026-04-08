<template>
  <div
    v-if="showLoader"
    class="fixed inset-0 z-[200] bg-white dark:bg-primary-900 flex items-center justify-center"
  >
    <div class="text-center">
      <div
        class="inline-block animate-spin rounded-full h-10 w-10 border-4 border-primary-200 dark:border-primary-700 border-t-sand-500 dark:border-t-sand-400 mb-4"
      ></div>
      <p class="text-sm text-primary-500 dark:text-primary-400">Chargement...</p>
    </div>
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
const authStore = useAuthStore();
const route = useRoute();

const publicPages = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/',
  '/legal/cgu',
  '/legal/privacy',
  '/legal/mentions',
];

const showLoader = computed(() => {
  if (publicPages.some((p) => route.path === p || route.path.startsWith('/legal/'))) return false;
  return authStore.isInitializing;
});
</script>
