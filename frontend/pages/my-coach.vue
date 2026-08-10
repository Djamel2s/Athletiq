<template>
  <div class="min-h-screen geometric-bg">
    <div class="px-4 md:px-6 pb-28 lg:pb-20 max-w-lg mx-auto">
      <div class="flex items-center gap-3 mb-6 fade-in">
        <NuxtLink
          to="/settings"
          class="btn-glass w-8 h-8 !rounded-lg !p-0 flex items-center justify-center"
        >
          <Icon name="lucide:arrow-left" class="w-5 h-5 text-primary-600 dark:text-primary-400" />
        </NuxtLink>
        <h1 class="text-2xl font-bold text-primary-900 dark:text-primary-100">Mon coach</h1>
      </div>

      <!-- Join by code -->
      <div class="card-glass !p-4 mb-6 slide-up">
        <h2 class="text-sm font-semibold text-primary-900 dark:text-primary-100 mb-3">
          Rejoindre un coach
        </h2>
        <form @submit.prevent="handleJoin" class="flex gap-2">
          <input
            v-model="joinCode"
            type="text"
            placeholder="Code de votre coach"
            class="input-primary flex-1 text-sm uppercase tracking-widest"
            maxlength="10"
          />
          <button
            type="submit"
            :disabled="!joinCode.trim() || joining"
            class="btn-primary !px-4 !py-2 text-sm font-semibold disabled:opacity-50"
          >
            <Icon v-if="joining" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
            <span v-else>Rejoindre</span>
          </button>
        </form>
        <p class="text-xs text-primary-400 dark:text-primary-500 mt-2">
          Votre coach vous a communiqué un code à 7 caractères — souvent affiché en salle.
        </p>
      </div>

      <div v-if="loading" class="text-center py-10">
        <div
          class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-300 dark:border-primary-600 border-t-primary-600 dark:border-t-primary-400"
        ></div>
      </div>

      <template v-else>
        <!-- Pending invites -->
        <div v-if="pendingInvites.length" class="mb-6">
          <h2 class="text-sm font-semibold text-primary-900 dark:text-primary-100 mb-3">
            Invitations reçues
          </h2>
          <div
            v-for="invite in pendingInvites"
            :key="invite.linkId"
            class="card-glass !p-4 mb-2 flex items-center gap-3"
          >
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-primary-900 dark:text-primary-100 truncate">
                {{ invite.coach.firstName }} {{ invite.coach.lastName }}
              </p>
              <p class="text-xs text-primary-400 dark:text-primary-500">
                souhaite vous suivre comme coach
              </p>
            </div>
            <button
              @click="handleAccept(invite.linkId)"
              class="btn-glass !px-3 !py-1.5 text-xs font-semibold !rounded-lg"
            >
              Accepter
            </button>
            <button
              @click="handleDecline(invite.linkId)"
              class="text-xs text-primary-400 dark:text-primary-500 px-2"
            >
              Refuser
            </button>
          </div>
        </div>

        <!-- Active coaches -->
        <h2 class="text-sm font-semibold text-primary-900 dark:text-primary-100 mb-3">
          Mes coachs
        </h2>
        <div v-if="coaches.length === 0" class="card-glass !p-6 text-center text-sm text-primary-500 dark:text-primary-400">
          Vous n'avez pas encore de coach relié à votre compte.
        </div>

        <div v-for="entry in coaches" :key="entry.linkId" class="card-glass !p-4 mb-3">
          <div class="flex items-center gap-3 mb-3">
            <div
              class="w-11 h-11 rounded-full overflow-hidden flex-shrink-0"
              :class="entry.coach.avatarUrl ? '' : 'bg-gradient-primary flex items-center justify-center'"
            >
              <img
                v-if="entry.coach.avatarUrl"
                :src="entry.coach.avatarUrl"
                alt=""
                class="w-full h-full object-cover"
              />
              <span v-else class="text-white text-sm font-bold">
                {{ (entry.coach.firstName?.charAt(0) || '?').toUpperCase() }}
              </span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-primary-900 dark:text-primary-100 truncate">
                {{ entry.coach.firstName }} {{ entry.coach.lastName }}
              </p>
              <p v-if="entry.coach.coachBio" class="text-xs text-primary-400 dark:text-primary-500 truncate">
                {{ entry.coach.coachBio }}
              </p>
            </div>
          </div>

          <!-- Permissions -->
          <div class="space-y-2 mb-3">
            <label
              v-for="perm in permissionFields"
              :key="perm.key"
              class="flex items-center justify-between text-xs text-primary-600 dark:text-primary-400"
            >
              {{ perm.label }}
              <input
                type="checkbox"
                :checked="entry.permissions[perm.key]"
                @change="handlePermChange(entry, perm.key, $event)"
                class="w-4 h-4 accent-sand-500"
              />
            </label>
          </div>

          <button
            @click="handleRevoke(entry.linkId)"
            class="w-full text-center text-xs text-red-500 py-1.5"
          >
            Retirer l'accès de ce coach
          </button>
        </div>
      </template>
    </div>

    <MobileBottomNav active-path="/my-coach" />
  </div>
</template>

<script setup lang="ts">
import { useCoachingApi, type MyCoachEntry, type CoachLinkPermissions } from '~/composables/useCoachingApi';

definePageMeta({
  layout: false,
  middleware: 'auth',
});

useHead({ meta: [{ name: 'robots', content: 'noindex, nofollow' }] });

const toast = useToast();
const { getMyCoaches, joinByCode, acceptInvite, declineInvite, updatePermissions, revokeLink } =
  useCoachingApi();

const loading = ref(true);
const joining = ref(false);
const joinCode = ref('');
const coaches = ref<MyCoachEntry[]>([]);
const pendingInvites = ref<MyCoachEntry[]>([]);

const permissionFields: { key: keyof CoachLinkPermissions; label: string }[] = [
  { key: 'canViewWorkouts', label: 'Voir mes séances' },
  { key: 'canViewBodyStats', label: 'Voir mon poids' },
  { key: 'canViewMeasurements', label: 'Voir mes mensurations' },
  { key: 'canViewPhotos', label: 'Voir mes photos de progression' },
  { key: 'canAssignPrograms', label: "M'assigner des programmes" },
];

async function load() {
  loading.value = true;
  try {
    const res = await getMyCoaches();
    coaches.value = res.coaches;
    pendingInvites.value = res.pendingInvites;
  } catch {
    toast.error('Erreur', 'Impossible de charger vos coachs');
  } finally {
    loading.value = false;
  }
}

async function handleJoin() {
  if (!joinCode.value.trim()) return;
  joining.value = true;
  try {
    await joinByCode(joinCode.value.trim());
    toast.success('Coach ajouté', 'Vous pouvez ajuster ce qu\'il voit ci-dessous');
    joinCode.value = '';
    await load();
  } catch (e: any) {
    toast.error('Erreur', e?.data?.error || 'Code invalide');
  } finally {
    joining.value = false;
  }
}

async function handleAccept(linkId: number) {
  try {
    await acceptInvite(linkId);
    toast.success('Invitation acceptée');
    await load();
  } catch (e: any) {
    toast.error('Erreur', e?.data?.error || "Impossible d'accepter");
  }
}

async function handleDecline(linkId: number) {
  try {
    await declineInvite(linkId);
    toast.info('Invitation refusée');
    await load();
  } catch {
    toast.error('Erreur', 'Impossible de refuser');
  }
}

async function handlePermChange(entry: MyCoachEntry, key: keyof CoachLinkPermissions, event: Event) {
  const checked = (event.target as HTMLInputElement).checked;
  entry.permissions[key] = checked;
  try {
    await updatePermissions(entry.linkId, { [key]: checked });
  } catch {
    entry.permissions[key] = !checked;
    toast.error('Erreur', 'Impossible de mettre à jour cette permission');
  }
}

async function handleRevoke(linkId: number) {
  try {
    await revokeLink(linkId);
    toast.info('Accès retiré');
    await load();
  } catch {
    toast.error('Erreur', "Impossible de retirer l'accès");
  }
}

onMounted(load);
</script>
