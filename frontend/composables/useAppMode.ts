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

export const useAppMode = () => {
  const route = useRoute();

  const mode = useState<AppMode>('athletiq-app-mode', () => 'athlete');

  // Récupère le dernier espace utilisé côté client. Sert de valeur par
  // défaut pour les routes partagées ; les routes exclusives (ci-dessous)
  // reprennent toujours la main dessus.
  if (import.meta.client) {
    const savedMode = localStorage.getItem(STORAGE_KEY);

    if (savedMode === 'coach' || savedMode === 'athlete') {
      mode.value = savedMode;
    }

    watch(mode, (value) => {
      localStorage.setItem(STORAGE_KEY, value);
    });
  }

  // Synchronise le mode avec la route courante. Une route exclusive à un
  // espace force toujours le mode correspondant (ex: /workouts force
  // "athlete" même si le dernier espace visité/mémorisé était "coach") :
  // c'est ce qui évite la fuite d'un espace vers l'autre (logo, thème,
  // fil d'Ariane...). Les routes partagées ne touchent pas au mode.
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
