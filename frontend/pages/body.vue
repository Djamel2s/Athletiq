<template>
  <div class="min-h-screen">
    <!-- Navigation -->
    <nav class="fixed top-0 left-0 right-0 z-50 nav-blur">
      <div class="max-w-7xl mx-auto px-6 py-5">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <NuxtLink to="/dashboard">
              <img src="/athletiq-icon.svg" alt="Athletiq" class="h-14 w-auto transition-transform duration-300 hover:scale-105" />
            </NuxtLink>
            <div class="flex items-center space-x-3">
              <span class="text-2xl text-primary-400 font-light">|</span>
              <h1 class="text-2xl font-bold text-display bg-gradient-to-l from-[#d4c4b0] to-[#9d8569] bg-clip-text text-transparent">Suivi Corporel</h1>
            </div>
          </div>

          <button @click="navigateTo('/dashboard')" class="btn-outline">
            Retour
          </button>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="pt-32 px-6 pb-20 max-w-7xl mx-auto">
      <!-- Page Header -->
      <div class="fade-in text-center mb-8">
        <h2 class="text-4xl md:text-5xl font-bold text-primary-900 dark:text-primary-100 mb-4 text-display">
          Votre Transformation
        </h2>
        <p class="text-lg text-primary-600 dark:text-primary-400">
          Suivez votre progression physique
        </p>
      </div>

      <!-- Tab Navigation -->
      <div class="flex justify-center mb-10 slide-up">
        <div class="flex space-x-2 bg-white dark:bg-primary-900 bg-opacity-50 dark:bg-opacity-50 backdrop-blur-lg rounded-xl p-1">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="activeTab = tab.key"
            :class="[
              'px-6 py-2.5 rounded-lg text-sm font-semibold transition-all',
              activeTab === tab.key
                ? 'bg-gradient-primary text-white shadow-sm'
                : 'text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100'
            ]"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="bodyStore.isLoading" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary-300 dark:border-primary-600 border-t-primary-600 dark:border-t-primary-400"></div>
        <p class="mt-4 text-primary-600 dark:text-primary-400 text-lg">Chargement...</p>
      </div>

      <!-- ==================== ONGLET POIDS ==================== -->
      <div v-else-if="activeTab === 'weight'" class="space-y-8 slide-up">
        <!-- Quick Add Form -->
        <div class="card-glass">
          <h3 class="text-2xl font-bold text-primary-900 dark:text-primary-100 mb-6">Ajouter une pesée</h3>
          <form @submit.prevent="submitWeight" class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">Poids (kg) *</label>
              <input
                v-model.number="weightForm.weight"
                type="number"
                step="0.1"
                min="0"
                placeholder="75.5"
                class="input-primary"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">Body fat (%)</label>
              <input
                v-model.number="weightForm.bodyFat"
                type="number"
                step="0.1"
                min="0"
                max="100"
                placeholder="15.0"
                class="input-primary"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">Notes</label>
              <input
                v-model="weightForm.notes"
                type="text"
                placeholder="À jeun, après sport..."
                class="input-primary"
              />
            </div>
            <div class="flex items-end">
              <button type="submit" class="btn-primary w-full" :disabled="!weightForm.weight || weightSaving">
                {{ weightSaving ? 'Enregistrement...' : 'Enregistrer' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Weight Stats -->
        <div v-if="bodyStore.bodyStats.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="card-glass !p-6 text-center">
            <p class="text-sm text-primary-600 dark:text-primary-400 mb-1">Poids actuel</p>
            <p class="text-3xl font-bold text-primary-900 dark:text-primary-100">{{ bodyStore.latestWeight?.weight }} <span class="text-lg">kg</span></p>
          </div>
          <div class="card-glass !p-6 text-center">
            <p class="text-sm text-primary-600 dark:text-primary-400 mb-1">Variation 30j</p>
            <p :class="['text-3xl font-bold', weightChangeClass]">
              {{ bodyStore.weightChange30d !== null ? (bodyStore.weightChange30d > 0 ? '+' : '') + bodyStore.weightChange30d : '—' }}
              <span class="text-lg">kg</span>
            </p>
          </div>
          <div class="card-glass !p-6 text-center">
            <p class="text-sm text-primary-600 dark:text-primary-400 mb-1">Min</p>
            <p class="text-3xl font-bold text-primary-900 dark:text-primary-100">{{ minWeight }} <span class="text-lg">kg</span></p>
          </div>
          <div class="card-glass !p-6 text-center">
            <p class="text-sm text-primary-600 dark:text-primary-400 mb-1">Max</p>
            <p class="text-3xl font-bold text-primary-900 dark:text-primary-100">{{ maxWeight }} <span class="text-lg">kg</span></p>
          </div>
        </div>

        <!-- Weight Chart -->
        <div v-if="bodyStore.bodyStats.length > 1" class="card-glass">
          <h3 class="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-6">Évolution du poids</h3>
          <div class="h-[300px]">
            <BodyWeightChart :stats="bodyStore.bodyStats" />
          </div>
        </div>

        <!-- Weight History -->
        <div v-if="bodyStore.bodyStats.length > 0" class="card-glass">
          <h3 class="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-6">Historique</h3>
          <div class="space-y-3">
            <div
              v-for="stat in bodyStore.bodyStats"
              :key="stat.id"
              class="flex items-center justify-between p-4 bg-primary-50 dark:bg-primary-800 rounded-xl"
            >
              <div>
                <p class="font-semibold text-primary-900 dark:text-primary-100">{{ stat.weight }} kg</p>
                <p class="text-sm text-primary-600 dark:text-primary-400">
                  {{ formatDate(stat.date) }}
                  <span v-if="stat.bodyFat"> · {{ stat.bodyFat }}% BF</span>
                  <span v-if="stat.notes"> · {{ stat.notes }}</span>
                </p>
              </div>
              <button
                @click="deleteWeight(stat.id)"
                class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-primary-400 hover:text-red-500 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ==================== ONGLET MENSURATIONS ==================== -->
      <div v-else-if="activeTab === 'measurements'" class="space-y-8 slide-up">
        <!-- Add Form -->
        <div class="card-glass">
          <h3 class="text-2xl font-bold text-primary-900 dark:text-primary-100 mb-6">Nouvelle mesure</h3>
          <form @submit.prevent="submitMeasurement" class="space-y-4">
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div v-for="field in measurementFields" :key="field.key">
                <label class="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">{{ field.label }} (cm)</label>
                <input
                  v-model.number="measurementForm[field.key]"
                  type="number"
                  step="0.1"
                  min="0"
                  :placeholder="field.placeholder"
                  class="input-primary"
                />
              </div>
            </div>
            <button type="submit" class="btn-primary" :disabled="!hasAnyMeasurement || measurementSaving">
              {{ measurementSaving ? 'Enregistrement...' : 'Enregistrer' }}
            </button>
          </form>
        </div>

        <!-- Latest Measurement -->
        <div v-if="bodyStore.latestMeasurement" class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div
            v-for="field in measurementFields"
            :key="field.key"
            class="card-glass !p-6 text-center"
          >
            <p class="text-sm text-primary-600 dark:text-primary-400 mb-1">{{ field.label }}</p>
            <p class="text-2xl font-bold text-primary-900 dark:text-primary-100">
              {{ bodyStore.latestMeasurement[field.key as keyof typeof bodyStore.latestMeasurement] || '—' }}
              <span v-if="bodyStore.latestMeasurement[field.key as keyof typeof bodyStore.latestMeasurement]" class="text-sm">cm</span>
            </p>
            <!-- Variation -->
            <p v-if="getMeasurementVariation(field.key)" :class="['text-sm font-medium mt-1', getMeasurementVariation(field.key)! > 0 ? 'text-green-500' : 'text-red-500']">
              {{ getMeasurementVariation(field.key)! > 0 ? '+' : '' }}{{ getMeasurementVariation(field.key) }} cm
            </p>
          </div>
        </div>

        <!-- Measurement History -->
        <div v-if="bodyStore.measurements.length > 0" class="card-glass">
          <h3 class="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-6">Historique</h3>
          <div class="space-y-3">
            <div
              v-for="m in bodyStore.measurements"
              :key="m.id"
              class="flex items-center justify-between p-4 bg-primary-50 dark:bg-primary-800 rounded-xl"
            >
              <div>
                <p class="font-semibold text-primary-900 dark:text-primary-100">{{ formatDate(m.date) }}</p>
                <p class="text-sm text-primary-600 dark:text-primary-400">
                  <span v-if="m.chest">Poitrine: {{ m.chest }}cm</span>
                  <span v-if="m.waist"> · Taille: {{ m.waist }}cm</span>
                  <span v-if="m.hips"> · Hanches: {{ m.hips }}cm</span>
                  <span v-if="m.biceps"> · Biceps: {{ m.biceps }}cm</span>
                  <span v-if="m.thighs"> · Cuisses: {{ m.thighs }}cm</span>
                  <span v-if="m.calves"> · Mollets: {{ m.calves }}cm</span>
                </p>
              </div>
              <button
                @click="deleteMeasurement(m.id)"
                class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-primary-400 hover:text-red-500 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ==================== ONGLET PHOTOS ==================== -->
      <div v-else-if="activeTab === 'photos'" class="space-y-8 slide-up">
        <!-- Upload Section -->
        <div class="card-glass">
          <h3 class="text-2xl font-bold text-primary-900 dark:text-primary-100 mb-6">Ajouter une photo</h3>
          <div class="flex flex-col md:flex-row gap-4 items-end">
            <div class="flex-1">
              <label class="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">Workout associé</label>
              <select v-model="photoForm.workoutId" class="input-primary">
                <option :value="null" disabled>Sélectionner un workout</option>
                <option v-for="w in completedWorkouts" :key="w.id" :value="w.id">
                  {{ w.name }} — {{ formatDate(w.completedAt!) }}
                </option>
              </select>
            </div>
            <div class="flex items-center h-[46px]">
              <label class="flex items-center space-x-2 text-sm text-primary-700 dark:text-primary-300 cursor-pointer">
                <input type="checkbox" v-model="photoForm.isPrimary" class="checkbox-primary" />
                <span>Photo principale (timelapse)</span>
              </label>
            </div>
            <div>
              <label class="btn-primary cursor-pointer inline-flex items-center space-x-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <span>{{ photoUploading ? 'Upload...' : 'Choisir photo' }}</span>
                <input
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handlePhotoUpload"
                  :disabled="!photoForm.workoutId || photoUploading"
                />
              </label>
            </div>
          </div>
        </div>

        <!-- Timelapse Section -->
        <div v-if="timelapsePhotos.length > 0" class="card-glass">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-semibold text-primary-900 dark:text-primary-100">Timelapse</h3>
            <button @click="showTimelapse = !showTimelapse" class="btn-outline !py-2 !px-4 text-sm">
              {{ showTimelapse ? 'Masquer' : 'Voir le timelapse' }}
            </button>
          </div>
          <BodyTimelapseViewer v-if="showTimelapse" :photos="timelapsePhotos" />
        </div>

        <!-- Comparaison Avant / Après -->
        <BodyPhotoComparison
          v-if="bodyStore.photos.length >= 2"
          :photos="bodyStore.photos"
        />

        <!-- Photo Grid -->
        <div v-if="bodyStore.photos.length > 0" class="card-glass">
          <h3 class="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-6">Galerie</h3>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div
              v-for="photo in bodyStore.photos"
              :key="photo.id"
              class="relative group aspect-square rounded-xl overflow-hidden cursor-pointer"
              @click="openPhoto(photo)"
            >
              <img :src="photo.photoUrl" :alt="`Photo ${photo.id}`" class="w-full h-full object-cover" />
              <div class="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-end">
                <div class="w-full p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <p class="text-white text-sm font-medium">{{ formatDate(photo.createdAt) }}</p>
                  <p v-if="photo.isPrimary" class="text-yellow-300 text-xs">★ Principale</p>
                </div>
              </div>
              <!-- Delete button -->
              <button
                @click.stop="deletePhoto(photo.id)"
                class="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-red-500 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
              >
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="bodyStore.photos.length === 0 && !bodyStore.isLoading" class="card-glass text-center py-16">
          <svg class="w-20 h-20 mx-auto mb-4 text-primary-300 dark:text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          <p class="text-lg text-primary-600 dark:text-primary-400 mb-2">Aucune photo pour le moment</p>
          <p class="text-sm text-primary-500 dark:text-primary-500">Ajoutez des photos pour suivre votre transformation</p>
        </div>
      </div>

      <!-- Fullscreen Photo Modal -->
      <Teleport to="body">
        <Transition name="modal">
          <div v-if="selectedPhoto" class="fixed inset-0 z-[100] flex items-center justify-center p-4" @click="selectedPhoto = null">
            <div class="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
            <img
              :src="selectedPhoto.photoUrl"
              class="relative max-w-full max-h-[90vh] rounded-2xl object-contain"
              @click.stop
            />
            <button
              @click="selectedPhoto = null"
              class="absolute top-6 right-6 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center text-white transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </Transition>
      </Teleport>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useBodyStore } from '~/stores/body'
import { useWorkoutStore } from '~/stores/workout'
import type { ProgressPhoto, Measurement } from '~/types/body'

const authStore = useAuthStore()
const bodyStore = useBodyStore()
const workoutStore = useWorkoutStore()
const toast = useToast()
const router = useRouter()

const activeTab = ref<'weight' | 'measurements' | 'photos'>('weight')

const tabs = [
  { key: 'weight' as const, label: 'Poids' },
  { key: 'measurements' as const, label: 'Mensurations' },
  { key: 'photos' as const, label: 'Photos' }
]

// ========== WEIGHT ==========
const weightForm = reactive({ weight: null as number | null, bodyFat: null as number | null, notes: '' })
const weightSaving = ref(false)

const submitWeight = async () => {
  if (!weightForm.weight) return
  weightSaving.value = true
  try {
    await bodyStore.addBodyStat({
      weight: weightForm.weight,
      bodyFat: weightForm.bodyFat || undefined,
      notes: weightForm.notes || undefined
    })
    weightForm.weight = null
    weightForm.bodyFat = null
    weightForm.notes = ''
    toast.success('Poids enregistré')
  } catch (e) {
    toast.error('Erreur lors de l\'enregistrement')
    console.error(e)
  } finally {
    weightSaving.value = false
  }
}

const deleteWeight = async (id: number) => {
  await bodyStore.deleteBodyStat(id)
}

const minWeight = computed(() => {
  if (bodyStore.bodyStats.length === 0) return 0
  return Math.min(...bodyStore.bodyStats.map(s => s.weight))
})

const maxWeight = computed(() => {
  if (bodyStore.bodyStats.length === 0) return 0
  return Math.max(...bodyStore.bodyStats.map(s => s.weight))
})

const weightChangeClass = computed(() => {
  if (bodyStore.weightChange30d === null) return 'text-primary-900 dark:text-primary-100'
  return bodyStore.weightChange30d > 0 ? 'text-green-500' : bodyStore.weightChange30d < 0 ? 'text-red-500' : 'text-primary-900 dark:text-primary-100'
})

// ========== MEASUREMENTS ==========
const measurementForm = reactive({
  chest: null as number | null,
  waist: null as number | null,
  hips: null as number | null,
  biceps: null as number | null,
  thighs: null as number | null,
  calves: null as number | null
})
const measurementSaving = ref(false)

const measurementFields = [
  { key: 'chest', label: 'Poitrine', placeholder: '95' },
  { key: 'waist', label: 'Taille', placeholder: '80' },
  { key: 'hips', label: 'Hanches', placeholder: '95' },
  { key: 'biceps', label: 'Biceps', placeholder: '35' },
  { key: 'thighs', label: 'Cuisses', placeholder: '55' },
  { key: 'calves', label: 'Mollets', placeholder: '38' }
]

const hasAnyMeasurement = computed(() => {
  return Object.values(measurementForm).some(v => v !== null && v > 0)
})

const submitMeasurement = async () => {
  if (!hasAnyMeasurement.value) return
  measurementSaving.value = true
  try {
    const data: Record<string, number | undefined> = {}
    for (const field of measurementFields) {
      const val = measurementForm[field.key as keyof typeof measurementForm]
      if (val && val > 0) data[field.key] = val
    }
    await bodyStore.addMeasurement(data)
    // Reset form
    for (const field of measurementFields) {
      ;(measurementForm as any)[field.key] = null
    }
    toast.success('Mensurations enregistrées')
  } catch (e) {
    toast.error('Erreur lors de l\'enregistrement')
    console.error(e)
  } finally {
    measurementSaving.value = false
  }
}

const deleteMeasurement = async (id: number) => {
  await bodyStore.deleteMeasurement(id)
}

const getMeasurementVariation = (key: string) => {
  if (bodyStore.measurements.length < 2) return null
  const latest = bodyStore.measurements[0][key as keyof Measurement] as number | undefined
  const previous = bodyStore.measurements[1][key as keyof Measurement] as number | undefined
  if (!latest || !previous) return null
  return +((latest as number) - (previous as number)).toFixed(1)
}

// ========== PHOTOS ==========
const photoForm = reactive({ workoutId: null as number | null, isPrimary: true })
const photoUploading = ref(false)
const selectedPhoto = ref<ProgressPhoto | null>(null)
const showTimelapse = ref(false)
const timelapsePhotos = ref<ProgressPhoto[]>([])

const completedWorkouts = computed(() => {
  return workoutStore.workoutHistory
})

const handlePhotoUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file || !photoForm.workoutId) return

  photoUploading.value = true
  try {
    await bodyStore.uploadPhoto(photoForm.workoutId, file, photoForm.isPrimary)
    input.value = ''
    // Refresh timelapse
    timelapsePhotos.value = await bodyStore.fetchTimelapse()
    toast.success('Photo uploadée')
  } catch (e) {
    toast.error('Erreur lors de l\'upload')
    console.error(e)
  } finally {
    photoUploading.value = false
  }
}

const openPhoto = (photo: ProgressPhoto) => {
  selectedPhoto.value = photo
}

const deletePhoto = async (id: number) => {
  await bodyStore.deletePhoto(id)
  timelapsePhotos.value = await bodyStore.fetchTimelapse()
}

// ========== INIT ==========
onMounted(async () => {
  authStore.loadFromLocalStorage()
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }

  await Promise.all([
    bodyStore.fetchBodyStats(),
    bodyStore.fetchMeasurements(),
    bodyStore.fetchPhotos(),
    workoutStore.fetchWorkouts()
  ])

  try {
    timelapsePhotos.value = await bodyStore.fetchTimelapse()
  } catch (e) {
    // Timelapse may be empty
  }
})

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date(dateString))
}

definePageMeta({
  middleware: 'auth'
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.bg-gradient-primary {
  background: linear-gradient(135deg, #d4c4b0 0%, #b8a48f 100%);
}

.checkbox-primary {
  appearance: none;
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border: 2px solid #d4c4b0;
  border-radius: 5px;
  background: transparent;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.checkbox-primary:checked {
  background: linear-gradient(135deg, #d4c4b0 0%, #b8a48f 100%);
  border-color: #b8a48f;
}

.checkbox-primary:checked::after {
  content: '';
  position: absolute;
  top: 1px;
  left: 5px;
  width: 5px;
  height: 9px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}
</style>
