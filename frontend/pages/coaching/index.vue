<template>
  <div class="min-h-screen geometric-bg">
    <div class="px-4 md:px-6 pb-28 lg:pb-20 max-w-lg mx-auto">
      <!-- Header -->
      <div class="mb-6 fade-in">
        <div class="flex items-center gap-3 mb-1">
          <NuxtLink
            to="/dashboard"
            class="btn-glass w-8 h-8 !rounded-lg !p-0 flex items-center justify-center"
          >
            <Icon name="lucide:arrow-left" class="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </NuxtLink>
          <h1
            class="text-2xl md:text-3xl font-bold bg-gradient-to-r from-sand-500 to-primary-900 dark:to-primary-100 bg-clip-text text-transparent"
          >
            {{ t('coaching.title') }}
          </h1>
        </div>
        <p class="text-sm text-primary-500 dark:text-primary-400 ml-11">
          {{ t('coaching.subtitle') }}
        </p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-20 fade-in">
        <div
          class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-300 dark:border-primary-600 border-t-primary-600 dark:border-t-primary-400"
        ></div>
      </div>

      <!-- Not a coach yet: onboarding CTA -->
      <div v-else-if="!status?.isCoach" class="card-glass !p-6 text-center slide-up">
        <Icon name="lucide:whistle" class="w-12 h-12 mx-auto mb-3 text-sand-500" />
        <h2 class="text-lg font-bold text-primary-900 dark:text-primary-100 mb-2">
          {{ t('coaching.notCoachTitle') }}
        </h2>
        <p class="text-sm text-primary-500 dark:text-primary-400 mb-5">
          {{ t('coaching.notCoachDesc') }}
        </p>
        <button
          @click="handleBecomeCoach"
          :disabled="activating"
          class="btn-primary px-6 py-2.5 text-sm font-semibold disabled:opacity-50"
        >
          <Icon v-if="activating" name="lucide:loader-2" class="w-4 h-4 animate-spin inline mr-1" />
          {{ t('coaching.activate') }}
        </button>
      </div>

      <!-- Coach dashboard -->
      <template v-else>
        <!-- Invite code card -->
        <div class="card-glass !p-4 mb-6 slide-up">
          <h2 class="text-sm font-semibold text-primary-900 dark:text-primary-100 mb-3">
            {{ t('coaching.yourCode') }}
          </h2>
          <div class="flex items-center gap-3 mb-3">
            <div
              class="flex-1 text-center py-3 rounded-xl bg-white/40 dark:bg-primary-800/40 tracking-[0.3em] text-xl font-bold text-primary-900 dark:text-primary-100"
            >
              {{ status.coachInviteCode }}
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
                  count: status.clientCount,
                  plural: status.clientCount > 1 ? 's' : '',
                })
              }}
              <span v-if="status.maxClients !== null">
                / {{ status.maxClients }} ({{ t('coaching.planFree') }})</span
              >
              <span v-else> · {{ t('coaching.planProUnlimited') }}</span>
            </span>
            <NuxtLink
              v-if="status.maxClients !== null"
              to="/subscription"
              class="text-sand-600 dark:text-sand-400 font-semibold"
            >
              {{ t('coaching.goPro') }} →
            </NuxtLink>
          </div>
        </div>

        <!-- Invite by email/username -->
        <div class="card-glass !p-4 mb-6 slide-up">
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
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-sm font-semibold text-primary-900 dark:text-primary-100">
            {{ t('coaching.myClients') }}
          </h2>
        </div>

        <div v-if="clientsLoading" class="text-center py-10">
          <div
            class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-300 dark:border-primary-600 border-t-primary-600 dark:border-t-primary-400"
          ></div>
        </div>

        <div v-else-if="clients.length === 0" class="card-glass !p-6 text-center">
          <Icon
            name="lucide:users"
            class="w-10 h-10 mx-auto mb-2 text-primary-300 dark:text-primary-600"
          />
          <p class="text-sm text-primary-500 dark:text-primary-400">
            {{ t('coaching.noClients') }}
          </p>
        </div>

        <div v-else class="space-y-2">
          <NuxtLink
            v-for="client in clients"
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
              <p class="text-sm font-semibold text-primary-900 dark:text-primary-100 truncate">
                {{ client.athlete.firstName }} {{ client.athlete.lastName }}
              </p>
              <p class="text-xs" :class="inactivityClass(client.lastWorkoutAt)">
                {{ formatLastWorkout(client.lastWorkoutAt) }}
              </p>
            </div>
            <Icon name="lucide:chevron-right" class="w-4 h-4 text-primary-400 flex-shrink-0" />
          </NuxtLink>
        </div>
      </template>
    </div>

    <MobileBottomNav active-path="/coaching" />
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
const { getCoachStatus, becomeCoach, getClients, inviteClient } = useCoachingApi();

const loading = ref(true);
const activating = ref(false);
const clientsLoading = ref(false);
const inviting = ref(false);
const inviteIdentifier = ref('');
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

onMounted(loadStatus);
</script>
