<template>
  <div class="min-h-screen bg-cream-50 dark:bg-primary-900">
    <!-- ============ HERO ============ -->
    <section class="relative overflow-hidden pt-8 md:pt-12 pb-24 md:pb-32 px-6">
      <div
        class="absolute inset-0 pointer-events-none"
        style="
          background: radial-gradient(
            ellipse 80% 50% at 50% 80%,
            rgba(45, 141, 128, 0.18),
            transparent
          );
        "
        aria-hidden="true"
      />

      <div class="relative max-w-6xl mx-auto">
        <!-- Mockup gauche : roster en direct -->
        <div
          class="hidden lg:block absolute left-[-30px] xl:left-[10px] top-[2%] -rotate-[11deg] z-0 opacity-95 pointer-events-none select-none"
          aria-hidden="true"
        >
          <PhoneMockup :width="250"> </PhoneMockup>
        </div>

        <!-- Texte -->
        <div class="relative z-10 max-w-2xl mx-auto text-center fade-in">
          <h1
            class="font-display font-semibold text-primary-900 dark:text-primary-50 text-4xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight mb-6"
          >
            {{ t('coaching.landingTitle') || 'Coachez avec' }}<br />
            <span class="text-teal-600 dark:text-teal-400">{{
              t('coaching.landingAccent') || 'clarté, pas au feeling'
            }}</span>
          </h1>

          <p
            class="text-primary-600 dark:text-primary-300 text-base md:text-xl max-w-xl mx-auto mb-9 leading-relaxed"
          >
            {{ t('coaching.landingSubtitle') || 'clarté, pas au feeling' }}
          </p>

          <NuxtLink
            :to="authStore.isAuthenticated ? '/coaching' : '/register'"
            class="btn-primary text-base px-8 py-3.5 inline-block !bg-gradient-to-r !from-teal-500 !to-teal-600 hover:!from-teal-600 hover:!to-teal-700"
          >
            {{ authStore.isAuthenticated ? 'Accéder à mon espace' : 'Créer mon espace coach' }}
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

        <!-- Mockup droite : analytics -->
        <div
          class="hidden lg:block absolute right-[-30px] xl:right-[10px] top-[38%] rotate-[9deg] z-20 pointer-events-none select-none"
          aria-hidden="true"
        >
          <PhoneMockup :width="260"> </PhoneMockup>
        </div>
      </div>
    </section>

    <!-- ============ TRUST STRIP ============ -->
    <section class="py-6 px-6 border-y border-sand-200/60 dark:border-primary-800">
      <div
        class="max-w-4xl mx-auto flex flex-wrap justify-center gap-x-10 gap-y-3 text-sm text-primary-500 dark:text-primary-400"
      >
        <span class="flex items-center gap-2">
          <Icon name="lucide:activity" class="w-4 h-4 text-teal-600" />
          Suivi en temps réel
        </span>
        <span class="flex items-center gap-2">
          <Icon name="lucide:shield-check" class="w-4 h-4 text-teal-600" />
          {{ t('landing.trust.stripe') || 'Données sécurisées' }}
        </span>
        <span class="flex items-center gap-2">
          <Icon name="lucide:infinity" class="w-4 h-4 text-teal-600" />
          Athlètes illimités
        </span>
        <span class="flex items-center gap-2">
          <Icon name="lucide:clock" class="w-4 h-4 text-teal-600" />
          Essai gratuit 14 jours
        </span>
      </div>
    </section>

    <!-- ============ FEED EN DIRECT ============ -->
    <section id="fonctionnalites" class="py-10 md:py-18 px-6">
      <div class="max-w-2xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div class="text-center lg:text-left order-2 lg:order-1">
          <p
            class="font-display text-teal-600 dark:text-teal-400 text-sm tracking-[0.2em] uppercase mb-3"
          >
            Pilotage
          </p>
          <h2
            class="font-display font-semibold text-3xl md:text-5xl text-primary-900 dark:text-primary-50 mb-5 tracking-tight leading-tight"
          >
            {{ t('coaching.coachFeature1') || 'Suivez chaque athlète en un coup d’œil' }}
          </h2>
          <p
            class="text-primary-600 dark:text-primary-300 text-lg leading-relaxed mb-8 max-w-md mx-auto lg:mx-0"
          >
            Une visibilité en temps réel sur les séances, l'adhérence et la performance de chaque
            athlète. Plus aucune séance manquée, plus aucun plateau ignoré.
          </p>
          <ul class="space-y-3 max-w-sm mx-auto lg:mx-0">
            <li
              v-for="item in feedPoints"
              :key="item"
              class="flex items-center gap-3 justify-center lg:justify-start"
            >
              <span
                class="w-5 h-5 rounded-full bg-teal-50 dark:bg-teal-900/40 flex items-center justify-center flex-shrink-0"
              >
                <Icon name="lucide:check" class="w-3 h-3 text-teal-700 dark:text-teal-400" />
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

    <!-- ============ ANALYTICS ============ -->
    <section class="py-20 md:py-28 px-6 bg-white dark:bg-primary-950/40">
      <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div class="flex justify-center order-1">
          <div class="w-full max-w-md rounded-3xl bg-primary-900 p-6 md:p-8 text-white">
            <div class="flex items-center justify-between mb-6">
              <span class="text-xs font-semibold tracking-wide text-primary-300 uppercase"
                >Tableau de bord</span
              >
              <Icon name="lucide:bar-chart-3" class="w-5 h-5 text-teal-400" />
            </div>
            <div class="grid grid-cols-2 gap-3 mb-6">
              <div
                v-for="stat in dashboardStats"
                :key="stat.label"
                class="bg-primary-950/60 rounded-2xl p-4"
              >
                <p class="font-plate text-2xl font-bold mb-1">{{ stat.value }}</p>
                <p class="text-xs text-primary-400">{{ stat.label }}</p>
              </div>
            </div>
            <div class="flex items-end gap-1.5 h-16">
              <div
                v-for="bar in analyticsBars"
                :key="bar.label + '-bento'"
                class="flex-1 rounded-t bg-gradient-to-t from-teal-600 to-teal-400"
                :style="{ height: bar.height }"
              />
            </div>
          </div>
        </div>
        <div class="text-center lg:text-left order-2">
          <p
            class="font-display text-teal-600 dark:text-teal-400 text-sm tracking-[0.2em] uppercase mb-3"
          >
            Analyse
          </p>
          <h2
            class="font-display font-semibold text-3xl md:text-5xl text-primary-900 dark:text-primary-50 mb-5 tracking-tight leading-tight"
          >
            {{ t('coaching.coachFeature2') || 'Des décisions appuyées sur la donnée' }}
          </h2>
          <p
            class="text-primary-600 dark:text-primary-300 text-lg leading-relaxed mb-8 max-w-md mx-auto lg:mx-0"
          >
            Des tableaux de bord clairs pour visualiser les tendances de votre roster, la courbe de
            progression de chaque athlète et repérer la fatigue avant qu'elle ne devienne une
            blessure.
          </p>
          <ul class="space-y-3 max-w-sm mx-auto lg:mx-0">
            <li
              v-for="item in analyticsPoints"
              :key="item"
              class="flex items-center gap-3 justify-center lg:justify-start"
            >
              <span
                class="w-5 h-5 rounded-full bg-teal-50 dark:bg-teal-900/40 flex items-center justify-center flex-shrink-0"
              >
                <Icon name="lucide:check" class="w-3 h-3 text-teal-700 dark:text-teal-400" />
              </span>
              <span class="text-primary-700 dark:text-primary-300 text-sm font-medium">{{
                item
              }}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- ============ GESTION D'EQUIPE ============ -->
    <section class="py-20 md:py-28 px-6">
      <div class="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div class="text-center lg:text-left order-2 lg:order-2">
          <p
            class="font-display text-teal-600 dark:text-teal-400 text-sm tracking-[0.2em] uppercase mb-3"
          >
            Équipe
          </p>
          <h2
            class="font-display font-semibold text-3xl md:text-5xl text-primary-900 dark:text-primary-50 mb-5 tracking-tight leading-tight"
          >
            {{ t('coaching.coachFeature4') || 'Un roster facile à gérer' }}
          </h2>
          <p
            class="text-primary-600 dark:text-primary-300 text-lg leading-relaxed mb-8 max-w-md mx-auto lg:mx-0"
          >
            Invitez vos athlètes avec un simple code, gérez les permissions, assignez des programmes
            et gardez des notes privées pour chaque client.
          </p>
          <NuxtLink
            :to="authStore.isAuthenticated ? '/coaching' : '/register'"
            class="btn-primary px-8 py-3.5 inline-block !bg-gradient-to-r !from-teal-500 !to-teal-600 hover:!from-teal-600 hover:!to-teal-700"
          >
            {{ authStore.isAuthenticated ? 'Gérer mes athlètes' : 'Inviter mon premier athlète' }}
          </NuxtLink>
        </div>
        <div
          class="order-1 lg:order-1 flex justify-center gap-5 -rotate-[8deg] pointer-events-none select-none"
        >
          <PhoneMockup :width="210"> </PhoneMockup>
          <PhoneMockup :width="210" class="mt-10"> </PhoneMockup>
        </div>
      </div>
    </section>

    <!-- ============ AUTRES ATOUTS ============ -->
    <section class="py-20 md:py-28 px-6 bg-white dark:bg-primary-950/40">
      <div class="max-w-5xl mx-auto">
        <div class="text-center mb-14">
          <p
            class="font-display text-teal-600 dark:text-teal-400 text-sm tracking-[0.2em] uppercase mb-3"
          >
            En plus
          </p>
          <h2
            class="font-display font-semibold text-3xl md:text-5xl text-primary-900 dark:text-primary-50 mb-4 tracking-tight"
          >
            Tout ce qu'il faut pour scaler votre coaching
          </h2>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6 slide-up">
          <div v-for="card in extraFeatures" :key="card.title" class="card-glass !p-6">
            <div
              class="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-900/30 border border-teal-100 dark:border-teal-800/50 flex items-center justify-center mb-4"
            >
              <Icon :name="card.icon" class="w-6 h-6 text-teal-600 dark:text-teal-400" />
            </div>
            <h3 class="text-lg font-bold text-primary-900 dark:text-primary-100 mb-1.5">
              {{ card.title }}
            </h3>
            <p class="text-sm text-primary-600 dark:text-primary-400 leading-relaxed">
              {{ card.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ CHIFFRES ============ -->
    <section class="py-16 md:py-20 px-6">
      <div class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
        <div v-for="stat in statHighlights" :key="stat.label" class="card-glass text-center !p-8">
          <p
            class="font-plate text-3xl md:text-4xl font-bold text-primary-900 dark:text-primary-100 mb-2"
          >
            {{ stat.value }}
          </p>
          <p class="text-sm text-primary-500 dark:text-primary-400">{{ stat.label }}</p>
        </div>
      </div>
    </section>

    <!-- ============ CTA FINAL ============ -->
    <section class="py-20 md:py-28 px-6">
      <div class="max-w-2xl mx-auto text-center">
        <h2
          class="font-display font-semibold text-3xl md:text-5xl text-primary-900 dark:text-primary-50 mb-5 tracking-tight"
        >
          Prêt à transformer votre coaching ?
        </h2>
        <p class="text-primary-600 dark:text-primary-400 text-lg mb-8">
          Créez votre espace coach gratuitement. Aucune carte bancaire requise.
        </p>
        <NuxtLink
          :to="authStore.isAuthenticated ? '/coaching' : '/register'"
          class="btn-primary text-base md:text-lg px-10 md:px-12 py-4 !bg-gradient-to-r !from-teal-500 !to-teal-600 hover:!from-teal-600 hover:!to-teal-700"
        >
          {{ authStore.isAuthenticated ? 'Accéder à mon espace' : 'Créer mon espace coach' }}
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

const authStore = useAuthStore();
const { t } = useLocale();

definePageMeta({
  layout: false,
});

useHead({
  title: 'Athletiq Coach — Pilotez vos athlètes avec clarté',
  meta: [
    {
      name: 'description',
      content:
        "L'espace coach d'Athletiq : suivi en temps réel, analytics d'équipe et gestion de roster, pour transformer les données de vos athlètes en décisions.",
    },
  ],
});

const roster = [
  { name: 'Léa M.', initials: 'LM', status: "Aujourd'hui", active: true, color: 'bg-teal-600' },
  { name: 'Karim B.', initials: 'KB', status: 'Hier', active: false, color: 'bg-sand-600' },
  {
    name: 'Sofia R.',
    initials: 'SR',
    status: 'Il y a 3 jours',
    active: false,
    color: 'bg-primary-600',
  },
  { name: 'Nathan D.', initials: 'ND', status: "Aujourd'hui", active: true, color: 'bg-teal-700' },
];

const analyticsBars = [
  { label: 'L', height: '40%' },
  { label: 'M', height: '65%' },
  { label: 'M', height: '50%' },
  { label: 'J', height: '80%' },
  { label: 'V', height: '60%' },
  { label: 'S', height: '30%' },
  { label: 'D', height: '20%' },
];

const dashboardStats = [
  { value: '24', label: 'Athlètes actifs' },
  { value: '94%', label: 'Adhérence' },
  { value: '3', label: 'Alertes fatigue' },
  { value: '+18%', label: 'Volume moyen' },
];

const feedPoints = [
  'Complétion des séances en direct',
  'Détection des tendances de volume',
  "Alertes d'adhérence",
  'Historique complet par athlète',
];

const analyticsPoints = [
  "Répartition de la performance de l'équipe",
  'Courbes de progression individuelles',
  'Suivi de la récupération et de la fatigue',
  'Comparaison entre athlètes',
];

const extraFeatures = [
  {
    icon: 'lucide:bell',
    title: 'Alertes intelligentes',
    description:
      "Soyez prévenu avant qu'un problème n'apparaisse : chute d'adhérence, fatigue en hausse, séance manquée.",
  },
  {
    icon: 'lucide:shield-check',
    title: 'Permissions fines',
    description:
      'Décidez ce que chaque athlète voit et partage. Vos notes de coaching restent privées.',
  },
  {
    icon: 'lucide:history',
    title: 'Historique complet',
    description: 'Retrouvez chaque séance, chaque note et chaque évolution, sans limite de durée.',
  },
  {
    icon: 'lucide:file-down',
    title: 'Export & rapports',
    description: 'Exportez les données de vos athlètes pour vos bilans et suivis personnalisés.',
  },
];

const statHighlights = [
  { value: '∞', label: 'Athlètes illimités, aucune restriction' },
  { value: 'Temps réel', label: 'Mises à jour dès qu’un athlète s’entraîne' },
  { value: '100%', label: 'Décisions appuyées sur la donnée' },
];
</script>
