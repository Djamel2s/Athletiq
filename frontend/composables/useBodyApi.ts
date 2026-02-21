import type { BodyStat, Measurement, ProgressPhoto, PersonalRecord } from '~/types/body'

export const useBodyApi = () => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${authStore.token}`
  })

  // ========== BODY STATS ==========
  const getBodyStats = async (limit = 50, offset = 0) => {
    return await $fetch<{ data: BodyStat[]; total: number }>(
      `${config.public.apiUrl}/body-stats?limit=${limit}&offset=${offset}`,
      { headers: getAuthHeaders() }
    )
  }

  const createBodyStat = async (data: { weight: number; bodyFat?: number; notes?: string; date?: string }) => {
    return await $fetch<BodyStat>(`${config.public.apiUrl}/body-stats`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: data
    })
  }

  const updateBodyStat = async (id: number, data: Partial<BodyStat>) => {
    return await $fetch<BodyStat>(`${config.public.apiUrl}/body-stats/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: data
    })
  }

  const deleteBodyStat = async (id: number) => {
    return await $fetch<{ message: string }>(`${config.public.apiUrl}/body-stats/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
  }

  // ========== MEASUREMENTS ==========
  const getMeasurements = async (limit = 50, offset = 0) => {
    return await $fetch<{ data: Measurement[]; total: number }>(
      `${config.public.apiUrl}/measurements?limit=${limit}&offset=${offset}`,
      { headers: getAuthHeaders() }
    )
  }

  const createMeasurement = async (data: Partial<Omit<Measurement, 'id' | 'userId'>>) => {
    return await $fetch<Measurement>(`${config.public.apiUrl}/measurements`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: data
    })
  }

  const updateMeasurement = async (id: number, data: Partial<Measurement>) => {
    return await $fetch<Measurement>(`${config.public.apiUrl}/measurements/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: data
    })
  }

  const deleteMeasurement = async (id: number) => {
    return await $fetch<{ message: string }>(`${config.public.apiUrl}/measurements/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
  }

  // ========== PHOTOS ==========
  const uploadPhoto = async (workoutId: number, file: File, isPrimary = false) => {
    const formData = new FormData()
    formData.append('photo', file)
    formData.append('isPrimary', String(isPrimary))

    return await $fetch<ProgressPhoto>(`${config.public.apiUrl}/photos/workout/${workoutId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authStore.token}` },
      body: formData
    })
  }

  const getTimelapse = async (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams()
    if (startDate) params.append('startDate', startDate)
    if (endDate) params.append('endDate', endDate)
    const query = params.toString() ? `?${params.toString()}` : ''

    return await $fetch<ProgressPhoto[]>(`${config.public.apiUrl}/photos/timelapse${query}`, {
      headers: getAuthHeaders()
    })
  }

  const getRecentPhotos = async (limit = 10) => {
    return await $fetch<ProgressPhoto[]>(`${config.public.apiUrl}/photos/recent?limit=${limit}`, {
      headers: getAuthHeaders()
    })
  }

  const deletePhoto = async (id: number) => {
    return await $fetch<{ message: string }>(`${config.public.apiUrl}/photos/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
  }

  // ========== RECORDS ==========
  const getPersonalRecords = async () => {
    return await $fetch<PersonalRecord[]>(`${config.public.apiUrl}/records/personal`, {
      headers: getAuthHeaders()
    })
  }

  return {
    // Body Stats
    getBodyStats,
    createBodyStat,
    updateBodyStat,
    deleteBodyStat,
    // Measurements
    getMeasurements,
    createMeasurement,
    updateMeasurement,
    deleteMeasurement,
    // Photos
    uploadPhoto,
    getTimelapse,
    getRecentPhotos,
    deletePhoto,
    // Records
    getPersonalRecords
  }
}
