<template>
  <div class="min-h-screen">
    <!-- Loading -->
    <div v-if="!pageReady" class="pb-28 lg:pb-20 flex items-center justify-center min-h-[60vh]">
      <div
        class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-200 dark:border-primary-700 border-t-sand-500"
      ></div>
    </div>

    <!-- Main Content -->
    <div v-else class="px-4 md:px-6 pb-28 lg:pb-20 max-w-7xl mx-auto">
      <!-- Page Header -->
      <div class="fade-in text-center mb-6 md:mb-8">
        <h1
          class="text-2xl md:text-3xl lg:text-4xl font-bold text-display bg-gradient-to-r from-sand-500 to-primary-900 dark:to-primary-100 bg-clip-text text-transparent mb-2"
        >
          {{ t('statistics.title') }}
        </h1>
        <p class="text-lg text-primary-600 dark:text-primary-400">
          {{ t('statistics.subtitle') }}
        </p>
      </div>

      <!-- Time Range Selector -->
      <div class="flex justify-center mb-8 fade-in">
        <div
          class="flex space-x-2 bg-white dark:bg-primary-900 bg-opacity-50 dark:bg-opacity-50 backdrop-blur-lg rounded-xl p-1"
        >
          <button
            v-for="range in timeRanges"
            :key="range.value || 'all'"
            @click="selectedTimeRange = range.value"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-semibold transition-all',
              selectedTimeRange === range.value
                ? 'bg-gradient-primary text-white shadow-sm'
                : 'text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100',
            ]"
          >
            {{ t(range.labelKey) }}
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="workoutStore.isLoading" class="text-center py-20">
        <div
          class="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary-300 dark:border-primary-600 border-t-primary-600 dark:border-t-primary-400"
        ></div>
        <p class="mt-4 text-primary-600 dark:text-primary-400 text-lg">
          {{ t('statistics.loading') }}
        </p>
      </div>

      <!-- Empty State - No Workouts -->
      <div v-else-if="!hasData && !selectedTimeRange" class="fade-in">
        <div class="card-glass text-center py-20 max-w-2xl mx-auto">
          <svg
            class="w-24 h-24 mx-auto mb-6 text-primary-300 dark:text-primary-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <h2 class="text-3xl font-bold text-primary-900 dark:text-primary-100 mb-4">
            {{ t('statistics.emptyTitle') }}
          </h2>
          <p class="text-lg text-primary-600 dark:text-primary-400 mb-8">
            {{ t('statistics.emptySubtitle') }}
          </p>
          <button @click="navigateTo('/workouts/start')" class="btn-primary px-8 py-4">
            {{ t('statistics.startWorkout') }}
          </button>
        </div>
      </div>

      <!-- Empty State - No Workouts in Time Range -->
      <div v-else-if="!hasData && selectedTimeRange" class="fade-in">
        <div class="card-glass text-center py-16">
          <p class="text-xl text-primary-600 dark:text-primary-400 mb-6">
            {{ t('statistics.emptyRange') }}
          </p>
          <button @click="selectedTimeRange = null" class="btn-outline">
            {{ t('statistics.showAll') }}
          </button>
        </div>
      </div>

      <!-- Statistics Content -->
      <div v-else class="space-y-8 md:space-y-10">
        <!-- L'essentiel : 4 chiffres, plus de redondance avec le reste -->
        <div class="flex justify-end -mb-4 slide-up">
          <StatsShareButton
            card-type="overview"
            :data="shareOverviewData"
            :user-name="authStore.fullName"
          />
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 md:gap-3 slide-up">
          <StatCard
            :title="t('statistics.totalVolume')"
            :value="overviewStats.totalVolume"
            format="weight"
            class="!p-3 md:!p-4"
          >
            <template #icon>
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M20 7h-9m0 10h9M8 12h13M3 7h1m0 5h1m0 5h1"
                />
              </svg>
            </template>
          </StatCard>
          <StatCard
            :title="t('statistics.workouts')"
            :value="overviewStats.totalWorkouts"
            class="!p-3 md:!p-4"
          >
            <template #icon>
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </template>
          </StatCard>
          <div v-if="mostRecentRecord" class="card-glass !p-3 md:!p-4 text-center">
            <div
              class="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center mb-3 mx-auto"
            >
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                />
              </svg>
            </div>
            <p class="text-xs sm:text-sm text-primary-600 dark:text-primary-400 mb-2">
              {{ t('statistics.latestRecord') }}
            </p>
            <p
              class="text-sm sm:text-base font-bold text-primary-900 dark:text-primary-100 mb-1 truncate"
            >
              {{ mostRecentRecord.exerciseName }}
            </p>
            <p class="text-xs text-primary-500 dark:text-primary-400">
              {{ mostRecentRecord.maxWeight }} kg
            </p>
          </div>
          <div
            v-else
            class="card-glass !p-3 md:!p-4 text-center flex flex-col items-center justify-center"
          >
            <p class="text-xs sm:text-sm text-primary-500 dark:text-primary-400">
              {{ t('statistics.noRecord') }}
            </p>
          </div>
          <StatsWeekComparisonCard
            title="Volume"
            :value="weekComparison.currentWeek.volume"
            :change="weekComparison.changes.volume"
            format="weight"
          />
        </div>

        <!-- Onglets : fusionne muscles/exercices/progression/records/objectifs -->
        <div class="slide-up">
          <div
            class="flex gap-2 overflow-x-auto pb-1 mb-6 border-b border-primary-100 dark:border-primary-800"
          >
            <button
              v-for="tab in statsTabs"
              :key="tab.key"
              @click="activeStatsTab = tab.key"
              :class="[
                'px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 -mb-px transition-colors',
                activeStatsTab === tab.key
                  ? 'border-sand-500 text-primary-900 dark:text-primary-100'
                  : 'border-transparent text-primary-500 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-200',
              ]"
            >
              {{ t(tab.labelKey) }}
            </button>
          </div>

          <!-- Onglet Muscles : fusionne repartition + top exercices (avant : 3 vues separees) -->
          <div v-if="activeStatsTab === 'muscles'" class="space-y-6">
            <div class="card-glass">
              <h4 class="text-lg font-semibold text-primary-900 dark:text-primary-100 mb-5">
                {{ t('statistics.muscleDistribution') }}
              </h4>
              <div v-if="muscleGroupBars.length" class="space-y-3">
                <div
                  v-for="bar in muscleGroupBars"
                  :key="bar.label"
                  class="flex items-center gap-3"
                >
                  <span
                    class="text-sm text-primary-600 dark:text-primary-400 w-28 flex-shrink-0 truncate"
                    >{{ bar.label }}</span
                  >
                  <div
                    class="flex-1 h-2 rounded-full bg-primary-100 dark:bg-primary-800 overflow-hidden"
                  >
                    <div
                      class="h-full rounded-full bg-gradient-primary transition-all duration-500"
                      :style="{ width: bar.pct + '%' }"
                    ></div>
                  </div>
                  <span
                    class="text-xs text-primary-400 dark:text-primary-500 w-10 text-right flex-shrink-0"
                    >{{ bar.pct }}%</span
                  >
                </div>
              </div>
              <p v-else class="text-primary-400 text-center py-8">Pas de données</p>
            </div>

            <div v-if="topExercises.length > 0" class="card-glass">
              <h4 class="text-lg font-semibold text-primary-900 dark:text-primary-100 mb-5">
                {{ t('statistics.favoriteExercises') }}
              </h4>
              <div class="space-y-3">
                <div
                  v-for="(exercise, index) in topExercises"
                  :key="exercise.name"
                  class="flex items-center justify-between p-3 bg-primary-50 dark:bg-primary-800 rounded-xl"
                >
                  <div class="flex items-center space-x-3">
                    <span
                      class="flex items-center justify-center w-7 h-7 bg-gradient-primary text-white font-bold rounded-lg text-xs"
                    >
                      {{ index + 1 }}
                    </span>
                    <p class="font-semibold text-primary-900 dark:text-primary-100 text-sm">
                      {{ exercise.name }}
                    </p>
                  </div>
                  <p class="text-sm text-primary-500 dark:text-primary-400">
                    {{ exercise.count }}x
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Onglet Progression : fusionne l'ancien double graphique en un seul avec detection de plateau -->
          <div v-if="activeStatsTab === 'progression'">
            <ClientOnly>
              <StatsProgressionChartFull
                v-if="workoutStore.workoutHistory.length > 0"
                :workouts="workoutStore.workoutHistory"
              />
            </ClientOnly>
          </div>

          <!-- Onglet Records -->
          <div v-if="activeStatsTab === 'records'">
            <div v-if="personalRecords && personalRecords.length > 0">
              <div class="flex justify-end mb-4">
                <StatsShareButton
                  card-type="records"
                  :data="{ records: personalRecords }"
                  :user-name="authStore.fullName"
                />
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div
                  v-for="record in personalRecords"
                  :key="record?.exerciseName || record?.exerciseId"
                  class="card-glass !p-6 flex items-start space-x-4"
                >
                  <div
                    class="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center flex-shrink-0"
                  >
                    <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                      />
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="font-bold text-primary-900 dark:text-primary-100 truncate">
                      {{ record?.exerciseName || t('statistics.unknownExercise') }}
                    </p>
                    <p
                      class="text-2xl font-bold bg-gradient-to-r from-sand-500 to-sand-700 bg-clip-text text-transparent"
                    >
                      {{ record?.maxWeight || 0 }} kg
                    </p>
                    <div
                      class="flex items-center space-x-3 text-sm text-primary-600 dark:text-primary-400 mt-1"
                    >
                      <span>{{ t('statistics.reps', { count: record?.reps || 0 }) }}</span>
                      <span>·</span>
                      <span>{{
                        record?.date ? formatDate(record.date) : t('statistics.unknownDate')
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="card-glass text-center py-16">
              <p class="text-primary-500 dark:text-primary-400">{{ t('statistics.noRecords') }}</p>
            </div>
          </div>

          <!-- Onglet Objectifs -->
          <div v-if="activeStatsTab === 'goals'" class="space-y-6">
            <div v-if="!isPremium && !canCreateGoal">
              <ProWall
                :title="t('statistics.proWallTitle')"
                :message="t('statistics.proWallMessage', { count: goalUsageText })"
                icon="target"
                compact
              />
            </div>

            <div class="flex items-center justify-end gap-2">
              <StatsShareButton
                v-if="goalStore.goals.length > 0"
                card-type="goals"
                :data="shareGoalsData"
                :user-name="authStore.fullName"
              />
              <span v-if="!isPremium" class="text-xs text-primary-500 dark:text-primary-400">{{
                goalUsageText
              }}</span>
              <button
                @click="handleNewGoal"
                :disabled="!canCreateGoal"
                class="btn-primary !py-2 !px-4 text-sm disabled:opacity-50"
              >
                + {{ t('statistics.newGoal') }}
              </button>
            </div>

            <div
              v-if="goalStore.activeGoals.length > 0"
              class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              <GoalsGoalCard
                v-for="goal in goalStore.activeGoals"
                :key="goal.id"
                :goal="goal"
                @delete="handleDeleteGoal"
              />
            </div>
            <div v-else class="card-glass text-center py-10">
              <p class="text-primary-500 dark:text-primary-400 mb-4">
                {{ t('statistics.noGoals') }}
              </p>
              <button
                @click="handleNewGoal"
                :disabled="!canCreateGoal"
                class="btn-outline text-sm disabled:opacity-50"
              >
                {{ t('statistics.createFirstGoal') }}
              </button>
            </div>

            <div v-if="goalStore.achievedGoals.length > 0">
              <h4 class="text-lg font-semibold text-primary-700 dark:text-primary-300 mb-3">
                {{ t('statistics.achievedGoals') }}
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <GoalsGoalCard
                  v-for="goal in goalStore.achievedGoals"
                  :key="goal.id"
                  :goal="goal"
                  @delete="handleDeleteGoal"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Wrapped CTA -->
      <div v-if="!workoutStore.isLoading && hasData" class="mt-8 md:mt-12 slide-up">
        <div class="card-glass">
          <div class="flex items-center gap-4">
            <div
              class="w-14 h-14 bg-gradient-primary rounded-2xl flex items-center justify-center flex-shrink-0"
            >
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-bold text-primary-900 dark:text-primary-100">
                {{ t('statistics.wrappedTitle') }}
              </h3>
              <p class="text-sm text-primary-600 dark:text-primary-400">
                {{ t('statistics.wrappedSubtitle') }}
              </p>
            </div>
            <button @click="navigateTo('/wrapped')" class="btn-primary text-sm">
              {{ t('statistics.view') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Goal Create Modal -->
    <GoalsGoalCreateModal
      :show="showGoalModal"
      :exercise-names="allExerciseNames"
      :current-weight="currentWeight"
      :current-body-fat="currentBodyFat"
      @close="showGoalModal = false"
      @created="handleCreateGoal"
    />

    <MobileBottomNav active-path="/statistics" />
  </div>
</template>

<script setup lang="ts">
import { useWorkoutStore } from '~/stores/workout';
import { useAuthStore } from '~/stores/auth';
import { useGoalStore } from '~/stores/goals';
import { useBodyStore } from '~/stores/body';
import { useSubscriptionStore } from '~/stores/subscription';
import { useSubscriptionLimits } from '~/composables/useSubscriptionLimits';
import StatCard from '~/components/stats/StatCard.vue';
import StatsProgressionChartFull from '~/components/stats/ProgressionChart.vue';
import type { TimeRange } from '~/types/statistics';
import type { CreateGoalPayload } from '~/types/goals';

useHead({ meta: [{ name: 'robots', content: 'noindex, nofollow' }] });

const { locale, t } = useLocale();
const workoutStore = useWorkoutStore();
const authStore = useAuthStore();
const goalStore = useGoalStore();
const pageReady = ref(false);
const bodyStore = useBodyStore();
const subscriptionStore = useSubscriptionStore();
const { isPremium, canCreateGoal, goalUsageText, fetchUsage } = useSubscriptionLimits();
const toast = useToast();

const selectedTimeRange = ref<TimeRange>(null);
const showGoalModal = ref(false);
const activeStatsTab = ref<'muscles' | 'progression' | 'records' | 'goals'>('muscles');

const statsTabs = computed(() => [
  { key: 'muscles' as const, labelKey: 'statistics.tab.muscles' },
  { key: 'progression' as const, labelKey: 'statistics.tab.progression' },
  { key: 'records' as const, labelKey: 'statistics.tab.records' },
  { key: 'goals' as const, labelKey: 'statistics.tab.goals' },
]);

const timeRanges = computed(() => [
  { labelKey: 'statistics.range.7d', value: 7 as TimeRange },
  { labelKey: 'statistics.range.30d', value: 30 as TimeRange },
  { labelKey: 'statistics.range.90d', value: 90 as TimeRange },
  { labelKey: 'statistics.range.all', value: null },
]);

onMounted(async () => {
  await Promise.all([
    workoutStore.fetchWorkouts(),
    goalStore.fetchGoals(),
    bodyStore.fetchBodyStats(),
    subscriptionStore.fetchSubscription(),
    fetchUsage(),
  ]);
  pageReady.value = true;
});

const {
  overviewStats,
  muscleGroupData,
  topExercises,
  personalRecords,
  weekComparison,
  allExerciseNames,
  hasData,
} = useStatistics(
  computed(() => workoutStore.workoutHistory),
  selectedTimeRange
);

// Le record le plus recent (personalRecords est trie par poids, on re-trie par date)
const mostRecentRecord = computed(() => {
  if (!personalRecords.value.length) return null;
  return (
    [...personalRecords.value]
      .filter((r) => r.date)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] ?? null
  );
});

// Repartition par groupe musculaire en pourcentage, pour l'affichage en barres simples
const muscleGroupBars = computed(() => {
  const ds = muscleGroupData.value.datasets?.[0]?.data as number[] | undefined;
  const labels = muscleGroupData.value.labels as string[] | undefined;
  if (!ds || !labels || ds.length === 0) return [];
  const total = ds.reduce((s, v) => s + v, 0) || 1;
  return labels.map((label, i) => ({
    label,
    pct: Math.round(((ds[i] || 0) / total) * 100),
  }));
});

const shareOverviewData = computed(() => ({
  totalWorkouts: overviewStats.value.totalWorkouts,
  totalVolume: overviewStats.value.totalVolume.toLocaleString(
    locale.value === 'en' ? 'en-US' : 'fr-FR'
  ),
  streak: overviewStats.value.currentStreak,
  period: timeRangeLabel.value,
}));

const shareGoalsData = computed(() => ({
  goals: goalStore.goals.map((g) => ({
    title: g.title,
    achieved: g.achieved,
    targetValue: g.targetValue,
    progress: g.progress ?? 0,
    unit: g.type === 'WEIGHT' ? 'kg' : g.type === 'BODY_FAT' ? '%' : 'kg',
  })),
}));

const timeRangeLabel = computed(() => {
  if (!selectedTimeRange.value) return t('statistics.rangeAll');
  return t('statistics.rangeLabel', { count: selectedTimeRange.value });
});

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(locale.value === 'en' ? 'en-US' : 'fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

const currentWeight = computed(() => bodyStore.latestWeight?.weight ?? null);
const currentBodyFat = computed(() => bodyStore.latestWeight?.bodyFat ?? null);

const handleCreateGoal = async (payload: CreateGoalPayload) => {
  try {
    await goalStore.addGoal(payload);
    showGoalModal.value = false;
    toast.success('Objectif créé');
  } catch {
    toast.error('Erreur lors de la création');
  }
};

const handleNewGoal = () => {
  if (!canCreateGoal.value) {
    toast.error('Limite atteinte', "Passez Pro pour créer plus d'objectifs");
    return;
  }
  showGoalModal.value = true;
};

const handleDeleteGoal = async (id: number) => {
  try {
    await goalStore.removeGoal(id);
    toast.success('Objectif supprimé');
  } catch {
    toast.error('Erreur lors de la suppression');
  }
};

definePageMeta({
  middleware: 'auth',
});
</script>
