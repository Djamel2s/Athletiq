<template>
  <div class="flex items-center">
    <div
      class="relative flex items-center"
      @mouseenter="hover = true"
      @mouseleave="hover = false"
    >
      <!-- collapsed icon -->
      <button
        type="button"
        @click="toggleOpen"
        class="w-10 h-10 rounded-md flex items-center justify-center bg-primary-100 dark:bg-primary-800 text-primary-600 hover:shadow-sm transition"
        aria-label="Ouvrir la recherche"
      >
        <svg
          class="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>

      <!-- expanding input (desktop) -->
      <div
        class="ml-2 transition-all duration-200 ease-in-out overflow-hidden"
        :style="{ width: (open || hover) ? '360px' : '0px' }"
      >
        <input
          v-show="open || hover"
          v-model="q"
          @input="onInput"
          type="search"
          placeholder="Rechercher"
          class="w-full pl-4 pr-10 py-2 rounded-xl border border-primary-200 dark:border-primary-700 dark:bg-primary-800/70 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      <!-- suggestions -->
      <ul
        v-if="suggestions.length && (open || hover)"
        class="absolute left-12 top-12 bg-white dark:bg-primary-900/95 border border-primary-200 dark:border-primary-700 rounded-xl shadow-lg max-h-56 overflow-auto z-50 text-primary-900 dark:text-primary-100 w-96"
      >
        <li
          v-for="s in suggestions"
          :key="s.id"
          class="px-3 py-2 hover:bg-primary-100 dark:hover:bg-primary-900/95 cursor-pointer transition-colors"
          @click="select(s)"
        >
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center bg-primary-100 dark:bg-primary-800">
              <img v-if="s.avatarUrl" :src="s.avatarUrl" alt="avatar" class="w-full h-full object-cover" />
              <Icon v-else name="lucide:user" class="w-5 h-5 text-primary-700 dark:text-primary-200" />
            </div>
            <div class="flex items-center">
              <span class="text-sm font-medium">{{ s.username || s.firstName || (s.firstName && s.lastName ? `${s.firstName} ${s.lastName}` : `User ${s.id}`) }}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <!-- Mobile full-screen overlay when open -->
    <div v-if="open" class="md:hidden fixed inset-0 z-50 flex items-start p-4 bg-black/40">
      <div class="w-full max-w-lg mx-auto">
        <input
          v-model="q"
          @input="onInput"
          type="search"
          placeholder="Rechercher"
          class="w-full pl-4 pr-10 py-2 rounded-xl border border-primary-200 dark:border-primary-700 dark:bg-primary-800/70 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-transparent"
        />
        <ul
          v-if="suggestions.length"
          class="mt-2 bg-white dark:bg-primary-900/95 border border-primary-200 dark:border-primary-700 rounded-xl shadow-lg max-h-56 overflow-auto z-50 text-primary-900 dark:text-primary-100"
        >
          <li v-for="s in suggestions" :key="s.id" class="px-3 py-2 hover:bg-primary-100 dark:hover:bg-primary-900/95 cursor-pointer" @click="select(s)">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center bg-primary-100 dark:bg-primary-800">
                <img v-if="s.avatarUrl" :src="s.avatarUrl" alt="avatar" class="w-full h-full object-cover" />
                <Icon v-else name="lucide:user" class="w-5 h-5 text-primary-700 dark:text-primary-200" />
              </div>
              <div class="flex items-center">
                <span class="text-sm font-medium">{{ s.username || s.firstName || (s.firstName && s.lastName ? `${s.firstName} ${s.lastName}` : `User ${s.id}`) }}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { apiFetch } from '~/utils/apiFetch';

const q = ref('');
const suggestions = ref<Array<{ id: number; username: string; firstName?: string; lastName?: string; avatarUrl?: string }>>([]);
const open = ref(false);
const hover = ref(false);

let timer: any = null;
function onInput() {
  clearTimeout(timer);
  timer = setTimeout(fetchSuggestions, 250);
}

function toggleOpen() {
  open.value = !open.value;
}

async function fetchSuggestions() {
  if (!q.value || q.value.length < 2) {
    suggestions.value = [];
    return;
  }
  try {
    const res = await apiFetch(`/social/search?q=${encodeURIComponent(q.value)}`).catch(() => ({ users: [] }));
    const list = Array.isArray(res) ? res : (res as any)?.users || [];
    suggestions.value = list;
  } catch (e) {
    suggestions.value = [];
  }
}

function select(s: { id: number; username?: string; firstName?: string; lastName?: string }) {
  const target = s.username || s.id;
  navigateTo(`/profile/${target}`);
  q.value = '';
  suggestions.value = [];
  open.value = false;
}
</script>

<style scoped>
/* small styles if needed */
</style>
