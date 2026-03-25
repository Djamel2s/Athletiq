<template>
  <div class="min-h-screen geometric-bg">
    <!-- Navigation -->
    <nav class="fixed top-0 left-0 right-0 z-50 nav-blur">
      <div class="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-5">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <NuxtLink to="/dashboard">
              <AppLogo />
            </NuxtLink>
          </div>
          <NavActions />
        </div>
      </div>
    </nav>

    <div class="pt-20 md:pt-28 px-4 md:px-6 pb-28 lg:pb-20 max-w-lg mx-auto">
      <!-- Username setup prompt (first visit) -->
      <div v-if="showUsernameSetup" class="card-glass !p-6 text-center mb-6 fade-in">
        <Icon name="lucide:at-sign" class="w-12 h-12 mx-auto mb-3 text-sand-500" />
        <h2 class="text-lg font-bold text-primary-900 dark:text-primary-100 mb-2">Choisis ton pseudo</h2>
        <p class="text-sm text-primary-500 dark:text-primary-400 mb-4">C'est ton identifiant unique sur Athletiq</p>
        <form @submit.prevent="saveUsername" class="space-y-3">
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400 text-sm">@</span>
            <input
              v-model="usernameInput"
              type="text"
              class="input-primary pl-8"
              placeholder="ton_pseudo"
              pattern="[a-z0-9_]{3,20}"
              required
            />
          </div>
          <p v-if="usernameError" class="text-xs text-red-500">{{ usernameError }}</p>
          <p v-if="usernameAvailable === true" class="text-xs text-green-500">Pseudo disponible</p>
          <button type="submit" :disabled="!usernameAvailable || usernameLoading" class="btn-primary w-full py-3 disabled:opacity-50">
            {{ usernameLoading ? 'Verification...' : 'Valider' }}
          </button>
        </form>
      </div>

      <!-- Profile content -->
      <template v-if="!showUsernameSetup || profileData?.username">
        <!-- Cover area with avatar -->
        <div class="text-center mb-6 fade-in">
          <!-- Avatar (carre avec coins arrondis) -->
          <div class="relative inline-block mb-4">
            <div class="w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-sand-500/30 mx-auto">
              <div class="w-full h-full flex items-center justify-center" :class="authStore.user?.avatarUrl ? '' : 'bg-gradient-primary'">
                <img v-if="authStore.user?.avatarUrl" :src="authStore.user.avatarUrl" alt="Avatar" class="w-full h-full object-cover" />
                <span v-else class="text-white text-3xl font-bold">{{ initials }}</span>
              </div>
            </div>
            <!-- Upload overlay -->
            <label class="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/40 rounded-2xl cursor-pointer transition-colors group">
              <Icon name="lucide:camera" class="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              <input type="file" accept="image/*" class="hidden" @change="handleAvatarUpload" :disabled="avatarUploading" />
            </label>
            <div v-if="avatarUploading" class="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl">
              <div class="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>

          <!-- Username (pas nom/prenom pour la confidentialite) -->
          <h1 v-if="profileData?.username" class="text-2xl font-bold text-primary-900 dark:text-primary-100">@{{ profileData.username }}</h1>
          <h1 v-else class="text-2xl font-bold text-primary-900 dark:text-primary-100">{{ authStore.fullName }}</h1>
          <p v-if="profileData?.bio" class="text-sm text-primary-500 dark:text-primary-400 mt-1">{{ profileData.bio }}</p>
        </div>

        <!-- Stats Row -->
        <div class="flex justify-center gap-8 mb-6 slide-up">
          <div class="text-center">
            <div class="flex items-center justify-center gap-1.5">
              <span class="text-lg font-bold text-primary-900 dark:text-primary-100">{{ profileData?.stats?.workoutCount ?? 0 }}</span>
              <Icon name="lucide:dumbbell" class="w-4 h-4 text-primary-400 dark:text-primary-500" />
            </div>
            <p class="text-[11px] text-primary-500 dark:text-primary-400">Workouts</p>
          </div>
          <div class="text-center">
            <div class="flex items-center justify-center gap-1.5">
              <span class="text-lg font-bold text-primary-900 dark:text-primary-100">{{ gymBrosCount }}</span>
              <Icon name="lucide:users" class="w-4 h-4 text-primary-400 dark:text-primary-500" />
            </div>
            <p class="text-[11px] text-primary-500 dark:text-primary-400">Gym Bros</p>
          </div>
          <div class="text-center">
            <div class="flex items-center justify-center gap-1.5">
              <span class="text-lg font-bold text-primary-900 dark:text-primary-100">{{ profileData?.stats?.streak ?? 0 }}</span>
              <Icon name="lucide:flame" class="w-4 h-4" :class="(profileData?.stats?.streak ?? 0) > 0 ? 'text-orange-500' : 'text-primary-400 dark:text-primary-500'" />
            </div>
            <p class="text-[11px] text-primary-500 dark:text-primary-400">Streak</p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-center gap-2 mb-8 slide-up">
          <NuxtLink to="/edit-profile" class="btn-glass px-5 py-2.5 text-sm font-medium inline-flex items-center gap-2">
            <Icon name="lucide:edit-3" class="w-4 h-4" />
            Modifier
          </NuxtLink>
          <button
            v-if="profileData?.username"
            @click="showQrModal = true"
            class="btn-glass px-4 py-2.5 text-sm font-medium inline-flex items-center gap-2"
            title="Mon QR Code"
          >
            <Icon name="lucide:qr-code" class="w-4 h-4" />
          </button>
          <NuxtLink to="/settings" class="btn-glass px-4 py-2.5 text-sm font-medium inline-flex items-center gap-2" title="Parametres">
            <Icon name="lucide:settings" class="w-4 h-4" />
          </NuxtLink>
        </div>

        <!-- Tab Bar (Posts par defaut) -->
        <div class="flex justify-center mb-6">
          <div class="flex space-x-1 bg-white/50 dark:bg-primary-900/50 backdrop-blur-lg rounded-xl p-1">
            <button
              @click="activeTab = 'posts'"
              :class="[
                'px-5 py-2 rounded-lg text-sm font-semibold transition-all',
                activeTab === 'posts'
                  ? 'bg-gradient-primary text-white shadow-sm'
                  : 'text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100'
              ]"
            >
              <Icon name="lucide:activity" class="w-4 h-4 inline-block mr-1 -mt-0.5" />
              Posts
            </button>
            <button
              @click="activeTab = 'photos'"
              :class="[
                'px-5 py-2 rounded-lg text-sm font-semibold transition-all',
                activeTab === 'photos'
                  ? 'bg-gradient-primary text-white shadow-sm'
                  : 'text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100'
              ]"
            >
              <Icon name="lucide:image" class="w-4 h-4 inline-block mr-1 -mt-0.5" />
              Photos
            </button>
          </div>
        </div>

        <!-- Posts List (par defaut) -->
        <div v-if="activeTab === 'posts'" class="space-y-4 slide-up">
          <div v-if="posts.length > 0">
            <div v-for="post in posts" :key="post.id" class="card-glass !p-4">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0" :class="authStore.user?.avatarUrl ? '' : 'bg-gradient-primary flex items-center justify-center'">
                  <img v-if="authStore.user?.avatarUrl" :src="authStore.user.avatarUrl" alt="" class="w-full h-full object-cover" />
                  <span v-else class="text-white text-xs font-bold">{{ initials }}</span>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-primary-900 dark:text-primary-100 truncate">@{{ profileData?.username || 'moi' }}</p>
                  <p class="text-xs text-primary-400 dark:text-primary-500">{{ timeAgo(post.createdAt) }}</p>
                </div>
              </div>
              <p class="text-sm text-primary-700 dark:text-primary-300">{{ getPostText(post) }}</p>
              <div v-if="post.reactions" class="mt-3 flex items-center gap-1.5">
                <span class="text-sm">&#128293;</span>
                <span class="text-xs text-primary-500 dark:text-primary-400">{{ post.reactions }}</span>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-16">
            <Icon name="lucide:activity" class="w-16 h-16 mx-auto mb-4 text-primary-300 dark:text-primary-600" />
            <p class="text-primary-500 dark:text-primary-400 text-sm">Aucun post pour le moment</p>
            <p class="text-primary-400 dark:text-primary-500 text-xs mt-1">Tes activites apparaitront ici</p>
          </div>
        </div>

        <!-- Photos Grid -->
        <div v-if="activeTab === 'photos'" class="slide-up">
          <div v-if="photos.length > 0" class="grid grid-cols-3 gap-1.5">
            <div
              v-for="photo in photos"
              :key="photo.id"
              class="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
              @click="selectedPhoto = photo"
            >
              <img :src="photo.photoUrl" :alt="`Photo ${photo.id}`" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
            </div>
          </div>
          <div v-else class="text-center py-16">
            <Icon name="lucide:camera" class="w-16 h-16 mx-auto mb-4 text-primary-300 dark:text-primary-600" />
            <p class="text-primary-500 dark:text-primary-400 text-sm">Aucune photo pour le moment</p>
            <p class="text-primary-400 dark:text-primary-500 text-xs mt-1">Les photos de tes workouts apparaitront ici</p>
          </div>
        </div>
      </template>
    </div>

    <!-- QR Code Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showQrModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4" @click="showQrModal = false">
          <div class="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
          <div class="relative bg-white dark:bg-primary-900 rounded-2xl p-6 max-w-sm w-full text-center shadow-xl" @click.stop>
            <button
              @click="showQrModal = false"
              class="absolute top-3 right-3 w-8 h-8 rounded-lg flex items-center justify-center text-primary-400 hover:text-primary-600 hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors"
            >
              <Icon name="lucide:x" class="w-5 h-5" />
            </button>
            <h3 class="text-lg font-bold text-primary-900 dark:text-primary-100 mb-4">Mon QR Code</h3>
            <div class="flex justify-center mb-4">
              <div class="bg-white p-3 rounded-xl">
                <img
                  :src="`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(qrUrl)}`"
                  alt="QR Code"
                  width="220"
                  height="220"
                  class="block"
                />
              </div>
            </div>
            <p class="text-base font-semibold text-primary-900 dark:text-primary-100">@{{ profileData?.username }}</p>
            <p class="text-sm text-primary-500 dark:text-primary-400 mb-5">Scanne pour m'ajouter</p>
            <button
              @click="shareQr"
              class="w-full py-2.5 rounded-xl bg-gradient-primary text-white text-sm font-semibold inline-flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              <Icon name="lucide:share-2" class="w-4 h-4" />
              Partager
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Photo modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="selectedPhoto" class="fixed inset-0 z-[100] flex items-center justify-center p-4" @click="selectedPhoto = null">
          <div class="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
          <img
            :src="selectedPhoto.photoUrl"
            class="relative max-w-full max-h-[90vh] rounded-2xl object-contain"
            @click.stop
          />
          <button @click="selectedPhoto = null" class="absolute top-6 right-6 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center text-white transition-colors">
            <Icon name="lucide:x" class="w-6 h-6" />
          </button>
        </div>
      </Transition>
    </Teleport>

    <MobileBottomNav active-path="/profile" />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useSocialApi } from '~/composables/useSocialApi'
import { useBodyApi } from '~/composables/useBodyApi'

definePageMeta({
  layout: false,
  middleware: 'auth'
})

useHead({ meta: [{ name: 'robots', content: 'noindex, nofollow' }] })

const authStore = useAuthStore()
const { getMyProfile, getProfile, updateProfile, checkUsername, getFeed, getFriends } = useSocialApi()
const { getRecentPhotos } = useBodyApi()
const toast = useToast()

const activeTab = ref<'photos' | 'posts'>('posts')
const profileData = ref<any>(null)
const photos = ref<any[]>([])
const posts = ref<any[]>([])
const selectedPhoto = ref<any>(null)
const avatarUploading = ref(false)
const showQrModal = ref(false)
const gymBrosCount = ref(0)

// Username setup
const showUsernameSetup = ref(false)
const usernameInput = ref('')
const usernameError = ref('')
const usernameAvailable = ref<boolean | null>(null)
const usernameLoading = ref(false)
let usernameCheckTimeout: NodeJS.Timeout | null = null

watch(usernameInput, (val) => {
  usernameError.value = ''
  usernameAvailable.value = null
  const cleaned = val.toLowerCase().replace(/[^a-z0-9_]/g, '')
  if (cleaned !== val) usernameInput.value = cleaned
  if (cleaned.length < 3) {
    if (cleaned.length > 0) usernameError.value = '3 caracteres minimum'
    return
  }
  if (cleaned.length > 20) {
    usernameError.value = '20 caracteres maximum'
    return
  }
  if (usernameCheckTimeout) clearTimeout(usernameCheckTimeout)
  usernameCheckTimeout = setTimeout(async () => {
    usernameLoading.value = true
    try {
      const res = await checkUsername(cleaned) as any
      usernameAvailable.value = res?.available === true
      if (!usernameAvailable.value) usernameError.value = 'Pseudo deja pris'
    } catch {
      usernameError.value = 'Erreur de verification'
    } finally {
      usernameLoading.value = false
    }
  }, 500)
})

const saveUsername = async () => {
  if (!usernameAvailable.value || usernameLoading.value) return
  usernameLoading.value = true
  try {
    await updateProfile({ username: usernameInput.value })
    showUsernameSetup.value = false
    // Reload profile
    profileData.value = await getProfile(usernameInput.value)
    toast.success('Pseudo enregistre !')
  } catch (err: any) {
    usernameError.value = err?.data?.error || 'Erreur lors de la sauvegarde'
  } finally {
    usernameLoading.value = false
  }
}

const qrUrl = computed(() => {
  const username = profileData.value?.username || (authStore.user as any)?.username || ''
  return `https://athletiq.fr/profile/${username}`
})

const shareQr = async () => {
  const text = `Ajoute-moi sur Athletiq ! ${qrUrl.value}`
  if (navigator.share) {
    try {
      await navigator.share({ title: 'Mon profil Athletiq', text, url: qrUrl.value })
    } catch {}
  } else {
    try {
      await navigator.clipboard.writeText(qrUrl.value)
      toast.success('Lien copie !')
    } catch {
      toast.error('Erreur', 'Impossible de copier le lien')
    }
  }
}

const initials = computed(() => {
  const f = authStore.user?.firstName?.charAt(0) || ''
  const l = authStore.user?.lastName?.charAt(0) || ''
  return (f + l).toUpperCase() || '?'
})

const timeAgo = (dateStr: string) => {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return "a l'instant"
  if (diffMin < 60) return `il y a ${diffMin}min`
  const diffH = Math.floor(diffMin / 60)
  if (diffH < 24) return `il y a ${diffH}h`
  const diffD = Math.floor(diffH / 24)
  if (diffD < 7) return `il y a ${diffD}j`
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

const getPostText = (post: any) => {
  if (post.type === 'WORKOUT_COMPLETED') return `A termine ${post.data?.workoutName || 'un workout'}`
  if (post.type === 'PR_ACHIEVED') return `Nouveau record ! ${post.data?.exerciseName} ${post.data?.weight}kg`
  if (post.type === 'PHOTO') return 'A partage une photo'
  if (post.type === 'TEMPLATE_SHARED') return `A partage le template "${post.data?.templateName}"`
  return post.type
}

const handleAvatarUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  if (!file.type.startsWith('image/')) {
    toast.error('Erreur', 'Le fichier doit etre une image')
    input.value = ''
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    toast.error('Erreur', 'La photo ne doit pas depasser 5 Mo')
    input.value = ''
    return
  }
  avatarUploading.value = true
  try {
    await authStore.uploadAvatar(file)
  } finally {
    avatarUploading.value = false
    input.value = ''
  }
}

onMounted(async () => {
  // Fetch own profile data (includes username)
  let myProfile: any = null
  try {
    myProfile = await getMyProfile() as any
  } catch {}

  const username = myProfile?.username || (authStore.user as any)?.username

  if (username) {
    showUsernameSetup.value = false
    try {
      profileData.value = await getProfile(username)
    } catch {
      profileData.value = { ...myProfile, stats: { workoutCount: 0, streak: 0 } }
    }
  } else {
    showUsernameSetup.value = true
    profileData.value = { stats: { workoutCount: 0, streak: 0 } }
  }

  // Load gym bros count
  try {
    const data = await getFriends() as any
    const friendsList = data?.friends || data || []
    gymBrosCount.value = friendsList.length
  } catch {
    gymBrosCount.value = 0
  }

  // Load photos
  try {
    photos.value = await getRecentPhotos(30)
  } catch {
    photos.value = []
  }

  // Load posts
  try {
    const feedData = await getFeed(0) as any
    posts.value = (feedData?.posts || feedData || []).filter((p: any) => p.userId === authStore.user?.id)
  } catch {
    posts.value = []
  }
})
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
