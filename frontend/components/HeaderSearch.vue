<template>
  <div class="hidden md:flex items-center w-full">
    <div class="relative w-full search-collapsible" @mouseenter="hover = true" @mouseleave="hover = false">
      <input
        v-model="q"
        @input="onInput"
        @focus="hasFocus = true"
        @blur="hasFocus = false"
        type="search"
        placeholder="Rechercher"
        class="w-full pl-4 pr-10 py-2 rounded-xl border border-primary-200 dark:border-primary-700 hover:shadow-lg hover:border-primary-400 dark:bg-primary-800/70 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-transparent transition"
      />
      <svg
        class="absolute right-3 top-2.5 w-5 h-5 text-primary-500"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <ul
        v-if="suggestions.length && expanded"
        class="absolute left-0 right-0 mt-1 bg-white dark:bg-primary-900/95 border border-primary-200 dark:border-primary-700 rounded-xl shadow-lg max-h-56 overflow-auto z-50 text-primary-900 dark:text-primary-100"
      >
        <li
          v-for="s in suggestions"
          :key="s.id"
          class="px-3 py-2 hover:bg-primary-100 dark:hover:bg-primary-900/95 cursor-pointer transition-colors"
          @mousedown.prevent="select(s)"
          @click.prevent
        >
          <div class="flex items-center gap-3">
            <div
              class="w-8 h-8 rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center bg-primary-100 dark:bg-primary-800 border border-primary-100 dark:border-primary-800"
            >
              <img
                v-if="s.avatarUrl"
                :src="s.avatarUrl"
                alt="avatar"
                class="w-full h-full object-cover"
              />
              <Icon
                v-else
                name="lucide:user"
                class="w-5 h-5 text-primary-700 dark:text-primary-200"
              />
            </div>
            <div class="flex items-center">
              <span class="text-sm font-medium">{{
                s.username ||
                s.firstName ||
                (s.firstName && s.lastName ? `${s.firstName} ${s.lastName}` : `User ${s.id}`)
              }}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { apiFetch } from '~/utils/apiFetch';
const q = ref('');
const suggestions = ref<
  Array<{ id: number; username: string; firstName?: string; lastName?: string; avatarUrl?: string }>
>([]);

const hover = ref(false);
const hasFocus = ref(false);
const expanded = computed(() => hover.value || hasFocus.value);

let timer: any = null;
function onInput() {
  clearTimeout(timer);
  timer = setTimeout(fetchSuggestions, 250);
}

async function fetchSuggestions() {
  if (!q.value || q.value.length < 2) {
    suggestions.value = [];
    return;
  }
  try {
    // Call backend social search via apiFetch (adds auth header and base URL)
    const res = await apiFetch(`/social/search?q=${encodeURIComponent(q.value)}`).catch(() => ({
      users: [],
    }));
    const list = Array.isArray(res) ? res : (res as any)?.users || [];
    suggestions.value = list;
  } catch (e) {
    // If not authenticated or any error, return empty suggestions
    suggestions.value = [];
  }
}

function select(s: { id: number; username?: string; firstName?: string; lastName?: string }) {
  // navigate to profile by username if available, otherwise by id
  const target = s.username || s.id;
  navigateTo(`/profile/${target}`);
  q.value = '';
  suggestions.value = [];
}
</script>

<style scoped>
/* Collapsible search: keep original markup but collapse to a square showing the icon.
   Expands on hover or focus-within. Minimal, non-invasive overrides. */
.search-collapsible{
  width:44px;
  transition: width 180ms ease-in-out;
  /* allow dropdown suggestions to escape the small collapsed box */
  overflow: visible;
  position: relative;
}
.search-collapsible:hover,
.search-collapsible:focus-within{
  width:100%;
}

/* hide input visually when collapsed but keep it available when expanded */
.search-collapsible input{
  opacity:0;
  /* keep clickable so focus works and :focus-within triggers expansion */
  pointer-events:auto;
  transition: opacity 120ms ease-in-out;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  outline: none !important;
  -webkit-appearance: none !important;
}
.search-collapsible:hover input,
.search-collapsible:focus-within input{
  opacity:1;
}

/* keep icon at the right end so collapsed view shows the loupe; center vertically */
.search-collapsible svg{
  left: auto !important;
  right: 12px !important;
  top: 50% !important;
  transform: translateY(-50%);
}

/* remove any focus ring or white overlay coming from focus styles */
.search-collapsible input:focus{
  outline: none !important;
  box-shadow: none !important;
}
</style>
