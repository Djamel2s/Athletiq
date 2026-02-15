import type { Workout, Exercise, Set, ExerciseLibrary } from '~/types/workout'

export const useWorkoutApi = () => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${authStore.token}`
  })

  // ========== WORKOUTS ==========
  const getWorkouts = async () => {
    return await $fetch<{ workouts: Workout[] }>(`${config.public.apiUrl}/workouts`, {
      headers: getAuthHeaders()
    })
  }

  const getWorkout = async (id: number) => {
    return await $fetch<Workout>(`${config.public.apiUrl}/workouts/${id}`, {
      headers: getAuthHeaders()
    })
  }

  const createWorkout = async (data: { name: string; description?: string; isTemplate?: boolean }) => {
    return await $fetch<Workout>(`${config.public.apiUrl}/workouts`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: data
    })
  }

  const updateWorkout = async (id: number, data: Partial<Workout>) => {
    return await $fetch<{ message: string; workout: Workout }>(
      `${config.public.apiUrl}/workouts/${id}`,
      {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: data
      }
    )
  }

  const deleteWorkout = async (id: number) => {
    return await $fetch<{ message: string }>(`${config.public.apiUrl}/workouts/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
  }

  const startWorkout = async (id: number) => {
    return await $fetch<{ message: string; workout: Workout }>(
      `${config.public.apiUrl}/workouts/${id}/start`,
      {
        method: 'POST',
        headers: getAuthHeaders()
      }
    )
  }

  const completeWorkout = async (id: number) => {
    return await $fetch<{ message: string; workout: Workout }>(
      `${config.public.apiUrl}/workouts/${id}/complete`,
      {
        method: 'POST',
        headers: getAuthHeaders()
      }
    )
  }

  // ========== EXERCISES ==========
  const getExerciseLibrary = async (params?: {
    search?: string
    muscleGroup?: string
    equipment?: string
    difficulty?: string
    limit?: number
    offset?: number
  }) => {
    const query = new URLSearchParams()
    if (params?.search) query.append('search', params.search)
    if (params?.muscleGroup) query.append('muscleGroup', params.muscleGroup)
    if (params?.equipment) query.append('equipment', params.equipment)
    if (params?.difficulty) query.append('difficulty', params.difficulty)
    if (params?.limit) query.append('limit', params.limit.toString())
    if (params?.offset) query.append('offset', params.offset.toString())

    return await $fetch<{
      exercises: ExerciseLibrary[]
      total: number
      limit: number
      offset: number
    }>(`${config.public.apiUrl}/exercises?${query.toString()}`, {
      headers: getAuthHeaders()
    })
  }

  const getExerciseById = async (id: number) => {
    return await $fetch<ExerciseLibrary>(`${config.public.apiUrl}/exercises/${id}`, {
      headers: getAuthHeaders()
    })
  }

  const getExercisesByMuscleGroup = async (muscleGroup: string) => {
    return await $fetch<ExerciseLibrary[]>(
      `${config.public.apiUrl}/exercises/muscle/${muscleGroup}`,
      {
        headers: getAuthHeaders()
      }
    )
  }

  const addExerciseToWorkout = async (
    workoutId: number,
    data: {
      exerciseLibraryId: number
      name?: string
      notes?: string
      targetSets?: number
      targetReps?: number
      targetWeight?: number
      restTime?: number
      plannedSets?: Array<{ setNumber: number; targetReps: number; targetWeight: number }>
      orderIndex?: number
    }
  ) => {
    return await $fetch<Exercise>(
      `${config.public.apiUrl}/workouts/${workoutId}/exercises`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: data
      }
    )
  }

  const updateExercise = async (
    workoutId: number,
    exerciseId: number,
    data: Partial<Exercise>
  ) => {
    return await $fetch<{ message: string; exercise: Exercise }>(
      `${config.public.apiUrl}/workouts/${workoutId}/exercises/${exerciseId}`,
      {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: data
      }
    )
  }

  const deleteExercise = async (workoutId: number, exerciseId: number) => {
    return await $fetch<{ message: string }>(
      `${config.public.apiUrl}/workouts/${workoutId}/exercises/${exerciseId}`,
      {
        method: 'DELETE',
        headers: getAuthHeaders()
      }
    )
  }

  // ========== SETS ==========
  const addSetToExercise = async (
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
  ) => {
    return await $fetch<Set>(
      `${config.public.apiUrl}/workouts/${workoutId}/exercises/${exerciseId}/sets`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: data
      }
    )
  }

  const updateSet = async (
    workoutId: number,
    exerciseId: number,
    setId: number,
    data: Partial<Set>
  ) => {
    return await $fetch<{ message: string; set: Set }>(
      `${config.public.apiUrl}/workouts/${workoutId}/exercises/${exerciseId}/sets/${setId}`,
      {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: data
      }
    )
  }

  const deleteSet = async (workoutId: number, exerciseId: number, setId: number) => {
    return await $fetch<{ message: string }>(
      `${config.public.apiUrl}/workouts/${workoutId}/exercises/${exerciseId}/sets/${setId}`,
      {
        method: 'DELETE',
        headers: getAuthHeaders()
      }
    )
  }

  // ========== HISTORY ==========
  const getExerciseHistory = async (exerciseLibraryId: number) => {
    return await $fetch<{
      exerciseLibraryId: number
      lastSets: Set[]
      lastWorkoutDate: string | null
    }>(`${config.public.apiUrl}/workouts/history/exercise/${exerciseLibraryId}`, {
      headers: getAuthHeaders()
    })
  }

  return {
    // Workouts
    getWorkouts,
    getWorkout,
    createWorkout,
    updateWorkout,
    deleteWorkout,
    startWorkout,
    completeWorkout,
    // Exercises
    getExerciseLibrary,
    getExerciseById,
    getExercisesByMuscleGroup,
    addExerciseToWorkout,
    updateExercise,
    deleteExercise,
    // Sets
    addSetToExercise,
    updateSet,
    deleteSet,
    // History
    getExerciseHistory
  }
}
