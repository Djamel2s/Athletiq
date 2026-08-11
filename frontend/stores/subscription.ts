import { defineStore } from 'pinia';
import { useAuthStore } from './auth';
import { apiFetch } from '~/utils/apiFetch';
import { tSync } from '~/composables/useLocale';

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface SubscriptionState {
  plan: string | null;
  status: string | null;
  trialDaysLeft: number;
  trialEndDate: string | null;
  currentPeriodEnd: string | null;
  canceledAt: string | null;
  isLoading: boolean;
  _lastFetchedAt: number | null;
}

export const useSubscriptionStore = defineStore('subscription', {
  state: (): SubscriptionState => ({
    plan: null,
    status: null,
    trialDaysLeft: 0,
    trialEndDate: null,
    currentPeriodEnd: null,
    canceledAt: null,
    isLoading: false,
    _lastFetchedAt: null,
  }),

  getters: {
    isActive: (state): boolean => {
      return state.status === 'ACTIVE' || state.status === 'TRIAL';
    },
    isTrial: (state): boolean => {
      return state.status === 'TRIAL';
    },
    isFree: (state): boolean => {
      return state.plan === 'FREE' || state.status === 'EXPIRED';
    },
    isExpired: (state): boolean => {
      return state.status === 'EXPIRED' || state.status === 'CANCELED';
    },
    isPastDue: (state): boolean => {
      return state.status === 'PAST_DUE';
    },
  },

  actions: {
    async fetchSubscription(forceRefresh = false) {
      const authStore = useAuthStore();
      if (!authStore.token) return;

      // Return cached data if fresh enough
      if (
        !forceRefresh &&
        this._lastFetchedAt &&
        this.plan !== null &&
        Date.now() - this._lastFetchedAt < CACHE_TTL
      ) {
        return;
      }

      this.isLoading = true;
      try {
        const data = await apiFetch<{ subscription: any }>('/subscription');
        const sub = data.subscription;
        this.plan = sub.plan;
        this.status = sub.status;
        this.trialDaysLeft = sub.trialDaysLeft;
        this.trialEndDate = sub.trialEndDate;
        this.currentPeriodEnd = sub.currentPeriodEnd;
        this.canceledAt = sub.canceledAt;
        this._lastFetchedAt = Date.now();
      } catch (error) {
        logger.error('Error fetching subscription:', error);
      } finally {
        this.isLoading = false;
      }
    },

    async createCheckout(plan: 'monthly' | 'yearly') {
      const authStore = useAuthStore();
      if (!authStore.token) return;

      try {
        const data = await apiFetch<{ url?: string; error?: string }>('/subscription/checkout', {
          method: 'POST',
          body: { plan },
        });

        if (data.url) {
          // Validate redirect URL to prevent open redirect
          try {
            const url = new URL(data.url);
            const allowedHosts = ['checkout.stripe.com', 'billing.stripe.com'];
            if (!allowedHosts.includes(url.hostname)) throw new Error('Invalid redirect');
            if (url.protocol !== 'https:') throw new Error('Invalid protocol');
            window.location.href = data.url;
          } catch {
            logger.error('Invalid redirect URL');
            return { error: tSync('subscriptionStore.invalidRedirect') };
          }
        } else {
          return { error: data.error || tSync('common.error') };
        }
      } catch (error) {
        return { error: tSync('subscriptionStore.connectionError') };
      }
    },

    async openPortal() {
      const authStore = useAuthStore();
      if (!authStore.token) return { error: tSync('subscriptionStore.notAuthenticated') };

      try {
        const data = await apiFetch<{ url?: string; error?: string }>('/subscription/portal', {
          method: 'POST',
        });

        if (!data.url) {
          return { error: data.error || tSync('subscriptionStore.errorOpenPortal') };
        }
        // Validate redirect URL to prevent open redirect
        try {
          const url = new URL(data.url);
          const allowedHosts = ['checkout.stripe.com', 'billing.stripe.com'];
          if (!allowedHosts.includes(url.hostname)) throw new Error('Invalid redirect');
          if (url.protocol !== 'https:') throw new Error('Invalid protocol');
          window.location.href = data.url;
        } catch {
          logger.error('Invalid portal redirect URL');
          return { error: tSync('subscriptionStore.invalidRedirect') };
        }
      } catch (error) {
        logger.error('Error opening portal:', error);
        return { error: tSync('subscriptionStore.connectionError') };
      }
    },

    async cancelSubscription() {
      const authStore = useAuthStore();
      if (!authStore.token) return;

      try {
        await apiFetch('/subscription/cancel', {
          method: 'POST',
        });
        await this.fetchSubscription(true);
        return { success: true };
      } catch (error: any) {
        return { error: error.data?.error || tSync('subscriptionStore.connectionError') };
      }
    },
  },
});
