<script setup lang="ts">
import { onMounted } from 'vue';
import getSupabase from '~/composables/useSupabase';
import { useAuthStore } from '~/stores/auth';

const supabase = getSupabase();
const authStore = useAuthStore();
const { t } = useLocale();

onMounted(async () => {
  // Handle magic link redirect: supabase client will parse URL and return session
  const { data, error } = await supabase.auth.getSessionFromUrl({ storeSession: true });
  if (error) {
    console.error('Supabase callback error', error);
    navigateTo('/login');
    return;
  }

  if (!data?.session) {
    navigateTo('/login');
    return;
  }

  // Exchange Supabase token for local session on backend
  try {
    const accessToken = data.session.access_token;
    const config = useRuntimeConfig();
    const resp = await $fetch(`${config.public.apiUrl}/auth/supabase-exchange`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Response should contain local user + token
    if ((resp as any).token && (resp as any).user) {
      authStore.setAuth({ user: (resp as any).user, token: (resp as any).token });
      navigateTo('/');
      return;
    }
  } catch (err) {
    console.error('Exchange failed', err);
  }

  // Fallback: redirect to login
  navigateTo('/login');
});
</script>

<template>
  <div class="p-4">{{ t('auth.callback.finalizing') }}</div>
</template>
