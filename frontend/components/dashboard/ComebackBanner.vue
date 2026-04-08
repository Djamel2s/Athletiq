<template>
  <Transition name="fade-slide">
    <div v-if="show" class="card-glass relative overflow-hidden">
      <!-- Gradient border accent -->
      <div
        class="absolute inset-0 rounded-2xl bg-gradient-to-br from-sand-500/20 to-sand-600/20 pointer-events-none"
      ></div>

      <!-- Dismiss button -->
      <button
        @click="dismiss"
        class="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors z-10"
        aria-label="Fermer"
      >
        <svg
          class="w-4 h-4 text-primary-400 dark:text-primary-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <div class="relative flex flex-col sm:flex-row items-start gap-4">
        <!-- Icon -->
        <div
          class="w-12 h-12 bg-gradient-to-br from-sand-500 to-sand-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
        >
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"
            />
          </svg>
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0 pr-6">
          <h3 class="text-lg font-bold text-primary-900 dark:text-primary-100">
            Content de te revoir, {{ userName }} !
          </h3>

          <div class="mt-1 mb-1">
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
              :class="modeBadgeClass"
            >
              {{ modeLabel }}
            </span>
          </div>

          <p class="text-sm text-primary-600 dark:text-primary-400 leading-relaxed">
            {{ subtitle }}
          </p>

          <p class="text-xs text-primary-400 dark:text-primary-500 mt-1">
            Dernier entraînement il y a {{ daysSinceLastWorkout }} jour{{
              daysSinceLastWorkout > 1 ? 's' : ''
            }}
          </p>

          <!-- CTA Button -->
          <NuxtLink
            to="/workouts/start"
            class="btn-primary inline-flex items-center gap-2 mt-4 text-sm"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            Reprendre l'entraînement
          </NuxtLink>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
interface Props {
  lastWorkoutDate: string | null;
  userName: string;
}

const props = defineProps<Props>();

const STORAGE_KEY = 'athletiq-comeback-dismissed';

const dismissed = ref(false);

const daysSinceLastWorkout = computed(() => {
  if (!props.lastWorkoutDate) return Infinity;
  const last = new Date(props.lastWorkoutDate);
  const now = new Date();
  const diffMs = now.getTime() - last.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
});

const comebackMode = computed<'gentle' | 'progressive' | 'rebuild' | null>(() => {
  const days = daysSinceLastWorkout.value;
  if (days < 7) return null;
  if (days <= 14) return 'gentle';
  if (days <= 30) return 'progressive';
  return 'rebuild';
});

const modeLabel = computed(() => {
  switch (comebackMode.value) {
    case 'gentle':
      return 'Mode reprise douce';
    case 'progressive':
      return 'Mode reprise progressive';
    case 'rebuild':
      return 'Mode reconstruction';
    default:
      return '';
  }
});

const modeBadgeClass = computed(() => {
  switch (comebackMode.value) {
    case 'gentle':
      return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
    case 'progressive':
      return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    case 'rebuild':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    default:
      return '';
  }
});

const subtitle = computed(() => {
  switch (comebackMode.value) {
    case 'gentle':
      return 'Commence par 70 % de ton volume habituel pour reprendre en douceur. Ton corps te remerciera !';
    case 'progressive':
      return 'On y va progressivement : 50 % du volume la première semaine, puis 75 % la deuxième. Tu vas vite retrouver ton niveau !';
    case 'rebuild':
      return 'Repars sur des bases solides avec des charges légères. Chaque répétition compte pour reconstruire ta forme !';
    default:
      return '';
  }
});

const show = computed(() => {
  return comebackMode.value !== null && !dismissed.value;
});

// Check localStorage on mount for previous dismissal
onMounted(() => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && props.lastWorkoutDate) {
      const parsed = JSON.parse(stored);
      // Only keep dismissal if it was for the same lastWorkoutDate
      if (parsed.lastWorkoutDate === props.lastWorkoutDate) {
        dismissed.value = true;
      } else {
        // Different comeback period, clear old dismissal
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  } catch {
    // Ignore localStorage errors
  }
});

const dismiss = () => {
  dismissed.value = true;
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        lastWorkoutDate: props.lastWorkoutDate,
        dismissedAt: new Date().toISOString(),
      })
    );
  } catch {
    // Ignore localStorage errors
  }
};
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
