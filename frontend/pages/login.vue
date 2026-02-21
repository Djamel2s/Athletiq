<template>
  <div class="min-h-screen flex items-center justify-center px-6 py-12 geometric-bg">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-10 fade-in">
        <NuxtLink to="/" class="inline-block">
          <img src="/athletiq-icon.svg" alt="Athletiq" class="h-16 w-auto mx-auto mb-4 hover:scale-105 transition-transform duration-300" />
        </NuxtLink>
        <h1 class="text-4xl font-bold text-primary-900 dark:text-primary-100 mb-2 text-display">Connexion</h1>
        <p class="text-primary-600 dark:text-primary-400 text-body-relaxed">Connectez-vous à votre compte</p>
      </div>

      <!-- Formulaire -->
      <div class="card-glass slide-up">
        <form @submit.prevent="handleLogin" class="space-y-6">
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
              autocomplete="current-password"
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
            <span v-if="!loading">Se connecter</span>
            <span v-else>Connexion en cours...</span>
          </button>
        </form>

        <!-- Liens -->
        <div class="mt-8 pt-6 border-t border-sand-200 dark:border-primary-700 text-center">
          <p class="text-primary-600 dark:text-primary-400">
            Pas encore de compte ?
            <NuxtLink to="/register" class="font-medium text-sand-600 dark:text-sand-400 hover:text-sand-800 dark:hover:text-sand-300 transition-colors">
              S'inscrire
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

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  error.value = ''
  loading.value = true

  try {
    const result = await authStore.login(email.value, password.value)

    if (result.success) {
      router.push('/dashboard')
    } else {
      error.value = result.error || 'Une erreur est survenue'
    }
  } catch (err) {
    error.value = 'Une erreur est survenue lors de la connexion'
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
