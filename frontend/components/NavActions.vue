<template>
  <div class="flex items-center space-x-3">
    <!-- Notifications -->
    <UiNotificationBell />

    <!-- Avatar → Profile -->
    <NuxtLink :to="profileLink" class="flex items-center">
      <div
        class="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center"
        :class="avatarUrl ? '' : 'bg-gradient-primary'"
      >
        <img v-if="avatarUrl" :src="avatarUrl" alt="Avatar" class="w-full h-full object-cover" />
        <svg
          v-else
          class="w-5 h-5 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      </div>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
import { computed } from 'vue';

const authStore = useAuthStore();
const avatarUrl = computed(() => authStore.user?.avatarUrl);
const profileLink = computed(() => {
  const username = (authStore.user as any)?.username;
  return username ? `/profile/${username}` : '/profile';
});
</script>
