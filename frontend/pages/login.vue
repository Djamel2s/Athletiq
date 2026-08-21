<template>
  <div class="flex-1 flex items-center justify-center geometric-bg">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-10 fade-in">
        <NuxtLink :to="logoHome" class="inline-block">
          <img
            :src="logoSrc"
            :alt="logoAlt"
            class="h-12 md:h-16 w-auto mx-auto mb-4 hover:scale-105 transition-transform duration-300"
          />
        </NuxtLink>
        <h1
          class="text-2xl md:text-4xl font-bold text-primary-900 dark:text-primary-100 mb-2 text-display"
        >
          {{ t('auth.login.title') }}
        </h1>
        <p class="text-primary-600 dark:text-primary-400 text-body-relaxed">
          {{ t('auth.login.subtitle') }}
        </p>
      </div>

      <template v-if="!checking">
        <!-- Email verified banner -->
        <div
          v-if="emailVerified"
          class="mb-6 p-4 rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 fade-in"
        >
          <div class="flex items-center gap-3">
            <svg
              class="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0"
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
            <p class="text-sm text-green-700 dark:text-green-300">{{ t('auth.login.verified') }}</p>
          </div>
        </div>

        <!-- Formulaire -->
        <div class="card-glass slide-up">
          <form @submit.prevent="handleLogin" class="space-y-6">
            <!-- Email -->
            <div>
              <label
                for="email"
                class="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2"
              >
                {{ t('auth.login.email') }}
              </label>
              <input
                id="email"
                v-model="email"
                type="email"
                required
                autocomplete="email"
                class="input"
                :placeholder="t('auth.login.emailPlaceholder')"
              />
            </div>

            <!-- Password -->
            <div>
              <label
                for="password"
                class="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2"
              >
                {{ t('auth.login.password') }}
              </label>
              <input
                id="password"
                v-model="password"
                type="password"
                required
                autocomplete="current-password"
                class="input"
                :placeholder="t('auth.login.passwordPlaceholder')"
              />
              <div class="mt-2 text-right">
                <NuxtLink
                  to="/forgot-password"
                  class="text-sm text-sand-600 dark:text-sand-400 hover:text-sand-800 dark:hover:text-sand-300 transition-colors"
                >
                  {{ t('auth.login.forgot') }}
                </NuxtLink>
              </div>
            </div>

            <!-- Error message -->
            <div
              v-if="error"
              class="p-4 rounded-2xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800"
            >
              <p class="text-sm text-red-600">{{ error }}</p>
            </div>

            <!-- Submit button -->
            <button type="submit" :disabled="loading" class="btn-primary w-full text-lg py-4">
              <span v-if="!loading">{{ t('auth.login.submit') }}</span>
              <span v-else>{{ t('auth.login.loading') }}</span>
            </button>
          </form>

          <!-- Liens -->
          <div class="mt-8 pt-6 border-t border-sand-200 dark:border-primary-700 text-center">
            <p class="text-primary-600 dark:text-primary-400">
              {{ t('auth.login.noAccount') }}
              <NuxtLink
                to="/register"
                class="font-medium text-sand-600 dark:text-sand-400 hover:text-sand-800 dark:hover:text-sand-300 transition-colors"
              >
                {{ t('auth.login.signup') }}
              </NuxtLink>
            </p>
          </div>
        </div>

        <!-- Retour à l'accueil -->
        <div class="text-center mt-8">
          <NuxtLink
            :to="logoHome"
            class="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100 transition-colors inline-flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            {{ t('auth.login.backHome') }}
          </NuxtLink>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';

definePageMeta({
  layout: false,
});

const { t } = useLocale();

useSeoMeta({
  title: t('auth.login.seoTitle'),
  ogTitle: t('auth.login.seoTitle'),
  description: t('auth.login.seoDescription'),
  ogDescription: t('auth.login.seoDescription'),
});

const authStore = useAuthStore();
const route = useRoute();
const { setCoachMode, isCoachMode } = useAppMode();
const { isRose } = useTheme();

const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');
const checking = ref(true);
const emailVerified = computed(() => route.query.verified === 'true');

if (route.query.mode === 'coach') {
  setCoachMode();
}

const logoSrc = computed(() =>
  isCoachMode.value
    ? '/coach-athletiq-icon.svg'
    : isRose.value
      ? '/athletiq-icon-rose.svg'
      : '/athletiq-icon.svg'
);
const logoAlt = computed(() => (isCoachMode.value ? 'Coach Athletiq' : 'Athletiq'));
const logoHome = computed(() => (isCoachMode.value ? '/coach-landing' : '/'));

const handleLogin = async () => {
  error.value = '';
  loading.value = true;

  try {
    const result = await authStore.login(email.value, password.value);

    if (result.success) {
      navigateTo(isCoachMode.value ? '/coaching' : '/dashboard');
    } else {
      error.value = result.error || t('auth.login.errorGeneric');
    }
  } catch (err) {
    error.value = t('auth.login.errorConnection');
  } finally {
    loading.value = false;
  }
};

// Rediriger si déjà connecté
onMounted(async () => {
  await authStore.initAuth();
  if (authStore.isAuthenticated) {
    navigateTo(isCoachMode.value ? '/coaching' : '/dashboard');
  }
  checking.value = false;
});
</script>
