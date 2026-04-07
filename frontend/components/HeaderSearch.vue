<template>
  <div class="hidden md:flex items-center ml-6 w-full max-w-lg">
    <div class="relative w-full">
      <input
        v-model="q"
        @input="onInput"
        type="search"
        placeholder="Rechercher un gymbro..."
        class="w-full pl-4 pr-10 py-2 rounded-xl border border-primary-200 bg-white/80 dark:bg-primary-800/70 text-sm focus:outline-none"
      />
      <svg class="absolute right-3 top-2.5 w-5 h-5 text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35" />
      </svg>
      <ul v-if="suggestions.length" class="absolute left-0 right-0 mt-1 bg-white rounded-xl shadow-lg max-h-56 overflow-auto z-50">
        <li v-for="s in suggestions" :key="s.id" class="px-3 py-2 hover:bg-primary-50 cursor-pointer" @click="select(s)">{{ s.name }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
const q = ref('')
const suggestions = ref<Array<{ id: number; name: string }>>([])

let timer: any = null
function onInput() {
  clearTimeout(timer)
  timer = setTimeout(fetchSuggestions, 250)
}

async function fetchSuggestions() {
  if (!q.value || q.value.length < 2) {
    suggestions.value = []
    return
  }
  try {
    // Best-effort: backend search endpoint may not exist yet
    const res = await $fetch('/api/search/users?q=' + encodeURIComponent(q.value)).catch(() => [])
    suggestions.value = Array.isArray(res) ? (res as any) : []
  } catch (e) {
    suggestions.value = []
  }
}

function select(s: { id: number; name: string }) {
  // navigate to profile
  navigateTo(`/profile/${s.name}`)
  q.value = ''
  suggestions.value = []
}
</script>

<style scoped>
/* small styles if needed */
</style>
