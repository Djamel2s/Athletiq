<template>
  <div class="min-h-screen flex items-center justify-center px-6 py-12 geometric-bg">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-10 fade-in">
        <NuxtLink to="/" class="inline-block">
          <AppLogo class="h-16 w-auto mx-auto mb-4 hover:scale-105 transition-transform duration-300" />
        </NuxtLink>
        <h1 class="text-3xl font-bold text-primary-900 dark:text-primary-100 mb-2 text-display">Mot de passe oublié</h1>
        <p class="text-primary-600 dark:text-primary-400 text-body-relaxed">Entrez votre email pour recevoir un lien de réinitialisation</p>
      </div>

      <div class="card-glass slide-up">
        <!-- Success message -->
        <div v-if="sent" class="text-center py-4">
          <div class="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <h2 class="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-2">Email envoyé !</h2>
          <p class="text-primary-600 dark:text-primary-400 mb-6">Si un compte existe avec cet email, vous recevrez un lien de réinitialisation.</p>
          <NuxtLink to="/login" class="btn-primary inline-block px-8">Retour à la connexion</NuxtLink>
        </div>

        <!-- Form -->
        <form v-else @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">Email</label>
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

          <div v-if="error" class="p-4 rounded-2xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
            <p class="text-sm text-red-600">{{ error }}</p>
          </div>

          <button type="submit" :disabled="loading" class="btn-primary w-full text-lg py-4">
            <span v-if="!loading">Envoyer le lien</span>
            <span v-else>Envoi en cours...</span>
          </button>
        </form>
      </div>

      <div class="text-center mt-8">
        <NuxtLink to="/login" class="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100 transition-colors inline-flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          Retour à la connexion
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

useSeoMeta({
  title: 'Mot de passe oublié · Athletiq',
  ogTitle: 'Mot de passe oublié · Athletiq',
  description: 'Réinitialisez votre mot de passe Athletiq.',
  ogDescription: 'Réinitialisez votre mot de passe Athletiq.',
})

const email = ref('')
const loading = ref(false)
const error = ref('')
const sent = ref(false)

const handleSubmit = async () => {
  error.value = ''

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    error.value = 'Veuillez entrer une adresse email valide'
    return
  }

  loading.value = true

  try {
    const config = useRuntimeConfig()
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000)
    const response = await fetch(`${config.public.apiUrl}/email/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value }),
      signal: controller.signal
    })
    clearTimeout(timeoutId)

    if (response.ok) {
      sent.value = true
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
