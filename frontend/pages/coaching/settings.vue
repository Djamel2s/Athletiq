<template>
  <div class="min-h-screen">
    <div class="pb-28 lg:pb-20 max-w-7xl mx-auto">
      <div class="flex px-4 md:px-4 pt-4">
        <CoachSidebar active="/coaching/settings" />

        <div class="flex-1 min-w-0 px-4 md:px-0 space-y-6 max-w-xl">
          <div class="fade-in">
            <h1
              class="text-3xl md:text-4xl font-bold text-display text-primary-900 dark:text-primary-100 mb-1"
            >
              {{ t('coach.nav.settings') }}
            </h1>
          </div>

          <div v-if="loading" class="text-center py-20">
            <div
              class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-300 dark:border-primary-600 border-t-sand-500"
            ></div>
          </div>

          <template v-else>
            <!-- Bio publique -->
            <div class="card-glass !p-5 slide-up">
              <h2 class="text-sm font-semibold text-primary-900 dark:text-primary-100 mb-1">
                {{ t('coach.settings.bio') }}
              </h2>
              <p class="text-xs text-primary-400 dark:text-primary-500 mb-3">
                {{ t('coach.settings.bioHint') }}
              </p>
              <textarea
                v-model="bio"
                rows="4"
                maxlength="1000"
                class="input-primary w-full text-sm resize-none"
                :placeholder="t('coach.settings.bioPlaceholder')"
              ></textarea>
              <div class="flex items-center justify-between mt-3">
                <span class="text-xs text-primary-400">{{ bio.length }}/1000</span>
                <button
                  @click="saveBio"
                  :disabled="savingBio"
                  class="btn-primary !px-5 !py-2 text-sm disabled:opacity-50"
                >
                  {{ savingBio ? t('common.saving') : t('common.save') }}
                </button>
              </div>
            </div>

            <!-- Code coach -->
            <div class="card-glass !p-5 slide-up">
              <h2 class="text-sm font-semibold text-primary-900 dark:text-primary-100 mb-3">
                {{ t('coaching.yourCode') }}
              </h2>
              <div class="flex items-center gap-3">
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
            </div>

            <!-- Plan -->
            <div class="card-glass !p-5 slide-up">
              <h2 class="text-sm font-semibold text-primary-900 dark:text-primary-100 mb-3">
                {{ t('coach.settings.plan') }}
              </h2>
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-primary-900 dark:text-primary-100 font-bold">
                    {{
                      status?.maxClients === null
                        ? t('coaching.planProUnlimited')
                        : t('coaching.planFree')
                    }}
                  </p>
                  <p class="text-xs text-primary-500 dark:text-primary-400">
                    {{
                      t('coaching.clientCount', {
                        count: status?.clientCount ?? 0,
                        plural: (status?.clientCount ?? 0) > 1 ? 's' : '',
                      })
                    }}
                    <span v-if="status?.maxClients !== null"> / {{ status?.maxClients }}</span>
                  </p>
                </div>
                <NuxtLink
                  v-if="status?.maxClients !== null"
                  to="/subscription"
                  class="btn-outline text-sm"
                >
                  {{ t('coaching.goPro') }}
                </NuxtLink>
              </div>
              <p
                v-if="status?.maxClients !== null"
                class="text-xs text-primary-400 dark:text-primary-500 mt-3"
              >
                {{ t('coach.settings.proNote') }}
              </p>
            </div>
          </template>
        </div>
      </div>
    </div>

    <CoachMobileNav active="/coaching/settings" />
  </div>
</template>

<script setup lang="ts">
import { useCoachingApi, type CoachStatus } from '~/composables/useCoachingApi';

const { t } = useLocale();

definePageMeta({
  layout: false,
  middleware: 'auth',
});

useHead({ meta: [{ name: 'robots', content: 'noindex, nofollow' }] });

const toast = useToast();
const { getCoachStatus, updateCoachProfile } = useCoachingApi();

const loading = ref(true);
const savingBio = ref(false);
const bio = ref('');
const status = ref<CoachStatus | null>(null);

async function saveBio() {
  savingBio.value = true;
  try {
    await updateCoachProfile({ coachBio: bio.value });
    toast.success(t('common.saved'));
  } catch {
    toast.error(t('common.error'));
  } finally {
    savingBio.value = false;
  }
}

function copyCode() {
  if (!status.value?.coachInviteCode) return;
  navigator.clipboard.writeText(status.value.coachInviteCode);
  toast.success(t('coaching.toastCodeCopied'));
}

onMounted(async () => {
  loading.value = true;
  try {
    status.value = await getCoachStatus();
    bio.value = status.value.coachBio || '';
  } catch {
    toast.error(t('common.error'), t('coaching.errorLoad'));
  } finally {
    loading.value = false;
  }
});
</script>
