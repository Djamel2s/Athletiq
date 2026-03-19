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

    <!-- Contenu principal -->
    <div class="pt-24 md:pt-32 px-4 md:px-6 pb-28 lg:pb-20 max-w-7xl mx-auto">
      <!-- Page Header -->
      <div class="fade-in text-center mb-8">
        <h1 class="text-3xl md:text-5xl lg:text-6xl font-bold text-display bg-gradient-to-r from-sand-500 to-primary-900 dark:to-primary-100 bg-clip-text text-transparent mb-2">Mes Entraînements</h1>
        <p class="text-lg text-primary-600 dark:text-primary-400">Gérez et lancez vos workouts</p>
      </div>

      <!-- Créer -->
      <div class="flex items-center justify-between mb-6 fade-in">
        <div>
          <div v-if="!isPremium" class="text-xs text-primary-500 dark:text-primary-400">
            Templates : {{ templateUsageText }}
          </div>
        </div>
        <button @click="handleCreateWorkout" :disabled="!canCreateTemplate && !isPremium" class="btn-primary text-sm md:text-base disabled:opacity-50">
          <span class="hidden md:inline">+ Créer un workout</span>
          <span class="md:hidden">+ Créer</span>
        </button>
      </div>

      <!-- Tabs -->
      <div class="mb-8 slide-up">
        <div class="flex justify-center">
          <div class="flex space-x-1 bg-white/60 dark:bg-primary-800/60 backdrop-blur-lg rounded-xl p-1">
            <button
              @click="activeTab = 'workouts'"
              :class="[
                'px-4 md:px-6 py-2 md:py-2.5 rounded-lg text-sm md:text-base font-semibold transition-all',
                activeTab === 'workouts'
                  ? 'bg-gradient-primary text-white shadow-sm'
                  : 'text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100'
              ]"
            >
              Mes workouts
            </button>
            <button
              @click="activeTab = 'history'"
              :class="[
                'px-4 md:px-6 py-2 md:py-2.5 rounded-lg text-sm md:text-base font-semibold transition-all',
                activeTab === 'history'
                  ? 'bg-gradient-primary text-white shadow-sm'
                  : 'text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100'
              ]"
            >
              Historique
            </button>
          </div>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="workoutStore.isLoading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-200 dark:border-primary-700 border-t-primary-600 dark:border-t-primary-400"></div>
        <p class="mt-4 text-primary-600 dark:text-primary-400">Chargement...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="workoutStore.error" class="card-glass border-l-4 border-red-500 bg-red-50 dark:bg-red-900/30">
        <p class="text-red-700 dark:text-red-400">{{ workoutStore.error }}</p>
        <button @click="loadWorkouts" class="btn-outline mt-4">Réessayer</button>
      </div>

      <!-- Upgrade banner templates -->
      <div v-if="!isPremium && !canCreateTemplate && activeTab === 'workouts'" class="mb-6">
        <ProWall
          title="Templates illimites"
          :message="`Vous avez ${templateUsageText} templates. Debloquez Pro pour creer tous les programmes que vous voulez.`"
          icon="template"
          compact
        />
      </div>

      <!-- Mes workouts -->
      <div v-if="!workoutStore.isLoading && !workoutStore.error && activeTab === 'workouts'" class="slide-up">
        <div v-if="workoutStore.templates.length === 0" class="card-glass text-center py-16">
          <svg class="w-20 h-20 mx-auto mb-6 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
          <p class="text-xl text-primary-600 dark:text-primary-400 mb-6">Aucun workout créé</p>
          <button @click="navigateTo('/workouts/builder')" class="btn-primary px-8 py-4">
            Créer mon premier workout
          </button>
        </div>

        <!-- Grid de cartes -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          <div
            v-for="workout in workoutStore.templates"
            :key="workout.id"
            class="group relative rounded-2xl border border-primary-200/60 dark:border-primary-700/60 bg-white/70 dark:bg-primary-800/70 backdrop-blur-sm hover:border-sand-500/50 dark:hover:border-sand-600/40 hover:shadow-xl transition-all cursor-pointer overflow-hidden"
            @click="editWorkout(workout.id)"
          >
            <!-- Accent top bar -->
            <div class="h-1 bg-gradient-primary"></div>
            <div class="p-5">
              <div class="flex items-start justify-between mb-3">
                <h3 class="text-lg font-bold text-primary-900 dark:text-primary-100 group-hover:text-sand-700 dark:group-hover:text-sand-400 transition-colors leading-tight flex-1 mr-2">
                  {{ workout.name }}
                </h3>
                <div class="flex items-center gap-1 flex-shrink-0">
                  <button
                    @click.stop="editWorkout(workout.id)"
                    class="w-8 h-8 flex items-center justify-center rounded-lg text-primary-400 hover:text-primary-700 dark:hover:text-primary-200 hover:bg-primary-100 dark:hover:bg-primary-700 transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>
                  <button
                    @click.stop="shareTemplate(workout.id)"
                    :disabled="sharingId === workout.id"
                    class="w-8 h-8 flex items-center justify-center rounded-lg text-primary-400 hover:text-sand-600 dark:hover:text-sand-400 hover:bg-sand-500/10 transition-colors disabled:opacity-50"
                    title="Partager"
                  >
                    <Icon name="lucide:share-2" class="w-4 h-4" />
                  </button>
                  <button
                    @click.stop="deleteTemplate(workout.id)"
                    :disabled="deletingId === workout.id"
                    class="w-8 h-8 flex items-center justify-center rounded-lg text-primary-300 dark:text-primary-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </div>

              <p v-if="workout.description" class="text-sm text-primary-500 dark:text-primary-400 mb-4 line-clamp-2">
                {{ workout.description }}
              </p>

              <div class="flex items-center gap-2">
                <span class="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-sand-500/10 dark:bg-sand-600/10 text-sand-700 dark:text-sand-400">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                  {{ workout.exercises?.length || 0 }} exercice{{ (workout.exercises?.length || 0) > 1 ? 's' : '' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Historique -->
      <div v-if="!workoutStore.isLoading && !workoutStore.error && activeTab === 'history'" class="space-y-6 slide-up">
        <div v-if="workoutStore.workoutHistory.length === 0" class="card-glass text-center py-16">
          <svg class="w-20 h-20 mx-auto mb-6 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p class="text-xl text-primary-600 dark:text-primary-400 mb-6">Aucun entraînement terminé</p>
          <button @click="navigateTo('/workouts/builder')" class="btn-primary px-8 py-4">
            Créer mon premier workout
          </button>
        </div>

        <div
          v-for="workout in workoutStore.workoutHistory"
          :key="workout.id"
          class="group rounded-2xl border border-primary-200/60 dark:border-primary-700/60 bg-white/70 dark:bg-primary-800/70 backdrop-blur-sm hover:border-sand-500/50 dark:hover:border-sand-600/40 hover:shadow-lg transition-all cursor-pointer overflow-hidden"
          @click="viewWorkout(workout.id)"
        >
          <div class="p-4 md:p-5">
            <div class="flex items-start gap-3 md:gap-4">
              <!-- Date badge -->
              <div class="flex-shrink-0 w-14 h-14 rounded-xl bg-primary-50 dark:bg-primary-800 border border-primary-200/60 dark:border-primary-700/60 flex flex-col items-center justify-center text-center">
                <span class="text-xs font-medium text-primary-500 dark:text-primary-400 uppercase leading-none">{{ getMonthShort(workout.completedAt!) }}</span>
                <span class="text-lg font-bold text-primary-900 dark:text-primary-100 leading-none mt-0.5">{{ getDay(workout.completedAt!) }}</span>
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <h3 class="text-base md:text-lg font-bold text-primary-900 dark:text-primary-100 group-hover:text-sand-700 dark:group-hover:text-sand-400 transition-colors truncate">
                  {{ workout.name }}
                </h3>
                <div class="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
                  <span v-if="workout.duration" class="inline-flex items-center gap-1 text-xs text-primary-500 dark:text-primary-400">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    {{ formatDuration(workout.duration) }}
                  </span>
                  <span v-if="workout.exercises?.length" class="inline-flex items-center gap-1 text-xs text-primary-500 dark:text-primary-400">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                    {{ workout.exercises.length }} exercices
                  </span>
                  <span v-if="workout.duration" class="inline-flex items-center gap-1 text-xs font-semibold text-sand-600 dark:text-sand-400">
                    ~{{ Math.round((workout.duration / 60) * 6) }} kcal
                  </span>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex items-center gap-1.5 flex-shrink-0">
                <button
                  @click.stop="startFromHistory(workout)"
                  class="px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-primary text-white hover:shadow-md transition-all"
                >
                  Refaire
                </button>
                <button
                  @click.stop="deleteFromHistory(workout.id)"
                  :disabled="deletingId === workout.id"
                  class="w-8 h-8 flex items-center justify-center rounded-lg text-primary-300 dark:text-primary-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <MobileBottomNav active-path="/workouts" />

    <!-- Modal confirmer suppression -->
    <Teleport to="body">
      <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center px-6" @click.self="showDeleteModal = false">
        <div class="fixed inset-0 bg-black/40 backdrop-blur-sm"></div>
        <div class="relative bg-white dark:bg-primary-900 rounded-3xl p-8 max-w-sm w-full shadow-2xl">
          <div class="text-center">
            <div class="w-14 h-14 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-primary-900 dark:text-primary-100 mb-2">{{ deleteModalTitle }}</h3>
            <p class="text-primary-600 dark:text-primary-400 text-sm mb-6">Cette action est irréversible.</p>
            <div class="space-y-3">
              <button @click="executeDelete" :disabled="!!deletingId" class="w-full py-3 rounded-2xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors disabled:opacity-50">
                {{ deletingId ? 'Suppression...' : 'Supprimer' }}
              </button>
              <button @click="showDeleteModal = false; pendingDeleteId = null" class="w-full py-3 rounded-2xl bg-primary-100 dark:bg-primary-800 text-primary-800 dark:text-primary-200 font-medium hover:bg-primary-200 dark:hover:bg-primary-700 transition-colors">
                Annuler
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { useWorkoutStore } from '~/stores/workout'
import { useAuthStore } from '~/stores/auth'
import { useSubscriptionStore } from '~/stores/subscription'
import { useSubscriptionLimits } from '~/composables/useSubscriptionLimits'
import type { Workout } from '~/types/workout'

useHead({ meta: [{ name: 'robots', content: 'noindex, nofollow' }] })

const workoutStore = useWorkoutStore()
const authStore = useAuthStore()
const subscriptionStore = useSubscriptionStore()
const { isPremium, canCreateTemplate, templateUsageText, fetchUsage } = useSubscriptionLimits()
const toast = useToast()
const deletingId = ref<number | null>(null)

const activeTab = ref<'workouts' | 'history'>('workouts')

onMounted(async () => {
  loadWorkouts()
  await subscriptionStore.fetchSubscription()
  await fetchUsage()
})

const loadWorkouts = async () => {
  await workoutStore.fetchWorkouts()
}

const handleCreateWorkout = () => {
  if (!canCreateTemplate.value) {
    toast.error('Limite atteinte', 'Passez Pro pour créer plus de templates')
    return
  }
  navigateTo('/workouts/builder')
}

const viewWorkout = (id: number) => {
  navigateTo(`/workouts/${id}`)
}

const startFromHistory = async (workout: Workout) => {
  try {
    // Create a new workout based on the historical one
    const newWorkout = await workoutStore.createWorkout({
      name: workout.name,
      description: workout.description,
      isTemplate: false
    })

    // Copy exercises from the historical workout
    if (workout.exercises) {
      for (const exercise of workout.exercises) {
        await workoutStore.addExerciseToWorkout(newWorkout.id, {
          exerciseLibraryId: exercise.exerciseLibraryId!,
          name: exercise.name,
          notes: exercise.notes,
          targetSets: exercise.targetSets,
          targetReps: exercise.targetReps,
          targetWeight: exercise.targetWeight,
          restTime: exercise.restTime,
          plannedSets: exercise.plannedSets,
          orderIndex: exercise.orderIndex
        })
      }
    }

    // Start and navigate to the new workout
    await workoutStore.startWorkout(newWorkout.id)
    navigateTo(`/workouts/${newWorkout.id}/live`)
  } catch (error) {
    logger.error('Failed to create workout from history:', error)
  }
}

const editWorkout = (id: number) => {
  navigateTo(`/workouts/${id}/edit`)
}

// ── Share Template ──
const sharingId = ref<number | null>(null)

const shareTemplate = async (id: number) => {
  if (sharingId.value) return
  sharingId.value = id
  try {
    const { shareToken } = await apiFetch<{ shareToken: string }>(`/share/${id}`, { method: 'POST' })
    const shareUrl = `${window.location.origin}/shared/${shareToken}`

    if (navigator.share) {
      await navigator.share({
        title: 'Mon programme Athletiq',
        text: 'Regarde mon programme d\'entraînement sur Athletiq !',
        url: shareUrl
      })
    } else {
      await navigator.clipboard.writeText(shareUrl)
      toast.success('Lien copié !', 'Le lien de partage est dans ton presse-papier')
    }
  } catch (err: any) {
    if (err?.name === 'AbortError') return // user cancelled share dialog
    toast.error('Erreur', 'Impossible de partager ce template')
  } finally {
    sharingId.value = null
  }
}

const showDeleteModal = ref(false)
const pendingDeleteId = ref<number | null>(null)
const pendingDeleteType = ref<'template' | 'history'>('template')

const deleteModalTitle = computed(() =>
  pendingDeleteType.value === 'template'
    ? 'Supprimer ce template ?'
    : 'Supprimer cet entraînement ?'
)

const deleteTemplate = (id: number) => {
  pendingDeleteId.value = id
  pendingDeleteType.value = 'template'
  showDeleteModal.value = true
}

const deleteFromHistory = (id: number) => {
  pendingDeleteId.value = id
  pendingDeleteType.value = 'history'
  showDeleteModal.value = true
}

const executeDelete = async () => {
  if (!pendingDeleteId.value) return
  deletingId.value = pendingDeleteId.value
  try {
    await workoutStore.deleteWorkout(pendingDeleteId.value)
    const msg = pendingDeleteType.value === 'template' ? 'Template supprimé avec succès' : 'Entraînement supprimé de l\'historique'
    toast.success('Supprimé', msg)
  } catch (error) {
    logger.error('Failed to delete:', error)
    const errMsg = pendingDeleteType.value === 'template' ? 'Impossible de supprimer le template' : 'Impossible de supprimer l\'entraînement'
    toast.error('Erreur', errMsg)
  } finally {
    deletingId.value = null
    pendingDeleteId.value = null
    showDeleteModal.value = false
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const getMonthShort = (dateString: string) => {
  return new Intl.DateTimeFormat('fr-FR', { month: 'short' }).format(new Date(dateString)).replace('.', '')
}

const getDay = (dateString: string) => {
  return new Date(dateString).getDate()
}

const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  if (hours > 0) {
    return `${hours}h ${minutes}min`
  }
  return `${minutes}min`
}

definePageMeta({
  middleware: 'auth'
})
</script>
