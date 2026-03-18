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
    <div class="pt-24 md:pt-32 px-4 md:px-6 pb-28 lg:pb-20 max-w-4xl mx-auto">
      <!-- Back Button -->
      <button @click="navigateTo('/dashboard')" class="flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100 transition-colors mb-6 fade-in">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        <span class="font-medium">Retour au tableau de bord</span>
      </button>

      <!-- Page Header -->
      <div class="fade-in text-center mb-8">
        <h1 class="text-3xl md:text-5xl lg:text-6xl font-bold text-display bg-gradient-to-r from-sand-500 to-primary-900 dark:to-primary-100 bg-clip-text text-transparent mb-2">
          Calculateurs
        </h1>
        <p class="text-lg text-primary-600 dark:text-primary-400">Optimisez vos entraînements avec nos outils</p>
      </div>

      <!-- Tab Selector -->
      <div class="flex justify-center mb-8 fade-in">
        <div class="flex space-x-1 bg-white dark:bg-primary-900 bg-opacity-50 dark:bg-opacity-50 backdrop-blur-lg rounded-xl p-1 w-full max-w-lg">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'flex-1 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap',
              activeTab === tab.id
                ? 'bg-gradient-primary text-white shadow-sm'
                : 'text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100'
            ]"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- Tab Content with Transition -->
      <Transition name="tab-fade" mode="out-in">
        <!-- Tab 1: 1RM Calculator -->
        <div v-if="activeTab === '1rm'" key="1rm" class="slide-up">
          <div class="card-glass mb-6">
            <h2 class="text-xl md:text-2xl font-bold text-primary-900 dark:text-primary-100 mb-2">
              Calculateur 1RM
            </h2>
            <p class="text-primary-600 dark:text-primary-400 mb-6">
              Estimez votre charge maximale (1 Repetition Maximum) à partir d'une série réalisée.
            </p>

            <div class="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label class="block text-sm font-semibold text-primary-700 dark:text-primary-300 mb-2">
                  Poids (kg)
                </label>
                <input
                  v-model.number="rm.weight"
                  type="number"
                  min="0"
                  step="0.5"
                  placeholder="100"
                  class="w-full px-4 py-3 rounded-xl bg-white dark:bg-primary-800 border border-primary-200 dark:border-primary-700 text-primary-900 dark:text-primary-100 focus:ring-2 focus:ring-sand-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-primary-700 dark:text-primary-300 mb-2">
                  Répétitions
                </label>
                <input
                  v-model.number="rm.reps"
                  type="number"
                  min="1"
                  max="30"
                  placeholder="5"
                  class="w-full px-4 py-3 rounded-xl bg-white dark:bg-primary-800 border border-primary-200 dark:border-primary-700 text-primary-900 dark:text-primary-100 focus:ring-2 focus:ring-sand-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <button
              @click="calculate1RM"
              :disabled="!rm.weight || !rm.reps || rm.loading"
              class="btn-primary w-full"
            >
              <span v-if="rm.loading" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Calcul en cours...
              </span>
              <span v-else>Calculer</span>
            </button>
          </div>

          <!-- 1RM Result -->
          <Transition name="tab-fade">
            <div v-if="rm.result" class="space-y-6">
              <!-- Big 1RM Display -->
              <div class="card-glass text-center">
                <p class="text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-1">
                  1RM Estimé
                </p>
                <p class="text-5xl md:text-7xl font-bold bg-gradient-to-r from-sand-500 to-sand-600 bg-clip-text text-transparent">
                  {{ rm.result.estimated_1rm }} kg
                </p>
              </div>

              <!-- Percentage Table -->
              <div class="card-glass overflow-hidden">
                <h3 class="text-lg font-bold text-primary-900 dark:text-primary-100 mb-4">
                  Table des pourcentages
                </h3>
                <div class="overflow-x-auto -mx-6 px-6">
                  <table class="w-full">
                    <thead>
                      <tr class="border-b border-primary-200 dark:border-primary-700">
                        <th class="text-left py-3 text-sm font-semibold text-primary-600 dark:text-primary-400">%</th>
                        <th class="text-center py-3 text-sm font-semibold text-primary-600 dark:text-primary-400">Poids</th>
                        <th class="text-right py-3 text-sm font-semibold text-primary-600 dark:text-primary-400">Reps suggérées</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="row in rm.result.percentages"
                        :key="row.percentage"
                        class="border-b border-primary-100 dark:border-primary-800 last:border-0 hover:bg-primary-50 dark:hover:bg-primary-800/50 transition-colors"
                      >
                        <td class="py-3 text-sm font-bold text-primary-900 dark:text-primary-100">
                          {{ row.percentage }}%
                        </td>
                        <td class="py-3 text-center text-sm font-semibold text-sand-600 dark:text-sand-400">
                          {{ row.weight }} kg
                        </td>
                        <td class="py-3 text-right text-sm text-primary-600 dark:text-primary-400">
                          {{ row.reps }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <!-- Tab 2: TDEE / Macros Calculator -->
        <div v-else-if="activeTab === 'tdee'" key="tdee" class="slide-up">
          <div class="card-glass mb-6">
            <h2 class="text-xl md:text-2xl font-bold text-primary-900 dark:text-primary-100 mb-2">
              Calculateur TDEE / Macros
            </h2>
            <p class="text-primary-600 dark:text-primary-400 mb-6">
              Calculez vos besoins caloriques journaliers et la répartition de vos macronutriments.
            </p>

            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-sm font-semibold text-primary-700 dark:text-primary-300 mb-2">
                  Poids (kg)
                </label>
                <input
                  v-model.number="tdee.weight"
                  type="number"
                  min="0"
                  placeholder="75"
                  class="w-full px-4 py-3 rounded-xl bg-white dark:bg-primary-800 border border-primary-200 dark:border-primary-700 text-primary-900 dark:text-primary-100 focus:ring-2 focus:ring-sand-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-primary-700 dark:text-primary-300 mb-2">
                  Taille (cm)
                </label>
                <input
                  v-model.number="tdee.height"
                  type="number"
                  min="0"
                  placeholder="175"
                  class="w-full px-4 py-3 rounded-xl bg-white dark:bg-primary-800 border border-primary-200 dark:border-primary-700 text-primary-900 dark:text-primary-100 focus:ring-2 focus:ring-sand-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-sm font-semibold text-primary-700 dark:text-primary-300 mb-2">
                  Âge
                </label>
                <input
                  v-model.number="tdee.age"
                  type="number"
                  min="0"
                  max="120"
                  placeholder="25"
                  class="w-full px-4 py-3 rounded-xl bg-white dark:bg-primary-800 border border-primary-200 dark:border-primary-700 text-primary-900 dark:text-primary-100 focus:ring-2 focus:ring-sand-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-primary-700 dark:text-primary-300 mb-2">
                  Genre
                </label>
                <select
                  v-model="tdee.gender"
                  class="w-full px-4 py-3 rounded-xl bg-white dark:bg-primary-800 border border-primary-200 dark:border-primary-700 text-primary-900 dark:text-primary-100 focus:ring-2 focus:ring-sand-500 focus:border-transparent transition-all"
                >
                  <option value="male">Homme</option>
                  <option value="female">Femme</option>
                </select>
              </div>
            </div>

            <div class="mb-6">
              <label class="block text-sm font-semibold text-primary-700 dark:text-primary-300 mb-2">
                Niveau d'activité
              </label>
              <select
                v-model="tdee.activityLevel"
                class="w-full px-4 py-3 rounded-xl bg-white dark:bg-primary-800 border border-primary-200 dark:border-primary-700 text-primary-900 dark:text-primary-100 focus:ring-2 focus:ring-sand-500 focus:border-transparent transition-all"
              >
                <option value="sedentary">Sédentaire</option>
                <option value="lightly_active">Légèrement actif</option>
                <option value="moderately_active">Modérément actif</option>
                <option value="active">Actif</option>
                <option value="very_active">Très actif</option>
              </select>
            </div>

            <button
              @click="calculateTDEE"
              :disabled="!tdee.weight || !tdee.height || !tdee.age || tdee.loading"
              class="btn-primary w-full"
            >
              <span v-if="tdee.loading" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Calcul en cours...
              </span>
              <span v-else>Calculer</span>
            </button>
          </div>

          <!-- TDEE Result -->
          <Transition name="tab-fade">
            <div v-if="tdee.result" class="space-y-6">
              <!-- BMR & TDEE -->
              <div class="grid grid-cols-2 gap-4">
                <div class="card-glass text-center">
                  <p class="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-1">
                    Métabolisme de base
                  </p>
                  <p class="text-3xl md:text-4xl font-bold text-primary-900 dark:text-primary-100">
                    {{ tdee.result.bmr }}
                  </p>
                  <p class="text-sm text-primary-500 dark:text-primary-500">kcal/jour</p>
                </div>
                <div class="card-glass text-center">
                  <p class="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-1">
                    TDEE
                  </p>
                  <p class="text-3xl md:text-4xl font-bold bg-gradient-to-r from-sand-500 to-sand-600 bg-clip-text text-transparent">
                    {{ tdee.result.tdee }}
                  </p>
                  <p class="text-sm text-primary-500 dark:text-primary-500">kcal/jour</p>
                </div>
              </div>

              <!-- Macro Cards -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <!-- Maintenance -->
                <div class="card-glass border-l-4 border-l-blue-500">
                  <h4 class="text-lg font-bold text-primary-900 dark:text-primary-100 mb-1">Maintenance</h4>
                  <p class="text-2xl font-bold text-blue-500 mb-3">
                    {{ tdee.result.goals.maintenance.calories }} kcal
                  </p>
                  <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                      <span class="text-primary-600 dark:text-primary-400">Protéines</span>
                      <span class="font-semibold text-primary-900 dark:text-primary-100">{{ tdee.result.goals.maintenance.protein }}g</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-primary-600 dark:text-primary-400">Glucides</span>
                      <span class="font-semibold text-primary-900 dark:text-primary-100">{{ tdee.result.goals.maintenance.carbs }}g</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-primary-600 dark:text-primary-400">Lipides</span>
                      <span class="font-semibold text-primary-900 dark:text-primary-100">{{ tdee.result.goals.maintenance.fat }}g</span>
                    </div>
                  </div>
                </div>

                <!-- Cutting -->
                <div class="card-glass border-l-4 border-l-green-500">
                  <h4 class="text-lg font-bold text-primary-900 dark:text-primary-100 mb-1">Sèche</h4>
                  <p class="text-2xl font-bold text-green-500 mb-3">
                    {{ tdee.result.goals.cutting.calories }} kcal
                  </p>
                  <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                      <span class="text-primary-600 dark:text-primary-400">Protéines</span>
                      <span class="font-semibold text-primary-900 dark:text-primary-100">{{ tdee.result.goals.cutting.protein }}g</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-primary-600 dark:text-primary-400">Glucides</span>
                      <span class="font-semibold text-primary-900 dark:text-primary-100">{{ tdee.result.goals.cutting.carbs }}g</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-primary-600 dark:text-primary-400">Lipides</span>
                      <span class="font-semibold text-primary-900 dark:text-primary-100">{{ tdee.result.goals.cutting.fat }}g</span>
                    </div>
                  </div>
                </div>

                <!-- Bulking -->
                <div class="card-glass border-l-4 border-l-orange-500">
                  <h4 class="text-lg font-bold text-primary-900 dark:text-primary-100 mb-1">Prise de masse</h4>
                  <p class="text-2xl font-bold text-orange-500 mb-3">
                    {{ tdee.result.goals.bulking.calories }} kcal
                  </p>
                  <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                      <span class="text-primary-600 dark:text-primary-400">Protéines</span>
                      <span class="font-semibold text-primary-900 dark:text-primary-100">{{ tdee.result.goals.bulking.protein }}g</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-primary-600 dark:text-primary-400">Glucides</span>
                      <span class="font-semibold text-primary-900 dark:text-primary-100">{{ tdee.result.goals.bulking.carbs }}g</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-primary-600 dark:text-primary-400">Lipides</span>
                      <span class="font-semibold text-primary-900 dark:text-primary-100">{{ tdee.result.goals.bulking.fat }}g</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <!-- Tab 3: Plate Calculator -->
        <div v-else-if="activeTab === 'plates'" key="plates" class="slide-up">
          <div class="card-glass mb-6">
            <h2 class="text-xl md:text-2xl font-bold text-primary-900 dark:text-primary-100 mb-2">
              Calculateur de plaques
            </h2>
            <p class="text-primary-600 dark:text-primary-400 mb-6">
              Visualisez les disques à charger de chaque côté de la barre.
            </p>

            <div class="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label class="block text-sm font-semibold text-primary-700 dark:text-primary-300 mb-2">
                  Poids visé (kg)
                </label>
                <input
                  v-model.number="plates.targetWeight"
                  type="number"
                  min="0"
                  step="0.5"
                  placeholder="100"
                  class="w-full px-4 py-3 rounded-xl bg-white dark:bg-primary-800 border border-primary-200 dark:border-primary-700 text-primary-900 dark:text-primary-100 focus:ring-2 focus:ring-sand-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-primary-700 dark:text-primary-300 mb-2">
                  Poids de la barre (kg)
                </label>
                <input
                  v-model.number="plates.barWeight"
                  type="number"
                  min="0"
                  step="0.5"
                  placeholder="20"
                  class="w-full px-4 py-3 rounded-xl bg-white dark:bg-primary-800 border border-primary-200 dark:border-primary-700 text-primary-900 dark:text-primary-100 focus:ring-2 focus:ring-sand-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <button
              @click="calculatePlates"
              :disabled="!plates.targetWeight || plates.loading"
              class="btn-primary w-full"
            >
              <span v-if="plates.loading" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Calcul en cours...
              </span>
              <span v-else>Calculer</span>
            </button>
          </div>

          <!-- Plates Result -->
          <Transition name="tab-fade">
            <div v-if="plates.result" class="space-y-6">
              <!-- Summary -->
              <div class="card-glass text-center">
                <p class="text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-1">
                  Par côté
                </p>
                <p class="text-lg text-primary-900 dark:text-primary-100 font-semibold">
                  {{ plates.result.weight_per_side }} kg de chaque côté
                </p>
                <p class="text-sm text-primary-500 dark:text-primary-500 mt-1">
                  Barre : {{ plates.result.bar_weight }} kg
                </p>
              </div>

              <!-- Visual Plate Display -->
              <div class="card-glass">
                <h3 class="text-lg font-bold text-primary-900 dark:text-primary-100 mb-6 text-center">
                  Disques à charger (chaque côté)
                </h3>

                <!-- No plates needed -->
                <div v-if="!plates.result.plates_per_side || plates.result.plates_per_side.length === 0" class="text-center py-8">
                  <p class="text-primary-600 dark:text-primary-400">Aucun disque nécessaire, juste la barre !</p>
                </div>

                <!-- Visual barbell -->
                <div v-else class="flex items-center justify-center gap-1 mb-8 overflow-x-auto py-4">
                  <!-- Left plates (mirrored) -->
                  <div class="flex items-center gap-0.5 flex-row-reverse">
                    <template v-for="(plate, index) in plates.result.plates_per_side" :key="'left-' + index">
                      <div
                        :class="getPlateClasses(plate)"
                        class="rounded-md flex items-center justify-center font-bold text-white shadow-lg"
                        :title="plate + ' kg'"
                      >
                        <span class="text-xs md:text-sm" :class="plate <= 2.5 ? 'text-gray-800 dark:text-gray-200' : ''">
                          {{ plate }}
                        </span>
                      </div>
                    </template>
                  </div>

                  <!-- Bar -->
                  <div class="w-20 md:w-32 h-3 bg-gradient-to-r from-gray-400 to-gray-500 dark:from-gray-500 dark:to-gray-600 rounded-full shadow-inner flex-shrink-0"></div>

                  <!-- Right plates -->
                  <div class="flex items-center gap-0.5">
                    <template v-for="(plate, index) in plates.result.plates_per_side" :key="'right-' + index">
                      <div
                        :class="getPlateClasses(plate)"
                        class="rounded-md flex items-center justify-center font-bold text-white shadow-lg"
                        :title="plate + ' kg'"
                      >
                        <span class="text-xs md:text-sm" :class="plate <= 2.5 ? 'text-gray-800 dark:text-gray-200' : ''">
                          {{ plate }}
                        </span>
                      </div>
                    </template>
                  </div>
                </div>

                <!-- Plate List -->
                <div v-if="plates.result.plates_per_side && plates.result.plates_per_side.length > 0" class="border-t border-primary-200 dark:border-primary-700 pt-4">
                  <h4 class="text-sm font-semibold text-primary-600 dark:text-primary-400 mb-3">Détail des disques</h4>
                  <div class="flex flex-wrap gap-2">
                    <template v-for="(entry, index) in plateCounts" :key="index">
                      <div class="flex items-center space-x-2 bg-primary-50 dark:bg-primary-800 rounded-lg px-3 py-2">
                        <div :class="getPlateColorDot(entry.weight)" class="w-4 h-4 rounded-full"></div>
                        <span class="text-sm font-semibold text-primary-900 dark:text-primary-100">
                          {{ entry.weight }} kg
                        </span>
                        <span class="text-xs text-primary-500 dark:text-primary-500">
                          x{{ entry.count }}
                        </span>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>

      <!-- Error Display -->
      <Transition name="tab-fade">
        <div v-if="error" class="mt-6 card-glass border-l-4 border-l-red-500">
          <div class="flex items-center space-x-3">
            <svg class="w-6 h-6 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-primary-900 dark:text-primary-100">{{ error }}</p>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Mobile Bottom Navigation -->
    <MobileBottomNav active-path="/calculators" />
  </div>
</template>

<script setup lang="ts">
import { apiFetch } from '~/utils/apiFetch'

definePageMeta({
  middleware: ['auth']
})

useHead({ meta: [{ name: 'robots', content: 'noindex, nofollow' }] })

const tabs = [
  { id: '1rm', label: '1RM' },
  { id: 'tdee', label: 'TDEE / Macros' },
  { id: 'plates', label: 'Plaques' }
]

const activeTab = ref('1rm')
const error = ref('')

// --- 1RM Calculator ---
const rm = reactive({
  weight: null as number | null,
  reps: null as number | null,
  loading: false,
  result: null as {
    estimated_1rm: number
    percentages: Array<{ percentage: number; weight: number; reps: string }>
  } | null
})

async function calculate1RM() {
  error.value = ''
  rm.loading = true
  rm.result = null
  try {
    rm.result = await apiFetch('/calculators/1rm', {
      method: 'POST',
      body: { weight: rm.weight, reps: rm.reps }
    })
  } catch (e: any) {
    error.value = e?.data?.message || e?.message || 'Erreur lors du calcul du 1RM'
  } finally {
    rm.loading = false
  }
}

// --- TDEE Calculator ---
const tdee = reactive({
  weight: null as number | null,
  height: null as number | null,
  age: null as number | null,
  gender: 'male' as 'male' | 'female',
  activityLevel: 'moderately_active' as string,
  loading: false,
  result: null as {
    bmr: number
    tdee: number
    goals: {
      maintenance: { calories: number; protein: number; carbs: number; fat: number }
      cutting: { calories: number; protein: number; carbs: number; fat: number }
      bulking: { calories: number; protein: number; carbs: number; fat: number }
    }
  } | null
})

async function calculateTDEE() {
  error.value = ''
  tdee.loading = true
  tdee.result = null
  try {
    tdee.result = await apiFetch('/calculators/tdee', {
      method: 'POST',
      body: {
        weight: tdee.weight,
        height: tdee.height,
        age: tdee.age,
        gender: tdee.gender,
        activity_level: tdee.activityLevel
      }
    })
  } catch (e: any) {
    error.value = e?.data?.message || e?.message || 'Erreur lors du calcul du TDEE'
  } finally {
    tdee.loading = false
  }
}

// --- Plates Calculator ---
const plates = reactive({
  targetWeight: null as number | null,
  barWeight: 20 as number,
  loading: false,
  result: null as {
    bar_weight: number
    weight_per_side: number
    plates_per_side: number[]
  } | null
})

async function calculatePlates() {
  error.value = ''
  plates.loading = true
  plates.result = null
  try {
    plates.result = await apiFetch('/calculators/plates', {
      method: 'POST',
      body: {
        target_weight: plates.targetWeight,
        bar_weight: plates.barWeight
      }
    })
  } catch (e: any) {
    error.value = e?.data?.message || e?.message || 'Erreur lors du calcul des plaques'
  } finally {
    plates.loading = false
  }
}

// Plate color and size classes
function getPlateClasses(weight: number): string {
  const base = 'transition-all'
  switch (weight) {
    case 25:
      return `${base} bg-red-600 w-8 md:w-10 h-16 md:h-20`
    case 20:
      return `${base} bg-blue-600 w-7 md:w-9 h-14 md:h-18`
    case 15:
      return `${base} bg-yellow-500 w-7 md:w-8 h-13 md:h-16`
    case 10:
      return `${base} bg-green-600 w-6 md:w-7 h-12 md:h-14`
    case 5:
      return `${base} bg-white border-2 border-gray-300 dark:bg-gray-200 w-5 md:w-6 h-10 md:h-12`
    case 2.5:
      return `${base} bg-gray-400 dark:bg-gray-500 w-4 md:w-5 h-8 md:h-10`
    case 1.25:
      return `${base} bg-gray-300 dark:bg-gray-600 w-3 md:w-4 h-6 md:h-8`
    default:
      return `${base} bg-gray-500 w-5 md:w-6 h-10 md:h-12`
  }
}

function getPlateColorDot(weight: number): string {
  switch (weight) {
    case 25: return 'bg-red-600'
    case 20: return 'bg-blue-600'
    case 15: return 'bg-yellow-500'
    case 10: return 'bg-green-600'
    case 5: return 'bg-white border-2 border-gray-300'
    case 2.5: return 'bg-gray-400'
    case 1.25: return 'bg-gray-300'
    default: return 'bg-gray-500'
  }
}

// Count plates for the detail section
const plateCounts = computed(() => {
  if (!plates.result?.plates_per_side) return []
  const counts = new Map<number, number>()
  for (const p of plates.result.plates_per_side) {
    counts.set(p, (counts.get(p) || 0) + 1)
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[0] - a[0])
    .map(([weight, count]) => ({ weight, count }))
})
</script>

<style scoped>
.tab-fade-enter-active,
.tab-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.tab-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.tab-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.h-13 { height: 3.25rem; }
.h-18 { height: 4.5rem; }
</style>
