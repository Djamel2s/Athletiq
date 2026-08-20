import { computed, watch } from 'vue';

type AppMode = 'athlete' | 'coach';

const STORAGE_KEY = 'athletiq_app_mode';

export const useAppMode = () => {
  const route = useRoute();

  const mode = useState<AppMode>('athletiq-app-mode', () => 'athlete');

  // Synchronise le mode avec les routes qui définissent explicitement un espace.
  watch(
    () => route.path,
    (path) => {
      if (path === '/coaching' || path.startsWith('/coaching/')) {
        mode.value = 'coach';
      } else if (path === '/dashboard' || path.startsWith('/dashboard/')) {
        mode.value = 'athlete';
      }
    },
    { immediate: true }
  );

  // Récupère le dernier espace utilisé côté client.
  if (import.meta.client) {
    const savedMode = localStorage.getItem(STORAGE_KEY);

    if (savedMode === 'coach' || savedMode === 'athlete') {
      mode.value = savedMode;
    }

    watch(mode, (value) => {
      localStorage.setItem(STORAGE_KEY, value);
    });
  }

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
