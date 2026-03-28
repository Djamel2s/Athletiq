<template>
  <div class="min-h-screen">
    <!-- Countdown 3-2-1-GO -->
    <div v-if="showCountdown" class="fixed inset-0 bg-white dark:bg-primary-900 z-50 flex items-center justify-center">
      <div class="text-center">
        <div class="text-7xl md:text-9xl font-bold text-primary-900 dark:text-primary-100 animate-pulse">
          {{ countdownNumber }}
        </div>
        <p class="text-2xl text-primary-600 dark:text-primary-400 mt-4">Preparez-vous...</p>
      </div>
    </div>

    <!-- Header fixe -->
    <div class="fixed top-0 left-0 right-0 z-50 nav-blur">
      <div class="max-w-3xl mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <button @click="confirmExit" class="text-primary-700 dark:text-primary-300 p-2 hover:text-primary-900 dark:hover:text-primary-100">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>

          <div class="text-center">
            <div class="text-xl font-bold text-primary-900 dark:text-primary-100 font-mono">{{ formattedTime }}</div>
            <p class="text-[10px] text-primary-600 dark:text-primary-400 uppercase tracking-wider">Session {{ sessionCode }}</p>
          </div>

          <button
            v-if="isHost"
            @click="confirmEnd"
            :disabled="isEnding"
            class="btn-primary text-sm py-2 px-3 disabled:opacity-50"
          >
            {{ isEnding ? '...' : 'Terminer' }}
          </button>
          <div v-else class="w-16"></div>
        </div>
      </div>

      <!-- Participants rest timer bar -->
      <div class="px-4 pb-3">
        <div class="flex gap-2 overflow-x-auto">
          <div
            v-for="(participant, idx) in participants"
            :key="participant.userId"
            :class="[
              'flex items-center gap-2 px-3 py-2 rounded-xl flex-shrink-0 border transition-all',
              idx === currentTurnIndex
                ? 'bg-sand-500/15 border-sand-500/40 dark:border-sand-600/30 ring-2 ring-sand-500/30'
                : participant.restRemaining <= 0
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                  : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
            ]"
          >
            <!-- Avatar -->
            <div class="w-7 h-7 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0 overflow-hidden">
              <img v-if="participant.avatarUrl" :src="participant.avatarUrl" class="w-full h-full object-cover" />
              <span v-else class="text-[10px] font-bold text-white">{{ (participant.name?.[0] || '?').toUpperCase() }}</span>
            </div>

            <!-- Name + timer -->
            <div class="min-w-0">
              <p class="text-[11px] font-semibold text-primary-900 dark:text-primary-100 truncate max-w-[60px]">
                {{ participant.name?.split(' ')[0] || '?' }}
              </p>
              <p :class="[
                'text-[10px] font-mono font-bold',
                participant.restRemaining <= 0 ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'
              ]">
                {{ participant.restRemaining <= 0 ? 'Pret' : formatRestTime(participant.restRemaining) }}
              </p>
            </div>

            <!-- Finished indicator -->
            <div v-if="participant.finished" class="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
              <svg class="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div class="pt-36 pb-20 px-4 max-w-3xl mx-auto">
      <!-- Loading -->
      <div v-if="isLoading" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary-200 dark:border-primary-700 border-t-primary-600 dark:border-t-primary-400"></div>
        <p class="mt-4 text-primary-600 dark:text-primary-400 text-lg">Chargement...</p>
      </div>

      <div v-else-if="!workout || !currentExercise" class="text-center py-20">
        <p class="text-primary-900 dark:text-primary-100 text-lg">Workout introuvable</p>
      </div>

      <div v-else class="space-y-4">
        <!-- Turn indicator -->
        <div :class="[
          'text-center py-4 px-6 rounded-2xl border-2 transition-all',
          isMyTurn
            ? 'bg-gradient-to-r from-sand-500/15 to-sand-600/15 border-sand-500/40 dark:border-sand-600/30'
            : 'bg-primary-50 dark:bg-primary-800/50 border-primary-200/60 dark:border-primary-700/60'
        ]">
          <p v-if="isMyTurn" class="text-2xl font-bold text-primary-900 dark:text-primary-100">
            C'est ton tour !
          </p>
          <p v-else class="text-xl font-bold text-primary-900 dark:text-primary-100">
            C'est le tour de {{ currentTurnParticipant?.name || '...' }}
          </p>
          <p class="text-sm text-primary-500 dark:text-primary-400 mt-1">
            Tour {{ currentTurnIndex + 1 }} / {{ activeParticipants.length }}
          </p>
        </div>

        <!-- When it's NOT my turn: waiting state -->
        <div v-if="!isMyTurn && !isLocalMode" class="card-glass text-center py-8 space-y-4">
          <div class="w-16 h-16 mx-auto bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <p class="text-lg text-primary-600 dark:text-primary-400">En attente...</p>
          <p class="text-sm text-primary-500 dark:text-primary-400">
            {{ currentTurnParticipant?.name }} fait {{ currentTurnParticipant?.currentExerciseName || 'son exercice' }}
          </p>

          <!-- My rest timer (counting in background) -->
          <div v-if="myRestRemaining > 0" class="mt-4">
            <p class="text-xs text-primary-400 dark:text-primary-500 uppercase tracking-wider mb-2">Ton repos</p>
            <div class="text-4xl font-bold font-mono text-amber-600 dark:text-amber-400">
              {{ formatRestTime(myRestRemaining) }}
            </div>
          </div>
          <div v-else class="mt-4">
            <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-semibold">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              Repos termine
            </span>
          </div>
        </div>

        <!-- When it IS my turn (or local mode) -->
        <div v-if="isMyTurn || isLocalMode">
          <!-- My rest timer fullscreen (if rest not done yet) -->
          <Transition name="fade">
            <div v-if="showRestTimer" class="fixed inset-0 z-50 bg-white dark:bg-primary-900 flex flex-col items-center justify-center">
              <p class="text-sm text-primary-500 dark:text-primary-400 mb-2 tracking-widest uppercase">Repos</p>
              <p class="text-lg font-semibold text-primary-700 dark:text-primary-300 mb-10">
                {{ isLocalMode ? (activeTurnParticipant?.name || '') + ' - ' : '' }}Prochain set
              </p>

              <!-- Circle timer -->
              <div class="relative mb-12">
                <svg class="transform -rotate-90" width="240" height="240">
                  <circle cx="120" cy="120" r="105" stroke="currentColor" class="text-primary-100 dark:text-primary-800" stroke-width="10" fill="none"/>
                  <circle cx="120" cy="120" r="105" stroke="url(#groupRestGradient)" stroke-width="10" fill="none" :stroke-dasharray="restCircumference" :stroke-dashoffset="restProgressOffset" stroke-linecap="round" class="transition-all duration-1000 ease-linear"/>
                  <defs>
                    <linearGradient id="groupRestGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style="stop-color:rgb(var(--sand-500));stop-opacity:1"/>
                      <stop offset="100%" style="stop-color:rgb(var(--sand-600));stop-opacity:1"/>
                    </linearGradient>
                  </defs>
                </svg>
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="text-7xl font-light text-primary-900 dark:text-primary-100 tabular-nums" style="font-family: 'SF Pro Display', system-ui, -apple-system, sans-serif; letter-spacing: -2px;">
                    {{ formatRestTime(restTimeRemaining) }}
                  </div>
                </div>
              </div>

              <div class="flex gap-3">
                <button @click="addRestTime(-15)" class="btn-outline px-5 py-3 text-base font-mono">-15s</button>
                <button @click="skipRest" class="btn-outline px-8 py-3 text-base">Passer</button>
                <button @click="addRestTime(15)" class="btn-primary px-5 py-3 text-base font-mono">+15s</button>
              </div>
            </div>
          </Transition>

          <!-- Exercise content -->
          <div v-if="!showRestTimer">
            <!-- Progress -->
            <div class="text-center mb-6">
              <p class="text-sm text-primary-600 dark:text-primary-400 mb-2">
                {{ isLocalMode ? (activeTurnParticipant?.name + ' - ') : '' }}Exercice {{ currentExerciseIndex + 1 }} / {{ workout.exercises?.length || 0 }}
                · Serie {{ currentSetNumber }} / {{ currentExercise.targetSets || 3 }}
              </p>
              <div class="w-full bg-primary-200 dark:bg-primary-700 rounded-full h-2">
                <div class="bg-gradient-primary h-2 rounded-full transition-all duration-300" :style="{ width: `${progress}%` }"></div>
              </div>
            </div>

            <!-- Exercise name -->
            <h1 class="text-xl md:text-3xl font-bold text-primary-900 dark:text-primary-100 text-center mb-4">
              {{ currentExercise.exerciseLibrary?.name || currentExercise.name }}
            </h1>

            <!-- Exercise animation -->
            <div class="mb-4">
              <ExerciseAnimation
                :image-id="currentExercise.exerciseLibrary?.imageUrl || currentExercise.imageUrl"
                :name="currentExercise.exerciseLibrary?.name || currentExercise.name"
                size="lg"
              />
            </div>

            <!-- Input zone -->
            <div class="card-glass space-y-6">
              <div class="text-center">
                <p class="text-primary-900 dark:text-primary-100 font-bold text-xl mb-2">Serie {{ currentSetNumber }}</p>
                <p class="text-primary-600 dark:text-primary-400 text-sm">Entre tes performances</p>
              </div>

              <div class="flex gap-4">
                <div class="flex-1">
                  <label class="block text-primary-900 dark:text-primary-100 text-sm mb-2 text-center font-semibold">Repetitions</label>
                  <input
                    v-model.number="currentSetData.reps"
                    type="number"
                    min="0"
                    class="w-full px-4 py-6 input text-center text-primary-900 dark:text-primary-100 text-3xl font-bold"
                    placeholder="10"
                  />
                </div>
                <div class="flex-1">
                  <label class="block text-primary-900 dark:text-primary-100 text-sm mb-2 text-center font-semibold">Poids (kg)</label>
                  <input
                    v-model.number="currentSetData.weight"
                    type="number"
                    step="0.5"
                    min="0"
                    class="w-full px-4 py-6 input text-center text-primary-900 dark:text-primary-100 text-3xl font-bold"
                    placeholder="20"
                  />
                </div>
              </div>

              <div class="flex gap-3">
                <button @click="skipCurrentSet" class="btn-outline py-4 px-5 text-sm">Passer</button>
                <button @click="validateCurrentSet" class="btn-primary flex-1 text-xl py-5">
                  {{ nextButtonLabel }}
                </button>
              </div>
            </div>

            <!-- Completed sets -->
            <div v-if="completedSets.length > 0" class="space-y-2 mt-4">
              <p class="text-sm text-primary-900 dark:text-primary-100 font-semibold">Series completees :</p>
              <div class="flex gap-2 overflow-x-auto">
                <div
                  v-for="(set, idx) in completedSets"
                  :key="idx"
                  class="flex-shrink-0 bg-primary-100 dark:bg-primary-800 rounded-lg p-3 text-center border border-primary-200 dark:border-primary-700 min-w-[80px]"
                >
                  <p class="text-xs text-primary-600 dark:text-primary-400 mb-1">S{{ idx + 1 }}</p>
                  <p class="text-primary-900 dark:text-primary-100 font-bold">{{ set.reps }}x{{ set.weight }}kg</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pause overlay -->
    <Transition name="fade">
      <div v-if="isPaused" class="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center">
        <div class="card-glass max-w-sm w-full mx-4 text-center py-10 px-6">
          <div class="w-16 h-16 mx-auto mb-4 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-primary-900 dark:text-primary-100 mb-2">Session en pause</h3>
          <p class="text-primary-600 dark:text-primary-400 mb-6">{{ pauseReason || 'L\'hote a mis la session en pause' }}</p>
          <button
            v-if="isHost"
            @click="handleResume"
            class="btn-primary w-full py-3"
          >
            Reprendre
          </button>
        </div>
      </div>
    </Transition>

    <!-- Disconnection warning -->
    <Transition name="fade">
      <div v-if="showDisconnectWarning" class="fixed top-20 left-4 right-4 z-[70] max-w-md mx-auto">
        <div class="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-2xl p-4 flex items-center gap-3 shadow-lg">
          <div class="w-8 h-8 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center flex-shrink-0">
            <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.072 16.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
          </div>
          <div class="flex-1">
            <p class="text-sm font-semibold text-red-700 dark:text-red-400">{{ disconnectedParticipantName }} deconnecte</p>
            <p class="text-xs text-red-600 dark:text-red-500">Session en pause automatiquement</p>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Completion screen -->
    <Transition name="fade">
      <div v-if="showCompletionScreen" class="fixed inset-0 z-50 bg-white dark:bg-primary-900 overflow-y-auto">
        <div class="min-h-full flex items-center justify-center py-12 px-4">
          <div class="max-w-md w-full text-center space-y-8">
            <div class="w-24 h-24 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
              <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
              </svg>
            </div>

            <div>
              <h2 class="text-3xl font-bold text-primary-900 dark:text-primary-100 mb-2">Bravo a tous !</h2>
              <p class="text-primary-600 dark:text-primary-400">Session de groupe terminee</p>
            </div>

            <!-- Group stats -->
            <div class="grid grid-cols-3 gap-4">
              <div class="card-glass !p-2 md:!p-4">
                <p class="text-2xl font-bold text-primary-900 dark:text-primary-100">{{ formattedTime }}</p>
                <p class="text-xs text-primary-500 dark:text-primary-400 mt-1">Duree</p>
              </div>
              <div class="card-glass !p-2 md:!p-4">
                <p class="text-2xl font-bold text-primary-900 dark:text-primary-100">{{ participants.length }}</p>
                <p class="text-xs text-primary-500 dark:text-primary-400 mt-1">Participants</p>
              </div>
              <div class="card-glass !p-2 md:!p-4">
                <p class="text-2xl font-bold text-primary-900 dark:text-primary-100">{{ totalGroupSets }}</p>
                <p class="text-xs text-primary-500 dark:text-primary-400 mt-1">Series totales</p>
              </div>
            </div>

            <!-- Participants results -->
            <div class="space-y-3">
              <div
                v-for="participant in participants"
                :key="participant.userId"
                class="card-glass !p-4 flex items-center gap-3"
              >
                <div class="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <img v-if="participant.avatarUrl" :src="participant.avatarUrl" class="w-full h-full object-cover" />
                  <span v-else class="text-sm font-bold text-white">{{ (participant.name?.[0] || '?').toUpperCase() }}</span>
                </div>
                <div class="flex-1 min-w-0 text-left">
                  <p class="font-semibold text-primary-900 dark:text-primary-100 text-sm truncate">{{ participant.name }}</p>
                  <p class="text-xs text-primary-500 dark:text-primary-400">{{ participant.setsCompleted || 0 }} series completees</p>
                </div>
                <svg class="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
            </div>

            <!-- Actions -->
            <div class="space-y-3">
              <button @click="navigateTo('/workouts')" class="btn-primary w-full py-4 text-lg">
                Terminer
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Exit confirmation modal -->
    <Teleport to="body">
      <div v-if="showExitModal" class="fixed inset-0 z-50 flex items-center justify-center px-6" @click.self="showExitModal = false">
        <div class="fixed inset-0 bg-black/40 backdrop-blur-sm"></div>
        <div class="relative bg-white dark:bg-primary-900 rounded-3xl p-8 max-w-sm w-full shadow-2xl">
          <div class="text-center">
            <div class="w-14 h-14 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-primary-900 dark:text-primary-100 mb-2">Quitter la session ?</h3>
            <p class="text-primary-600 dark:text-primary-400 text-sm mb-6">Les autres participants continueront sans toi.</p>
            <div class="space-y-3">
              <button @click="handleLeaveSession" class="w-full py-3 rounded-2xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors">
                Quitter
              </button>
              <button @click="showExitModal = false" class="w-full py-3 rounded-2xl bg-primary-100 dark:bg-primary-800 text-primary-800 dark:text-primary-200 font-medium hover:bg-primary-200 dark:hover:bg-primary-700 transition-colors">
                Rester
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- End session confirmation modal (host only) -->
    <Teleport to="body">
      <div v-if="showEndModal" class="fixed inset-0 z-50 flex items-center justify-center px-6" @click.self="showEndModal = false">
        <div class="fixed inset-0 bg-black/40 backdrop-blur-sm"></div>
        <div class="relative bg-white dark:bg-primary-900 rounded-3xl p-8 max-w-sm w-full shadow-2xl">
          <div class="text-center">
            <div class="w-14 h-14 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-primary-900 dark:text-primary-100 mb-2">Terminer la session ?</h3>
            <p class="text-primary-600 dark:text-primary-400 text-sm mb-6">La session sera terminee pour tous les participants.</p>
            <div class="space-y-3">
              <button @click="handleEndSession" :disabled="isEnding" class="w-full py-3 rounded-2xl bg-gradient-primary text-white font-medium transition-colors disabled:opacity-50">
                {{ isEnding ? 'En cours...' : 'Terminer pour tous' }}
              </button>
              <button @click="showEndModal = false" class="w-full py-3 rounded-2xl bg-primary-100 dark:bg-primary-800 text-primary-800 dark:text-primary-200 font-medium hover:bg-primary-200 dark:hover:bg-primary-700 transition-colors">
                Continuer
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { useWorkoutStore } from '~/stores/workout'
import { useAuthStore } from '~/stores/auth'
import type { Workout, Exercise } from '~/types/workout'

useHead({ meta: [{ name: 'robots', content: 'noindex, nofollow' }] })

const route = useRoute()
const workoutStore = useWorkoutStore()
const authStore = useAuthStore()
const sessionApi = useSessionApi()
const { connect, disconnect, getSocket, connected: socketConnected } = useSocket()
const toast = useToast()

// Route params
const workoutId = computed(() => Number(route.params.id))
const sessionId = computed(() => Number(route.query.session))
const sessionCode = computed(() => (route.query.code as string) || '')

// Core state
const workout = ref<Workout | null>(null)
const isLoading = ref(true)
const session = ref<any>(null)
const participants = ref<any[]>([])
const currentTurnIndex = ref(0)
const currentExerciseIndex = ref(0)
const currentSetNumber = ref(1)
const completedSets = ref<Array<{ reps: number; weight: number }>>([])
const totalGroupSets = ref(0)

// UI state
const showCountdown = ref(true)
const countdownNumber = ref<number | string>(3)
const showRestTimer = ref(false)
const restTimeRemaining = ref(60)
const restDuration = ref(60)
const restInterval = ref<ReturnType<typeof setInterval> | null>(null)
const isPaused = ref(false)
const pauseReason = ref('')
const showDisconnectWarning = ref(false)
const disconnectedParticipantName = ref('')
const showCompletionScreen = ref(false)
const showExitModal = ref(false)
const showEndModal = ref(false)
const isEnding = ref(false)
const myRestRemaining = ref(0)
const myRestInterval = ref<ReturnType<typeof setInterval> | null>(null)

// Timer
const elapsedTime = ref(0)
const timerInterval = ref<ReturnType<typeof setInterval> | null>(null)

// Set data
const currentSetData = ref({ reps: 10, weight: 20 })

// Computed
const isHost = computed(() => {
  if (!session.value || !authStore.user) return false
  return session.value.hostId === authStore.user.id
})

const isLocalMode = computed(() => {
  // Local mode: multiple participants on same device (some joined via join-local)
  return participants.value.filter(p => p.isLocal).length > 0
})

const activeParticipants = computed(() => {
  return participants.value.filter(p => !p.finished)
})

const currentTurnParticipant = computed(() => {
  return activeParticipants.value[currentTurnIndex.value] || null
})

const activeTurnParticipant = computed(() => {
  return currentTurnParticipant.value
})

const isMyTurn = computed(() => {
  if (isLocalMode.value) return true // In local mode, always show inputs
  if (!currentTurnParticipant.value || !authStore.user) return false
  return currentTurnParticipant.value.userId === authStore.user.id
})

const myParticipant = computed(() => {
  return participants.value.find(p => p.userId === authStore.user?.id)
})

const currentExercise = computed(() => {
  if (!workout.value?.exercises || workout.value.exercises.length === 0) return null
  return workout.value.exercises[currentExerciseIndex.value]
})

const progress = computed(() => {
  if (!workout.value?.exercises) return 0
  const totalExercises = workout.value.exercises.length
  const totalSetsAll = workout.value.exercises.reduce((sum: number, ex: any) => sum + (ex.targetSets || 3), 0)
  const completedSetsCount = workout.value.exercises.slice(0, currentExerciseIndex.value).reduce((sum: number, ex: any) => sum + (ex.targetSets || 3), 0) + (currentSetNumber.value - 1)
  return Math.min(100, Math.round((completedSetsCount / totalSetsAll) * 100))
})

const nextButtonLabel = computed(() => {
  const totalSets = currentExercise.value?.targetSets || 3
  const isLastSet = currentSetNumber.value >= totalSets
  const isLastExercise = currentExerciseIndex.value >= (workout.value?.exercises?.length || 1) - 1
  if (isLastSet && isLastExercise) return 'Terminer'
  if (isLastSet) return 'Exercice suivant'
  return 'Valider'
})

const formattedTime = computed(() => {
  const hours = Math.floor(elapsedTime.value / 3600)
  const minutes = Math.floor((elapsedTime.value % 3600) / 60)
  const seconds = elapsedTime.value % 60
  if (hours > 0) return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
})

const restCircumference = 2 * Math.PI * 105
const restProgressOffset = computed(() => {
  if (restDuration.value === 0) return 0
  const progress = restTimeRemaining.value / restDuration.value
  return restCircumference * (1 - progress)
})

// Methods
const formatRestTime = (seconds: number) => {
  const m = Math.floor(Math.abs(seconds) / 60)
  const s = Math.abs(seconds) % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

const startCountdown = () => {
  showCountdown.value = true
  countdownNumber.value = 3
  const interval = setInterval(() => {
    if (countdownNumber.value === 1) {
      countdownNumber.value = 'GO!'
      setTimeout(() => {
        showCountdown.value = false
        clearInterval(interval)
        startGlobalTimer()
      }, 600)
    } else if (typeof countdownNumber.value === 'number') {
      countdownNumber.value--
    }
  }, 800)
}

const startGlobalTimer = () => {
  timerInterval.value = setInterval(() => {
    if (!isPaused.value) {
      elapsedTime.value++
    }
  }, 1000)
}

const startRestTimer = (duration: number) => {
  restDuration.value = duration
  restTimeRemaining.value = duration
  showRestTimer.value = true

  if (restInterval.value) clearInterval(restInterval.value)
  restInterval.value = setInterval(() => {
    if (isPaused.value) return
    restTimeRemaining.value--
    if (restTimeRemaining.value <= 0) {
      clearInterval(restInterval.value!)
      restInterval.value = null
      showRestTimer.value = false
    }
  }, 1000)
}

const startMyBackgroundRest = (duration: number) => {
  myRestRemaining.value = duration
  if (myRestInterval.value) clearInterval(myRestInterval.value)
  myRestInterval.value = setInterval(() => {
    if (isPaused.value) return
    myRestRemaining.value--
    if (myRestRemaining.value <= 0) {
      clearInterval(myRestInterval.value!)
      myRestInterval.value = null
    }
  }, 1000)

  // Update participant state
  const me = participants.value.find(p => p.userId === authStore.user?.id)
  if (me) me.restRemaining = duration
}

const updateParticipantRestTimers = () => {
  // Decrement all participant rest timers each second (handled per-participant via socket events)
}

const addRestTime = (seconds: number) => {
  restTimeRemaining.value = Math.max(0, restTimeRemaining.value + seconds)
}

const skipRest = () => {
  if (restInterval.value) {
    clearInterval(restInterval.value)
    restInterval.value = null
  }
  restTimeRemaining.value = 0
  showRestTimer.value = false
}

const validateCurrentSet = async () => {
  if (!workout.value || !currentExercise.value) return

  const setData = {
    reps: currentSetData.value.reps,
    weight: currentSetData.value.weight,
    setNumber: currentSetNumber.value
  }

  // Save set
  try {
    await workoutStore.addSet(workout.value.id, currentExercise.value.id, {
      reps: setData.reps,
      weight: setData.weight,
      setNumber: setData.setNumber
    })
  } catch (err) {
    // Continue even if save fails
  }

  // Add to completed sets display
  completedSets.value.push({ reps: setData.reps, weight: setData.weight })
  totalGroupSets.value++

  // Emit via WebSocket
  const socket = getSocket()
  if (socket) {
    socket.emit('session:set-validated', {
      sessionCode: sessionCode.value,
      userId: authStore.user?.id,
      exerciseIndex: currentExerciseIndex.value,
      setNumber: currentSetNumber.value,
      reps: setData.reps,
      weight: setData.weight
    })
  }

  // Calculate rest duration
  const exerciseRestTime = currentExercise.value.restTime || 90
  const totalSets = currentExercise.value.targetSets || 3
  const isLastSet = currentSetNumber.value >= totalSets
  const isLastExercise = currentExerciseIndex.value >= (workout.value.exercises?.length || 1) - 1

  if (isLastSet && isLastExercise) {
    // This participant finished
    handleMyFinished()
    return
  }

  // Move to next set or exercise
  if (isLastSet) {
    currentExerciseIndex.value++
    currentSetNumber.value = 1
    completedSets.value = []
  } else {
    currentSetNumber.value++
  }

  // Pre-fill next set defaults
  prefillSetData()

  // Start rest & move turn to next
  if (!isLocalMode.value) {
    // Multi-phone mode: start background rest and pass turn
    startMyBackgroundRest(exerciseRestTime)
    moveTurnToNext()
  } else {
    // Local mode: show rest timer then move turn
    startRestTimer(exerciseRestTime)
    // After rest, move turn
    const waitForRest = setInterval(() => {
      if (!showRestTimer.value) {
        clearInterval(waitForRest)
        moveTurnToNext()
      }
    }, 500)
  }
}

const skipCurrentSet = () => {
  const totalSets = currentExercise.value?.targetSets || 3
  const isLastSet = currentSetNumber.value >= totalSets
  const isLastExercise = currentExerciseIndex.value >= (workout.value?.exercises?.length || 1) - 1

  if (isLastSet && isLastExercise) {
    handleMyFinished()
    return
  }

  if (isLastSet) {
    currentExerciseIndex.value++
    currentSetNumber.value = 1
    completedSets.value = []
  } else {
    currentSetNumber.value++
  }

  prefillSetData()
  moveTurnToNext()
}

const moveTurnToNext = () => {
  if (activeParticipants.value.length === 0) {
    showCompletionScreen.value = true
    return
  }

  let nextIndex = (currentTurnIndex.value + 1) % activeParticipants.value.length
  currentTurnIndex.value = nextIndex

  // Emit turn change
  const socket = getSocket()
  if (socket) {
    socket.emit('session:turn-change', {
      sessionCode: sessionCode.value,
      turnIndex: nextIndex,
      turnUserId: activeParticipants.value[nextIndex]?.userId
    })
  }
}

const handleMyFinished = () => {
  const me = participants.value.find(p => p.userId === authStore.user?.id)
  if (me) me.finished = true

  const socket = getSocket()
  if (socket) {
    socket.emit('session:participant-finished', {
      sessionCode: sessionCode.value,
      userId: authStore.user?.id
    })
  }

  // Check if everyone is done
  if (activeParticipants.value.length === 0) {
    showCompletionScreen.value = true
  } else {
    // Remove me from rotation, move turn
    if (isMyTurn.value) {
      moveTurnToNext()
    }
  }
}

const prefillSetData = () => {
  if (currentExercise.value) {
    currentSetData.value.reps = currentExercise.value.targetReps || 10
    currentSetData.value.weight = currentExercise.value.targetWeight || 20
  }
}

const confirmExit = () => { showExitModal.value = true }
const confirmEnd = () => { showEndModal.value = true }

const handleLeaveSession = async () => {
  showExitModal.value = false
  try {
    await sessionApi.leaveSession(sessionId.value)
  } catch { /* ignore */ }
  cleanup()
  navigateTo('/workouts')
}

const handleEndSession = async () => {
  isEnding.value = true
  try {
    await sessionApi.endSession(sessionId.value)
    // Socket event will trigger completion screen
  } catch (err: any) {
    toast.error('Erreur', 'Impossible de terminer la session')
  } finally {
    isEnding.value = false
    showEndModal.value = false
  }
}

const handleResume = async () => {
  try {
    await sessionApi.resumeSession(sessionId.value)
  } catch (err: any) {
    toast.error('Erreur', 'Impossible de reprendre')
  }
}

const setupSocket = async () => {
  if (!authStore.token) return
  const socket = await connect(authStore.token)
  if (!socket) return

  socket.emit('session:join', { sessionCode: sessionCode.value })

  socket.on('session:set-validated', (data: any) => {
    // Update the participant's state
    const participant = participants.value.find(p => p.userId === data.userId)
    if (participant) {
      participant.setsCompleted = (participant.setsCompleted || 0) + 1
      participant.currentExerciseName = data.exerciseName
    }
    totalGroupSets.value++
  })

  socket.on('session:turn-change', (data: any) => {
    currentTurnIndex.value = data.turnIndex
    // If it's now my turn and my rest is done, ready to go
    // If my rest is still going, show rest timer
    if (isMyTurn.value && myRestRemaining.value > 0) {
      startRestTimer(myRestRemaining.value)
    }
  })

  socket.on('session:timer-update', (data: any) => {
    if (data.userId && data.restRemaining !== undefined) {
      const participant = participants.value.find(p => p.userId === data.userId)
      if (participant) participant.restRemaining = data.restRemaining
    }
  })

  socket.on('session:paused', (data: any) => {
    isPaused.value = true
    pauseReason.value = data?.reason || ''
  })

  socket.on('session:resumed', () => {
    isPaused.value = false
    pauseReason.value = ''
  })

  socket.on('session:participant-finished', (data: any) => {
    const participant = participants.value.find(p => p.userId === data.userId)
    if (participant) participant.finished = true

    // Check if all done
    if (activeParticipants.value.length === 0) {
      showCompletionScreen.value = true
    }
  })

  socket.on('session:participant-disconnected', (data: any) => {
    const p = participants.value.find((pp: any) => pp.userId === data.userId)
    disconnectedParticipantName.value = p?.firstName || p?.username || 'Un participant'
    showDisconnectWarning.value = true
    isPaused.value = true
    pauseReason.value = `${disconnectedParticipantName.value} s'est deconnecte`

    setTimeout(() => { showDisconnectWarning.value = false }, 5000)
  })

  socket.on('session:ended', () => {
    showCompletionScreen.value = true
  })

  // Periodic rest timer sync
  const restSyncInterval = setInterval(() => {
    const me = participants.value.find(p => p.userId === authStore.user?.id)
    if (me && socket.connected) {
      socket.emit('session:timer-update', {
        sessionCode: sessionCode.value,
        userId: authStore.user?.id,
        restRemaining: myRestRemaining.value
      })
    }
  }, 2000)

  // Cleanup on unmount
  const cleanupRestSync = () => clearInterval(restSyncInterval)
  onUnmounted(cleanupRestSync)
}

const loadWorkout = async () => {
  isLoading.value = true
  try {
    const data = await workoutStore.fetchWorkoutById(workoutId.value)
    workout.value = data
    prefillSetData()
  } catch (err) {
    toast.error('Erreur', 'Impossible de charger le workout')
  } finally {
    isLoading.value = false
  }
}

const loadSession = async () => {
  try {
    const data = await sessionApi.getSession(sessionCode.value) as any
    session.value = data.session || data
    participants.value = (data.participants || data.session?.participants || []).map((p: any) => ({
      ...p,
      restRemaining: 0,
      finished: false,
      setsCompleted: 0,
      isLocal: p.isLocal || false
    }))
  } catch (err) {
    // Session data may not be critical
  }
}

const cleanup = () => {
  if (timerInterval.value) clearInterval(timerInterval.value)
  if (restInterval.value) clearInterval(restInterval.value)
  if (myRestInterval.value) clearInterval(myRestInterval.value)
  disconnect()
}

onMounted(async () => {
  await Promise.all([loadWorkout(), loadSession()])
  await setupSocket()
  startCountdown()
})

onUnmounted(() => {
  cleanup()
})

definePageMeta({
  middleware: 'auth'
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
