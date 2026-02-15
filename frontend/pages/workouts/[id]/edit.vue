<template>
  <div class="min-h-screen">
    <!-- Navigation -->
    <nav class="fixed top-0 left-0 right-0 z-50 nav-blur">
      <div class="max-w-7xl mx-auto px-6 py-5">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <NuxtLink to="/dashboard">
              <img src="/athletiq-icon.svg" alt="Athletiq" class="h-14 w-auto" />
            </NuxtLink>
            <h1 class="text-2xl font-bold text-primary-900">
              Modifier le Workout
            </h1>
          </div>

          <button @click="navigateTo('/workouts')" class="btn-outline">
            Annuler
          </button>
        </div>
      </div>
    </nav>

    <!-- Contenu principal -->
    <div class="pt-32 px-6 pb-20 max-w-5xl mx-auto">
      <!-- Formulaire du workout -->
      <div class="card-glass mb-8 fade-in">
        <h2 class="text-2xl font-bold text-primary-900 mb-6">Informations générales</h2>

        <div class="space-y-6">
          <div>
            <label class="block text-sm font-semibold text-primary-700 mb-2">
              Nom du workout *
            </label>
            <input
              v-model="workoutForm.name"
              type="text"
              placeholder="Ex: Push Day, Full Body, etc."
              class="input-primary w-full"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-primary-700 mb-2">
              Description (optionnel)
            </label>
            <textarea
              v-model="workoutForm.description"
              placeholder="Décrivez votre entraînement..."
              rows="3"
              class="input-primary w-full"
            ></textarea>
          </div>
        </div>

      </div>

      <!-- Liste des exercices (si workout créé) -->
      <div v-if="workoutId" class="space-y-6 slide-up">
        <!-- Exercices ajoutés -->
        <div class="card-glass">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-primary-900">
              Exercices ({{ selectedExercises.length }})
            </h2>
            <button @click="showExerciseLibrary = true" class="btn-primary">
              + Ajouter un exercice
            </button>
          </div>

          <div v-if="selectedExercises.length === 0" class="text-center py-12">
            <p class="text-primary-500 text-lg mb-4">Aucun exercice ajouté</p>
            <button @click="showExerciseLibrary = true" class="btn-outline">
              Parcourir la bibliothèque
            </button>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="(exercise, index) in selectedExercises"
              :key="exercise.id"
              class="p-4 bg-primary-50 rounded-xl border border-primary-200 hover:border-primary-400 transition-colors"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center space-x-3 mb-2">
                    <span class="flex items-center justify-center w-8 h-8 bg-primary-600 text-white rounded-full font-bold text-sm">
                      {{ index + 1 }}
                    </span>
                    <h3 class="text-lg font-bold text-primary-900">{{ exercise.exerciseLibrary?.name || exercise.name }}</h3>
                  </div>

                  <p v-if="exercise.exerciseLibrary?.description" class="text-sm text-primary-600 mb-3 ml-11">
                    {{ exercise.exerciseLibrary.description }}
                  </p>

                  <div class="flex flex-wrap gap-2 ml-11">
                    <span
                      v-if="exercise.exerciseLibrary?.primaryMuscle"
                      class="px-2 py-1 bg-primary-200 text-primary-800 text-xs font-medium rounded"
                    >
                      {{ formatMuscleGroup(exercise.exerciseLibrary.primaryMuscle) }}
                    </span>
                    <span
                      v-if="exercise.exerciseLibrary?.equipment"
                      class="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded"
                    >
                      {{ formatEquipment(exercise.exerciseLibrary.equipment) }}
                    </span>
                    <span
                      v-if="exercise.exerciseLibrary?.difficulty"
                      class="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded"
                    >
                      {{ formatDifficulty(exercise.exerciseLibrary.difficulty) }}
                    </span>
                  </div>

                  <!-- Target values -->
                  <div class="mt-3 ml-11 flex flex-wrap gap-4 text-sm">
                    <div>
                      <label class="text-primary-600 text-xs">Séries</label>
                      <input
                        v-model.number="exercise.targetSets"
                        type="number"
                        min="1"
                        class="w-20 px-2 py-1 border border-primary-300 rounded text-center"
                        @change="updatePlannedSets(exercise)"
                      />
                    </div>
                    <div>
                      <label class="text-primary-600 text-xs">Reps</label>
                      <input
                        v-model.number="exercise.targetReps"
                        type="number"
                        min="1"
                        class="w-20 px-2 py-1 border border-primary-300 rounded text-center"
                      />
                    </div>
                    <div>
                      <label class="text-primary-600 text-xs">Poids (kg)</label>
                      <input
                        v-model.number="exercise.targetWeight"
                        type="number"
                        min="0"
                        step="0.5"
                        class="w-20 px-2 py-1 border border-primary-300 rounded text-center"
                      />
                    </div>
                    <div>
                      <label class="text-primary-600 text-xs">Repos (s)</label>
                      <input
                        v-model.number="exercise.restTime"
                        type="number"
                        min="0"
                        step="15"
                        class="w-20 px-2 py-1 border border-primary-300 rounded text-center"
                      />
                    </div>
                  </div>

                  <!-- Personnalisation des séries -->
                  <div class="mt-3 ml-11">
                    <button
                      @click="togglePlannedSets(exercise)"
                      type="button"
                      class="text-xs text-primary-600 hover:text-primary-800 font-medium flex items-center gap-1"
                    >
                      <svg
                        class="w-4 h-4 transition-transform"
                        :class="{ 'rotate-90': exercise.showPlannedSets }"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                      </svg>
                      Personnaliser les séries
                    </button>

                    <div v-if="exercise.showPlannedSets" class="mt-3 bg-primary-50 rounded-lg p-3">
                      <p class="text-xs text-primary-600 mb-2">Définissez les reps et poids pour chaque série:</p>
                      <div class="space-y-2">
                        <div
                          v-for="(set, setIndex) in exercise.plannedSets"
                          :key="setIndex"
                          class="flex items-center gap-2"
                        >
                          <span class="text-xs text-primary-700 font-medium w-16">Série {{ setIndex + 1 }}:</span>
                          <input
                            v-model.number="set.targetReps"
                            type="number"
                            min="1"
                            placeholder="Reps"
                            class="w-20 px-2 py-1 border border-primary-300 rounded text-center text-xs"
                          />
                          <span class="text-xs text-primary-600">reps ×</span>
                          <input
                            v-model.number="set.targetWeight"
                            type="number"
                            min="0"
                            step="0.5"
                            placeholder="Poids"
                            class="w-20 px-2 py-1 border border-primary-300 rounded text-center text-xs"
                          />
                          <span class="text-xs text-primary-600">kg</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  @click="removeExercise(index)"
                  class="text-red-600 hover:text-red-800 p-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions finales -->
        <div class="card-glass">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-primary-900 mb-1">Workout prêt!</h3>
              <p class="text-sm text-primary-600">
                {{ selectedExercises.length }} exercice(s) ajouté(s) • Ce workout sera disponible dans "Lancer un entrainement" à la salle
              </p>
            </div>

            <div class="flex space-x-4">
              <button @click="navigateTo('/workouts')" class="btn-outline">
                Annuler
              </button>
              <button
                @click="saveWorkout"
                :disabled="selectedExercises.length === 0"
                class="btn-primary"
              >
                Sauvegarder le workout
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
      <div class="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div class="p-6 border-b border-primary-200">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-2xl font-bold text-primary-900">Bibliothèque d'exercices</h2>
            <button @click="showExerciseLibrary = false" class="text-primary-500 hover:text-primary-700">
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

            <div class="flex flex-wrap gap-2">
              <select v-model="filterMuscleGroup" @change="searchExercises" class="input-primary">
                <option value="">Tous les muscles</option>
                <option value="CHEST">Pectoraux</option>
                <option value="BACK">Dos</option>
                <option value="SHOULDERS">Épaules</option>
                <option value="LEGS">Jambes</option>
                <option value="BICEPS">Biceps</option>
                <option value="TRICEPS">Triceps</option>
                <option value="ABS">Abdos</option>
              </select>

              <select v-model="filterEquipment" @change="searchExercises" class="input-primary">
                <option value="">Tout équipement</option>
                <option value="BARBELL">Barre</option>
                <option value="DUMBBELL">Haltères</option>
                <option value="BODYWEIGHT">Poids du corps</option>
                <option value="MACHINE">Machine</option>
                <option value="CABLE">Câble</option>
              </select>

              <select v-model="filterDifficulty" @change="searchExercises" class="input-primary">
                <option value="">Toute difficulté</option>
                <option value="BEGINNER">Débutant</option>
                <option value="INTERMEDIATE">Intermédiaire</option>
                <option value="ADVANCED">Avancé</option>
              </select>
            </div>
          </div>
        </div>

        <div class="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div v-if="isLoadingExercises" class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
          </div>

          <div v-else-if="exerciseLibrary.length === 0" class="text-center py-12">
            <p class="text-primary-500">Aucun exercice trouvé</p>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="exercise in exerciseLibrary"
              :key="exercise.id"
              class="p-4 border border-primary-200 rounded-xl hover:border-primary-400 hover:shadow-lg transition-all cursor-pointer"
              @click="addExercise(exercise)"
            >
              <h3 class="font-bold text-primary-900 mb-2">{{ exercise.name }}</h3>
              <p class="text-sm text-primary-600 mb-3">{{ exercise.description }}</p>

              <div class="flex flex-wrap gap-2">
                <span class="px-2 py-1 bg-primary-200 text-primary-800 text-xs font-medium rounded">
                  {{ formatMuscleGroup(exercise.primaryMuscle) }}
                </span>
                <span class="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded">
                  {{ formatEquipment(exercise.equipment) }}
                </span>
                <span class="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded">
                  {{ formatDifficulty(exercise.difficulty) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWorkoutStore } from '~/stores/workout'
import { useAuthStore } from '~/stores/auth'
import type { ExerciseLibrary, Exercise } from '~/types/workout'

const workoutStore = useWorkoutStore()
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const workoutForm = ref({
  name: '',
  description: ''
})

const workoutId = ref<number | null>(null)
const isCreating = ref(false)
const isEditing = ref(false)
const selectedExercises = ref<Exercise[]>([])

const showExerciseLibrary = ref(false)
const exerciseLibrary = ref<ExerciseLibrary[]>([])
const isLoadingExercises = ref(false)

const searchQuery = ref('')
const filterMuscleGroup = ref('')
const filterEquipment = ref('')
const filterDifficulty = ref('')

// Auth check and load workout
onMounted(async () => {
  authStore.loadFromLocalStorage()
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }

  // Charger le workout existant
  const id = parseInt(route.params.id as string)
  if (id) {
    try {
      const workout = await workoutStore.fetchWorkout(id)
      workoutId.value = workout.id
      workoutForm.value.name = workout.name
      workoutForm.value.description = workout.description || ''
      selectedExercises.value = workout.exercises || []
    } catch (error) {
      console.error('Failed to load workout:', error)
      alert('Erreur lors du chargement du workout')
      router.push('/workouts')
    }
  }
})

const createWorkout = async () => {
  if (!workoutForm.value.name) return

  isCreating.value = true
  try {
    // Tous les workouts sont réutilisables (isTemplate: true)
    const workout = await workoutStore.createWorkout({
      ...workoutForm.value,
      isTemplate: true
    })
    workoutId.value = workout.id
  } catch (error) {
    console.error('Failed to create workout:', error)
    alert('Erreur lors de la création du workout')
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
    console.error('Failed to load exercises:', error)
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
      targetSets: 3,
      targetReps: 10,
      restTime: 60,
      orderIndex: selectedExercises.value.length
    })

    selectedExercises.value.push(addedExercise)
    showExerciseLibrary.value = false
  } catch (error) {
    console.error('Failed to add exercise:', error)
    alert('Erreur lors de l\'ajout de l\'exercice')
  }
}

const removeExercise = (index: number) => {
  selectedExercises.value.splice(index, 1)
}

const togglePlannedSets = (exercise: any) => {
  exercise.showPlannedSets = !exercise.showPlannedSets
  if (exercise.showPlannedSets && (!exercise.plannedSets || exercise.plannedSets.length === 0)) {
    updatePlannedSets(exercise)
  }
}

const updatePlannedSets = (exercise: any) => {
  const numSets = exercise.targetSets || 3
  const defaultReps = exercise.targetReps || 10
  const defaultWeight = exercise.targetWeight || 0

  if (!exercise.plannedSets) {
    exercise.plannedSets = []
  }

  // Ajuster le nombre de séries
  while (exercise.plannedSets.length < numSets) {
    exercise.plannedSets.push({
      setNumber: exercise.plannedSets.length + 1,
      targetReps: defaultReps,
      targetWeight: defaultWeight
    })
  }

  while (exercise.plannedSets.length > numSets) {
    exercise.plannedSets.pop()
  }

  // Mettre à jour les numéros de série
  exercise.plannedSets.forEach((set: any, index: number) => {
    set.setNumber = index + 1
  })
}

const saveWorkout = async () => {
  if (!workoutId.value) {
    alert('Veuillez d\'abord créer le workout')
    return
  }

  if (selectedExercises.value.length === 0) {
    alert('Ajoutez au moins un exercice avant de sauvegarder')
    return
  }

  try {
    // 1. Sauvegarder les métadonnées du workout (nom et description)
    await workoutStore.updateWorkout(workoutId.value, {
      name: workoutForm.value.name,
      description: workoutForm.value.description
    })

    // 2. Sauvegarder toutes les modifications des exercices
    for (const exercise of selectedExercises.value) {
      // Construire l'objet en ne gardant que les propriétés définies
      const updateData: any = {}

      if (exercise.targetSets !== undefined) updateData.targetSets = exercise.targetSets
      if (exercise.targetReps !== undefined) updateData.targetReps = exercise.targetReps
      if (exercise.targetWeight !== undefined) updateData.targetWeight = exercise.targetWeight
      if (exercise.restTime !== undefined) updateData.restTime = exercise.restTime

      // Filtrer les séries planifiées pour ne garder que celles qui sont complètes
      if (exercise.plannedSets !== undefined && exercise.plannedSets.length > 0) {
        const validPlannedSets = exercise.plannedSets.filter((set: any) =>
          set.targetReps && set.targetReps > 0 &&
          set.targetWeight !== undefined && set.targetWeight !== null && !isNaN(set.targetWeight)
        )
        if (validPlannedSets.length > 0) {
          updateData.plannedSets = validPlannedSets
        }
      }

      if (exercise.notes !== undefined) updateData.notes = exercise.notes

      await workoutStore.updateExercise(workoutId.value, exercise.id, updateData)
    }

    alert('Workout modifié avec succès!')
    navigateTo('/workouts')
  } catch (error) {
    console.error('Failed to save workout:', error)
    alert('Erreur lors de la sauvegarde')
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
