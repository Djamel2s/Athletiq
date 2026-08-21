import { computed, watch } from 'vue';

type AppMode = 'athlete' | 'coach';

const STORAGE_KEY = 'athletiq_app_mode';

// Routes qui appartiennent EXCLUSIVEMENT à l'espace coach.
const isCoachRoute = (path: string) => path === '/coaching' || path.startsWith('/coaching/');

// Routes qui appartiennent EXCLUSIVEMENT à l'espace athlète. Toute route
// authentifiée qui n'est ni coach ni dans cette liste est considérée comme
// "partagée" (profil, paramètres, édition de profil...) et conserve le
// dernier espace connu au lieu de forcer un basculement.
const ATHLETE_ONLY_BASES = [
  '/dashboard',
  '/workouts',
  '/programs',
  '/statistics',
  '/calendar',
  '/body',
  '/friends',
  '/achievements',
  '/streak',
  '/wrapped',
  '/my-coach',
  '/subscription',
  '/onboarding',
];
const isAthleteOnlyRoute = (path: string) =>
  ATHLETE_ONLY_BASES.some((base) => path === base || path.startsWith(`${base}/`));

let hasHydratedFromStorage = false;
let hasStorageWatcher = false;

export const useAppMode = () => {
  const route = useRoute();

  const mode = useState<AppMode>('athletiq-app-mode', () => 'athlete');

  if (import.meta.client && !hasHydratedFromStorage) {
    hasHydratedFromStorage = true;
    const savedMode = localStorage.getItem(STORAGE_KEY);
    if (savedMode === 'coach' || savedMode === 'athlete') {
      mode.value = savedMode;
    }
  }

  if (import.meta.client && !hasStorageWatcher) {
    hasStorageWatcher = true;
    watch(mode, (value) => {
      localStorage.setItem(STORAGE_KEY, value);
    });
  }

  watch(
    () => route.path,
    (path) => {
      if (isCoachRoute(path)) {
        mode.value = 'coach';
      } else if (isAthleteOnlyRoute(path)) {
        mode.value = 'athlete';
      }
    },
    { immediate: true }
  );

  const isCoachMode = computed(() => mode.value === 'coach');

  const homePath = computed(() => (isCoachMode.value ? '/coaching' : '/dashboard'));

  const setCoachMode = () => {
    mode.value = 'coach';
  };

  const setAthleteMode = () => {
    mode.value = 'athlete';
  };

  const toggleMode = () => {
    mode.value = isCoachMode.value ? 'athlete' : 'coach';
  };

  return {
    mode,
    isCoachMode,
    homePath,
    setCoachMode,
    setAthleteMode,
    toggleMode,
  };
};
