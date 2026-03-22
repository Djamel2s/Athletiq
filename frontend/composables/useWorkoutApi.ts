import type { Workout, Exercise, Set, ExerciseLibrary } from '~/types/workout'
import { apiFetch } from '~/utils/apiFetch'

export const useWorkoutApi = () => {
  const API_TIMEOUT = 30000

  // ========== WORKOUTS ==========
  const getWorkouts = async () => {
    return await apiFetch<{ workouts: Workout[] }>('/workouts', {
      timeout: API_TIMEOUT
    })
  }

  const getWorkout = async (id: number) => {
    return await apiFetch<Workout>(`/workouts/${id}`, {
      timeout: API_TIMEOUT
    })
  }

  const createWorkout = async (data: { name: string; description?: string; isTemplate?: boolean }) => {
    return await apiFetch<Workout>('/workouts', {
      method: 'POST',
      timeout: API_TIMEOUT,
      body: data
    })
  }

  const updateWorkout = async (id: number, data: Partial<Workout>) => {
    return await apiFetch<{ message: string; workout: Workout }>(
      `/workouts/${id}`,
      {
        method: 'PUT',
        timeout: API_TIMEOUT,
        body: data
      }
    )
  }

  const deleteWorkout = async (id: number) => {
    return await apiFetch<{ message: string }>(`/workouts/${id}`, {
      method: 'DELETE',
      timeout: API_TIMEOUT
    })
  }

  const startWorkout = async (id: number) => {
    return await apiFetch<{ message: string; workout: Workout }>(
      `/workouts/${id}/start`,
      {
        method: 'POST',
        timeout: API_TIMEOUT
      }
    )
  }

  const completeWorkout = async (id: number) => {
    return await apiFetch<{ message: string; workout: Workout }>(
      `/workouts/${id}/complete`,
      {
        method: 'POST',
        timeout: API_TIMEOUT
      }
    )
  }

  const duplicateWorkout = async (id: number) => {
    return await apiFetch<Workout>(`/workouts/${id}/duplicate`, {
      method: 'POST',
      timeout: API_TIMEOUT
    })
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

    return await apiFetch<{
      exercises: ExerciseLibrary[]
      total: number
      limit: number
      offset: number
    }>(`/exercises?${query.toString()}`, {
      timeout: API_TIMEOUT
    })
  }

  const getExerciseById = async (id: number) => {
    return await apiFetch<ExerciseLibrary>(`/exercises/${id}`, {
      timeout: API_TIMEOUT
    })
  }

  const getExercisesByMuscleGroup = async (muscleGroup: string) => {
    return await apiFetch<ExerciseLibrary[]>(
      `/exercises/muscle/${muscleGroup}`,
      {
        timeout: API_TIMEOUT
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
    return await apiFetch<Exercise>(
      `/workouts/${workoutId}/exercises`,
      {
        method: 'POST',
        timeout: API_TIMEOUT,
        body: data
      }
    )
  }

  const updateExercise = async (
    workoutId: number,
    exerciseId: number,
    data: Partial<Exercise>
  ) => {
    return await apiFetch<{ message: string; exercise: Exercise }>(
      `/workouts/${workoutId}/exercises/${exerciseId}`,
      {
        method: 'PUT',
        timeout: API_TIMEOUT,
        body: data
      }
    )
  }

  const deleteExercise = async (workoutId: number, exerciseId: number) => {
    return await apiFetch<{ message: string }>(
      `/workouts/${workoutId}/exercises/${exerciseId}`,
      {
        method: 'DELETE',
        timeout: API_TIMEOUT
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
    return await apiFetch<Set>(
      `/workouts/${workoutId}/exercises/${exerciseId}/sets`,
      {
        method: 'POST',
        timeout: API_TIMEOUT,
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
    return await apiFetch<{ message: string; set: Set }>(
      `/workouts/${workoutId}/exercises/${exerciseId}/sets/${setId}`,
      {
        method: 'PUT',
        timeout: API_TIMEOUT,
        body: data
      }
    )
  }

  const deleteSet = async (workoutId: number, exerciseId: number, setId: number) => {
    return await apiFetch<{ message: string }>(
      `/workouts/${workoutId}/exercises/${exerciseId}/sets/${setId}`,
      {
        method: 'DELETE',
        timeout: API_TIMEOUT
      }
    )
  }

  // ========== HISTORY ==========
  const getExerciseHistory = async (exerciseLibraryId: number) => {
    return await apiFetch<{
      exerciseLibraryId: number
      lastSets: Set[]
      lastWorkoutDate: string | null
    }>(`/workouts/history/exercise/${exerciseLibraryId}`, {
      timeout: API_TIMEOUT
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
    duplicateWorkout,
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
