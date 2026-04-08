<template>
  <div class="min-h-screen">
    <!-- TopNav is rendered globally in app.vue -->

    <!-- Contenu principal -->
    <div class="px-4 md:px-6 pb-28 lg:pb-20 max-w-2xl mx-auto">
      <!-- Header -->
      <div class="fade-in text-center mb-8">
        <h1 class="text-3xl md:text-5xl font-bold text-display bg-gradient-to-r from-sand-500 to-primary-900 dark:to-primary-100 bg-clip-text text-transparent mb-2">
          Entrainement en groupe
        </h1>
        <p class="text-lg text-primary-600 dark:text-primary-400">Entrainez-vous a plusieurs, chacun son tour</p>
      </div>

      <!-- Mode selection (before session is created/joined) -->
      <div v-if="!session" class="space-y-6 slide-up">
        <!-- Create / Join buttons -->
        <div class="grid grid-cols-2 gap-4">
          <button
            @click="handleCreate"
            :disabled="isCreating"
            class="card-glass hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer text-center py-8 border-2 border-transparent hover:border-sand-500/40"
          >
            <div class="w-14 h-14 mx-auto mb-4 bg-gradient-primary rounded-2xl flex items-center justify-center">
              <svg v-if="!isCreating" class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              <div v-else class="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
            </div>
            <p class="text-lg font-bold text-primary-900 dark:text-primary-100">Creer une session</p>
            <p class="text-sm text-primary-500 dark:text-primary-400 mt-1">Tu es l'hote</p>
          </button>

          <button
            @click="showJoinForm = true"
            class="card-glass hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer text-center py-8 border-2 border-transparent hover:border-sand-500/40"
          >
            <div class="w-14 h-14 mx-auto mb-4 bg-primary-100 dark:bg-primary-800 rounded-2xl flex items-center justify-center">
              <svg class="w-7 h-7 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
              </svg>
            </div>
            <p class="text-lg font-bold text-primary-900 dark:text-primary-100">Rejoindre</p>
            <p class="text-sm text-primary-500 dark:text-primary-400 mt-1">Avec un code</p>
          </button>
        </div>

        <!-- Join form -->
        <div v-if="showJoinForm" class="card-glass space-y-4">
          <h3 class="text-lg font-bold text-primary-900 dark:text-primary-100">Rejoindre une session</h3>

          <div>
            <label class="block text-sm font-semibold text-primary-700 dark:text-primary-300 mb-2">Code de session</label>
            <input
              v-model="joinCode"
              type="text"
              maxlength="6"
              placeholder="ABC123"
              class="input-primary text-center text-2xl font-mono font-bold tracking-[0.3em] uppercase"
              @input="joinCode = joinCode.toUpperCase()"
            />
          </div>

          <button
            @click="handleJoin"
            :disabled="joinCode.length < 6 || isJoining"
            class="w-full py-3 rounded-2xl bg-gradient-primary text-white font-medium hover:shadow-md transition-all disabled:opacity-50"
          >
            {{ isJoining ? 'Connexion...' : 'Rejoindre' }}
          </button>

          <!-- Separator -->
          <div class="flex items-center gap-3">
            <div class="flex-1 h-px bg-primary-200 dark:bg-primary-700"></div>
            <span class="text-xs text-primary-400 dark:text-primary-500 uppercase tracking-wider">ou</span>
            <div class="flex-1 h-px bg-primary-200 dark:bg-primary-700"></div>
          </div>

          <!-- Local guest mode -->
          <button
            @click="showLocalLogin = !showLocalLogin"
            class="w-full py-3 rounded-2xl bg-primary-100 dark:bg-primary-800 text-primary-800 dark:text-primary-200 font-medium hover:bg-primary-200 dark:hover:bg-primary-700 transition-colors text-sm"
          >
            Mode meme telephone
          </button>

          <!-- Local login form for guest on same phone -->
          <div v-if="showLocalLogin" class="space-y-3 pt-2">
            <p class="text-xs text-primary-500 dark:text-primary-400">Connecte le compte de ton partenaire pour l'ajouter sur ce telephone</p>
            <input
              v-model="localEmail"
              type="email"
              placeholder="Email du partenaire"
              class="input-primary text-sm"
            />
            <input
              v-model="localPassword"
              type="password"
              placeholder="Mot de passe"
              class="input-primary text-sm"
            />
            <button
              @click="handleJoinLocal"
              :disabled="!localEmail || !localPassword || !joinCode || isJoining"
              class="w-full py-2.5 rounded-2xl bg-gradient-primary text-white font-medium text-sm hover:shadow-md transition-all disabled:opacity-50"
            >
              {{ isJoining ? 'Connexion...' : 'Ajouter sur ce telephone' }}
            </button>
          </div>

          <button
            @click="showJoinForm = false; showLocalLogin = false"
            class="w-full text-sm text-primary-500 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-200 transition-colors"
          >
            Annuler
          </button>
        </div>
      </div>

      <!-- Session lobby (after creating/joining) -->
      <div v-if="session" class="space-y-6 slide-up">
        <!-- Session code display -->
        <div class="card-glass text-center relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-sand-500/10 via-transparent to-sand-600/10 pointer-events-none"></div>
          <div class="relative">
            <p class="text-sm text-primary-500 dark:text-primary-400 uppercase tracking-wider font-semibold mb-3">Code de session</p>
            <div class="text-6xl md:text-7xl font-bold font-mono tracking-[0.3em] bg-gradient-to-r from-sand-500 to-sand-700 dark:from-sand-400 dark:to-sand-600 bg-clip-text text-transparent mb-5 py-2">
              {{ session.code }}
            </div>
          </div>
          <button
            @click="copyCode"
            class="btn-outline text-sm inline-flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/>
            </svg>
            Copier le code
          </button>
        </div>

        <!-- Connection status -->
        <div class="flex items-center justify-center">
          <span :class="[
            'inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium',
            socketConnected
              ? 'bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20'
              : 'bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/20'
          ]">
            <div :class="['w-2 h-2 rounded-full', socketConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500']"></div>
            {{ socketConnected ? 'Connecte en temps reel' : 'Connexion...' }}
          </span>
        </div>

        <!-- Participants list -->
        <div class="card-glass">
          <h3 class="text-lg font-bold text-primary-900 dark:text-primary-100 mb-4">
            Participants ({{ participants.length }})
          </h3>
          <div class="space-y-3">
            <div
              v-for="participant in participants"
              :key="participant.userId"
              class="card-glass !p-3 flex items-center gap-3"
            >
              <!-- Avatar -->
              <div class="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0 overflow-hidden">
                <img v-if="participant.avatarUrl" :src="participant.avatarUrl" class="w-full h-full object-cover" />
                <span v-else class="text-sm font-bold text-white">{{ (participant.name?.[0] || '?').toUpperCase() }}</span>
              </div>

              <!-- Name + host badge -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <p class="text-sm font-semibold text-primary-900 dark:text-primary-100 truncate">
                    {{ participant.name }}
                  </p>
                  <span v-if="participant.isHost" class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sand-500/15 text-sand-700 dark:text-sand-400 border border-sand-500/30">
                    Hote
                  </span>
                  <span v-if="participant.userId === authStore.user?.id" class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-700 text-primary-600 dark:text-primary-300">
                    Toi
                  </span>
                </div>
                <p class="text-xs text-primary-500 dark:text-primary-400">
                  {{ participant.workoutName || 'Aucun workout selectionne' }}
                </p>
              </div>

              <!-- Ready status -->
              <div :class="['w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0', participant.workoutId ? 'bg-green-100 dark:bg-green-900/30' : 'bg-primary-100 dark:bg-primary-800']">
                <svg v-if="participant.workoutId" class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                </svg>
                <div v-else class="w-3 h-3 rounded-full bg-primary-300 dark:bg-primary-600"></div>
              </div>
            </div>

            <!-- Empty state -->
            <div v-if="participants.length < 2" class="text-center py-4">
              <p class="text-sm text-primary-500 dark:text-primary-400">En attente d'autres participants...</p>
              <p class="text-xs text-primary-400 dark:text-primary-500 mt-1">Partagez le code <strong>{{ session.code }}</strong> a vos partenaires</p>
            </div>
          </div>
        </div>

        <!-- Workout selection -->
        <div class="card-glass">
          <h3 class="text-lg font-bold text-primary-900 dark:text-primary-100 mb-4">Ton workout</h3>
          <div v-if="workoutStore.isLoading" class="text-center py-4">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-2 border-primary-200 dark:border-primary-700 border-t-primary-600 dark:border-t-primary-400"></div>
          </div>
          <div v-else-if="workoutStore.templates.length === 0" class="text-center py-4">
            <p class="text-sm text-primary-500 dark:text-primary-400">Aucun template disponible</p>
            <NuxtLink to="/workouts/builder" class="text-sm text-sand-600 dark:text-sand-400 hover:underline mt-1 inline-block">
              Creer un workout
            </NuxtLink>
          </div>
          <div v-else class="space-y-2">
            <button
              v-for="template in workoutStore.templates"
              :key="template.id"
              @click="selectWorkout(template)"
              :class="[
                'w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left',
                selectedWorkoutId === template.id
                  ? 'border-sand-500 bg-sand-500/10 dark:bg-sand-600/10'
                  : 'border-primary-200 dark:border-primary-700 hover:border-primary-300 dark:hover:border-primary-600'
              ]"
            >
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-primary-900 dark:text-primary-100 text-sm truncate">{{ template.name }}</p>
                <p class="text-xs text-primary-500 dark:text-primary-400">{{ template.exercises?.length || 0 }} exercices</p>
              </div>
              <div v-if="selectedWorkoutId === template.id" class="w-6 h-6 rounded-full bg-sand-500 flex items-center justify-center flex-shrink-0">
                <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
            </button>
          </div>
        </div>

        <!-- Actions -->
        <div class="space-y-3">
          <!-- Start button (host only) -->
          <button
            v-if="isHost"
            @click="handleStart"
            :disabled="!canStart || isStarting"
            class="w-full py-4 rounded-2xl bg-gradient-primary text-white font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50"
          >
            <span v-if="isStarting">Lancement...</span>
            <span v-else-if="!canStart">En attente ({{ participants.length }}/2+ participants)</span>
            <span v-else>Lancer la session</span>
          </button>

          <!-- Waiting message (non-host) -->
          <div v-else class="text-center py-4">
            <p class="text-primary-600 dark:text-primary-400 font-medium">En attente du lancement par l'hote...</p>
          </div>

          <!-- Leave button -->
          <button
            @click="handleLeave"
            class="w-full py-3 rounded-2xl bg-primary-100 dark:bg-primary-800 text-primary-800 dark:text-primary-200 font-medium hover:bg-primary-200 dark:hover:bg-primary-700 transition-colors"
          >
            Quitter la session
          </button>
        </div>
      </div>
    </div>

    <MobileBottomNav active-path="/workouts" />
  </div>
</template>

<script setup lang="ts">
/* TopNav imported and rendered globally in app.vue; per-page import removed */
import { useWorkoutStore } from '~/stores/workout'
import { useAuthStore } from '~/stores/auth'
import type { Workout } from '~/types/workout'

useHead({ meta: [{ name: 'robots', content: 'noindex, nofollow' }] })

const workoutStore = useWorkoutStore()
const authStore = useAuthStore()
const sessionApi = useSessionApi()
const { connect, disconnect, getSocket, connected: socketConnected } = useSocket()
const toast = useToast()

// State
const session = ref<any>(null)
const participants = ref<any[]>([])
const selectedWorkoutId = ref<number | null>(null)
const showJoinForm = ref(false)
const showLocalLogin = ref(false)
const joinCode = ref('')
const localEmail = ref('')
const localPassword = ref('')
const isCreating = ref(false)
const isJoining = ref(false)
const isStarting = ref(false)

// Computed
const isHost = computed(() => {
  if (!session.value || !authStore.user) return false
  return session.value.hostId === authStore.user.id
})

const canStart = computed(() => {
  return participants.value.length >= 2 && participants.value.every(p => p.workoutId)
})

// Methods
const handleCreate = async () => {
  isCreating.value = true
  try {
    const data = await sessionApi.createSession() as any
    session.value = data.session || data
    participants.value = data.participants || [data.session?.participants] || []
    await setupSocket()
    toast.success('Session creee', `Code: ${session.value.code}`)
  } catch (err: any) {
    toast.error('Erreur', err?.data?.error || 'Impossible de creer la session')
  } finally {
    isCreating.value = false
  }
}

const handleJoin = async () => {
  if (joinCode.value.length < 6) return
  isJoining.value = true
  try {
    const data = await sessionApi.joinSession(joinCode.value) as any
    session.value = data.session || data
    participants.value = data.participants || []
    await setupSocket()
    toast.success('Rejoint !', 'Vous avez rejoint la session')
  } catch (err: any) {
    toast.error('Erreur', err?.data?.error || 'Impossible de rejoindre la session')
  } finally {
    isJoining.value = false
  }
}

const handleJoinLocal = async () => {
  if (!localEmail.value || !localPassword.value || joinCode.value.length < 6) return
  isJoining.value = true
  try {
    const data = await sessionApi.joinSessionLocal(joinCode.value, localEmail.value, localPassword.value) as any
    // Update participants list
    if (data.participants) {
      participants.value = data.participants
    } else if (data.participant) {
      participants.value.push(data.participant)
    }
    toast.success('Ajoute !', 'Le participant a ete ajoute sur ce telephone')
    showLocalLogin.value = false
    localEmail.value = ''
    localPassword.value = ''
  } catch (err: any) {
    toast.error('Erreur', err?.data?.error || 'Impossible d\'ajouter le participant')
  } finally {
    localEmail.value = ''
    localPassword.value = ''
    isJoining.value = false
  }
}

const selectWorkout = async (template: Workout) => {
  selectedWorkoutId.value = template.id
  if (session.value?.id) {
    try {
      await sessionApi.setWorkout(session.value.id, template.id)
      // Update local participant
      const me = participants.value.find(p => p.userId === authStore.user?.id)
      if (me) {
        me.workoutId = template.id
        me.workoutName = template.name
      }
    } catch (err: any) {
      toast.error('Erreur', 'Impossible de selectionner le workout')
    }
  }
}

const handleStart = async () => {
  if (!session.value?.id) return
  isStarting.value = true
  try {
    await sessionApi.startSession(session.value.id)
    // WebSocket will emit session:started which triggers navigation
  } catch (err: any) {
    toast.error('Erreur', err?.data?.error || 'Impossible de lancer la session')
  } finally {
    isStarting.value = false
  }
}

const handleLeave = async () => {
  if (!session.value?.id) return
  try {
    await sessionApi.leaveSession(session.value.id)
    disconnect()
    session.value = null
    participants.value = []
    selectedWorkoutId.value = null
    toast.success('Quitte', 'Vous avez quitte la session')
  } catch (err: any) {
    toast.error('Erreur', 'Impossible de quitter la session')
  }
}

const copyCode = async () => {
  if (!session.value?.code) return
  try {
    await navigator.clipboard.writeText(session.value.code)
    toast.success('Copie !', 'Code copie dans le presse-papier')
  } catch {
    // Fallback
    toast.success('Code', session.value.code)
  }
}

const setupSocket = async () => {
  if (!authStore.token) return
  const socket = await connect(authStore.token)
  if (!socket) return

  // Join session room
  socket.emit('session:join', { sessionCode: session.value.sessionCode || session.value.code })

  // Listen for events
  socket.on('session:participant-joined', (data: any) => {
    if (data.participants) {
      participants.value = data.participants
    } else if (data.participant) {
      const exists = participants.value.find((p: any) => p.userId === data.participant.userId)
      if (!exists) {
        participants.value.push(data.participant)
      }
    }
  })

  socket.on('session:participant-left', (data: any) => {
    if (data.participants) {
      participants.value = data.participants
    } else {
      participants.value = participants.value.filter((p: any) => p.userId !== data.userId)
    }
  })

  socket.on('session:workout-selected', (data: any) => {
    const participant = participants.value.find((p: any) => p.userId === data.userId)
    if (participant) {
      participant.workoutId = data.workoutId
      participant.workoutName = data.workoutName
    }
  })

  socket.on('session:started', (data: any) => {
    // Navigate to group live workout
    const workoutId = selectedWorkoutId.value || data.workoutId
    navigateTo(`/workouts/${workoutId}/group-live?session=${session.value.id}&code=${session.value.code}`)
  })
}

onMounted(async () => {
  await workoutStore.fetchWorkouts()
})

onUnmounted(() => {
  // Don't disconnect if navigating to group-live
  // disconnect will be handled by group-live page
})

definePageMeta({
  middleware: 'auth'
})
</script>
