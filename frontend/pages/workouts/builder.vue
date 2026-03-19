<template>
  <div class="min-h-screen">
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

    <!-- Contenu principal -->
    <div class="pt-24 md:pt-32 px-4 md:px-6 pb-20 max-w-5xl mx-auto">
      <!-- Titre + Annuler -->
      <div class="flex items-center justify-between mb-8 fade-in">
        <h1 class="text-3xl md:text-5xl lg:text-6xl font-bold text-display bg-gradient-to-r from-sand-500 to-primary-900 dark:to-primary-100 bg-clip-text text-transparent">Préparer un Workout</h1>
        <button @click="navigateTo('/workouts')" class="btn-outline text-sm md:text-base">Annuler</button>
      </div>
      <!-- Formulaire du workout -->
      <div class="card-glass mb-8 fade-in">
        <h2 class="text-2xl font-bold text-primary-900 dark:text-primary-100 mb-6">Informations générales</h2>

        <div class="space-y-6">
          <div>
            <label class="block text-sm font-semibold text-primary-700 dark:text-primary-300 mb-2">
              Nom du workout *
            </label>
            <input
              v-model="workoutForm.name"
              type="text"
              placeholder="Ex: Push Day, Full Body, etc."
              class="input-primary w-full"
              maxlength="200"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-primary-700 dark:text-primary-300 mb-2">
              Description (optionnel)
            </label>
            <textarea
              v-model="workoutForm.description"
              placeholder="Décrivez votre entraînement..."
              rows="3"
              class="input-primary w-full"
              maxlength="2000"
            ></textarea>
          </div>
        </div>

        <button
          v-if="!workoutId"
          @click="createWorkout"
          :disabled="!workoutForm.name || isCreating"
          class="btn-primary w-full mt-6"
        >
          {{ isCreating ? 'Création...' : 'Créer le workout' }}
        </button>
      </div>

      <!-- Liste des exercices (si workout créé) -->
      <div v-if="workoutId" class="space-y-6 slide-up">
        <!-- Exercices ajoutés -->
        <div class="card-glass">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-primary-900 dark:text-primary-100">
              Exercices ({{ selectedExercises.length }})
            </h2>
            <div class="flex items-center gap-2">
              <button
                v-if="selectedExercises.length >= 2"
                @click="applyOptimalOrder"
                class="btn-outline text-sm"
                title="Trier les exercices pour un entraînement optimal"
              >
                <svg class="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"/>
                </svg>
                Optimiser l'ordre
              </button>
              <button @click="showExerciseLibrary = true" class="btn-primary">
                + Ajouter un exercice
              </button>
            </div>
          </div>

          <div v-if="selectedExercises.length === 0" class="text-center py-12">
            <p class="text-primary-500 dark:text-primary-400 text-lg mb-4">Aucun exercice ajouté</p>
            <button @click="showExerciseLibrary = true" class="btn-outline">
              Parcourir la bibliothèque
            </button>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="(exercise, index) in selectedExercises"
              :key="exercise.id"
              class="rounded-2xl border border-primary-200/60 dark:border-primary-700/60 bg-white/60 dark:bg-primary-800/60 hover:border-sand-500/40 dark:hover:border-sand-600/30 transition-all overflow-hidden"
            >
              <div class="flex items-stretch">
                <div class="w-12 bg-gradient-primary flex items-center justify-center flex-shrink-0">
                  <span class="text-white font-bold text-sm">{{ index + 1 }}</span>
                </div>
                <div class="flex-1 p-4">
                  <div class="flex items-start justify-between mb-3">
                    <div class="flex-1">
                      <h3 class="text-base md:text-lg font-bold text-primary-900 dark:text-primary-100 mb-1">{{ exercise.exerciseLibrary?.name || exercise.name }}</h3>
                      <div class="flex flex-wrap gap-1.5">
                        <span
                          v-if="exercise.exerciseLibrary?.primaryMuscle"
                          class="px-2 py-0.5 bg-sand-500/10 dark:bg-sand-600/10 text-sand-700 dark:text-sand-400 text-[10px] font-semibold rounded-md uppercase tracking-wider"
                        >
                          {{ formatMuscleGroup(exercise.exerciseLibrary.primaryMuscle) }}
                        </span>
                        <span
                          v-if="exercise.exerciseLibrary?.equipment"
                          class="px-2 py-0.5 bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-primary-400 text-[10px] font-medium rounded-md"
                        >
                          {{ formatEquipment(exercise.exerciseLibrary.equipment) }}
                        </span>
                      </div>
                    </div>
                    <button
                      @click="removeExercise(index)"
                      class="w-8 h-8 flex items-center justify-center rounded-lg text-primary-300 dark:text-primary-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex-shrink-0"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  </div>

                  <!-- Séries -->
                  <div class="space-y-2">
                    <div
                      v-for="(set, setIndex) in getExerciseSets(exercise)"
                      :key="setIndex"
                      class="flex items-center gap-1.5 flex-wrap"
                    >
                      <button
                        @click="removeSet(exercise, Number(setIndex))"
                        type="button"
                        class="w-5 h-5 flex items-center justify-center rounded text-primary-300 dark:text-primary-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex-shrink-0"
                      >
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                        </svg>
                      </button>
                      <span class="text-xs text-primary-500 dark:text-primary-400 font-medium w-12 flex-shrink-0">Série {{ Number(setIndex) + 1 }}</span>
                      <input
                        v-model.number="set.targetReps"
                        type="number"
                        min="1"
                        placeholder="Reps"
                        class="w-14 px-1.5 py-1.5 border border-primary-200 dark:border-primary-700 rounded-lg text-center text-xs font-semibold bg-white dark:bg-primary-900 text-primary-900 dark:text-primary-100 focus:border-sand-500 focus:ring-1 focus:ring-sand-500/30 transition-colors"
                      />
                      <span class="text-[10px] text-primary-400 dark:text-primary-500">reps ×</span>
                      <input
                        v-model.number="set.targetWeight"
                        type="number"
                        min="0"
                        step="0.5"
                        placeholder="kg"
                        class="w-14 px-1.5 py-1.5 border border-primary-200 dark:border-primary-700 rounded-lg text-center text-xs font-semibold bg-white dark:bg-primary-900 text-primary-900 dark:text-primary-100 focus:border-sand-500 focus:ring-1 focus:ring-sand-500/30 transition-colors"
                      />
                      <span class="text-[10px] text-primary-400 dark:text-primary-500">kg</span>
                      <span class="text-[10px] text-primary-300 dark:text-primary-600 mx-0.5">|</span>
                      <input
                        v-model.number="set.restTime"
                        type="number"
                        min="0"
                        step="15"
                        class="w-12 px-1 py-1.5 border border-primary-200 dark:border-primary-700 rounded-lg text-center text-[10px] font-semibold bg-white dark:bg-primary-900 text-primary-900 dark:text-primary-100 focus:border-sand-500 focus:ring-1 focus:ring-sand-500/30 transition-colors"
                      />
                      <span class="text-[10px] text-primary-400 dark:text-primary-500">s</span>
                    </div>
                  </div>

                  <!-- Ajouter une série -->
                  <button
                    @click="addSet(exercise)"
                    type="button"
                    class="mt-2 flex items-center gap-1 text-xs font-medium text-sand-600 dark:text-sand-400 hover:text-sand-800 dark:hover:text-sand-300 transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                    Série {{ getExerciseSets(exercise).length + 1 }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions finales -->
        <div class="card-glass">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 class="text-lg font-semibold text-primary-900 dark:text-primary-100 mb-1">Workout prêt!</h3>
              <p class="text-sm text-primary-600 dark:text-primary-400">
                {{ selectedExercises.length }} exercice(s) ajouté(s) • Ce workout sera disponible dans "Lancer un entrainement" à la salle
              </p>
            </div>

            <div class="flex space-x-4">
              <button @click="navigateTo('/workouts')" class="btn-outline">
                Annuler
              </button>
              <button
                @click="saveWorkout"
                :disabled="selectedExercises.length === 0 || isSaving"
                class="btn-primary"
              >
                <template v-if="isSaving">
                  <svg class="animate-spin h-4 w-4 inline-block mr-2" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Sauvegarde...
                </template>
                <template v-else>
                  <span class="hidden md:inline">Sauvegarder le workout</span>
                  <span class="md:hidden">Sauvegarder</span>
                </template>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Exercise Library Modal -->
    <div
      v-if="showExerciseLibrary"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-6"
      @click.self="showExerciseLibrary = false"
    >
      <div class="bg-white dark:bg-primary-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden mx-2 md:mx-0">
        <div class="p-4 md:p-6 border-b border-primary-200 dark:border-primary-700">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl md:text-2xl font-bold text-primary-900 dark:text-primary-100">Bibliothèque d'exercices</h2>
            <button @click="showExerciseLibrary = false" class="text-primary-500 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Search and filters -->
          <div class="space-y-4">
            <input
              v-model="searchQuery"
              @input="searchExercises"
              type="text"
              placeholder="Rechercher un exercice..."
              class="input-primary w-full"
            />

            <div class="flex flex-col sm:flex-row sm:flex-wrap gap-2">
              <select v-model="filterMuscleGroup" @change="searchExercises" class="input-primary w-full sm:w-auto">
                <option value="">Tous les muscles</option>
                <option value="CHEST">Pectoraux</option>
                <option value="BACK">Dos</option>
                <option value="SHOULDERS">Épaules</option>
                <option value="BICEPS">Biceps</option>
                <option value="TRICEPS">Triceps</option>
                <option value="LEGS">Jambes</option>
                <option value="QUADS">Quadriceps</option>
                <option value="HAMSTRINGS">Ischio-jambiers</option>
                <option value="GLUTES">Fessiers</option>
                <option value="CALVES">Mollets</option>
                <option value="ABS">Abdos</option>
                <option value="CARDIO">Cardio</option>
                <option value="FULL_BODY">Full body</option>
              </select>

              <select v-model="filterEquipment" @change="searchExercises" class="input-primary w-full sm:w-auto">
                <option value="">Tout équipement</option>
                <option value="BARBELL">Barre</option>
                <option value="DUMBBELL">Haltères</option>
                <option value="BODYWEIGHT">Poids du corps</option>
                <option value="MACHINE">Machine</option>
                <option value="CABLE">Câble</option>
                <option value="KETTLEBELL">Kettlebell</option>
                <option value="RESISTANCE_BAND">Élastique</option>
              </select>

              <select v-model="filterDifficulty" @change="searchExercises" class="input-primary w-full sm:w-auto">
                <option value="">Toute difficulté</option>
                <option value="BEGINNER">Débutant</option>
                <option value="INTERMEDIATE">Intermédiaire</option>
                <option value="ADVANCED">Avancé</option>
              </select>
            </div>
          </div>
        </div>

        <div class="p-4 md:p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div v-if="isLoadingExercises" class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-200 dark:border-primary-700 border-t-primary-600 dark:border-t-primary-400"></div>
          </div>

          <div v-else-if="exerciseLibrary.length === 0" class="text-center py-12">
            <p class="text-primary-500 dark:text-primary-400">Aucun exercice trouvé</p>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="exercise in exerciseLibrary"
              :key="exercise.id"
              class="p-4 border border-primary-200 dark:border-primary-700 rounded-xl hover:border-primary-400 dark:hover:border-primary-500 hover:shadow-lg transition-all cursor-pointer"
              @click="addExercise(exercise)"
            >
              <ExerciseAnimation
                :image-id="exercise.imageUrl"
                :name="exercise.name"
                size="sm"
                class="mb-3"
              />
              <h3 class="font-bold text-primary-900 dark:text-primary-100 mb-2">{{ exercise.name }}</h3>
              <p class="text-sm text-primary-600 dark:text-primary-400 mb-3 line-clamp-2">{{ exercise.description }}</p>

              <div class="flex flex-wrap gap-2">
                <span class="px-2 py-1 bg-primary-200 dark:bg-primary-700 text-primary-800 dark:text-primary-200 text-xs font-medium rounded">
                  {{ formatMuscleGroup(exercise.primaryMuscle) }}
                </span>
                <span class="px-2 py-1 bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-300 text-xs font-medium rounded">
                  {{ formatEquipment(exercise.equipment) }}
                </span>
                <span class="px-2 py-1 bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-300 text-xs font-medium rounded">
                  {{ formatDifficulty(exercise.difficulty) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Saved Modal -->
    <Teleport to="body">
      <div v-if="showSavedModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="navigateTo('/workouts')"></div>
        <div class="relative bg-white dark:bg-primary-900 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-primary-200 dark:border-primary-700 text-center">
          <div class="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-primary-900 dark:text-primary-100 mb-2">Workout sauvegardé !</h3>
          <p class="text-primary-600 dark:text-primary-400 mb-6">Votre entraînement est prêt. Vous voulez le lancer maintenant ?</p>
          <div class="flex flex-col sm:flex-row gap-3">
            <button @click="navigateTo('/workouts')" class="flex-1 px-4 py-3 rounded-xl border border-primary-300 dark:border-primary-600 text-primary-700 dark:text-primary-300 font-semibold hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors">
              Plus tard
            </button>
            <button @click="navigateTo(`/workouts/${workoutId}/live`)" class="flex-1 btn-primary !py-3">
              Lancer maintenant
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { useWorkoutStore } from '~/stores/workout'
import { useAuthStore } from '~/stores/auth'
import { optimizeExerciseOrder } from '~/composables/useExerciseOrder'
import type { ExerciseLibrary, Exercise } from '~/types/workout'

useHead({ meta: [{ name: 'robots', content: 'noindex, nofollow' }] })

const workoutStore = useWorkoutStore()
const authStore = useAuthStore()
const toast = useToast()

const workoutForm = ref({
  name: '',
  description: ''
})

const workoutId = ref<number | null>(null)
const isCreating = ref(false)
const selectedExercises = ref<Exercise[]>([])
const showSavedModal = ref(false)
const isSaving = ref(false)

const showExerciseLibrary = ref(false)
const exerciseLibrary = ref<ExerciseLibrary[]>([])
const isLoadingExercises = ref(false)

const searchQuery = ref('')
const filterMuscleGroup = ref('')
const filterEquipment = ref('')
const filterDifficulty = ref('')

// Auth handled by middleware

const createWorkout = async () => {
  if (!workoutForm.value.name?.trim()) return
  workoutForm.value.name = workoutForm.value.name.trim().slice(0, 200)
  workoutForm.value.description = workoutForm.value.description?.trim().slice(0, 2000) || ''

  isCreating.value = true
  try {
    // Tous les workouts sont réutilisables (isTemplate: true)
    const workout = await workoutStore.createWorkout({
      ...workoutForm.value,
      isTemplate: true
    })
    workoutId.value = workout.id
  } catch (error) {
    logger.error('Failed to create workout:', error)
    toast.error('Erreur', 'Impossible de créer le workout')
  } finally {
    isCreating.value = false
  }
}

const searchExercises = async () => {
  isLoadingExercises.value = true
  try {
    const exercises = await workoutStore.fetchExerciseLibrary({
      search: searchQuery.value || undefined,
      muscleGroup: filterMuscleGroup.value || undefined,
      equipment: filterEquipment.value || undefined,
      difficulty: filterDifficulty.value || undefined,
      limit: 50
    })
    exerciseLibrary.value = exercises
  } catch (error) {
    logger.error('Failed to load exercises:', error)
  } finally {
    isLoadingExercises.value = false
  }
}

watch(showExerciseLibrary, (show) => {
  if (show && exerciseLibrary.value.length === 0) {
    searchExercises()
  }
})

const addExercise = async (exercise: ExerciseLibrary) => {
  if (!workoutId.value) return

  try {
    const addedExercise = await workoutStore.addExerciseToWorkout(workoutId.value, {
      exerciseLibraryId: exercise.id,
      name: exercise.name,
      restTime: 60,
      orderIndex: selectedExercises.value.length,
      plannedSets: [{ setNumber: 1, targetReps: 10, targetWeight: 0, restTime: 60 }]
    })

    selectedExercises.value.push(addedExercise)
    showExerciseLibrary.value = false
  } catch (error) {
    logger.error('Failed to add exercise:', error)
    toast.error('Erreur', 'Impossible d\'ajouter l\'exercice')
  }
}

const removeExercise = (index: number) => {
  selectedExercises.value.splice(index, 1)
}

const applyOptimalOrder = () => {
  selectedExercises.value = optimizeExerciseOrder(selectedExercises.value)
}

const getExerciseSets = (exercise: any): any[] => {
  if (!exercise.plannedSets) {
    exercise.plannedSets = [{ setNumber: 1, targetReps: 10, targetWeight: 0, restTime: 60 }]
  }
  return exercise.plannedSets
}

const addSet = (exercise: any) => {
  if (!exercise.plannedSets) exercise.plannedSets = []
  const lastSet = exercise.plannedSets[exercise.plannedSets.length - 1]
  exercise.plannedSets.push({
    setNumber: exercise.plannedSets.length + 1,
    targetReps: lastSet?.targetReps || 10,
    targetWeight: lastSet?.targetWeight || 0,
    restTime: lastSet?.restTime || 60
  })
}

const removeSet = (exercise: any, index: number) => {
  if (!exercise.plannedSets || exercise.plannedSets.length <= 1) return
  exercise.plannedSets.splice(index, 1)
  exercise.plannedSets.forEach((set: any, i: number) => {
    set.setNumber = i + 1
  })
}

const saveWorkout = async () => {
  if (!workoutId.value) {
    toast.warning('Attention', 'Veuillez d\'abord créer le workout')
    return
  }

  if (selectedExercises.value.length === 0) {
    toast.warning('Attention', 'Ajoutez au moins un exercice avant de sauvegarder')
    return
  }

  // Sauvegarder toutes les modifications des exercices
  isSaving.value = true
  try {
    for (const exercise of selectedExercises.value) {
      const sets = getExerciseSets(exercise)
      const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val))
      const updateData: any = {
        restTime: clamp(exercise.restTime || 60, 0, 600),
        targetSets: clamp(sets.length, 1, 20),
        targetReps: clamp(sets[0]?.targetReps || 10, 1, 999),
        targetWeight: clamp(sets[0]?.targetWeight || 0, 0, 2000),
        plannedSets: sets.slice(0, 20).map((s: any, i: number) => ({
          setNumber: i + 1,
          targetReps: clamp(Number(s.targetReps) || 10, 1, 999),
          targetWeight: clamp(Number(s.targetWeight) || 0, 0, 2000),
          restTime: clamp(Number(s.restTime) || 60, 0, 600)
        }))
      }

      if (exercise.notes !== undefined) updateData.notes = exercise.notes

      await workoutStore.updateExercise(workoutId.value, exercise.id, updateData)
    }

    showSavedModal.value = true
  } catch (error) {
    logger.error('Failed to save workout:', error)
    toast.error('Erreur', 'Impossible de sauvegarder le workout')
  } finally {
    isSaving.value = false
  }
}

const formatMuscleGroup = (muscle?: string) => {
  const labels: Record<string, string> = {
    CHEST: 'Pectoraux',
    BACK: 'Dos',
    SHOULDERS: 'Épaules',
    LEGS: 'Jambes',
    BICEPS: 'Biceps',
    TRICEPS: 'Triceps',
    ABS: 'Abdos',
    QUADS: 'Quadriceps',
    HAMSTRINGS: 'Ischio-jambiers',
    GLUTES: 'Fessiers',
    CALVES: 'Mollets',
    CARDIO: 'Cardio'
  }
  return muscle ? labels[muscle] || muscle : ''
}

const formatEquipment = (equipment?: string) => {
  const labels: Record<string, string> = {
    BARBELL: 'Barre',
    DUMBBELL: 'Haltères',
    BODYWEIGHT: 'Poids du corps',
    MACHINE: 'Machine',
    CABLE: 'Câble',
    RESISTANCE_BAND: 'Élastique',
    OTHER: 'Autre'
  }
  return equipment ? labels[equipment] || equipment : ''
}

const formatDifficulty = (difficulty?: string) => {
  const labels: Record<string, string> = {
    BEGINNER: 'Débutant',
    INTERMEDIATE: 'Intermédiaire',
    ADVANCED: 'Avancé'
  }
  return difficulty ? labels[difficulty] || difficulty : ''
}

definePageMeta({
  middleware: 'auth'
})
</script>
