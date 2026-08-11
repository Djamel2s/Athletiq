<template>
  <div class="min-h-screen geometric-bg">
    <div class="px-4 md:px-6 pb-28 lg:pb-20 max-w-lg mx-auto">
      <div class="flex items-center gap-3 mb-6 fade-in">
        <NuxtLink
          to="/coaching"
          class="btn-glass w-8 h-8 !rounded-lg !p-0 flex items-center justify-center"
        >
          <Icon name="lucide:arrow-left" class="w-5 h-5 text-primary-600 dark:text-primary-400" />
        </NuxtLink>
        <h1 class="text-xl font-bold text-primary-900 dark:text-primary-100">
          {{ overview?.athlete?.firstName || t('coaching.client') }}
          {{ overview?.athlete?.lastName || '' }}
        </h1>
      </div>

      <div v-if="loading" class="text-center py-20">
        <div
          class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-300 dark:border-primary-600 border-t-primary-600 dark:border-t-primary-400"
        ></div>
      </div>

      <template v-else-if="overview">
        <!-- Stats summary -->
        <div class="card-glass !p-4 mb-6 slide-up flex items-center justify-around text-center">
          <div>
            <p class="text-2xl font-bold text-primary-900 dark:text-primary-100">
              {{ overview.totalWorkouts ?? '—' }}
            </p>
            <p class="text-xs text-primary-500 dark:text-primary-400">
              {{ t('streak.totalSessions').toLowerCase() }}
            </p>
          </div>
          <div>
            <p class="text-2xl font-bold text-primary-900 dark:text-primary-100">
              {{ overview.assignedPrograms?.length ?? 0 }}
            </p>
            <p class="text-xs text-primary-500 dark:text-primary-400">
              {{ t('coaching.assignedPrograms') }}
            </p>
          </div>
        </div>

        <!-- Permission notice -->
        <div
          v-if="!overview.permissions.canViewWorkouts"
          class="card-glass !p-4 mb-6 text-xs text-primary-500 dark:text-primary-400 flex items-center gap-2"
        >
          <Icon name="lucide:lock" class="w-4 h-4 flex-shrink-0" />
          {{ t('coaching.noWorkoutAccess') }}
        </div>

        <!-- Assign program -->
        <div class="card-glass !p-4 mb-6 slide-up">
          <h2 class="text-sm font-semibold text-primary-900 dark:text-primary-100 mb-3">
            {{ t('coaching.assignProgram') }}
          </h2>
          <div v-if="!overview.permissions.canAssignPrograms" class="text-xs text-primary-400">
            {{ t('coaching.noAssignAccess') }}
          </div>
          <div v-else class="flex gap-2">
            <select v-model="selectedProgramSlug" class="input-primary flex-1 text-sm">
              <option value="" disabled>{{ t('coaching.chooseProgram') }}</option>
              <option v-for="p in programs" :key="p.slug" :value="p.slug">
                {{ p.name }} ({{ p.daysPerWeek }}j/sem)
              </option>
            </select>
            <button
              @click="handleAssign"
              :disabled="!selectedProgramSlug || assigning"
              class="btn-primary !px-4 !py-2 text-sm font-semibold disabled:opacity-50"
            >
              <Icon v-if="assigning" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
              <span v-else>{{ t('coaching.assign') }}</span>
            </button>
          </div>
        </div>

        <!-- Recent workouts -->
        <div v-if="overview.permissions.canViewWorkouts" class="mb-6">
          <h2 class="text-sm font-semibold text-primary-900 dark:text-primary-100 mb-3">
            {{ t('coaching.recentSessions') }}
          </h2>
          <div
            v-if="!overview.recentWorkouts?.length"
            class="card-glass !p-4 text-center text-xs text-primary-400"
          >
            {{ t('coaching.noSessionLogged') }}
          </div>
          <div v-else class="space-y-2">
            <div
              v-for="w in overview.recentWorkouts"
              :key="w.id"
              class="p-3 rounded-xl bg-white/40 dark:bg-primary-800/40"
            >
              <div class="flex items-center justify-between">
                <p class="text-sm font-semibold text-primary-900 dark:text-primary-100">
                  {{ w.name }}
                </p>
                <p class="text-xs text-primary-400">{{ formatDate(w.completedAt || w.date) }}</p>
              </div>
              <p class="text-xs text-primary-500 dark:text-primary-400 mt-0.5">
                {{
                  t('shared.exerciseCount', {
                    count: w.exercises?.length || 0,
                    plural: (w.exercises?.length || 0) > 1 ? 's' : '',
                  })
                }}
              </p>
            </div>
          </div>
        </div>

        <!-- Notes -->
        <div class="mb-6">
          <h2 class="text-sm font-semibold text-primary-900 dark:text-primary-100 mb-3">
            {{ t('coaching.privateNotes') }}
          </h2>
          <form @submit.prevent="handleAddNote" class="flex gap-2 mb-3">
            <input
              v-model="noteContent"
              type="text"
              :placeholder="t('coaching.addNotePlaceholder')"
              class="input-primary flex-1 text-sm"
            />
            <button
              type="submit"
              :disabled="!noteContent.trim() || addingNote"
              class="btn-glass !px-4 !py-2 !rounded-xl font-semibold disabled:opacity-50"
            >
              <Icon v-if="addingNote" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
              <Icon v-else name="lucide:plus" class="w-4 h-4" />
            </button>
          </form>
          <div v-if="notes.length" class="space-y-2">
            <div
              v-for="note in notes"
              :key="note.id"
              class="p-3 rounded-xl bg-white/40 dark:bg-primary-800/40 text-sm text-primary-800 dark:text-primary-200"
            >
              {{ note.content }}
              <p class="text-xs text-primary-400 mt-1">{{ formatDate(note.createdAt) }}</p>
            </div>
          </div>
        </div>
      </template>
    </div>

    <MobileBottomNav active-path="/coaching" />
  </div>
</template>

<script setup lang="ts">
import { useCoachingApi } from '~/composables/useCoachingApi';
import { useProgramApi } from '~/composables/useProgramApi';

const { t } = useLocale();

definePageMeta({
  layout: false,
  middleware: 'auth',
});

useHead({ meta: [{ name: 'robots', content: 'noindex, nofollow' }] });

const route = useRoute();
const toast = useToast();
const { getClientOverview, assignProgram, addNote, getClientNotes } = useCoachingApi();
const { getPrograms } = useProgramApi();

const athleteId = Number(route.params.id);

const loading = ref(true);
const overview = ref<any>(null);
const programs = ref<any[]>([]);
const selectedProgramSlug = ref('');
const assigning = ref(false);
const noteContent = ref('');
const addingNote = ref(false);
const notes = ref<any[]>([]);

async function load() {
  loading.value = true;
  try {
    const [ov, progs, notesRes] = await Promise.all([
      getClientOverview(athleteId),
      getPrograms().catch(() => []),
      getClientNotes(athleteId).catch(() => ({ notes: [] })),
    ]);
    overview.value = ov;
    programs.value = progs;
    notes.value = notesRes.notes;
  } catch (e: any) {
    toast.error(t('common.error'), e?.data?.error || t('coaching.errorLoadClient'));
  } finally {
    loading.value = false;
  }
}

async function handleAssign() {
  if (!selectedProgramSlug.value) return;
  assigning.value = true;
  try {
    await assignProgram(athleteId, selectedProgramSlug.value);
    toast.success(t('coaching.toastAssigned'), t('coaching.toastAssignedDesc'));
    selectedProgramSlug.value = '';
    await load();
  } catch (e: any) {
    toast.error(t('common.error'), e?.data?.error || t('coaching.errorAssign'));
  } finally {
    assigning.value = false;
  }
}

async function handleAddNote() {
  if (!noteContent.value.trim()) return;
  addingNote.value = true;
  try {
    await addNote(athleteId, noteContent.value.trim());
    noteContent.value = '';
    const res = await getClientNotes(athleteId);
    notes.value = res.notes;
  } catch (e: any) {
    toast.error(t('common.error'), e?.data?.error || t('coaching.errorAddNote'));
  } finally {
    addingNote.value = false;
  }
}

function formatDate(date: string) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

onMounted(load);
</script>
