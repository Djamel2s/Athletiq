<template>
  <div class="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
    <!-- Background bar -->
    <div class="relative bg-white/95 dark:bg-primary-900/95 backdrop-blur-xl border-t border-primary-200/60 dark:border-primary-700/60">
      <!-- Notch cutout behind GO button -->
      <div class="absolute -top-[30px] left-1/2 -translate-x-1/2 w-[88px] h-[44px] bg-white/95 dark:bg-primary-900/95 rounded-t-full"></div>

      <div class="flex items-end justify-around px-2 pb-2 pt-2.5">
        <!-- Left items -->
        <button
          v-for="item in leftItems"
          :key="item.path"
          @click="navigateTo(item.path)"
          :class="[
            'flex flex-col items-center justify-center w-16 py-1 rounded-xl transition-colors',
            item.path === activePath
              ? 'text-[#9d8569]'
              : 'text-primary-400 dark:text-primary-500'
          ]"
        >
          <component :is="item.icon" :class="item.path === activePath ? 'w-6 h-6' : 'w-5 h-5'" />
          <span :class="['text-[10px] mt-1 leading-none', item.path === activePath ? 'font-bold' : 'font-medium']">{{ item.label }}</span>
        </button>

        <!-- Center GO zone -->
        <div class="flex flex-col items-center w-20 -mt-10">
          <button
            @click="navigateTo('/workouts/start')"
            class="go-button relative w-[68px] h-[68px] rounded-full flex items-center justify-center active:scale-90 transition-all duration-200"
          >
            <!-- Outer glow ring -->
            <div class="absolute inset-0 rounded-full bg-gradient-to-br from-[#d4c4b0] to-[#9d8569] opacity-30 blur-md scale-110"></div>
            <!-- Button body -->
            <div class="relative w-full h-full rounded-full bg-gradient-to-br from-[#d4c4b0] to-[#9d8569] flex items-center justify-center shadow-xl ring-4 ring-white/80 dark:ring-primary-900/80">
              <span class="text-white font-black text-xl tracking-wider">GO</span>
            </div>
          </button>
          <span class="text-[10px] font-medium text-primary-400 dark:text-primary-500 mt-1">Lancer</span>
        </div>

        <!-- Right items -->
        <button
          v-for="item in rightItems"
          :key="item.path"
          @click="navigateTo(item.path)"
          :class="[
            'flex flex-col items-center justify-center w-16 py-1 rounded-xl transition-colors',
            item.path === activePath
              ? 'text-[#9d8569]'
              : 'text-primary-400 dark:text-primary-500'
          ]"
        >
          <component :is="item.icon" :class="item.path === activePath ? 'w-6 h-6' : 'w-5 h-5'" />
          <span :class="['text-[10px] mt-1 leading-none', item.path === activePath ? 'font-bold' : 'font-medium']">{{ item.label }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { h } from 'vue'

const props = defineProps<{
  activePath: string
}>()

const IconHome = () => h('svg', { class: 'w-6 h-6', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', innerHTML: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>' })
const IconCalendar = () => h('svg', { class: 'w-6 h-6', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', innerHTML: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>' })
const IconBody = () => h('svg', { class: 'w-6 h-6', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', innerHTML: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>' })
const IconStats = () => h('svg', { class: 'w-6 h-6', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', innerHTML: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>' })

const leftItems = [
  { path: '/dashboard', label: 'Accueil', icon: IconHome },
  { path: '/calendar', label: 'Activite', icon: IconCalendar },
]

const rightItems = [
  { path: '/body', label: 'Suivi', icon: IconBody },
  { path: '/statistics', label: 'Stats', icon: IconStats },
]
</script>

<style scoped>
.go-button:active .relative {
  box-shadow: 0 2px 8px rgba(157, 133, 105, 0.4);
}
</style>
