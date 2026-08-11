<template>
  <div class="min-h-screen">
    <div class="px-4 md:px-6 pb-28 lg:pb-20 max-w-7xl mx-auto">
      <!-- Page Header -->
      <div class="fade-in text-center mb-6 md:mb-8">
        <h1
          class="text-2xl md:text-3xl lg:text-4xl font-bold text-display bg-gradient-to-r from-sand-500 to-primary-900 dark:to-primary-100 bg-clip-text text-transparent mb-2"
        >
          {{ t('body.title') }}
        </h1>
        <p class="text-lg text-primary-600 dark:text-primary-400">
          {{ t('body.subtitle') }}
        </p>
      </div>

      <!-- Tab Navigation -->
      <div class="flex justify-center mb-10 slide-up">
        <div
          class="flex space-x-2 bg-white dark:bg-primary-900 bg-opacity-50 dark:bg-opacity-50 backdrop-blur-lg rounded-xl p-1"
        >
          <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="activeTab = tab.key"
            :class="[
              'px-3 md:px-6 py-2 md:py-2.5 rounded-lg text-sm md:text-base font-semibold transition-all',
              activeTab === tab.key
                ? 'bg-gradient-primary text-white shadow-sm'
                : 'text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100',
            ]"
          >
            {{ t(tab.label) }}
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="bodyStore.isLoading" class="text-center py-20">
        <div
          class="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary-300 dark:border-primary-600 border-t-primary-600 dark:border-t-primary-400"
        ></div>
        <p class="mt-4 text-primary-600 dark:text-primary-400 text-lg">{{ t('body.loading') }}</p>
      </div>

      <!-- ==================== ONGLET POIDS ==================== -->
      <div v-else-if="activeTab === 'weight'" class="space-y-8 slide-up">
        <!-- Resultat : donnees d'abord -->
        <div v-if="bodyStore.bodyStats.length > 0" class="card-glass !p-6">
          <div class="flex items-start justify-between mb-5 flex-wrap gap-3">
            <div>
              <p class="text-sm text-primary-600 dark:text-primary-400 mb-1">
                {{ t('body.currentWeight') }}
              </p>
              <div class="flex items-baseline gap-2">
                <p class="text-3xl md:text-4xl font-bold text-primary-900 dark:text-primary-100">
                  {{ bodyStore.latestWeight?.weight }} <span class="text-lg">kg</span>
                </p>
                <span
                  v-if="bodyStore.weightChange30d !== null"
                  :class="['text-sm font-semibold', weightChangeClass]"
                >
                  {{ (bodyStore.weightChange30d > 0 ? '+' : '') + bodyStore.weightChange30d }} kg /
                  30j
                </span>
              </div>
            </div>
            <div
              v-if="weighInsThisMonth > 0"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sand-100 dark:bg-sand-900/30 text-sand-700 dark:text-sand-400 text-xs font-semibold"
            >
              <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                />
              </svg>
              {{ weighInsThisMonth }}
              {{ weighInsThisMonth > 1 ? t('body.weighIns') : t('body.weighIn') }}
              {{ t('body.thisMonth') }}
            </div>
          </div>
          <div v-if="bodyStore.bodyStats.length > 1" class="h-[220px] md:h-[280px]">
            <BodyWeightChart :stats="bodyStore.bodyStats" />
          </div>
          <div
            class="grid grid-cols-2 gap-2.5 mt-4 pt-4 border-t border-primary-100 dark:border-primary-800"
          >
            <div class="text-center">
              <p class="text-[11px] text-primary-500 dark:text-primary-400 mb-1">
                {{ t('body.min') }}
              </p>
              <p class="text-base font-bold text-primary-900 dark:text-primary-100">
                {{ minWeight }} kg
              </p>
            </div>
            <div class="text-center">
              <p class="text-[11px] text-primary-500 dark:text-primary-400 mb-1">
                {{ t('body.max') }}
              </p>
              <p class="text-base font-bold text-primary-900 dark:text-primary-100">
                {{ maxWeight }} kg
              </p>
            </div>
          </div>
        </div>

        <!-- Etat vide -->
        <div v-else class="card-glass text-center py-14">
          <p class="text-lg text-primary-600 dark:text-primary-400 mb-1">
            {{ t('body.noWeighIns') }}
          </p>
          <p class="text-sm text-primary-400 dark:text-primary-500">
            {{ t('body.startTrackingWeight') }}
          </p>
        </div>

        <!-- Action : peser -->
        <div>
          <button
            v-if="!showWeightForm"
            @click="showWeightForm = true"
            class="btn-primary w-full md:w-auto px-8 py-3.5"
          >
            {{ t('body.addWeightCta') }}
          </button>
          <div v-else class="card-glass">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-bold text-primary-900 dark:text-primary-100">
                {{ t('body.addWeightTitle') }}
              </h3>
              <button
                @click="showWeightForm = false"
                class="w-8 h-8 flex items-center justify-center rounded-lg text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-800"
              >
                <Icon name="lucide:x" class="w-4 h-4" />
              </button>
            </div>
            <form @submit.prevent="submitWeight" class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label class="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1"
                  >{{ t('body.weightLabel') }} *</label
                >
                <input
                  v-model.number="weightForm.weight"
                  type="number"
                  step="0.1"
                  min="0"
                  max="500"
                  placeholder="75.5"
                  class="input-primary"
                  autofocus
                  required
                />
              </div>
              <div>
                <label
                  class="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1"
                  >{{ t('body.bodyFat') }}</label
                >
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
                <label
                  class="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1"
                  >{{ t('body.notes') }}</label
                >
                <input
                  v-model="weightForm.notes"
                  type="text"
                  :placeholder="t('body.notesPlaceholder')"
                  class="input-primary"
                />
              </div>
              <div class="flex items-end">
                <button
                  type="submit"
                  class="btn-primary w-full"
                  :disabled="!weightForm.weight || weightSaving"
                >
                  {{ weightSaving ? 'Enregistrement...' : 'Enregistrer' }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Weight History — Timeline -->
        <div v-if="bodyStore.bodyStats.length > 0" class="card-glass">
          <div class="flex items-center justify-between mb-8">
            <h3 class="text-xl font-semibold text-primary-900 dark:text-primary-100">
              Journal de pesée
            </h3>
            <span class="text-xs text-primary-400 dark:text-primary-500"
              >{{ bodyStore.bodyStats.length }} entrée{{
                bodyStore.bodyStats.length > 1 ? 's' : ''
              }}</span
            >
          </div>

          <div class="relative">
            <div
              class="absolute left-[23px] top-0 bottom-0 w-px bg-gradient-to-b from-sand-500/40 via-primary-200 dark:via-primary-700 to-transparent"
            ></div>

            <div class="space-y-0">
              <div
                v-for="(stat, index) in bodyStore.bodyStats"
                :key="stat.id"
                class="relative flex gap-4 md:gap-5 group"
              >
                <div class="relative z-10 flex flex-col items-center pt-4">
                  <div
                    class="w-[13px] h-[13px] rounded-full border-[3px] flex-shrink-0 transition-all"
                    :class="
                      index === 0
                        ? 'border-sand-500 bg-sand-500 shadow-[0_0_8px_rgba(var(--sand-500),0.4)]'
                        : 'border-primary-300 dark:border-primary-600 bg-white dark:bg-primary-900 group-hover:border-sand-500'
                    "
                  ></div>
                </div>

                <div class="flex-1 pb-6">
                  <div
                    class="rounded-2xl border border-primary-100 dark:border-primary-800 p-4 transition-all group-hover:border-primary-200 dark:group-hover:border-primary-700 group-hover:shadow-sm"
                    :class="
                      index === 0
                        ? 'bg-gradient-to-br from-sand-500/[0.04] to-transparent border-sand-500/20 dark:border-sand-500/10'
                        : ''
                    "
                  >
                    <div class="flex items-center justify-between mb-3">
                      <div class="flex items-center gap-2">
                        <span
                          class="text-[11px] font-semibold uppercase tracking-wider text-primary-400 dark:text-primary-500"
                        >
                          {{ getWeightDay(stat.date) }}
                        </span>
                        <span class="text-[11px] text-primary-300 dark:text-primary-600">{{
                          getWeightMonthYear(stat.date)
                        }}</span>
                      </div>
                      <button
                        @click="deleteWeight(stat.id)"
                        class="w-7 h-7 flex items-center justify-center rounded-lg text-primary-300 dark:text-primary-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <svg
                          class="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>

                    <div class="flex items-end justify-between mb-3">
                      <div class="flex items-baseline gap-1.5">
                        <span
                          class="text-2xl font-bold text-primary-900 dark:text-primary-100 tabular-nums"
                          >{{ stat.weight }}</span
                        >
                        <span class="text-sm font-medium text-primary-400 dark:text-primary-500"
                          >kg</span
                        >
                      </div>
                      <span
                        v-if="getWeightDiff(index)"
                        class="text-xs font-bold tabular-nums"
                        :class="getWeightDiff(index)! > 0 ? 'text-green-500' : 'text-red-500'"
                      >
                        {{ getWeightDiff(index)! > 0 ? '+' : '' }}{{ getWeightDiff(index) }}
                      </span>
                    </div>

                    <div
                      class="h-1.5 rounded-full bg-primary-100 dark:bg-primary-800 overflow-hidden mb-2.5"
                    >
                      <div
                        class="h-full rounded-full transition-all duration-500"
                        :class="
                          index === 0
                            ? 'bg-gradient-to-r from-sand-500 to-sand-600'
                            : 'bg-primary-300 dark:bg-primary-600'
                        "
                        :style="{ width: getWeightBarWidth(stat.weight) + '%' }"
                      ></div>
                    </div>

                    <div class="flex items-center gap-2 flex-wrap">
                      <span
                        v-if="stat.bodyFat"
                        class="inline-flex items-center text-[11px] font-semibold text-primary-500 dark:text-primary-400 bg-primary-50 dark:bg-primary-800/80 px-2 py-0.5 rounded-md"
                      >
                        {{ stat.bodyFat }}% BF
                      </span>
                      <span
                        v-if="stat.notes"
                        class="text-[11px] text-primary-400 dark:text-primary-500 italic truncate"
                        >{{ stat.notes }}</span
                      >
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
        <!-- Dernieres mesures d'abord -->
        <div
          v-if="bodyStore.latestMeasurement"
          class="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-4"
        >
          <div
            v-for="field in measurementFields"
            :key="field.key"
            class="card-glass !p-6 text-center"
          >
            <p class="text-sm text-primary-600 dark:text-primary-400 mb-1">{{ field.label }}</p>
            <p class="text-2xl font-bold text-primary-900 dark:text-primary-100">
              {{
                bodyStore.latestMeasurement[
                  field.key as keyof typeof bodyStore.latestMeasurement
                ] || '—'
              }}
              <span
                v-if="
                  bodyStore.latestMeasurement[field.key as keyof typeof bodyStore.latestMeasurement]
                "
                class="text-sm"
                >cm</span
              >
            </p>
            <p
              v-if="getMeasurementVariation(field.key)"
              :class="[
                'text-sm font-medium mt-1',
                getMeasurementVariation(field.key)! > 0 ? 'text-green-500' : 'text-red-500',
              ]"
            >
              {{ getMeasurementVariation(field.key)! > 0 ? '+' : ''
              }}{{ getMeasurementVariation(field.key) }} cm
            </p>
          </div>
        </div>
        <div v-else class="card-glass text-center py-14">
          <p class="text-lg text-primary-600 dark:text-primary-400 mb-1">
            Pas encore de mensuration
          </p>
          <p class="text-sm text-primary-400 dark:text-primary-500">
            Ajoutez votre première mesure ci-dessous
          </p>
        </div>

        <!-- Action : ajouter -->
        <div>
          <button
            v-if="!showMeasurementForm"
            @click="showMeasurementForm = true"
            class="btn-primary w-full md:w-auto px-8 py-3.5"
          >
            + Ajouter une mensuration
          </button>
          <div v-else class="card-glass">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-bold text-primary-900 dark:text-primary-100">
                Nouvelle mesure
              </h3>
              <button
                @click="showMeasurementForm = false"
                class="w-8 h-8 flex items-center justify-center rounded-lg text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-800"
              >
                <Icon name="lucide:x" class="w-4 h-4" />
              </button>
            </div>
            <form @submit.prevent="submitMeasurement" class="space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div v-for="field in measurementFields" :key="field.key">
                  <label
                    class="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1"
                    >{{ field.label }} (cm)</label
                  >
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
              <button
                type="submit"
                class="btn-primary"
                :disabled="!hasAnyMeasurement || measurementSaving"
              >
                {{ measurementSaving ? 'Enregistrement...' : 'Enregistrer' }}
              </button>
            </form>
          </div>
        </div>

        <!-- Measurement History -->
        <div v-if="bodyStore.measurements.length > 0" class="card-glass">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-primary-900 dark:text-primary-100">
              Historique Mensurations
            </h3>
          </div>
          <div class="space-y-4">
            <div
              v-for="m in bodyStore.measurements"
              :key="m.id"
              class="rounded-xl border border-primary-200/60 dark:border-primary-700/60 overflow-hidden group hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
            >
              <div
                class="flex items-center justify-between px-4 py-2.5 bg-primary-50/70 dark:bg-primary-800/50"
              >
                <span class="text-sm font-semibold text-primary-700 dark:text-primary-300">{{
                  formatDate(m.date)
                }}</span>
                <button
                  @click="deleteMeasurement(m.id)"
                  class="w-7 h-7 flex items-center justify-center rounded-lg text-primary-300 dark:text-primary-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
              <div
                class="grid grid-cols-3 sm:grid-cols-6 divide-x divide-primary-100 dark:divide-primary-800"
              >
                <div v-if="m.chest" class="px-3 py-3 text-center">
                  <p
                    class="text-[10px] uppercase tracking-wider text-primary-400 dark:text-primary-500 mb-0.5"
                  >
                    Poitrine
                  </p>
                  <p class="text-sm font-bold text-primary-900 dark:text-primary-100">
                    {{ m.chest }}<span class="text-[10px] font-normal text-primary-400">cm</span>
                  </p>
                </div>
                <div v-if="m.waist" class="px-3 py-3 text-center">
                  <p
                    class="text-[10px] uppercase tracking-wider text-primary-400 dark:text-primary-500 mb-0.5"
                  >
                    Taille
                  </p>
                  <p class="text-sm font-bold text-primary-900 dark:text-primary-100">
                    {{ m.waist }}<span class="text-[10px] font-normal text-primary-400">cm</span>
                  </p>
                </div>
                <div v-if="m.hips" class="px-3 py-3 text-center">
                  <p
                    class="text-[10px] uppercase tracking-wider text-primary-400 dark:text-primary-500 mb-0.5"
                  >
                    Hanches
                  </p>
                  <p class="text-sm font-bold text-primary-900 dark:text-primary-100">
                    {{ m.hips }}<span class="text-[10px] font-normal text-primary-400">cm</span>
                  </p>
                </div>
                <div v-if="m.biceps" class="px-3 py-3 text-center">
                  <p
                    class="text-[10px] uppercase tracking-wider text-primary-400 dark:text-primary-500 mb-0.5"
                  >
                    Biceps
                  </p>
                  <p class="text-sm font-bold text-primary-900 dark:text-primary-100">
                    {{ m.biceps }}<span class="text-[10px] font-normal text-primary-400">cm</span>
                  </p>
                </div>
                <div v-if="m.thighs" class="px-3 py-3 text-center">
                  <p
                    class="text-[10px] uppercase tracking-wider text-primary-400 dark:text-primary-500 mb-0.5"
                  >
                    Cuisses
                  </p>
                  <p class="text-sm font-bold text-primary-900 dark:text-primary-100">
                    {{ m.thighs }}<span class="text-[10px] font-normal text-primary-400">cm</span>
                  </p>
                </div>
                <div v-if="m.calves" class="px-3 py-3 text-center">
                  <p
                    class="text-[10px] uppercase tracking-wider text-primary-400 dark:text-primary-500 mb-0.5"
                  >
                    Mollets
                  </p>
                  <p class="text-sm font-bold text-primary-900 dark:text-primary-100">
                    {{ m.calves }}<span class="text-[10px] font-normal text-primary-400">cm</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ==================== ONGLET PHOTOS ==================== -->
      <div v-else-if="activeTab === 'photos'" class="space-y-8 slide-up">
        <ProWall
          v-if="!isPremium && !canUploadPhoto"
          :title="t('body.photos.proWallTitle')"
          :message="t('body.photos.proWallMessage', { count: photoUsageText })"
          icon="camera"
          compact
        />

        <!-- Le plus gratifiant d'abord : timelapse + comparaison -->
        <div v-if="timelapsePhotos.length > 0" class="card-glass">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-semibold text-primary-900 dark:text-primary-100">
              {{ t('profile.photos.timelapse') }}
            </h3>
            <button @click="showTimelapse = !showTimelapse" class="btn-outline !py-2 !px-4 text-sm">
              {{ showTimelapse ? t('body.photos.hide') : t('body.photos.showTimelapse') }}
            </button>
          </div>
          <ClientOnly>
            <BodyTimelapseViewer v-if="showTimelapse" :photos="timelapsePhotos" />
          </ClientOnly>
        </div>

        <BodyPhotoComparison
          v-if="bodyStore.photos.length >= 2"
          :photos="bodyStore.photos"
          :user-name="authStore.user?.firstName || ''"
        />

        <!-- Galerie -->
        <div v-if="bodyStore.photos.length > 0" class="card-glass">
          <h3 class="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-6">
            {{ t('body.photos.gallery') }}
          </h3>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div
              v-for="photo in bodyStore.photos"
              :key="photo.id"
              class="relative group aspect-square rounded-xl overflow-hidden cursor-pointer"
              @click="openPhoto(photo)"
            >
              <img
                :src="photo.photoUrl"
                :alt="`Photo ${photo.id}`"
                loading="lazy"
                class="w-full h-full object-cover"
              />
              <div
                class="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-end"
              >
                <div
                  class="w-full p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <p class="text-white text-sm font-medium">
                    {{ formatDate(photo.workout?.date || photo.createdAt) }}
                  </p>
                  <p v-if="photo.isPrimary" class="text-yellow-300 text-xs">
                    ★ {{ t('body.photos.primary') }}
                  </p>
                </div>
              </div>
              <button
                @click.stop="deletePhoto(photo.id)"
                class="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-red-500 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
              >
                <svg
                  class="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Etat vide -->
        <div
          v-if="bodyStore.photos.length === 0 && !bodyStore.isLoading"
          class="card-glass text-center py-16"
        >
          <svg
            class="w-20 h-20 mx-auto mb-4 text-primary-300 dark:text-primary-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <p class="text-lg text-primary-600 dark:text-primary-400 mb-2">
            Aucune photo pour le moment
          </p>
          <p class="text-sm text-primary-500 dark:text-primary-500">
            Ajoutez des photos pour suivre votre transformation
          </p>
        </div>

        <!-- Action : ajouter une photo -->
        <div>
          <button
            v-if="!showPhotoUpload"
            @click="showPhotoUpload = true"
            class="btn-primary w-full md:w-auto px-8 py-3.5"
          >
            + Ajouter une photo
          </button>
          <div v-else class="card-glass">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-bold text-primary-900 dark:text-primary-100">
                Ajouter une photo
              </h3>
              <div class="flex items-center gap-3">
                <span v-if="!isPremium" class="text-xs text-primary-500 dark:text-primary-400">{{
                  photoUsageText
                }}</span>
                <button
                  @click="showPhotoUpload = false"
                  class="w-8 h-8 flex items-center justify-center rounded-lg text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-800"
                >
                  <Icon name="lucide:x" class="w-4 h-4" />
                </button>
              </div>
            </div>
            <div class="flex flex-col md:flex-row gap-4 items-end">
              <div class="flex-1">
                <label
                  class="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1"
                  >{{ t('profile.upload.workoutLabel') }}</label
                >
                <select v-model="photoForm.workoutId" class="input-primary">
                  <option :value="null" disabled>
                    {{ t('profile.upload.selectPlaceholder') }}
                  </option>
                  <option v-for="w in completedWorkouts" :key="w.id" :value="w.id">
                    {{ w.name }} — {{ formatDate(w.completedAt!) }}
                  </option>
                </select>
              </div>
              <div class="flex items-center h-[46px]">
                <label
                  class="flex items-center space-x-2 text-sm text-primary-700 dark:text-primary-300 cursor-pointer"
                >
                  <input type="checkbox" v-model="photoForm.isPrimary" class="checkbox-primary" />
                  <span>{{ t('profile.upload.primary') }}</span>
                </label>
              </div>
              <div>
                <label class="btn-primary cursor-pointer inline-flex items-center space-x-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>{{
                    photoUploading ? t('profile.upload.uploading') : t('profile.upload.choose')
                  }}</span>
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
        </div>
      </div>

      <!-- Fullscreen Photo Modal -->
      <Teleport to="body">
        <Transition name="modal">
          <div
            v-if="selectedPhoto"
            class="fixed inset-0 z-[100] flex items-center justify-center p-4"
            @click="selectedPhoto = null"
          >
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
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </Transition>
      </Teleport>
    </div>

    <MobileBottomNav active-path="/body" />
  </div>
</template>

<script setup lang="ts">
const { t } = useLocale();
import { useAuthStore } from '~/stores/auth';
import { useBodyStore } from '~/stores/body';
import { useWorkoutStore } from '~/stores/workout';
import { useSubscriptionStore } from '~/stores/subscription';
import { useSubscriptionLimits } from '~/composables/useSubscriptionLimits';
import type { ProgressPhoto, Measurement } from '~/types/body';

useHead({ meta: [{ name: 'robots', content: 'noindex, nofollow' }] });

const authStore = useAuthStore();
const bodyStore = useBodyStore();
const workoutStore = useWorkoutStore();
const subscriptionStore = useSubscriptionStore();
const { isPremium, canUploadPhoto, photoUsageText, fetchUsage } = useSubscriptionLimits();
const toast = useToast();

const activeTab = ref<'weight' | 'measurements' | 'photos'>('weight');

const tabs = [
  { key: 'weight' as const, label: 'body.tabs.weight' },
  { key: 'measurements' as const, label: 'body.tabs.measurements' },
  { key: 'photos' as const, label: 'body.tabs.photos' },
];

// Formulaires repliés par defaut : on les affiche a la demande, pas en permanence
const showWeightForm = ref(false);
const showMeasurementForm = ref(false);
const showPhotoUpload = ref(false);

// ========== WEIGHT ==========
const weightForm = reactive({
  weight: null as number | null,
  bodyFat: null as number | null,
  notes: '',
});
const weightSaving = ref(false);

const weighInsThisMonth = computed(() => {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);
  return bodyStore.bodyStats.filter((s) => new Date(s.date) >= cutoff).length;
});

const submitWeight = async () => {
  if (!weightForm.weight) return;
  weightSaving.value = true;
  try {
    await bodyStore.addBodyStat({
      weight: weightForm.weight,
      bodyFat: weightForm.bodyFat || undefined,
      notes: weightForm.notes || undefined,
    });
    weightForm.weight = null;
    weightForm.bodyFat = null;
    weightForm.notes = '';
    showWeightForm.value = false;
    toast.success('Poids enregistré');
  } catch (e) {
    toast.error("Erreur lors de l'enregistrement");
    logger.error(e);
  } finally {
    weightSaving.value = false;
  }
};

const deletingIds = ref(new Set<string>());

const deleteWeight = async (id: number) => {
  const key = `weight-${id}`;
  if (deletingIds.value.has(key)) return;
  deletingIds.value.add(key);
  try {
    await bodyStore.deleteBodyStat(id);
  } finally {
    deletingIds.value.delete(key);
  }
};

const minWeight = computed(() => {
  if (bodyStore.bodyStats.length === 0) return 0;
  return Math.min(...bodyStore.bodyStats.map((s) => s.weight));
});

const maxWeight = computed(() => {
  if (bodyStore.bodyStats.length === 0) return 0;
  return Math.max(...bodyStore.bodyStats.map((s) => s.weight));
});

const weightChangeClass = computed(() => {
  if (bodyStore.weightChange30d === null) return 'text-primary-500 dark:text-primary-400';
  return bodyStore.weightChange30d > 0
    ? 'text-green-500'
    : bodyStore.weightChange30d < 0
      ? 'text-red-500'
      : 'text-primary-500 dark:text-primary-400';
});

const getWeightDiff = (index: number): number | null => {
  const stats = bodyStore.bodyStats;
  const current = stats[index];
  const previous = stats[index + 1];
  if (!current || !previous) return null;
  return Math.round((current.weight - previous.weight) * 10) / 10;
};

const getWeightBarWidth = (weight: number): number => {
  if (bodyStore.bodyStats.length < 2) return 100;
  const min = Math.min(...bodyStore.bodyStats.map((s) => s.weight));
  const max = Math.max(...bodyStore.bodyStats.map((s) => s.weight));
  if (max === min) return 100;
  return Math.max(15, ((weight - min) / (max - min)) * 100);
};

const getWeightDay = (dateString: string) => {
  const d = new Date(dateString);
  return d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
};

const getWeightMonthYear = (dateString: string) => {
  const d = new Date(dateString);
  return d.toLocaleDateString('fr-FR', { year: 'numeric' });
};

// ========== MEASUREMENTS ==========
const measurementForm = reactive({
  chest: null as number | null,
  waist: null as number | null,
  hips: null as number | null,
  biceps: null as number | null,
  thighs: null as number | null,
  calves: null as number | null,
});
const measurementSaving = ref(false);

const measurementFields = [
  { key: 'chest', label: 'Poitrine', placeholder: '95' },
  { key: 'waist', label: 'Taille', placeholder: '80' },
  { key: 'hips', label: 'Hanches', placeholder: '95' },
  { key: 'biceps', label: 'Biceps', placeholder: '35' },
  { key: 'thighs', label: 'Cuisses', placeholder: '55' },
  { key: 'calves', label: 'Mollets', placeholder: '38' },
];

const hasAnyMeasurement = computed(() => {
  return Object.values(measurementForm).some((v) => v !== null && v > 0);
});

const submitMeasurement = async () => {
  if (!hasAnyMeasurement.value) return;
  measurementSaving.value = true;
  try {
    const data: Record<string, number | undefined> = {};
    for (const field of measurementFields) {
      const val = measurementForm[field.key as keyof typeof measurementForm];
      if (val && val > 0) data[field.key] = val;
    }
    await bodyStore.addMeasurement(data);
    for (const field of measurementFields) {
      (measurementForm as any)[field.key] = null;
    }
    showMeasurementForm.value = false;
    toast.success('Mensurations enregistrées');
  } catch (e) {
    toast.error("Erreur lors de l'enregistrement");
    logger.error(e);
  } finally {
    measurementSaving.value = false;
  }
};

const deleteMeasurement = async (id: number) => {
  const key = `measurement-${id}`;
  if (deletingIds.value.has(key)) return;
  deletingIds.value.add(key);
  try {
    await bodyStore.deleteMeasurement(id);
  } finally {
    deletingIds.value.delete(key);
  }
};

const getMeasurementVariation = (key: string) => {
  if (bodyStore.measurements.length < 2) return null;
  const latestMeasurement = bodyStore.measurements[0];
  const previousMeasurement = bodyStore.measurements[1];
  if (!latestMeasurement || !previousMeasurement) return null;
  const latest = latestMeasurement[key as keyof Measurement] as number | undefined;
  const previous = previousMeasurement[key as keyof Measurement] as number | undefined;
  if (!latest || !previous) return null;
  return +((latest as number) - (previous as number)).toFixed(1);
};

// ========== PHOTOS ==========
const photoForm = reactive({ workoutId: null as number | null, isPrimary: true });
const photoUploading = ref(false);
const selectedPhoto = ref<ProgressPhoto | null>(null);
const showTimelapse = ref(false);
const timelapsePhotos = ref<ProgressPhoto[]>([]);

const completedWorkouts = computed(() => {
  return workoutStore.workoutHistory;
});

const handlePhotoUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file || !photoForm.workoutId) return;

  if (!file.type.startsWith('image/')) {
    toast.error('Erreur', 'Le fichier doit être une image');
    input.value = '';
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    toast.error('Erreur', 'La photo ne doit pas dépasser 5 Mo');
    input.value = '';
    return;
  }

  if (!canUploadPhoto.value) {
    toast.error('Limite atteinte', 'Passez Pro pour uploader plus de photos');
    input.value = '';
    return;
  }

  photoUploading.value = true;
  try {
    await bodyStore.uploadPhoto(photoForm.workoutId, file, photoForm.isPrimary);
    input.value = '';
    timelapsePhotos.value = await bodyStore.fetchTimelapse();
    toast.success('Photo uploadée');
  } catch (e) {
    toast.error("Erreur lors de l'upload");
    logger.error(e);
  } finally {
    photoUploading.value = false;
  }
};

const openPhoto = (photo: ProgressPhoto) => {
  selectedPhoto.value = photo;
};

const deletePhoto = async (id: number) => {
  const key = `photo-${id}`;
  if (deletingIds.value.has(key)) return;
  deletingIds.value.add(key);
  try {
    await bodyStore.deletePhoto(id);
    timelapsePhotos.value = await bodyStore.fetchTimelapse();
  } finally {
    deletingIds.value.delete(key);
  }
};

// ========== INIT ==========
onMounted(async () => {
  await Promise.all([
    bodyStore.fetchBodyStats(),
    bodyStore.fetchMeasurements(),
    bodyStore.fetchPhotos(),
    workoutStore.fetchWorkouts(),
    subscriptionStore.fetchSubscription(),
    fetchUsage(),
  ]);

  try {
    timelapsePhotos.value = await bodyStore.fetchTimelapse();
  } catch (e) {
    // Timelapse peut etre vide
  }
});

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateString));
};

definePageMeta({
  middleware: 'auth',
});
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
