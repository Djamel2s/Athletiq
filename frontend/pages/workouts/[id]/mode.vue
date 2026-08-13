<template>
  <div class="fixed inset-0 z-40 overflow-hidden bg-white dark:bg-primary-900">
    <!-- Loading -->
    <div v-if="!template" class="absolute inset-0 flex items-center justify-center">
      <div
        class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-200 dark:border-primary-700 border-t-sand-500"
      ></div>
    </div>

    <template v-else>
      <!-- Header : bouton fermer + rappel du workout selectionne -->
      <div class="absolute top-0 left-0 right-0 z-30 px-5 py-5 md:px-8 md:py-6">
        <div class="flex items-center justify-between mb-4">
          <button
            type="button"
            class="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-800 hover:bg-primary-200 dark:hover:bg-primary-700 flex items-center justify-center text-primary-700 dark:text-primary-300 transition-colors"
            @click="navigateTo('/workouts/start')"
          >
            <Icon name="lucide:x" class="w-5 h-5" />
          </button>
          <div class="w-10 h-10"></div>
        </div>

        <!-- Rappel du workout : ce qu'on s'apprete a lancer -->
        <div class="text-center">
          <p
            class="text-xs font-semibold text-primary-500 dark:text-primary-400 uppercase tracking-wider mb-1"
          >
            {{ t('workoutMode.aboutToStart') }}
          </p>
          <p
            class="text-xl md:text-2xl font-bold text-primary-900 dark:text-primary-100 truncate px-4"
          >
            {{ template.name }}
          </p>
          <p
            v-if="template.exercises?.length"
            class="text-sm text-primary-500 dark:text-primary-400 mt-0.5"
          >
            {{ template.exercises.length }} {{ t('workoutStart.exercisesCount') }}
          </p>
        </div>
      </div>

      <!-- Panneau SOLO -->
      <div
        class="absolute left-0 right-0 top-0 h-1/2 md:h-full md:right-1/2 md:left-0 flex items-center justify-center px-6 pt-32 pb-8 md:pt-0 bg-transparent hover:shadow-xl hover:-translate-y-0.5"
      >
        <button
          type="button"
          :disabled="!!launching"
          class="w-full max-w-xs transition-all duration-200 text-center py-8"
          :class="entered ? 'scale-100 opacity-100' : 'scale-95 opacity-0'"
          style="transition-property: transform, opacity, box-shadow; transition-duration: 400ms"
          @click="chooseSolo"
        >
          <div
            class="w-16 h-16 md:w-20 md:h-20 mx-auto mb-5 rounded-3xl flex items-center justify-center"
          >
            <Icon name="lucide:user" class="w-7 h-7 md:w-9 md:h-9 text-white" />
          </div>
          <h2 class="text-2xl md:text-3xl font-bold text-primary-900 dark:text-primary-100 mb-2">
            {{ t('workoutMode.solo') }}
          </h2>
          <p class="text-primary-500 dark:text-primary-400 text-sm md:text-base">
            {{ t('workoutMode.soloDesc') }}
          </p>
          <div
            v-if="launching === 'solo'"
            class="mt-5 inline-flex items-center gap-2 text-sand-600 dark:text-sand-400 text-sm font-semibold"
          >
            <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
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
            {{ t('workoutMode.launching') }}
          </div>
        </button>
      </div>

      <!-- Panneau GROUPE -->
      <div
        class="absolute left-0 right-0 bottom-0 h-1/2 md:h-full md:left-1/2 md:right-0 flex items-center justify-center px-6 pb-8 bg-transparent hover:shadow-xl hover:-translate-y-0.5"
      >
        <button
          type="button"
          :disabled="!!launching"
          class="w-full max-w-xs transition-all duration-200 text-center py-8"
          :class="entered ? 'scale-100 opacity-100' : 'scale-95 opacity-0'"
          style="
            transition-property: transform, opacity, box-shadow;
            transition-duration: 400ms;
            transition-delay: 80ms;
          "
          @click="chooseGroup"
        >
          <div
            class="w-16 h-16 md:w-20 md:h-20 mx-auto mb-5 rounded-3xl flex items-center justify-center"
          >
            <Icon name="lucide:users" class="w-7 h-7 md:w-9 md:h-9 text-white" />
          </div>
          <h2 class="text-2xl md:text-3xl font-bold text-primary-900 dark:text-primary-100 mb-2">
            {{ t('workoutMode.group') }}
          </h2>
          <p class="text-primary-500 dark:text-primary-400 text-sm md:text-base">
            {{ t('workoutMode.groupDesc') }}
          </p>
        </button>
      </div>

      <!-- Onglets marque-page : bascule rapide -->
      <button
        type="button"
        class="hidden md:flex absolute top-1/2 right-0 z-30 items-center gap-1.5 pl-4 pr-3 py-2.5 rounded-l-xl bg-primary-100 text-white text-xs font-bold dark:bg-primary-800 text-primary-700 dark:text-primary-300 text-xs font-bold -translate-y-1/2 hover:pl-5 transition-all"
        :class="entered ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'"
        style="transition: all 0.4s ease-out 0.25s"
        @click="chooseGroup"
      >
        {{ t('workoutMode.switchToGroup') }}
        <Icon name="lucide:users" class="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        class="hidden md:flex absolute top-1/2 left-0 z-30 items-center gap-1.5 pr-4 pl-3 py-2.5 rounded-r-xl bg-primary-100 text-white text-xs font-bold dark:bg-primary-800 text-primary-700 dark:text-primary-300 text-xs font-bold -translate-y-1/2 hover:pl-5 transition-all"
        :class="entered ? 'translate-x-0 opacity-100' : '-translate-x-24 opacity-0'"
        style="transition: all 0.4s ease-out 0.25s"
        @click="chooseSolo"
      >
        <Icon name="lucide:user" class="w-3.5 h-3.5" />
        {{ t('workoutMode.switchToSolo') }}
      </button>

      <!-- Ligne centrale -->
      <div
        class="hidden md:block absolute top-0 bottom-0 left-1/2 w-px bg-primary-200 dark:bg-primary-800 z-20 -translate-x-1/2 pointer-events-none"
      ></div>
      <div
        class="md:hidden absolute left-0 right-0 top-1/2 h-px bg-primary-200 dark:bg-primary-800 z-20 -translate-y-1/2 pointer-events-none"
      ></div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useWorkoutStore } from '~/stores/workout';
import { useSubscriptionLimits } from '~/composables/useSubscriptionLimits';
import type { Workout } from '~/types/workout';

const { t } = useLocale();
useHead({ meta: [{ name: 'robots', content: 'noindex, nofollow' }] });

definePageMeta({
  middleware: 'auth',
  layout: false,
});

const route = useRoute();
const workoutStore = useWorkoutStore();
const { canCreateWorkout } = useSubscriptionLimits();
const toast = useToast();

const entered = ref(false);
const launching = ref<'solo' | 'group' | null>(null);

const templateId = computed(() => Number(route.params.id));
const template = computed<Workout | undefined>(() =>
  workoutStore.workouts.find((w) => w.id === templateId.value && w.isTemplate)
);

onMounted(async () => {
  if (!workoutStore.workouts.length) {
    await workoutStore.fetchWorkouts();
  }
  requestAnimationFrame(() => {
    setTimeout(() => (entered.value = true), 30);
  });
});

const chooseSolo = async () => {
  if (launching.value || !template.value) return;

  if (!canCreateWorkout.value) {
    toast.error('Limite atteinte', 'Passez Pro pour faire plus de séances cette semaine');
    return;
  }

  launching.value = 'solo';
  try {
    const workoutToStart = await workoutStore.createWorkout({
      name: template.value.name,
      description: template.value.description,
      isTemplate: false,
    });

    if (template.value.exercises) {
      for (const exercise of template.value.exercises) {
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
    await navigateTo(`/workouts/${workoutToStart.id}/live`);
  } catch (error) {
    logger.error('Failed to launch workout:', error);
    toast.error('Erreur', 'Impossible de lancer le workout');
    launching.value = null;
  }
};

const chooseGroup = () => {
  if (launching.value) return;
  navigateTo('/workouts/session');
};
</script>
