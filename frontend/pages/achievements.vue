<template>
  <div class="min-h-screen">
    <!-- Navigation -->
    <TopNav />

    <div class="pt-24 md:pt-32 px-4 md:px-6 pb-28 lg:pb-20 max-w-6xl mx-auto">
      <!-- Page Header -->
      <div class="fade-in text-center mb-6">
        <h1 class="text-3xl md:text-5xl lg:text-6xl font-bold text-display bg-gradient-to-r from-sand-500 to-primary-900 dark:to-primary-100 bg-clip-text text-transparent mb-2">
          Badges
        </h1>
        <p v-if="stats" class="text-lg text-primary-600 dark:text-primary-400">
          {{ stats.unlocked }}/{{ stats.total }} badges &mdash; {{ stats.totalXP }} XP
        </p>
      </div>

      <!-- Loading skeleton -->
      <template v-if="loading">
        <!-- Skeleton progress bar -->
        <div class="max-w-md mx-auto mb-8">
          <div class="h-4 bg-primary-200 dark:bg-primary-800 rounded-full animate-pulse"></div>
        </div>
        <!-- Skeleton tabs -->
        <div class="flex gap-2 justify-center mb-8">
          <div v-for="i in 5" :key="i" class="h-9 w-20 bg-primary-200 dark:bg-primary-800 rounded-full animate-pulse"></div>
        </div>
        <!-- Skeleton grid -->
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          <div
            v-for="i in 8"
            :key="i"
            class="card-glass animate-pulse"
          >
            <div class="flex flex-col items-center text-center p-2">
              <div class="w-14 h-14 bg-primary-200 dark:bg-primary-700 rounded-2xl mb-3"></div>
              <div class="h-4 w-24 bg-primary-200 dark:bg-primary-700 rounded mb-2"></div>
              <div class="h-3 w-32 bg-primary-200 dark:bg-primary-700 rounded mb-3"></div>
              <div class="h-2.5 w-full bg-primary-200 dark:bg-primary-700 rounded-full"></div>
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <!-- Overall progress bar -->
        <div v-if="stats" class="max-w-md mx-auto mb-8 fade-in">
          <div class="flex items-center justify-between text-sm text-primary-600 dark:text-primary-400 mb-2">
            <span>Progression globale</span>
            <span class="font-semibold">{{ overallPercent }}%</span>
          </div>
          <div class="h-4 bg-primary-200 dark:bg-primary-800 rounded-full overflow-hidden">
            <div
              class="h-full rounded-full bg-gradient-to-r from-sand-500 to-sand-700 transition-all duration-700"
              :style="{ width: `${overallPercent}%` }"
            ></div>
          </div>
        </div>

        <!-- Filter tabs -->
        <div class="flex flex-wrap gap-2 justify-center mb-8 slide-up">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="activeTab = tab.key"
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium transition-all',
              activeTab === tab.key
                ? 'bg-gradient-primary text-white shadow-lg'
                : 'btn-glass'
            ]"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- Empty state -->
        <div v-if="filteredAchievements.length === 0" class="text-center py-16">
          <Icon name="lucide:medal" class="w-12 h-12 mx-auto mb-4 text-primary-300" />
          <p class="text-primary-600 dark:text-primary-400">Aucun badge dans cette catégorie</p>
        </div>

        <!-- Achievement grid -->
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 slide-up">
          <div
            v-for="achievement in filteredAchievements"
            :key="achievement.id"
            :class="[
              'relative rounded-2xl border-2 p-4 transition-all duration-300',
              achievement.unlocked
                ? 'achievement-unlocked border-sand-500/60 dark:border-sand-600/60 bg-gradient-to-b from-sand-500/10 to-sand-600/10 dark:from-sand-500/8 dark:to-sand-600/8'
                : 'border-primary-200 dark:border-primary-700 bg-white/60 dark:bg-primary-800/60 opacity-65'
            ]"
          >
            <div class="flex flex-col items-center text-center">
              <!-- Icon -->
              <div
                :class="[
                  'w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mb-3 transition-all',
                  achievement.unlocked
                    ? 'bg-gradient-primary shadow-lg text-white'
                    : 'bg-primary-100 dark:bg-primary-700/50 text-primary-400 dark:text-primary-500'
                ]"
              >
                <Icon :name="achievement.icon" class="w-7 h-7 md:w-8 md:h-8" />
              </div>

              <!-- Name -->
              <h3 :class="[
                'text-sm md:text-base font-bold mb-1 leading-tight',
                achievement.unlocked
                  ? 'text-primary-900 dark:text-primary-100'
                  : 'text-primary-500 dark:text-primary-500'
              ]">
                {{ achievement.name }}
              </h3>

              <!-- Description -->
              <p class="text-xs text-primary-500 dark:text-primary-400 mb-3 leading-snug line-clamp-2">
                {{ achievement.description }}
              </p>

              <!-- XP badge -->
              <div
                :class="[
                  'inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full mb-3',
                  achievement.unlocked
                    ? 'bg-sand-500/20 text-sand-700 dark:text-sand-400'
                    : 'bg-primary-100 dark:bg-primary-700/50 text-primary-500 dark:text-primary-400'
                ]"
              >
                +{{ achievement.xp }} XP
              </div>

              <!-- Progress bar (locked) -->
              <div v-if="!achievement.unlocked" class="w-full">
                <div class="h-2 bg-primary-200 dark:bg-primary-700 rounded-full overflow-hidden">
                  <div
                    class="h-full rounded-full bg-primary-400 dark:bg-primary-500 transition-all duration-500"
                    :style="{ width: `${achievement.progress.percent}%` }"
                  ></div>
                </div>
                <p class="text-[10px] md:text-xs text-primary-400 mt-1">
                  {{ formatProgress(achievement.progress.current) }} / {{ formatProgress(achievement.progress.target) }}
                </p>
              </div>

              <!-- Unlocked date -->
              <p v-else class="text-[10px] md:text-xs text-sand-700 dark:text-sand-500 font-medium">
                Débloqué le {{ formatDate(achievement.unlockedAt) }}
              </p>
            </div>
          </div>
        </div>
      </template>
    </div>

    <MobileBottomNav active-path="/achievements" />
  </div>
</template>

<script setup lang="ts">
import TopNav from '~/components/TopNav.vue'
import { useAchievementApi, type Achievement } from '~/composables/useAchievementApi'

useHead({ meta: [{ name: 'robots', content: 'noindex, nofollow' }] })

definePageMeta({
  middleware: ['auth']
})

const achievementApi = useAchievementApi()

const loading = ref(true)
const achievements = ref<Achievement[]>([])
const stats = ref<{ total: number; unlocked: number; totalXP: number } | null>(null)
const activeTab = ref<string>('all')

const tabs = [
  { key: 'all', label: 'Tous' },
  { key: 'WORKOUT', label: 'Séances' },
  { key: 'VOLUME', label: 'Volume' },
  { key: 'STREAK', label: 'Streak' },
  { key: 'PR', label: 'Records' },
  { key: 'BODY', label: 'Corps' },
  { key: 'MILESTONE', label: 'Étapes' },
  { key: 'SOCIAL', label: 'Social' },
]

const overallPercent = computed(() => {
  if (!stats.value || stats.value.total === 0) return 0
  return Math.round((stats.value.unlocked / stats.value.total) * 100)
})

const filteredAchievements = computed(() => {
  const list = activeTab.value === 'all'
    ? achievements.value
    : achievements.value.filter(a => a.category === activeTab.value)

  // Unlocked first, then by progress percent descending
  return [...list].sort((a, b) => {
    if (a.unlocked && !b.unlocked) return -1
    if (!a.unlocked && b.unlocked) return 1
    if (a.unlocked && b.unlocked) {
      return new Date(b.unlockedAt || 0).getTime() - new Date(a.unlockedAt || 0).getTime()
    }
    return b.progress.percent - a.progress.percent
  })
})

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

const formatProgress = (value: number) => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(value >= 10_000 ? 0 : 1)}k`
  return value.toString()
}

onMounted(async () => {
  try {
    const data = await achievementApi.getAchievements()
    achievements.value = data.achievements
    stats.value = data.stats
  } catch (e) {
    logger.error('Failed to load achievements:', e)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.achievement-unlocked {
  box-shadow: 0 0 20px rgba(194, 166, 110, 0.15), 0 0 40px rgba(194, 166, 110, 0.08);
}

.dark .achievement-unlocked {
  box-shadow: 0 0 20px rgba(194, 166, 110, 0.2), 0 0 40px rgba(194, 166, 110, 0.1);
}

.achievement-unlocked:hover {
  box-shadow: 0 0 25px rgba(194, 166, 110, 0.25), 0 0 50px rgba(194, 166, 110, 0.12);
  transform: translateY(-2px);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
