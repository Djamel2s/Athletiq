<template>
  <div class="min-h-screen">
    <!-- Countdown 3-2-1-GO -->
    <div v-if="showCountdown" class="fixed inset-0 bg-white dark:bg-primary-900 z-50 flex items-center justify-center">
      <div class="text-center">
        <div class="text-7xl md:text-9xl font-bold text-primary-900 dark:text-primary-100 animate-pulse">
          {{ countdownNumber }}
        </div>
        <p class="text-2xl text-primary-600 dark:text-primary-400 mt-4">Prépare-toi...</p>
      </div>
    </div>

    <!-- Header fixe -->
    <div class="fixed top-0 left-0 right-0 z-50 nav-blur">
      <div class="max-w-3xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <button @click="confirmExit" class="text-primary-700 dark:text-primary-300 p-2 hover:text-primary-900 dark:hover:text-primary-100">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>

          <div class="text-center">
            <div class="text-2xl font-bold text-primary-900 dark:text-primary-100 font-mono">{{ formattedTime }}</div>
            <p class="text-xs text-primary-600 dark:text-primary-400">{{ workout?.name }}</p>
          </div>

          <button
            @click="confirmComplete"
            class="btn-primary text-sm py-2 px-4"
          >
            Terminer
          </button>
        </div>
      </div>
    </div>

    <!-- Contenu principal -->
    <div class="pt-24 pb-20 px-4 max-w-3xl mx-auto">
      <div v-if="isLoading" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary-200 dark:border-primary-700 border-t-primary-600 dark:border-t-primary-400"></div>
        <p class="mt-4 text-primary-600 dark:text-primary-400 text-lg">Chargement...</p>
      </div>

      <div v-else-if="!workout || !currentExercise" class="text-center py-20">
        <p class="text-primary-900 dark:text-primary-100 text-lg">Workout introuvable</p>
      </div>

      <div v-else class="space-y-4">
        <!-- Progress -->
        <div class="text-center mb-6">
          <p class="text-sm text-primary-600 dark:text-primary-400 mb-2">
            Exercice {{ currentExerciseIndex + 1 }} / {{ workout.exercises?.length || 0 }}
            · Série {{ currentSetNumber }} / {{ currentExercise.targetSets || 3 }}
          </p>
          <div class="w-full bg-primary-200 dark:bg-primary-700 rounded-full h-2">
            <div
              class="bg-gradient-primary h-2 rounded-full transition-all duration-300"
              :style="{ width: `${progress}%` }"
            ></div>
          </div>
        </div>

        <!-- Nom exercice -->
        <h1 class="text-xl md:text-3xl font-bold text-primary-900 dark:text-primary-100 text-center mb-4">
          {{ currentExercise.exerciseLibrary?.name || currentExercise.name }}
        </h1>

        <!-- GIF/Image exercice (caché pendant le repos) -->
        <div v-if="!showRestTimer" class="card-glass overflow-hidden mb-4">
          <div v-if="currentExercise.exerciseLibrary?.imageUrl || currentExercise.exerciseLibrary?.videoUrl">
            <img
              v-if="currentExercise.exerciseLibrary.imageUrl"
              :src="currentExercise.exerciseLibrary.imageUrl"
              :alt="currentExercise.exerciseLibrary.name"
              class="w-full h-48 md:h-64 object-cover rounded-2xl"
            />
            <video
              v-else-if="currentExercise.exerciseLibrary.videoUrl"
              :src="currentExercise.exerciseLibrary.videoUrl"
              loop
              autoplay
              muted
              playsinline
              class="w-full h-48 md:h-64 object-cover rounded-2xl"
            />
          </div>
          <div v-else class="h-48 md:h-64 flex items-center justify-center bg-primary-100 dark:bg-primary-800">
            <p class="text-primary-500 dark:text-primary-400">Aucune image disponible</p>
          </div>
        </div>

        <!-- Weight progression suggestion -->
        <div v-if="weightSuggestion && currentSetNumber === 1" class="rounded-2xl p-4 bg-gradient-to-r from-[#d4c4b0]/15 to-[#b8a48f]/15 border border-[#d4c4b0]/30 dark:border-[#b8a48f]/20">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-sm font-semibold text-primary-900 dark:text-primary-100">{{ weightSuggestion.message }}</p>
            </div>
            <button @click="applyWeightSuggestion" class="btn-primary text-xs py-2 px-3 whitespace-nowrap">
              Appliquer
            </button>
          </div>
        </div>

        <!-- Série actuelle (en haut maintenant) -->
        <div class="card-glass space-y-6">
          <div class="text-center">
            <p class="text-primary-900 dark:text-primary-100 font-bold text-xl mb-2">Série {{ currentSetNumber }}</p>
            <p class="text-primary-600 dark:text-primary-400 text-sm">Entre tes performances</p>
          </div>

          <div class="flex gap-4">
            <div class="flex-1">
              <label class="block text-primary-900 dark:text-primary-100 text-sm mb-2 text-center font-semibold">Répétitions</label>
              <input
                v-model.number="currentSetData.reps"
                type="number"
                :disabled="showRestTimer"
                class="w-full px-4 py-6 input text-center text-primary-900 dark:text-primary-100 text-3xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="10"
              />
            </div>

            <div class="flex-1">
              <label class="block text-primary-900 dark:text-primary-100 text-sm mb-2 text-center font-semibold">Poids (kg)</label>
              <input
                v-model.number="currentSetData.weight"
                type="number"
                step="0.5"
                :disabled="showRestTimer"
                class="w-full px-4 py-6 input text-center text-primary-900 dark:text-primary-100 text-3xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="20"
              />
            </div>
          </div>

          <button
            @click="validateCurrentSet"
            :disabled="showRestTimer"
            class="btn-primary w-full text-xl py-5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ nextButtonLabel }}
          </button>
        </div>

        <!-- Historique -->
        <div v-if="exerciseHistory?.lastSets && exerciseHistory.lastSets.length > 0"
             class="card-glass bg-opacity-60">
          <p class="text-sm text-primary-900 dark:text-primary-100 font-semibold mb-3">Dernière fois:</p>
          <div class="flex gap-2 overflow-x-auto">
            <div
              v-for="(set, idx) in exerciseHistory.lastSets"
              :key="idx"
              class="flex-shrink-0 bg-primary-100 dark:bg-primary-800 rounded-lg p-3 text-center border border-primary-200 dark:border-primary-700 min-w-[80px]"
            >
              <p class="text-xs text-primary-600 dark:text-primary-400 mb-1">S{{ set.setNumber || (idx + 1) }}</p>
              <p class="text-primary-900 dark:text-primary-100 font-bold">{{ set.reps }}×{{ set.weight }}kg</p>
            </div>
          </div>
        </div>

        <!-- Séries complétées -->
        <div v-if="completedSets.length > 0" class="space-y-2">
          <p class="text-sm text-primary-900 dark:text-primary-100 font-semibold">Séries complétées:</p>
          <div
            v-for="(set, idx) in completedSets"
            :key="idx"
            class="card-glass bg-opacity-60 p-4 flex items-center justify-between"
          >
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                {{ idx + 1 }}
              </div>
              <span class="text-primary-900 dark:text-primary-100 font-bold">{{ set.reps }} reps × {{ set.weight }} kg</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Écran plein écran de repos -->
    <Transition name="fade">
      <div v-if="showRestTimer" class="fixed inset-0 z-50 bg-white dark:bg-primary-900 flex flex-col items-center justify-center">
        <!-- Exercice suivant info -->
        <p class="text-sm text-primary-500 dark:text-primary-400 mb-2 tracking-widest uppercase">Repos</p>
        <p class="text-lg font-semibold text-primary-700 dark:text-primary-300 mb-10">
          {{ currentExercise?.exerciseLibrary?.name || currentExercise?.name }}
        </p>

        <!-- Cercle de progression avec timer -->
        <div class="relative mb-12">
          <svg class="transform -rotate-90" width="240" height="240">
            <circle
              cx="120" cy="120" r="105"
              stroke="currentColor"
              class="text-primary-100 dark:text-primary-800"
              stroke-width="10"
              fill="none"
            />
            <circle
              cx="120" cy="120" r="105"
              stroke="url(#restGradient)"
              stroke-width="10"
              fill="none"
              :stroke-dasharray="restCircumference"
              :stroke-dashoffset="restProgressOffset"
              stroke-linecap="round"
              class="transition-all duration-1000 ease-linear"
            />
            <defs>
              <linearGradient id="restGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#d4c4b0;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#b8a48f;stop-opacity:1" />
              </linearGradient>
            </defs>
          </svg>
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="text-7xl font-light text-primary-900 dark:text-primary-100 tabular-nums" style="font-family: 'SF Pro Display', system-ui, -apple-system, sans-serif; letter-spacing: -2px;">
              {{ formatRestTime(restTimeRemaining) }}
            </div>
          </div>
        </div>

        <!-- Boutons -->
        <div class="flex gap-4">
          <button @click="skipRest" class="btn-outline px-8 py-3 text-base">
            Passer
          </button>
          <button @click="addRestTime(30)" class="btn-primary px-8 py-3 text-base">
            +30s
          </button>
        </div>

        <!-- Série info en bas -->
        <div class="absolute bottom-8 text-center">
          <p class="text-sm text-primary-400 dark:text-primary-500">
            Série {{ currentSetNumber }} / {{ currentExercise?.targetSets || 3 }}
          </p>
          <p class="text-xs text-primary-300 dark:text-primary-600 mt-1">
            {{ restDuration >= 150 ? 'Exercice composé lourd' : restDuration >= 120 ? 'Exercice composé' : restDuration >= 90 ? 'Charge lourde' : 'Isolation' }}
            · {{ restDuration }}s recommandé
          </p>
        </div>
      </div>
    </Transition>

    <!-- Écran de fin d'entraînement -->
    <Transition name="fade">
      <div v-if="showCompletionScreen" class="fixed inset-0 z-50 bg-white dark:bg-primary-900 overflow-y-auto">
        <div class="min-h-full flex items-center justify-center py-12 px-4">
          <div class="max-w-md w-full text-center space-y-8">
            <!-- Check icon -->
            <div class="w-24 h-24 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
              <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
              </svg>
            </div>

            <div>
              <h2 class="text-3xl font-bold text-primary-900 dark:text-primary-100 mb-2">Bravo !</h2>
              <p class="text-primary-600 dark:text-primary-400">Entraînement terminé avec succès</p>
            </div>

            <!-- Résumé -->
            <div class="grid grid-cols-3 gap-4">
              <div class="card-glass !p-2 md:!p-4">
                <p class="text-2xl font-bold text-primary-900 dark:text-primary-100">{{ formattedTime }}</p>
                <p class="text-xs text-primary-500 dark:text-primary-400 mt-1">Durée</p>
              </div>
              <div class="card-glass !p-2 md:!p-4">
                <p class="text-2xl font-bold text-primary-900 dark:text-primary-100">{{ completionCalories }}</p>
                <p class="text-xs text-primary-500 dark:text-primary-400 mt-1">kcal</p>
              </div>
              <div class="card-glass !p-2 md:!p-4">
                <p class="text-2xl font-bold text-primary-900 dark:text-primary-100">{{ workout?.exercises?.length || 0 }}</p>
                <p class="text-xs text-primary-500 dark:text-primary-400 mt-1">Exercices</p>
              </div>
            </div>

            <!-- Share receipt button -->
            <button
              @click="showReceiptModal = true"
              class="btn-outline w-full flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
              </svg>
              Partager mon reçu de séance
            </button>

            <!-- Upload photo -->
            <div class="card-glass !p-6 space-y-4">
              <div class="flex items-center justify-center gap-3">
                <svg class="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <h3 class="text-lg font-bold text-primary-900 dark:text-primary-100">Photo de progression</h3>
              </div>
              <p class="text-sm text-primary-500 dark:text-primary-400">
                Prends une photo pour suivre ta transformation
              </p>

              <!-- Preview -->
              <div v-if="photoPreview" class="relative">
                <img :src="photoPreview" class="w-full h-48 object-cover rounded-xl" alt="Preview" />
                <button
                  @click="removePhoto"
                  class="absolute top-2 right-2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>

              <!-- Upload button -->
              <div v-if="!photoPreview">
                <input
                  ref="photoInput"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  class="hidden"
                  @change="onPhotoSelected"
                />
                <button @click="photoInput?.click()" class="btn-outline w-full flex items-center justify-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  Prendre une photo
                </button>
              </div>

              <!-- Primary toggle -->
              <label v-if="photoPreview" class="flex items-center gap-3 cursor-pointer">
                <input v-model="photoIsPrimary" type="checkbox" class="w-5 h-5 rounded border-primary-300 dark:border-primary-600 text-[#b8a48f] focus:ring-[#b8a48f]" />
                <span class="text-sm text-primary-700 dark:text-primary-300">Photo principale (timelapse)</span>
              </label>
            </div>

            <!-- Actions -->
            <div class="space-y-3">
              <button
                v-if="photoPreview"
                @click="savePhotoAndExit"
                :disabled="isUploadingPhoto"
                class="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2"
              >
                <div v-if="isUploadingPhoto" class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                {{ isUploadingPhoto ? 'Envoi en cours...' : 'Sauvegarder et terminer' }}
              </button>
              <button
                v-else
                @click="exitCompletion"
                class="btn-primary w-full py-4 text-lg"
              >
                Terminer
              </button>
              <button
                v-if="photoPreview"
                @click="exitCompletion"
                class="text-primary-500 dark:text-primary-400 text-sm hover:text-primary-700 dark:hover:text-primary-200 transition-colors"
              >
                Passer sans sauvegarder la photo
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
    <!-- Receipt Share Modal -->
    <Teleport to="body">
      <div v-if="showReceiptModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showReceiptModal = false"></div>
        <div class="relative bg-white dark:bg-primary-900 rounded-2xl p-4 md:p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-primary-200 dark:border-primary-700">
          <button @click="showReceiptModal = false" class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors">
            <svg class="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
          <h3 class="text-xl font-bold text-primary-900 dark:text-primary-100 mb-4">Reçu de séance</h3>
          <ShareCard type="receipt" title="Mon entraînement Athletiq" :data="receiptData" />
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { useWorkoutStore } from '~/stores/workout'
import { useAuthStore } from '~/stores/auth'
import type { Workout, Exercise, Set } from '~/types/workout'

const route = useRoute()
const workoutStore = useWorkoutStore()
const authStore = useAuthStore()

const workout = ref<Workout | null>(null)
const isLoading = ref(true)
const currentExerciseIndex = ref(0)
const currentSetNumber = ref(1)
const exerciseHistory = ref<{ lastSets: Set[], lastWorkoutDate: string | null } | null>(null)
const completedSets = ref<Array<{ reps: number, weight: number }>>([])

const showCountdown = ref(true)
const countdownNumber = ref<number | string>(3)

const currentSetData = ref({
  reps: 10,
  weight: 20
})

const showRestTimer = ref(false)
const restTimeRemaining = ref(60)
const restDuration = ref(60)
let restInterval: NodeJS.Timeout | null = null

const elapsedTime = ref(0)
let timerInterval: NodeJS.Timeout | null = null

const currentExercise = computed(() => {
  if (!workout.value?.exercises || workout.value.exercises.length === 0) return null
  return workout.value.exercises[currentExerciseIndex.value]
})

const totalSets = computed(() => currentExercise.value?.targetSets || 3)

// Cercle de progression pour le timer (rayon = 105)
const restCircumference = computed(() => 2 * Math.PI * 105)

const restProgressOffset = computed(() => {
  const progress = restTimeRemaining.value / restDuration.value
  return restCircumference.value * (1 - progress)
})

const progress = computed(() => {
  if (!workout.value?.exercises) return 0

  const totalExercises = workout.value.exercises.length
  const exercisesCompleted = currentExerciseIndex.value
  const setsCompleted = completedSets.value.length
  const currentExerciseTotalSets = totalSets.value

  const totalSteps = totalExercises * 3
  const completedSteps = exercisesCompleted * 3 + setsCompleted

  return Math.min((completedSteps / totalSteps) * 100, 100)
})

const nextButtonLabel = computed(() => {
  const isLastSet = currentSetNumber.value >= totalSets.value
  const isLastExercise = currentExerciseIndex.value >= (workout.value?.exercises?.length || 0) - 1

  if (isLastSet && isLastExercise) {
    return "Terminer l'entraînement"
  } else if (isLastSet) {
    return "Exercice suivant"
  } else {
    return "Suivant"
  }
})

const formattedTime = computed(() => {
  const hours = Math.floor(elapsedTime.value / 3600)
  const minutes = Math.floor((elapsedTime.value % 3600) / 60)
  const seconds = elapsedTime.value % 60

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
})

onMounted(async () => {
  authStore.loadFromLocalStorage()
  if (!authStore.isAuthenticated) {
    navigateTo('/login')
    return
  }

  const workoutId = parseInt(route.params.id as string)
  await loadWorkout(workoutId)

  await startCountdown()

  timerInterval = setInterval(() => {
    elapsedTime.value++
  }, 1000)
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
  if (restInterval) clearInterval(restInterval)
})

const startCountdown = () => {
  return new Promise<void>((resolve) => {
    countdownNumber.value = 3

    const countdownInterval = setInterval(() => {
      countdownNumber.value = (countdownNumber.value as number) - 1

      if (countdownNumber.value === 0) {
        countdownNumber.value = 'GO'
        setTimeout(() => {
          showCountdown.value = false
          clearInterval(countdownInterval)
          resolve()
        }, 800)
      }
    }, 1000)
  })
}

const loadWorkout = async (id: number) => {
  isLoading.value = true
  try {
    workout.value = await workoutStore.fetchWorkout(id)

    if (currentExercise.value?.exerciseLibraryId) {
      await loadExerciseHistory(currentExercise.value.exerciseLibraryId)
      prefillCurrentSet()
      checkWeightProgression()
    }
  } catch (error) {
    console.error('Failed to load workout:', error)
  } finally {
    isLoading.value = false
  }
}

const loadExerciseHistory = async (exerciseLibraryId: number) => {
  try {
    const api = useWorkoutApi()
    exerciseHistory.value = await api.getExerciseHistory(exerciseLibraryId)
  } catch (error) {
    console.error('Failed to load exercise history:', error)
    exerciseHistory.value = null
  }
}

// Auto weight progression: suggest increase when all previous sets hit target reps
const weightSuggestion = ref<{ message: string; newWeight: number } | null>(null)

const checkWeightProgression = () => {
  if (!exerciseHistory.value?.lastSets || exerciseHistory.value.lastSets.length === 0) {
    weightSuggestion.value = null
    return
  }

  const lastSets = exerciseHistory.value.lastSets
  const exercise = currentExercise.value
  if (!exercise) return

  const targetReps = exercise.targetReps || 10
  // Check if ALL sets from last time met or exceeded target reps
  const allSetsHitTarget = lastSets.every(s => (s.reps || 0) >= targetReps)

  if (allSetsHitTarget && lastSets.length > 0) {
    const lastWeight = lastSets[0].weight || 0
    // Upper body: +2.5kg, Lower body: +5kg
    const lib = exercise.exerciseLibrary
    const isLowerBody = lib?.muscleGroups?.some((mg: string) =>
      ['LEGS', 'QUADS', 'HAMSTRINGS', 'GLUTES', 'CALVES'].includes(mg)
    ) ?? false
    const increment = isLowerBody ? 5 : 2.5
    const newWeight = lastWeight + increment

    weightSuggestion.value = {
      message: `Toutes les séries réussies ! Essaie ${newWeight} kg (+${increment})`,
      newWeight
    }
  } else {
    weightSuggestion.value = null
  }
}

const applyWeightSuggestion = () => {
  if (weightSuggestion.value) {
    currentSetData.value.weight = weightSuggestion.value.newWeight
    weightSuggestion.value = null
  }
}

const prefillCurrentSet = () => {
  console.log('🔄 prefillCurrentSet - Série:', currentSetNumber.value)
  console.log('📋 lastSets:', exerciseHistory.value?.lastSets)
  console.log('🎯 plannedSets:', currentExercise.value?.plannedSets)

  // 1. Priorité MAXIMALE: historique de l'exercice (ce que tu as fait la dernière fois)
  if (exerciseHistory.value?.lastSets && exerciseHistory.value.lastSets.length > 0) {
    // D'abord, chercher le set avec le bon setNumber
    let lastSet = exerciseHistory.value.lastSets.find(
      (s) => s.setNumber === currentSetNumber.value
    )

    // Si pas trouvé par setNumber, utiliser l'index (série 1 = index 0, série 2 = index 1, etc.)
    if (!lastSet) {
      const setIndex = currentSetNumber.value - 1
      lastSet = exerciseHistory.value.lastSets[setIndex] ||
                exerciseHistory.value.lastSets[exerciseHistory.value.lastSets.length - 1] // Sinon le dernier
      console.log('🔍 Index', setIndex, '→', lastSet)
    }

    if (lastSet) {
      console.log('✅ HISTORIQUE:', lastSet.reps, '×', lastSet.weight, 'kg')
      currentSetData.value.reps = lastSet.reps || 10
      currentSetData.value.weight = lastSet.weight || 20
      return
    }
  }

  // 2. Sinon: séries planifiées personnalisées
  if (currentExercise.value?.plannedSets && currentExercise.value.plannedSets.length > 0) {
    const plannedSet = currentExercise.value.plannedSets.find(
      (s) => s.setNumber === currentSetNumber.value
    )
    if (plannedSet) {
      console.log('✅ PLANNED:', plannedSet.targetReps, '×', plannedSet.targetWeight, 'kg')
      currentSetData.value.reps = plannedSet.targetReps
      currentSetData.value.weight = plannedSet.targetWeight
      return
    }
  }

  // 3. Sinon: valeurs par défaut de l'exercice
  if (currentExercise.value) {
    console.log('⚠️ DÉFAUT:', currentExercise.value.targetReps || 10, '×', currentExercise.value.targetWeight || 20)
    currentSetData.value.reps = currentExercise.value.targetReps || 10
    currentSetData.value.weight = currentExercise.value.targetWeight || 20
  }
}

const validateCurrentSet = async () => {
  if (!workout.value || !currentExercise.value) return

  try {
    await workoutStore.addSetToExercise(workout.value.id, currentExercise.value.id, {
      setNumber: currentSetNumber.value,
      reps: currentSetData.value.reps,
      weight: currentSetData.value.weight
    })

    completedSets.value.push({
      reps: currentSetData.value.reps,
      weight: currentSetData.value.weight
    })

    const isLastSet = currentSetNumber.value >= totalSets.value
    const isLastExercise = currentExerciseIndex.value >= (workout.value?.exercises?.length || 0) - 1

    if (isLastSet && isLastExercise) {
      await completeWorkout()
    } else if (isLastSet) {
      completedSets.value = []
      currentSetNumber.value = 1
      currentExerciseIndex.value++

      if (currentExercise.value?.exerciseLibraryId) {
        await loadExerciseHistory(currentExercise.value.exerciseLibraryId)
        prefillCurrentSet()
        checkWeightProgression()
      }

      // Smart rest: between exercises
      const smartRest = computeSmartRest(currentExercise.value, currentSetData.value.weight, true)
      startRestTimer(smartRest)
    } else {
      currentSetNumber.value++
      prefillCurrentSet()
      // Smart rest: between sets of same exercise
      const smartRest = computeSmartRest(currentExercise.value, currentSetData.value.weight, false)
      startRestTimer(smartRest)
    }
  } catch (error) {
    console.error('Failed to save set:', error)
  }
}

// Smart rest timer: compute optimal rest based on exercise type and load
const computeSmartRest = (exercise: Exercise | null, weight: number, betweenExercises: boolean): number => {
  if (!exercise) return betweenExercises ? 90 : 60

  // If exercise has a custom restTime, always use it
  if (exercise.restTime) return exercise.restTime

  const lib = exercise.exerciseLibrary
  const muscleCount = lib?.muscleGroups?.length || 1
  const equipment = lib?.equipment || ''
  const isCompound = muscleCount >= 2 || ['BARBELL'].includes(equipment)
  const isHeavy = weight >= 80 // heavy load threshold

  let rest: number

  if (isCompound && isHeavy) {
    rest = 180 // 3min for heavy compounds (squat, deadlift, bench)
  } else if (isCompound) {
    rest = 120 // 2min for compound movements
  } else if (isHeavy) {
    rest = 90 // 1.5min for heavy isolation
  } else {
    rest = 60 // 1min for light isolation
  }

  // Add 30s when switching between exercises
  if (betweenExercises) rest += 30

  return rest
}

const startRestTimer = (duration: number = 60) => {
  showRestTimer.value = true
  restTimeRemaining.value = duration
  restDuration.value = duration

  restInterval = setInterval(() => {
    restTimeRemaining.value--
    if (restTimeRemaining.value <= 0) {
      skipRest()
    }
  }, 1000)
}

const skipRest = () => {
  showRestTimer.value = false
  if (restInterval) {
    clearInterval(restInterval)
    restInterval = null
  }
}

const addRestTime = (seconds: number) => {
  restTimeRemaining.value += seconds
}

const formatRestTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const toast = useToast()

// === Completion screen state ===
const showCompletionScreen = ref(false)
const showReceiptModal = ref(false)
const photoInput = ref<HTMLInputElement | null>(null)
const photoPreview = ref<string | null>(null)
const photoFile = ref<File | null>(null)
const photoIsPrimary = ref(true)
const isUploadingPhoto = ref(false)

const completionCalories = computed(() => Math.round((elapsedTime.value / 60) * 6))

const receiptData = computed(() => {
  const exercises = (workout.value?.exercises || []).map(ex => {
    const sets = ex.sets || []
    const completedSetsCount = sets.length
    const totalVol = sets.reduce((s, set) => s + (set.reps || 0) * (set.weight || 0), 0)
    const setsStr = sets.map(s => `${s.reps}×${s.weight}kg`).join(' · ')
    return {
      name: ex.exerciseLibrary?.name || ex.name,
      sets: setsStr || `${completedSetsCount} séries`,
      volume: totalVol > 0 ? `${totalVol.toLocaleString('fr-FR')} kg` : '—'
    }
  })
  const totalVolume = (workout.value?.exercises || []).reduce((total, ex) => {
    return total + (ex.sets || []).reduce((s, set) => s + (set.reps || 0) * (set.weight || 0), 0)
  }, 0)
  return {
    workoutName: workout.value?.name || 'Entraînement',
    date: workout.value?.completedAt || new Date().toISOString(),
    duration: formattedTime.value,
    calories: completionCalories.value,
    exerciseCount: workout.value?.exercises?.length || 0,
    exercises,
    totalVolume: totalVolume.toLocaleString('fr-FR'),
    userName: authStore.user?.firstName || '',
  }
})

const completeWorkout = async () => {
  if (!workout.value) return

  try {
    await workoutStore.completeWorkout(workout.value.id)
    await workoutStore.fetchWorkouts()
    // Stop the timer
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null }
    if (restInterval) { clearInterval(restInterval); restInterval = null }
    showRestTimer.value = false
    // Show completion screen instead of navigating away
    showCompletionScreen.value = true
  } catch (error) {
    toast.error('Erreur lors de la complétion')
    console.error('Failed to complete workout:', error)
  }
}

const onPhotoSelected = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  photoFile.value = file
  photoPreview.value = URL.createObjectURL(file)
}

const removePhoto = () => {
  if (photoPreview.value) URL.revokeObjectURL(photoPreview.value)
  photoPreview.value = null
  photoFile.value = null
  if (photoInput.value) photoInput.value.value = ''
}

const savePhotoAndExit = async () => {
  if (!photoFile.value || !workout.value) return

  isUploadingPhoto.value = true
  try {
    const bodyApi = useBodyApi()
    await bodyApi.uploadPhoto(workout.value.id, photoFile.value, photoIsPrimary.value)
    toast.success('Photo sauvegardée !')
  } catch (error) {
    console.error('Failed to upload photo:', error)
    toast.error('Erreur lors de l\'envoi de la photo')
  } finally {
    isUploadingPhoto.value = false
    if (photoPreview.value) URL.revokeObjectURL(photoPreview.value)
    navigateTo('/dashboard')
  }
}

const exitCompletion = () => {
  if (photoPreview.value) URL.revokeObjectURL(photoPreview.value)
  navigateTo('/dashboard')
}

const confirmComplete = () => {
  if (confirm('Terminer cet entraînement ?')) {
    completeWorkout()
  }
}

const confirmExit = () => {
  if (confirm('Quitter sans terminer?')) {
    navigateTo('/workouts')
  }
}

definePageMeta({
  middleware: 'auth'
})
</script>
