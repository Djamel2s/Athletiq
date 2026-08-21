<template>
  <nav class="fixed top-0 left-0 right-0 z-50 nav-blur">
    <div class="max-w-7xl mx-auto px-6 py-3">
      <!-- Landing page: nav marketing, liens centrés, pas de recherche -->
      <div v-if="isLanding || isLogin || isRegister" class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <FlipLogo />
        </div>

        <div class="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          <a
            v-for="link in marketingLinks"
            :key="link.href"
            :href="link.href"
            class="text-sm font-semibold text-primary-700 dark:text-primary-300 hover:text-sand-600 dark:hover:text-sand-400 transition-colors"
          >
            {{ link.label }}
          </a>
        </div>

        <div class="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <template v-if="authStore.isAuthenticated">
            <NuxtLink
              :to="isCoachSpace ? '/coaching' : '/dashboard'"
              class="!py-2 !px-5 text-sm"
              :class="isCoachSpace ? 'btn-metallic' : 'btn-primary'"
            >
              {{ isCoachSpace ? t('coachLanding.hero.ctaAccess') : t('nav.dashboard') }}
            </NuxtLink>
          </template>
          <template v-else>
            <NuxtLink
              :to="isCoachSpace ? '/login?mode=coach' : '/login'"
              class="hidden sm:block text-sm font-semibold text-primary-700 dark:text-primary-300 hover:text-primary-900 dark:hover:text-primary-100 transition-colors"
            >
              {{ isCoachSpace ? t('coachLanding.nav.login') : t('nav.login') }}
            </NuxtLink>
            <NuxtLink
              :to="isCoachSpace ? '/register?mode=coach' : '/register'"
              class="!py-2 !px-5 text-sm"
              :class="isCoachSpace ? 'btn-metallic' : 'btn-primary'"
            >
              {{ isCoachSpace ? t('coachLanding.nav.register') : t('nav.register') }}
            </NuxtLink>
          </template>

          <div class="relative">
            <button
              type="button"
              class="flex h-10 w-10 items-center justify-center rounded-full border border-primary-200/70 bg-white/80 shadow-sm transition-all hover:scale-105 dark:border-primary-700 dark:bg-primary-900/70 overflow-hidden"
              @click="isLocaleMenuOpen = !isLocaleMenuOpen"
              :aria-label="t('nav.language')"
            >
              <Icon :name="currentLocale?.flag" class="w-6 h-6" />
            </button>

            <div
              v-if="isLocaleMenuOpen"
              class="absolute rounded-2xl border border-primary-200/70 bg-white/95 shadow-xl backdrop-blur dark:border-primary-700 dark:bg-primary-900/95"
            >
              <button
                v-for="option in availableLocales"
                :key="option.code"
                type="button"
                class="flex items-center justify-center rounded-xl w-10 h-10 p-0 text-sm font-medium transition-colors overflow-hidden"
                :title="option.label"
                :aria-label="option.label"
                :class="
                  locale === option.code
                    ? 'bg-sand-500 text-white'
                    : 'text-primary-700 hover:bg-primary-50 dark:text-primary-200 dark:hover:bg-primary-800'
                "
                @click="selectLocale(option.code)"
              >
                <Icon :name="option.flag" class="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Reste de l'app : nav inchangée -->
      <div v-else class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <FlipLogo />
        </div>

        <div class="flex items-center flex-1 px-4">
          <ClientOnly>
            <HeaderSearch />
          </ClientOnly>
        </div>

        <div class="flex items-center gap-2">
          <NavActions />
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import AppLogo from '~/components/AppLogo.vue';
import FlipLogo from '~/components/FlipLogo.vue';
import NavActions from '~/components/NavActions.vue';
import HeaderSearch from '~/components/HeaderSearch.vue';
import { useAuthStore } from '~/stores/auth';

const route = useRoute();
const authStore = useAuthStore();
const { locale, availableLocales, setLocale, t } = useLocale();
const { isCoachMode } = useAppMode();
const isLocaleMenuOpen = ref(false);

const currentLocale = computed(() =>
  availableLocales.find((option) => option.code === locale.value)
);
const isLanding = computed(() => route.path === '/' || route.path === '/coach-landing');
const isLogin = computed(() => route.path === '/login');
const isRegister = computed(() => route.path === '/register');
const isCoachLanding = computed(() => route.path === '/coach-landing');
const isCoachSpace = computed(() => {
  if (isCoachLanding.value) return true;
  if (isLogin.value || isRegister.value) return isCoachMode.value;
  return false;
});

const marketingLinks = computed(() =>
  isCoachLanding.value
    ? [
        { href: '#features', label: t('coachLanding.nav.features') },
        { href: '#how-it-works', label: t('coachLanding.nav.howItWorks') },
        { href: '#pricing', label: t('coachLanding.nav.pricing') },
      ]
    : [
        { href: '#features', label: t('nav.marketing.features') },
        { href: '#coach', label: t('nav.marketing.coach') },
        { href: '#pricing', label: t('nav.marketing.pricing') },
      ]
);

const selectLocale = (value: 'en' | 'fr') => {
  setLocale(value);
  isLocaleMenuOpen.value = false;
};
</script>
