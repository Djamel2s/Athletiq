/**
 * Active la classe `.theme-coach` sur <html> quand la route courante fait partie
 * de l'espace coach (/coaching/...). Independant du theme athlete (rose/sand) :
 * l'espace coach garde toujours sa propre identite visuelle.
 */
export function useCoachTheme() {
  const route = useRoute();

  const isCoachSection = computed(() => route.path.startsWith('/coaching'));

  function applyCoachTheme() {
    if (!process.client) return;
    const html = document.documentElement;
    if (isCoachSection.value) {
      html.classList.add('theme-coach');
    } else {
      html.classList.remove('theme-coach');
    }
  }

  watch(isCoachSection, applyCoachTheme, { immediate: true });

  return { isCoachSection, applyCoachTheme };
}
