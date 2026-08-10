<template>
  <div class="min-h-screen">
    <!-- TopNav is rendered globally in app.vue -->

    <!-- Main Content -->
    <div class="px-4 md:px-6 pb-28 lg:pb-20 max-w-7xl mx-auto">
      <!-- Page Header -->
      <div class="fade-in text-center mb-10">
        <h1
          class="text-3xl md:text-5xl lg:text-6xl font-bold text-display bg-gradient-to-r from-sand-500 to-primary-900 dark:to-primary-100 bg-clip-text text-transparent mb-3"
        >
          {{ t('programs.title') }}
        </h1>
        <p class="text-lg text-primary-600 dark:text-primary-400 max-w-2xl mx-auto">
          {{ t('programs.subtitle') }}
        </p>
      </div>

      <!-- Filter tabs -->
      <div class="flex flex-wrap justify-center gap-2 mb-8">
        <button
          v-for="cat in categories"
          :key="cat.key"
          @click="activeCategory = cat.key"
          :class="[
            'px-4 py-2 rounded-full text-sm font-medium transition-all',
            activeCategory === cat.key
              ? 'bg-gradient-primary text-white shadow-md'
              : 'bg-white/60 dark:bg-primary-800/60 text-primary-600 dark:text-primary-400 hover:bg-white dark:hover:bg-primary-700/60 border border-primary-200/60 dark:border-primary-700/60',
          ]"
        >
          <Icon :name="cat.icon" class="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
          {{ t(cat.labelKey) }}
        </button>
      </div>

      <!-- Loading Skeleton -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          v-for="i in 6"
          :key="i"
          class="rounded-2xl border border-primary-200/60 dark:border-primary-700/60 bg-white/70 dark:bg-primary-800/70 overflow-hidden animate-pulse"
        >
          <div class="h-1.5 bg-primary-200 dark:bg-primary-700"></div>
          <div class="p-6">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-12 h-12 rounded-xl bg-primary-200 dark:bg-primary-700"></div>
              <div class="flex-1">
                <div class="h-5 w-3/4 rounded bg-primary-200 dark:bg-primary-700 mb-2"></div>
                <div class="h-3 w-1/2 rounded bg-primary-100 dark:bg-primary-700/60"></div>
              </div>
            </div>
            <div class="h-4 w-full rounded bg-primary-100 dark:bg-primary-700/60 mb-2"></div>
            <div class="h-4 w-2/3 rounded bg-primary-100 dark:bg-primary-700/60"></div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="card-glass border-l-4 border-red-500 bg-red-50 dark:bg-red-900/30 text-center py-12"
      >
        <svg
          class="w-16 h-16 mx-auto mb-4 text-red-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
        <p class="text-red-700 dark:text-red-400 mb-4">{{ error }}</p>
        <button @click="loadPrograms" class="btn-outline">{{ t('programs.retry') }}</button>
      </div>

      <!-- Programs by category -->
      <div v-else class="space-y-12 slide-up">
        <section v-for="group in filteredGroups" :key="group.key">
          <!-- Section header -->
          <div class="flex items-center gap-3 mb-5">
            <div
              class="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center text-white"
            >
              <Icon :name="group.icon" class="w-5 h-5" />
            </div>
            <div>
              <h2 class="text-xl font-bold text-primary-900 dark:text-primary-100">
                {{ group.label }}
              </h2>
              <p class="text-sm text-primary-500 dark:text-primary-400">{{ group.description }}</p>
            </div>
            <span
              class="ml-auto text-xs font-medium text-primary-400 dark:text-primary-500 bg-primary-100 dark:bg-primary-800 px-2.5 py-1 rounded-full"
            >
              {{ group.programs.length }}
            </span>
          </div>

          <!-- Programs grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <template v-for="program in group.programs" :key="program.id">
              <!-- Program card -->
              <div
                class="group relative rounded-2xl border border-primary-200/60 dark:border-primary-700/60 bg-white/70 dark:bg-primary-800/70 backdrop-blur-sm hover:border-sand-500/50 dark:hover:border-sand-600/40 hover:shadow-xl transition-all overflow-hidden"
                :class="{
                  'ring-2 ring-sand-500/50 dark:ring-sand-600/40': expandedId === program.id,
                }"
              >
                <div class="h-1.5 bg-gradient-primary"></div>

                <div class="p-6">
                  <!-- Header: icon + name -->
                  <div class="flex items-start gap-3 mb-4">
                    <div
                      class="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center flex-shrink-0 text-white"
                    >
                      <Icon :name="program.icon || 'lucide:dumbbell'" class="w-6 h-6" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <h3
                        class="text-lg font-bold text-primary-900 dark:text-primary-100 group-hover:text-sand-700 dark:group-hover:text-sand-400 transition-colors leading-tight"
                      >
                        {{ program.name }}
                      </h3>
                      <div
                        class="flex items-center gap-1.5 mt-1 text-xs text-primary-500 dark:text-primary-400"
                      >
                        <Icon name="lucide:users" class="w-3.5 h-3.5" />
                        {{ program.popularity }} adoption{{ program.popularity !== 1 ? 's' : '' }}
                      </div>
                    </div>
                  </div>

                  <!-- Description -->
                  <p class="text-sm text-primary-600 dark:text-primary-400 mb-4 line-clamp-2">
                    {{ program.description }}
                  </p>

                  <!-- Badges -->
                  <div class="flex flex-wrap gap-2 mb-4">
                    <span :class="difficultyBadgeClass(program.difficulty)">
                      {{ difficultyLabel(program.difficulty) }}
                    </span>
                    <span
                      class="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 dark:bg-blue-400/10 text-blue-700 dark:text-blue-400"
                    >
                      {{ goalLabel(program.goal) }}
                    </span>
                  </div>

                  <!-- Meta info -->
                  <div
                    class="flex items-center gap-4 text-xs text-primary-500 dark:text-primary-400"
                  >
                    <span class="inline-flex items-center gap-1">
                      <Icon name="lucide:calendar" class="w-3.5 h-3.5" />
                      {{ program.daysPerWeek }}j / semaine
                    </span>
                    <span class="inline-flex items-center gap-1">
                      <Icon name="lucide:clock" class="w-3.5 h-3.5" />
                      {{ program.durationWeeks }} semaines
                    </span>
                    <span class="inline-flex items-center gap-1">
                      <Icon name="lucide:zap" class="w-3.5 h-3.5" />
                      {{ program.days.length }} jours
                    </span>
                  </div>

                  <!-- Expand button -->
                  <button
                    @click="toggleDetail(program.id)"
                    class="mt-4 pt-3 border-t border-primary-100 dark:border-primary-700/60 flex items-center justify-center gap-1.5 text-xs font-medium text-primary-400 dark:text-primary-500 hover:text-sand-600 dark:hover:text-sand-400 transition-colors w-full cursor-pointer"
                  >
                    <span>{{
                      expandedId === program.id ? t('programs.collapse') : t('programs.expand')
                    }}</span>
                    <svg
                      :class="[
                        'w-3.5 h-3.5 transition-transform duration-300',
                        expandedId === program.id ? 'rotate-180' : '',
                      ]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Expanded detail panel - spans full grid width -->
              <div
                v-if="expandedId === program.id"
                class="col-span-1 md:col-span-2 lg:col-span-3 rounded-2xl border border-sand-500/30 dark:border-sand-600/30 bg-white/90 dark:bg-primary-800/90 backdrop-blur-sm overflow-hidden"
              >
                <div class="p-6 space-y-4">
                  <!-- Program name reminder -->
                  <div class="flex items-center justify-between">
                    <h3 class="text-lg font-bold text-primary-900 dark:text-primary-100">
                      {{ t('programs.detailsTitle', { name: program.name }) }}
                    </h3>
                    <button
                      @click="expandedId = null"
                      class="text-primary-400 hover:text-primary-600 dark:hover:text-primary-200 transition-colors"
                    >
                      <Icon name="lucide:x" class="w-5 h-5" />
                    </button>
                  </div>

                  <!-- Days grid -->
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div
                      v-for="day in sortedDays(program.days)"
                      :key="day.id"
                      class="rounded-xl bg-primary-50/80 dark:bg-primary-900/50 p-4"
                    >
                      <div class="flex items-center gap-2 mb-3">
                        <span
                          class="w-7 h-7 rounded-lg bg-gradient-primary text-white text-xs font-bold flex items-center justify-center flex-shrink-0"
                        >
                          {{ t('programs.dayLabel', { number: day.dayIndex + 1 }) }}
                        </span>
                        <h4 class="font-semibold text-sm text-primary-900 dark:text-primary-100">
                          {{ day.name }}
                        </h4>
                      </div>

                      <div class="space-y-1.5">
                        <div
                          v-for="(exercise, idx) in day.exercises"
                          :key="idx"
                          class="flex items-center justify-between text-xs py-1.5 px-2 rounded-lg hover:bg-white/60 dark:hover:bg-primary-800/60 transition-colors"
                        >
                          <span
                            class="text-primary-800 dark:text-primary-200 font-medium flex-1 min-w-0 truncate mr-2"
                          >
                            {{ exercise.exerciseName }}
                          </span>
                          <div
                            class="flex items-center gap-3 flex-shrink-0 text-primary-500 dark:text-primary-400"
                          >
                            <span>{{ exercise.sets }} x {{ exercise.reps }}</span>
                            <span class="text-primary-400 dark:text-primary-500">{{
                              formatRest(exercise.restSeconds)
                            }}</span>
                          </div>
                        </div>
                      </div>

                      <p
                        v-if="day.description"
                        class="mt-2 text-xs text-primary-500 dark:text-primary-400 italic"
                      >
                        {{ day.description }}
                      </p>
                    </div>
                  </div>

                  <!-- Adopt button -->
                  <button
                    @click.stop="handleAdopt(program)"
                    :disabled="adoptingSlug === program.slug"
                    class="btn-primary w-full py-3.5 text-base font-semibold disabled:opacity-60"
                  >
                    <span
                      v-if="adoptingSlug === program.slug"
                      class="inline-flex items-center gap-2"
                    >
                      <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle
                          class="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          stroke-width="4"
                        ></circle>
                        <path
                          class="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      {{ t('programs.adoptionInProgress') }}
                    </span>
                    <span v-else class="inline-flex items-center gap-2">
                      <Icon name="lucide:plus" class="w-5 h-5" />
                      {{ t('programs.adopt') }}
                    </span>
                  </button>
                </div>
              </div>
            </template>
          </div>
        </section>
      </div>

      <!-- Empty state -->
      <div v-if="!loading && !error && programs.length === 0" class="card-glass text-center py-16">
        <Icon name="lucide:package" class="w-20 h-20 mx-auto mb-6 text-primary-300" />
        <p class="text-xl text-primary-600 dark:text-primary-400">{{ t('programs.empty') }}</p>
      </div>
    </div>

    <MobileBottomNav active-path="/programs" />
  </div>
</template>

<script setup lang="ts">
/* TopNav imported and rendered globally in app.vue; per-page import removed */
import { useProgramApi, type WorkoutProgram, type ProgramDay } from '~/composables/useProgramApi';

useHead({ meta: [{ name: 'robots', content: 'noindex, nofollow' }] });

const { getPrograms, adoptProgram } = useProgramApi();
const toast = useToast();

const { t } = useLocale();

const programs = ref<WorkoutProgram[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const expandedId = ref<number | null>(null);
const adoptingSlug = ref<string | null>(null);
const activeCategory = ref('all');

const categories = computed(() => [
  { key: 'all', labelKey: 'programs.categories.all', icon: 'lucide:layout-grid' },
  { key: 'hypertrophy', labelKey: 'programs.categories.hypertrophy', icon: 'lucide:dumbbell' },
  { key: 'strength', labelKey: 'programs.categories.strength', icon: 'lucide:shield' },
  { key: 'general', labelKey: 'programs.categories.general', icon: 'lucide:target' },
  { key: 'endurance', labelKey: 'programs.categories.endurance', icon: 'lucide:heart-pulse' },
]);

interface ProgramGroup {
  key: string;
  label: string;
  icon: string;
  description: string;
  programs: WorkoutProgram[];
}

const goalGroupConfig = computed<
  Record<string, { label: string; icon: string; description: string }>
>(() => ({
  HYPERTROPHY: {
    label: t('programs.categories.hypertrophy'),
    icon: 'lucide:dumbbell',
    description: t('programs.goalDescriptions.hypertrophy'),
  },
  STRENGTH: {
    label: t('programs.categories.strength'),
    icon: 'lucide:shield',
    description: t('programs.goalDescriptions.strength'),
  },
  GENERAL: {
    label: t('programs.categories.general'),
    icon: 'lucide:target',
    description: t('programs.goalDescriptions.general'),
  },
  ENDURANCE: {
    label: t('programs.categories.endurance'),
    icon: 'lucide:heart-pulse',
    description: t('programs.goalDescriptions.endurance'),
  },
}));

const programGroups = computed<ProgramGroup[]>(() => {
  const groups: Record<string, WorkoutProgram[]> = {};
  for (const p of programs.value) {
    const goal = p.goal || 'GENERAL';
    if (!groups[goal]) groups[goal] = [];
    groups[goal].push(p);
  }

  const order = ['HYPERTROPHY', 'STRENGTH', 'GENERAL', 'ENDURANCE'];
  return order
    .filter((key) => groups[key]?.length)
    .map((key) => ({
      key: key.toLowerCase(),
      ...goalGroupConfig.value[key],
      programs: groups[key],
    }));
});

const filteredGroups = computed(() => {
  if (activeCategory.value === 'all') return programGroups.value;
  return programGroups.value.filter((g) => g.key === activeCategory.value);
});

const loadPrograms = async () => {
  loading.value = true;
  error.value = null;
  try {
    programs.value = await getPrograms();
  } catch (err: any) {
    error.value = err?.data?.error || t('programs.loadError');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadPrograms();
});

const toggleDetail = (id: number) => {
  expandedId.value = expandedId.value === id ? null : id;
};

const sortedDays = (days: ProgramDay[]) => {
  return [...days].sort((a, b) => a.dayIndex - b.dayIndex);
};

const handleAdopt = async (program: WorkoutProgram) => {
  if (adoptingSlug.value) return;
  adoptingSlug.value = program.slug;
  try {
    const result = await adoptProgram(program.slug);
    toast.success(
      t('programs.adoptSuccess'),
      t('programs.adoptSuccessBody', { count: result.workoutIds.length, name: program.name })
    );
    navigateTo('/workouts');
  } catch (err: any) {
    toast.error(t('programs.adoptError'), err?.data?.error || t('programs.adoptError'));
  } finally {
    adoptingSlug.value = null;
  }
};

const formatRest = (seconds: number) => {
  if (seconds >= 60) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${mins}m${secs}s` : `${mins}min`;
  }
  return `${seconds}s`;
};

const difficultyLabel = (difficulty: string) => {
  const labels: Record<string, string> = {
    BEGINNER: t('programs.difficulty.beginner'),
    INTERMEDIATE: t('programs.difficulty.intermediate'),
    ADVANCED: t('programs.difficulty.advanced'),
  };
  return labels[difficulty] || difficulty;
};

const difficultyBadgeClass = (difficulty: string) => {
  const base = 'inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full';
  const colors: Record<string, string> = {
    BEGINNER: 'bg-green-500/10 dark:bg-green-400/10 text-green-700 dark:text-green-400',
    INTERMEDIATE: 'bg-yellow-500/10 dark:bg-yellow-400/10 text-yellow-700 dark:text-yellow-400',
    ADVANCED: 'bg-red-500/10 dark:bg-red-400/10 text-red-700 dark:text-red-400',
  };
  return `${base} ${colors[difficulty] || colors.INTERMEDIATE}`;
};

const goalLabel = (goal: string) => {
  const labels: Record<string, string> = {
    STRENGTH: t('programs.goal.strength'),
    HYPERTROPHY: t('programs.goal.hypertrophy'),
    ENDURANCE: t('programs.goal.endurance'),
    GENERAL: t('programs.goal.general'),
  };
  return labels[goal] || goal;
};

definePageMeta({
  middleware: 'auth',
});
</script>
