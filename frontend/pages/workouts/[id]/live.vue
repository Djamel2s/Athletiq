<template>
  <div class="min-h-screen">
    <!-- Countdown 3-2-1-GO -->
    <div
      v-if="showCountdown"
      class="fixed inset-0 bg-white dark:bg-primary-900 z-50 flex items-center justify-center"
    >
      <div class="text-center">
        <div
          class="text-7xl md:text-9xl font-bold text-primary-900 dark:text-primary-100 animate-pulse"
        >
          {{ countdownNumber }}
        </div>
        <p class="text-2xl text-primary-600 dark:text-primary-400 mt-4">Prépare-toi...</p>
      </div>
    </div>

    <!-- Header fixe -->
    <div class="fixed top-0 left-0 right-0 z-50 nav-blur">
      <div class="max-w-3xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <button
            @click="confirmExit"
            class="text-primary-700 dark:text-primary-300 p-2 hover:text-primary-900 dark:hover:text-primary-100"
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

          <div class="text-center">
            <div class="text-2xl font-bold text-primary-900 dark:text-primary-100 font-mono">
              {{ formattedTime }}
            </div>
            <p class="text-xs text-primary-600 dark:text-primary-400">{{ workout?.name }}</p>
          </div>

          <button
            @click="confirmComplete"
            :disabled="isCompleting"
            class="btn-primary text-sm py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isCompleting ? '...' : 'Terminer' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Contenu principal -->
    <div class="pb-20 px-4 max-w-3xl mx-auto">
      <div v-if="isLoading" class="text-center py-20">
        <div
          class="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary-200 dark:border-primary-700 border-t-primary-600 dark:border-t-primary-400"
        ></div>
        <p class="mt-4 text-primary-600 dark:text-primary-400 text-lg">Chargement...</p>
      </div>

      <div v-else-if="!workout || !currentExercise" class="text-center py-20">
        <p class="text-primary-900 dark:text-primary-100 text-lg">Workout introuvable</p>
      </div>

      <div v-else class="space-y-4">
        <!-- Superset badge -->
        <div v-if="currentStepIsSuperset && !isViewingPast" class="text-center mb-2">
          <span
            class="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-sand-500/15 text-sand-700 dark:text-sand-400 border border-sand-500/30 uppercase tracking-wider"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
            Superset · Round {{ currentSupersetRound }} / {{ currentSupersetTotalRounds }}
          </span>
        </div>

        <!-- Progress -->
        <div class="text-center mb-6">
          <p class="text-sm text-primary-600 dark:text-primary-400 mb-2">
            Exercice {{ currentExerciseIndex + 1 }} / {{ workout.exercises?.length || 0 }} · Série
            {{ currentSetNumber }} / {{ currentExercise.targetSets || 3 }}
          </p>
          <div class="w-full bg-primary-200 dark:bg-primary-700 rounded-full h-2">
            <div
              class="bg-gradient-primary h-2 rounded-full transition-all duration-300"
              :style="{ width: `${progress}%` }"
            ></div>
          </div>
        </div>

        <!-- Navigation flèches + nom exercice -->
        <div class="relative">
          <!-- Flèche gauche -->
          <button
            @click="navigateBack"
            :disabled="!canNavigateBack"
            class="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all"
            :class="
              canNavigateBack
                ? 'bg-white/80 dark:bg-primary-800/80 text-primary-900 dark:text-primary-100 shadow-lg hover:bg-white dark:hover:bg-primary-700'
                : 'text-primary-300 dark:text-primary-700 cursor-not-allowed'
            "
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <!-- Flèche droite -->
          <button
            @click="navigateForward"
            :disabled="!canNavigateForward"
            class="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all"
            :class="
              canNavigateForward
                ? 'bg-white/80 dark:bg-primary-800/80 text-primary-900 dark:text-primary-100 shadow-lg hover:bg-white dark:hover:bg-primary-700'
                : 'text-primary-300 dark:text-primary-700 cursor-not-allowed'
            "
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <!-- Contenu central -->
          <div class="px-12">
            <!-- Badge si on regarde une série passée -->
            <div v-if="isViewingPast" class="text-center mb-2">
              <span
                class="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-sand-500/15 text-sand-700 dark:text-sand-400 border border-sand-500/30"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Serie passee — modifiable
              </span>
            </div>

            <h1
              class="text-xl md:text-3xl font-bold text-primary-900 dark:text-primary-100 text-center mb-4"
            >
              {{ viewingExerciseName }}
            </h1>

            <!-- Animation exercice -->
            <div v-if="!showRestTimer" class="mb-4">
              <ExerciseAnimation
                :image-id="viewingExerciseImage"
                :name="viewingExerciseName"
                size="lg"
              />
            </div>
          </div>
        </div>

        <!-- Weight progression suggestion -->
        <div
          v-if="weightSuggestion && currentSetNumber === 1"
          class="rounded-2xl p-4 bg-gradient-to-r from-sand-500/15 to-sand-600/15 border border-sand-500/30 dark:border-sand-600/20"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center flex-shrink-0"
            >
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-sm font-semibold text-primary-900 dark:text-primary-100">
                {{ weightSuggestion.message }}
              </p>
            </div>
            <button
              @click="applyWeightSuggestion"
              class="btn-primary text-xs py-2 px-3 whitespace-nowrap"
            >
              Appliquer
            </button>
          </div>
        </div>

        <!-- Zone de saisie -->
        <div class="card-glass space-y-6">
          <div class="text-center">
            <p class="text-primary-900 dark:text-primary-100 font-bold text-xl mb-2">
              {{
                isViewingPast ? `Serie ${viewingSetNumber} (passee)` : `Série ${currentSetNumber}`
              }}
            </p>
            <p class="text-primary-600 dark:text-primary-400 text-sm">
              {{ isViewingPast ? 'Modifie si besoin' : 'Entre tes performances' }}
            </p>
          </div>

          <div class="flex gap-4">
            <div class="flex-1">
              <label
                class="block text-primary-900 dark:text-primary-100 text-sm mb-2 text-center font-semibold"
                >Répétitions</label
              >
              <input
                v-model.number="currentSetData.reps"
                type="number"
                min="0"
                :disabled="showRestTimer"
                class="w-full px-4 py-6 input text-center text-primary-900 dark:text-primary-100 text-3xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="10"
              />
            </div>

            <div class="flex-1">
              <label
                class="block text-primary-900 dark:text-primary-100 text-sm mb-2 text-center font-semibold"
                >Poids (kg)</label
              >
              <input
                v-model.number="currentSetData.weight"
                type="number"
                step="0.5"
                min="0"
                :disabled="showRestTimer"
                class="w-full px-4 py-6 input text-center text-primary-900 dark:text-primary-100 text-3xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="20"
              />
            </div>
          </div>

          <!-- Mode passé : bouton modifier -->
          <div v-if="isViewingPast" class="flex gap-3">
            <button @click="returnToCurrent" class="btn-outline flex-1 py-4 text-sm">
              Retour serie actuelle
            </button>
            <button @click="saveViewingSet" class="btn-primary flex-1 py-4 text-base font-semibold">
              Modifier
            </button>
          </div>

          <!-- Mode actuel : boutons normaux -->
          <div v-else class="flex gap-3">
            <button
              @click="skipCurrentSet"
              :disabled="showRestTimer"
              class="btn-outline py-4 px-5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Passer
            </button>
            <button
              @click="validateCurrentSet"
              :disabled="showRestTimer"
              class="btn-primary flex-1 text-xl py-5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ nextButtonLabel }}
            </button>
          </div>
        </div>

        <!-- Historique -->
        <div
          v-if="exerciseHistory?.lastSets && exerciseHistory.lastSets.length > 0"
          class="card-glass bg-opacity-60"
        >
          <p class="text-sm text-primary-900 dark:text-primary-100 font-semibold mb-3">
            Dernière fois:
          </p>
          <div class="flex gap-2 overflow-x-auto">
            <div
              v-for="(set, idx) in exerciseHistory.lastSets"
              :key="idx"
              class="flex-shrink-0 bg-primary-100 dark:bg-primary-800 rounded-lg p-3 text-center border border-primary-200 dark:border-primary-700 min-w-[80px]"
            >
              <p class="text-xs text-primary-600 dark:text-primary-400 mb-1">
                S{{ set.setNumber || idx + 1 }}
              </p>
              <p class="text-primary-900 dark:text-primary-100 font-bold">
                {{ set.reps }}×{{ set.weight }}kg
              </p>
            </div>
          </div>
        </div>

        <!-- Séries complétées (pastilles) -->
        <div v-if="completedSets.length > 0" class="space-y-2">
          <p class="text-sm text-primary-900 dark:text-primary-100 font-semibold">
            Séries complétées
            <span class="text-primary-400 font-normal">(fleches pour modifier)</span>:
          </p>
          <div class="flex gap-2 overflow-x-auto">
            <div
              v-for="(set, idx) in completedSets"
              :key="idx"
              class="flex-shrink-0 bg-primary-100 dark:bg-primary-800 rounded-lg p-3 text-center border border-primary-200 dark:border-primary-700 min-w-[80px]"
              :class="{ 'ring-2 ring-sand-500': isViewingPast && viewingSet?.setId === set.id }"
            >
              <p class="text-xs text-primary-600 dark:text-primary-400 mb-1">S{{ idx + 1 }}</p>
              <p class="text-primary-900 dark:text-primary-100 font-bold">
                {{ set.reps }}x{{ set.weight }}kg
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating add exercise button -->
    <button
      v-if="!showCountdown && !showRestTimer && !showCompletionScreen && !showAddExerciseModal"
      @click="openAddExerciseModal"
      class="fixed bottom-24 right-4 z-40 w-14 h-14 bg-gradient-primary rounded-full shadow-lg flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-transform"
    >
      <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2.5"
          d="M12 4v16m8-8H4"
        />
      </svg>
    </button>

    <!-- Add Exercise Modal -->
    <Teleport to="body">
      <div
        v-if="showAddExerciseModal"
        class="fixed inset-0 z-[60] bg-white dark:bg-primary-900 flex flex-col"
      >
        <!-- Modal header -->
        <div
          class="flex items-center justify-between px-4 py-4 border-b border-primary-200 dark:border-primary-700"
        >
          <h2 class="text-xl font-bold text-primary-900 dark:text-primary-100">
            Ajouter un exercice
          </h2>
          <button
            @click="showAddExerciseModal = false"
            class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors"
          >
            <svg
              class="w-6 h-6 text-primary-500"
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

        <!-- Search & filters -->
        <div class="px-4 py-3 space-y-3 border-b border-primary-200 dark:border-primary-700">
          <input
            v-model="liveSearchQuery"
            @input="searchExercisesLive"
            type="text"
            placeholder="Rechercher un exercice..."
            class="input-primary w-full"
          />
          <div class="flex gap-2 overflow-x-auto pb-1">
            <select
              v-model="liveFilterMuscle"
              @change="searchExercisesLive"
              class="input-primary text-sm py-2"
            >
              <option value="">Tous les muscles</option>
              <option value="CHEST">Pectoraux</option>
              <option value="BACK">Dos</option>
              <option value="SHOULDERS">Épaules</option>
              <option value="BICEPS">Biceps</option>
              <option value="TRICEPS">Triceps</option>
              <option value="LEGS">Jambes</option>
              <option value="QUADS">Quadriceps</option>
              <option value="HAMSTRINGS">Ischio-jambiers</option>
              <option value="GLUTES">Fessiers</option>
              <option value="CALVES">Mollets</option>
              <option value="ABS">Abdos</option>
              <option value="CARDIO">Cardio</option>
            </select>
            <select
              v-model="liveFilterEquipment"
              @change="searchExercisesLive"
              class="input-primary text-sm py-2"
            >
              <option value="">Tout équipement</option>
              <option value="BARBELL">Barre</option>
              <option value="DUMBBELL">Haltères</option>
              <option value="BODYWEIGHT">Poids du corps</option>
              <option value="MACHINE">Machine</option>
              <option value="CABLE">Câble</option>
              <option value="KETTLEBELL">Kettlebell</option>
            </select>
          </div>
        </div>

        <!-- Exercise list -->
        <div class="flex-1 overflow-y-auto px-4 py-3">
          <div v-if="isLoadingLiveExercises" class="text-center py-12">
            <div
              class="inline-block animate-spin rounded-full h-10 w-10 border-4 border-primary-200 dark:border-primary-700 border-t-primary-600 dark:border-t-primary-400"
            ></div>
          </div>
          <div v-else-if="liveExerciseLibrary.length === 0" class="text-center py-12">
            <p class="text-primary-500 dark:text-primary-400">Aucun exercice trouvé</p>
          </div>
          <div v-else class="space-y-2">
            <div
              v-for="exercise in liveExerciseLibrary"
              :key="exercise.id"
              @click="addExerciseLive(exercise)"
              class="p-4 rounded-xl border border-primary-200 dark:border-primary-700 hover:border-sand-500/50 dark:hover:border-sand-600/30 hover:shadow-md transition-all cursor-pointer active:scale-[0.98]"
            >
              <div class="flex items-center gap-3">
                <ExerciseAnimation
                  :image-id="exercise.imageUrl"
                  :name="exercise.name"
                  size="sm"
                  class="w-12 h-12 flex-shrink-0"
                />
                <div class="flex-1 min-w-0">
                  <h3 class="font-bold text-primary-900 dark:text-primary-100 text-sm truncate">
                    {{ exercise.name }}
                  </h3>
                  <div class="flex gap-1.5 mt-1">
                    <span
                      v-if="exercise.primaryMuscle"
                      class="px-1.5 py-0.5 bg-sand-500/10 dark:bg-sand-600/10 text-sand-700 dark:text-sand-400 text-[10px] font-semibold rounded uppercase tracking-wider"
                    >
                      {{ formatMuscleGroupLive(exercise.primaryMuscle) }}
                    </span>
                    <span
                      v-if="exercise.equipment"
                      class="px-1.5 py-0.5 bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-primary-400 text-[10px] font-medium rounded"
                    >
                      {{ formatEquipmentLive(exercise.equipment) }}
                    </span>
                  </div>
                </div>
                <svg
                  class="w-5 h-5 text-primary-300 dark:text-primary-600 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Écran plein écran de repos -->
    <Transition name="fade">
      <div
        v-if="showRestTimer"
        class="fixed inset-0 z-50 bg-white dark:bg-primary-900 flex flex-col items-center justify-center"
      >
        <!-- Exercice suivant info -->
        <p class="text-sm text-primary-500 dark:text-primary-400 mb-2 tracking-widest uppercase">
          {{ currentStep?.isSuperset ? 'Repos Superset' : 'Repos' }}
        </p>
        <p
          v-if="nextNonRestStep"
          class="text-lg font-semibold text-primary-700 dark:text-primary-300 mb-2"
        >
          Prochain:
          {{
            workout?.exercises?.[nextNonRestStep.exerciseIndex]?.exerciseLibrary?.name ||
            workout?.exercises?.[nextNonRestStep.exerciseIndex]?.name
          }}
        </p>
        <p
          v-if="currentStep?.isSuperset"
          class="text-xs text-sand-600 dark:text-sand-400 font-bold uppercase tracking-wider mb-8"
        >
          Round {{ currentStep.supersetRound }} / {{ currentStep.supersetTotalRounds }}
        </p>
        <p v-else class="mb-10"></p>

        <!-- Cercle de progression avec timer -->
        <div class="relative mb-12">
          <svg class="transform -rotate-90" width="240" height="240">
            <circle
              cx="120"
              cy="120"
              r="105"
              stroke="currentColor"
              class="text-primary-100 dark:text-primary-800"
              stroke-width="10"
              fill="none"
            />
            <circle
              cx="120"
              cy="120"
              r="105"
              stroke="url(#restGradient)"
              stroke-width="10"
              fill="none"
              :stroke-dasharray="restCircumference"
              :stroke-dashoffset="restProgressOffset"
              stroke-linecap="round"
              class="transition-all duration-1000 ease-linear"
            />
            <defs>
              <linearGradient id="restGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color: rgb(var(--sand-500)); stop-opacity: 1" />
                <stop offset="100%" style="stop-color: rgb(var(--sand-600)); stop-opacity: 1" />
              </linearGradient>
            </defs>
          </svg>
          <div class="absolute inset-0 flex items-center justify-center">
            <div
              class="text-7xl font-light text-primary-900 dark:text-primary-100 tabular-nums"
              style="
                font-family:
                  'SF Pro Display',
                  system-ui,
                  -apple-system,
                  sans-serif;
                letter-spacing: -2px;
              "
            >
              {{ formatRestTime(restTimeRemaining) }}
            </div>
          </div>
        </div>

        <!-- Boutons -->
        <div class="flex gap-3">
          <button @click="addRestTime(-15)" class="btn-outline px-5 py-3 text-base font-mono">
            -15s
          </button>
          <button @click="skipRest" class="btn-outline px-8 py-3 text-base">Passer</button>
          <button @click="addRestTime(15)" class="btn-primary px-5 py-3 text-base font-mono">
            +15s
          </button>
        </div>

        <!-- Série info en bas -->
        <div class="absolute bottom-8 text-center">
          <p class="text-sm text-primary-400 dark:text-primary-500">
            Série {{ currentSetNumber }} / {{ currentExercise?.targetSets || 3 }}
          </p>
          <p class="text-xs text-primary-300 dark:text-primary-600 mt-1">
            {{
              restDuration >= 150
                ? 'Exercice composé lourd'
                : restDuration >= 120
                  ? 'Exercice composé'
                  : restDuration >= 90
                    ? 'Charge lourde'
                    : 'Isolation'
            }}
            · {{ restDuration }}s recommandé
          </p>
        </div>
      </div>
    </Transition>

    <!-- Écran de fin d'entraînement -->
    <Transition name="fade">
      <div
        v-if="showCompletionScreen"
        class="fixed inset-0 z-50 bg-white dark:bg-primary-900 overflow-y-auto"
      >
        <div class="min-h-full flex items-center justify-center py-12 px-4">
          <div class="max-w-md w-full text-center space-y-8">
            <!-- Check icon -->
            <div
              class="w-24 h-24 mx-auto bg-gradient-primary rounded-full flex items-center justify-center"
            >
              <svg
                class="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2.5"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <div>
              <h2 class="text-3xl font-bold text-primary-900 dark:text-primary-100 mb-2">
                Bravo !
              </h2>
              <p class="text-primary-600 dark:text-primary-400">Entraînement terminé avec succès</p>
            </div>

            <!-- Résumé -->
            <div class="grid grid-cols-3 gap-4">
              <div class="card-glass !p-2 md:!p-4">
                <p class="text-2xl font-bold text-primary-900 dark:text-primary-100">
                  {{ formattedTime }}
                </p>
                <p class="text-xs text-primary-500 dark:text-primary-400 mt-1">Durée</p>
              </div>
              <div class="card-glass !p-2 md:!p-4">
                <p class="text-2xl font-bold text-primary-900 dark:text-primary-100">
                  {{ completionCalories }}
                </p>
                <p class="text-xs text-primary-500 dark:text-primary-400 mt-1">kcal</p>
              </div>
              <div class="card-glass !p-2 md:!p-4">
                <p class="text-2xl font-bold text-primary-900 dark:text-primary-100">
                  {{ workout?.exercises?.length || 0 }}
                </p>
                <p class="text-xs text-primary-500 dark:text-primary-400 mt-1">Exercices</p>
              </div>
            </div>

            <!-- Share receipt button -->
            <button
              @click="showReceiptModal = true"
              class="btn-outline w-full flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              Partager mon reçu de séance
            </button>

            <!-- Upload photo -->
            <div class="card-glass !p-6 space-y-4">
              <div class="flex items-center justify-center gap-3">
                <svg
                  class="w-6 h-6 text-primary-600 dark:text-primary-400"
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
                <h3 class="text-lg font-bold text-primary-900 dark:text-primary-100">
                  Photo de progression
                </h3>
              </div>
              <p class="text-sm text-primary-500 dark:text-primary-400">
                Prends une photo pour suivre ta transformation
              </p>

              <!-- Preview -->
              <div v-if="photoPreview" class="relative">
                <img
                  :src="photoPreview"
                  class="w-full h-48 object-cover rounded-xl"
                  alt="Preview"
                />
                <button
                  @click="removePhoto"
                  class="absolute top-2 right-2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <!-- Upload button -->
              <div v-if="!photoPreview">
                <input
                  ref="photoInput"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  class="hidden"
                  @change="onPhotoSelected"
                />
                <button
                  @click="photoInput?.click()"
                  class="btn-outline w-full flex items-center justify-center gap-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  Prendre une photo
                </button>
              </div>

              <!-- Primary toggle -->
              <label v-if="photoPreview" class="flex items-center gap-3 cursor-pointer">
                <input
                  v-model="photoIsPrimary"
                  type="checkbox"
                  class="w-5 h-5 rounded border-primary-300 dark:border-primary-600 text-sand-600 focus:ring-sand-600"
                />
                <span class="text-sm text-primary-700 dark:text-primary-300"
                  >Photo principale (timelapse)</span
                >
              </label>
            </div>

            <!-- Actions -->
            <div class="space-y-3">
              <button
                v-if="photoPreview"
                @click="savePhotoAndExit"
                :disabled="isUploadingPhoto"
                class="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2"
              >
                <div
                  v-if="isUploadingPhoto"
                  class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"
                ></div>
                {{ isUploadingPhoto ? 'Envoi en cours...' : 'Sauvegarder et terminer' }}
              </button>
              <button v-else @click="exitCompletion" class="btn-primary w-full py-4 text-lg">
                Terminer
              </button>
              <button
                v-if="photoPreview"
                @click="exitCompletion"
                class="text-primary-500 dark:text-primary-400 text-sm hover:text-primary-700 dark:hover:text-primary-200 transition-colors"
              >
                Passer sans sauvegarder la photo
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
    <!-- Receipt Share Modal -->
    <Teleport to="body">
      <div
        v-if="showReceiptModal"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4"
      >
        <div
          class="absolute inset-0 bg-black/60 backdrop-blur-sm"
          @click="showReceiptModal = false"
        ></div>
        <div
          class="relative bg-white dark:bg-primary-900 rounded-2xl p-4 md:p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-primary-200 dark:border-primary-700"
        >
          <button
            @click="showReceiptModal = false"
            class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors"
          >
            <svg
              class="w-5 h-5 text-primary-500"
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
          <h3 class="text-xl font-bold text-primary-900 dark:text-primary-100 mb-4">
            Reçu de séance
          </h3>
          <ShareCard type="receipt" title="Mon entraînement Athletiq" :data="receiptData" />
        </div>
      </div>
    </Teleport>

    <!-- Modal confirmer fin d'entraînement -->
    <Teleport to="body">
      <div
        v-if="showCompleteModal"
        class="fixed inset-0 z-50 flex items-center justify-center px-6"
        @click.self="showCompleteModal = false"
      >
        <div class="fixed inset-0 bg-black/40 backdrop-blur-sm"></div>
        <div
          class="relative bg-white dark:bg-primary-900 rounded-3xl p-8 max-w-sm w-full shadow-2xl"
        >
          <div class="text-center">
            <div
              class="w-14 h-14 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <svg
                class="w-7 h-7 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-primary-900 dark:text-primary-100 mb-2">
              Terminer l'entraînement ?
            </h3>
            <p class="text-primary-600 dark:text-primary-400 text-sm mb-6">
              Ta séance sera enregistrée avec toutes les séries validées.
            </p>
            <div class="space-y-3">
              <button
                @click="
                  showCompleteModal = false;
                  completeWorkout();
                "
                :disabled="isCompleting"
                class="w-full py-3 rounded-2xl bg-gradient-primary text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isCompleting ? 'En cours...' : 'Terminer' }}
              </button>
              <button
                @click="showCompleteModal = false"
                class="w-full py-3 rounded-2xl bg-primary-100 dark:bg-primary-800 text-primary-800 dark:text-primary-200 font-medium hover:bg-primary-200 dark:hover:bg-primary-700 transition-colors"
              >
                Continuer
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal confirmer sortie -->
    <Teleport to="body">
      <div
        v-if="showExitModal"
        class="fixed inset-0 z-50 flex items-center justify-center px-6"
        @click.self="showExitModal = false"
      >
        <div class="fixed inset-0 bg-black/40 backdrop-blur-sm"></div>
        <div
          class="relative bg-white dark:bg-primary-900 rounded-3xl p-8 max-w-sm w-full shadow-2xl"
        >
          <div class="text-center">
            <div
              class="w-14 h-14 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <svg
                class="w-7 h-7 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-primary-900 dark:text-primary-100 mb-2">
              Quitter sans terminer ?
            </h3>
            <p class="text-primary-600 dark:text-primary-400 text-sm mb-6">
              Ta progression ne sera pas enregistrée.
            </p>
            <div class="space-y-3">
              <button
                @click="
                  showExitModal = false;
                  navigateTo('/workouts');
                "
                class="w-full py-3 rounded-2xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
              >
                Quitter
              </button>
              <button
                @click="showExitModal = false"
                class="w-full py-3 rounded-2xl bg-primary-100 dark:bg-primary-800 text-primary-800 dark:text-primary-200 font-medium hover:bg-primary-200 dark:hover:bg-primary-700 transition-colors"
              >
                Rester
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { useWorkoutStore } from '~/stores/workout';
import { useAuthStore } from '~/stores/auth';
import type { Workout, Exercise, Set } from '~/types/workout';

useHead({ meta: [{ name: 'robots', content: 'noindex, nofollow' }] });

const route = useRoute();
const workoutStore = useWorkoutStore();
const authStore = useAuthStore();

const workout = ref<Workout | null>(null);
const isLoading = ref(true);
const currentExerciseIndex = ref(0);
const currentSetNumber = ref(1);
const exerciseHistory = ref<{ lastSets: Set[]; lastWorkoutDate: string | null } | null>(null);
const completedSets = ref<Array<{ id: number; setNumber: number; reps: number; weight: number }>>(
  []
);

const showCountdown = ref(true);
const countdownNumber = ref<number | string>(3);

const currentSetData = ref({
  reps: 10,
  weight: 20,
});

const showRestTimer = ref(false);
const restTimeRemaining = ref(60);
const restDuration = ref(60);
const restInterval = ref<NodeJS.Timeout | null>(null);

const elapsedTime = ref(0);
const timerInterval = ref<NodeJS.Timeout | null>(null);
const countdownInterval = ref<NodeJS.Timeout | null>(null);
const countdownTimeout = ref<NodeJS.Timeout | null>(null);

const currentExercise = computed(() => {
  if (!workout.value?.exercises || workout.value.exercises.length === 0) return null;
  return workout.value.exercises[currentExerciseIndex.value];
});

const totalSets = computed(() => currentExercise.value?.targetSets || 3);

// === Superset session plan ===
interface SessionStep {
  exerciseIndex: number;
  setNumber: number;
  isRest: boolean;
  isSuperset: boolean;
  supersetRound: number;
  supersetTotalRounds: number;
  supersetGroupId: number | null;
}

const sessionPlan = computed<SessionStep[]>(() => {
  const exercises = workout.value?.exercises;
  if (!exercises || exercises.length === 0) return [];

  const steps: SessionStep[] = [];
  const visited = new Set<number>();

  for (let i = 0; i < exercises.length; i++) {
    if (visited.has(i)) continue;

    const ex = exercises[i];
    const group = ex.supersetGroup;

    if (group != null) {
      // Collect all exercises in this superset group (contiguous)
      const groupExercises: number[] = [];
      for (let j = i; j < exercises.length; j++) {
        if (exercises[j].supersetGroup === group) {
          groupExercises.push(j);
          visited.add(j);
        } else {
          break;
        }
      }

      // Determine max sets across group
      const maxSets = Math.max(...groupExercises.map((idx) => exercises[idx].targetSets || 3));

      // Interleave: for each round, do all exercises, then rest
      for (let round = 1; round <= maxSets; round++) {
        for (const exIdx of groupExercises) {
          const exSets = exercises[exIdx].targetSets || 3;
          if (round <= exSets) {
            steps.push({
              exerciseIndex: exIdx,
              setNumber: round,
              isRest: false,
              isSuperset: true,
              supersetRound: round,
              supersetTotalRounds: maxSets,
              supersetGroupId: group,
            });
          }
        }
        // Rest after each round (but not after the very last round if it's the last group)
        steps.push({
          exerciseIndex: groupExercises[0],
          setNumber: round,
          isRest: true,
          isSuperset: true,
          supersetRound: round,
          supersetTotalRounds: maxSets,
          supersetGroupId: group,
        });
      }
    } else {
      // Standalone exercise: normal flow
      visited.add(i);
      const sets = ex.targetSets || 3;
      for (let s = 1; s <= sets; s++) {
        steps.push({
          exerciseIndex: i,
          setNumber: s,
          isRest: false,
          isSuperset: false,
          supersetRound: 0,
          supersetTotalRounds: 0,
          supersetGroupId: null,
        });
        // Rest after each set (including last - will be skipped at end by navigation)
        steps.push({
          exerciseIndex: i,
          setNumber: s,
          isRest: true,
          isSuperset: false,
          supersetRound: 0,
          supersetTotalRounds: 0,
          supersetGroupId: null,
        });
      }
    }
  }

  // Remove trailing rest step
  if (steps.length > 0 && steps[steps.length - 1].isRest) {
    steps.pop();
  }

  return steps;
});

const currentStepIndex = ref(0);

const currentStep = computed<SessionStep | null>(() => {
  return sessionPlan.value[currentStepIndex.value] || null;
});

const currentStepIsSuperset = computed(() => {
  return currentStep.value?.isSuperset ?? false;
});

const currentSupersetRound = computed(() => {
  return currentStep.value?.supersetRound ?? 0;
});

const currentSupersetTotalRounds = computed(() => {
  return currentStep.value?.supersetTotalRounds ?? 0;
});

const nextNonRestStep = computed<SessionStep | null>(() => {
  for (let i = currentStepIndex.value + 1; i < sessionPlan.value.length; i++) {
    if (!sessionPlan.value[i].isRest) return sessionPlan.value[i];
  }
  return null;
});

// Sync currentExerciseIndex and currentSetNumber from session plan
const syncFromPlan = () => {
  const step = currentStep.value;
  if (!step || step.isRest) return;
  currentExerciseIndex.value = step.exerciseIndex;
  currentSetNumber.value = step.setNumber;
  // Update completedSets to show only sets for the current exercise
  updateCompletedSetsForCurrentExercise();
};

const updateCompletedSetsForCurrentExercise = () => {
  const exId = currentExercise.value?.id;
  if (!exId) {
    completedSets.value = [];
    return;
  }
  completedSets.value = allCompletedSets.value
    .filter((s) => s.exerciseId === exId)
    .map((s) => ({ id: s.setId, setNumber: s.setNumber, reps: s.reps, weight: s.weight }));
};

// === Navigation entre séries passées ===
// Historique global de toutes les séries faites : [{exerciseIndex, setNumber, reps, weight, setId, exerciseId}]
const allCompletedSets = ref<
  Array<{
    exerciseIndex: number;
    exerciseId: number;
    setNumber: number;
    reps: number;
    weight: number;
    setId: number;
  }>
>([]);

// viewingIndex: null = on est sur la série actuelle, sinon index dans allCompletedSets
const viewingIndex = ref<number | null>(null);

const isViewingPast = computed(() => viewingIndex.value !== null);

const canNavigateBack = computed(() => {
  if (isViewingPast.value) return viewingIndex.value! > 0;
  return allCompletedSets.value.length > 0;
});

const canNavigateForward = computed(() => {
  if (!isViewingPast.value) return false;
  return viewingIndex.value! < allCompletedSets.value.length - 1 || isViewingPast.value;
});

const viewingSet = computed(() => {
  if (viewingIndex.value === null) return null;
  return allCompletedSets.value[viewingIndex.value];
});

const viewingExerciseName = computed(() => {
  if (isViewingPast.value && viewingSet.value) {
    const ex = workout.value?.exercises?.[viewingSet.value.exerciseIndex];
    return ex?.exerciseLibrary?.name || ex?.name || '';
  }
  return currentExercise.value?.exerciseLibrary?.name || currentExercise.value?.name || '';
});

const viewingExerciseImage = computed(() => {
  if (isViewingPast.value && viewingSet.value) {
    const ex = workout.value?.exercises?.[viewingSet.value.exerciseIndex];
    return ex?.exerciseLibrary?.imageUrl;
  }
  return currentExercise.value?.exerciseLibrary?.imageUrl;
});

const viewingSetNumber = computed(() => {
  return viewingSet.value?.setNumber || 0;
});

const navigateBack = () => {
  if (!canNavigateBack.value) return;
  if (viewingIndex.value === null) {
    // On est sur la série actuelle, on recule à la dernière série faite
    viewingIndex.value = allCompletedSets.value.length - 1;
  } else if (viewingIndex.value > 0) {
    viewingIndex.value--;
  }
  // Charger les données de la série qu'on regarde
  loadViewingSetData();
};

const navigateForward = () => {
  if (!canNavigateForward.value) return;
  if (viewingIndex.value !== null) {
    if (viewingIndex.value < allCompletedSets.value.length - 1) {
      viewingIndex.value++;
      loadViewingSetData();
    } else {
      // On revient à la série actuelle
      returnToCurrent();
    }
  }
};

const loadViewingSetData = () => {
  const s = viewingSet.value;
  if (s) {
    currentSetData.value.reps = s.reps;
    currentSetData.value.weight = s.weight;
  }
};

const returnToCurrent = () => {
  viewingIndex.value = null;
  prefillCurrentSet();
};

const saveViewingSet = async () => {
  const s = viewingSet.value;
  if (!s || !workout.value) return;
  try {
    await workoutStore.updateSet(workout.value.id, s.exerciseId, s.setId, {
      reps: currentSetData.value.reps,
      weight: currentSetData.value.weight,
    });
    // Mettre à jour dans l'historique local
    s.reps = currentSetData.value.reps;
    s.weight = currentSetData.value.weight;
    // Aussi mettre à jour completedSets si c'est le même exercice
    const matchingCompleted = completedSets.value.find((cs) => cs.id === s.setId);
    if (matchingCompleted) {
      matchingCompleted.reps = currentSetData.value.reps;
      matchingCompleted.weight = currentSetData.value.weight;
    }
    toast.success('Serie modifiee !');
  } catch (error) {
    logger.error('Failed to update set:', error);
    toast.error('Erreur lors de la modification');
  }
};

// Cercle de progression pour le timer (rayon = 105)
const restCircumference = computed(() => 2 * Math.PI * 105);

const restProgressOffset = computed(() => {
  const progress = restTimeRemaining.value / restDuration.value;
  return restCircumference.value * (1 - progress);
});

const progress = computed(() => {
  const totalNonRestSteps = sessionPlan.value.filter((s) => !s.isRest).length;
  if (totalNonRestSteps === 0) return 0;
  const completedStepsCount = allCompletedSets.value.length;
  return Math.min((completedStepsCount / totalNonRestSteps) * 100, 100);
});

const nextButtonLabel = computed(() => {
  // Check if the next non-rest step after this one exists
  const remaining = sessionPlan.value.slice(currentStepIndex.value + 1).filter((s) => !s.isRest);
  if (remaining.length === 0) {
    return "Terminer l'entraînement";
  }
  // If next exercise step is a different exercise (not in same superset round)
  const nextEx = remaining[0];
  if (
    currentStepIsSuperset.value &&
    nextEx.isSuperset &&
    nextEx.supersetGroupId === currentStep.value?.supersetGroupId &&
    nextEx.supersetRound === currentStep.value?.supersetRound
  ) {
    return 'Suivant (superset)';
  }
  if (nextEx.exerciseIndex !== currentExerciseIndex.value) {
    return 'Exercice suivant';
  }
  return 'Suivant';
});

const formattedTime = computed(() => {
  const hours = Math.floor(elapsedTime.value / 3600);
  const minutes = Math.floor((elapsedTime.value % 3600) / 60);
  const seconds = elapsedTime.value % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

onMounted(async () => {
  const workoutId = parseInt(route.params.id as string);
  await loadWorkout(workoutId);

  await startCountdown();

  timerInterval.value = setInterval(() => {
    elapsedTime.value++;
  }, 1000);
});

onBeforeUnmount(() => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
    timerInterval.value = null;
  }
  if (restInterval.value) {
    clearInterval(restInterval.value);
    restInterval.value = null;
  }
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value);
    countdownInterval.value = null;
  }
  if (countdownTimeout.value) {
    clearTimeout(countdownTimeout.value);
    countdownTimeout.value = null;
  }
  workoutStore.clearCurrentWorkout();
});

const startCountdown = () => {
  return new Promise<void>((resolve) => {
    countdownNumber.value = 3;

    countdownInterval.value = setInterval(() => {
      countdownNumber.value = (countdownNumber.value as number) - 1;

      if (countdownNumber.value === 0) {
        countdownNumber.value = 'GO';
        countdownTimeout.value = setTimeout(() => {
          showCountdown.value = false;
          if (countdownInterval.value) {
            clearInterval(countdownInterval.value);
            countdownInterval.value = null;
          }
          countdownTimeout.value = null;
          resolve();
        }, 800);
      }
    }, 1000);
  });
};

const loadWorkout = async (id: number) => {
  isLoading.value = true;
  try {
    workout.value = await workoutStore.fetchWorkout(id);

    // Initialize session plan: sync from first step
    currentStepIndex.value = 0;
    syncFromPlan();

    if (currentExercise.value?.exerciseLibraryId) {
      await loadExerciseHistory(currentExercise.value.exerciseLibraryId);
      prefillCurrentSet();
      checkWeightProgression();
    }
  } catch (error) {
    logger.error('Failed to load workout:', error);
  } finally {
    isLoading.value = false;
  }
};

const loadExerciseHistory = async (exerciseLibraryId: number) => {
  try {
    const api = useWorkoutApi();
    exerciseHistory.value = await api.getExerciseHistory(exerciseLibraryId);
  } catch (error) {
    logger.error('Failed to load exercise history:', error);
    exerciseHistory.value = null;
  }
};

// Auto weight progression: suggest increase when all previous sets hit target reps
const weightSuggestion = ref<{ message: string; newWeight: number } | null>(null);

const checkWeightProgression = () => {
  if (!exerciseHistory.value?.lastSets || exerciseHistory.value.lastSets.length === 0) {
    weightSuggestion.value = null;
    return;
  }

  const lastSets = exerciseHistory.value.lastSets;
  const exercise = currentExercise.value;
  if (!exercise) return;

  const targetReps = exercise.targetReps || 10;
  // Check if ALL sets from last time met or exceeded target reps
  const allSetsHitTarget = lastSets.every((s) => (s.reps || 0) >= targetReps);

  if (allSetsHitTarget && lastSets.length > 0) {
    const lastWeight = lastSets[0].weight || 0;
    // Upper body: +2.5kg, Lower body: +5kg
    const lib = exercise.exerciseLibrary;
    const isLowerBody =
      lib?.muscleGroups?.some((mg: string) =>
        ['LEGS', 'QUADS', 'HAMSTRINGS', 'GLUTES', 'CALVES'].includes(mg)
      ) ?? false;
    const increment = isLowerBody ? 5 : 2.5;
    const newWeight = lastWeight + increment;

    weightSuggestion.value = {
      message: `Toutes les séries réussies ! Essaie ${newWeight} kg (+${increment})`,
      newWeight,
    };
  } else {
    weightSuggestion.value = null;
  }
};

const applyWeightSuggestion = () => {
  if (weightSuggestion.value) {
    currentSetData.value.weight = weightSuggestion.value.newWeight;
    weightSuggestion.value = null;
  }
};

const prefillCurrentSet = () => {
  logger.log('🔄 prefillCurrentSet - Série:', currentSetNumber.value);
  logger.log('📋 lastSets:', exerciseHistory.value?.lastSets);
  logger.log('🎯 plannedSets:', currentExercise.value?.plannedSets);

  // 1. Priorité MAXIMALE: historique de l'exercice (ce que tu as fait la dernière fois)
  if (exerciseHistory.value?.lastSets && exerciseHistory.value.lastSets.length > 0) {
    // D'abord, chercher le set avec le bon setNumber
    let lastSet = exerciseHistory.value.lastSets.find(
      (s) => s.setNumber === currentSetNumber.value
    );

    // Si pas trouvé par setNumber, utiliser l'index (série 1 = index 0, série 2 = index 1, etc.)
    if (!lastSet) {
      const setIndex = currentSetNumber.value - 1;
      lastSet =
        exerciseHistory.value.lastSets[setIndex] ||
        exerciseHistory.value.lastSets[exerciseHistory.value.lastSets.length - 1]; // Sinon le dernier
      logger.log('🔍 Index', setIndex, '→', lastSet);
    }

    if (lastSet) {
      logger.log('✅ HISTORIQUE:', lastSet.reps, '×', lastSet.weight, 'kg');
      currentSetData.value.reps = lastSet.reps || 10;
      currentSetData.value.weight = lastSet.weight || 20;
      return;
    }
  }

  // 2. Sinon: séries planifiées personnalisées
  if (currentExercise.value?.plannedSets && currentExercise.value.plannedSets.length > 0) {
    const plannedSet = currentExercise.value.plannedSets.find(
      (s) => s.setNumber === currentSetNumber.value
    );
    if (plannedSet) {
      logger.log('✅ PLANNED:', plannedSet.targetReps, '×', plannedSet.targetWeight, 'kg');
      currentSetData.value.reps = plannedSet.targetReps;
      currentSetData.value.weight = plannedSet.targetWeight;
      return;
    }
  }

  // 3. Sinon: valeurs par défaut de l'exercice
  if (currentExercise.value) {
    logger.log(
      '⚠️ DÉFAUT:',
      currentExercise.value.targetReps || 10,
      '×',
      currentExercise.value.targetWeight || 20
    );
    currentSetData.value.reps = currentExercise.value.targetReps || 10;
    currentSetData.value.weight = currentExercise.value.targetWeight || 20;
  }
};

const advanceSessionPlan = async () => {
  // Move to the next step in the session plan
  const prevExerciseIndex = currentExerciseIndex.value;

  currentStepIndex.value++;

  // Check if we've reached the end
  if (currentStepIndex.value >= sessionPlan.value.length) {
    await completeWorkout();
    return;
  }

  const nextStep = sessionPlan.value[currentStepIndex.value];

  if (nextStep.isRest) {
    // Show rest timer, then advance again when it ends
    const exerciseForRest = workout.value?.exercises?.[nextStep.exerciseIndex] || null;
    const smartRest = computeSmartRest(
      exerciseForRest,
      currentSetData.value.weight,
      nextStep.exerciseIndex !== prevExerciseIndex
    );
    startRestTimer(smartRest);
    return;
  }

  // It's an exercise step - sync state
  syncFromPlan();

  // Load history if exercise changed
  if (nextStep.exerciseIndex !== prevExerciseIndex) {
    const newExercise = workout.value?.exercises?.[nextStep.exerciseIndex];
    if (newExercise?.exerciseLibraryId) {
      await loadExerciseHistory(newExercise.exerciseLibraryId);
      checkWeightProgression();
    }
  }

  prefillCurrentSet();
};

const validateCurrentSet = async () => {
  if (!workout.value || !currentExercise.value) return;

  // Sanitize inputs: prevent negative and NaN values
  let reps = currentSetData.value.reps;
  let weight = currentSetData.value.weight;
  if (isNaN(reps)) reps = 0;
  if (isNaN(weight)) weight = 0;
  reps = Math.max(0, reps);
  weight = Math.max(0, weight);
  currentSetData.value.reps = reps;
  currentSetData.value.weight = weight;

  try {
    let savedSet: any;
    try {
      savedSet = await workoutStore.addSetToExercise(workout.value.id, currentExercise.value.id, {
        setNumber: currentSetNumber.value,
        reps: reps,
        weight: weight,
      });
    } catch (err) {
      // If offline, queue the action and continue locally
      if (!navigator.onLine) {
        const { addToQueue } = useOfflineStorage();
        await addToQueue({
          type: 'ADD_SET',
          endpoint: `/workouts/${workout.value!.id}/exercises/${currentExercise.value!.id}/sets`,
          method: 'POST',
          body: { setNumber: currentSetNumber.value, reps, weight },
        });
        // Create a fake savedSet for local UI
        savedSet = { id: Date.now(), setNumber: currentSetNumber.value, reps, weight };
      } else {
        throw err;
      }
    }

    completedSets.value.push({
      id: savedSet.id,
      setNumber: currentSetNumber.value,
      reps: currentSetData.value.reps,
      weight: currentSetData.value.weight,
    });

    // Ajouter à l'historique global de navigation
    allCompletedSets.value.push({
      exerciseIndex: currentExerciseIndex.value,
      exerciseId: currentExercise.value!.id,
      setNumber: currentSetNumber.value,
      reps: currentSetData.value.reps,
      weight: currentSetData.value.weight,
      setId: savedSet.id,
    });
    // S'assurer qu'on est sur la série actuelle
    viewingIndex.value = null;

    await advanceSessionPlan();
  } catch (error) {
    logger.error('Failed to save set:', error);
  }
};

// Smart rest timer: compute optimal rest based on exercise type and load
const computeSmartRest = (
  exercise: Exercise | null,
  weight: number,
  betweenExercises: boolean
): number => {
  if (!exercise) return betweenExercises ? 90 : 60;

  // 1. Check per-set restTime from plannedSets (just completed set)
  if (exercise.plannedSets && exercise.plannedSets.length > 0) {
    const justCompletedSetIndex = currentSetNumber.value - 1; // currentSetNumber already incremented
    const plannedSet =
      exercise.plannedSets.find((s) => s.setNumber === justCompletedSetIndex) ||
      exercise.plannedSets[justCompletedSetIndex - 1];
    if (plannedSet?.restTime) return plannedSet.restTime;
  }

  // 2. If exercise has a custom restTime, always use it
  if (exercise.restTime) return exercise.restTime;

  const lib = exercise.exerciseLibrary;
  const muscleCount = lib?.muscleGroups?.length || 1;
  const equipment = lib?.equipment || '';
  const isCompound = muscleCount >= 2 || ['BARBELL'].includes(equipment);
  const isHeavy = weight >= 80; // heavy load threshold

  let rest: number;

  if (isCompound && isHeavy) {
    rest = 180; // 3min for heavy compounds (squat, deadlift, bench)
  } else if (isCompound) {
    rest = 120; // 2min for compound movements
  } else if (isHeavy) {
    rest = 90; // 1.5min for heavy isolation
  } else {
    rest = 60; // 1min for light isolation
  }

  // Add 30s when switching between exercises
  if (betweenExercises) rest += 30;

  return rest;
};

const startRestTimer = (duration: number = 60) => {
  showRestTimer.value = true;
  restTimeRemaining.value = duration;
  restDuration.value = duration;

  restInterval.value = setInterval(() => {
    restTimeRemaining.value--;
    if (restTimeRemaining.value <= 0) {
      skipRest();
    }
  }, 1000);
};

const skipRest = () => {
  showRestTimer.value = false;
  if (restInterval.value) {
    clearInterval(restInterval.value);
    restInterval.value = null;
  }
  // After rest, advance to next exercise step in the plan
  const step = currentStep.value;
  if (step && step.isRest) {
    advanceSessionPlan();
  }
};

const addRestTime = (seconds: number) => {
  restTimeRemaining.value = Math.max(0, restTimeRemaining.value + seconds);
};

const formatRestTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const toast = useToast();

// === Completion screen state ===
const showCompletionScreen = ref(false);
const showReceiptModal = ref(false);
const photoInput = ref<HTMLInputElement | null>(null);
const photoPreview = ref<string | null>(null);
const photoFile = ref<File | null>(null);
const photoIsPrimary = ref(true);
const isUploadingPhoto = ref(false);

const completionCalories = computed(() => Math.round((elapsedTime.value / 60) * 6));

const receiptData = computed(() => {
  const exercises = (workout.value?.exercises || []).map((ex) => {
    const sets = ex.sets || [];
    const completedSetsCount = sets.length;
    const totalVol = sets.reduce((s, set) => s + (set.reps || 0) * (set.weight || 0), 0);
    const setsStr = sets.map((s) => `${s.reps}×${s.weight}kg`).join(' · ');
    return {
      name: ex.exerciseLibrary?.name || ex.name,
      sets: setsStr || `${completedSetsCount} séries`,
      volume: totalVol > 0 ? `${totalVol.toLocaleString('fr-FR')} kg` : '—',
    };
  });
  const totalVolume = (workout.value?.exercises || []).reduce((total, ex) => {
    return total + (ex.sets || []).reduce((s, set) => s + (set.reps || 0) * (set.weight || 0), 0);
  }, 0);
  return {
    workoutName: workout.value?.name || 'Entraînement',
    date: workout.value?.completedAt || new Date().toISOString(),
    duration: formattedTime.value,
    calories: completionCalories.value,
    exerciseCount: workout.value?.exercises?.length || 0,
    exercises,
    totalVolume: totalVolume.toLocaleString('fr-FR'),
    userName: authStore.user?.firstName || '',
  };
});

const isCompleting = ref(false);

const completeWorkout = async () => {
  if (!workout.value || isCompleting.value) return;
  isCompleting.value = true;

  try {
    await workoutStore.completeWorkout(workout.value.id);
    await workoutStore.fetchWorkouts();
    // Stop the timer
    if (timerInterval.value) {
      clearInterval(timerInterval.value);
      timerInterval.value = null;
    }
    if (restInterval.value) {
      clearInterval(restInterval.value);
      restInterval.value = null;
    }
    showRestTimer.value = false;
    // Show completion screen instead of navigating away
    showCompletionScreen.value = true;

    // Fire-and-forget health sync
    if (process.client && localStorage.getItem('healthSyncEnabled') === 'true') {
      import('~/composables/useHealthSync')
        .then(({ useHealthSync }) => {
          const healthSync = useHealthSync();
          healthSync
            .syncWorkout({
              name: workout.value!.name,
              startedAt: workout.value!.startedAt || new Date().toISOString(),
              completedAt: workout.value!.completedAt || new Date().toISOString(),
              durationMinutes: (workout.value as any)?.durationMinutes,
              caloriesBurned: (workout.value as any)?.caloriesBurned,
            })
            .catch(() => {});
        })
        .catch(() => {});
    }
  } catch (error) {
    toast.error('Erreur lors de la complétion');
    logger.error('Failed to complete workout:', error);
  } finally {
    isCompleting.value = false;
  }
};

const onPhotoSelected = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

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

  photoFile.value = file;
  photoPreview.value = URL.createObjectURL(file);
};

const removePhoto = () => {
  if (photoPreview.value) URL.revokeObjectURL(photoPreview.value);
  photoPreview.value = null;
  photoFile.value = null;
  if (photoInput.value) photoInput.value.value = '';
};

const savePhotoAndExit = async () => {
  if (!photoFile.value || !workout.value) return;

  isUploadingPhoto.value = true;
  try {
    const bodyApi = useBodyApi();
    await bodyApi.uploadPhoto(workout.value.id, photoFile.value, photoIsPrimary.value);
    toast.success('Photo sauvegardée !');
  } catch (error) {
    logger.error('Failed to upload photo:', error);
    toast.error("Erreur lors de l'envoi de la photo");
  } finally {
    isUploadingPhoto.value = false;
    if (photoPreview.value) URL.revokeObjectURL(photoPreview.value);
    navigateTo('/dashboard');
  }
};

const exitCompletion = () => {
  if (photoPreview.value) URL.revokeObjectURL(photoPreview.value);
  navigateTo('/dashboard');
};

const showCompleteModal = ref(false);
const showExitModal = ref(false);

const confirmComplete = () => {
  showCompleteModal.value = true;
};

const confirmExit = () => {
  showExitModal.value = true;
};

// === Feature 1: Skip set ===
const skipCurrentSet = () => {
  currentSetData.value.reps = 0;
  currentSetData.value.weight = 0;
  validateCurrentSet();
};

// === Feature 3: Add exercise during live session ===
const showAddExerciseModal = ref(false);
const liveExerciseLibrary = ref<any[]>([]);
const isLoadingLiveExercises = ref(false);
const liveSearchQuery = ref('');
const liveFilterMuscle = ref('');
const liveFilterEquipment = ref('');

const openAddExerciseModal = () => {
  showAddExerciseModal.value = true;
  if (liveExerciseLibrary.value.length === 0) {
    searchExercisesLive();
  }
};

const searchExercisesLive = async () => {
  isLoadingLiveExercises.value = true;
  try {
    const exercises = await workoutStore.fetchExerciseLibrary({
      search: liveSearchQuery.value || undefined,
      muscleGroup: liveFilterMuscle.value || undefined,
      equipment: liveFilterEquipment.value || undefined,
      limit: 50,
    });
    liveExerciseLibrary.value = exercises;
  } catch (error) {
    logger.error('Failed to load exercises:', error);
  } finally {
    isLoadingLiveExercises.value = false;
  }
};

const addExerciseLive = async (exercise: any) => {
  if (!workout.value) return;
  try {
    const addedExercise = await workoutStore.addExerciseToWorkout(workout.value.id, {
      exerciseLibraryId: exercise.id,
      name: exercise.name,
      restTime: 60,
      orderIndex: workout.value.exercises?.length || 0,
      plannedSets: [{ setNumber: 1, targetReps: 10, targetWeight: 0, restTime: 60 }],
    });
    if (!workout.value.exercises) workout.value.exercises = [];
    workout.value.exercises.push(addedExercise);
    showAddExerciseModal.value = false;
    toast.success('Exercice ajouté !');
  } catch (error) {
    logger.error('Failed to add exercise:', error);
    toast.error("Erreur lors de l'ajout");
  }
};

const formatMuscleGroupLive = (muscle?: string) => {
  const labels: Record<string, string> = {
    CHEST: 'Pectoraux',
    BACK: 'Dos',
    SHOULDERS: 'Épaules',
    LEGS: 'Jambes',
    BICEPS: 'Biceps',
    TRICEPS: 'Triceps',
    ABS: 'Abdos',
    QUADS: 'Quadriceps',
    HAMSTRINGS: 'Ischio-jambiers',
    GLUTES: 'Fessiers',
    CALVES: 'Mollets',
    CARDIO: 'Cardio',
  };
  return muscle ? labels[muscle] || muscle : '';
};

const formatEquipmentLive = (equipment?: string) => {
  const labels: Record<string, string> = {
    BARBELL: 'Barre',
    DUMBBELL: 'Haltères',
    BODYWEIGHT: 'Poids du corps',
    MACHINE: 'Machine',
    CABLE: 'Câble',
    KETTLEBELL: 'Kettlebell',
    RESISTANCE_BAND: 'Élastique',
    OTHER: 'Autre',
  };
  return equipment ? labels[equipment] || equipment : '';
};

definePageMeta({
  middleware: 'auth',
});
</script>
