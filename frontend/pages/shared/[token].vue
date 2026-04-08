<template>
  <div class="min-h-screen">
    <!-- TopNav is rendered globally in app.vue -->

    <div class="px-4 md:px-6 pb-28 lg:pb-20 max-w-2xl mx-auto">
      <!-- Loading -->
      <div v-if="loading" class="space-y-4 animate-pulse">
        <div class="h-8 w-2/3 bg-primary-200 dark:bg-primary-700 rounded-lg"></div>
        <div class="h-4 w-1/2 bg-primary-100 dark:bg-primary-800 rounded"></div>
        <div class="space-y-3 mt-8">
          <div
            v-for="i in 5"
            :key="i"
            class="h-12 bg-primary-100 dark:bg-primary-800 rounded-xl"
          ></div>
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center py-16">
        <Icon name="lucide:link-2-off" class="w-16 h-16 mx-auto mb-4 text-primary-300" />
        <h2 class="text-xl font-bold text-primary-900 dark:text-primary-100 mb-2">Lien invalide</h2>
        <p class="text-primary-500 dark:text-primary-400 mb-6">{{ error }}</p>
        <NuxtLink to="/" class="btn-primary px-6 py-2.5">Retour à l'accueil</NuxtLink>
      </div>

      <!-- Template Content -->
      <div v-else-if="template" class="fade-in">
        <!-- Header -->
        <div class="mb-8">
          <div class="flex items-center gap-3 mb-2">
            <div
              v-if="template.sharedBy?.firstName"
              class="flex items-center gap-2 text-sm text-primary-500 dark:text-primary-400"
            >
              <Icon name="lucide:user" class="w-4 h-4" />
              <span>Partagé par {{ template.sharedBy.firstName }}</span>
            </div>
          </div>
          <h1 class="text-2xl md:text-3xl font-bold text-primary-900 dark:text-primary-100 mb-2">
            {{ template.name }}
          </h1>
          <p v-if="template.description" class="text-primary-600 dark:text-primary-400">
            {{ template.description }}
          </p>
          <div class="mt-3">
            <span
              class="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-sand-500/10 text-sand-700 dark:text-sand-400"
            >
              <Icon name="lucide:dumbbell" class="w-3.5 h-3.5" />
              {{ template.exercises.length }} exercice{{ template.exercises.length > 1 ? 's' : '' }}
            </span>
          </div>
        </div>

        <!-- Exercises List -->
        <div class="space-y-3 mb-8">
          <div
            v-for="(exercise, idx) in template.exercises"
            :key="idx"
            class="rounded-xl border border-primary-200/60 dark:border-primary-700/60 bg-white/70 dark:bg-primary-800/70 p-4"
          >
            <div class="flex items-center gap-3">
              <ExerciseAnimation
                v-if="exercise.exerciseLibrary?.imageUrl"
                :image-id="exercise.exerciseLibrary.imageUrl"
                :name="exercise.name"
                size="sm"
              />
              <div class="flex-1 min-w-0">
                <h3 class="font-semibold text-sm text-primary-900 dark:text-primary-100 truncate">
                  {{ exercise.name }}
                </h3>
                <div
                  class="flex items-center gap-3 mt-1 text-xs text-primary-500 dark:text-primary-400"
                >
                  <span v-if="exercise.targetSets">{{ exercise.targetSets }} séries</span>
                  <span v-if="exercise.targetReps">{{ exercise.targetReps }} reps</span>
                  <span v-if="exercise.targetWeight">{{ exercise.targetWeight }}kg</span>
                  <span v-if="exercise.restTime"
                    >{{ Math.floor(exercise.restTime / 60) }}min repos</span
                  >
                </div>
              </div>
            </div>
            <p v-if="exercise.notes" class="mt-2 text-xs text-primary-400 italic">
              {{ exercise.notes }}
            </p>
          </div>
        </div>

        <!-- Import Button -->
        <div v-if="authStore.isAuthenticated" class="sticky bottom-20 lg:bottom-6">
          <button
            @click="importTemplate"
            :disabled="importing"
            class="btn-primary w-full py-4 text-base font-semibold shadow-xl disabled:opacity-60"
          >
            <span v-if="importing" class="inline-flex items-center gap-2">
              <Icon name="lucide:loader-2" class="w-5 h-5 animate-spin" />
              Import en cours...
            </span>
            <span v-else class="inline-flex items-center gap-2">
              <Icon name="lucide:download" class="w-5 h-5" />
              Ajouter à mes templates
            </span>
          </button>
        </div>

        <!-- Not logged in CTA -->
        <div v-else class="sticky bottom-6">
          <NuxtLink
            to="/register"
            class="btn-primary w-full py-4 text-base font-semibold shadow-xl text-center block"
          >
            Créer un compte pour importer ce template
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/* TopNav imported and rendered globally in app.vue; per-page import removed */
import { useAuthStore } from '~/stores/auth';

definePageMeta({ layout: false });

useSeoMeta({
  title: 'Template partagé · Athletiq',
  description: "Découvrez ce programme d'entraînement partagé sur Athletiq",
});

const route = useRoute();
const authStore = useAuthStore();
const toast = useToast();
const config = useRuntimeConfig();

const token = route.params.token as string;

interface SharedExercise {
  name: string;
  orderIndex: number;
  targetSets?: number;
  targetReps?: number;
  targetWeight?: number;
  restTime?: number;
  notes?: string;
  exerciseLibrary?: {
    id: number;
    name: string;
    imageUrl?: string;
    primaryMuscle?: string;
    equipment?: string;
  } | null;
}

interface SharedTemplate {
  id: number;
  name: string;
  description?: string;
  notes?: string;
  sharedBy: { firstName?: string; avatarUrl?: string };
  exercises: SharedExercise[];
  createdAt: string;
}

const template = ref<SharedTemplate | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const importing = ref(false);

onMounted(async () => {
  // Init auth silently if possible
  if (process.client) {
    await authStore.initAuth();
  }

  try {
    template.value = await $fetch<SharedTemplate>(`${config.public.apiUrl}/share/view/${token}`);
  } catch (err: any) {
    error.value = err?.data?.error || "Ce template n'existe pas ou le partage a été désactivé";
  } finally {
    loading.value = false;
  }
});

const importTemplate = async () => {
  if (importing.value) return;
  importing.value = true;
  try {
    await $fetch(`${config.public.apiUrl}/share/import/${token}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    toast.success('Template importé !', 'Il a été ajouté à vos templates');
    navigateTo('/workouts');
  } catch (err: any) {
    const msg =
      err?.data?.code === 'LIMIT_TEMPLATES'
        ? 'Limite de templates atteinte. Passez Pro pour en créer plus.'
        : err?.data?.error || "Impossible d'importer ce template";
    toast.error('Erreur', msg);
  } finally {
    importing.value = false;
  }
};
</script>
