<template>
  <div class="min-h-screen flex items-center justify-center px-6 py-12 geometric-bg">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-10 fade-in">
        <NuxtLink to="/" class="inline-block">
          <AppLogo class="h-16 w-auto mx-auto mb-4 hover:scale-105 transition-transform duration-300" />
        </NuxtLink>
        <h1 class="text-3xl font-bold text-primary-900 dark:text-primary-100 mb-2 text-display">Nouveau mot de passe</h1>
        <p class="text-primary-600 dark:text-primary-400 text-body-relaxed">Choisissez votre nouveau mot de passe</p>
      </div>

      <div class="card-glass slide-up">
        <!-- No token error -->
        <div v-if="!token" class="text-center py-4">
          <div class="p-4 rounded-2xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
            <p class="text-sm text-red-600">{{ error }}</p>
          </div>
          <NuxtLink to="/forgot-password" class="btn-primary inline-block px-8 mt-6">Demander un nouveau lien</NuxtLink>
        </div>

        <!-- Success -->
        <div v-else-if="success" class="text-center py-4">
          <div class="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <h2 class="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-2">Mot de passe modifié !</h2>
          <p class="text-primary-600 dark:text-primary-400 mb-6">Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.</p>
          <NuxtLink to="/login" class="btn-primary inline-block px-8">Se connecter</NuxtLink>
        </div>

        <!-- Form -->
        <form v-else @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label for="password" class="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">Nouveau mot de passe</label>
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

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">Confirmer</label>
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

          <div v-if="error" class="p-4 rounded-2xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
            <p class="text-sm text-red-600">{{ error }}</p>
          </div>

          <button type="submit" :disabled="loading" class="btn-primary w-full text-lg py-4">
            <span v-if="!loading">Changer mon mot de passe</span>
            <span v-else>Modification en cours...</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

useSeoMeta({
  title: 'Nouveau mot de passe · Athletiq',
  ogTitle: 'Nouveau mot de passe · Athletiq',
  description: 'Choisissez un nouveau mot de passe pour votre compte Athletiq.',
  ogDescription: 'Choisissez un nouveau mot de passe pour votre compte Athletiq.',
})

const route = useRoute()
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref('')
const success = ref(false)

const token = computed(() => route.query.token as string)

onMounted(() => {
  if (!token.value) {
    error.value = 'Lien invalide. Demandez un nouveau lien de réinitialisation.'
  }
})

const handleSubmit = async () => {
  error.value = ''

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
    const config = useRuntimeConfig()
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000)
    const response = await fetch(`${config.public.apiUrl}/email/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: token.value, password: password.value }),
      signal: controller.signal
    })
    clearTimeout(timeoutId)

    if (response.ok) {
      success.value = true
    } else {
      const data = await response.json()
      error.value = data.error || 'Une erreur est survenue'
    }
  } catch {
    error.value = 'Erreur de connexion au serveur'
  } finally {
    loading.value = false
  }
}
</script>
