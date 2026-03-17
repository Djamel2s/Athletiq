export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore()

  // Initialize auth if not already done (loads cached user + refreshes token)
  if (process.client && !authStore.isAuthenticated) {
    await authStore.initAuth()
  }

  // Rediriger vers login si non authentifié
  if (!authStore.isAuthenticated) {
    return navigateTo('/login')
  }
})
