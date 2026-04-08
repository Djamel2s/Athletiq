<template>
  <div class="hidden md:flex items-center w-full">
    <div class="relative w-full">
      <input
        v-model="q"
        @input="onInput"
        type="search"
        placeholder="Rechercher"
        class="w-full pl-4 pr-10 py-2 rounded-xl border border-primary-200 bg-white/80 dark:bg-primary-800/70 text-sm focus:outline-none"
      />
      <svg class="absolute right-3 top-2.5 w-5 h-5 text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35" />
      </svg>
      <ul v-if="suggestions.length" class="absolute left-0 right-0 mt-1 bg-white rounded-xl shadow-lg max-h-56 overflow-auto z-50">
        <li v-for="s in suggestions" :key="s.id" class="px-3 py-2 hover:bg-primary-50 cursor-pointer" @click="select(s)">
          <div class="flex items-center gap-3">
            <img v-if="s.avatarUrl" :src="s.avatarUrl" alt="avatar" class="w-8 h-8 rounded-full object-cover" />
            <div class="flex items-center">
              <span class="text-sm font-medium text-primary-900 dark:text-primary-100">{{ s.username }}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { apiFetch } from '~/utils/apiFetch'
const q = ref('')
const suggestions = ref<Array<{ id: number; username: string; firstName?: string; lastName?: string; avatarUrl?: string }>>([])

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
    // Call backend social search via apiFetch (adds auth header and base URL)
    const res = await apiFetch(`/social/search?q=${encodeURIComponent(q.value)}`).catch(() => ({ users: [] }))
    const list = Array.isArray(res) ? res : (res as any)?.users || []
    suggestions.value = list
  } catch (e) {
    // If not authenticated or any error, return empty suggestions
    suggestions.value = []
  }
}

function select(s: { id: number; username: string }) {
  // navigate to profile by username
  navigateTo(`/profile/${s.username}`)
  q.value = ''
  suggestions.value = []
}
</script>

<style scoped>
/* small styles if needed */
</style>
