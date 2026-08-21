<template>
  <div class="hidden lg:block lg:mr-8 flex-shrink-0 self-start sticky top-2">
    <div
      class="group bg-white/70 dark:bg-primary-800/70 backdrop-blur-md rounded-xl border border-primary-200 dark:border-primary-700 hover:shadow-lg hover:border-primary-400 dark:hover:border-primary-500 p-4 flex flex-col w-[72px] hover:w-[210px] overflow-hidden"
      style="
        height: calc(100vh - var(--header-height) - 4rem);
        transition:
          width 0.4s cubic-bezier(0.4, 0, 0.2, 1),
          box-shadow 0.3s ease,
          border-color 0.3s ease;
      "
    >
      <div class="flex flex-col space-y-6">
        <button
          v-for="item in navItems"
          :key="item.path"
          @click="navigateTo(item.path)"
          class="flex items-center space-x-3 transition-all"
        >
          <div
            class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
            :class="
              isActive(item.path) ? 'bg-gradient-primary' : 'bg-primary-100 dark:bg-primary-700'
            "
          >
            <Icon
              :name="item.icon"
              class="w-5 h-5"
              :class="isActive(item.path) ? 'text-white' : 'text-primary-500 dark:text-primary-400'"
            />
          </div>
          <span
            class="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 font-semibold"
            :class="
              isActive(item.path)
                ? 'text-primary-900 dark:text-primary-100'
                : 'text-primary-500 dark:text-primary-400'
            "
          >
            {{ item.label }}
          </span>
        </button>
      </div>

      <!-- Spacer -->
      <div class="flex-1"></div>

      <!-- Separator -->
      <div class="border-t border-primary-200 dark:border-primary-700 my-4"></div>

      <!-- Retour Athletiq -->
      <!-- Logout Button -->
      <button @click="handleLogout" class="flex items-center space-x-0 transition-all group/logout">
        <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg
            class="w-5 h-5 text-primary-700 dark:text-primary-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </div>
        <span
          class="text-primary-900 dark:text-primary-100 font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300"
        >
          {{ t('nav.logout') }}
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
const authStore = useAuthStore();
const props = defineProps<{ active: string }>();
const { t } = useLocale();

const navItems = computed(() => [
  { path: '/coaching', label: t('coach.nav.dashboard'), icon: 'lucide:layout-dashboard' },
  { path: '/coaching/clients', label: t('coach.nav.clients'), icon: 'lucide:users' },
  { path: '/coaching/programs', label: t('coach.nav.programs'), icon: 'lucide:clipboard-list' },
  { path: '/coaching/settings', label: t('coach.nav.settings'), icon: 'lucide:settings' },
]);

const isActive = (path: string) => props.active === path;

const handleLogout = () => {
  authStore.logout();
};
</script>
