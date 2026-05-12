<template>
  <nav
    v-if="allCrumbs.length"
    class="max-w-7xl mx-auto px-4 text-sm text-primary-500 dark:text-primary-400 mb-4"
  >
    <ol :class="['flex items-center gap-2', showAccueilFirst ? 'pl-3 md:pl-3' : '']">
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
  </nav>
</template>

<script setup lang="ts">
import { useRouter } from '#imports';
import { computed, ref, watch } from 'vue';
import { useAuthStore } from '~/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const currentFullPath = ref('/');
watch(
  () => router.currentRoute.value.fullPath,
  (value: string | undefined) => {
    currentFullPath.value = String(value || '/');
  },
  { immediate: true }
);

const nameMap: Record<string, string> = {
  dashboard: 'Dashboard',
  programs: 'Programmes',
  workouts: 'Workouts',
  statistics: 'Statistiques',
  profile: 'Profil',
  settings: 'Paramètres',
  feed: 'Fil',
  friends: 'Gym Bros',
  achievements: 'Trophées',
  calendar: 'Calendrier',
  body: 'Corps',
  streak: 'Motivation',
  wrapped: 'Wrapped',
};

const normalizedPath = computed(() => {
  const raw = currentFullPath.value;
  const noQuery = raw.split('?')[0].split('#')[0] || '/';
  if (noQuery === '/') return '/';
  return noQuery.endsWith('/') ? noQuery.slice(0, -1) : noQuery;
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

    // Route-derived dynamic labels are more reliable than route.params during fast nav transitions.
    if (parts[0] === 'profile' && i === 1) {
      text = `@${part}`;
    } else if (/^\d+$/.test(part)) {
      text = 'Détail';
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

// Build full crumbs with a leading root based on auth state.
const allCrumbs = computed(() => {
  // If on root, just show Accueil
  if (normalizedPath.value === '/' || crumbs.value.length === 0) {
    return [{ text: 'Accueil', to: '/' }];
  }

  const head: Array<{ text: string; to: string }> = [];
  if (authStore.isAuthenticated) {
    const firstPart = normalizedPath.value.split('/').filter(Boolean)[0];
    if (firstPart !== 'dashboard') head.push({ text: 'Dashboard', to: '/dashboard' });
  } else {
    head.push({ text: 'Accueil', to: '/' });
  }

  return [...head, ...crumbs.value];
});

// When the first crumb is 'Accueil' we add a small left padding so the breadcrumb
// aligns visually with the logo like when 'Dashboard' is present.
const showAccueilFirst = computed(() => {
  return allCrumbs.value.length > 0 && allCrumbs.value[0].text === 'Accueil';
});
</script>

<style scoped>
nav {
  font-size: 0.95rem;
}
</style>
