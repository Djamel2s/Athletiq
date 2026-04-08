<template>
  <div class="min-h-screen">
    <!-- TopNav is rendered globally in app.vue -->

    <!-- Content -->
    <div class="px-4 md:px-6 pb-28 lg:pb-20 max-w-7xl mx-auto">
      <!-- Page Header -->
      <div class="fade-in text-center mb-8">
        <h1
          class="text-3xl md:text-5xl lg:text-6xl font-bold text-display bg-gradient-to-r from-sand-500 to-primary-900 dark:to-primary-100 bg-clip-text text-transparent mb-2"
        >
          Lancer un entraînement
        </h1>
        <p class="text-lg text-primary-600 dark:text-primary-400">Choisissez votre workout</p>
      </div>

      <!-- Loading -->
      <div v-if="workoutStore.isLoading" class="text-center py-20">
        <div
          class="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary-200 dark:border-primary-700 border-t-primary-600 dark:border-t-primary-400"
        ></div>
        <p class="mt-4 text-primary-600 dark:text-primary-400 text-lg">Chargement...</p>
      </div>

      <!-- No workouts -->
      <div v-else-if="availableWorkouts.length === 0" class="text-center py-20 fade-in">
        <div class="card-glass max-w-2xl mx-auto py-16">
          <svg
            class="w-24 h-24 mx-auto mb-6 text-primary-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h2 class="text-3xl font-bold text-primary-900 dark:text-primary-100 mb-4">
            Aucun workout disponible
          </h2>
          <p class="text-lg text-primary-600 dark:text-primary-400 mb-8">
            Crée d'abord des workouts avant de venir à la salle!
          </p>
          <button @click="navigateTo('/workouts/builder')" class="btn-primary px-8 py-4">
            Créer un workout
          </button>
        </div>
      </div>

      <!-- Workouts list -->
      <div v-else class="space-y-6">
        <!-- Upgrade banner séances -->
        <div v-if="!isPremium && !canCreateWorkout" class="mb-8 fade-in">
          <ProWall
            title="Entrainements illimites"
            :message="`Vous avez fait ${workoutUsageText} seances cette semaine. Debloquez Pro pour vous entrainer sans limites.`"
            icon="dumbbell"
            compact
          />
        </div>

        <!-- Quick Start -->
        <div v-if="lastCompletedWorkout" class="mb-8 fade-in">
          <button
            @click="launchWorkout(lastCompletedWorkout)"
            :disabled="!!isLaunching"
            class="w-full card-glass hover:shadow-2xl hover:scale-[1.01] transition-all cursor-pointer group border-2 border-sand-500/40 dark:border-sand-600/30 text-left"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-14 h-14 bg-gradient-primary rounded-2xl flex items-center justify-center flex-shrink-0"
              >
                <svg
                  v-if="isLaunching === lastCompletedWorkout.id"
                  class="animate-spin w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  />
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                <svg
                  v-else
                  class="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-xs font-semibold text-sand-600 uppercase tracking-wider mb-1">
                  Relancer le dernier
                </p>
                <p class="text-xl font-bold text-primary-900 dark:text-primary-100 truncate">
                  {{ lastCompletedWorkout.name }}
                </p>
                <p class="text-sm text-primary-500 dark:text-primary-400">
                  {{ lastCompletedWorkout.exercises?.length || 0 }} exercices
                </p>
              </div>
              <svg
                class="w-6 h-6 text-primary-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </div>
          </button>
        </div>

        <!-- Group workout -->
        <div class="mb-6 slide-up">
          <button
            @click="navigateTo('/workouts/session')"
            class="w-full card-glass hover:shadow-xl hover:border-sand-500/40 dark:hover:border-sand-600/30 transition-all cursor-pointer text-left border-2 border-primary-200/60 dark:border-primary-700/60"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center flex-shrink-0"
              >
                <Icon name="lucide:users" class="w-6 h-6 text-white" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-base font-bold text-primary-900 dark:text-primary-100">
                  Entrainement en groupe
                </p>
                <p class="text-sm text-primary-500 dark:text-primary-400">
                  Entraine-toi avec tes Gym Bros
                </p>
              </div>
              <svg
                class="w-5 h-5 text-primary-400 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </button>
        </div>

        <!-- Workouts Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 slide-up">
          <div
            v-for="workout in availableWorkouts"
            :key="workout.id"
            @click="launchWorkout(workout)"
            :class="[
              'group relative rounded-2xl border border-primary-200/60 dark:border-primary-700/60 bg-white/70 dark:bg-primary-800/70 backdrop-blur-sm hover:border-sand-500/50 dark:hover:border-sand-600/40 hover:shadow-xl transition-all cursor-pointer overflow-hidden',
              isLaunching === workout.id ? 'opacity-70 pointer-events-none' : '',
            ]"
          >
            <div class="h-1 bg-gradient-primary"></div>
            <div class="p-5">
              <div class="flex items-start justify-between mb-3">
                <h3
                  class="text-lg md:text-xl font-bold text-primary-900 dark:text-primary-100 group-hover:text-sand-700 dark:group-hover:text-sand-400 transition-colors leading-tight"
                >
                  {{ workout.name }}
                </h3>
                <div
                  v-if="isLaunching === workout.id"
                  class="w-8 h-8 flex items-center justify-center flex-shrink-0"
                >
                  <svg class="animate-spin h-5 w-5 text-sand-500" fill="none" viewBox="0 0 24 24">
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    />
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                </div>
                <svg
                  v-else
                  class="w-5 h-5 text-primary-300 dark:text-primary-600 group-hover:text-sand-500 group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </div>

              <p
                v-if="workout.description"
                class="text-sm text-primary-500 dark:text-primary-400 mb-3 line-clamp-2"
              >
                {{ workout.description }}
              </p>

              <!-- Exercise preview tags -->
              <div
                v-if="workout.exercises && workout.exercises.length > 0"
                class="flex flex-wrap gap-1.5 mb-4"
              >
                <span
                  v-for="exercise in workout.exercises.slice(0, 4)"
                  :key="exercise.id"
                  class="px-2 py-0.5 bg-primary-50 dark:bg-primary-800 text-primary-600 dark:text-primary-400 text-[11px] rounded-md font-medium"
                >
                  {{ exercise.exerciseLibrary?.name || exercise.name }}
                </span>
                <span
                  v-if="workout.exercises.length > 4"
                  class="px-2 py-0.5 bg-sand-500/10 text-sand-600 dark:text-sand-400 text-[11px] rounded-md font-semibold"
                >
                  +{{ workout.exercises.length - 4 }}
                </span>
              </div>

              <!-- Stats -->
              <div
                class="flex items-center gap-3 pt-3 border-t border-primary-100 dark:border-primary-800"
              >
                <span
                  v-if="workout.exercises?.length"
                  class="inline-flex items-center gap-1 text-xs text-primary-500 dark:text-primary-400"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  {{ workout.exercises.length }} exercices
                </span>
                <span
                  v-if="getEstimatedDuration(workout)"
                  class="inline-flex items-center gap-1 text-xs text-primary-500 dark:text-primary-400"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  ~{{ getEstimatedDuration(workout) }} min
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick action: create new -->
        <div class="text-center pt-8 slide-up">
          <button
            @click="navigateTo('/workouts/builder')"
            class="btn-outline inline-flex items-center space-x-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span>Créer un nouveau workout</span>
          </button>
        </div>
      </div>
    </div>

    <MobileBottomNav active-path="/workouts" />
  </div>
</template>

<script setup lang="ts">
/* TopNav imported and rendered globally in app.vue; per-page import removed */
import { useWorkoutStore } from '~/stores/workout';
import { useAuthStore } from '~/stores/auth';
import { useSubscriptionStore } from '~/stores/subscription';
import { useSubscriptionLimits } from '~/composables/useSubscriptionLimits';
import type { Workout } from '~/types/workout';

useHead({ meta: [{ name: 'robots', content: 'noindex, nofollow' }] });

const workoutStore = useWorkoutStore();
const authStore = useAuthStore();
const subscriptionStore = useSubscriptionStore();
const { isPremium, canCreateWorkout, workoutUsageText, fetchUsage } = useSubscriptionLimits();
const toast = useToast();
const isLaunching = ref<number | null>(null);

onMounted(async () => {
  await workoutStore.fetchWorkouts();
  await subscriptionStore.fetchSubscription();
  await fetchUsage();
});

// Only show templates (all workouts created in builder are templates)
const availableWorkouts = computed(() => {
  return workoutStore.workouts.filter((w) => w.isTemplate === true);
});

const lastCompletedWorkout = computed(() => {
  const completed = workoutStore.workouts
    .filter((w) => w.completedAt && !w.isTemplate)
    .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime());
  if (completed.length === 0) return null;
  // Find the matching template for the last completed workout
  const last = completed[0];
  return availableWorkouts.value.find((t) => t.name === last.name) || null;
});

const launchWorkout = async (workout: Workout) => {
  if (isLaunching.value) return;

  if (!canCreateWorkout.value) {
    toast.error('Limite atteinte', 'Passez Pro pour faire plus de séances cette semaine');
    return;
  }

  isLaunching.value = workout.id;
  try {
    const workoutToStart = await workoutStore.createWorkout({
      name: workout.name,
      description: workout.description,
      isTemplate: false,
    });

    if (workout.exercises) {
      for (const exercise of workout.exercises) {
        await workoutStore.addExerciseToWorkout(workoutToStart.id, {
          exerciseLibraryId: exercise.exerciseLibraryId!,
          name: exercise.name,
          notes: exercise.notes,
          targetSets: exercise.targetSets,
          targetReps: exercise.targetReps,
          targetWeight: exercise.targetWeight,
          restTime: exercise.restTime,
          plannedSets: exercise.plannedSets,
          orderIndex: exercise.orderIndex,
        });
      }
    }

    await workoutStore.startWorkout(workoutToStart.id);
    navigateTo(`/workouts/${workoutToStart.id}/live`);
  } catch (error) {
    logger.error('Failed to launch workout:', error);
    toast.error('Erreur', 'Impossible de lancer le workout');
  } finally {
    isLaunching.value = null;
  }
};

const getEstimatedDuration = (workout: Workout): number | null => {
  if (!workout.exercises || workout.exercises.length === 0) return null;

  // Estimate: 3 sets per exercise, 1 min per set, 2 min rest between exercises
  const setsPerExercise = 3;
  const timePerSet = 1; // minutes
  const restBetweenExercises = 2; // minutes

  const totalSets = workout.exercises.length * setsPerExercise;
  const totalTime = totalSets * timePerSet + (workout.exercises.length - 1) * restBetweenExercises;

  return Math.round(totalTime);
};

definePageMeta({
  middleware: 'auth',
});
</script>
