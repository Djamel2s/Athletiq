<template>
  <div class="min-h-screen flex items-center justify-center px-6 py-12 geometric-bg">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-10 fade-in">
        <NuxtLink to="/" class="inline-block">
          <img src="/athletiq-icon.svg" alt="Athletiq" class="h-16 w-auto mx-auto mb-4 hover:scale-105 transition-transform duration-300" />
        </NuxtLink>
        <h1 class="text-4xl font-bold text-primary-900 dark:text-primary-100 mb-2 text-display">Inscription</h1>
        <p class="text-primary-600 dark:text-primary-400 text-body-relaxed">Créez votre compte gratuitement</p>
      </div>

      <!-- Formulaire -->
      <div class="card-glass slide-up">
        <form @submit.prevent="handleRegister" class="space-y-6">
          <!-- Prénom et Nom -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="firstName" class="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
                Prénom
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

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
              Email
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              autocomplete="email"
              class="input"
              placeholder="votre@email.com"
            />
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
              Mot de passe
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              autocomplete="new-password"
              class="input"
              placeholder="••••••••"
            />
            <p class="mt-2 text-xs text-primary-500 dark:text-primary-400">Minimum 8 caractères</p>
          </div>

          <!-- Confirm Password -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
              Confirmer le mot de passe
            </label>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              required
              autocomplete="new-password"
              class="input"
              placeholder="••••••••"
            />
          </div>

          <!-- Error message -->
          <div v-if="error" class="p-4 rounded-2xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
            <p class="text-sm text-red-600">{{ error }}</p>
          </div>

          <!-- Submit button -->
          <button
            type="submit"
            :disabled="loading"
            class="btn-primary w-full text-lg py-4"
          >
            <span v-if="!loading">Créer mon compte</span>
            <span v-else>Création en cours...</span>
          </button>
        </form>

        <!-- Liens -->
        <div class="mt-8 pt-6 border-t border-sand-200 dark:border-primary-700 text-center">
          <p class="text-primary-600 dark:text-primary-400">
            Déjà un compte ?
            <NuxtLink to="/login" class="font-medium text-sand-600 dark:text-sand-400 hover:text-sand-800 dark:hover:text-sand-300 transition-colors">
              Se connecter
            </NuxtLink>
          </p>
        </div>
      </div>

      <!-- Retour à l'accueil -->
      <div class="text-center mt-8">
        <NuxtLink to="/" class="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100 transition-colors inline-flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          Retour à l'accueil
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: false
})

const authStore = useAuthStore()
const router = useRouter()

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref('')

const handleRegister = async () => {
  error.value = ''

  // Validation
  if (password.value.length < 8) {
    error.value = 'Le mot de passe doit contenir au moins 8 caractères'
    return
  }

  if (password.value !== confirmPassword.value) {
    error.value = 'Les mots de passe ne correspondent pas'
    return
  }

  loading.value = true

  try {
    const result = await authStore.register(
      email.value,
      password.value,
      firstName.value || undefined,
      lastName.value || undefined
    )

    if (result.success) {
      router.push('/dashboard')
    } else {
      error.value = result.error || 'Une erreur est survenue'
    }
  } catch (err) {
    error.value = 'Une erreur est survenue lors de l\'inscription'
  } finally {
    loading.value = false
  }
}

// Rediriger si déjà connecté
onMounted(() => {
  authStore.loadFromLocalStorage()
  if (authStore.isAuthenticated) {
    router.push('/dashboard')
  }
})
</script>
