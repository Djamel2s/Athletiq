<template>
  <div class="min-h-screen">
    <div class="pb-28 lg:pb-20 max-w-7xl mx-auto">
      <div class="flex px-4 md:px-4 pt-4">
        <CoachSidebar active="/coaching/programs" />

        <div class="flex-1 min-w-0 px-4 md:px-0 space-y-6">
          <div class="fade-in">
            <h1
              class="text-3xl md:text-4xl font-bold text-display text-primary-900 dark:text-primary-100 mb-1"
            >
              {{ t('coach.nav.programs') }}
            </h1>
            <p class="text-primary-600 dark:text-primary-400">{{ t('coach.programs.subtitle') }}</p>
          </div>

          <div v-if="loading" class="text-center py-20">
            <div
              class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-300 dark:border-primary-600 border-t-sand-500"
            ></div>
          </div>

          <div v-else-if="clients.length === 0" class="card-glass !p-8 text-center slide-up">
            <Icon
              name="lucide:users"
              class="w-10 h-10 mx-auto mb-2 text-primary-300 dark:text-primary-600"
            />
            <p class="text-sm text-primary-500 dark:text-primary-400 mb-3">
              {{ t('coach.programs.needClient') }}
            </p>
            <NuxtLink to="/coaching/clients" class="btn-outline text-sm inline-block">
              {{ t('coach.dashboard.inviteFirst') }}
            </NuxtLink>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4 slide-up">
            <div v-for="program in programs" :key="program.slug" class="card-glass !p-5">
              <div class="flex items-start justify-between gap-2 mb-2">
                <h3 class="text-lg font-bold text-primary-900 dark:text-primary-100">
                  {{ program.name }}
                </h3>
                <span
                  class="text-xs font-semibold px-2 py-1 rounded-full bg-sand-500/15 text-sand-700 dark:text-sand-400 flex-shrink-0"
                >
                  {{ program.daysPerWeek }}j/sem
                </span>
              </div>
              <p class="text-sm text-primary-500 dark:text-primary-400 mb-4 line-clamp-2">
                {{ program.description }}
              </p>

              <div v-if="assigningSlug === program.slug" class="flex gap-2">
                <select v-model="selectedClientId" class="input-primary flex-1 text-sm !py-2">
                  <option :value="null" disabled>{{ t('coach.programs.pickClient') }}</option>
                  <option v-for="c in clients" :key="c.athlete.id" :value="c.athlete.id">
                    {{ c.athlete.firstName }} {{ c.athlete.lastName }}
                  </option>
                </select>
                <button
                  @click="confirmAssign(program.slug)"
                  :disabled="!selectedClientId || assignLoading"
                  class="btn-primary !px-4 !py-2 text-sm disabled:opacity-50 flex-shrink-0"
                >
                  <Icon v-if="assignLoading" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
                  <Icon v-else name="lucide:check" class="w-4 h-4" />
                </button>
                <button
                  @click="assigningSlug = null"
                  class="btn-glass !px-3 !py-2 text-sm flex-shrink-0"
                >
                  <Icon name="lucide:x" class="w-4 h-4" />
                </button>
              </div>
              <button v-else @click="startAssign(program.slug)" class="btn-outline w-full text-sm">
                {{ t('coach.programs.assign') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <CoachMobileNav active="/coaching/programs" />
  </div>
</template>

<script setup lang="ts">
import { useCoachingApi, type CoachClientSummary } from '~/composables/useCoachingApi';
import { useProgramApi, type WorkoutProgram } from '~/composables/useProgramApi';

const { t } = useLocale();

definePageMeta({
  layout: false,
  middleware: 'auth',
});

useHead({ meta: [{ name: 'robots', content: 'noindex, nofollow' }] });

const toast = useToast();
const { getClients, assignProgram } = useCoachingApi();
const { getPrograms } = useProgramApi();

const loading = ref(true);
const clients = ref<CoachClientSummary[]>([]);
const programs = ref<WorkoutProgram[]>([]);

const assigningSlug = ref<string | null>(null);
const selectedClientId = ref<number | null>(null);
const assignLoading = ref(false);

function startAssign(slug: string) {
  assigningSlug.value = slug;
  selectedClientId.value = null;
}

async function confirmAssign(slug: string) {
  if (!selectedClientId.value) return;
  assignLoading.value = true;
  try {
    await assignProgram(selectedClientId.value, slug);
    toast.success(t('coach.programs.assigned'));
    assigningSlug.value = null;
    selectedClientId.value = null;
  } catch (e: any) {
    toast.error(t('common.error'), e?.data?.error || t('coach.programs.assignError'));
  } finally {
    assignLoading.value = false;
  }
}

onMounted(async () => {
  loading.value = true;
  try {
    const [clientsRes, programsRes] = await Promise.all([getClients(), getPrograms()]);
    clients.value = clientsRes.clients;
    programs.value = programsRes;
  } catch {
    toast.error(t('common.error'), t('coaching.errorLoad'));
  } finally {
    loading.value = false;
  }
});
</script>
