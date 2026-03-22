import { defineStore } from 'pinia'
import type { Workout, Exercise, Set, ExerciseLibrary } from '~/types/workout'

interface WorkoutState {
  workouts: Workout[]
  currentWorkout: Workout | null
  exerciseLibrary: ExerciseLibrary[]
  isLoading: boolean
  error: string | null
}

export const useWorkoutStore = defineStore('workout', {
  state: (): WorkoutState => ({
    workouts: [],
    currentWorkout: null,
    exerciseLibrary: [],
    isLoading: false,
    error: null
  }),

  getters: {
    recentWorkouts: (state) => {
      return state.workouts
        .filter((w) => w.completedAt)
        .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
        .slice(0, 5)
    },

    activeWorkout: (state) => {
      return state.workouts.find((w) => w.startedAt && !w.completedAt)
    },

    templates: (state) => {
      return state.workouts.filter((w) => w.isTemplate)
    },

    workoutHistory: (state) => {
      return state.workouts
        .filter((w) => w.completedAt)
        .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
    }
  },

  actions: {
    async fetchWorkouts() {
      this.isLoading = true
      this.error = null
      try {
        const api = useWorkoutApi()
        const { workouts } = await api.getWorkouts()
        this.workouts = workouts || []
      } catch (error: any) {
        this.error = error.message || 'Erreur lors du chargement des workouts'
        this.workouts = []
        logger.error('Fetch workouts error:', error)
      } finally {
        this.isLoading = false
      }
    },

    async fetchWorkout(id: number) {
      this.isLoading = true
      this.error = null
      try {
        const api = useWorkoutApi()
        this.currentWorkout = await api.getWorkout(id)
        return this.currentWorkout
      } catch (error: any) {
        this.error = error.message || 'Erreur lors du chargement du workout'
        logger.error('Fetch workout error:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async createWorkout(data: { name: string; description?: string; isTemplate?: boolean }) {
      this.isLoading = true
      this.error = null
      try {
        const api = useWorkoutApi()
        logger.log('Creating workout with data:', data)
        const workout = await api.createWorkout(data)
        logger.log('Workout created:', workout)

        // Ensure workouts array exists
        if (!this.workouts) {
          this.workouts = []
        }
        this.workouts.push(workout)
        return workout
      } catch (error: any) {
        logger.error('Create workout error details:', {
          message: error.message,
          data: error.data,
          statusCode: error.statusCode,
          fullError: error
        })
        this.error = error.data?.error || error.message || 'Erreur lors de la création du workout'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async updateWorkout(id: number, data: Partial<Workout>) {
      this.isLoading = true
      this.error = null
      try {
        const api = useWorkoutApi()
        const { workout } = await api.updateWorkout(id, data)
        const index = this.workouts.findIndex((w) => w.id === id)
        if (index !== -1) {
          this.workouts[index] = workout
        }
        if (this.currentWorkout?.id === id) {
          this.currentWorkout = workout
        }
        return workout
      } catch (error: any) {
        this.error = error.message || 'Erreur lors de la mise à jour du workout'
        logger.error('Update workout error:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async duplicateWorkout(id: number) {
      try {
        const api = useWorkoutApi()
        const workout = await api.duplicateWorkout(id)
        if (!this.workouts) {
          this.workouts = []
        }
        this.workouts.push(workout)
        return workout
      } catch (error: any) {
        this.error = error.data?.error || error.message || 'Erreur lors de la duplication du workout'
        logger.error('Duplicate workout error:', error)
        throw error
      }
    },

    async deleteWorkout(id: number) {
      this.isLoading = true
      this.error = null
      try {
        const api = useWorkoutApi()
        await api.deleteWorkout(id)
        this.workouts = this.workouts.filter((w) => w.id !== id)
        if (this.currentWorkout?.id === id) {
          this.currentWorkout = null
        }
      } catch (error: any) {
        this.error = error.message || 'Erreur lors de la suppression du workout'
        logger.error('Delete workout error:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async startWorkout(id: number) {
      this.isLoading = true
      this.error = null
      try {
        const api = useWorkoutApi()
        const { workout } = await api.startWorkout(id)
        const index = this.workouts.findIndex((w) => w.id === id)
        if (index !== -1) {
          this.workouts[index] = workout
        }
        this.currentWorkout = workout
        return workout
      } catch (error: any) {
        this.error = error.message || 'Erreur lors du démarrage du workout'
        logger.error('Start workout error:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async completeWorkout(id: number) {
      this.isLoading = true
      this.error = null
      try {
        const api = useWorkoutApi()
        const { workout } = await api.completeWorkout(id)
        const index = this.workouts.findIndex((w) => w.id === id)
        if (index !== -1) {
          this.workouts[index] = workout
        }
        if (this.currentWorkout?.id === id) {
          this.currentWorkout = null
        }
        return workout
      } catch (error: any) {
        this.error = error.message || 'Erreur lors de la complétion du workout'
        logger.error('Complete workout error:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async fetchExerciseLibrary(params?: {
      search?: string
      muscleGroup?: string
      equipment?: string
      difficulty?: string
      limit?: number
      offset?: number
    }) {
      this.isLoading = true
      this.error = null
      try {
        const api = useWorkoutApi()
        const { exercises } = await api.getExerciseLibrary(params)
        this.exerciseLibrary = exercises
        return exercises
      } catch (error: any) {
        this.error = error.message || 'Erreur lors du chargement des exercices'
        logger.error('Fetch exercise library error:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async addExerciseToWorkout(
      workoutId: number,
      data: {
        exerciseLibraryId: number
        name?: string
        notes?: string
        targetSets?: number
        targetReps?: number
        targetWeight?: number
        restTime?: number
        plannedSets?: Array<{ setNumber: number; targetReps: number; targetWeight: number; restTime?: number }>
        orderIndex?: number
      }
    ) {
      try {
        const api = useWorkoutApi()
        const exercise = await api.addExerciseToWorkout(workoutId, data)

        // Update current workout if it's loaded
        if (this.currentWorkout?.id === workoutId) {
          if (!this.currentWorkout.exercises) {
            this.currentWorkout.exercises = []
          }
          this.currentWorkout.exercises.push(exercise)
        }

        return exercise
      } catch (error: any) {
        this.error = error.message || 'Erreur lors de l\'ajout de l\'exercice'
        logger.error('Add exercise error:', error)
        throw error
      }
    },

    async updateExercise(
      workoutId: number,
      exerciseId: number,
      data: Partial<Exercise>
    ) {
      try {
        const api = useWorkoutApi()
        const { exercise } = await api.updateExercise(workoutId, exerciseId, data)

        // Update current workout if it's loaded
        if (this.currentWorkout?.id === workoutId) {
          const exerciseIndex = this.currentWorkout.exercises?.findIndex((e) => e.id === exerciseId)
          if (exerciseIndex !== undefined && exerciseIndex !== -1 && this.currentWorkout.exercises) {
            this.currentWorkout.exercises[exerciseIndex] = exercise
          }
        }

        return exercise
      } catch (error: any) {
        this.error = error.message || 'Erreur lors de la mise à jour de l\'exercice'
        logger.error('Update exercise error:', error)
        throw error
      }
    },

    async addSetToExercise(
      workoutId: number,
      exerciseId: number,
      data: {
        setNumber: number
        reps?: number
        weight?: number
        duration?: number
        distance?: number
        rpe?: number
        notes?: string
      }
    ) {
      try {
        const api = useWorkoutApi()
        const set = await api.addSetToExercise(workoutId, exerciseId, data)

        // Update current workout if it's loaded
        if (this.currentWorkout?.id === workoutId) {
          const exercise = this.currentWorkout.exercises?.find((e) => e.id === exerciseId)
          if (exercise) {
            if (!exercise.sets) {
              exercise.sets = []
            }
            exercise.sets.push(set)
          }
        }

        return set
      } catch (error: any) {
        this.error = error.message || 'Erreur lors de l\'ajout du set'
        logger.error('Add set error:', error)
        throw error
      }
    },

    async updateSet(
      workoutId: number,
      exerciseId: number,
      setId: number,
      data: Partial<Set>
    ) {
      try {
        const api = useWorkoutApi()
        const { set } = await api.updateSet(workoutId, exerciseId, setId, data)

        // Update current workout if it's loaded
        if (this.currentWorkout?.id === workoutId) {
          const exercise = this.currentWorkout.exercises?.find((e) => e.id === exerciseId)
          if (exercise?.sets) {
            const setIndex = exercise.sets.findIndex((s) => s.id === setId)
            if (setIndex !== -1) {
              exercise.sets[setIndex] = set
            }
          }
        }

        return set
      } catch (error: any) {
        this.error = error.message || 'Erreur lors de la mise à jour du set'
        logger.error('Update set error:', error)
        throw error
      }
    },

    clearCurrentWorkout() {
      this.currentWorkout = null
    },

    clearError() {
      this.error = null
    }
  }
})
