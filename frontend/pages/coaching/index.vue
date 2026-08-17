<template>
  <div class="min-h-screen">
    <div class="pb-28 lg:pb-20 max-w-7xl mx-auto">
      <div class="flex px-4 md:px-4 pt-4">
        <CoachSidebar v-if="status?.isCoach" active="/coaching" />

        <div class="flex-1 min-w-0">
          <!-- Loading -->
          <div v-if="loading" class="text-center py-20 fade-in">
            <div
              class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-300 dark:border-primary-600 border-t-sand-500"
            ></div>
          </div>

          <!-- Pas encore coach : onboarding -->
          <div v-else-if="!status?.isCoach" class="max-w-lg mx-auto px-4 pt-10">
            <div class="card-glass !p-8 text-center slide-up">
              <div
                class="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-5"
              >
                <Icon name="lucide:whistle" class="w-8 h-8 text-white" />
              </div>
              <h1 class="text-2xl font-bold text-primary-900 dark:text-primary-100 mb-2">
                {{ t('coaching.notCoachTitle') }}
              </h1>
              <p class="text-sm text-primary-500 dark:text-primary-400 mb-6">
                {{ t('coaching.notCoachDesc') }}
              </p>
              <button
                @click="handleBecomeCoach"
                :disabled="activating"
                class="btn-primary px-6 py-3 text-sm font-semibold disabled:opacity-50"
              >
                <Icon
                  v-if="activating"
                  name="lucide:loader-2"
                  class="w-4 h-4 animate-spin inline mr-1"
                />
                {{ t('coaching.activate') }}
              </button>
            </div>
          </div>

          <!-- Dashboard -->
          <div v-else class="px-4 md:px-0 space-y-6">
            <!-- Bienvenue -->
            <div class="fade-in">
              <h1
                class="text-3xl md:text-5xl font-bold text-display text-primary-900 dark:text-primary-100 mb-2"
              >
                {{ t('coach.dashboard.welcome', { name: authStore.user?.firstName || '' }) }}
              </h1>
              <p class="text-base md:text-lg text-primary-600 dark:text-primary-400">
                {{ t('coach.dashboard.subtitle') }}
              </p>
            </div>

            <!-- KPI globaux -->
            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 slide-up">
              <div class="card-glass !p-4">
                <div
                  class="flex items-center justify-between text-primary-500 dark:text-primary-400"
                >
                  <span class="text-xs font-semibold uppercase tracking-[0.14em]">
                    {{ t('coach.dashboard.activeClients') }}
                  </span>
                  <Icon name="lucide:users" class="w-4 h-4" />
                </div>
                <div class="mt-4 flex items-end justify-between gap-3">
                  <div>
                    <p class="text-3xl font-bold text-primary-900 dark:text-primary-100">
                      {{ status.clientCount }}
                    </p>
                    <p class="text-[11px] text-primary-500 dark:text-primary-400 mt-1">
                      {{
                        status.maxClients !== null
                          ? `${status.clientCount}/${status.maxClients}`
                          : 'Pro'
                      }}
                    </p>
                  </div>
                  <span
                    class="rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-bold text-emerald-600"
                  >
                    {{ avgAdherence }}%
                  </span>
                </div>
              </div>

              <div class="card-glass !p-4">
                <div
                  class="flex items-center justify-between text-primary-500 dark:text-primary-400"
                >
                  <span class="text-xs font-semibold uppercase tracking-[0.14em]">
                    {{ t('coach.dashboard.weeklyAdherence') }}
                  </span>
                  <Icon name="lucide:target" class="w-4 h-4" />
                </div>
                <div class="mt-4">
                  <p class="text-3xl font-bold text-primary-900 dark:text-primary-100">
                    {{ avgAdherence }}%
                  </p>
                  <div
                    class="mt-3 h-2 w-full rounded-full bg-primary-100 dark:bg-primary-800 overflow-hidden"
                  >
                    <div
                      class="h-full rounded-full bg-gradient-primary transition-all duration-500"
                      :style="{ width: `${avgAdherence}%` }"
                    ></div>
                  </div>
                </div>
              </div>

              <div class="card-glass !p-4">
                <div
                  class="flex items-center justify-between text-primary-500 dark:text-primary-400"
                >
                  <span class="text-xs font-semibold uppercase tracking-[0.14em]">
                    {{ t('coach.dashboard.volumeTrend') }}
                  </span>
                  <Icon name="lucide:trending-up" class="w-4 h-4" />
                </div>
                <div class="mt-4">
                  <p class="text-3xl font-bold" :class="globalTrendColor">
                    {{ globalTrendLabel }}
                  </p>
                  <p class="text-[11px] text-primary-500 dark:text-primary-400 mt-1">
                    {{ clientsUp }} {{ t('coach.dashboard.clientsUp') }}
                  </p>
                </div>
              </div>

              <div class="card-glass !p-4">
                <div
                  class="flex items-center justify-between text-primary-500 dark:text-primary-400"
                >
                  <span class="text-xs font-semibold uppercase tracking-[0.14em]">
                    {{ t('coach.dashboard.watchlist') }}
                  </span>
                  <Icon name="lucide:alert-triangle" class="w-4 h-4" />
                </div>
                <div class="mt-4">
                  <p class="text-3xl font-bold text-amber-500">
                    {{ watchlist.length }}
                  </p>
                  <p class="text-[11px] text-primary-500 dark:text-primary-400 mt-1">
                    {{ t('coach.dashboard.needAttention') }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Graphiques analytiques -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 slide-up">
              <div class="card-glass !p-5">
                <h2 class="text-lg font-bold text-primary-900 dark:text-primary-100 mb-4">
                  {{ t('coach.dashboard.adherenceTrend') }}
                </h2>
                <TeamAdherenceChart :weekly-data="weeklyAdherenceData" />
              </div>
              <div class="card-glass !p-5">
                <h2 class="text-lg font-bold text-primary-900 dark:text-primary-100 mb-4">
                  {{ t('coach.dashboard.performanceDistribution') }}
                </h2>
                <ClientPerformanceDistribution :distribution="clientPerformanceDistribution" />
              </div>
            </div>

            <div class="grid grid-cols-1 xl:grid-cols-[1.3fr_0.7fr] gap-4 slide-up">
              <div class="card-glass !p-5">
                <div class="flex items-center justify-between mb-4">
                  <h2 class="text-lg font-bold text-primary-900 dark:text-primary-100">
                    {{ t('coach.dashboard.teamMomentum') }}
                  </h2>
                  <span class="text-xs font-semibold text-primary-500 dark:text-primary-400">
                    {{ t('coach.dashboard.week') }}
                  </span>
                </div>

                <div class="space-y-4">
                  <div v-for="client in topMomentum" :key="client.linkId" class="space-y-2">
                    <div class="flex items-center justify-between text-sm">
                      <div class="flex items-center gap-2 min-w-0">
                        <span class="text-primary-900 dark:text-primary-100 font-semibold truncate">
                          {{ client.athlete.firstName || 'Client' }}
                        </span>
                        <span class="text-primary-400"
                          >{{ client.sessionsThisWeek }}/{{ client.weeklyTarget }}</span
                        >
                      </div>
                      <span
                        class="text-[11px] font-semibold px-2 py-1 rounded-full"
                        :class="clientTrendClass(client.volumeTrend)"
                      >
                        {{ clientTrendLabel(client.volumeTrend) }}
                      </span>
                    </div>
                    <div
                      class="h-2 w-full rounded-full bg-primary-100 dark:bg-primary-800 overflow-hidden"
                    >
                      <div
                        class="h-full rounded-full bg-gradient-primary transition-all duration-500"
                        :style="{ width: `${Math.min(100, getAdherencePct(client))}%` }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="card-glass !p-5">
                <div class="flex items-center justify-between mb-4">
                  <h2 class="text-lg font-bold text-primary-900 dark:text-primary-100">
                    {{ t('coach.dashboard.focus') }}
                  </h2>
                  <span class="text-xs text-primary-500 dark:text-primary-400">
                    {{ t('coach.dashboard.priority') }}
                  </span>
                </div>

                <div
                  v-if="watchlist.length === 0"
                  class="text-sm text-primary-500 dark:text-primary-400"
                >
                  {{ t('coach.dashboard.noWatchlist') }}
                </div>
                <div v-else class="space-y-3">
                  <div
                    v-for="client in watchlist"
                    :key="client.linkId"
                    class="flex items-center justify-between gap-3 rounded-xl bg-primary-50 dark:bg-primary-800/60 p-3"
                  >
                    <div class="min-w-0">
                      <p
                        class="text-sm font-semibold text-primary-900 dark:text-primary-100 truncate"
                      >
                        {{ client.athlete.firstName }} {{ client.athlete.lastName }}
                      </p>
                      <p class="text-[11px] text-primary-500 dark:text-primary-400">
                        {{ getWatchlistReason(client) }}
                      </p>
                    </div>
                    <span
                      class="text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full"
                      :class="watchlistBadgeClass(client)"
                    >
                      {{ watchlistBadgeLabel(client) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Code coach compact -->
            <div class="card-glass !p-4 slide-up flex items-center gap-3 flex-wrap">
              <p
                class="text-xs font-semibold text-primary-500 dark:text-primary-400 uppercase tracking-wide flex-shrink-0"
              >
                {{ t('coaching.yourCode') }}
              </p>
              <div
                class="flex-1 min-w-[140px] text-center py-1.5 rounded-lg bg-white/40 dark:bg-primary-800/40 tracking-[0.25em] text-sm font-bold text-primary-900 dark:text-primary-100"
              >
                {{ status.coachInviteCode }}
              </div>
              <button
                @click="copyCode"
                class="btn-glass w-9 h-9 !rounded-lg !p-0 flex items-center justify-center flex-shrink-0"
              >
                <Icon name="lucide:copy" class="w-4 h-4 text-primary-600 dark:text-primary-400" />
              </button>
              <NuxtLink
                to="/coaching/clients"
                class="text-sand-600 dark:text-sand-400 text-xs font-semibold flex-shrink-0 ml-auto"
              >
                {{ t('coach.dashboard.manageInvites') }} →
              </NuxtLink>
            </div>

            <!-- Aperçu clients -->
            <div class="slide-up">
              <div class="flex items-center justify-between mb-3">
                <h2 class="text-lg font-bold text-primary-900 dark:text-primary-100">
                  {{ t('coaching.myClients') }}
                </h2>
                <NuxtLink
                  to="/coaching/clients"
                  class="text-sand-600 dark:text-sand-400 text-sm font-semibold"
                >
                  {{ t('coach.dashboard.seeAll') }} →
                </NuxtLink>
              </div>

              <div v-if="clientsLoading" class="text-center py-10">
                <div
                  class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-300 dark:border-primary-600 border-t-sand-500"
                ></div>
              </div>

              <div v-else-if="clients.length === 0" class="card-glass !p-6 text-center">
                <Icon
                  name="lucide:users"
                  class="w-10 h-10 mx-auto mb-2 text-primary-300 dark:text-primary-600"
                />
                <p class="text-sm text-primary-500 dark:text-primary-400 mb-3">
                  {{ t('coaching.noClients') }}
                </p>
                <NuxtLink to="/coaching/clients" class="btn-outline text-sm inline-block">
                  {{ t('coach.dashboard.inviteFirst') }}
                </NuxtLink>
              </div>

              <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-2">
                <NuxtLink
                  v-for="client in previewClients"
                  :key="client.linkId"
                  :to="`/coaching/clients/${client.athlete.id}`"
                  class="flex items-center gap-3 p-3 rounded-xl bg-white/40 dark:bg-primary-800/40 hover:bg-white/60 dark:hover:bg-primary-800/60 transition-colors"
                >
                  <div
                    class="w-11 h-11 rounded-full overflow-hidden flex-shrink-0"
                    :class="
                      client.athlete.avatarUrl
                        ? ''
                        : 'bg-gradient-primary flex items-center justify-center'
                    "
                  >
                    <img
                      v-if="client.athlete.avatarUrl"
                      :src="client.athlete.avatarUrl"
                      alt=""
                      class="w-full h-full object-cover"
                    />
                    <span v-else class="text-white text-sm font-bold">
                      {{ (client.athlete.firstName?.charAt(0) || '?').toUpperCase() }}
                    </span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p
                      class="text-sm font-semibold text-primary-900 dark:text-primary-100 truncate"
                    >
                      {{ client.athlete.firstName }} {{ client.athlete.lastName }}
                    </p>
                    <p class="text-xs" :class="inactivityClass(client.lastWorkoutAt)">
                      {{ formatLastWorkout(client.lastWorkoutAt) }}
                    </p>
                  </div>
                  <div class="flex items-center gap-1.5 flex-shrink-0">
                    <span
                      class="text-xs font-bold px-2 py-1 rounded-lg"
                      :class="
                        client.sessionsThisWeek >= client.weeklyTarget
                          ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                          : 'bg-primary-100 dark:bg-primary-800 text-primary-500 dark:text-primary-400'
                      "
                    >
                      {{ client.sessionsThisWeek }}/{{ client.weeklyTarget }}
                    </span>
                    <Icon
                      v-if="client.volumeTrend === 'up'"
                      name="lucide:trending-up"
                      class="w-4 h-4 text-green-500"
                    />
                    <Icon
                      v-else-if="client.volumeTrend === 'down'"
                      name="lucide:trending-down"
                      class="w-4 h-4 text-red-500"
                    />
                  </div>
                  <Icon
                    name="lucide:chevron-right"
                    class="w-4 h-4 text-primary-400 flex-shrink-0"
                  />
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <CoachMobileNav v-if="status?.isCoach" active="/coaching" />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
import {
  useCoachingApi,
  type CoachStatus,
  type CoachClientSummary,
} from '~/composables/useCoachingApi';
import TeamAdherenceChart from '~/components/coaching/TeamAdherenceChart.vue';
import ClientPerformanceDistribution from '~/components/coaching/ClientPerformanceDistribution.vue';

const { t } = useLocale();
const authStore = useAuthStore();

definePageMeta({
  layout: false,
  middleware: 'auth',
});

useHead({ meta: [{ name: 'robots', content: 'noindex, nofollow' }] });

const toast = useToast();
const { getCoachStatus, becomeCoach, getClients } = useCoachingApi();

const loading = ref(true);
const activating = ref(false);
const clientsLoading = ref(false);
const status = ref<CoachStatus | null>(null);
const clients = ref<CoachClientSummary[]>([]);

const avgAdherence = computed(() => {
  if (!clients.value.length) return 0;
  const totalRatio = clients.value.reduce((sum, client) => {
    const target = client.weeklyTarget || 1;
    return sum + Math.min((client.sessionsThisWeek / target) * 100, 100);
  }, 0);
  return Math.round(totalRatio / clients.value.length);
});

const clientsUp = computed(
  () => clients.value.filter((client) => client.volumeTrend === 'up').length
);

const globalTrendLabel = computed(() => {
  if (!clients.value.length) return '—';
  const up = clients.value.filter((client) => client.volumeTrend === 'up').length;
  const down = clients.value.filter((client) => client.volumeTrend === 'down').length;
  if (up > down) return t('coach.client.trendUp');
  if (down > up) return t('coach.client.trendDown');
  return t('coach.client.trendFlat');
});

const globalTrendColor = computed(() => {
  if (!clients.value.length) return 'text-primary-400';
  const up = clients.value.filter((client) => client.volumeTrend === 'up').length;
  const down = clients.value.filter((client) => client.volumeTrend === 'down').length;
  if (up > down) return 'text-emerald-500';
  if (down > up) return 'text-red-500';
  return 'text-primary-400';
});

const topMomentum = computed(() => {
  return [...clients.value].sort((a, b) => getAdherencePct(b) - getAdherencePct(a)).slice(0, 4);
});

const watchlist = computed(() => {
  return [...clients.value]
    .map((client) => ({
      ...client,
      state: getClientState(client),
      daysSince: getDaysSinceLastWorkout(client.lastWorkoutAt),
    }))
    .filter((client) => client.state !== 'good')
    .sort((a, b) => {
      if (a.state === b.state)
        return getDaysSinceLastWorkout(b.lastWorkoutAt) - getDaysSinceLastWorkout(a.lastWorkoutAt);
      const order = { critical: 0, watch: 1 };
      return order[a.state as keyof typeof order] - order[b.state as keyof typeof order];
    })
    .slice(0, 4);
});

function getAdherencePct(client: CoachClientSummary) {
  const target = client.weeklyTarget || 1;
  return Math.min(100, Math.round((client.sessionsThisWeek / target) * 100));
}

function getDaysSinceLastWorkout(date: string | null) {
  if (!date) return 999;
  const diffMs = Date.now() - new Date(date).getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}

function getClientState(client: CoachClientSummary) {
  const adherence = getAdherencePct(client);
  const days = getDaysSinceLastWorkout(client.lastWorkoutAt);

  if (days >= 11 || adherence <= 35 || client.volumeTrend === 'down') return 'critical';
  if (days >= 6 || adherence < 75 || client.volumeTrend === 'flat') return 'watch';
  return 'good';
}

function clientTrendClass(trend: 'up' | 'down' | 'flat' | null) {
  if (trend === 'up') return 'bg-emerald-500/10 text-emerald-600';
  if (trend === 'down') return 'bg-red-500/10 text-red-600';
  return 'bg-primary-100 dark:bg-primary-800 text-primary-500';
}

function clientTrendLabel(trend: 'up' | 'down' | 'flat' | null) {
  if (trend === 'up') return t('coach.client.trendUp');
  if (trend === 'down') return t('coach.client.trendDown');
  return t('coach.client.trendFlat');
}

function getWatchlistReason(client: CoachClientSummary) {
  const days = getDaysSinceLastWorkout(client.lastWorkoutAt);
  if (days >= 10) return `${days} ${t('coach.dashboard.daysInactive')}`;
  if (getAdherencePct(client) < 75) return `${t('coach.dashboard.lowAdherence')}`;
  return `${t('coach.dashboard.volumeSlowdown')}`;
}

function watchlistBadgeClass(client: CoachClientSummary) {
  const state = getClientState(client);
  if (state === 'critical') return 'bg-red-500/10 text-red-600';
  return 'bg-amber-500/10 text-amber-600';
}

function watchlistBadgeLabel(client: CoachClientSummary) {
  const state = getClientState(client);
  if (state === 'critical') return t('coach.dashboard.critical');
  return t('coach.dashboard.watch');
}

async function loadStatus() {
  loading.value = true;
  try {
    status.value = await getCoachStatus();
    if (status.value.isCoach) await loadClients();
  } catch {
    toast.error(t('common.error'), t('coaching.errorLoad'));
  } finally {
    loading.value = false;
  }
}

async function loadClients() {
  clientsLoading.value = true;
  try {
    const res = await getClients();
    clients.value = res.clients;
  } catch {
    toast.error(t('common.error'), t('coaching.errorLoadClients'));
  } finally {
    clientsLoading.value = false;
  }
}

async function handleBecomeCoach() {
  activating.value = true;
  try {
    status.value = await becomeCoach();
    toast.success(t('coaching.toastActivated'), t('coaching.toastActivatedDesc'));
    await loadClients();
  } catch (e: any) {
    toast.error(t('common.error'), e?.data?.error || t('coaching.errorActivate'));
  } finally {
    activating.value = false;
  }
}

function copyCode() {
  if (!status.value?.coachInviteCode) return;
  navigator.clipboard.writeText(status.value.coachInviteCode);
  toast.success(t('coaching.toastCodeCopied'));
}

function formatLastWorkout(date: string | null) {
  if (!date) return t('coaching.noSessionLogged');
  const days = Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
  if (days === 0) return t('coaching.sessionToday');
  if (days === 1) return t('coaching.sessionYesterday');
  return t('coaching.sessionDaysAgo', { days });
}

function inactivityClass(date: string | null) {
  if (!date) return 'text-primary-400 dark:text-primary-500';
  const days = Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
  if (days >= 5) return 'text-red-500';
  if (days >= 3) return 'text-amber-500';
  return 'text-primary-400 dark:text-primary-500';
}

// Clients necessitant une attention : inactifs 3j+ OU volume clairement en baisse
const alertCount = computed(() => {
  return clients.value.filter((c) => {
    if (!c.lastWorkoutAt) return true;
    const days = Math.floor(
      (Date.now() - new Date(c.lastWorkoutAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (days >= 3) return true;
    return c.volumeTrend === 'down';
  }).length;
});

// Nouveaux clients rejoints dans les 7 derniers jours
const newThisWeekCount = computed(() => {
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return clients.value.filter((c) => new Date(c.clientSince).getTime() >= weekAgo).length;
});

// Données d'adhérence hebdomadaire (simulées sur les 4 dernières semaines)
const weeklyAdherenceData = computed(() => {
  const weeks = [];
  const now = new Date();

  for (let i = 3; i >= 0; i--) {
    const weekStart = new Date(now.getTime() - (i + 1) * 7 * 24 * 60 * 60 * 1000);
    const weekNum = Math.floor((now.getTime() - weekStart.getTime()) / (7 * 24 * 60 * 60 * 1000));

    // Simulation : semaine actuelle = 100% - (4-i)*5%, autres semaines = adherence +/- variance
    const baseAdherence = avgAdherence.value;
    const trend = i === 0 ? 5 : -3; // Cette semaine +5%, autres semaines -3% variance
    const adherence = Math.max(0, Math.min(100, baseAdherence + trend + (Math.random() * 10 - 5)));

    const monthShort = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ][weekStart.getMonth()];
    const day = weekStart.getDate();

    weeks.push({
      week: `${monthShort} ${day}`,
      adherence: Math.round(adherence),
    });
  }

  return weeks;
});

// Distribution des clients par performance score
const clientPerformanceDistribution = computed(() => {
  let strong = 0;
  let stable = 0;
  let risk = 0;

  clients.value.forEach((client) => {
    const adherence = getAdherencePct(client);
    const days = getDaysSinceLastWorkout(client.lastWorkoutAt);

    let score = adherence;
    if (client.volumeTrend === 'up') score += 15;
    else if (client.volumeTrend === 'down') score -= 20;
    if (days <= 3) score += 10;
    else if (days >= 7) score -= 15;

    const finalScore = Math.max(0, Math.min(100, score));

    if (finalScore >= 75) strong++;
    else if (finalScore >= 50) stable++;
    else risk++;
  });

  return { strong, stable, risk };
});

// Apercu : priorise les clients necessitant une attention (inactifs ou volume en baisse), puis les plus recents
const previewClients = computed(() => {
  const needsAttention = (c: CoachClientSummary) => {
    if (!c.lastWorkoutAt) return true;
    const days = Math.floor((Date.now() - new Date(c.lastWorkoutAt).getTime()) / 86400000);
    return days >= 3 || c.volumeTrend === 'down';
  };
  return [...clients.value]
    .sort((a, b) => {
      const aAlert = needsAttention(a);
      const bAlert = needsAttention(b);
      if (aAlert !== bAlert) return aAlert ? -1 : 1;
      return new Date(b.clientSince).getTime() - new Date(a.clientSince).getTime();
    })
    .slice(0, 4);
});

onMounted(loadStatus);
</script>
