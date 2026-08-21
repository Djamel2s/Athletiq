<template>
  <nav v-if="allCrumbs.length" class="text-sm text-primary-500 dark:text-primary-400 mb-4">
    <div class="max-w-7xl mx-auto" :class="isHome ? 'px-4' : 'px-8'">
      <ol class="flex items-center gap-2">
        <li v-for="(c, i) in allCrumbs" :key="c.to" class="flex items-center gap-2">
          <span v-if="i !== 0" class="opacity-40 chevron">❯</span>
          <NuxtLink v-if="i !== allCrumbs.length - 1" :to="c.to" class="hover:underline">{{
            c.text
          }}</NuxtLink>
          <span v-else class="font-semibold text-primary-900 dark:text-primary-100">{{
            c.text
          }}</span>
        </li>
      </ol>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRouter } from '#imports';
import { computed, ref, watch } from 'vue';
import { useAuthStore } from '~/stores/auth';

const router = useRouter();
const authStore = useAuthStore();
const { isCoachMode, homePath } = useAppMode();
const { t } = useLocale();

const currentFullPath = ref('/');
watch(
  () => router.currentRoute.value.fullPath,
  (value: string | undefined) => {
    currentFullPath.value = String(value || '/');
  },
  { immediate: true }
);

const nameMap: Record<string, string> = {
  dashboard: t('nav.dashboard'),
  programs: t('programs.title'),
  workouts: t('nav.workouts'),
  statistics: t('statistics.title'),
  profile: t('nav.profile'),
  settings: t('settings.title'),
  feed: t('nav.feed'),
  friends: t('nav.friends'),
  achievements: t('nav.achievements'),
  calendar: t('nav.calendar'),
  body: t('nav.body'),
  streak: t('nav.streak'),
  wrapped: t('nav.wrapped'),
  coaching: t('nav.coaching'),
  clients: t('nav.clients'),
};

const normalizedPath = computed(() => {
  const raw = currentFullPath.value;
  const noQuery = raw.split('?')[0].split('#')[0] || '/';
  if (noQuery === '/') return '/';
  return noQuery.endsWith('/') ? noQuery.slice(0, -1) : noQuery;
});

const isHome = computed(() => {
  const path = normalizedPath.value;
  return !['/', '/coach-landing', '/register', '/login'].includes(path);
});

const ownUsername = computed(() => {
  const fromStore = String((authStore.user as any)?.username || '').trim();
  if (fromStore) return fromStore.toLowerCase();
  if (typeof window === 'undefined') return '';
  return String(localStorage.getItem('athletiq_username') || '')
    .trim()
    .toLowerCase();
});

const crumbs = computed(() => {
  const path = normalizedPath.value;
  const parts = path.split('/').filter(Boolean);
  const results: Array<{ text: string; to: string }> = [];
  let acc = '';
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    acc += `/${part}`;
    let text = nameMap[part] || part;

    if (parts[0] === 'profile' && i === 1) {
      text = `@${part}`;
    } else if (/^\d+$/.test(part)) {
      text = t('common.detail');
    }

    if (!nameMap[part] && !(parts[0] === 'profile' && i === 1) && !/^\d+$/.test(part)) {
      text = text.replace(/-/g, ' ');
      text = text.charAt(0).toUpperCase() + text.slice(1);
    }

    results.push({ text, to: acc });
  }

  // Hide username crumb on own profile: /profile/<my-username> => Dashboard > Profil
  if (parts[0] === 'profile' && parts[1] && ownUsername.value) {
    const current = parts[1].toLowerCase();
    if (current === ownUsername.value) {
      const ownCrumbPath = `/profile/${parts[1]}`;
      return results.filter((r) => r.to !== ownCrumbPath);
    }
  }

  return results;
});

// Build full crumbs with a leading root based on auth state and mode.
const allCrumbs = computed(() => {
  if (normalizedPath.value === '/' || normalizedPath.value === '/coach-landing') {
    return [{ text: t('nav.home'), to: normalizedPath.value }];
  }

  if (crumbs.value.length === 0) {
    return [{ text: t('nav.home'), to: '/' }];
  }

  const head: Array<{ text: string; to: string }> = [];
  if (authStore.isAuthenticated) {
    const firstPart = normalizedPath.value.split('/').filter(Boolean)[0];
    const rootPath = homePath.value;
    const rootLabel = isCoachMode.value ? t('nav.coaching') : t('nav.dashboard');
    if (firstPart !== 'dashboard' && firstPart !== 'coaching') {
      head.push({ text: rootLabel, to: rootPath });
    }
  } else {
    head.push({ text: t('nav.home'), to: isCoachMode.value ? '/coach-landing' : '/' });
  }

  return [...head, ...crumbs.value];
});
</script>

<style scoped>
nav {
  font-size: 0.95rem;
}
</style>
