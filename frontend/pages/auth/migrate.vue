<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const token = ref((route.query.token as string) || '')
const password = ref('')
const confirm = ref('')
const error = ref('')
const loading = ref(false)

const submit = async () => {
  error.value = ''
  if (!token.value) return (error.value = 'Token manquant')
  if (password.value.length < 8) return (error.value = 'Mot de passe trop court')
  if (password.value !== confirm.value) return (error.value = "Les mots de passe ne correspondent pas")

  loading.value = true
  try {
    const config = useRuntimeConfig()
    const resp = await $fetch(`${config.public.apiUrl}/auth/migrate-complete`, {
      method: 'POST',
      credentials: 'include',
      body: { token: token.value, password: password.value },
    })

    if ((resp as any).token && (resp as any).user) {
      authStore.setAuth({ user: (resp as any).user, token: (resp as any).token })
      router.push('/')
      return
    }
    error.value = 'Échec de la migration'
  } catch (e: any) {
    error.value = e?.data?.error || e?.message || 'Erreur'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-md mx-auto p-4">
    <h1 class="text-xl font-bold">Mise à jour du mot de passe</h1>
    <p class="text-sm text-gray-600">Pour migrer ton compte vers Supabase, choisis un nouveau mot de passe.</p>

    <div class="mt-4">
      <label class="block">Nouveau mot de passe</label>
      <input v-model="password" type="password" class="w-full border p-2" />
    </div>
    <div class="mt-2">
      <label class="block">Confirmer</label>
      <input v-model="confirm" type="password" class="w-full border p-2" />
    </div>

    <div class="mt-4">
      <button @click.prevent="submit" :disabled="loading" class="px-4 py-2 bg-blue-600 text-white">Valider</button>
    </div>
    <div v-if="error" class="mt-2 text-red-600">{{ error }}</div>
  </div>
</template>
