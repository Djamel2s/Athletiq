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
      <!-- Loading -->
      <div v-if="loading" class="text-center py-20 fade-in">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-300 dark:border-primary-600 border-t-primary-600 dark:border-t-primary-400"></div>
        <p class="mt-4 text-primary-500 dark:text-primary-400">Chargement du profil...</p>
      </div>

      <!-- Not found -->
      <div v-else-if="notFound" class="text-center py-20 fade-in">
        <Icon name="lucide:user-x" class="w-16 h-16 mx-auto mb-4 text-primary-300 dark:text-primary-600" />
        <h2 class="text-xl font-bold text-primary-900 dark:text-primary-100 mb-2">Utilisateur introuvable</h2>
        <p class="text-primary-500 dark:text-primary-400 text-sm mb-6">Ce profil n'existe pas ou a ete supprime</p>
        <NuxtLink to="/feed" class="btn-primary px-6 py-2.5 text-sm font-medium">Retour au feed</NuxtLink>
      </div>

      <!-- Profile content -->
      <template v-else-if="profile">
        <!-- Cover area with avatar -->
        <div class="text-center mb-6 fade-in">
          <div class="relative inline-block mb-4">
            <div class="w-24 h-24 rounded-full overflow-hidden ring-4 ring-sand-500/30 mx-auto">
              <div class="w-full h-full flex items-center justify-center" :class="profile.avatarUrl ? '' : 'bg-gradient-primary'">
                <img v-if="profile.avatarUrl" :src="profile.avatarUrl" alt="Avatar" class="w-full h-full object-cover" />
                <span v-else class="text-white text-3xl font-bold">{{ profileInitials }}</span>
              </div>
            </div>
            <!-- Gym Bro badge -->
            <div v-if="profile.isFriend" class="absolute -bottom-1 -right-1 bg-gradient-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
              Gym Bro
            </div>
          </div>

          <!-- Name & Username -->
          <h1 class="text-2xl font-bold text-primary-900 dark:text-primary-100">{{ profile.firstName }} {{ profile.lastName }}</h1>
          <p class="text-sm text-primary-500 dark:text-primary-400 mt-0.5">@{{ profile.username }}</p>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-center gap-3 mb-6 slide-up">
          <!-- Already friends -->
          <div v-if="profile.isFriend" class="flex items-center gap-2">
            <span class="btn-glass px-5 py-2.5 text-sm font-medium inline-flex items-center gap-2 cursor-default">
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
          <span v-else-if="profile.requestPending" class="btn-glass px-5 py-2.5 text-sm font-medium inline-flex items-center gap-2 cursor-default opacity-70">
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
            title="Bloquer"
          >
            <Icon name="lucide:shield-off" class="w-4 h-4" />
          </button>
        </div>

        <!-- Private profile message -->
        <div v-if="!profile.isPublic && !profile.isFriend" class="text-center py-12 slide-up">
          <Icon name="lucide:lock" class="w-16 h-16 mx-auto mb-4 text-primary-300 dark:text-primary-600" />
          <h3 class="text-lg font-semibold text-primary-900 dark:text-primary-100 mb-2">Profil prive</h3>
          <p class="text-sm text-primary-500 dark:text-primary-400">Ajoutez cet utilisateur en Gym Bro pour voir son profil complet</p>
        </div>

        <!-- Public / Friends content -->
        <template v-if="profile.isPublic || profile.isFriend">
          <!-- Stats Row -->
          <div class="grid grid-cols-3 gap-3 mb-6 slide-up">
            <div class="card-glass !p-4 text-center">
              <p class="text-xl md:text-2xl font-bold text-primary-900 dark:text-primary-100">{{ profile.stats?.workoutCount ?? 0 }}</p>
              <p class="text-[11px] text-primary-500 dark:text-primary-400 mt-0.5">Workouts</p>
            </div>
            <div class="card-glass !p-4 text-center">
              <p class="text-xl md:text-2xl font-bold text-primary-900 dark:text-primary-100">{{ formatVolume(profile.stats?.totalVolume) }}</p>
              <p class="text-[11px] text-primary-500 dark:text-primary-400 mt-0.5">Volume (kg)</p>
            </div>
            <div class="card-glass !p-4 text-center">
              <p class="text-xl md:text-2xl font-bold text-primary-900 dark:text-primary-100">{{ profile.stats?.streak ?? 0 }}</p>
              <p class="text-[11px] text-primary-500 dark:text-primary-400 mt-0.5">Streak</p>
            </div>
          </div>

          <!-- Bio -->
          <div v-if="profile.bio" class="mb-6 slide-up">
            <p class="text-sm text-primary-700 dark:text-primary-300 text-center">{{ profile.bio }}</p>
          </div>

          <!-- Tab Bar -->
          <div class="flex justify-center mb-6">
            <div class="flex space-x-1 bg-white/50 dark:bg-primary-900/50 backdrop-blur-lg rounded-xl p-1">
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
              <button
                @click="activeTab = 'posts'"
                :class="[
                  'px-5 py-2 rounded-lg text-sm font-semibold transition-all',
                  activeTab === 'posts'
                    ? 'bg-gradient-primary text-white shadow-sm'
                    : 'text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100'
                ]"
              >
                <Icon name="lucide:file-text" class="w-4 h-4 inline-block mr-1 -mt-0.5" />
                Posts
              </button>
            </div>
          </div>

          <!-- Photos Grid -->
          <div v-if="activeTab === 'photos'" class="slide-up">
            <div v-if="profile.recentPhotos && profile.recentPhotos.length > 0" class="grid grid-cols-3 gap-1.5">
              <div
                v-for="photo in profile.recentPhotos"
                :key="photo.id"
                class="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                @click="selectedPhoto = photo"
              >
                <img :src="photo.photoUrl" :alt="`Photo`" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
              </div>
            </div>
            <div v-else class="text-center py-12">
              <Icon name="lucide:camera" class="w-12 h-12 mx-auto mb-3 text-primary-300 dark:text-primary-600" />
              <p class="text-primary-500 dark:text-primary-400 text-sm">Aucune photo</p>
            </div>
          </div>

          <!-- Posts List -->
          <div v-if="activeTab === 'posts'" class="space-y-4 slide-up">
            <div v-if="profile.posts && profile.posts.length > 0">
              <div v-for="post in profile.posts" :key="post.id" class="card-glass !p-4">
                <div class="flex items-center gap-3 mb-3">
                  <div class="w-8 h-8 rounded-full overflow-hidden flex-shrink-0" :class="profile.avatarUrl ? '' : 'bg-gradient-primary flex items-center justify-center'">
                    <img v-if="profile.avatarUrl" :src="profile.avatarUrl" alt="" class="w-full h-full object-cover" />
                    <span v-else class="text-white text-xs font-bold">{{ profileInitials }}</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-semibold text-primary-900 dark:text-primary-100 truncate">{{ profile.firstName }}</p>
                    <p class="text-xs text-primary-400 dark:text-primary-500">{{ timeAgo(post.createdAt) }}</p>
                  </div>
                </div>
                <p class="text-sm text-primary-700 dark:text-primary-300">{{ getPostText(post) }}</p>
              </div>
            </div>
            <div v-else class="text-center py-12">
              <Icon name="lucide:file-text" class="w-12 h-12 mx-auto mb-3 text-primary-300 dark:text-primary-600" />
              <p class="text-primary-500 dark:text-primary-400 text-sm">Aucun post</p>
            </div>
          </div>
        </template>
      </template>
    </div>

    <!-- Photo modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="selectedPhoto" class="fixed inset-0 z-[100] flex items-center justify-center p-4" @click="selectedPhoto = null">
          <div class="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
          <img :src="selectedPhoto.photoUrl" class="relative max-w-full max-h-[90vh] rounded-2xl object-contain" @click.stop />
          <button @click="selectedPhoto = null" class="absolute top-6 right-6 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center text-white transition-colors">
            <Icon name="lucide:x" class="w-6 h-6" />
          </button>
        </div>
      </Transition>
    </Teleport>

    <MobileBottomNav active-path="/feed" />
  </div>
</template>

<script setup lang="ts">
import { useSocialApi } from '~/composables/useSocialApi'

definePageMeta({
  layout: false,
  middleware: 'auth'
})

useHead({ meta: [{ name: 'robots', content: 'noindex, nofollow' }] })

const route = useRoute()
const toast = useToast()
const { getProfile, sendFriendRequest, removeFriend, blockUser } = useSocialApi()

const username = computed(() => route.params.username as string)
const loading = ref(true)
const notFound = ref(false)
const profile = ref<any>(null)
const activeTab = ref<'photos' | 'posts'>('photos')
const selectedPhoto = ref<any>(null)
const actionLoading = ref(false)

const profileInitials = computed(() => {
  if (!profile.value) return '?'
  const f = profile.value.firstName?.charAt(0) || ''
  const l = profile.value.lastName?.charAt(0) || ''
  return (f + l).toUpperCase() || '?'
})

const formatVolume = (vol: number | undefined | null) => {
  if (!vol) return '0'
  if (vol >= 1000) return `${(vol / 1000).toFixed(1)}k`
  return String(Math.round(vol))
}

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

const handleSendRequest = async () => {
  if (actionLoading.value || !profile.value) return
  actionLoading.value = true
  try {
    await sendFriendRequest(profile.value.id)
    profile.value.requestPending = true
    toast.success('Demande envoyee', `Demande envoyee a ${profile.value.firstName}`)
  } catch (err: any) {
    toast.error('Erreur', err?.data?.error || 'Impossible d\'envoyer la demande')
  } finally {
    actionLoading.value = false
  }
}

const handleRemoveFriend = async () => {
  if (actionLoading.value || !profile.value) return
  actionLoading.value = true
  try {
    await removeFriend(profile.value.id)
    profile.value.isFriend = false
    toast.info('Gym Bro retire')
  } catch (err: any) {
    toast.error('Erreur', err?.data?.error || 'Impossible de retirer le Gym Bro')
  } finally {
    actionLoading.value = false
  }
}

const handleBlock = async () => {
  if (actionLoading.value || !profile.value) return
  actionLoading.value = true
  try {
    await blockUser(profile.value.id)
    toast.info('Utilisateur bloque')
    navigateTo('/feed')
  } catch (err: any) {
    toast.error('Erreur', err?.data?.error || 'Impossible de bloquer l\'utilisateur')
  } finally {
    actionLoading.value = false
  }
}

onMounted(async () => {
  // Avoid capturing /profile/edit as a username
  if (username.value === 'edit') {
    return navigateTo('/profile/edit', { replace: true })
  }

  loading.value = true
  try {
    profile.value = await getProfile(username.value)
  } catch (err: any) {
    if (err?.statusCode === 404) {
      notFound.value = true
    } else {
      toast.error('Erreur', 'Impossible de charger le profil')
      notFound.value = true
    }
  } finally {
    loading.value = false
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
