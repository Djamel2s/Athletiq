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
      <!-- Header -->
      <div class="mb-6 fade-in">
        <div class="flex items-center gap-3 mb-1">
          <NuxtLink to="/feed" class="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors">
            <Icon name="lucide:arrow-left" class="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </NuxtLink>
          <h1 class="text-2xl font-bold text-primary-900 dark:text-primary-100">Gym Bros</h1>
        </div>
      </div>

      <!-- Tab bar -->
      <div class="flex justify-center mb-6">
        <div class="flex space-x-1 bg-white/50 dark:bg-primary-900/50 backdrop-blur-lg rounded-xl p-1 w-full">
          <button
            @click="activeTab = 'friends'"
            :class="[
              'flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all text-center',
              activeTab === 'friends'
                ? 'bg-gradient-primary text-white shadow-sm'
                : 'text-primary-600 dark:text-primary-400'
            ]"
          >
            Mes Gym Bros
          </button>
          <button
            @click="activeTab = 'requests'"
            :class="[
              'flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all text-center relative',
              activeTab === 'requests'
                ? 'bg-gradient-primary text-white shadow-sm'
                : 'text-primary-600 dark:text-primary-400'
            ]"
          >
            Demandes
            <span v-if="pendingRequests.length > 0" class="ml-1 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold rounded-full"
              :class="activeTab === 'requests' ? 'bg-white/30' : 'bg-red-500 text-white'">
              {{ pendingRequests.length }}
            </span>
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-16">
        <div class="inline-block animate-spin rounded-full h-10 w-10 border-4 border-primary-300 dark:border-primary-600 border-t-primary-600 dark:border-t-primary-400"></div>
      </div>

      <!-- Friends list -->
      <div v-else-if="activeTab === 'friends'" class="space-y-3 slide-up">
        <div v-if="friends.length > 0">
          <div v-for="friend in friends" :key="friend.id" class="card-glass !p-3 flex items-center gap-3">
            <NuxtLink :to="`/profile/${friend.username}`" class="flex-shrink-0">
              <div class="w-12 h-12 rounded-full overflow-hidden" :class="friend.avatarUrl ? '' : 'bg-gradient-primary flex items-center justify-center'">
                <img v-if="friend.avatarUrl" :src="friend.avatarUrl" alt="" class="w-full h-full object-cover" />
                <span v-else class="text-white text-sm font-bold">{{ (friend.firstName?.charAt(0) || '?').toUpperCase() }}</span>
              </div>
            </NuxtLink>
            <div class="flex-1 min-w-0">
              <NuxtLink :to="`/profile/${friend.username}`">
                <p class="text-sm font-semibold text-primary-900 dark:text-primary-100 truncate">{{ friend.firstName }} {{ friend.lastName }}</p>
                <p v-if="friend.username" class="text-xs text-primary-500 dark:text-primary-400">@{{ friend.username }}</p>
              </NuxtLink>
            </div>
            <button
              @click="handleRemoveFriend(friend)"
              class="w-8 h-8 rounded-lg flex items-center justify-center text-primary-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
            >
              <Icon name="lucide:user-minus" class="w-4 h-4" />
            </button>
          </div>
        </div>
        <div v-else class="text-center py-12">
          <Icon name="lucide:users" class="w-16 h-16 mx-auto mb-4 text-primary-300 dark:text-primary-600" />
          <p class="text-primary-500 dark:text-primary-400 text-sm mb-2">Aucun Gym Bro pour le moment</p>
          <NuxtLink to="/feed" class="text-sand-600 dark:text-sand-400 text-sm font-medium hover:underline">Rechercher des utilisateurs</NuxtLink>
        </div>
      </div>

      <!-- Pending requests -->
      <div v-else-if="activeTab === 'requests'" class="space-y-3 slide-up">
        <div v-if="pendingRequests.length > 0">
          <div v-for="req in pendingRequests" :key="req.friendshipId" class="card-glass !p-3 flex items-center gap-3">
            <NuxtLink :to="`/profile/${req.username || req.id}`" class="flex-shrink-0">
              <div class="w-12 h-12 rounded-full overflow-hidden" :class="req.avatarUrl ? '' : 'bg-gradient-primary flex items-center justify-center'">
                <img v-if="req.avatarUrl" :src="req.avatarUrl" alt="" class="w-full h-full object-cover" />
                <span v-else class="text-white text-sm font-bold">{{ (req.firstName?.charAt(0) || '?').toUpperCase() }}</span>
              </div>
            </NuxtLink>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-primary-900 dark:text-primary-100 truncate">{{ req.firstName }} {{ req.lastName }}</p>
              <p v-if="req.username" class="text-xs text-primary-500 dark:text-primary-400">@{{ req.username }}</p>
            </div>
            <div class="flex items-center gap-2 flex-shrink-0">
              <button
                @click="handleAccept(req)"
                class="w-9 h-9 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
              >
                <Icon name="lucide:check" class="w-5 h-5" />
              </button>
              <button
                @click="handleReject(req)"
                class="w-9 h-9 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-500 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
              >
                <Icon name="lucide:x" class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-12">
          <Icon name="lucide:inbox" class="w-16 h-16 mx-auto mb-4 text-primary-300 dark:text-primary-600" />
          <p class="text-primary-500 dark:text-primary-400 text-sm">Aucune demande en attente</p>
        </div>
      </div>
    </div>

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

const toast = useToast()
const { getFriends, getRequests, acceptRequest, rejectRequest, removeFriend } = useSocialApi()

const activeTab = ref<'friends' | 'requests'>('friends')
const loading = ref(true)
const friends = ref<any[]>([])
const pendingRequests = ref<any[]>([])

const handleAccept = async (req: any) => {
  try {
    await acceptRequest(req.friendshipId)
    pendingRequests.value = pendingRequests.value.filter(r => r.friendshipId !== req.friendshipId)
    // Refresh friends list
    try {
      const data = await getFriends() as any
      friends.value = data?.friends || data || []
    } catch {}
    toast.success('Demande acceptee', `${req.firstName || 'Utilisateur'} est maintenant ton Gym Bro !`)
  } catch {
    toast.error('Erreur', 'Impossible d\'accepter la demande')
  }
}

const handleReject = async (req: any) => {
  try {
    await rejectRequest(req.friendshipId)
    pendingRequests.value = pendingRequests.value.filter(r => r.friendshipId !== req.friendshipId)
    toast.info('Demande refusee')
  } catch {
    toast.error('Erreur', 'Impossible de refuser la demande')
  }
}

const handleRemoveFriend = async (friend: any) => {
  try {
    await removeFriend(friend.id)
    friends.value = friends.value.filter(f => f.id !== friend.id)
    toast.info('Gym Bro retire')
  } catch {
    toast.error('Erreur', 'Impossible de retirer le Gym Bro')
  }
}

onMounted(async () => {
  loading.value = true
  try {
    const [friendsData, reqData] = await Promise.all([
      getFriends(),
      getRequests()
    ]) as any[]
    friends.value = friendsData?.friends || friendsData || []
    pendingRequests.value = reqData?.requests || reqData?.received || reqData?.pending || reqData || []
  } catch {
    friends.value = []
    pendingRequests.value = []
  } finally {
    loading.value = false
  }
})
</script>
