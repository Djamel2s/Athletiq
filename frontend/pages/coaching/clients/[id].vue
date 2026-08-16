<template>
  <div class="min-h-screen">
    <div class="pb-28 lg:pb-20 max-w-7xl mx-auto">
      <div class="flex px-4 md:px-4 pt-4">
        <CoachSidebar active="/coaching/clients" />

        <div class="flex-1 min-w-0 px-4 md:px-0">
          <div class="flex items-center gap-3 mb-6 fade-in">
            <NuxtLink
              to="/coaching/clients"
              class="btn-glass w-8 h-8 !rounded-lg !p-0 flex items-center justify-center flex-shrink-0"
            >
              <Icon
                name="lucide:arrow-left"
                class="w-5 h-5 text-primary-600 dark:text-primary-400"
              />
            </NuxtLink>
            <div
              class="w-9 h-9 rounded-full overflow-hidden flex-shrink-0"
              :class="
                overview?.athlete?.avatarUrl
                  ? ''
                  : 'bg-gradient-primary flex items-center justify-center'
              "
            >
              <img
                v-if="overview?.athlete?.avatarUrl"
                :src="overview.athlete.avatarUrl"
                alt=""
                class="w-full h-full object-cover"
              />
              <span v-else class="text-white text-xs font-bold">
                {{ (overview?.athlete?.firstName?.charAt(0) || '?').toUpperCase() }}
              </span>
            </div>
            <h1 class="text-xl font-bold text-primary-900 dark:text-primary-100">
              {{ overview?.athlete?.firstName || t('coaching.client') }}
              {{ overview?.athlete?.lastName || '' }}
            </h1>
          </div>

          <div v-if="loading" class="text-center py-20">
            <div
              class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-300 dark:border-primary-600 border-t-primary-600 dark:border-t-primary-400"
            ></div>
          </div>

          <template v-else-if="overview">
            <!-- Permission notice -->
            <div
              v-if="!overview.permissions.canViewWorkouts"
              class="card-glass !p-4 mb-6 text-xs text-primary-500 dark:text-primary-400 flex items-center gap-2"
            >
              <Icon name="lucide:lock" class="w-4 h-4 flex-shrink-0" />
              {{ t('coaching.noWorkoutAccess') }}
            </div>

            <template v-else>
              <!-- Stats clefs : observance + tendance + volume -->
              <div class="grid grid-cols-3 gap-3 mb-6 slide-up">
                <div class="card-glass !p-4 text-center">
                  <p class="text-2xl font-bold text-primary-900 dark:text-primary-100">
                    {{ clientSummary?.sessionsThisWeek ?? 0
                    }}<span class="text-primary-400 text-base"
                      >/{{ clientSummary?.weeklyTarget ?? '—' }}</span
                    >
                  </p>
                  <p class="text-xs text-primary-500 dark:text-primary-400 mt-1">
                    {{ t('coach.client.thisWeek') }}
                  </p>
                </div>
                <div class="card-glass !p-4 text-center">
                  <div class="flex items-center justify-center gap-1.5">
                    <Icon
                      v-if="clientSummary?.volumeTrend"
                      :name="trendIcon"
                      class="w-5 h-5"
                      :class="trendColor"
                    />
                    <p class="text-lg font-bold" :class="trendColor">{{ trendLabel }}</p>
                  </div>
                  <p class="text-xs text-primary-500 dark:text-primary-400 mt-1">
                    {{ t('coach.client.volumeTrend') }}
                  </p>
                </div>
                <div class="card-glass !p-4 text-center">
                  <p class="text-2xl font-bold text-primary-900 dark:text-primary-100">
                    {{ overview.totalWorkouts ?? '—' }}
                  </p>
                  <p class="text-xs text-primary-500 dark:text-primary-400 mt-1">
                    {{ t('streak.totalSessions') }}
                  </p>
                </div>
              </div>
            </template>

            <!-- Onglets -->
            <div
              class="flex gap-2 overflow-x-auto pb-1 mb-5 border-b border-primary-100 dark:border-primary-800 slide-up"
            >
              <button
                v-for="tab in tabs"
                :key="tab.key"
                @click="activeTab = tab.key"
                class="px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 -mb-px transition-colors"
                :class="
                  activeTab === tab.key
                    ? 'border-sand-500 text-primary-900 dark:text-primary-100'
                    : 'border-transparent text-primary-500 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-200'
                "
              >
                {{ tab.label }}
              </button>
            </div>

            <!-- Onglet Progression -->
            <div v-if="activeTab === 'progression'">
              <div
                v-if="!overview.permissions.canViewWorkouts"
                class="card-glass !p-6 text-center text-sm text-primary-400"
              >
                {{ t('coaching.noWorkoutAccess') }}
              </div>
              <div
                v-else-if="!workoutsRef.length"
                class="card-glass !p-6 text-center text-sm text-primary-400"
              >
                {{ t('coaching.noSessionLogged') }}
              </div>
              <ClientOnly v-else>
                <StatsProgressionChartFull :workouts="workoutsRef" />
              </ClientOnly>
            </div>

            <!-- Onglet Muscles / exercices favoris -->
            <div v-if="activeTab === 'muscles'" class="space-y-6">
              <div class="card-glass">
                <h4 class="text-lg font-semibold text-primary-900 dark:text-primary-100 mb-5">
                  {{ t('coach.client.muscleBreakdown') }}
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
                <p v-else class="text-primary-400 text-center py-8 text-sm">
                  {{ t('coaching.noSessionLogged') }}
                </p>
              </div>

              <div v-if="topExercises.length" class="card-glass">
                <h4 class="text-lg font-semibold text-primary-900 dark:text-primary-100 mb-5">
                  {{ t('coach.client.topExercises') }}
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

            <!-- Onglet Records -->
            <div v-if="activeTab === 'records'">
              <div
                v-if="personalRecords.length === 0"
                class="card-glass !p-8 text-center text-sm text-primary-400"
              >
                {{ t('coach.client.noRecords') }}
              </div>
              <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  v-for="record in personalRecords"
                  :key="record?.exerciseName"
                  class="card-glass !p-5 flex items-start space-x-4"
                >
                  <div
                    class="w-11 h-11 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center flex-shrink-0"
                  >
                    <Icon name="lucide:trophy" class="w-5 h-5 text-white" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="font-bold text-primary-900 dark:text-primary-100 truncate text-sm">
                      {{ record?.exerciseName }}
                    </p>
                    <p
                      class="text-xl font-bold bg-gradient-to-r from-sand-500 to-sand-700 bg-clip-text text-transparent"
                    >
                      {{ record?.maxWeight || 0 }} kg
                    </p>
                    <p class="text-xs text-primary-500 dark:text-primary-400">
                      {{ record?.reps || 0 }} reps
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Onglet Programme -->
            <div v-if="activeTab === 'program'" class="space-y-6">
              <div class="card-glass !p-5">
                <h2 class="text-sm font-semibold text-primary-900 dark:text-primary-100 mb-3">
                  {{ t('coaching.assignProgram') }}
                </h2>
                <div
                  v-if="!overview.permissions.canAssignPrograms"
                  class="text-xs text-primary-400"
                >
                  {{ t('coaching.noAssignAccess') }}
                </div>
                <div v-else class="flex gap-2">
                  <select v-model="selectedProgramSlug" class="input-primary flex-1 text-sm">
                    <option value="" disabled>{{ t('coaching.chooseProgram') }}</option>
                    <option v-for="p in programs" :key="p.slug" :value="p.slug">
                      {{ p.name }} ({{ p.daysPerWeek }}j/sem)
                    </option>
                  </select>
                  <button
                    @click="handleAssign"
                    :disabled="!selectedProgramSlug || assigning"
                    class="btn-primary !px-4 !py-2 text-sm font-semibold disabled:opacity-50"
                  >
                    <Icon v-if="assigning" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
                    <span v-else>{{ t('coaching.assign') }}</span>
                  </button>
                </div>
              </div>

              <div v-if="overview.permissions.canViewWorkouts">
                <h2 class="text-sm font-semibold text-primary-900 dark:text-primary-100 mb-3">
                  {{ t('coaching.recentSessions') }}
                </h2>
                <div
                  v-if="!overview.recentWorkouts?.length"
                  class="card-glass !p-4 text-center text-xs text-primary-400"
                >
                  {{ t('coaching.noSessionLogged') }}
                </div>
                <div v-else class="space-y-2">
                  <div
                    v-for="w in overview.recentWorkouts.slice(0, 10)"
                    :key="w.id"
                    class="p-3 rounded-xl bg-white/40 dark:bg-primary-800/40"
                  >
                    <div class="flex items-center justify-between">
                      <p class="text-sm font-semibold text-primary-900 dark:text-primary-100">
                        {{ w.name }}
                      </p>
                      <p class="text-xs text-primary-400">
                        {{ formatDate(w.completedAt || w.date) }}
                      </p>
                    </div>
                    <p class="text-xs text-primary-500 dark:text-primary-400 mt-0.5">
                      {{
                        t('shared.exerciseCount', {
                          count: w.exercises?.length || 0,
                          plural: (w.exercises?.length || 0) > 1 ? 's' : '',
                        })
                      }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Onglet Notes -->
            <div v-if="activeTab === 'notes'">
              <form @submit.prevent="handleAddNote" class="flex gap-2 mb-4">
                <input
                  v-model="noteContent"
                  type="text"
                  :placeholder="t('coaching.addNotePlaceholder')"
                  class="input-primary flex-1 text-sm"
                />
                <button
                  type="submit"
                  :disabled="!noteContent.trim() || addingNote"
                  class="btn-glass !px-4 !py-2 !rounded-xl font-semibold disabled:opacity-50"
                >
                  <Icon v-if="addingNote" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
                  <Icon v-else name="lucide:plus" class="w-4 h-4" />
                </button>
              </form>
              <div v-if="notes.length" class="space-y-2">
                <div
                  v-for="note in notes"
                  :key="note.id"
                  class="p-3 rounded-xl bg-white/40 dark:bg-primary-800/40 text-sm text-primary-800 dark:text-primary-200"
                >
                  {{ note.content }}
                  <p class="text-xs text-primary-400 mt-1">{{ formatDate(note.createdAt) }}</p>
                </div>
              </div>
              <div v-else class="card-glass !p-6 text-center text-sm text-primary-400">
                {{ t('coach.client.noNotes') }}
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <CoachMobileNav active="/coaching/clients" />
  </div>
</template>

<script setup lang="ts">
import { useCoachingApi, type CoachClientSummary } from '~/composables/useCoachingApi';
import { useProgramApi } from '~/composables/useProgramApi';
import StatsProgressionChartFull from '~/components/stats/ProgressionChart.vue';
import type { Workout } from '~/types/workout';

const { t } = useLocale();

definePageMeta({
  layout: false,
  middleware: 'auth',
});

useHead({ meta: [{ name: 'robots', content: 'noindex, nofollow' }] });

const route = useRoute();
const toast = useToast();
const { getClientOverview, getClients, assignProgram, addNote, getClientNotes } = useCoachingApi();
const { getPrograms } = useProgramApi();

const athleteId = Number(route.params.id);

const loading = ref(true);
const overview = ref<any>(null);
const clientSummary = ref<CoachClientSummary | null>(null);
const programs = ref<any[]>([]);
const selectedProgramSlug = ref('');
const assigning = ref(false);
const noteContent = ref('');
const addingNote = ref(false);
const notes = ref<any[]>([]);
const activeTab = ref<'progression' | 'muscles' | 'records' | 'program' | 'notes'>('progression');

const tabs = computed(() => [
  { key: 'progression' as const, label: t('coach.client.tabProgression') },
  { key: 'muscles' as const, label: t('coach.client.tabMuscles') },
  { key: 'records' as const, label: t('coach.client.tabRecords') },
  { key: 'program' as const, label: t('coach.client.tabProgram') },
  { key: 'notes' as const, label: t('coach.client.tabNotes') },
]);

// Reutilise la meme logique de calcul que le cote athlete (useStatistics),
// nourrie avec les seances du client plutot que celles du coach lui-meme.
const workoutsRef = computed<Workout[]>(() => overview.value?.recentWorkouts ?? []);
const noTimeRange = ref(null);
const { muscleGroupData, topExercises, personalRecords } = useStatistics(workoutsRef, noTimeRange);

const muscleGroupBars = computed(() => {
  const ds = muscleGroupData.value.datasets?.[0]?.data as number[] | undefined;
  const labels = muscleGroupData.value.labels as string[] | undefined;
  if (!ds || !labels || ds.length === 0) return [];
  const total = ds.reduce((s, v) => s + v, 0) || 1;
  return labels.map((label, i) => ({ label, pct: Math.round(((ds[i] || 0) / total) * 100) }));
});

const trendIcon = computed(() => {
  if (clientSummary.value?.volumeTrend === 'up') return 'lucide:trending-up';
  if (clientSummary.value?.volumeTrend === 'down') return 'lucide:trending-down';
  return 'lucide:minus';
});
const trendColor = computed(() => {
  if (clientSummary.value?.volumeTrend === 'up') return 'text-green-500';
  if (clientSummary.value?.volumeTrend === 'down') return 'text-red-500';
  return 'text-primary-400';
});
const trendLabel = computed(() => {
  const v = clientSummary.value?.volumeTrend;
  if (v === 'up') return t('coach.client.trendUp');
  if (v === 'down') return t('coach.client.trendDown');
  if (v === 'flat') return t('coach.client.trendFlat');
  return '—';
});

async function load() {
  loading.value = true;
  try {
    const [ov, progs, notesRes, clientsRes] = await Promise.all([
      getClientOverview(athleteId),
      getPrograms().catch(() => []),
      getClientNotes(athleteId).catch(() => ({ notes: [] })),
      getClients().catch(() => ({ clients: [] })),
    ]);
    overview.value = ov;
    programs.value = progs;
    notes.value = notesRes.notes;
    clientSummary.value = clientsRes.clients.find((c) => c.athlete.id === athleteId) || null;
  } catch (e: any) {
    toast.error(t('common.error'), e?.data?.error || t('coaching.errorLoadClient'));
  } finally {
    loading.value = false;
  }
}

async function handleAssign() {
  if (!selectedProgramSlug.value) return;
  assigning.value = true;
  try {
    await assignProgram(athleteId, selectedProgramSlug.value);
    toast.success(t('coaching.toastAssigned'), t('coaching.toastAssignedDesc'));
    selectedProgramSlug.value = '';
    await load();
  } catch (e: any) {
    toast.error(t('common.error'), e?.data?.error || t('coaching.errorAssign'));
  } finally {
    assigning.value = false;
  }
}

async function handleAddNote() {
  if (!noteContent.value.trim()) return;
  addingNote.value = true;
  try {
    await addNote(athleteId, noteContent.value.trim());
    noteContent.value = '';
    const res = await getClientNotes(athleteId);
    notes.value = res.notes;
  } catch (e: any) {
    toast.error(t('common.error'), e?.data?.error || t('coaching.errorAddNote'));
  } finally {
    addingNote.value = false;
  }
}

function formatDate(date: string) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

onMounted(load);
</script>
