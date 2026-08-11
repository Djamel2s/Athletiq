<template>
  <div class="min-h-screen flex items-center justify-center px-6 py-12 geometric-bg">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-10 fade-in">
        <NuxtLink to="/" class="inline-block">
          <AppLogo
            class="h-16 w-auto mx-auto mb-4 hover:scale-105 transition-transform duration-300"
          />
        </NuxtLink>
        <h1 class="text-3xl font-bold text-primary-900 dark:text-primary-100 mb-2 text-display">
          {{ t('auth.reset.title') }}
        </h1>
        <p class="text-primary-600 dark:text-primary-400 text-body-relaxed">
          {{ t('auth.reset.subtitle') }}
        </p>
      </div>

      <div class="card-glass slide-up">
        <!-- No token error -->
        <div v-if="!token" class="text-center py-4">
          <div
            class="p-4 rounded-2xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800"
          >
            <p class="text-sm text-red-600">{{ error }}</p>
          </div>
          <NuxtLink to="/forgot-password" class="btn-primary inline-block px-8 mt-6">{{
            t('auth.reset.requestNewLink')
          }}</NuxtLink>
        </div>

        <!-- Success -->
        <div v-else-if="success" class="text-center py-4">
          <div
            class="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <svg
              class="w-8 h-8 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 class="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-2">
            {{ t('auth.reset.successTitle') }}
          </h2>
          <p class="text-primary-600 dark:text-primary-400 mb-6">
            {{ t('auth.reset.successBody') }}
          </p>
          <NuxtLink to="/login" class="btn-primary inline-block px-8">{{
            t('auth.login.submit')
          }}</NuxtLink>
        </div>

        <!-- Form -->
        <form v-else @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label
              for="password"
              class="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2"
              >{{ t('auth.reset.newPassword') }}</label
            >
            <input
              id="password"
              v-model="password"
              type="password"
              required
              autocomplete="new-password"
              class="input"
              placeholder="••••••••"
            />
            <p class="mt-2 text-xs text-primary-500 dark:text-primary-400">
              {{ t('auth.register.passwordHint') }}
            </p>
          </div>

          <div>
            <label
              for="confirmPassword"
              class="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2"
              >{{ t('auth.reset.confirmLabel') }}</label
            >
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

          <div
            v-if="error"
            class="p-4 rounded-2xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800"
          >
            <p class="text-sm text-red-600">{{ error }}</p>
          </div>

          <button type="submit" :disabled="loading" class="btn-primary w-full text-lg py-4">
            <span v-if="!loading">{{ t('auth.reset.submit') }}</span>
            <span v-else>{{ t('auth.reset.submitting') }}</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false });

const { t } = useLocale();

useSeoMeta({
  title: 'Nouveau mot de passe · Athletiq',
  ogTitle: 'Nouveau mot de passe · Athletiq',
  description: 'Choisissez un nouveau mot de passe pour votre compte Athletiq.',
  ogDescription: 'Choisissez un nouveau mot de passe pour votre compte Athletiq.',
});

const route = useRoute();
const password = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const error = ref('');
const success = ref(false);

const token = computed(() => route.query.token as string);

onMounted(() => {
  if (!token.value) {
    error.value = t('auth.reset.errorInvalidToken');
  }
});

const handleSubmit = async () => {
  error.value = '';

  if (password.value.length < 8) {
    error.value = t('auth.reset.errorMinLength');
    return;
  }

  if (password.value !== confirmPassword.value) {
    error.value = t('auth.reset.errorMismatch');
    return;
  }

  loading.value = true;

  try {
    const config = useRuntimeConfig();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    const response = await fetch(`${config.public.apiUrl}/email/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: token.value, password: password.value }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      success.value = true;
    } else {
      const data = await response.json();
      error.value = data.error || t('common.errorGeneric');
    }
  } catch {
    error.value = t('auth.reset.errorConnection');
  } finally {
    loading.value = false;
  }
};
</script>
