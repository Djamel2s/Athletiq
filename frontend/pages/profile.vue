<template>
  <div class="min-h-screen geometric-bg">
    <!-- Navigation -->
    <nav class="fixed top-0 left-0 right-0 z-50 nav-blur">
      <div class="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-5">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2 md:space-x-4">
            <NuxtLink to="/dashboard">
              <img src="/athletiq-icon.svg" alt="Athletiq" class="h-10 md:h-14 w-auto transition-transform duration-300 hover:scale-105" />
            </NuxtLink>
            <div class="flex items-center space-x-3">
              <span class="text-2xl text-[#d4c4b0] font-light hidden md:inline">|</span>
              <h1 class="text-lg md:text-2xl font-bold text-display bg-gradient-to-r from-[#d4c4b0] to-white dark:to-primary-100 bg-clip-text text-transparent">Mon Profil</h1>
            </div>
          </div>
          <NavActions />
        </div>
      </div>
    </nav>

    <div class="pt-24 md:pt-32 px-4 md:px-6 pb-8 md:pb-12">
    <div class="w-full max-w-lg mx-auto">
      <!-- Avatar -->
      <div class="text-center mb-2 fade-in">
        <p class="text-sm md:text-base text-primary-600 dark:text-primary-400 text-body-relaxed">Gerez vos informations personnelles</p>
      </div>

      <!-- Avatar -->
      <div class="flex justify-center mb-6 md:mb-8 fade-in">
        <div class="w-20 h-20 md:w-24 md:h-24 bg-gradient-primary rounded-full flex items-center justify-center shadow-lg">
          <span class="text-white text-2xl md:text-3xl font-bold">{{ initials }}</span>
        </div>
      </div>

      <!-- Formulaire -->
      <div class="card-glass slide-up">
        <form @submit.prevent="handleSave" class="space-y-5">
          <!-- Prenom et Nom -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="firstName" class="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1.5">
                Prenom
              </label>
              <input
                id="firstName"
                v-model="firstName"
                type="text"
                autocomplete="given-name"
                class="input-primary"
                placeholder="Jean"
              />
            </div>
            <div>
              <label for="lastName" class="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1.5">
                Nom
              </label>
              <input
                id="lastName"
                v-model="lastName"
                type="text"
                autocomplete="family-name"
                class="input-primary"
                placeholder="Dupont"
              />
            </div>
          </div>

          <!-- Email (lecture seule) -->
          <div>
            <label for="email" class="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1.5">
              Email
            </label>
            <input
              id="email"
              :value="authStore.user?.email"
              type="email"
              disabled
              class="input-primary opacity-60 cursor-not-allowed"
            />
          </div>

          <!-- Objectif -->
          <div>
            <label class="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-3">
              Objectif d'entrainement
            </label>
            <div class="grid grid-cols-2 gap-2 md:gap-3">
              <button
                v-for="goalOption in goals"
                :key="goalOption.value"
                type="button"
                @click="selectedGoal = goalOption.value"
                class="p-3 md:p-4 rounded-2xl border-2 transition-all duration-300 text-left flex items-start gap-2 md:gap-3"
                :class="selectedGoal === goalOption.value
                  ? 'border-[#d4c4b0] dark:border-[#b8a48f] bg-[#d4c4b0]/10 dark:bg-[#b8a48f]/15 shadow-md'
                  : 'border-primary-200 dark:border-primary-700 bg-white/50 dark:bg-primary-800/50 hover:border-primary-300 dark:hover:border-primary-600'"
              >
                <div class="w-7 h-7 md:w-8 md:h-8 rounded-lg flex-shrink-0 flex items-center justify-center mt-0.5"
                  :class="selectedGoal === goalOption.value ? 'bg-gradient-primary' : 'bg-primary-200 dark:bg-primary-700'">
                  <svg class="w-3.5 h-3.5 md:w-4 md:h-4" :class="selectedGoal === goalOption.value ? 'text-white' : 'text-primary-600 dark:text-primary-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="goalOption.iconPath"/>
                  </svg>
                </div>
                <div class="min-w-0">
                  <div class="font-semibold text-primary-900 dark:text-primary-100 text-xs md:text-sm">{{ goalOption.label }}</div>
                  <div class="text-primary-500 dark:text-primary-400 text-[10px] md:text-xs mt-0.5">{{ goalOption.desc }}</div>
                </div>
              </button>
            </div>
          </div>

          <!-- Success message -->
          <div v-if="success" class="p-3 rounded-xl bg-[#d4c4b0]/15 dark:bg-[#b8a48f]/15 border border-[#d4c4b0]/40 dark:border-[#b8a48f]/30">
            <p class="text-sm text-[#9d8569] font-medium">Profil mis a jour avec succes</p>
          </div>

          <!-- Error message -->
          <div v-if="error" class="p-3 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
            <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
          </div>

          <!-- Submit button -->
          <button
            type="submit"
            :disabled="loading"
            class="btn-primary w-full text-base md:text-lg py-3 md:py-4"
          >
            <span v-if="!loading">Enregistrer</span>
            <span v-else class="flex items-center justify-center gap-2">
              <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Enregistrement...
            </span>
          </button>
        </form>
      </div>

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

useHead({ meta: [{ name: 'robots', content: 'noindex, nofollow' }] })

const authStore = useAuthStore()

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
    navigateTo('/login')
    return
  }
  firstName.value = authStore.user?.firstName || ''
  lastName.value = authStore.user?.lastName || ''
  selectedGoal.value = authStore.user?.goal || null
})
</script>
