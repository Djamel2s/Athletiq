<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '~/stores/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const { t } = useLocale();

const token = ref((route.query.token as string) || '');
const password = ref('');
const confirm = ref('');
const error = ref('');
const loading = ref(false);

const submit = async () => {
  error.value = '';
  if (!token.value) return (error.value = t('auth.migrate.errorMissingToken'));
  if (password.value.length < 8) return (error.value = t('auth.migrate.errorTooShort'));
  if (password.value !== confirm.value) return (error.value = t('auth.reset.errorMismatch'));

  loading.value = true;
  try {
    const config = useRuntimeConfig();
    const resp = await $fetch(`${config.public.apiUrl}/auth/migrate-complete`, {
      method: 'POST',
      credentials: 'include',
      body: { token: token.value, password: password.value },
    });

    if ((resp as any).token && (resp as any).user) {
      authStore.setAuth({ user: (resp as any).user, token: (resp as any).token });
      router.push('/');
      return;
    }
    error.value = t('auth.migrate.errorFailed');
  } catch (e: any) {
    error.value = e?.data?.error || e?.message || t('common.error');
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="max-w-md mx-auto p-4">
    <h1 class="text-xl font-bold">{{ t('auth.migrate.title') }}</h1>
    <p class="text-sm text-gray-600">{{ t('auth.migrate.subtitle') }}</p>

    <div class="mt-4">
      <label class="block">{{ t('auth.reset.newPassword') }}</label>
      <input v-model="password" type="password" class="w-full border p-2" />
    </div>
    <div class="mt-2">
      <label class="block">{{ t('auth.reset.confirmLabel') }}</label>
      <input v-model="confirm" type="password" class="w-full border p-2" />
    </div>

    <div class="mt-4">
      <button @click.prevent="submit" :disabled="loading" class="px-4 py-2 bg-blue-600 text-white">
        {{ t('common.confirm') }}
      </button>
    </div>
    <div v-if="error" class="mt-2 text-red-600">{{ error }}</div>
  </div>
</template>
