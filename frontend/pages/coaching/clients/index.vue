<template>
  <div class="min-h-screen">
    <div class="pb-28 lg:pb-20 max-w-7xl mx-auto">
      <div class="flex px-4 md:px-4 pt-4">
        <CoachSidebar active="/coaching/clients" />

        <div class="flex-1 min-w-0 px-4 md:px-0 space-y-6">
          <div class="fade-in">
            <h1
              class="text-3xl md:text-4xl font-bold text-display text-primary-900 dark:text-primary-100 mb-1"
            >
              {{ t('coach.nav.clients') }}
            </h1>
            <p class="text-primary-600 dark:text-primary-400">{{ t('coaching.subtitle') }}</p>
          </div>

          <div v-if="loading" class="text-center py-20">
            <div
              class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-300 dark:border-primary-600 border-t-sand-500"
            ></div>
          </div>

          <template v-else>
            <!-- Invite code card -->
            <div class="card-glass !p-5 slide-up">
              <h2 class="text-sm font-semibold text-primary-900 dark:text-primary-100 mb-3">
                {{ t('coaching.yourCode') }}
              </h2>
              <div class="flex items-center gap-3 mb-3">
                <div
                  class="flex-1 text-center py-3 rounded-xl bg-white/40 dark:bg-primary-800/40 tracking-[0.3em] text-xl font-bold text-primary-900 dark:text-primary-100"
                >
                  {{ status?.coachInviteCode }}
                </div>
                <button
                  @click="copyCode"
                  class="btn-glass w-11 h-11 !rounded-xl !p-0 flex items-center justify-center flex-shrink-0"
                >
                  <Icon name="lucide:copy" class="w-4 h-4 text-primary-600 dark:text-primary-400" />
                </button>
              </div>
              <p class="text-xs text-primary-400 dark:text-primary-500 mb-4">
                {{ t('coaching.codeHint') }}
              </p>

              <div class="flex items-center justify-between text-xs">
                <span class="text-primary-500 dark:text-primary-400">
                  {{
                    t('coaching.clientCount', {
                      count: status?.clientCount ?? 0,
                      plural: (status?.clientCount ?? 0) > 1 ? 's' : '',
                    })
                  }}
                  <span v-if="status?.maxClients !== null">
                    / {{ status?.maxClients }} ({{ t('coaching.planFree') }})</span
                  >
                  <span v-else> · {{ t('coaching.planProUnlimited') }}</span>
                </span>
                <NuxtLink
                  v-if="status?.maxClients !== null"
                  to="/subscription"
                  class="text-sand-600 dark:text-sand-400 font-semibold"
                >
                  {{ t('coaching.goPro') }} →
                </NuxtLink>
              </div>
            </div>

            <!-- Invite by email/username -->
            <div class="card-glass !p-5 slide-up">
              <h2 class="text-sm font-semibold text-primary-900 dark:text-primary-100 mb-3">
                {{ t('coaching.inviteTitle') }}
              </h2>
              <form @submit.prevent="handleInvite" class="flex gap-2">
                <input
                  v-model="inviteIdentifier"
                  type="text"
                  :placeholder="t('coaching.invitePlaceholder')"
                  class="input-primary flex-1 text-sm"
                />
                <button
                  type="submit"
                  :disabled="!inviteIdentifier.trim() || inviting"
                  class="btn-glass !px-4 !py-2 !rounded-xl font-semibold disabled:opacity-50"
                >
                  <Icon v-if="inviting" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
                  <Icon v-else name="lucide:send" class="w-4 h-4" />
                </button>
              </form>
            </div>

            <!-- Client list -->
            <div class="slide-up">
              <div class="flex items-center justify-between gap-3 mb-3 flex-wrap">
                <h2 class="text-lg font-bold text-primary-900 dark:text-primary-100">
                  {{ t('coaching.myClients') }}
                  <span class="text-primary-400 font-normal text-sm">({{ clients.length }})</span>
                </h2>
                <div v-if="clients.length > 3" class="relative">
                  <Icon
                    name="lucide:search"
                    class="w-4 h-4 text-primary-400 absolute left-3 top-1/2 -translate-y-1/2"
                  />
                  <input
                    v-model="search"
                    type="text"
                    :placeholder="t('coach.clients.search')"
                    class="input-primary !pl-9 text-sm !py-2 w-full sm:w-56"
                  />
                </div>
              </div>

              <div v-if="clientsLoading" class="text-center py-10">
                <div
                  class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-300 dark:border-primary-600 border-t-sand-500"
                ></div>
              </div>

              <div v-else-if="clients.length === 0" class="card-glass !p-8 text-center">
                <Icon
                  name="lucide:users"
                  class="w-10 h-10 mx-auto mb-2 text-primary-300 dark:text-primary-600"
                />
                <p class="text-sm text-primary-500 dark:text-primary-400">
                  {{ t('coaching.noClients') }}
                </p>
              </div>

              <div v-else-if="filteredClients.length === 0" class="card-glass !p-8 text-center">
                <p class="text-sm text-primary-500 dark:text-primary-400">
                  {{ t('coach.clients.noResults') }}
                </p>
              </div>

              <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-2">
                <NuxtLink
                  v-for="client in filteredClients"
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
          </template>
        </div>
      </div>
    </div>

    <CoachMobileNav active="/coaching/clients" />
  </div>
</template>

<script setup lang="ts">
import {
  useCoachingApi,
  type CoachStatus,
  type CoachClientSummary,
} from '~/composables/useCoachingApi';

const { t } = useLocale();

definePageMeta({
  layout: false,
  middleware: 'auth',
});

useHead({ meta: [{ name: 'robots', content: 'noindex, nofollow' }] });

const toast = useToast();
const { getCoachStatus, getClients, inviteClient } = useCoachingApi();

const loading = ref(true);
const clientsLoading = ref(false);
const inviting = ref(false);
const inviteIdentifier = ref('');
const search = ref('');
const status = ref<CoachStatus | null>(null);
const clients = ref<CoachClientSummary[]>([]);

const filteredClients = computed(() => {
  if (!search.value.trim()) return clients.value;
  const q = search.value.trim().toLowerCase();
  return clients.value.filter((c) => {
    const name =
      `${c.athlete.firstName || ''} ${c.athlete.lastName || ''} ${c.athlete.username || ''}`.toLowerCase();
    return name.includes(q);
  });
});

async function loadAll() {
  loading.value = true;
  try {
    status.value = await getCoachStatus();
    if (!status.value.isCoach) {
      await navigateTo('/coaching');
      return;
    }
    await loadClients();
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

async function handleInvite() {
  if (!inviteIdentifier.value.trim()) return;
  inviting.value = true;
  try {
    await inviteClient(inviteIdentifier.value.trim());
    toast.success(t('coaching.toastInviteSent'));
    inviteIdentifier.value = '';
  } catch (e: any) {
    toast.error(t('common.error'), e?.data?.error || t('coaching.errorInvite'));
  } finally {
    inviting.value = false;
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

onMounted(loadAll);
</script>
