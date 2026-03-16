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
  refreshToken: string | null
  isAuthenticated: boolean
  _isRefreshing: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
    _isRefreshing: false
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
      if (this._isRefreshing) return false
      this._isRefreshing = true

      try {
        const config = useRuntimeConfig()
        const response = await $fetch<{ token: string }>(`${config.public.apiUrl}/auth/refresh`, {
          method: 'POST',
          credentials: 'include', // Envoie le cookie httpOnly
          body: {}
        })

        this.token = response.token
        this.saveToLocalStorage()
        return true
      } catch (error) {
        logger.error('Token refresh error:', error)
        this.logout()
        return false
      } finally {
        this._isRefreshing = false
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
        this.saveToLocalStorage()
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
          this.saveToLocalStorage()
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
          this.saveToLocalStorage()
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

    setAuth(data: any) {
      this.user = data.user
      this.token = data.token
      // Le refresh token est maintenant géré par un cookie httpOnly côté serveur
      this.refreshToken = data.refreshToken || null
      this.isAuthenticated = true
      this.saveToLocalStorage()
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

      this._isRefreshing = false
      this.user = null
      this.token = null
      this.refreshToken = null
      this.isAuthenticated = false
      this.clearLocalStorage()
      navigateTo('/login')
    },

    saveToLocalStorage() {
      if (process.client) {
        localStorage.setItem('auth_token', this.token || '')
        localStorage.setItem('auth_user', JSON.stringify(this.user))
        // Le refresh token est géré par un cookie httpOnly, plus besoin en localStorage
      }
    },

    clearLocalStorage() {
      if (process.client) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_refresh_token') // Nettoyage legacy
        localStorage.removeItem('auth_user')
      }
    },

    loadFromLocalStorage() {
      if (process.client) {
        try {
          const token = localStorage.getItem('auth_token')
          const userStr = localStorage.getItem('auth_user')

          if (token && userStr) {
            const user = JSON.parse(userStr)
            if (user && typeof user === 'object' && user.id) {
              this.token = token
              this.user = user
              this.isAuthenticated = true
            } else {
              this.clearLocalStorage()
            }
          }
        } catch {
          this.clearLocalStorage()
        }
      }
    }
  }
})
