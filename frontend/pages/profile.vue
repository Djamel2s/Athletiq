<template>
  <div class="min-h-screen px-6 py-12 geometric-bg">
    <div class="w-full max-w-lg mx-auto">
      <!-- Header -->
      <div class="text-center mb-10 fade-in">
        <NuxtLink to="/dashboard" class="inline-block">
          <img src="/athletiq-icon.svg" alt="Athletiq" class="h-16 w-auto mx-auto mb-4 hover:scale-105 transition-transform duration-300" />
        </NuxtLink>
        <h1 class="text-3xl md:text-4xl font-bold text-primary-900 dark:text-primary-100 mb-2 text-display">Mon Profil</h1>
        <p class="text-primary-600 dark:text-primary-400 text-body-relaxed">Gerez vos informations personnelles</p>
      </div>

      <!-- Avatar -->
      <div class="flex justify-center mb-8 fade-in">
        <div class="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center shadow-lg">
          <span class="text-white text-3xl font-bold">{{ initials }}</span>
        </div>
      </div>

      <!-- Formulaire -->
      <div class="card-glass slide-up">
        <form @submit.prevent="handleSave" class="space-y-6">
          <!-- Prenom et Nom -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="firstName" class="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
                Prenom
              </label>
              <input
                id="firstName"
                v-model="firstName"
                type="text"
                autocomplete="given-name"
                class="input"
                placeholder="Jean"
              />
            </div>
            <div>
              <label for="lastName" class="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
                Nom
              </label>
              <input
                id="lastName"
                v-model="lastName"
                type="text"
                autocomplete="family-name"
                class="input"
                placeholder="Dupont"
              />
            </div>
          </div>

          <!-- Email (lecture seule) -->
          <div>
            <label for="email" class="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
              Email
            </label>
            <input
              id="email"
              :value="authStore.user?.email"
              type="email"
              disabled
              class="input opacity-60 cursor-not-allowed"
            />
          </div>

          <!-- Objectif -->
          <div>
            <label class="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-3">
              Objectif d'entrainement
            </label>
            <div class="grid grid-cols-2 gap-3">
              <button
                v-for="goalOption in goals"
                :key="goalOption.value"
                type="button"
                @click="selectedGoal = goalOption.value"
                class="p-4 rounded-2xl border-2 transition-all duration-300 text-left flex items-start gap-3"
                :class="selectedGoal === goalOption.value
                  ? 'border-sand-500 dark:border-sand-600 bg-sand-50 dark:bg-sand-900/30 shadow-md'
                  : 'border-primary-200 dark:border-primary-700 bg-white/50 dark:bg-primary-800/50 hover:border-primary-300 dark:hover:border-primary-600 hover:bg-white/70 dark:hover:bg-primary-800/70'"
              >
                <div class="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center mt-0.5"
                  :class="selectedGoal === goalOption.value ? 'bg-gradient-primary' : 'bg-primary-200 dark:bg-primary-700'">
                  <svg class="w-4 h-4" :class="selectedGoal === goalOption.value ? 'text-white' : 'text-primary-600 dark:text-primary-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="goalOption.iconPath"/>
                  </svg>
                </div>
                <div>
                  <div class="font-semibold text-primary-900 dark:text-primary-100 text-sm">{{ goalOption.label }}</div>
                  <div class="text-primary-500 dark:text-primary-400 text-xs mt-1">{{ goalOption.desc }}</div>
                </div>
              </button>
            </div>
          </div>

          <!-- Success message -->
          <div v-if="success" class="p-4 rounded-2xl bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800">
            <p class="text-sm text-green-600 dark:text-green-400">Profil mis a jour avec succes</p>
          </div>

          <!-- Error message -->
          <div v-if="error" class="p-4 rounded-2xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
            <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
          </div>

          <!-- Submit button -->
          <button
            type="submit"
            :disabled="loading"
            class="btn-primary w-full text-lg py-4"
          >
            <span v-if="!loading">Enregistrer</span>
            <span v-else>Enregistrement...</span>
          </button>
        </form>
      </div>

      <!-- Retour au dashboard -->
      <div class="text-center mt-8">
        <NuxtLink to="/dashboard" class="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100 transition-colors inline-flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          Retour au dashboard
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: false,
  middleware: 'auth'
})

const authStore = useAuthStore()
const router = useRouter()

const firstName = ref('')
const lastName = ref('')
const selectedGoal = ref<string | null>(null)
const loading = ref(false)
const error = ref('')
const success = ref(false)

const goals = [
  { value: 'BULK', label: 'Prise de masse', desc: 'Gagner du muscle', iconPath: 'M13 10V3L4 14h7v7l9-11h-7z' },
  { value: 'STRENGTH', label: 'Force', desc: 'Devenir plus fort', iconPath: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4' },
  { value: 'RECOMP', label: 'Recomposition', desc: 'Muscle & perte de gras', iconPath: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' },
  { value: 'CUT', label: 'Seche', desc: 'Perdre du gras', iconPath: 'M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z' }
]

const initials = computed(() => {
  const f = firstName.value?.charAt(0) || ''
  const l = lastName.value?.charAt(0) || ''
  return (f + l).toUpperCase() || '?'
})

const handleSave = async () => {
  error.value = ''
  success.value = false
  loading.value = true

  try {
    const data: Record<string, string> = {}
    if (firstName.value) data.firstName = firstName.value
    if (lastName.value) data.lastName = lastName.value
    if (selectedGoal.value) data.goal = selectedGoal.value

    const result = await authStore.updateProfile(data)

    if (result.success) {
      success.value = true
      setTimeout(() => { success.value = false }, 3000)
    } else {
      error.value = result.error || 'Une erreur est survenue'
    }
  } catch (err) {
    error.value = 'Une erreur est survenue'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  authStore.loadFromLocalStorage()
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  firstName.value = authStore.user?.firstName || ''
  lastName.value = authStore.user?.lastName || ''
  selectedGoal.value = authStore.user?.goal || null
})
</script>
