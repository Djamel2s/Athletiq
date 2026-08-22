<template>
  <div class="min-h-screen">
    <!-- TopNav is rendered globally in app.vue -->

    <div class="px-4 md:px-6 pb-28 lg:pb-20 max-w-4xl mx-auto">
      <!-- Retour au profil -->
      <div class="fade-in mb-4">
        <NuxtLink
          :to="`/profile/${username}`"
          class="inline-flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100 transition-colors"
        >
          <Icon name="lucide:arrow-left" class="w-4 h-4" />
          {{ t('workoutDetail.backToWorkouts') }}
        </NuxtLink>
      </div>

      <div class="fade-in text-center mb-8">
        <h1
          class="text-3xl md:text-5xl lg:text-6xl font-bold text-display bg-gradient-to-r from-sand-500 to-primary-900 dark:to-primary-100 bg-clip-text text-transparent mb-2"
        >
          {{ workout?.name || t('workoutDetail.detail') }}
        </h1>
        <p v-if="ownerLabel" class="text-lg text-primary-600 dark:text-primary-400">
          {{ ownerLabel }}
        </p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-20">
        <div
          class="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary-300 dark:border-primary-600 border-t-primary-600 dark:border-t-primary-400"
        ></div>
        <p class="mt-4 text-primary-600 dark:text-primary-400 text-lg">{{ t('common.loading') }}</p>
      </div>

      <!-- Error -->
      <div v-else-if="!workout" class="text-center py-20">
        <p class="text-primary-500 dark:text-primary-400 text-lg mb-4">
          {{ t('workoutDetail.notFound') }}
        </p>
        <NuxtLink :to="`/profile/${username}`" class="btn-primary">
          {{ t('workoutDetail.backToWorkouts') }}
        </NuxtLink>
      </div>

      <template v-else>
        <div class="grid lg:grid-cols-[280px_1fr] gap-6 items-start">
          <!-- Colonne stats, verticale, fixe a gauche -->
          <div class="space-y-4 fade-in lg:sticky lg:top-24">
            <div class="card-glass">
              <h2 class="text-xl font-bold text-primary-900 dark:text-primary-100">
                {{ workout.name }}
              </h2>
              <p
                v-if="workout.description"
                class="text-sm text-primary-600 dark:text-primary-400 mt-1"
              >
                {{ workout.description }}
              </p>
            </div>

            <div class="card-glass space-y-1">
              <div
                v-if="workout.completedAt"
                class="flex items-center justify-between py-2.5 border-b border-primary-100 dark:border-primary-800"
              >
                <span
                  class="flex items-center gap-2 text-sm text-primary-500 dark:text-primary-400"
                >
                  <Icon name="lucide:calendar" class="w-4 h-4" />
                  {{ t('workoutDetail.date') }}
                </span>
                <span class="text-sm font-semibold text-primary-900 dark:text-primary-100">
                  {{ formatDate(workout.completedAt) }}
                </span>
              </div>
              <div
                v-if="workout.duration"
                class="flex items-center justify-between py-2.5 border-b border-primary-100 dark:border-primary-800"
              >
                <span
                  class="flex items-center gap-2 text-sm text-primary-500 dark:text-primary-400"
                >
                  <Icon name="lucide:clock" class="w-4 h-4" />
                  {{ t('workoutDetail.duration') }}
                </span>
                <span class="text-sm font-semibold text-primary-900 dark:text-primary-100">
                  {{ formatDuration(workout.duration) }}
                </span>
              </div>
              <div
                class="flex items-center justify-between py-2.5 border-b border-primary-100 dark:border-primary-800"
              >
                <span
                  class="flex items-center gap-2 text-sm text-primary-500 dark:text-primary-400"
                >
                  <Icon name="lucide:dumbbell" class="w-4 h-4" />
                  {{ t('workoutDetail.exercises') }}
                </span>
                <span class="text-sm font-semibold text-primary-900 dark:text-primary-100">
                  {{ workout.exercises?.length || 0 }}
                </span>
              </div>
              <div v-if="totalVolume > 0" class="flex items-center justify-between py-2.5">
                <span
                  class="flex items-center gap-2 text-sm text-primary-500 dark:text-primary-400"
                >
                  <Icon name="lucide:trending-up" class="w-4 h-4" />
                  {{ t('workoutDetail.totalVolume') }}
                </span>
                <span class="text-sm font-semibold text-primary-900 dark:text-primary-100">
                  {{ totalVolume.toLocaleString('fr-FR') }} kg
                </span>
              </div>
            </div>
          </div>

          <!-- Tuiles d'exercices + detail de l'exercice selectionne -->
          <div class="slide-up min-w-0">
            <div class="flex gap-3 overflow-x-auto pb-3 mb-6 -mx-1 px-1 custom-scrollbar">
              <button
                v-for="(exercise, index) in sortedExercises"
                :key="exercise.id"
                type="button"
                @click="selectedExerciseIndex = index"
                class="shrink-0 w-40 text-left rounded-2xl border-2 p-3 transition-all"
                :class="
                  selectedExerciseIndex === index
                    ? 'border-sand-500 bg-sand-50 dark:bg-sand-500/10'
                    : 'border-primary-200/70 dark:border-primary-800/70 bg-primary-50/60 dark:bg-primary-900/40 hover:border-primary-300 dark:hover:border-primary-700'
                "
              >
                <div class="font-semibold text-sm text-primary-900 dark:text-primary-100 truncate">
                  {{ exercise.exerciseLibrary?.name || exercise.name }}
                </div>
                <div class="text-xs text-primary-500 dark:text-primary-400 mt-0.5">
                  {{
                    exercise.sets?.length
                      ? t('workoutDetail.setCount', {
                          count: exercise.sets.length,
                          plural: exercise.sets.length > 1 ? 's' : '',
                        })
                      : '—'
                  }}
                </div>
              </button>
            </div>

            <div v-if="selectedExercise" :key="selectedExercise.id" class="card-glass fade-in">
              <div class="grid md:grid-cols-[220px_1fr] gap-6">
                <div>
                  <ExerciseAnimation
                    :image-id="selectedExercise.exerciseLibrary?.imageUrl"
                    :name="selectedExercise.exerciseLibrary?.name || selectedExercise.name"
                    size="lg"
                    class="mb-4 w-full"
                  />
                  <h3 class="text-lg font-bold text-primary-900 dark:text-primary-100">
                    {{ selectedExercise.exerciseLibrary?.name || selectedExercise.name }}
                  </h3>
                  <div class="flex flex-wrap gap-2 mt-2">
                    <span
                      v-if="selectedExercise.exerciseLibrary?.primaryMuscle"
                      class="px-2 py-0.5 bg-primary-100 dark:bg-primary-800 rounded-full text-xs text-primary-600 dark:text-primary-400"
                    >
                      {{ formatMuscle(selectedExercise.exerciseLibrary.primaryMuscle) }}
                    </span>
                    <span
                      v-if="selectedExercise.exerciseLibrary?.equipment"
                      class="px-2 py-0.5 bg-primary-100 dark:bg-primary-800 rounded-full text-xs text-primary-600 dark:text-primary-400"
                    >
                      {{ formatEquipment(selectedExercise.exerciseLibrary.equipment) }}
                    </span>
                  </div>
                  <p
                    v-if="selectedExercise.notes"
                    class="mt-3 text-sm text-primary-500 dark:text-primary-400 italic"
                  >
                    {{ selectedExercise.notes }}
                  </p>
                </div>

                <div>
                  <div v-if="selectedExercise.sets?.length" class="overflow-x-auto">
                    <table class="w-full text-sm">
                      <thead>
                        <tr class="text-primary-500 dark:text-primary-400 text-xs">
                          <th class="text-left py-2 pr-3">{{ t('workoutDetail.setCol') }}</th>
                          <th class="text-right py-2 px-3">{{ t('workoutDetail.weightCol') }}</th>
                          <th class="text-right py-2 px-3">{{ t('workoutBuilder.reps') }}</th>
                          <th v-if="hasDuration(selectedExercise)" class="text-right py-2 px-3">
                            {{ t('workoutDetail.duration') }}
                          </th>
                          <th v-if="hasRpe(selectedExercise)" class="text-right py-2 pl-3">RPE</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="set in sortedSets(selectedExercise)"
                          :key="set.id"
                          class="border-t border-primary-100 dark:border-primary-800"
                        >
                          <td
                            class="py-2.5 pr-3 font-medium text-primary-900 dark:text-primary-100"
                          >
                            {{ set.setNumber }}
                          </td>
                          <td class="text-right py-2.5 px-3 text-primary-700 dark:text-primary-300">
                            {{ set.weight ? `${set.weight} kg` : '—' }}
                          </td>
                          <td class="text-right py-2.5 px-3 text-primary-700 dark:text-primary-300">
                            {{ set.reps ?? '—' }}
                          </td>
                          <td
                            v-if="hasDuration(selectedExercise)"
                            class="text-right py-2.5 px-3 text-primary-700 dark:text-primary-300"
                          >
                            {{ set.duration ? `${set.duration}s` : '—' }}
                          </td>
                          <td
                            v-if="hasRpe(selectedExercise)"
                            class="text-right py-2.5 pl-3 text-primary-700 dark:text-primary-300"
                          >
                            {{ set.rpe ?? '—' }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div
                    v-else-if="selectedExercise.targetSets"
                    class="text-sm text-primary-500 dark:text-primary-400"
                  >
                    {{ selectedExercise.targetSets }} séries ×
                    {{ selectedExercise.targetReps }} reps
                    {{
                      selectedExercise.targetWeight ? `@ ${selectedExercise.targetWeight} kg` : ''
                    }}
                  </div>
                  <div v-else class="text-sm text-primary-500 dark:text-primary-400">—</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <MobileBottomNav :active-path="`/profile/${username}`" />
  </div>
</template>

<script setup lang="ts">
const { t } = useLocale();
/* TopNav imported and rendered globally in app.vue; per-page import removed */
import type { Exercise, Set } from '~/types/workout';

useHead({ meta: [{ name: 'robots', content: 'noindex, nofollow' }] });

const route = useRoute();
const username = route.params.username as string;
const loading = ref(true);
const workout = ref<any | null>(null);

onMounted(async () => {
  const id = Number(route.params.id);
  if (isNaN(id)) {
    navigateTo(`/profile/${username}`);
    return;
  }

  try {
    const config = useRuntimeConfig();
    const authStore = useAuthStore();
    workout.value = await $fetch(`${config.public.apiUrl}/profile/${username}/workouts/${id}`, {
      headers: authStore.token ? { Authorization: `Bearer ${authStore.token}` } : {},
    });
  } catch {
    workout.value = null;
  } finally {
    loading.value = false;
  }
});

const ownerLabel = computed(() => (username ? `@${username}` : ''));

const sortedExercises = computed(() =>
  [...(workout.value?.exercises || [])].sort(
    (a: Exercise, b: Exercise) => a.orderIndex - b.orderIndex
  )
);

const selectedExerciseIndex = ref(0);
const selectedExercise = computed(() => sortedExercises.value[selectedExerciseIndex.value] ?? null);

const totalVolume = computed(() => {
  if (workout.value?.totalVolume) return workout.value.totalVolume;
  let vol = 0;
  for (const ex of workout.value?.exercises || []) {
    for (const set of ex.sets || []) {
      vol += (set.weight || 0) * (set.reps || 0);
    }
  }
  return Math.round(vol);
});

const sortedSets = (exercise: Exercise) =>
  [...(exercise.sets || [])].sort((a: Set, b: Set) => a.setNumber - b.setNumber);

const hasDuration = (exercise: Exercise) => exercise.sets?.some((s: Set) => s.duration);

const hasRpe = (exercise: Exercise) => exercise.sets?.some((s: Set) => s.rpe);

const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`;
};

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateString));
};

const muscleLabels: Record<string, string> = {
  CHEST: 'Pectoraux',
  BACK: 'Dos',
  SHOULDERS: 'Épaules',
  LEGS: 'Jambes',
  QUADS: 'Quadriceps',
  HAMSTRINGS: 'Ischio-jambiers',
  GLUTES: 'Fessiers',
  CALVES: 'Mollets',
  BICEPS: 'Biceps',
  TRICEPS: 'Triceps',
  ABS: 'Abdos',
  CARDIO: 'Cardio',
};

const equipmentLabels: Record<string, string> = {
  BARBELL: 'Barre',
  DUMBBELL: 'Haltères',
  CABLE: 'Câble',
  MACHINE: 'Machine',
  BODYWEIGHT: 'Poids du corps',
  RESISTANCE_BAND: 'Élastique',
  OTHER: 'Autre',
};

const formatMuscle = (muscle: string) => muscleLabels[muscle] || muscle;
const formatEquipment = (eq: string) => equipmentLabels[eq] || eq;

definePageMeta({
  middleware: 'auth',
});
</script>
