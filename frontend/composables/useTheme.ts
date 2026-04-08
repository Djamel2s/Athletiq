import { useAuthStore } from '~/stores/auth';

const SAND_COLORS = {
  500: '#d4c4b0',
  600: '#b8a48f',
  700: '#9b8772',
  rgb500: '212, 196, 176',
};

const ROSE_COLORS = {
  500: '#d4b0bc',
  600: '#b88fa0',
  700: '#9b7284',
  rgb500: '212, 176, 188',
};

export function useTheme() {
  const authStore = useAuthStore();

  const isRose = computed(() => authStore.user?.gender === 'female');

  const accentColors = computed(() => (isRose.value ? ROSE_COLORS : SAND_COLORS));

  // Apply theme class to <html>
  function applyTheme() {
    if (!process.client) return;
    const html = document.documentElement;
    if (isRose.value) {
      html.classList.add('theme-rose');
    } else {
      html.classList.remove('theme-rose');
    }
  }

  watch(isRose, applyTheme, { immediate: true });

  return {
    isRose,
    accentColors,
    applyTheme,
  };
}
