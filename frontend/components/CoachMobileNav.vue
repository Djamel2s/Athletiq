<template>
  <nav
    class="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-primary-900/90 backdrop-blur-xl border-t border-primary-200 dark:border-primary-700 px-2 pb-[env(safe-area-inset-bottom)]"
  >
    <div class="flex items-center justify-around py-2">
      <button
        v-for="item in navItems"
        :key="item.path"
        @click="navigateTo(item.path)"
        class="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors"
        :class="
          isActive(item.path)
            ? 'text-sand-600 dark:text-sand-400'
            : 'text-primary-400 dark:text-primary-500'
        "
      >
        <Icon :name="item.icon" class="w-5 h-5" />
        <span class="text-[10px] font-semibold">{{ item.label }}</span>
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
const props = defineProps<{ active: string }>();
const { t } = useLocale();

const navItems = computed(() => [
  { path: '/coaching', label: t('coach.nav.dashboard'), icon: 'lucide:layout-dashboard' },
  { path: '/coaching/clients', label: t('coach.nav.clients'), icon: 'lucide:users' },
  { path: '/coaching/programs', label: t('coach.nav.programs'), icon: 'lucide:clipboard-list' },
  { path: '/coaching/settings', label: t('coach.nav.settings'), icon: 'lucide:settings' },
]);

const isActive = (path: string) => props.active === path;
</script>
