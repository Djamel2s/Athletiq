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
      <!-- Back button -->
      <button
        @click="navigateTo('/dashboard')"
        class="inline-flex items-center gap-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100 transition-colors mb-6"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Retour au dashboard
      </button>

      <!-- Page Header -->
      <div class="fade-in text-center mb-10">
        <h1 class="text-3xl md:text-5xl lg:text-6xl font-bold text-display bg-gradient-to-r from-sand-500 to-primary-900 dark:to-primary-100 bg-clip-text text-transparent mb-3">
          Programmes
        </h1>
        <p class="text-lg text-primary-600 dark:text-primary-400 max-w-2xl mx-auto">
          Adoptez un programme complet et recevez tous vos templates en un clic
        </p>
      </div>

      <!-- Loading Skeleton -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          v-for="i in 4"
          :key="i"
          class="rounded-2xl border border-primary-200/60 dark:border-primary-700/60 bg-white/70 dark:bg-primary-800/70 backdrop-blur-sm overflow-hidden animate-pulse"
        >
          <div class="h-1.5 bg-primary-200 dark:bg-primary-700"></div>
          <div class="p-6">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-12 h-12 rounded-xl bg-primary-200 dark:bg-primary-700"></div>
              <div class="flex-1">
                <div class="h-5 w-3/4 rounded bg-primary-200 dark:bg-primary-700 mb-2"></div>
                <div class="h-3 w-1/2 rounded bg-primary-100 dark:bg-primary-700/60"></div>
              </div>
            </div>
            <div class="h-4 w-full rounded bg-primary-100 dark:bg-primary-700/60 mb-2"></div>
            <div class="h-4 w-2/3 rounded bg-primary-100 dark:bg-primary-700/60 mb-5"></div>
            <div class="flex gap-2 mb-4">
              <div class="h-6 w-20 rounded-full bg-primary-100 dark:bg-primary-700/60"></div>
              <div class="h-6 w-20 rounded-full bg-primary-100 dark:bg-primary-700/60"></div>
            </div>
            <div class="flex gap-4">
              <div class="h-4 w-16 rounded bg-primary-100 dark:bg-primary-700/60"></div>
              <div class="h-4 w-20 rounded bg-primary-100 dark:bg-primary-700/60"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="card-glass border-l-4 border-red-500 bg-red-50 dark:bg-red-900/30 text-center py-12">
        <svg class="w-16 h-16 mx-auto mb-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <p class="text-red-700 dark:text-red-400 mb-4">{{ error }}</p>
        <button @click="loadPrograms" class="btn-outline">Reessayer</button>
      </div>

      <!-- Programs Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 slide-up">
        <div
          v-for="program in programs"
          :key="program.id"
          class="group relative rounded-2xl border border-primary-200/60 dark:border-primary-700/60 bg-white/70 dark:bg-primary-800/70 backdrop-blur-sm hover:border-sand-500/50 dark:hover:border-sand-600/40 hover:shadow-xl transition-all cursor-pointer overflow-hidden"
          @click="toggleDetail(program.slug)"
        >
          <!-- Accent top bar -->
          <div class="h-1.5 bg-gradient-primary"></div>

          <div class="p-6">
            <!-- Header: icon + name -->
            <div class="flex items-start gap-3 mb-4">
              <div class="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center flex-shrink-0 text-2xl">
                {{ program.icon || '🏋️' }}
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-lg font-bold text-primary-900 dark:text-primary-100 group-hover:text-sand-700 dark:group-hover:text-sand-400 transition-colors leading-tight">
                  {{ program.name }}
                </h3>
                <div class="flex items-center gap-1.5 mt-1 text-xs text-primary-500 dark:text-primary-400">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {{ program.popularity }} adoption{{ program.popularity !== 1 ? 's' : '' }}
                </div>
              </div>
            </div>

            <!-- Description -->
            <p class="text-sm text-primary-600 dark:text-primary-400 mb-4 line-clamp-2">
              {{ program.description }}
            </p>

            <!-- Badges -->
            <div class="flex flex-wrap gap-2 mb-4">
              <span :class="difficultyBadgeClass(program.difficulty)">
                {{ difficultyLabel(program.difficulty) }}
              </span>
              <span class="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 dark:bg-blue-400/10 text-blue-700 dark:text-blue-400">
                {{ goalLabel(program.goal) }}
              </span>
            </div>

            <!-- Meta info -->
            <div class="flex items-center gap-4 text-xs text-primary-500 dark:text-primary-400">
              <span class="inline-flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {{ program.daysPerWeek }}j / semaine
              </span>
              <span class="inline-flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ program.durationWeeks }} semaines
              </span>
              <span class="inline-flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {{ program.days.length }} jours
              </span>
            </div>

            <!-- Expand indicator -->
            <div class="mt-4 pt-3 border-t border-primary-100 dark:border-primary-700/60 flex items-center justify-center gap-1.5 text-xs font-medium text-primary-400 dark:text-primary-500">
              <span>{{ expandedSlug === program.slug ? 'Masquer le detail' : 'Voir le detail' }}</span>
              <svg
                :class="['w-3.5 h-3.5 transition-transform duration-300', expandedSlug === program.slug ? 'rotate-180' : '']"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <!-- Expanded detail -->
          <Transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="max-h-0 opacity-0"
            enter-to-class="max-h-[2000px] opacity-100"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="max-h-[2000px] opacity-100"
            leave-to-class="max-h-0 opacity-0"
          >
            <div v-if="expandedSlug === program.slug" class="overflow-hidden border-t border-primary-100 dark:border-primary-700/60">
              <div class="p-6 pt-5 space-y-4">
                <!-- Days list -->
                <div
                  v-for="day in sortedDays(program.days)"
                  :key="day.id"
                  class="rounded-xl bg-primary-50/80 dark:bg-primary-900/50 p-4"
                >
                  <div class="flex items-center gap-2 mb-3">
                    <span class="w-7 h-7 rounded-lg bg-gradient-primary text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                      J{{ day.dayIndex + 1 }}
                    </span>
                    <h4 class="font-semibold text-sm text-primary-900 dark:text-primary-100">
                      {{ day.name }}
                    </h4>
                  </div>

                  <div class="space-y-1.5">
                    <div
                      v-for="(exercise, idx) in day.exercises"
                      :key="idx"
                      class="flex items-center justify-between text-xs py-1.5 px-2 rounded-lg hover:bg-white/60 dark:hover:bg-primary-800/60 transition-colors"
                    >
                      <span class="text-primary-800 dark:text-primary-200 font-medium flex-1 min-w-0 truncate mr-2">
                        {{ exercise.exerciseName }}
                      </span>
                      <div class="flex items-center gap-3 flex-shrink-0 text-primary-500 dark:text-primary-400">
                        <span>{{ exercise.sets }} x {{ exercise.reps }}</span>
                        <span class="text-primary-400 dark:text-primary-500">{{ formatRest(exercise.restSeconds) }}</span>
                      </div>
                    </div>
                  </div>

                  <p v-if="day.description" class="mt-2 text-xs text-primary-500 dark:text-primary-400 italic">
                    {{ day.description }}
                  </p>
                </div>

                <!-- Adopt button -->
                <button
                  @click.stop="handleAdopt(program)"
                  :disabled="adoptingSlug === program.slug"
                  class="btn-primary w-full py-3.5 text-base font-semibold disabled:opacity-60"
                >
                  <span v-if="adoptingSlug === program.slug" class="inline-flex items-center gap-2">
                    <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adoption en cours...
                  </span>
                  <span v-else class="inline-flex items-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Adopter ce programme
                  </span>
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="!loading && !error && programs.length === 0" class="card-glass text-center py-16">
        <svg class="w-20 h-20 mx-auto mb-6 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <p class="text-xl text-primary-600 dark:text-primary-400">Aucun programme disponible</p>
      </div>
    </div>

    <MobileBottomNav active-path="/programs" />
  </div>
</template>

<script setup lang="ts">
import { useProgramApi, type WorkoutProgram, type ProgramDay } from '~/composables/useProgramApi'

useHead({ meta: [{ name: 'robots', content: 'noindex, nofollow' }] })

const { getPrograms, adoptProgram } = useProgramApi()
const toast = useToast()

const programs = ref<WorkoutProgram[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const expandedSlug = ref<string | null>(null)
const adoptingSlug = ref<string | null>(null)

const loadPrograms = async () => {
  loading.value = true
  error.value = null
  try {
    programs.value = await getPrograms()
  } catch (err: any) {
    error.value = err?.data?.error || 'Impossible de charger les programmes'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadPrograms()
})

const toggleDetail = (slug: string) => {
  expandedSlug.value = expandedSlug.value === slug ? null : slug
}

const sortedDays = (days: ProgramDay[]) => {
  return [...days].sort((a, b) => a.dayIndex - b.dayIndex)
}

const handleAdopt = async (program: WorkoutProgram) => {
  if (adoptingSlug.value) return
  adoptingSlug.value = program.slug
  try {
    const result = await adoptProgram(program.slug)
    toast.success(
      'Programme adopte !',
      `${result.workoutIds.length} templates crees pour "${program.name}"`
    )
    // Refresh to update popularity count
    await loadPrograms()
  } catch (err: any) {
    toast.error(
      'Erreur',
      err?.data?.error || 'Impossible d\'adopter ce programme'
    )
  } finally {
    adoptingSlug.value = null
  }
}

const formatRest = (seconds: number) => {
  if (seconds >= 60) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return secs > 0 ? `${mins}m${secs}s` : `${mins}min`
  }
  return `${seconds}s`
}

const difficultyLabel = (difficulty: string) => {
  const labels: Record<string, string> = {
    BEGINNER: 'Debutant',
    INTERMEDIATE: 'Intermediaire',
    ADVANCED: 'Avance'
  }
  return labels[difficulty] || difficulty
}

const difficultyBadgeClass = (difficulty: string) => {
  const base = 'inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full'
  const colors: Record<string, string> = {
    BEGINNER: 'bg-green-500/10 dark:bg-green-400/10 text-green-700 dark:text-green-400',
    INTERMEDIATE: 'bg-yellow-500/10 dark:bg-yellow-400/10 text-yellow-700 dark:text-yellow-400',
    ADVANCED: 'bg-red-500/10 dark:bg-red-400/10 text-red-700 dark:text-red-400'
  }
  return `${base} ${colors[difficulty] || colors.INTERMEDIATE}`
}

const goalLabel = (goal: string) => {
  const labels: Record<string, string> = {
    STRENGTH: 'Force',
    HYPERTROPHY: 'Hypertrophie',
    ENDURANCE: 'Endurance',
    GENERAL: 'General'
  }
  return labels[goal] || goal
}

definePageMeta({
  middleware: 'auth'
})
</script>
