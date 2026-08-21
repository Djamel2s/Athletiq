export function useCoachTheme() {
  const route = useRoute();
  const { isCoachMode } = useAppMode();

  const isLandingPage = computed(() => route.path === '/' || route.path === '/coach-landing');
  const isCoachTheme = computed(() =>
    isLandingPage.value ? route.path === '/coach-landing' : isCoachMode.value
  );

  function applyCoachTheme() {
    if (!process.client) return;
    const html = document.documentElement;
    if (isCoachTheme.value) {
      html.classList.add('theme-coach');
    } else {
      html.classList.remove('theme-coach');
    }
  }

  watch(isCoachTheme, applyCoachTheme, { immediate: true });

  return { isCoachSection: isCoachTheme, applyCoachTheme };
}
