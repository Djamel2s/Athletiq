import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

const API_TIMEOUT = 30000

function fetchWithTimeout(url: string, opts: RequestInit = {}): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT)
  return fetch(url, { ...opts, signal: controller.signal }).finally(() => clearTimeout(timeoutId))
}

interface SubscriptionState {
  plan: string | null
  status: string | null
  trialDaysLeft: number
  trialEndDate: string | null
  currentPeriodEnd: string | null
  canceledAt: string | null
  isLoading: boolean
}

export const useSubscriptionStore = defineStore('subscription', {
  state: (): SubscriptionState => ({
    plan: null,
    status: null,
    trialDaysLeft: 0,
    trialEndDate: null,
    currentPeriodEnd: null,
    canceledAt: null,
    isLoading: false
  }),

  getters: {
    isActive: (state): boolean => {
      return state.status === 'ACTIVE' || state.status === 'TRIAL'
    },
    isTrial: (state): boolean => {
      return state.status === 'TRIAL'
    },
    isFree: (state): boolean => {
      return state.plan === 'FREE' || state.status === 'EXPIRED'
    },
    isExpired: (state): boolean => {
      return state.status === 'EXPIRED' || state.status === 'CANCELED'
    },
    isPastDue: (state): boolean => {
      return state.status === 'PAST_DUE'
    }
  },

  actions: {
    async fetchSubscription() {
      const authStore = useAuthStore()
      if (!authStore.token) return

      this.isLoading = true
      try {
        const config = useRuntimeConfig()
        const response = await fetchWithTimeout(`${config.public.apiUrl}/subscription`, {
          headers: { Authorization: `Bearer ${authStore.token}` }
        })

        if (response.ok) {
          const data = await response.json()
          const sub = data.subscription
          this.plan = sub.plan
          this.status = sub.status
          this.trialDaysLeft = sub.trialDaysLeft
          this.trialEndDate = sub.trialEndDate
          this.currentPeriodEnd = sub.currentPeriodEnd
          this.canceledAt = sub.canceledAt
        }
      } catch (error) {
        logger.error('Error fetching subscription:', error)
      } finally {
        this.isLoading = false
      }
    },

    async createCheckout(plan: 'monthly' | 'yearly') {
      const authStore = useAuthStore()
      if (!authStore.token) return

      try {
        const config = useRuntimeConfig()
        const response = await fetchWithTimeout(`${config.public.apiUrl}/subscription/checkout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authStore.token}`
          },
          body: JSON.stringify({ plan })
        })

        const data = await response.json()

        if (data.url) {
          // Validate redirect URL to prevent open redirect
          try {
            const url = new URL(data.url)
            if (!url.hostname.endsWith('.stripe.com')) throw new Error('Invalid redirect')
            if (url.protocol !== 'https:') throw new Error('Invalid protocol')
            window.location.href = data.url
          } catch {
            logger.error('Invalid redirect URL')
            return { error: 'URL de redirection invalide' }
          }
        } else {
          return { error: data.error || 'Erreur' }
        }
      } catch (error) {
        return { error: 'Erreur de connexion' }
      }
    },

    async openPortal() {
      const authStore = useAuthStore()
      if (!authStore.token) return

      try {
        const config = useRuntimeConfig()
        const response = await fetchWithTimeout(`${config.public.apiUrl}/subscription/portal`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authStore.token}`
          }
        })

        const data = await response.json()
        if (data.url) {
          // Validate redirect URL to prevent open redirect
          try {
            const url = new URL(data.url)
            if (!url.hostname.endsWith('.stripe.com')) throw new Error('Invalid redirect')
            if (url.protocol !== 'https:') throw new Error('Invalid protocol')
            window.location.href = data.url
          } catch {
            logger.error('Invalid portal redirect URL')
          }
        }
      } catch (error) {
        logger.error('Error opening portal:', error)
      }
    },

    async cancelSubscription() {
      const authStore = useAuthStore()
      if (!authStore.token) return

      try {
        const config = useRuntimeConfig()
        const response = await fetchWithTimeout(`${config.public.apiUrl}/subscription/cancel`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authStore.token}`
          }
        })

        if (response.ok) {
          await this.fetchSubscription()
          return { success: true }
        }

        const data = await response.json()
        return { error: data.error }
      } catch (error) {
        return { error: 'Erreur de connexion' }
      }
    }
  }
})
