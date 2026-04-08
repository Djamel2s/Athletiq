<template>
  <nav v-if="allCrumbs.length" class="max-w-7xl mx-auto px-4 text-sm text-primary-500 dark:text-primary-400 mb-2">
    <ol class="flex items-center gap-2">
      <li v-for="(c, i) in allCrumbs" :key="i" class="flex items-center gap-2">
        <span v-if="i > 0" class="opacity-40 chevron">❯</span>
        <NuxtLink v-if="i !== allCrumbs.length - 1" :to="c.to" class="hover:underline">{{ c.text }}</NuxtLink>
        <span v-else class="font-semibold text-primary-900 dark:text-primary-100">{{ c.text }}</span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from '#imports'
import { computed } from 'vue'
import { useAuthStore } from '~/stores/auth'

const route = useRoute()
const authStore = useAuthStore()

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
}

const crumbs = computed(() => {
  const path = route.path || ''
  const parts = path.split('/').filter(Boolean)
  const results: Array<{ text: string; to: string }> = []
  let acc = ''
  for (const part of parts) {
    acc += `/${part}`
    let text = nameMap[part] || part
    const paramKeys = Object.keys(route.params || {})
    for (const key of paramKeys) {
      const val = String(route.params[key])
      if (val === part) {
        if (key === 'id') text = 'Détail'
        else if (key === 'username') text = `@${val}`
        else text = val
      }
    }
    if (!nameMap[part] && !Object.values(route.params || {}).includes(part)) {
      text = text.replace(/-/g, ' ')
      text = text.charAt(0).toUpperCase() + text.slice(1)
    }
    results.push({ text, to: acc })
  }
  return results
})

// Build full crumbs with a leading root based on auth state.
const allCrumbs = computed(() => {
  // If on root, just show Accueil
  if ((route.path || '/') === '/' || crumbs.value.length === 0) {
    return [{ text: 'Accueil', to: '/' }]
  }

  const head: Array<{ text: string; to: string }> = []
  if (authStore.isAuthenticated) {
    const firstPart = (route.path || '').split('/').filter(Boolean)[0]
    if (firstPart !== 'dashboard') head.push({ text: 'Dashboard', to: '/dashboard' })
  } else {
    head.push({ text: 'Accueil', to: '/' })
  }

  return [...head, ...crumbs.value]
})
</script>

<style scoped>
nav { font-size: 0.95rem }
</style>
