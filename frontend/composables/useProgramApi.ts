import { apiFetch } from '~/utils/apiFetch'

export interface ProgramExercise {
  exerciseName: string
  sets: number
  reps: string
  restSeconds: number
  notes?: string
}

export interface ProgramDay {
  id: number
  name: string
  dayIndex: number
  description?: string
  exercises: ProgramExercise[]
}

export interface WorkoutProgram {
  id: number
  name: string
  slug: string
  description: string
  difficulty: string
  goal: string
  daysPerWeek: number
  durationWeeks: number
  icon?: string
  popularity: number
  days: ProgramDay[]
}

export const useProgramApi = () => {
  const getPrograms = async () => {
    return await apiFetch<WorkoutProgram[]>('/programs')
  }

  const getProgram = async (slug: string) => {
    return await apiFetch<WorkoutProgram>(`/programs/${slug}`)
  }

  const adoptProgram = async (slug: string) => {
    return await apiFetch<{ message: string; workoutIds: number[] }>(`/programs/${slug}/adopt`, {
      method: 'POST'
    })
  }

  return { getPrograms, getProgram, adoptProgram }
}
