/**
 * Active la classe `.theme-coach` sur <html> quand l'application est en mode coach.
 * Utilise l'état explicite de useAppMode au lieu d'inférer depuis la route,
 * pour que les routes partagées (profil, paramètres) conservent le thème coach.
 */
export function useCoachTheme() {
  const { isCoachMode } = useAppMode();

  function applyCoachTheme() {
    if (!process.client) return;
    const html = document.documentElement;
    if (isCoachMode.value) {
      html.classList.add('theme-coach');
    } else {
      html.classList.remove('theme-coach');
    }
  }

  watch(isCoachMode, applyCoachTheme, { immediate: true });

  return { isCoachSection: isCoachMode, applyCoachTheme };
}
