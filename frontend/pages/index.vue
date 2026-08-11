<template>
  <div class="min-h-screen bg-cream-50 dark:bg-primary-900">
    <!-- ============ HERO ============ -->
    <section class="relative overflow-hidden pt-16 md:pt-20 pb-24 md:pb-32 px-6">
      <div
        class="absolute inset-0 pointer-events-none"
        style="
          background: radial-gradient(
            ellipse 80% 50% at 50% 80%,
            rgba(212, 196, 176, 0.35),
            transparent
          );
        "
        aria-hidden="true"
      />

      <div class="relative max-w-6xl mx-auto">
        <!-- Mockup gauche : en fond, derriere le texte -->
        <div
          class="hidden lg:block absolute left-[-30px] xl:left-[10px] top-[2%] -rotate-[11deg] z-0 opacity-90 pointer-events-none select-none"
          aria-hidden="true"
        >
          <PhoneMockup :width="250">
            <img src="/screenshots/hero-home.png" alt="" class="w-full h-full object-cover" />
          </PhoneMockup>
        </div>

        <!-- Texte -->
        <div class="relative z-10 max-w-2xl mx-auto text-center fade-in">
          <h1
            class="font-display font-semibold text-primary-900 dark:text-primary-50 text-4xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight mb-6"
          >
            {{ t('landing.hero.title') }}<br />
            <span class="text-sand-600 dark:text-sand-400">{{ t('landing.hero.accent') }}</span>
          </h1>
          <p
            class="text-primary-600 dark:text-primary-300 text-base md:text-xl max-w-xl mx-auto mb-9 leading-relaxed"
          >
            {{ t('landing.hero.subtitle') }}
          </p>
          <NuxtLink
            :to="authStore.isAuthenticated ? '/dashboard' : '/register'"
            class="btn-primary text-base px-8 py-3.5 inline-block"
          >
            {{ authStore.isAuthenticated ? t('landing.hero.dashboard') : t('landing.hero.cta') }}
          </NuxtLink>
          <div class="flex justify-center gap-4">
            <NuxtLink
              :to="authStore.isAuthenticated ? '/dashboard' : '/register'"
              class="inline-block mt-6"
            >
              <img
                src="/publish/apple-white.png"
                :alt="t('landing.hero.appStoreAlt')"
                class="h-12 w-auto"
              />
            </NuxtLink>
            <NuxtLink
              :to="authStore.isAuthenticated ? '/dashboard' : '/register'"
              class="inline-block mt-6"
            >
              <img
                src="/publish/google-white.png"
                :alt="t('landing.hero.playStoreAlt')"
                class="h-12 w-auto"
              />
            </NuxtLink>
          </div>
        </div>

        <!-- Mockup droite : en avant, demarre au milieu du texte -->
        <div
          class="hidden lg:block absolute right-[-30px] xl:right-[10px] top-[38%] rotate-[9deg] z-20 pointer-events-none select-none"
          aria-hidden="true"
        >
          <PhoneMockup :width="260">
            <img src="/screenshots/hero-social.png" alt="" class="w-full h-full object-cover" />
          </PhoneMockup>
        </div>
      </div>
    </section>

    <!-- ============ TRUST STRIP ============ -->
    <section class="py-6 px-6 border-y border-sand-200/60 dark:border-primary-800">
      <div
        class="max-w-4xl mx-auto flex flex-wrap justify-center gap-x-10 gap-y-3 text-sm text-primary-500 dark:text-primary-400"
      >
        <span class="flex items-center gap-2">
          <Icon name="lucide:smartphone" class="w-4 h-4 text-sand-600" />
          {{ t('landing.trust.web') }}
        </span>
        <span class="flex items-center gap-2">
          <Icon name="lucide:wifi-off" class="w-4 h-4 text-sand-600" />
          {{ t('landing.trust.offline') }}
        </span>
        <span class="flex items-center gap-2">
          <Icon name="lucide:shield-check" class="w-4 h-4 text-sand-600" />
          {{ t('landing.trust.stripe') }}
        </span>
        <span class="flex items-center gap-2">
          <Icon name="lucide:clock" class="w-4 h-4 text-sand-600" /> {{ t('landing.trust.trial') }}
        </span>
      </div>
    </section>

    <!-- ============ LOG WORKOUTS ============ -->
    <section id="features" class="py-10 md:py-18 px-6">
      <div class="max-w-2xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div class="text-center lg:text-left order-2 lg:order-1">
          <p
            class="font-display text-sand-600 dark:text-sand-400 text-sm tracking-[0.2em] uppercase mb-3"
          >
            {{ t('landing.features.label') }}
          </p>
          <h2
            class="font-display font-semibold text-3xl md:text-5xl text-primary-900 dark:text-primary-50 mb-5 tracking-tight leading-tight"
          >
            {{ t('landing.log.title') }}
          </h2>
          <p
            class="text-primary-600 dark:text-primary-300 text-lg leading-relaxed mb-8 max-w-md mx-auto lg:mx-0"
          >
            {{ t('landing.log.subtitle') }}
          </p>
          <ul class="space-y-3 max-w-sm mx-auto lg:mx-0">
            <li
              v-for="item in loggingPoints"
              :key="item"
              class="flex items-center gap-3 justify-center lg:justify-start"
            >
              <span
                class="w-5 h-5 rounded-full bg-sand-100 dark:bg-sand-900/40 flex items-center justify-center flex-shrink-0"
              >
                <Icon name="lucide:check" class="w-3 h-3 text-sand-700 dark:text-sand-400" />
              </span>
              <span class="text-primary-700 dark:text-primary-300 text-sm font-medium">{{
                item
              }}</span>
            </li>
          </ul>
        </div>
        <div class="order-1 lg:order-2 flex justify-center">
          <PhoneMockup :width="260"> </PhoneMockup>
        </div>
      </div>
    </section>

    <!-- ============ MEASURE PROGRESS (barbell interactif) ============ -->
    <section class="py-20 md:py-28 px-6 bg-white dark:bg-primary-950/40">
      <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div class="flex justify-center order-1">
          <div class="w-full max-w-md rounded-3xl bg-primary-900 p-6 md:p-8">
            <BarbellLoader />
          </div>
        </div>
        <div class="text-center lg:text-left order-2">
          <p
            class="font-display text-sand-600 dark:text-sand-400 text-sm tracking-[0.2em] uppercase mb-3"
          >
            {{ t('landing.progress.label') }}
          </p>
          <h2
            class="font-display font-semibold text-3xl md:text-5xl text-primary-900 dark:text-primary-50 mb-5 tracking-tight leading-tight"
          >
            {{ t('landing.progress.title') }}
          </h2>
          <p
            class="text-primary-600 dark:text-primary-300 text-lg leading-relaxed mb-8 max-w-md mx-auto lg:mx-0"
          >
            {{ t('landing.progress.subtitle') }}
          </p>
          <ul class="space-y-3 max-w-sm mx-auto lg:mx-0">
            <li
              v-for="item in progressPoints"
              :key="item"
              class="flex items-center gap-3 justify-center lg:justify-start"
            >
              <span
                class="w-5 h-5 rounded-full bg-sand-100 dark:bg-sand-900/40 flex items-center justify-center flex-shrink-0"
              >
                <Icon name="lucide:check" class="w-3 h-3 text-sand-700 dark:text-sand-400" />
              </span>
              <span class="text-primary-700 dark:text-primary-300 text-sm font-medium">{{
                item
              }}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- ============ COACH ============ -->
    <section id="coach" class="py-20 md:py-28 px-6">
      <div class="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div class="text-center lg:text-left order-2 lg:order-2">
          <p
            class="font-display text-sand-600 dark:text-sand-400 text-sm tracking-[0.2em] uppercase mb-3"
          >
            {{ t('landing.coach.label') }}
          </p>
          <h2
            class="font-display font-semibold text-3xl md:text-5xl text-primary-900 dark:text-primary-50 mb-5 tracking-tight leading-tight"
          >
            {{ t('landing.coach.title') }}
          </h2>
          <p
            class="text-primary-600 dark:text-primary-300 text-lg leading-relaxed mb-8 max-w-md mx-auto lg:mx-0"
          >
            {{ t('landing.coach.subtitle') }}
          </p>
          <NuxtLink
            :to="authStore.isAuthenticated ? '/coaching' : '/register'"
            class="btn-primary px-8 py-3.5 inline-block"
          >
            {{ t('landing.coach.cta') }}
          </NuxtLink>
        </div>
        <div
          class="order-1 lg:order-1 gap-6 flex justify-center -rotate-[11deg] z-0 opacity-90 pointer-events-none select-none"
        >
          <PhoneMockup :width="260"> </PhoneMockup>
          <PhoneMockup :width="260"> </PhoneMockup>
        </div>
      </div>
    </section>

    <!-- ============ PRICING ============ -->
    <section id="pricing" class="py-20 md:py-28 px-6 bg-white dark:bg-primary-950/40">
      <div class="max-w-5xl mx-auto">
        <div class="text-center mb-14">
          <p
            class="font-display text-sand-600 dark:text-sand-400 text-sm tracking-[0.2em] uppercase mb-3"
          >
            {{ t('landing.pricing.label') }}
          </p>
          <h2
            class="font-display font-semibold text-3xl md:text-5xl text-primary-900 dark:text-primary-50 mb-4 tracking-tight"
          >
            {{ t('landing.pricing.title') }}
          </h2>
          <p class="text-lg text-primary-600 dark:text-primary-400">
            {{ t('landing.pricing.subtitle') }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          <div
            v-for="plan in plans"
            :key="plan.name"
            class="card-glass text-center relative"
            :class="plan.highlight ? '!border-2 !border-sand-500/50' : ''"
          >
            <div
              v-if="plan.badge"
              class="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-primary text-white text-xs font-bold rounded-full whitespace-nowrap"
            >
              {{ plan.badge }}
            </div>
            <h3 class="text-xl font-bold text-primary-900 dark:text-primary-100 mb-2">
              {{ plan.name }}
            </h3>
            <div class="flex items-baseline justify-center gap-1 mb-1">
              <span
                class="font-plate text-4xl md:text-5xl font-bold text-primary-900 dark:text-primary-100"
              >
                {{ plan.price }}
              </span>
              <span v-if="plan.period" class="text-primary-500 dark:text-primary-400">{{
                plan.period
              }}</span>
            </div>
            <p class="text-sm text-primary-500 dark:text-primary-400 mb-6">{{ plan.tagline }}</p>
            <ul class="space-y-3 mb-8 text-left text-sm">
              <li
                v-for="item in plan.features"
                :key="item"
                class="flex items-center gap-3 text-primary-700 dark:text-primary-300"
              >
                <Icon name="lucide:check" class="w-4 h-4 text-green-500 flex-shrink-0" />
                {{ item }}
              </li>
            </ul>
            <NuxtLink :to="plan.cta.to" :class="plan.cta.class" class="w-full text-base py-4 block">
              {{ plan.cta.label }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ CTA FINAL ============ -->
    <section class="py-20 md:py-28 px-6">
      <div class="max-w-2xl mx-auto text-center">
        <h2
          class="font-display font-semibold text-3xl md:text-5xl text-primary-900 dark:text-primary-50 mb-5 tracking-tight"
        >
          {{ authStore.isAuthenticated ? t('landing.cta.title') : t('landing.cta.title') }}
        </h2>
        <p
          v-if="!authStore.isAuthenticated"
          class="text-primary-600 dark:text-primary-400 text-lg mb-8"
        >
          {{ t('landing.cta.subtitle') }}
        </p>
        <NuxtLink
          :to="authStore.isAuthenticated ? '/dashboard' : '/register'"
          class="btn-primary text-base md:text-lg px-10 md:px-12 py-4"
        >
          {{ authStore.isAuthenticated ? t('nav.dashboard') : t('landing.cta.primary') }}
        </NuxtLink>
      </div>
    </section>

    <!-- ============ FOOTER ============ -->
    <footer class="border-t border-sand-200 dark:border-primary-800 py-14 px-6">
      <div class="max-w-6xl mx-auto">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div class="col-span-2">
            <img src="/athletiq-full-icon.svg" alt="Athletiq" class="h-8 w-auto mb-3" />
            <p class="text-s text-primary-500 dark:text-primary-400 max-w-xs">
              {{ t('landing.footer.description') }}
            </p>
            <div class="flex">
              <NuxtLink
                :to="authStore.isAuthenticated ? '/dashboard' : '/register'"
                class="inline-block mt-6"
              >
                <img
                  src="/publish/apple-white.png"
                  :alt="t('landing.hero.appStoreAlt')"
                  class="h-12 w-auto"
                />
              </NuxtLink>
              <NuxtLink
                :to="authStore.isAuthenticated ? '/dashboard' : '/register'"
                class="inline-block mt-6"
              >
                <img
                  src="/publish/google-white.png"
                  :alt="t('landing.hero.playStoreAlt')"
                  class="h-12 w-auto"
                />
              </NuxtLink>
            </div>
          </div>
          <div>
            <p
              class="text-xs font-bold uppercase tracking-wide text-primary-400 dark:text-primary-500 mb-3"
            >
              {{ t('landing.footer.product') }}
            </p>
            <ul class="space-y-2 text-sm">
              <li>
                <a
                  href="#features"
                  class="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100 transition-colors"
                  >{{ t('landing.footer.features') }}</a
                >
              </li>
              <li>
                <a
                  href="#coach"
                  class="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100 transition-colors"
                  >{{ t('landing.footer.coach') }}</a
                >
              </li>
              <li>
                <a
                  href="#pricing"
                  class="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100 transition-colors"
                  >{{ t('landing.footer.pricing') }}</a
                >
              </li>
            </ul>
          </div>
          <div>
            <p
              class="text-xs font-bold uppercase tracking-wide text-primary-400 dark:text-primary-500 mb-3"
            >
              {{ t('landing.footer.legal') }}
            </p>
            <ul class="space-y-2 text-sm">
              <li>
                <NuxtLink
                  to="/legal/cgu"
                  class="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100 transition-colors"
                  >{{ t('landing.footer.cgu') }}</NuxtLink
                >
              </li>
              <li>
                <NuxtLink
                  to="/legal/privacy"
                  class="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100 transition-colors"
                  >{{ t('landing.footer.privacy') }}</NuxtLink
                >
              </li>
              <li>
                <NuxtLink
                  to="/legal/mentions"
                  class="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100 transition-colors"
                  >{{ t('landing.footer.mentions') }}</NuxtLink
                >
              </li>
              <li>
                <a
                  href="mailto:contact@athletiq.fr"
                  class="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100 transition-colors"
                  >{{ t('landing.footer.contact') }}</a
                >
              </li>
            </ul>
          </div>
        </div>
        <div class="pt-8 border-t border-sand-200 dark:border-primary-800 text-center">
          <p class="text-primary-400 dark:text-primary-500 text-sm">&copy; 2026 Athletiq</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
import PhoneMockup from '~/components/landing/PhoneMockup.vue';
import BarbellLoader from '~/components/landing/BarbellLoader.vue';

const authStore = useAuthStore();
const { t } = useLocale();

useSeoMeta({
  title: t('landing.seo.title'),
  ogTitle: t('landing.seo.title'),
  description: t('landing.seo.description'),
  ogDescription: t('landing.seo.description'),
  ogImage: 'https://athletiq.fr/athletiq-og.png',
  ogUrl: 'https://athletiq.fr',
  twitterCard: 'summary_large_image',
});

useHead({
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=JetBrains+Mono:wght@500;700&display=swap',
    },
  ],
});

const heroCompletedSets = [
  { label: 'S1', value: '8x85kg' },
  { label: 'S2', value: '6x85kg' },
  { label: 'S3', value: '8x90kg' },
];

const loggingPoints = computed(() => [
  t('landing.logging.point1'),
  t('landing.logging.point2'),
  t('landing.logging.point3'),
  t('landing.logging.point4'),
]);

const progressPoints = computed(() => [
  t('landing.progress.point1'),
  t('landing.progress.point2'),
  t('landing.progress.point3'),
  t('landing.progress.point4'),
]);

const coachPreview = [
  { name: 'Léa M.', status: "Aujourd'hui", active: true },
  { name: 'Karim B.', status: 'Il y a 1 jour', active: false },
  { name: 'Sofia R.', status: 'Il y a 3 jours', active: false },
];

const plans = computed(() => [
  {
    name: t('landing.plans.free.name'),
    price: '0€',
    period: '',
    tagline: t('landing.plans.free.tagline'),
    features: [
      t('landing.plans.free.features.0'),
      t('landing.plans.free.features.1'),
      t('landing.plans.free.features.2'),
      t('landing.plans.free.features.3'),
    ],
    highlight: false,
    badge: null as string | null,
    cta: { to: '/register', label: t('landing.plans.free.cta'), class: 'btn-outline' },
  },
  {
    name: t('landing.plans.monthly.name'),
    price: '5,99€',
    period: '/mois',
    tagline: t('landing.plans.monthly.tagline'),
    features: [
      t('landing.plans.monthly.features.0'),
      t('landing.plans.monthly.features.1'),
      t('landing.plans.monthly.features.2'),
      t('landing.plans.monthly.features.3'),
    ],
    highlight: false,
    badge: null as string | null,
    cta: { to: '/register', label: t('landing.plans.monthly.cta'), class: 'btn-outline' },
  },
  {
    name: t('landing.plans.annual.name'),
    price: '49,99€',
    period: '/an',
    tagline: t('landing.plans.annual.tagline'),
    features: [
      t('landing.plans.annual.features.0'),
      t('landing.plans.annual.features.1'),
      t('landing.plans.annual.features.2'),
    ],
    highlight: true,
    badge: '3 months included' as string | null,
    cta: { to: '/register', label: t('landing.plans.annual.cta'), class: 'btn-primary' },
  },
]);
</script>
