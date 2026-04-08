<template>
  <Transition name="fade-slide">
    <!-- Loading skeleton -->
    <div v-if="loading" class="card-glass !p-4 space-y-3">
      <div class="flex items-center gap-2 mb-3">
        <div class="w-8 h-8 rounded-lg bg-primary-200 dark:bg-primary-700 animate-pulse"></div>
        <div class="h-4 w-24 rounded bg-primary-200 dark:bg-primary-700 animate-pulse"></div>
      </div>
      <div v-for="i in 2" :key="i" class="rounded-xl bg-primary-100 dark:bg-primary-800/50 p-3 space-y-2 animate-pulse">
        <div class="h-3 w-32 rounded bg-primary-200 dark:bg-primary-700"></div>
        <div class="h-3 w-full rounded bg-primary-200 dark:bg-primary-700"></div>
      </div>
    </div>

    <!-- Content -->
    <div v-else-if="insights.length > 0" class="card-glass !p-4">
      <!-- Header -->
      <div class="flex items-center gap-2 mb-3">
        <div class="w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h3 class="text-sm font-bold text-primary-900 dark:text-primary-100">Coach</h3>
      </div>

      <!-- Insights list -->
      <div class="space-y-2">
        <div
          v-for="insight in visibleInsights"
          :key="insight.id"
          class="rounded-xl p-3 transition-colors"
          :class="cardBg(insight.type)"
        >
          <div class="flex items-start gap-2.5">
            <span class="text-base flex-shrink-0 mt-0.5">{{ insight.icon }}</span>
            <div class="min-w-0">
              <p class="text-xs font-bold leading-tight" :class="titleColor(insight.type)">
                {{ insight.title }}
              </p>
              <p class="text-xs mt-0.5 leading-relaxed" :class="messageColor(insight.type)">
                {{ insight.message }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Expand / Collapse button -->
      <button
        v-if="insights.length > 2"
        @click="expanded = !expanded"
        class="mt-2 w-full text-center text-xs font-medium text-primary-500 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors py-1"
      >
        {{ expanded ? 'Voir moins' : `Voir plus (${insights.length - 2})` }}
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useCoachApi, type CoachInsight } from '~/composables/useCoachApi'

const { getInsights } = useCoachApi()

const insights = ref<CoachInsight[]>([])
const loading = ref(true)
const expanded = ref(false)

const visibleInsights = computed(() => {
  return expanded.value ? insights.value : insights.value.slice(0, 2)
})

const cardBg = (type: CoachInsight['type']) => {
  switch (type) {
    case 'warning':
      return 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200/50 dark:border-amber-700/30'
    case 'tip':
      return 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-700/30'
    case 'encouragement':
      return 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200/50 dark:border-emerald-700/30'
  }
}

const titleColor = (type: CoachInsight['type']) => {
  switch (type) {
    case 'warning':
      return 'text-amber-800 dark:text-amber-300'
    case 'tip':
      return 'text-blue-800 dark:text-blue-300'
    case 'encouragement':
      return 'text-emerald-800 dark:text-emerald-300'
  }
}

const messageColor = (type: CoachInsight['type']) => {
  switch (type) {
    case 'warning':
      return 'text-amber-700 dark:text-amber-400'
    case 'tip':
      return 'text-blue-700 dark:text-blue-400'
    case 'encouragement':
      return 'text-emerald-700 dark:text-emerald-400'
  }
}

onMounted(async () => {
  try {
    const data = await getInsights()
    insights.value = data.insights
  } catch {
    // Silent error - widget simply won't show
    insights.value = []
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
