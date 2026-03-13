<template>
  <div class="min-h-screen px-4 md:px-6 py-8 md:py-12 geometric-bg">
    <div class="w-full max-w-2xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-10 fade-in">
        <NuxtLink to="/dashboard" class="inline-block">
          <AppLogo class="h-10 md:h-14 w-auto mx-auto mb-4 hover:scale-105 transition-transform duration-300" />
        </NuxtLink>
        <h1 class="text-2xl md:text-4xl font-bold text-primary-900 dark:text-primary-100 mb-2 text-display">Abonnement</h1>
        <p class="text-primary-600 dark:text-primary-400 text-body-relaxed">Gérez votre plan Athletiq</p>
      </div>

      <!-- Success/Cancel messages -->
      <div v-if="route.query.success" class="mb-6 p-4 rounded-2xl bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 fade-in">
        <p class="text-green-700 dark:text-green-300 font-medium text-center">Paiement réussi ! Votre abonnement est maintenant actif.</p>
      </div>
      <div v-if="route.query.canceled" class="mb-6 p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 fade-in">
        <p class="text-amber-700 dark:text-amber-300 font-medium text-center">Paiement annulé. Vous pouvez réessayer quand vous voulez.</p>
      </div>

      <!-- Loading -->
      <div v-if="subscriptionStore.isLoading" class="card-glass text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-200 dark:border-primary-700 border-t-primary-600"></div>
      </div>

      <div v-else class="space-y-6 slide-up">
        <!-- Current Plan Status -->
        <div class="card-glass">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
            </div>
            <div>
              <h2 class="text-lg font-bold text-primary-900 dark:text-primary-100">{{ planLabel }}</h2>
              <p class="text-sm text-primary-600 dark:text-primary-400">{{ statusLabel }}</p>
            </div>
            <div class="ml-auto">
              <span :class="statusBadgeClass" class="px-3 py-1 rounded-full text-xs font-semibold">
                {{ statusBadgeText }}
              </span>
            </div>
          </div>

          <!-- Trial progress bar -->
          <div v-if="subscriptionStore.isTrial" class="mt-4">
            <div class="flex justify-between text-sm mb-2">
              <span class="text-primary-600 dark:text-primary-400">Essai gratuit</span>
              <span class="font-semibold text-primary-900 dark:text-primary-100">{{ subscriptionStore.trialDaysLeft }} jour{{ subscriptionStore.trialDaysLeft > 1 ? 's' : '' }} restant{{ subscriptionStore.trialDaysLeft > 1 ? 's' : '' }}</span>
            </div>
            <div class="w-full h-2 bg-primary-200 dark:bg-primary-700 rounded-full overflow-hidden">
              <div
                class="h-full bg-gradient-primary rounded-full transition-all duration-500"
                :style="{ width: `${Math.max(5, (subscriptionStore.trialDaysLeft / 14) * 100)}%` }"
              ></div>
            </div>
          </div>

          <!-- Active subscription info -->
          <div v-if="subscriptionStore.status === 'ACTIVE' && subscriptionStore.currentPeriodEnd" class="mt-4 text-sm text-primary-600 dark:text-primary-400">
            Prochain renouvellement : {{ formatDate(subscriptionStore.currentPeriodEnd) }}
            <span v-if="subscriptionStore.canceledAt" class="text-amber-600 dark:text-amber-400"> (annulé, actif jusqu'à cette date)</span>
          </div>
        </div>

        <!-- Usage / Limites (plan gratuit) -->
        <div v-if="!isPremium" class="card-glass">
          <h3 class="text-lg font-semibold text-primary-900 dark:text-primary-100 mb-4">Votre utilisation</h3>
          <div class="space-y-4">
            <div v-for="item in usageItems" :key="item.label">
              <div class="flex justify-between text-sm mb-1">
                <span class="text-primary-700 dark:text-primary-300">{{ item.label }}</span>
                <span class="font-semibold text-primary-900 dark:text-primary-100">{{ item.text }}</span>
              </div>
              <div class="w-full h-1.5 bg-primary-200 dark:bg-primary-700 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-500"
                  :class="item.percent >= 100 ? 'bg-red-500' : 'bg-gradient-primary'"
                  :style="{ width: `${Math.min(100, item.percent)}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pricing Cards -->
        <div v-if="showPricing">
          <h3 class="text-xl font-bold text-primary-900 dark:text-primary-100 mb-4 text-center">Passez Pro</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Monthly -->
            <div class="card-glass relative group hover:scale-[1.02] transition-transform">
              <h4 class="text-lg font-bold text-primary-900 dark:text-primary-100 mb-1">Mensuel</h4>
              <div class="flex items-baseline gap-1 mb-4">
                <span class="text-3xl font-bold bg-gradient-to-r from-sand-500 to-sand-700 bg-clip-text text-transparent">9,99€</span>
                <span class="text-primary-500 dark:text-primary-400">/mois</span>
              </div>
              <ul class="space-y-2 mb-6 text-sm text-primary-600 dark:text-primary-400">
                <li class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                  Tout illimité
                </li>
                <li class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                  Sans engagement
                </li>
              </ul>
              <button @click="checkout('monthly')" :disabled="checkoutLoading" class="btn-primary w-full">
                {{ checkoutLoading ? 'Redirection...' : 'Choisir ce plan' }}
              </button>
            </div>

            <!-- Yearly -->
            <div class="card-glass relative group hover:scale-[1.02] transition-transform border-2 border-sand-500/50">
              <div class="absolute -top-3 right-4 px-3 py-1 bg-gradient-primary text-white text-xs font-bold rounded-full">
                -33%
              </div>
              <h4 class="text-lg font-bold text-primary-900 dark:text-primary-100 mb-1">Annuel</h4>
              <div class="flex items-baseline gap-1 mb-1">
                <span class="text-3xl font-bold bg-gradient-to-r from-sand-500 to-sand-700 bg-clip-text text-transparent">79,99€</span>
                <span class="text-primary-500 dark:text-primary-400">/an</span>
              </div>
              <p class="text-sm text-primary-500 dark:text-primary-400 mb-4">soit 6,66€/mois</p>
              <ul class="space-y-2 mb-6 text-sm text-primary-600 dark:text-primary-400">
                <li class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                  Tout illimité
                </li>
                <li class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                  2 mois offerts
                </li>
              </ul>
              <button @click="checkout('yearly')" :disabled="checkoutLoading" class="btn-primary w-full">
                {{ checkoutLoading ? 'Redirection...' : 'Choisir ce plan' }}
              </button>
            </div>
          </div>

          <p class="text-center text-xs text-primary-500 dark:text-primary-400 mt-4">
            Paiement sécurisé par Stripe — Carte bancaire, Apple Pay, Google Pay
          </p>
        </div>

        <!-- Manage subscription -->
        <div v-if="subscriptionStore.status === 'ACTIVE' && !subscriptionStore.canceledAt" class="card-glass">
          <h3 class="text-lg font-semibold text-primary-900 dark:text-primary-100 mb-4">Gérer mon abonnement</h3>
          <div class="flex flex-col sm:flex-row gap-3">
            <button @click="subscriptionStore.openPortal()" class="btn-primary flex-1">
              Modifier le moyen de paiement
            </button>
            <button @click="confirmCancel" class="px-6 py-3 rounded-xl border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex-1">
              Annuler l'abonnement
            </button>
          </div>
        </div>

        <!-- Comparaison Gratuit vs Pro -->
        <div class="card-glass">
          <h3 class="text-lg font-semibold text-primary-900 dark:text-primary-100 mb-4">Gratuit vs Pro</h3>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-primary-200 dark:border-primary-700">
                  <th class="text-left py-2 text-primary-600 dark:text-primary-400 font-medium">Fonctionnalité</th>
                  <th class="text-center py-2 text-primary-600 dark:text-primary-400 font-medium">Gratuit</th>
                  <th class="text-center py-2 font-semibold text-primary-900 dark:text-primary-100">Pro</th>
                </tr>
              </thead>
              <tbody class="text-primary-700 dark:text-primary-300">
                <tr v-for="row in comparisonTable" :key="row.feature" class="border-b border-primary-100 dark:border-primary-800">
                  <td class="py-2.5">{{ row.feature }}</td>
                  <td class="py-2.5 text-center">{{ row.free }}</td>
                  <td class="py-2.5 text-center font-semibold">{{ row.pro }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Back link -->
        <div class="text-center">
          <NuxtLink to="/settings" class="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100 transition-colors inline-flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            Retour aux paramètres
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useSubscriptionStore } from '~/stores/subscription'
import { useSubscriptionLimits } from '~/composables/useSubscriptionLimits'

useHead({ meta: [{ name: 'robots', content: 'noindex, nofollow' }] })

definePageMeta({
  layout: false,
  middleware: 'auth'
})

const route = useRoute()
const authStore = useAuthStore()
const subscriptionStore = useSubscriptionStore()
const { isPremium, usage, fetchUsage, workoutUsageText, templateUsageText, photoUsageText, goalUsageText } = useSubscriptionLimits()
const checkoutLoading = ref(false)

onMounted(async () => {
  authStore.loadFromLocalStorage()
  if (!authStore.isAuthenticated) {
    navigateTo('/login')
    return
  }
  await subscriptionStore.fetchSubscription()
  await fetchUsage()
})

const comparisonTable = [
  { feature: 'Séances / semaine', free: '2', pro: 'Illimité' },
  { feature: 'Templates de workout', free: '2', pro: 'Illimité' },
  { feature: 'Historique', free: '30 jours', pro: 'Complet' },
  { feature: 'Photos de progression', free: '3', pro: 'Illimité' },
  { feature: 'Objectifs', free: '1', pro: 'Illimité' },
  { feature: 'Stats avancées', free: 'Oui', pro: 'Oui' },
  { feature: 'Suivi corporel', free: 'Oui', pro: 'Oui' },
  { feature: 'Calendrier & streaks', free: 'Oui', pro: 'Oui' },
  { feature: 'Partage Instagram', free: 'Oui', pro: 'Oui' },
]

const usageItems = computed(() => [
  {
    label: 'Séances cette semaine',
    text: workoutUsageText.value,
    percent: usage.value.workoutsThisWeek / 2 * 100
  },
  {
    label: 'Templates',
    text: templateUsageText.value,
    percent: usage.value.templates / 2 * 100
  },
  {
    label: 'Photos',
    text: photoUsageText.value,
    percent: usage.value.photos / 3 * 100
  },
  {
    label: 'Objectifs',
    text: goalUsageText.value,
    percent: usage.value.goals / 1 * 100
  }
])

const showPricing = computed(() => {
  // Montrer le pricing sauf si l'utilisateur a un abonnement payant actif (MONTHLY/YEARLY)
  const isPaid = subscriptionStore.status === 'ACTIVE' &&
    (subscriptionStore.plan === 'MONTHLY' || subscriptionStore.plan === 'YEARLY')
  return !isPaid
})

const planLabel = computed(() => {
  switch (subscriptionStore.plan) {
    case 'MONTHLY': return 'Abonnement Mensuel'
    case 'YEARLY': return 'Abonnement Annuel'
    case 'FREE_TRIAL': return 'Essai Gratuit (14 jours Pro)'
    case 'FREE': return 'Plan Gratuit'
    default: return 'Plan Gratuit'
  }
})

const statusLabel = computed(() => {
  if (subscriptionStore.isTrial) return `${subscriptionStore.trialDaysLeft} jours restants — tout est illimité pendant l'essai`
  if (subscriptionStore.status === 'ACTIVE') return 'Votre abonnement Pro est actif'
  if (subscriptionStore.status === 'PAST_DUE') return 'Paiement en attente'
  if (subscriptionStore.status === 'CANCELED') return 'Abonnement annulé'
  return 'Vous utilisez le plan gratuit'
})

const statusBadgeClass = computed(() => {
  if (subscriptionStore.isActive) return 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'
  if (subscriptionStore.isPastDue) return 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
  if (subscriptionStore.plan === 'FREE') return 'bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-300'
  return 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'
})

const statusBadgeText = computed(() => {
  if (subscriptionStore.isTrial) return 'Essai Pro'
  if (subscriptionStore.status === 'ACTIVE') return 'Pro'
  if (subscriptionStore.isPastDue) return 'En attente'
  if (subscriptionStore.plan === 'FREE') return 'Gratuit'
  return 'Expiré'
})

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const checkout = async (plan: 'monthly' | 'yearly') => {
  checkoutLoading.value = true
  const result = await subscriptionStore.createCheckout(plan)
  if (result?.error) {
    alert(result.error)
  }
  checkoutLoading.value = false
}

const confirmCancel = async () => {
  if (confirm('Êtes-vous sûr de vouloir annuler votre abonnement ? Il restera actif jusqu\'à la fin de la période en cours. Vous passerez ensuite au plan gratuit.')) {
    const result = await subscriptionStore.cancelSubscription()
    if (result?.error) {
      alert(result.error)
    }
  }
}
</script>
