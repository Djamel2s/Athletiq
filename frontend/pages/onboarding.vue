<template>
  <div class="min-h-screen flex flex-col">
    <!-- Progress bar -->
    <div class="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-primary-900/80 backdrop-blur-md">
      <div class="max-w-lg mx-auto px-6 pt-6 pb-4">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-medium text-primary-600 dark:text-primary-400">
            Etape {{ currentStep }} / {{ totalSteps }}
          </span>
          <span class="text-xs text-primary-500 dark:text-primary-400">
            {{ stepTitles[currentStep - 1] }}
          </span>
        </div>
        <div class="h-2 bg-primary-100 dark:bg-primary-800 rounded-full overflow-hidden">
          <div
            class="h-full bg-gradient-primary rounded-full transition-all duration-500 ease-out"
            :style="{ width: `${(currentStep / totalSteps) * 100}%` }"
          />
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 flex items-center justify-center px-4 pt-28 pb-32">
      <div class="w-full max-w-lg">
        <!-- Step 1: Objectif -->
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 translate-x-8"
          enter-to-class="opacity-100 translate-x-0"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 translate-x-0"
          leave-to-class="opacity-0 -translate-x-8"
        >
          <div v-if="currentStep === 1" key="step1">
            <h1 class="text-2xl md:text-3xl font-bold text-primary-900 dark:text-primary-100 mb-2 text-center">
              Quel est ton objectif ?
            </h1>
            <p class="text-primary-600 dark:text-primary-400 text-center mb-8">
              On adapte tout selon ton objectif principal
            </p>

            <div class="grid grid-cols-1 gap-3">
              <button
                v-for="goal in goals"
                :key="goal.value"
                @click="selectedGoal = goal.value"
                :class="[
                  'card-glass flex items-center gap-4 p-5 text-left transition-all duration-200 border-2',
                  selectedGoal === goal.value
                    ? 'border-sand-500 dark:border-sand-400 shadow-lg scale-[1.02]'
                    : 'border-transparent hover:border-primary-300 dark:hover:border-primary-600'
                ]"
              >
                <div class="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0 text-2xl">
                  {{ goal.icon }}
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-semibold text-primary-900 dark:text-primary-100">{{ goal.label }}</h3>
                  <p class="text-sm text-primary-600 dark:text-primary-400">{{ goal.description }}</p>
                </div>
                <div v-if="selectedGoal === goal.value" class="w-6 h-6 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </Transition>

        <!-- Step 2: Niveau -->
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 translate-x-8"
          enter-to-class="opacity-100 translate-x-0"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 translate-x-0"
          leave-to-class="opacity-0 -translate-x-8"
        >
          <div v-if="currentStep === 2" key="step2">
            <h1 class="text-2xl md:text-3xl font-bold text-primary-900 dark:text-primary-100 mb-2 text-center">
              Quel est ton niveau ?
            </h1>
            <p class="text-primary-600 dark:text-primary-400 text-center mb-8">
              Pas de jugement, on commence tous quelque part
            </p>

            <div class="grid grid-cols-1 gap-3">
              <button
                v-for="level in levels"
                :key="level.value"
                @click="selectedLevel = level.value"
                :class="[
                  'card-glass flex items-center gap-4 p-5 text-left transition-all duration-200 border-2',
                  selectedLevel === level.value
                    ? 'border-sand-500 dark:border-sand-400 shadow-lg scale-[1.02]'
                    : 'border-transparent hover:border-primary-300 dark:hover:border-primary-600'
                ]"
              >
                <div class="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0 text-2xl">
                  {{ level.icon }}
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-semibold text-primary-900 dark:text-primary-100">{{ level.label }}</h3>
                  <p class="text-sm text-primary-600 dark:text-primary-400">{{ level.description }}</p>
                </div>
                <div v-if="selectedLevel === level.value" class="w-6 h-6 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </Transition>

        <!-- Step 3: Jours par semaine -->
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 translate-x-8"
          enter-to-class="opacity-100 translate-x-0"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 translate-x-0"
          leave-to-class="opacity-0 -translate-x-8"
        >
          <div v-if="currentStep === 3" key="step3">
            <h1 class="text-2xl md:text-3xl font-bold text-primary-900 dark:text-primary-100 mb-2 text-center">
              Combien de jours par semaine ?
            </h1>
            <p class="text-primary-600 dark:text-primary-400 text-center mb-8">
              La regularite compte plus que le volume
            </p>

            <div class="flex justify-center gap-3 mb-8">
              <button
                v-for="d in daysOptions"
                :key="d"
                @click="selectedDays = d"
                :class="[
                  'w-14 h-14 rounded-2xl font-bold text-lg transition-all duration-200 border-2',
                  selectedDays === d
                    ? 'bg-gradient-primary text-white border-transparent shadow-lg scale-110'
                    : 'card-glass border-transparent text-primary-900 dark:text-primary-100 hover:border-primary-300 dark:hover:border-primary-600'
                ]"
              >
                {{ d }}
              </button>
            </div>

            <!-- Suggestion -->
            <Transition
              enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="opacity-0 translate-y-4"
              enter-to-class="opacity-100 translate-y-0"
            >
              <div v-if="selectedDays" class="card-glass p-5 text-center">
                <p class="text-sm text-primary-600 dark:text-primary-400 mb-1">On te suggere :</p>
                <p class="text-lg font-bold text-gradient-primary mb-3">{{ suggestedProgram.name }}</p>
                <p class="text-sm text-primary-600 dark:text-primary-400">
                  {{ suggestedProgram.description }}
                </p>
              </div>
            </Transition>
          </div>
        </Transition>

        <!-- Step 4: Recap -->
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 translate-x-8"
          enter-to-class="opacity-100 translate-x-0"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 translate-x-0"
          leave-to-class="opacity-0 -translate-x-8"
        >
          <div v-if="currentStep === 4" key="step4">
            <div class="text-center mb-8">
              <div class="w-20 h-20 bg-gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-4 text-4xl">
                <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h1 class="text-2xl md:text-3xl font-bold text-primary-900 dark:text-primary-100 mb-2">
                C'est parti !
              </h1>
              <p class="text-primary-600 dark:text-primary-400">
                Voici un recap de tes choix
              </p>
            </div>

            <!-- Summary -->
            <div class="card-glass p-5 mb-6 space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-sm text-primary-600 dark:text-primary-400">Objectif</span>
                <span class="font-semibold text-primary-900 dark:text-primary-100">
                  {{ goals.find(g => g.value === selectedGoal)?.label }}
                </span>
              </div>
              <div class="border-t border-primary-100 dark:border-primary-700/60"></div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-primary-600 dark:text-primary-400">Niveau</span>
                <span class="font-semibold text-primary-900 dark:text-primary-100">
                  {{ levels.find(l => l.value === selectedLevel)?.label }}
                </span>
              </div>
              <div class="border-t border-primary-100 dark:border-primary-700/60"></div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-primary-600 dark:text-primary-400">Frequence</span>
                <span class="font-semibold text-primary-900 dark:text-primary-100">
                  {{ selectedDays }}j / semaine
                </span>
              </div>
              <div class="border-t border-primary-100 dark:border-primary-700/60"></div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-primary-600 dark:text-primary-400">Programme suggere</span>
                <span class="font-semibold text-gradient-primary">
                  {{ suggestedProgram.name }}
                </span>
              </div>
            </div>

            <!-- Actions -->
            <div class="space-y-3">
              <button
                @click="handleAdoptProgram"
                :disabled="adopting"
                class="btn-primary w-full py-3.5 text-base font-semibold disabled:opacity-60"
              >
                <span v-if="adopting" class="inline-flex items-center gap-2">
                  <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adoption en cours...
                </span>
                <span v-else>Adopter le programme suggere</span>
              </button>

              <button
                @click="handleSkip"
                :disabled="adopting"
                class="btn-glass w-full py-3.5 text-base font-semibold"
              >
                Je prefere creer mes seances
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <!-- Bottom navigation -->
    <div class="fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-primary-900/80 backdrop-blur-md border-t border-primary-100 dark:border-primary-800">
      <div class="max-w-lg mx-auto px-6 py-4 flex items-center justify-between">
        <button
          v-if="currentStep > 1"
          @click="prevStep"
          class="btn-glass px-5 py-2.5 inline-flex items-center gap-2 text-sm font-medium"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Retour
        </button>
        <div v-else></div>

        <button
          v-if="currentStep < totalSteps"
          @click="nextStep"
          :disabled="!canProceed"
          class="btn-primary px-6 py-2.5 inline-flex items-center gap-2 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Suivant
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { apiFetch } from '~/utils/apiFetch'
import { useProgramApi } from '~/composables/useProgramApi'

useHead({ meta: [{ name: 'robots', content: 'noindex, nofollow' }] })

const { getPrograms, adoptProgram } = useProgramApi()
const toast = useToast()

const totalSteps = 4
const currentStep = ref(1)

const stepTitles = ['Objectif', 'Niveau', 'Frequence', 'Recap']

// Step 1
const selectedGoal = ref<string | null>(null)
const goals = [
  { value: 'BULK', label: 'Prise de masse', icon: '💪', description: 'Gagner du muscle et du poids' },
  { value: 'STRENGTH', label: 'Force', icon: '🏋️', description: 'Devenir plus fort sur les mouvements cles' },
  { value: 'RECOMP', label: 'Recomposition', icon: '🔄', description: 'Perdre du gras et gagner du muscle' },
  { value: 'CUT', label: 'Seche', icon: '🔥', description: 'Perdre du gras en gardant le muscle' },
]

// Step 2
const selectedLevel = ref<string | null>(null)
const levels = [
  { value: 'BEGINNER', label: 'Debutant', icon: '🌱', description: 'Moins de 6 mois de pratique' },
  { value: 'INTERMEDIATE', label: 'Intermediaire', icon: '⚡', description: '6 mois a 2 ans de pratique' },
  { value: 'ADVANCED', label: 'Avance', icon: '🏆', description: 'Plus de 2 ans de pratique' },
]

// Step 3
const selectedDays = ref<number | null>(null)
const daysOptions = [2, 3, 4, 5, 6]

const suggestedProgram = computed(() => {
  const days = selectedDays.value
  if (!days || days <= 3) {
    return { name: 'Full Body 3j', slug: 'full-body-3j', description: 'Chaque muscle travaille 3x par semaine pour une progression optimale' }
  }
  if (days === 4) {
    return { name: 'Upper/Lower 4j', slug: 'upper-lower-4j', description: 'Alternance haut / bas du corps pour un bon equilibre volume-recuperation' }
  }
  return { name: 'PPL 6j', slug: 'ppl-6j', description: 'Push / Pull / Legs pour un maximum de volume par groupe musculaire' }
})

// Step 4
const adopting = ref(false)

const canProceed = computed(() => {
  if (currentStep.value === 1) return !!selectedGoal.value
  if (currentStep.value === 2) return !!selectedLevel.value
  if (currentStep.value === 3) return !!selectedDays.value
  return true
})

const nextStep = () => {
  if (!canProceed.value) return
  if (currentStep.value < totalSteps) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const saveGoalToProfile = async () => {
  try {
    await apiFetch('/users/me', {
      method: 'PUT',
      body: {
        goal: selectedGoal.value,
        level: selectedLevel.value,
        daysPerWeek: selectedDays.value,
      },
    })
  } catch (err: any) {
    logger.error('Failed to save profile:', err)
  }
}

const handleAdoptProgram = async () => {
  if (adopting.value) return
  adopting.value = true

  try {
    await saveGoalToProfile()

    // Try to find and adopt the matching program
    const programs = await getPrograms()
    const match = programs.find(p => p.slug === suggestedProgram.value.slug)

    if (match) {
      const result = await adoptProgram(match.slug)
      toast.success(
        'Programme adopte !',
        `${result.workoutIds.length} templates crees pour "${match.name}"`
      )
    } else {
      // If no exact slug match, just save profile and redirect
      toast.success('Profil enregistre !', 'Tu peux maintenant explorer les programmes')
    }

    navigateTo('/dashboard')
  } catch (err: any) {
    toast.error('Erreur', err?.data?.error || 'Impossible d\'adopter le programme')
  } finally {
    adopting.value = false
  }
}

const handleSkip = async () => {
  await saveGoalToProfile()
  navigateTo('/dashboard')
}

definePageMeta({
  middleware: 'auth',
})
</script>
