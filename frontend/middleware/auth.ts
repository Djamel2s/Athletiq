export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()

  // Charger depuis localStorage si nécessaire
  if (process.client && !authStore.isAuthenticated) {
    authStore.loadFromLocalStorage()
  }

  // Rediriger vers login si non authentifié
  if (!authStore.isAuthenticated) {
    return navigateTo('/login')
  }
})
