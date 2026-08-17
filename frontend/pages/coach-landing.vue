<template>
  <div class="min-h-screen bg-cream-50 dark:bg-primary-900">
    <!-- ============ HERO ============ -->
    <section class="relative overflow-hidden pt-16 md:pt-20 pb-24 md:pb-32 px-6">
      <div
        class="absolute inset-0 pointer-events-none"
        style="
          background: radial-gradient(
            ellipse 80% 50% at 50% 80%,
            rgba(177, 207, 195, 0.35),
            transparent
          );
        "
        aria-hidden="true"
      />

      <div class="relative max-w-6xl mx-auto">
        <div
          class="hidden lg:flex absolute left-[-30px] xl:left-[10px] top-[2%] -rotate-[11deg] z-0 opacity-90 pointer-events-none select-none items-center justify-center w-64 h-96 rounded-3xl bg-gradient-to-br from-teal-500 to-teal-700 shadow-2xl"
          aria-hidden="true"
        >
          <div class="text-center text-white">
            <Icon name="lucide:activity" class="w-24 h-24 mx-auto mb-4 opacity-80" />
            <p class="text-sm font-semibold">Live Feed</p>
          </div>
        </div>

        <div class="relative z-10 max-w-2xl mx-auto text-center fade-in">
          <div
            class="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-teal-100 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800"
          >
            <Icon name="lucide:whistle" class="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span class="text-sm font-semibold text-teal-700 dark:text-teal-300">{{
              t('coach.nav.badge')
            }}</span>
          </div>

          <h1
            class="font-display font-semibold text-primary-900 dark:text-primary-50 text-4xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight mb-6"
          >
            {{ t('coaching.landingTitle') }}<br />
            <span class="text-teal-600 dark:text-teal-400">{{
              t('coaching.landingSubtitle')
            }}</span>
          </h1>

          <p
            class="text-primary-600 dark:text-primary-300 text-base md:text-lg max-w-xl mx-auto mb-9 leading-relaxed"
          >
            {{
              t('coaching.landingHeroBody') ||
              'Build stronger athletes. Track progress. Make data-driven decisions. Scale your coaching business.'
            }}
          </p>

          <NuxtLink
            :to="authStore.isAuthenticated ? '/coaching' : '/register'"
            class="btn-primary text-base px-8 py-3.5 inline-block !bg-gradient-to-r !from-teal-500 !to-teal-600 hover:!from-teal-600 hover:!to-teal-700"
          >
            {{ authStore.isAuthenticated ? 'Go to Coach Space' : 'Start as a Coach' }}
          </NuxtLink>
        </div>

        <div
          class="hidden lg:flex absolute right-[-30px] xl:right-[10px] top-[38%] rotate-[9deg] z-20 pointer-events-none select-none items-center justify-center w-72 h-96 rounded-3xl bg-gradient-to-br from-teal-400 to-teal-600 shadow-2xl"
          aria-hidden="true"
        >
          <div class="text-center text-white">
            <Icon name="lucide:bar-chart-3" class="w-24 h-24 mx-auto mb-4 opacity-80" />
            <p class="text-sm font-semibold">Analytics</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ TRUST STRIP ============ -->
    <section class="py-6 px-6 border-y border-sand-200/60 dark:border-primary-800">
      <div
        class="max-w-4xl mx-auto flex flex-wrap justify-center gap-x-10 gap-y-3 text-sm text-primary-500 dark:text-primary-400"
      >
        <span class="flex items-center gap-2">
          <Icon name="lucide:lock" class="w-4 h-4 text-teal-600" />
          {{ t('landing.trust.stripe') || 'Secure athlete data' }}
        </span>
        <span class="flex items-center gap-2">
          <Icon name="lucide:zap" class="w-4 h-4 text-teal-600" />
          Real-time updates
        </span>
        <span class="flex items-center gap-2">
          <Icon name="lucide:globe" class="w-4 h-4 text-teal-600" />
          Cloud-based
        </span>
      </div>
    </section>

    <!-- ============ FEATURES GRID ============ -->
    <section class="py-20 md:py-28 px-6">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16 fade-in">
          <h2 class="text-3xl md:text-5xl font-bold text-primary-900 dark:text-primary-50 mb-4">
            Everything you need to coach better
          </h2>
          <p class="text-primary-600 dark:text-primary-300 text-lg max-w-2xl mx-auto">
            Real-time insights into every athlete's progress, automated recommendations, and
            decision support that lets you scale your coaching practice.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 slide-up">
          <!-- Feature 1: Live Feed -->
          <div class="card-glass !p-8 hover:scale-105 transition-transform duration-300">
            <div
              class="w-12 h-12 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center mb-4"
            >
              <Icon name="lucide:activity" class="w-6 h-6 text-white" />
            </div>
            <h3 class="text-xl font-bold text-primary-900 dark:text-primary-100 mb-2">
              {{ t('coaching.coachFeature1') || 'Live Athlete Feed' }}
            </h3>
            <p class="text-primary-600 dark:text-primary-400 mb-4">
              Real-time visibility into every athlete's workouts, adherence, and performance
              metrics. Never miss a session or a plateau.
            </p>
            <ul class="space-y-2 text-sm text-primary-500 dark:text-primary-400">
              <li class="flex items-start gap-2">
                <Icon name="lucide:check" class="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                <span>Live workout completion</span>
              </li>
              <li class="flex items-start gap-2">
                <Icon name="lucide:check" class="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                <span>Volume trend detection</span>
              </li>
              <li class="flex items-start gap-2">
                <Icon name="lucide:check" class="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                <span>Adherence alerts</span>
              </li>
            </ul>
          </div>

          <!-- Feature 2: Analytics -->
          <div class="card-glass !p-8 hover:scale-105 transition-transform duration-300">
            <div
              class="w-12 h-12 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center mb-4"
            >
              <Icon name="lucide:bar-chart-3" class="w-6 h-6 text-white" />
            </div>
            <h3 class="text-xl font-bold text-primary-900 dark:text-primary-100 mb-2">
              {{ t('coaching.coachFeature2') || 'Performance Analytics' }}
            </h3>
            <p class="text-primary-600 dark:text-primary-400 mb-4">
              Visual dashboards showing team trends, individual progress curves, and performance
              distribution across your roster.
            </p>
            <ul class="space-y-2 text-sm text-primary-500 dark:text-primary-400">
              <li class="flex items-start gap-2">
                <Icon name="lucide:check" class="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                <span>Team performance distribution</span>
              </li>
              <li class="flex items-start gap-2">
                <Icon name="lucide:check" class="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                <span>Individual progress curves</span>
              </li>
              <li class="flex items-start gap-2">
                <Icon name="lucide:check" class="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                <span>Recovery and fatigue tracking</span>
              </li>
            </ul>
          </div>

          <!-- Feature 3: Insights -->
          <div class="card-glass !p-8 hover:scale-105 transition-transform duration-300">
            <div
              class="w-12 h-12 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center mb-4"
            >
              <Icon name="lucide:brain" class="w-6 h-6 text-white" />
            </div>
            <h3 class="text-xl font-bold text-primary-900 dark:text-primary-100 mb-2">
              {{ t('coaching.coachFeature3') || 'Automated Insights' }}
            </h3>
            <p class="text-primary-600 dark:text-primary-400 mb-4">
              AI-powered coaching recommendations based on athlete data. Get alerts before problems
              happen, not after.
            </p>
            <ul class="space-y-2 text-sm text-primary-500 dark:text-primary-400">
              <li class="flex items-start gap-2">
                <Icon name="lucide:check" class="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                <span>Fatigue alerts</span>
              </li>
              <li class="flex items-start gap-2">
                <Icon name="lucide:check" class="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                <span>Volume recommendations</span>
              </li>
              <li class="flex items-start gap-2">
                <Icon name="lucide:check" class="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                <span>Personalized coaching actions</span>
              </li>
            </ul>
          </div>

          <!-- Feature 4: Management -->
          <div class="card-glass !p-8 hover:scale-105 transition-transform duration-300">
            <div
              class="w-12 h-12 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center mb-4"
            >
              <Icon name="lucide:users-round" class="w-6 h-6 text-white" />
            </div>
            <h3 class="text-xl font-bold text-primary-900 dark:text-primary-100 mb-2">
              {{ t('coaching.coachFeature4') || 'Easy Athlete Management' }}
            </h3>
            <p class="text-primary-600 dark:text-primary-400 mb-4">
              Invite athletes with a simple code, manage permissions, assign programs, and keep
              private notes for every client.
            </p>
            <ul class="space-y-2 text-sm text-primary-500 dark:text-primary-400">
              <li class="flex items-start gap-2">
                <Icon name="lucide:check" class="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                <span>Simple invite system</span>
              </li>
              <li class="flex items-start gap-2">
                <Icon name="lucide:check" class="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                <span>Permission management</span>
              </li>
              <li class="flex items-start gap-2">
                <Icon name="lucide:check" class="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                <span>Private coaching notes</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ CTA SECTION ============ -->
    <section
      class="py-16 md:py-24 px-6 bg-gradient-to-r from-teal-500/10 to-teal-600/10 dark:from-teal-900/20 dark:to-teal-800/20 border-y border-teal-200/50 dark:border-teal-800/50"
    >
      <div class="max-w-4xl mx-auto text-center fade-in">
        <h2 class="text-3xl md:text-5xl font-bold text-primary-900 dark:text-primary-50 mb-6">
          Ready to transform your coaching?
        </h2>
        <p class="text-lg text-primary-600 dark:text-primary-300 mb-8 max-w-2xl mx-auto">
          Start free today. No credit card required. Scale your coaching practice with data-driven
          decisions.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink
            :to="authStore.isAuthenticated ? '/coaching' : '/register'"
            class="btn-primary px-8 py-4 text-base !bg-gradient-to-r !from-teal-500 !to-teal-600 hover:!from-teal-600 hover:!to-teal-700"
          >
            {{ authStore.isAuthenticated ? 'Go to Coach Space' : 'Start Your Coaching Space' }}
          </NuxtLink>
          <NuxtLink to="/#coach" class="btn-glass px-8 py-4 text-base"> Learn More </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ============ COMPARISON ============ -->
    <section class="py-20 md:py-28 px-6">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16 fade-in">
          <h2 class="text-3xl md:text-5xl font-bold text-primary-900 dark:text-primary-50 mb-4">
            Built for modern strength coaches
          </h2>
          <p class="text-primary-600 dark:text-primary-300 text-lg">
            More than just an athlete app with a coach interface. A complete coaching management
            system.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 slide-up">
          <div class="card-glass !p-6 text-center">
            <Icon name="lucide:users" class="w-12 h-12 mx-auto mb-4 text-teal-500" />
            <h3 class="font-bold text-lg mb-2 text-primary-900 dark:text-primary-100">
              Unlimited Athletes
            </h3>
            <p class="text-sm text-primary-600 dark:text-primary-400">
              Manage as many clients as you want. No seat limits, no restrictions.
            </p>
          </div>
          <div class="card-glass !p-6 text-center">
            <Icon name="lucide:chart-line" class="w-12 h-12 mx-auto mb-4 text-teal-500" />
            <h3 class="font-bold text-lg mb-2 text-primary-900 dark:text-primary-100">
              Data-Driven
            </h3>
            <p class="text-sm text-primary-600 dark:text-primary-400">
              Every decision backed by real athlete data. No guessing.
            </p>
          </div>
          <div class="card-glass !p-6 text-center">
            <Icon name="lucide:zap" class="w-12 h-12 mx-auto mb-4 text-teal-500" />
            <h3 class="font-bold text-lg mb-2 text-primary-900 dark:text-primary-100">Real-Time</h3>
            <p class="text-sm text-primary-600 dark:text-primary-400">
              Live athlete updates. See progress as it happens.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { t } = useLocale();
const authStore = useAuthStore();

definePageMeta({
  layout: false,
});

useHead({
  title: 'Athletiq Coach Space - Manage Athletes, Make Data-Driven Decisions',
  meta: [
    {
      name: 'description',
      content:
        'The coach space that turns athlete data into insights. Real-time visibility, performance analytics, and automated coaching recommendations.',
    },
  ],
});
</script>
