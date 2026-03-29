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

    <!-- Main Content -->
    <div class="pt-24 md:pt-32 px-4 md:px-6 pb-28 lg:pb-20 max-w-7xl mx-auto">
      <!-- Page Header -->
      <div class="fade-in text-center mb-8">
        <h1 class="text-3xl md:text-5xl lg:text-6xl font-bold text-display bg-gradient-to-r from-sand-500 to-primary-900 dark:to-primary-100 bg-clip-text text-transparent mb-2">
          Votre Transformation
        </h1>
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
              'px-3 md:px-6 py-2 md:py-2.5 rounded-lg text-sm md:text-base font-semibold transition-all',
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
                max="500"
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
            <p class="text-2xl md:text-3xl font-bold text-primary-900 dark:text-primary-100">{{ bodyStore.latestWeight?.weight }} <span class="text-lg">kg</span></p>
          </div>
          <div class="card-glass !p-6 text-center">
            <p class="text-sm text-primary-600 dark:text-primary-400 mb-1">Variation 30j</p>
            <p :class="['text-2xl md:text-3xl font-bold', weightChangeClass]">
              {{ bodyStore.weightChange30d !== null ? (bodyStore.weightChange30d > 0 ? '+' : '') + bodyStore.weightChange30d : '—' }}
              <span class="text-lg">kg</span>
            </p>
          </div>
          <div class="card-glass !p-6 text-center">
            <p class="text-sm text-primary-600 dark:text-primary-400 mb-1">Min</p>
            <p class="text-2xl md:text-3xl font-bold text-primary-900 dark:text-primary-100">{{ minWeight }} <span class="text-lg">kg</span></p>
          </div>
          <div class="card-glass !p-6 text-center">
            <p class="text-sm text-primary-600 dark:text-primary-400 mb-1">Max</p>
            <p class="text-2xl md:text-3xl font-bold text-primary-900 dark:text-primary-100">{{ maxWeight }} <span class="text-lg">kg</span></p>
          </div>
        </div>

        <!-- Weight Chart -->
        <div v-if="bodyStore.bodyStats.length > 1" class="card-glass">
          <h3 class="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-6">Évolution du poids</h3>
          <div class="h-[250px] md:h-[300px]">
            <BodyWeightChart :stats="bodyStore.bodyStats" />
          </div>
        </div>

        <!-- Weight History — Timeline -->
        <div v-if="bodyStore.bodyStats.length > 0" class="card-glass">
          <div class="flex items-center justify-between mb-8">
            <h3 class="text-xl font-semibold text-primary-900 dark:text-primary-100">Journal de pesée</h3>
            <span class="text-xs text-primary-400 dark:text-primary-500">{{ bodyStore.bodyStats.length }} entrée{{ bodyStore.bodyStats.length > 1 ? 's' : '' }}</span>
          </div>

          <div class="relative">
            <!-- Timeline line -->
            <div class="absolute left-[23px] top-0 bottom-0 w-px bg-gradient-to-b from-sand-500/40 via-primary-200 dark:via-primary-700 to-transparent"></div>

            <div class="space-y-0">
              <div
                v-for="(stat, index) in bodyStore.bodyStats"
                :key="stat.id"
                class="relative flex gap-4 md:gap-5 group"
              >
                <!-- Timeline dot -->
                <div class="relative z-10 flex flex-col items-center pt-4">
                  <div class="w-[13px] h-[13px] rounded-full border-[3px] flex-shrink-0 transition-all"
                    :class="index === 0
                      ? 'border-sand-500 bg-sand-500 shadow-[0_0_8px_rgba(var(--sand-500),0.4)]'
                      : 'border-primary-300 dark:border-primary-600 bg-white dark:bg-primary-900 group-hover:border-sand-500'
                    "
                  ></div>
                </div>

                <!-- Content card -->
                <div class="flex-1 pb-6">
                  <div class="rounded-2xl border border-primary-100 dark:border-primary-800 p-4 transition-all group-hover:border-primary-200 dark:group-hover:border-primary-700 group-hover:shadow-sm"
                    :class="index === 0 ? 'bg-gradient-to-br from-sand-500/[0.04] to-transparent border-sand-500/20 dark:border-sand-500/10' : ''">

                    <!-- Top row: date + delete -->
                    <div class="flex items-center justify-between mb-3">
                      <div class="flex items-center gap-2">
                        <span class="text-[11px] font-semibold uppercase tracking-wider text-primary-400 dark:text-primary-500">
                          {{ getWeightDay(stat.date) }}
                        </span>
                        <span class="text-[11px] text-primary-300 dark:text-primary-600">{{ getWeightMonthYear(stat.date) }}</span>
                      </div>
                      <button
                        @click="deleteWeight(stat.id)"
                        class="w-7 h-7 flex items-center justify-center rounded-lg text-primary-300 dark:text-primary-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    </div>

                    <!-- Weight value + diff -->
                    <div class="flex items-end justify-between mb-3">
                      <div class="flex items-baseline gap-1.5">
                        <span class="text-2xl font-bold text-primary-900 dark:text-primary-100 tabular-nums">{{ stat.weight }}</span>
                        <span class="text-sm font-medium text-primary-400 dark:text-primary-500">kg</span>
                      </div>
                      <span v-if="getWeightDiff(index)" class="text-xs font-bold tabular-nums"
                        :class="getWeightDiff(index)! > 0 ? 'text-green-500' : 'text-red-500'">
                        {{ getWeightDiff(index)! > 0 ? '+' : '' }}{{ getWeightDiff(index) }}
                      </span>
                    </div>

                    <!-- Progress bar -->
                    <div class="h-1.5 rounded-full bg-primary-100 dark:bg-primary-800 overflow-hidden mb-2.5">
                      <div
                        class="h-full rounded-full transition-all duration-500"
                        :class="index === 0 ? 'bg-gradient-to-r from-sand-500 to-sand-600' : 'bg-primary-300 dark:bg-primary-600'"
                        :style="{ width: getWeightBarWidth(stat.weight) + '%' }"
                      ></div>
                    </div>

                    <!-- Meta row -->
                    <div class="flex items-center gap-2 flex-wrap">
                      <span v-if="stat.bodyFat" class="inline-flex items-center text-[11px] font-semibold text-primary-500 dark:text-primary-400 bg-primary-50 dark:bg-primary-800/80 px-2 py-0.5 rounded-md">
                        {{ stat.bodyFat }}% BF
                      </span>
                      <span v-if="stat.notes" class="text-[11px] text-primary-400 dark:text-primary-500 italic truncate">{{ stat.notes }}</span>
                    </div>
                  </div>
                </div>
              </div>
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
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div v-for="field in measurementFields" :key="field.key">
                <label class="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">{{ field.label }} (cm)</label>
                <input
                  v-model.number="(measurementForm as any)[field.key]"
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
        <div v-if="bodyStore.latestMeasurement" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-primary-900 dark:text-primary-100">Historique Mensurations</h3>
          </div>
          <div class="space-y-4">
            <div
              v-for="m in bodyStore.measurements"
              :key="m.id"
              class="rounded-xl border border-primary-200/60 dark:border-primary-700/60 overflow-hidden group hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
            >
              <!-- Date header -->
              <div class="flex items-center justify-between px-4 py-2.5 bg-primary-50/70 dark:bg-primary-800/50">
                <span class="text-sm font-semibold text-primary-700 dark:text-primary-300">{{ formatDate(m.date) }}</span>
                <button
                  @click="deleteMeasurement(m.id)"
                  class="w-7 h-7 flex items-center justify-center rounded-lg text-primary-300 dark:text-primary-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
              <!-- Measurement values grid -->
              <div class="grid grid-cols-3 sm:grid-cols-6 divide-x divide-primary-100 dark:divide-primary-800">
                <div v-if="m.chest" class="px-3 py-3 text-center">
                  <p class="text-[10px] uppercase tracking-wider text-primary-400 dark:text-primary-500 mb-0.5">Poitrine</p>
                  <p class="text-sm font-bold text-primary-900 dark:text-primary-100">{{ m.chest }}<span class="text-[10px] font-normal text-primary-400">cm</span></p>
                </div>
                <div v-if="m.waist" class="px-3 py-3 text-center">
                  <p class="text-[10px] uppercase tracking-wider text-primary-400 dark:text-primary-500 mb-0.5">Taille</p>
                  <p class="text-sm font-bold text-primary-900 dark:text-primary-100">{{ m.waist }}<span class="text-[10px] font-normal text-primary-400">cm</span></p>
                </div>
                <div v-if="m.hips" class="px-3 py-3 text-center">
                  <p class="text-[10px] uppercase tracking-wider text-primary-400 dark:text-primary-500 mb-0.5">Hanches</p>
                  <p class="text-sm font-bold text-primary-900 dark:text-primary-100">{{ m.hips }}<span class="text-[10px] font-normal text-primary-400">cm</span></p>
                </div>
                <div v-if="m.biceps" class="px-3 py-3 text-center">
                  <p class="text-[10px] uppercase tracking-wider text-primary-400 dark:text-primary-500 mb-0.5">Biceps</p>
                  <p class="text-sm font-bold text-primary-900 dark:text-primary-100">{{ m.biceps }}<span class="text-[10px] font-normal text-primary-400">cm</span></p>
                </div>
                <div v-if="m.thighs" class="px-3 py-3 text-center">
                  <p class="text-[10px] uppercase tracking-wider text-primary-400 dark:text-primary-500 mb-0.5">Cuisses</p>
                  <p class="text-sm font-bold text-primary-900 dark:text-primary-100">{{ m.thighs }}<span class="text-[10px] font-normal text-primary-400">cm</span></p>
                </div>
                <div v-if="m.calves" class="px-3 py-3 text-center">
                  <p class="text-[10px] uppercase tracking-wider text-primary-400 dark:text-primary-500 mb-0.5">Mollets</p>
                  <p class="text-sm font-bold text-primary-900 dark:text-primary-100">{{ m.calves }}<span class="text-[10px] font-normal text-primary-400">cm</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Photos Tab -->
      <div v-else-if="activeTab === 'photos'" class="space-y-6 slide-up">
        <!-- Loading -->
        <div v-if="photosLoading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-10 w-10 border-4 border-primary-200 dark:border-primary-700 border-t-sand-500"></div>
        </div>

        <!-- Photos grid -->
        <div v-else-if="photos.length > 0">
          <div class="grid grid-cols-3 md:grid-cols-4 gap-2">
            <div
              v-for="photo in photos"
              :key="photo.id"
              class="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
              @click="selectedPhoto = photo"
            >
              <img :src="photo.photoUrl" :alt="`Photo`" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
              <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else class="text-center py-16">
          <Icon name="lucide:camera" class="w-16 h-16 mx-auto mb-4 text-primary-300 dark:text-primary-600" />
          <p class="text-primary-500 dark:text-primary-400 text-sm mb-1">Aucune photo pour le moment</p>
          <p class="text-primary-400 dark:text-primary-500 text-xs">Les photos prises a la fin de tes workouts apparaitront ici</p>
        </div>
      </div>

      <!-- Photo modal -->
      <Teleport to="body">
        <Transition name="fade">
          <div v-if="selectedPhoto" class="fixed inset-0 z-[100] flex items-center justify-center p-4" @click="selectedPhoto = null">
            <div class="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
            <img :src="selectedPhoto.photoUrl" class="relative max-w-full max-h-[90vh] rounded-2xl object-contain" @click.stop />
            <button @click="selectedPhoto = null" class="absolute top-6 right-6 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center text-white transition-colors">
              <Icon name="lucide:x" class="w-6 h-6" />
            </button>
          </div>
        </Transition>
      </Teleport>
    </div>

    <MobileBottomNav active-path="/body" />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useBodyStore } from '~/stores/body'

useHead({ meta: [{ name: 'robots', content: 'noindex, nofollow' }] })
import type { Measurement } from '~/types/body'

const authStore = useAuthStore()
const bodyStore = useBodyStore()
const toast = useToast()

const activeTab = ref<'weight' | 'measurements' | 'photos'>('weight')

const tabs = [
  { key: 'weight' as const, label: 'Poids' },
  { key: 'measurements' as const, label: 'Mensurations' },
  { key: 'photos' as const, label: 'Photos' }
]

// ========== PHOTOS ==========
const photos = ref<any[]>([])
const selectedPhoto = ref<any>(null)
const photosLoading = ref(false)

const loadPhotos = async () => {
  photosLoading.value = true
  try {
    const { getRecentPhotos } = useBodyApi()
    photos.value = await getRecentPhotos(50)
  } catch {
    photos.value = []
  } finally {
    photosLoading.value = false
  }
}

watch(activeTab, (tab) => {
  if (tab === 'photos' && photos.value.length === 0) loadPhotos()
})

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
    logger.error(e)
  } finally {
    weightSaving.value = false
  }
}

const deletingIds = ref(new Set<string>())

const deleteWeight = async (id: number) => {
  const key = `weight-${id}`
  if (deletingIds.value.has(key)) return
  deletingIds.value.add(key)
  try {
    await bodyStore.deleteBodyStat(id)
  } finally {
    deletingIds.value.delete(key)
  }
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

const getWeightDiff = (index: number): number | null => {
  const stats = bodyStore.bodyStats
  if (index >= stats.length - 1) return null
  return Math.round((stats[index].weight - stats[index + 1].weight) * 10) / 10
}

const getWeightBarWidth = (weight: number): number => {
  if (bodyStore.bodyStats.length < 2) return 100
  const min = Math.min(...bodyStore.bodyStats.map(s => s.weight))
  const max = Math.max(...bodyStore.bodyStats.map(s => s.weight))
  if (max === min) return 100
  return Math.max(15, ((weight - min) / (max - min)) * 100)
}

const getWeightDay = (dateString: string) => {
  const d = new Date(dateString)
  return d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })
}

const getWeightMonthYear = (dateString: string) => {
  const d = new Date(dateString)
  return d.toLocaleDateString('fr-FR', { year: 'numeric' })
}

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
    logger.error(e)
  } finally {
    measurementSaving.value = false
  }
}

const deleteMeasurement = async (id: number) => {
  const key = `measurement-${id}`
  if (deletingIds.value.has(key)) return
  deletingIds.value.add(key)
  try {
    await bodyStore.deleteMeasurement(id)
  } finally {
    deletingIds.value.delete(key)
  }
}

const getMeasurementVariation = (key: string) => {
  if (bodyStore.measurements.length < 2) return null
  const latest = bodyStore.measurements[0][key as keyof Measurement] as number | undefined
  const previous = bodyStore.measurements[1][key as keyof Measurement] as number | undefined
  if (!latest || !previous) return null
  return +((latest as number) - (previous as number)).toFixed(1)
}

// ========== INIT ==========
onMounted(async () => {
  await Promise.all([
    bodyStore.fetchBodyStats(),
    bodyStore.fetchMeasurements(),
  ])
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
.bg-gradient-primary {
  background: linear-gradient(135deg, rgb(var(--sand-500)) 0%, rgb(var(--sand-600)) 100%);
}

.checkbox-primary {
  appearance: none;
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border: 2px solid rgb(var(--sand-500));
  border-radius: 5px;
  background: transparent;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.checkbox-primary:checked {
  background: linear-gradient(135deg, rgb(var(--sand-500)) 0%, rgb(var(--sand-600)) 100%);
  border-color: rgb(var(--sand-600));
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
