<template>
  <div class="min-h-screen flex items-center justify-center px-6 py-12 geometric-bg">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-10 fade-in">
        <NuxtLink to="/" class="inline-block">
          <AppLogo class="h-16 w-auto mx-auto mb-4 hover:scale-105 transition-transform duration-300" />
        </NuxtLink>
        <h1 class="text-4xl font-bold text-primary-900 dark:text-primary-100 mb-2 text-display">Inscription</h1>
        <p class="text-primary-600 dark:text-primary-400 text-body-relaxed">Créez votre compte gratuitement</p>
      </div>

      <!-- Formulaire -->
      <div class="card-glass slide-up">
        <form @submit.prevent="handleRegister" class="space-y-6">
          <!-- Photo de profil -->
          <div class="flex flex-col items-center gap-2">
            <label class="block text-sm font-medium text-primary-700 dark:text-primary-300">
              Photo de profil <span class="text-primary-400 dark:text-primary-500 font-normal">(optionnel)</span>
            </label>
            <div class="relative group cursor-pointer">
              <div class="w-20 h-20 rounded-2xl overflow-hidden bg-primary-100 dark:bg-primary-800 flex items-center justify-center border-2 border-dashed border-primary-300 dark:border-primary-600 group-hover:border-sand-500 transition-colors">
                <img v-if="avatarPreview" :src="avatarPreview" alt="Avatar" class="w-full h-full object-cover" />
                <svg v-else class="w-8 h-8 text-primary-400 dark:text-primary-500 group-hover:text-sand-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
              <input type="file" accept="image/*" class="absolute inset-0 opacity-0 cursor-pointer" @change="handleAvatarSelect" />
              <button
                v-if="avatarPreview"
                type="button"
                @click.stop="removeAvatar"
                class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

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

          <!-- Genre -->
          <div>
            <label class="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
              Je suis
            </label>
            <div class="grid grid-cols-2 gap-3">
              <button
                type="button"
                @click="gender = 'male'"
                :class="[
                  'flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all font-medium text-sm',
                  gender === 'male'
                    ? 'border-sand-500 bg-sand-500/10 text-sand-700 dark:text-sand-400'
                    : 'border-primary-200 dark:border-primary-700 text-primary-500 dark:text-primary-400 hover:border-primary-300 dark:hover:border-primary-600'
                ]"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="7" r="4" stroke-width="2"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.5 21v-2a6.5 6.5 0 0113 0v2"/>
                </svg>
                Homme
              </button>
              <button
                type="button"
                @click="gender = 'female'"
                :class="[
                  'flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all font-medium text-sm',
                  gender === 'female'
                    ? 'border-sand-500 bg-sand-500/10 text-sand-700 dark:text-sand-400'
                    : 'border-primary-200 dark:border-primary-700 text-primary-500 dark:text-primary-400 hover:border-primary-300 dark:hover:border-primary-600'
                ]"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="7" r="4" stroke-width="2"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.5 21v-2a6.5 6.5 0 0113 0v2"/>
                </svg>
                Femme
              </button>
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

useSeoMeta({
  title: 'Créer un compte · Athletiq',
  ogTitle: 'Créer un compte · Athletiq',
  description: 'Créez votre compte Athletiq gratuitement et commencez à suivre vos entraînements.',
  ogDescription: 'Créez votre compte Athletiq gratuitement et commencez à suivre vos entraînements.',
})

const authStore = useAuthStore()

const firstName = ref('')
const lastName = ref('')
const gender = ref<'male' | 'female' | ''>('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref('')
const avatarFile = ref<File | null>(null)
const avatarPreview = ref('')

const validateImageMagicBytes = async (file: File): Promise<boolean> => {
  const buffer = await file.slice(0, 4).arrayBuffer()
  const bytes = new Uint8Array(buffer)
  // JPEG: FF D8 FF
  if (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) return true
  // PNG: 89 50 4E 47
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) return true
  // GIF: 47 49 46 38
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) return true
  // WebP: 52 49 46 46 (RIFF header)
  if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46) return true
  return false
}

const handleAvatarSelect = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    error.value = 'Le fichier doit être une image'
    input.value = ''
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    error.value = 'La photo ne doit pas dépasser 5 Mo'
    input.value = ''
    return
  }

  const validBytes = await validateImageMagicBytes(file)
  if (!validBytes) {
    error.value = 'Le fichier ne semble pas être une image valide'
    input.value = ''
    return
  }

  avatarFile.value = file
  // Revoke previous object URL if any
  if (avatarPreview.value) URL.revokeObjectURL(avatarPreview.value)
  avatarPreview.value = URL.createObjectURL(file)
}

const removeAvatar = () => {
  if (avatarPreview.value) URL.revokeObjectURL(avatarPreview.value)
  avatarFile.value = null
  avatarPreview.value = ''
}

const handleRegister = async () => {
  if (loading.value) return
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
      lastName.value || undefined,
      gender.value || undefined
    )

    if (result.success) {
      if (avatarFile.value) {
        await authStore.uploadAvatar(avatarFile.value)
      }
      navigateTo('/dashboard')
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
onMounted(async () => {
  await authStore.initAuth()
  if (authStore.isAuthenticated) {
    navigateTo('/dashboard')
  }
})

// Clean up object URLs on unmount
onBeforeUnmount(() => {
  if (avatarPreview.value) URL.revokeObjectURL(avatarPreview.value)
})
</script>
