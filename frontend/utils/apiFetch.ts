import { useAuthStore } from '~/stores/auth'

export async function apiFetch<T>(url: string, opts: any = {}): Promise<T> {
  const authStore = useAuthStore()
  const config = useRuntimeConfig()

  const fullUrl = `${config.public.apiUrl}${url}`
  const headers = {
    ...opts.headers,
    ...(authStore.token ? { Authorization: `Bearer ${authStore.token}` } : {})
  }

  try {
    return await $fetch<T>(fullUrl, { ...opts, headers })
  } catch (error: any) {
    if (error?.statusCode === 401 && authStore.token) {
      const refreshed = await authStore.refreshAccessToken()
      if (refreshed) {
        return await $fetch<T>(fullUrl, {
          ...opts,
          headers: { ...opts.headers, Authorization: `Bearer ${authStore.token}` }
        })
      }
      authStore.logout()
    }
    throw error
  }
}
