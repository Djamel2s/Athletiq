<template>
  <div class="flex items-center space-x-3">
    <!-- Notifications -->
    <UiNotificationBell />

    <div class="relative">
      <button
        type="button"
        class="flex h-10 w-10 items-center justify-center rounded-full border border-primary-200/70 bg-white/80 shadow-sm transition-all hover:scale-105 dark:border-primary-700 dark:bg-primary-900/70 overflow-hidden"
        @click="isLocaleMenuOpen = !isLocaleMenuOpen"
        :aria-label="t('nav.language')"
      >
        <Icon :name="currentLocale?.flag" class="w-6 h-6" />
      </button>

      <div
        v-if="isLocaleMenuOpen"
        class="absolute rounded-2xl border border-primary-200/70 bg-white/95 shadow-xl backdrop-blur dark:border-primary-700 dark:bg-primary-900/95"
      >
        <button
          v-for="option in availableLocales"
          :key="option.code"
          type="button"
          class="flex items-center justify-center rounded-xl w-10 h-10 p-0 text-sm font-medium transition-colors overflow-hidden"
          :title="option.label"
          :aria-label="option.label"
          :class="
            locale === option.code
              ? 'bg-sand-500 text-white'
              : 'text-primary-700 hover:bg-primary-50 dark:text-primary-200 dark:hover:bg-primary-800'
          "
          @click="selectLocale(option.code)"
        >
          <Icon :name="option.flag" class="w-6 h-6" />
        </button>
      </div>
    </div>

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
const { locale, availableLocales, setLocale, t } = useLocale();
const isLocaleMenuOpen = ref(false);
const currentLocale = computed(() =>
  availableLocales.find((option) => option.code === locale.value)
);
const selectLocale = (value: 'en' | 'fr') => {
  setLocale(value);
  isLocaleMenuOpen.value = false;
};
</script>
