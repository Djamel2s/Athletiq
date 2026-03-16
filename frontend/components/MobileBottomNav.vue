<template>
  <div class="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
    <!-- Fan overlay backdrop -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="fanOpen" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" @click="fanOpen = false"></div>
    </Transition>

    <!-- Fan arc background + buttons -->
    <Transition
      enter-active-class="transition duration-250 ease-out"
      enter-from-class="opacity-0 translate-y-4 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-4 scale-95"
    >
      <div v-if="fanOpen" class="fixed bottom-[80px] left-1/2 -translate-x-1/2 z-50" style="transform-origin: bottom center;">
        <div class="relative w-[220px] h-[140px]">
          <!-- Bridge/arch shape -->
          <div class="absolute inset-0 bg-white/95 dark:bg-primary-900/95 backdrop-blur-xl fan-arc"></div>

          <!-- Left: Workouts -->
          <button
            @click="goTo('/workouts')"
            class="absolute left-[20px] top-[50px] flex flex-col items-center gap-1 group z-10"
          >
            <div class="w-11 h-5 rounded-xl flex items-center justify-center group-active:scale-90 transition-transform">
              <svg class="w-6 h-6 text-primary-400 dark:text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </div>
            <span class="text-[10px] font-medium text-primary-400 dark:text-primary-500">Workouts</span>
          </button>

          <!-- Center: GO (Lancer) -->
          <button
            @click="goTo('/workouts/start')"
            class="absolute left-1/2 -translate-x-1/2 top-[10px] flex flex-col items-center gap-1 group z-10"
          >
            <div class="w-[52px] h-[52px] rounded-2xl bg-gradient-to-br from-sand-500 to-sand-700 shadow-lg flex items-center justify-center group-active:scale-90 transition-transform">
              <span class="text-white font-black text-base tracking-wider">GO</span>
            </div>
            <span class="text-[10px] font-medium text-primary-400 dark:text-primary-500">Lancer</span>
          </button>

          <!-- Right: Motivation -->
          <button
            @click="goTo('/streak')"
            class="absolute right-[20px] top-[50px] flex flex-col items-center gap-1 group z-10"
          >
            <div class="w-11 h-5 rounded-xl flex items-center justify-center group-active:scale-90 transition-transform">
              <svg class="w-6 h-6 text-primary-400 dark:text-primary-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"/>
              </svg>
            </div>
            <span class="text-[10px] font-medium text-primary-400 dark:text-primary-500">Motivation</span>
          </button>
        </div>
      </div>
    </Transition>

    <!-- Background bar -->
    <div class="relative bg-white/95 dark:bg-primary-900/95 backdrop-blur-xl border-t border-primary-200/60 dark:border-primary-700/60 z-50">
      <!-- Notch cutout behind button -->
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
              ? 'text-sand-700'
              : 'text-primary-400 dark:text-primary-500'
          ]"
        >
          <component :is="item.icon" :class="item.path === activePath ? 'w-6 h-6' : 'w-5 h-5'" />
          <span :class="['text-[10px] mt-1 leading-none', item.path === activePath ? 'font-bold' : 'font-medium']">{{ item.label }}</span>
        </button>

        <!-- Center button -->
        <div class="flex flex-col items-center w-20 -mt-10">
          <button
            @click="toggleFan"
            :class="[
              'go-button relative w-[68px] h-[68px] rounded-full flex items-center justify-center transition-all duration-200',
              fanOpen ? 'scale-90' : 'active:scale-90'
            ]"
          >
            <!-- Outer glow ring -->
            <div class="absolute inset-0 rounded-full bg-gradient-to-br from-sand-500 to-sand-700 opacity-30 blur-md scale-110"></div>
            <!-- Button body -->
            <div class="relative w-full h-full rounded-full bg-gradient-to-br from-sand-500 to-sand-700 flex items-center justify-center shadow-xl ring-4 ring-white/80 dark:ring-primary-900/80">
              <Transition
                enter-active-class="transition duration-200"
                enter-from-class="opacity-0 rotate-90"
                enter-to-class="opacity-100 rotate-0"
                leave-active-class="transition duration-150"
                leave-from-class="opacity-100 rotate-0"
                leave-to-class="opacity-0 rotate-90"
                mode="out-in"
              >
                <svg v-if="fanOpen" class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"/>
                </svg>
                <!-- Dumbbell icon -->
                <svg v-else class="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M6.5 6.5a2 2 0 013 0L13 10l-3.5 3.5a2 2 0 01-3-3L10 7l-3.5-.5z" fill="none" stroke="none"/>
                  <!-- bar -->
                  <line x1="8.5" y1="12" x2="15.5" y2="12" stroke-width="2.2"/>
                  <!-- left weight -->
                  <rect x="4" y="8.5" width="3" height="7" rx="1" stroke-width="1.8"/>
                  <rect x="2" y="10" width="2" height="4" rx="0.7" stroke-width="1.5"/>
                  <!-- right weight -->
                  <rect x="17" y="8.5" width="3" height="7" rx="1" stroke-width="1.8"/>
                  <rect x="20" y="10" width="2" height="4" rx="0.7" stroke-width="1.5"/>
                </svg>
              </Transition>
            </div>
          </button>
          <span class="text-[10px] font-medium text-primary-400 dark:text-primary-500 mt-1">{{ fanOpen ? 'Fermer' : 'Workout' }}</span>
        </div>

        <!-- Right items -->
        <button
          v-for="item in rightItems"
          :key="item.path"
          @click="navigateTo(item.path)"
          :class="[
            'flex flex-col items-center justify-center w-16 py-1 rounded-xl transition-colors',
            item.path === activePath
              ? 'text-sand-700'
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

const fanOpen = ref(false)

const toggleFan = () => {
  fanOpen.value = !fanOpen.value
}

const goTo = (path: string) => {
  fanOpen.value = false
  navigateTo(path)
}

const IconHome = () => h('svg', { class: 'w-6 h-6', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' })
])
const IconCalendar = () => h('svg', { class: 'w-6 h-6', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' })
])
const IconBody = () => h('svg', { class: 'w-6 h-6', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' })
])
const IconStats = () => h('svg', { class: 'w-6 h-6', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' })
])

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

.fan-arc {
  border-radius: 120px 120px 15px 15px / 120px 120px 15px 15px;
  clip-path: path('M 0 120 L 0 55 Q 120 -55 230 55 L 230 140 Q 120 45 0 140 Z');
}
</style>