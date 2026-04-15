<template>
  <div class="min-h-screen geometric-bg">
    <!-- TopNav is rendered globally in app.vue -->

    <div class="px-4 md:px-6 pb-28 lg:pb-20 max-w-lg mx-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8 fade-in">
        <div>
          <h1
            class="text-3xl md:text-5xl lg:text-6xl font-bold text-display bg-gradient-to-r from-sand-500 to-primary-900 dark:to-primary-100 bg-clip-text text-transparent mb-2"
          >
            Feed
          </h1>
          <p class="text-sm text-primary-500 dark:text-primary-400">Activite de tes Gym Bros</p>
        </div>
        <!-- Search / Friends -->
        <div class="flex items-center gap-2">
          <button
            @click="showSearch = true"
            class="btn-glass w-10 h-10 !rounded-xl !p-0 flex items-center justify-center"
          >
            <Icon name="lucide:search" class="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </button>
          <NuxtLink
            to="/friends"
            class="btn-glass w-10 h-10 !rounded-xl !p-0 flex items-center justify-center relative"
          >
            <Icon name="lucide:users" class="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <span
              v-if="pendingCount > 0"
              class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
              >{{ pendingCount }}</span
            >
          </NuxtLink>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="initialLoading" class="text-center py-16">
        <div
          class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-300 dark:border-primary-600 border-t-primary-600 dark:border-t-primary-400"
        ></div>
        <p class="mt-4 text-primary-500 dark:text-primary-400">Chargement du feed...</p>
      </div>

      <!-- Feed Posts -->
      <div v-else-if="posts.length > 0" class="space-y-4 mb-8 slide-up">
        <div v-for="post in posts" :key="post.id" class="card-glass !p-4">
          <!-- Post header -->
          <div class="flex items-center gap-3 mb-3">
            <NuxtLink :to="`/profile/${post.user?.username || post.userId}`" class="flex-shrink-0">
              <div
                class="w-10 h-10 rounded-full overflow-hidden"
                :class="
                  post.user?.avatarUrl ? '' : 'bg-gradient-primary flex items-center justify-center'
                "
              >
                <img
                  v-if="post.user?.avatarUrl"
                  :src="post.user.avatarUrl"
                  alt="Avatar"
                  class="w-full h-full object-cover"
                />
                <svg
                  v-else
                  class="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            </NuxtLink>

            <!-- Delete own post -->
            <button
              v-if="post.userId === authStore.user?.id"
              @click="handleDeletePost(post.id)"
              class="w-8 h-8 rounded-lg flex items-center justify-center text-primary-300 dark:text-primary-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
            >
              <Icon name="lucide:trash-2" class="w-4 h-4" />
            </button>
          </div>

          <!-- WORKOUT_COMPLETED -->
          <div v-if="post.type === 'WORKOUT_COMPLETED'" class="mb-3">
            <p class="text-sm text-primary-700 dark:text-primary-300 mb-2">
              A termine
              <span class="font-semibold">{{ post.data?.workoutName || 'un workout' }}</span>
            </p>
            <div class="flex gap-3 flex-wrap">
              <span
                v-if="post.data?.duration"
                class="inline-flex items-center gap-1.5 text-xs bg-primary-100 dark:bg-primary-800 px-2.5 py-1 rounded-lg"
              >
                <Icon name="lucide:clock" class="w-3.5 h-3.5 text-primary-500" />
                <span class="text-primary-700 dark:text-primary-300"
                  >{{ post.data.duration }}min</span
                >
              </span>
              <span
                v-if="post.data?.exercises"
                class="inline-flex items-center gap-1.5 text-xs bg-primary-100 dark:bg-primary-800 px-2.5 py-1 rounded-lg"
              >
                <Icon name="lucide:dumbbell" class="w-3.5 h-3.5 text-primary-500" />
                <span class="text-primary-700 dark:text-primary-300"
                  >{{ post.data.exercises }} exercices</span
                >
              </span>
              <span
                v-if="post.data?.volume"
                class="inline-flex items-center gap-1.5 text-xs bg-primary-100 dark:bg-primary-800 px-2.5 py-1 rounded-lg"
              >
                <Icon name="lucide:weight" class="w-3.5 h-3.5 text-primary-500" />
                <span class="text-primary-700 dark:text-primary-300"
                  >{{ formatVolume(post.data.volume) }}kg</span
                >
              </span>
            </div>
          </div>

          <!-- PHOTO -->
          <div v-else-if="post.type === 'PHOTO'" class="mb-3">
            <p class="text-sm text-primary-700 dark:text-primary-300 mb-2">A partage une photo</p>
            <div v-if="post.data?.photoUrl" class="rounded-xl overflow-hidden aspect-square max-h-[400px]">
              <img :src="post.data.photoUrl" alt="Photo" class="w-full h-full object-cover" loading="lazy" />
            </div>

            <template v-else-if="post.data?.beforeUrl && post.data?.afterUrl">
              <div class="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <img :src="post.data.beforeUrl" class="w-full rounded-lg object-cover" />
                  <div class="text-xs text-primary-500 mt-1 text-center">Avant</div>
                </div>
                <div>
                  <img :src="post.data.afterUrl" class="w-full rounded-lg object-cover" />
                  <div class="text-xs text-primary-500 mt-1 text-center">Après</div>
                </div>
              </div>
            </template>

            <template v-else-if="Array.isArray(post.data?.photos)">
              <div v-if="post.data.layout === 'gallery'" class="grid grid-cols-3 gap-1 mt-2">
                <img v-for="(p, i) in post.data.photos" :key="i" :src="p" class="w-full h-24 object-cover rounded-md" />
              </div>
              <div v-else class="relative mt-2">
                <div class="rounded-xl overflow-hidden aspect-square max-h-[400px]">
                  <img :src="post.data.photos[(carouselIndexMap[post.id] ?? 0)]" class="w-full h-full object-cover" loading="lazy" />
                </div>
                <button @click="prevCarousel(post.id, post.data.photos.length)" class="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/60 rounded-full flex items-center justify-center">
                  <Icon name="lucide:chevron-left" class="w-4 h-4" />
                </button>
                <button @click="nextCarousel(post.id, post.data.photos.length)" class="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/60 rounded-full flex items-center justify-center">
                  <Icon name="lucide:chevron-right" class="w-4 h-4" />
                </button>
                <div class="flex items-center justify-center gap-1 mt-2">
                  <span v-for="(p, i) in post.data.photos" :key="i" @click="carouselIndexMap[post.id] = i" :class="['w-2 h-2 rounded-full cursor-pointer', (carouselIndexMap[post.id] ?? 0) === i ? 'bg-primary-700' : 'bg-primary-200']"></span>
                </div>
              </div>
            </template>
          </div>

          <!-- PR_ACHIEVED -->
          <div v-else-if="post.type === 'PR_ACHIEVED'" class="mb-3">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-lg">🏆</span>
              <p class="text-sm font-semibold text-primary-900 dark:text-primary-100">
                Nouveau record !
              </p>
            </div>
            <p class="text-sm text-primary-700 dark:text-primary-300">
              {{ post.data?.exerciseName }} :
              <span class="font-bold text-sand-600 dark:text-sand-400"
                >{{ post.data?.weight }}kg</span
              >
            </p>
          </div>

          <!-- TEMPLATE_SHARED -->
          <div v-else-if="post.type === 'TEMPLATE_SHARED'" class="mb-3">
            <p class="text-sm text-primary-700 dark:text-primary-300 mb-2">A partage un template</p>
            <div class="card-glass !p-3 !bg-primary-50/50 dark:!bg-primary-800/30">
              <p class="text-sm font-semibold text-primary-900 dark:text-primary-100">
                {{ post.data?.templateName }}
              </p>
              <p
                v-if="post.data?.description"
                class="text-xs text-primary-500 dark:text-primary-400 mt-1"
              >
                {{ post.data.description }}
              </p>
              <button
                class="mt-2 text-xs font-medium text-sand-600 dark:text-sand-400 hover:underline inline-flex items-center gap-1"
              >
                <Icon name="lucide:download" class="w-3.5 h-3.5" />
                Importer
              </button>
            </div>
          </div>

          <!-- Generic fallback -->
          <div v-else class="mb-3">
            <p class="text-sm text-primary-700 dark:text-primary-300">
              {{ post.data?.text || post.type }}
            </p>
          </div>

          <!-- Reaction bar -->
          <div
            class="flex items-center gap-3 pt-2 border-t border-primary-100 dark:border-primary-800"
          >
            <button
              @click="handleReact(post)"
              class="btn-glass inline-flex items-center gap-1.5 !px-3 !py-1.5 !rounded-lg text-sm transition-all"
              :class="
                post.hasReacted
                  ? '!bg-orange-100 dark:!bg-orange-900/30 !text-orange-600 dark:!text-orange-400 !border-orange-200 dark:!border-orange-800'
                  : ''
              "
            >
              <span>🔥</span>
              <span class="text-xs font-medium">{{ post.reactionCount || 0 }}</span>
            </button>
          </div>
        </div>

        <!-- Load more -->
        <div v-if="hasMore" class="text-center py-4">
          <button
            v-if="!loadingMore"
            @click="loadMore"
            class="btn-glass px-6 py-2.5 text-sm font-medium"
          >
            Charger plus
          </button>
          <div
            v-else
            class="inline-block animate-spin rounded-full h-8 w-8 border-2 border-primary-300 dark:border-primary-600 border-t-primary-600 dark:border-t-primary-400"
          ></div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="text-center py-16 slide-up">
        <Icon
          name="lucide:users"
          class="w-20 h-20 mx-auto mb-4 text-primary-300 dark:text-primary-600"
        />
        <h3 class="text-lg font-semibold text-primary-900 dark:text-primary-100 mb-2">
          Ton feed est vide
        </h3>
        <p class="text-sm text-primary-500 dark:text-primary-400 mb-6">
          Ajoute des Gym Bros pour voir leur activite
        </p>
        <button
          @click="showSearch = true"
          class="btn-primary px-6 py-2.5 text-sm font-semibold inline-flex items-center gap-2"
        >
          <Icon name="lucide:search" class="w-4 h-4" />
          Rechercher des utilisateurs
        </button>
      </div>
    </div>

    <!-- Search Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showSearch"
          class="fixed inset-0 z-[90] flex items-start justify-center pt-20 px-4"
          @click.self="showSearch = false"
        >
          <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
          <div
            class="relative w-full max-w-md bg-white dark:bg-primary-900 rounded-2xl shadow-2xl overflow-hidden"
          >
            <!-- Search input -->
            <div class="p-4 border-b border-primary-100 dark:border-primary-800">
              <div class="flex items-center gap-3">
                <Icon name="lucide:search" class="w-5 h-5 text-primary-400 flex-shrink-0" />
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Rechercher un utilisateur..."
                  class="flex-1 bg-transparent text-primary-900 dark:text-primary-100 placeholder-primary-400 dark:placeholder-primary-500 focus:outline-none text-sm"
                  @input="debouncedSearch"
                  autofocus
                />
                <button
                  @click="showSearch = false"
                  class="text-primary-400 hover:text-primary-600 dark:hover:text-primary-300"
                >
                  <Icon name="lucide:x" class="w-5 h-5" />
                </button>
              </div>
            </div>

            <!-- Search results -->
            <div class="max-h-[60vh] overflow-y-auto">
              <div v-if="searching" class="p-8 text-center">
                <div
                  class="inline-block animate-spin rounded-full h-6 w-6 border-2 border-primary-300 border-t-primary-600"
                ></div>
              </div>
              <div v-else-if="searchResults.length > 0" class="py-2">
                <NuxtLink
                  v-for="user in searchResults"
                  :key="user.id"
                  :to="`/profile/${user.username}`"
                  class="flex items-center gap-3 px-4 py-3 hover:bg-primary-50 dark:hover:bg-primary-800 transition-colors"
                  @click="showSearch = false"
                >
                  <div
                    class="w-10 h-10 rounded-full overflow-hidden flex-shrink-0"
                    :class="
                      user.avatarUrl ? '' : 'bg-gradient-primary flex items-center justify-center'
                    "
                  >
                    <img
                      v-if="user.avatarUrl"
                      :src="user.avatarUrl"
                      alt=""
                      class="w-full h-full object-cover"
                    />
                    <span v-else class="text-white text-sm font-bold">{{
                      (user.firstName?.charAt(0) || '').toUpperCase()
                    }}</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p
                      class="text-sm font-semibold text-primary-900 dark:text-primary-100 truncate"
                    >
                      {{ user.firstName }} {{ user.lastName }}
                    </p>
                    <p class="text-xs text-primary-500 dark:text-primary-400">
                      @{{ user.username }}
                    </p>
                  </div>
                  <Icon
                    name="lucide:chevron-right"
                    class="w-4 h-4 text-primary-400 flex-shrink-0"
                  />
                </NuxtLink>
              </div>
              <div v-else-if="searchQuery.length >= 2" class="p-8 text-center">
                <p class="text-sm text-primary-500 dark:text-primary-400">
                  Aucun utilisateur trouve
                </p>
              </div>
              <div v-else class="p-8 text-center">
                <p class="text-sm text-primary-400 dark:text-primary-500">
                  Tape au moins 2 caracteres
                </p>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <MobileBottomNav active-path="/feed" />
  </div>
</template>

<script setup lang="ts">
/* TopNav imported and rendered globally in app.vue; per-page import removed */
import { useAuthStore } from '~/stores/auth';
import { useSocialApi } from '~/composables/useSocialApi';

definePageMeta({
  layout: false,
  middleware: 'auth',
});

useHead({ meta: [{ name: 'robots', content: 'noindex, nofollow' }] });

const authStore = useAuthStore();
const { getFeed, searchUsers, reactToPost, deletePost, getRequests } = useSocialApi();
const toast = useToast();

const posts = ref<any[]>([]);
const carouselIndexMap = ref<Record<number, number>>({});
const initialLoading = ref(true);
const loadingMore = ref(false);
const hasMore = ref(true);
const offset = ref(0);
const pendingCount = ref(0);

// Search
const showSearch = ref(false);
const searchQuery = ref('');
const searchResults = ref<any[]>([]);
const searching = ref(false);
let searchTimeout: ReturnType<typeof setTimeout> | null = null;

const getInitials = (user: any) => {
  if (!user) return '?';
  const f = user.firstName?.charAt(0) || '';
  const l = user.lastName?.charAt(0) || '';
  return (f + l).toUpperCase() || '?';
};

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

const debouncedSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(async () => {
    if (searchQuery.value.length < 2) {
      searchResults.value = [];
      return;
    }
    searching.value = true;
    try {
      const result = (await searchUsers(searchQuery.value)) as any;
      searchResults.value = result?.users || result || [];
    } catch {
      searchResults.value = [];
    } finally {
      searching.value = false;
    }
  }, 400);
};

const handleReact = async (post: any) => {
  try {
    await reactToPost(post.id);
    if (post.hasReacted) {
      post.hasReacted = false;
      post.reactionCount = Math.max(0, (post.reactionCount || 1) - 1);
    } else {
      post.hasReacted = true;
      post.reactionCount = (post.reactionCount || 0) + 1;
    }
  } catch {
    toast.error('Erreur', 'Impossible de reagir');
  }
};

const handleDeletePost = async (postId: number) => {
  try {
    await deletePost(postId);
    posts.value = posts.value.filter((p) => p.id !== postId);
    toast.success('Post supprime');
  } catch {
    toast.error('Erreur', 'Impossible de supprimer le post');
  }
};

const ensureCarouselIndex = (postId: number) => {
  if (carouselIndexMap.value[postId] === undefined) carouselIndexMap.value[postId] = 0;
};

const nextCarousel = (postId: number, count: number) => {
  ensureCarouselIndex(postId);
  carouselIndexMap.value[postId] = (carouselIndexMap.value[postId] + 1) % Math.max(1, count);
};

const prevCarousel = (postId: number, count: number) => {
  ensureCarouselIndex(postId);
  carouselIndexMap.value[postId] = (carouselIndexMap.value[postId] - 1 + Math.max(1, count)) % Math.max(1, count);
};

const loadMore = async () => {
  if (loadingMore.value || !hasMore.value) return;
  loadingMore.value = true;
  try {
    const data = (await getFeed(offset.value)) as any;
    const newPosts = data?.posts || data || [];
    if (newPosts.length === 0) {
      hasMore.value = false;
    } else {
      posts.value.push(...newPosts);
      offset.value += newPosts.length;
    }
  } catch {
    toast.error('Erreur', 'Impossible de charger le feed');
  } finally {
    loadingMore.value = false;
  }
};

// Infinite scroll
const handleScroll = () => {
  if (loadingMore.value || !hasMore.value) return;
  const scrollBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 400;
  if (scrollBottom) {
    loadMore();
  }
};

onMounted(async () => {
  initialLoading.value = true;
  try {
    const data = (await getFeed(0)) as any;
    const feedPosts = data?.posts || data || [];
    posts.value = feedPosts;
    offset.value = feedPosts.length;
    if (feedPosts.length === 0) hasMore.value = false;
  } catch {
    posts.value = [];
    hasMore.value = false;
  } finally {
    initialLoading.value = false;
  }

  // Load pending requests count
  try {
    const reqData = (await getRequests()) as any;
    const pending = reqData?.received || reqData?.pending || [];
    pendingCount.value = Array.isArray(pending) ? pending.length : 0;
  } catch {
    pendingCount.value = 0;
  }

  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  if (searchTimeout) clearTimeout(searchTimeout);
});
</script>
