import { defineStore } from 'pinia'

interface User {
  id: number
  email: string
  firstName?: string | null
  lastName?: string | null
  avatarUrl?: string | null
}

interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false
  }),

  getters: {
    fullName: (state): string => {
      if (!state.user) return ''
      return `${state.user.firstName || ''} ${state.user.lastName || ''}`.trim() || state.user.email
    }
  },

  actions: {
    async register(email: string, password: string, firstName?: string, lastName?: string) {
      try {
        const config = useRuntimeConfig()
        const response = await $fetch(`${config.public.apiUrl}/auth/register`, {
          method: 'POST',
          body: { email, password, firstName, lastName }
        })

        this.setAuth(response)
        return { success: true }
      } catch (error: any) {
        console.error('Registration error:', error)
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
          body: { email, password }
        })

        this.setAuth(response)
        return { success: true }
      } catch (error: any) {
        console.error('Login error:', error)
        return {
          success: false,
          error: error.data?.error || 'Email ou mot de passe incorrect'
        }
      }
    },

    async refreshAccessToken() {
      if (!this.refreshToken) {
        this.logout()
        return false
      }

      try {
        const config = useRuntimeConfig()
        const response = await $fetch(`${config.public.apiUrl}/auth/refresh`, {
          method: 'POST',
          body: { refreshToken: this.refreshToken }
        })

        this.token = response.token
        this.refreshToken = response.refreshToken
        this.saveToLocalStorage()
        return true
      } catch (error) {
        console.error('Token refresh error:', error)
        this.logout()
        return false
      }
    },

    setAuth(data: any) {
      this.user = data.user
      this.token = data.token
      this.refreshToken = data.refreshToken
      this.isAuthenticated = true
      this.saveToLocalStorage()
    },

    logout() {
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
        localStorage.setItem('auth_refresh_token', this.refreshToken || '')
        localStorage.setItem('auth_user', JSON.stringify(this.user))
      }
    },

    clearLocalStorage() {
      if (process.client) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_refresh_token')
        localStorage.removeItem('auth_user')
      }
    },

    loadFromLocalStorage() {
      if (process.client) {
        const token = localStorage.getItem('auth_token')
        const refreshToken = localStorage.getItem('auth_refresh_token')
        const userStr = localStorage.getItem('auth_user')

        if (token && refreshToken && userStr) {
          this.token = token
          this.refreshToken = refreshToken
          this.user = JSON.parse(userStr)
          this.isAuthenticated = true
        }
      }
    }
  }
})
