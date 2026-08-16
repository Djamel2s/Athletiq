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

            <!-- Stats rapides -->
            <div class="grid grid-cols-3 gap-3 md:gap-4 slide-up">
              <div class="card-glass !p-4 text-center">
                <p class="text-2xl md:text-3xl font-bold text-primary-900 dark:text-primary-100">
                  {{ status.clientCount
                  }}<span v-if="status.maxClients !== null" class="text-primary-400 text-lg"
                    >/{{ status.maxClients }}</span
                  >
                </p>
                <p class="text-xs text-primary-500 dark:text-primary-400 mt-1">
                  {{ t('coach.dashboard.activeClients') }}
                </p>
              </div>
              <div class="card-glass !p-4 text-center">
                <p
                  class="text-2xl md:text-3xl font-bold"
                  :class="
                    alertCount > 0 ? 'text-amber-500' : 'text-primary-900 dark:text-primary-100'
                  "
                >
                  {{ alertCount }}
                </p>
                <p class="text-xs text-primary-500 dark:text-primary-400 mt-1">
                  {{ t('coach.dashboard.alerts') }}
                </p>
              </div>
              <div class="card-glass !p-4 text-center">
                <p class="text-2xl md:text-3xl font-bold text-primary-900 dark:text-primary-100">
                  {{ newThisWeekCount }}
                </p>
                <p class="text-xs text-primary-500 dark:text-primary-400 mt-1">
                  {{ t('coach.dashboard.newThisWeek') }}
                </p>
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

// Clients necessitant une attention : pas de seance depuis 3j+ (ou jamais)
const alertCount = computed(() => {
  return clients.value.filter((c) => {
    if (!c.lastWorkoutAt) return true;
    const days = Math.floor(
      (Date.now() - new Date(c.lastWorkoutAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    return days >= 3;
  }).length;
});

// Nouveaux clients rejoints dans les 7 derniers jours
const newThisWeekCount = computed(() => {
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return clients.value.filter((c) => new Date(c.clientSince).getTime() >= weekAgo).length;
});

// Apercu : priorise les clients necessitant une attention, puis les plus recents
const previewClients = computed(() => {
  return [...clients.value]
    .sort((a, b) => {
      const aAlert =
        !a.lastWorkoutAt ||
        Math.floor((Date.now() - new Date(a.lastWorkoutAt).getTime()) / 86400000) >= 3;
      const bAlert =
        !b.lastWorkoutAt ||
        Math.floor((Date.now() - new Date(b.lastWorkoutAt).getTime()) / 86400000) >= 3;
      if (aAlert !== bAlert) return aAlert ? -1 : 1;
      return new Date(b.clientSince).getTime() - new Date(a.clientSince).getTime();
    })
    .slice(0, 4);
});

onMounted(loadStatus);
</script>
