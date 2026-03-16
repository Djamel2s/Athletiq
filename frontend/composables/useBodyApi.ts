import type { BodyStat, Measurement, ProgressPhoto, PersonalRecord } from '~/types/body'

export const useBodyApi = () => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  const API_TIMEOUT = 30000

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${authStore.token}`
  })

  const fetchOpts = (opts: Record<string, any> = {}) => ({
    timeout: API_TIMEOUT,
    headers: getAuthHeaders(),
    ...opts
  })

  // ========== BODY STATS ==========
  const getBodyStats = async (limit = 50, offset = 0) => {
    return await $fetch<{ data: BodyStat[]; total: number }>(
      `${config.public.apiUrl}/body-stats?limit=${limit}&offset=${offset}`,
      fetchOpts()
    )
  }

  const createBodyStat = async (data: { weight: number; bodyFat?: number; notes?: string; date?: string }) => {
    return await $fetch<BodyStat>(`${config.public.apiUrl}/body-stats`, {
      method: 'POST',
      ...fetchOpts(),
      body: data
    })
  }

  const updateBodyStat = async (id: number, data: Partial<BodyStat>) => {
    return await $fetch<BodyStat>(`${config.public.apiUrl}/body-stats/${id}`, {
      method: 'PUT',
      ...fetchOpts(),
      body: data
    })
  }

  const deleteBodyStat = async (id: number) => {
    return await $fetch<{ message: string }>(`${config.public.apiUrl}/body-stats/${id}`, {
      method: 'DELETE',
      ...fetchOpts()
    })
  }

  // ========== MEASUREMENTS ==========
  const getMeasurements = async (limit = 50, offset = 0) => {
    return await $fetch<{ data: Measurement[]; total: number }>(
      `${config.public.apiUrl}/measurements?limit=${limit}&offset=${offset}`,
      fetchOpts()
    )
  }

  const createMeasurement = async (data: Partial<Omit<Measurement, 'id' | 'userId'>>) => {
    return await $fetch<Measurement>(`${config.public.apiUrl}/measurements`, {
      method: 'POST',
      ...fetchOpts(),
      body: data
    })
  }

  const updateMeasurement = async (id: number, data: Partial<Measurement>) => {
    return await $fetch<Measurement>(`${config.public.apiUrl}/measurements/${id}`, {
      method: 'PUT',
      ...fetchOpts(),
      body: data
    })
  }

  const deleteMeasurement = async (id: number) => {
    return await $fetch<{ message: string }>(`${config.public.apiUrl}/measurements/${id}`, {
      method: 'DELETE',
      ...fetchOpts()
    })
  }

  // ========== PHOTOS ==========
  const uploadPhoto = async (workoutId: number, file: File, isPrimary = false) => {
    const formData = new FormData()
    formData.append('photo', file)
    formData.append('isPrimary', String(isPrimary))

    return await $fetch<ProgressPhoto>(`${config.public.apiUrl}/photos/workout/${workoutId}`, {
      method: 'POST',
      timeout: 60000, // 60s pour les uploads
      headers: { Authorization: `Bearer ${authStore.token}` },
      body: formData
    })
  }

  const getTimelapse = async (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams()
    if (startDate) params.append('startDate', startDate)
    if (endDate) params.append('endDate', endDate)
    const query = params.toString() ? `?${params.toString()}` : ''

    const res = await $fetch<{ photos: ProgressPhoto[]; total: number }>(`${config.public.apiUrl}/photos/timelapse${query}`, fetchOpts())
    return res.photos
  }

  const getRecentPhotos = async (limit = 10) => {
    return await $fetch<ProgressPhoto[]>(`${config.public.apiUrl}/photos/recent?limit=${limit}`, fetchOpts())
  }

  const deletePhoto = async (id: number) => {
    return await $fetch<{ message: string }>(`${config.public.apiUrl}/photos/${id}`, {
      method: 'DELETE',
      ...fetchOpts()
    })
  }

  // ========== RECORDS ==========
  const getPersonalRecords = async () => {
    return await $fetch<PersonalRecord[]>(`${config.public.apiUrl}/records/personal`, fetchOpts())
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
