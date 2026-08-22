<template>
  <div class="min-h-screen geometric-bg">
    <!-- TopNav is rendered globally in app.vue -->

    <div class="px-4 md:px-6 pb-28 lg:pb-20 max-w-lg mx-auto">
      <!-- Loading -->
      <div v-if="loading" class="text-center py-20 fade-in">
        <div
          class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-300 dark:border-primary-600 border-t-primary-600 dark:border-t-primary-400"
        ></div>
        <p class="mt-4 text-primary-500 dark:text-primary-400">
          {{ t('profilePage.loadingProfile') }}
        </p>
      </div>

      <!-- Not found -->
      <div v-else-if="notFound" class="text-center py-20 fade-in">
        <Icon
          name="lucide:user-x"
          class="w-16 h-16 mx-auto mb-4 text-primary-300 dark:text-primary-600"
        />
        <h2 class="text-xl font-bold text-primary-900 dark:text-primary-100 mb-2">
          Utilisateur introuvable
        </h2>
        <p class="text-primary-500 dark:text-primary-400 text-sm mb-6">
          {{ t('profilePage.notFound') }}
        </p>
        <NuxtLink to="/feed" class="btn-primary px-6 py-2.5 text-sm font-medium">{{
          t('profilePage.backToFeed')
        }}</NuxtLink>
      </div>

      <!-- Profile content -->
      <template v-else-if="profile">
        <!-- Cover area with avatar -->
        <div class="text-center mb-6 fade-in">
          <div class="relative inline-block mb-4">
            <div class="w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-sand-500/30 mx-auto">
              <div
                class="w-full h-full flex items-center justify-center"
                :class="profile.avatarUrl ? '' : 'bg-gradient-primary'"
              >
                <img
                  v-if="profile.avatarUrl"
                  :src="profile.avatarUrl"
                  alt="Avatar"
                  class="w-full h-full object-cover"
                />
                <span v-else class="text-white text-3xl font-bold">{{ profileInitials }}</span>
              </div>
            </div>
            <!-- Gym Bro badge -->
            <div
              v-if="profile.isFriend"
              class="absolute -bottom-1 -right-1 bg-gradient-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md"
            >
              Gym Bro
            </div>
          </div>

          <!-- Name & Username -->
          <div class="flex flex-col items-center gap-2">
            <h1 class="text-2xl font-bold text-primary-900 dark:text-primary-100">
              {{ profile.firstName }} {{ profile.lastName }}
            </h1>
            <div class="flex items-center gap-2 flex-wrap justify-center">
              <p class="text-sm text-primary-500 dark:text-primary-400">@{{ profile.username }}</p>
              <span
                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold tracking-wide uppercase"
                :class="
                  profile.isPublic === false
                    ? 'border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-300'
                    : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                "
              >
                <Icon
                  :name="profile.isPublic === false ? 'lucide:lock' : 'lucide:globe'"
                  class="w-3.5 h-3.5"
                />
                {{ profile.isPublic === false ? 'Privé' : 'Public' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-center gap-3 mb-6 slide-up">
          <!-- Already friends -->
          <div v-if="profile.isFriend" class="flex items-center gap-2">
            <span
              class="btn-glass px-5 py-2.5 text-sm font-medium inline-flex items-center gap-2 cursor-default"
            >
              <Icon name="lucide:check-circle" class="w-4 h-4 text-green-500" />
              Gym Bro
            </span>
            <button
              @click="handleRemoveFriend"
              :disabled="actionLoading"
              class="btn-glass px-4 py-2.5 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <Icon name="lucide:user-minus" class="w-4 h-4" />
            </button>
          </div>

          <!-- Request pending -->
          <span
            v-else-if="profile.requestPending"
            class="btn-glass px-5 py-2.5 text-sm font-medium inline-flex items-center gap-2 cursor-default opacity-70"
          >
            <Icon name="lucide:clock" class="w-4 h-4" />
            Demande envoyee
          </span>

          <!-- Add friend -->
          <button
            v-else
            @click="handleSendRequest"
            :disabled="actionLoading"
            class="btn-primary px-6 py-2.5 text-sm font-semibold inline-flex items-center gap-2 disabled:opacity-60"
          >
            <Icon name="lucide:user-plus" class="w-4 h-4" />
            Ajouter comme Gym Bro
          </button>

          <!-- Block -->
          <button
            @click="handleBlock"
            :disabled="actionLoading"
            class="btn-glass px-4 py-2.5 text-sm text-primary-400 hover:text-red-500"
            :title="t('profilePage.block')"
          >
            <Icon name="lucide:shield-off" class="w-4 h-4" />
          </button>
        </div>

        <!-- Private profile message -->
        <div v-if="!profile.isPublic && !profile.isFriend" class="text-center py-16 slide-up">
          <div
            class="w-20 h-20 mx-auto mb-5 rounded-3xl bg-primary-100 dark:bg-primary-800/50 flex items-center justify-center"
          >
            <Icon name="lucide:lock" class="w-10 h-10 text-primary-400 dark:text-primary-500" />
          </div>
          <h3 class="text-lg font-bold text-primary-900 dark:text-primary-100 mb-2">
            Profil prive
          </h3>
          <p class="text-sm text-primary-500 dark:text-primary-400 max-w-xs mx-auto">
            Ajoutez cet utilisateur en Gym Bro pour voir son profil complet, ses photos et ses
            posts.
          </p>
        </div>

        <!-- Public / Friends content -->
        <template v-if="profile.isPublic || profile.isFriend">
          <!-- Stats Row -->
          <div class="flex justify-center gap-8 mb-6 slide-up">
            <button
              type="button"
              @click="showWorkoutsModal = true"
              class="text-center transition-opacity hover:opacity-70"
            >
              <div class="flex items-center justify-center gap-1.5">
                <span class="text-lg font-bold text-primary-900 dark:text-primary-100">{{
                  profile.stats?.workoutCount ?? 0
                }}</span>
                <Icon
                  name="lucide:dumbbell"
                  class="w-4 h-4 text-primary-400 dark:text-primary-500"
                />
              </div>
              <p class="text-[11px] text-primary-500 dark:text-primary-400">
                {{ t('profile.stats.workouts') }}
              </p>
            </button>
            <div class="text-center">
              <div class="flex items-center justify-center gap-1.5">
                <span class="text-lg font-bold text-primary-900 dark:text-primary-100">{{
                  formatVolume(profile.stats?.totalVolume)
                }}</span>
                <Icon name="lucide:weight" class="w-4 h-4 text-primary-400 dark:text-primary-500" />
              </div>
              <p class="text-[11px] text-primary-500 dark:text-primary-400">
                {{ t('profilePage.volumeKg') }}
              </p>
            </div>
            <div class="text-center">
              <div class="flex items-center justify-center gap-1.5">
                <span class="text-lg font-bold text-primary-900 dark:text-primary-100">{{
                  profile.stats?.streak ?? 0
                }}</span>
                <Icon
                  name="lucide:flame"
                  class="w-4 h-4"
                  :class="
                    (profile.stats?.streak ?? 0) > 0
                      ? 'text-orange-500'
                      : 'text-primary-400 dark:text-primary-500'
                  "
                />
              </div>
              <p class="text-[11px] text-primary-500 dark:text-primary-400">
                {{ t('profile.stats.streak') }}
              </p>
            </div>
          </div>

          <!-- Bio -->
          <div v-if="profile.bio" class="mb-6 slide-up">
            <p class="text-sm text-primary-700 dark:text-primary-300 text-center">
              {{ profile.bio }}
            </p>
          </div>

          <!-- Tab Bar -->
          <div class="flex justify-center mb-6 slide-up">
            <div
              class="flex space-x-1 bg-white/50 dark:bg-primary-900/50 backdrop-blur-lg rounded-xl p-1"
            >
              <button
                @click="activeTab = 'photos'"
                :class="[
                  'px-5 py-2 rounded-lg text-sm font-semibold transition-all',
                  activeTab === 'photos'
                    ? 'bg-gradient-primary text-white shadow-sm'
                    : 'text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100',
                ]"
              >
                <Icon name="lucide:image" class="w-4 h-4 inline-block mr-1 -mt-0.5" />
                Photos
              </button>
              <button
                @click="activeTab = 'posts'"
                :class="[
                  'px-5 py-2 rounded-lg text-sm font-semibold transition-all',
                  activeTab === 'posts'
                    ? 'bg-gradient-primary text-white shadow-sm'
                    : 'text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100',
                ]"
              >
                <Icon name="lucide:file-text" class="w-4 h-4 inline-block mr-1 -mt-0.5" />
                Posts
              </button>
            </div>
          </div>

          <!-- Photos Grid -->
          <div v-if="activeTab === 'photos'" class="slide-up">
            <div
              v-if="profile.recentPhotos && profile.recentPhotos.length > 0"
              class="grid grid-cols-3 gap-1.5"
            >
              <div
                v-for="photo in profile.recentPhotos"
                :key="photo.id"
                class="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                @click="selectedPhoto = photo"
              >
                <img
                  :src="photo.photoUrl"
                  :alt="`Photo`"
                  loading="lazy"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
            </div>
            <div v-else class="text-center py-12">
              <Icon
                name="lucide:camera"
                class="w-12 h-12 mx-auto mb-3 text-primary-300 dark:text-primary-600"
              />
              <p class="text-primary-500 dark:text-primary-400 text-sm">
                {{ t('profilePage.noPhoto') }}
              </p>
            </div>
          </div>

          <!-- Posts List -->
          <div v-if="activeTab === 'posts'" class="space-y-4 slide-up">
            <div v-if="profile.posts && profile.posts.length > 0">
              <div v-for="post in profile.posts" :key="post.id" class="card-glass !p-4">
                <div class="flex items-center gap-3 mb-3">
                  <div
                    class="w-8 h-8 rounded-full overflow-hidden flex-shrink-0"
                    :class="
                      profile.avatarUrl
                        ? ''
                        : 'bg-gradient-primary flex items-center justify-center'
                    "
                  >
                    <img
                      v-if="profile.avatarUrl"
                      :src="profile.avatarUrl"
                      alt=""
                      class="w-full h-full object-cover"
                    />
                    <span v-else class="text-white text-xs font-bold">{{ profileInitials }}</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p
                      class="text-sm font-semibold text-primary-900 dark:text-primary-100 truncate"
                    >
                      {{ profile.firstName }}
                    </p>
                    <p class="text-xs text-primary-400 dark:text-primary-500">
                      {{ timeAgo(post.createdAt) }}
                    </p>
                  </div>
                </div>
                <p class="text-sm text-primary-700 dark:text-primary-300">
                  {{ getPostText(post) }}
                </p>
              </div>
            </div>
            <div v-else class="text-center py-12">
              <Icon
                name="lucide:file-text"
                class="w-12 h-12 mx-auto mb-3 text-primary-300 dark:text-primary-600"
              />
              <p class="text-primary-500 dark:text-primary-400 text-sm">
                {{ t('profilePage.noPost') }}
              </p>
            </div>
          </div>
        </template>
      </template>
    </div>

    <!-- Photo modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="selectedPhoto"
          class="fixed inset-0 z-[100] flex items-center justify-center p-4"
          @click="selectedPhoto = null"
        >
          <div class="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
          <img
            :src="selectedPhoto.photoUrl"
            class="relative max-w-full max-h-[90vh] rounded-2xl object-contain"
            @click.stop
          />
          <button
            @click="selectedPhoto = null"
            class="absolute top-6 right-6 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center text-white transition-colors"
          >
            <Icon name="lucide:x" class="w-6 h-6" />
          </button>
        </div>
      </Transition>
    </Teleport>

    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showWorkoutsModal"
          class="fixed inset-0 z-[100] flex items-center justify-center p-4"
          @click="showWorkoutsModal = false"
        >
          <div
            class="modal-surface-solid relative w-full max-w-lg overflow-hidden rounded-3xl text-primary-900 dark:text-primary-100"
            @click.stop
          >
            <div class="flex justify-end px-3 pt-3">
              <button
                @click="showWorkoutsModal = false"
                class="w-9 h-9 rounded-xl flex items-center justify-center text-primary-500 transition-colors hover:bg-primary-100 hover:text-primary-900 dark:hover:bg-primary-800 dark:hover:text-white"
              >
                <Icon name="lucide:x" class="w-5 h-5" />
              </button>
            </div>
            <div class="max-h-[70vh] overflow-y-auto px-4 pb-4 custom-scrollbar">
              <div v-if="profile?.workouts?.length" class="space-y-3">
                <button
                  v-for="w in profile.workouts"
                  :key="w.id"
                  type="button"
                  @click="goToWorkout(w.id)"
                  class="flex items-start justify-between gap-4 w-full text-left rounded-2xl border border-primary-200/70 bg-primary-50/60 p-4 transition-colors hover:border-sand-400/50 hover:bg-sand-50/60 dark:border-primary-800/70 dark:bg-primary-900/40 dark:hover:border-sand-500/30 dark:hover:bg-primary-900/60"
                >
                  <div class="min-w-0">
                    <div class="flex items-center gap-2">
                      <Icon name="lucide:calendar-check-2" class="w-4 h-4 text-sand-500" />
                      <div class="font-semibold text-primary-950 dark:text-white truncate">
                        {{ w.name }}
                      </div>
                    </div>
                    <div class="mt-1 text-xs text-primary-500 dark:text-primary-400">
                      {{ formatWorkoutDate(w.completedAt) }} ·
                      {{ Math.max(1, Math.round((w.duration || 0) / 60)) }} min
                    </div>
                  </div>
                  <div
                    class="shrink-0 rounded-full bg-sand-100 px-3 py-1 text-xs font-semibold text-sand-700 dark:bg-sand-500/15 dark:text-sand-300"
                  >
                    {{ w.totalVolume ? `${Math.round(w.totalVolume)} kg` : '—' }}
                  </div>
                </button>
              </div>
              <div
                v-else
                class="rounded-2xl border border-dashed border-primary-200 bg-primary-50/60 py-12 text-center dark:border-primary-800 dark:bg-primary-900/40"
              >
                <Icon
                  name="lucide:dumbbell"
                  class="w-12 h-12 mx-auto mb-3 text-primary-300 dark:text-primary-600"
                />
                <p class="text-primary-600 dark:text-primary-300 font-medium">
                  Aucun workout disponible
                </p>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <CoachMobileNav v-if="isCoachMode" active="/profile" />
    <MobileBottomNav v-else active-path="/feed" />
  </div>
</template>

<script setup lang="ts">
const { t } = useLocale();
/* TopNav imported and rendered globally in app.vue; per-page import removed */
import { useSocialApi } from '~/composables/useSocialApi';

const { isCoachMode } = useAppMode();

definePageMeta({
  layout: false,
  middleware: 'auth',
});

useHead({ meta: [{ name: 'robots', content: 'noindex, nofollow' }] });

const route = useRoute();
const toast = useToast();
const { getProfile, sendFriendRequest, removeFriend, blockUser } = useSocialApi();

const username = computed(() => route.params.username as string);
const loading = ref(true);
const notFound = ref(false);
const profile = ref<any>(null);
const activeTab = ref<'photos' | 'posts'>('photos');
const selectedPhoto = ref<any>(null);
const actionLoading = ref(false);
const showWorkoutsModal = ref(false);

const goToWorkout = (workoutId: number) => {
  showWorkoutsModal.value = false;
  navigateTo(`/profile/${username.value}/workout/${workoutId}`);
};

const formatWorkoutDate = (dateStr?: string | null) => {
  if (!dateStr) return '';
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateStr));
};

const profileInitials = computed(() => {
  if (!profile.value) return '?';
  const f = profile.value.firstName?.charAt(0) || '';
  const l = profile.value.lastName?.charAt(0) || '';
  return (f + l).toUpperCase() || '?';
});

const formatVolume = (vol: number | undefined | null) => {
  if (!vol) return '0';
  if (vol >= 1000) return `${(vol / 1000).toFixed(1)}k`;
  return String(Math.round(vol));
};

const timeAgo = (dateStr: string) => {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "a l'instant";
  if (diffMin < 60) return `il y a ${diffMin}min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `il y a ${diffH}h`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 7) return `il y a ${diffD}j`;
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
};

const getPostText = (post: any) => {
  if (post.type === 'WORKOUT_COMPLETED')
    return `A termine ${post.data?.workoutName || 'un workout'}`;
  if (post.type === 'PR_ACHIEVED')
    return `Nouveau record ! ${post.data?.exerciseName} ${post.data?.weight}kg`;
  return post.data?.text || post.data?.caption || '';
};

const loadProfile = async () => {
  loading.value = true;
  notFound.value = false;
  profile.value = null;
  try {
    profile.value = await getProfile(username.value);
  } catch (err: any) {
    if (err?.statusCode === 404) {
      notFound.value = true;
    } else {
      toast.error(t('common.error'), t('profilePage.errorLoad'));
      notFound.value = true;
    }
  } finally {
    loading.value = false;
  }
};

const handleSendRequest = async () => {
  if (actionLoading.value || !profile.value) return;
  actionLoading.value = true;
  try {
    await sendFriendRequest(profile.value.id);
    profile.value.requestPending = true;
    toast.success(
      t('profilePage.toastRequestSent'),
      t('profilePage.toastRequestSentDesc', { name: profile.value.firstName })
    );
  } catch (err: any) {
    toast.error(t('common.error'), err?.data?.error || t('profilePage.errorSendRequest'));
  } finally {
    actionLoading.value = false;
  }
};

const handleRemoveFriend = async () => {
  if (actionLoading.value || !profile.value) return;
  actionLoading.value = true;
  try {
    await removeFriend(profile.value.id);
    profile.value.isFriend = false;
    toast.info(t('profilePage.toastGymBroRemoved'));
  } catch (err: any) {
    toast.error(t('common.error'), err?.data?.error || t('profilePage.errorRemoveGymBro'));
  } finally {
    actionLoading.value = false;
  }
};

const handleBlock = async () => {
  if (actionLoading.value || !profile.value) return;
  actionLoading.value = true;
  try {
    await blockUser(profile.value.id);
    toast.info(t('profilePage.toastUserBlocked'));
    navigateTo('/feed');
  } catch (err: any) {
    toast.error(t('common.error'), err?.data?.error || t('profilePage.errorBlockUser'));
  } finally {
    actionLoading.value = false;
  }
};

watch(
  () => route.fullPath,
  async (newPath, oldPath) => {
    if (!username.value) return;
    if (newPath === oldPath) return;
    await loadProfile();
  },
  { immediate: true }
);
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
