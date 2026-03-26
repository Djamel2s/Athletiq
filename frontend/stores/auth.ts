import { defineStore } from 'pinia'

interface User {
  id: number
  email: string
  firstName?: string | null
  lastName?: string | null
  avatarUrl?: string | null
  goal?: string | null
  gender?: string | null
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isInitializing: boolean
  _refreshPromise: Promise<boolean> | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isInitializing: true,
    _refreshPromise: null
  }),

  getters: {
    fullName: (state): string => {
      if (!state.user) return ''
      return `${state.user.firstName || ''} ${state.user.lastName || ''}`.trim() || state.user.email
    }
  },

  actions: {
    async register(email: string, password: string, firstName?: string, lastName?: string, gender?: string) {
      try {
        const config = useRuntimeConfig()
        const response = await $fetch(`${config.public.apiUrl}/auth/register`, {
          method: 'POST',
          credentials: 'include',
          body: { email, password, firstName, lastName, gender }
        })

        this.setAuth(response)
        return { success: true }
      } catch (error: any) {
        logger.error('Registration error:', error)
        return {
          success: false,
          error: error.data?.error || 'Erreur lors de l\'inscription'
        }
      }
    },

    async login(email: string, password: string) {
      try {
        const config = useRuntimeConfig()
        const response = await $fetch(`${config.public.apiUrl}/auth/login`, {
          method: 'POST',
          credentials: 'include',
          body: { email, password }
        })

        this.setAuth(response)
        return { success: true }
      } catch (error: any) {
        logger.error('Login error:', error)
        return {
          success: false,
          error: error.data?.error || 'Email ou mot de passe incorrect'
        }
      }
    },

    async refreshAccessToken() {
      // If a refresh is already in progress, wait for it (race condition fix)
      if (this._refreshPromise) {
        return this._refreshPromise
      }

      this._refreshPromise = this._doRefresh()
      try {
        return await this._refreshPromise
      } finally {
        this._refreshPromise = null
      }
    },

    async _doRefresh(): Promise<boolean> {
      try {
        const config = useRuntimeConfig()
        const response = await $fetch<{ token: string }>(`${config.public.apiUrl}/auth/refresh`, {
          method: 'POST',
          credentials: 'include', // Envoie le cookie httpOnly
          body: {}
        })

        this.token = response.token
        return true
      } catch (error) {
        logger.error('Token refresh error:', error)
        this.logout()
        return false
      }
    },

    async updateProfile(data: { firstName?: string; lastName?: string; goal?: string; gender?: string }) {
      try {
        const config = useRuntimeConfig()
        const response = await $fetch<User>(`${config.public.apiUrl}/users/me`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${this.token}` },
          body: data
        })

        this.user = { ...this.user, ...response }
        this.saveUserToLocalStorage()
        return { success: true }
      } catch (error: any) {
        logger.error('Update profile error:', error)
        return {
          success: false,
          error: error.data?.error || 'Erreur lors de la mise à jour du profil'
        }
      }
    },

    async uploadAvatar(file: File) {
      try {
        const config = useRuntimeConfig()
        const formData = new FormData()
        formData.append('avatar', file)

        const response = await $fetch<any>(`${config.public.apiUrl}/users/me/avatar`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${this.token}` },
          body: formData
        })

        if (this.user) {
          this.user.avatarUrl = response.avatarUrl
          this.saveUserToLocalStorage()
        }
        return { success: true, avatarUrl: response.avatarUrl }
      } catch (error: any) {
        logger.error('Avatar upload error:', error)
        return {
          success: false,
          error: error.data?.error || 'Erreur lors de l\'upload de la photo'
        }
      }
    },

    async deleteAvatar() {
      try {
        const config = useRuntimeConfig()
        await $fetch(`${config.public.apiUrl}/users/me/avatar`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${this.token}` }
        })

        if (this.user) {
          this.user.avatarUrl = null
          this.saveUserToLocalStorage()
        }
        return { success: true }
      } catch (error: any) {
        logger.error('Avatar delete error:', error)
        return {
          success: false,
          error: error.data?.error || 'Erreur lors de la suppression de la photo'
        }
      }
    },

    setAuth(data: { user: User; token: string }) {
      this.user = data.user
      this.token = data.token
      this.isAuthenticated = true
      this.saveUserToLocalStorage()
    },

    logout() {
      // Invalidate refresh token server-side (fire and forget)
      if (this.token) {
        const config = useRuntimeConfig()
        $fetch(`${config.public.apiUrl}/auth/logout`, {
          method: 'POST',
          credentials: 'include',
          headers: { Authorization: `Bearer ${this.token}` }
        }).catch(() => {}) // Don't block logout on API failure
      }

      this._refreshPromise = null
      this.user = null
      this.token = null
      this.isAuthenticated = false
      this.clearLocalStorage()
      navigateTo('/login')
    },

    saveUserToLocalStorage() {
      if (process.client && this.user) {
        localStorage.setItem('auth_user', JSON.stringify({
          id: this.user.id,
          firstName: this.user.firstName,
          avatarUrl: this.user.avatarUrl,
          goal: this.user.goal,
          gender: this.user.gender
        }))
      }
    },

    clearLocalStorage() {
      if (process.client) {
        localStorage.removeItem('auth_token') // Nettoyage legacy
        localStorage.removeItem('auth_refresh_token') // Nettoyage legacy
        localStorage.removeItem('auth_user')
      }
    },

    loadUserFromLocalStorage() {
      if (process.client) {
        try {
          const userStr = localStorage.getItem('auth_user')

          if (userStr) {
            const user = JSON.parse(userStr)
            if (user && typeof user === 'object' && user.id) {
              this.user = user
              // Don't set isAuthenticated yet - need to refresh token first
            } else {
              this.clearLocalStorage()
            }
          }
          // Clean up legacy token from localStorage if present
          localStorage.removeItem('auth_token')
        } catch {
          this.clearLocalStorage()
        }
      }
    },

    /**
     * Initialize auth on page load.
     * Loads cached user data from localStorage for UX, then calls refresh
     * endpoint to get a new access token via httpOnly cookie.
     */
    async initAuth() {
      if (!process.client) return

      this.isInitializing = true
      this.loadUserFromLocalStorage()

      // Only attempt refresh if we have cached user data (i.e., was previously logged in)
      if (!this.user) {
        this.isInitializing = false
        return
      }

      // Try to get a fresh access token via the refresh cookie
      const success = await this.refreshAccessToken()
      if (success) {
        this.isAuthenticated = true
      } else {
        // Refresh failed - user is not authenticated
        this.user = null
        this.token = null
        this.isAuthenticated = false
      }
      this.isInitializing = false
    }
  }
})
