<template>
  <div class="min-h-screen flex items-center justify-center bg-primary-50 dark:bg-primary-900 px-4">
    <div class="text-center max-w-md">
      <!-- Icon -->
      <div
        class="w-24 h-24 bg-gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg"
      >
        <span class="text-4xl text-white font-bold">{{ error?.statusCode || '?' }}</span>
      </div>

      <!-- Title -->
      <h1 class="text-3xl md:text-4xl font-bold text-primary-900 dark:text-primary-100 mb-4">
        {{ title }}
      </h1>

      <!-- Description -->
      <p class="text-primary-600 dark:text-primary-400 text-lg mb-8">
        {{ description }}
      </p>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <button @click="handleError" class="btn-primary px-8 py-3 text-base">
          Retour à l'accueil
        </button>
        <button
          @click="goBack"
          class="px-8 py-3 text-base rounded-xl border border-primary-300 dark:border-primary-600 text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors"
        >
          Page précédente
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app';

const props = defineProps<{
  error: NuxtError;
}>();

const title = computed(() => {
  switch (props.error?.statusCode) {
    case 404:
      return 'Page introuvable';
    case 403:
      return 'Accès refusé';
    case 500:
      return 'Erreur serveur';
    default:
      return 'Oups, une erreur est survenue';
  }
});

const description = computed(() => {
  switch (props.error?.statusCode) {
    case 404:
      return "La page que vous cherchez n'existe pas ou a été déplacée.";
    case 403:
      return "Vous n'avez pas les permissions nécessaires pour accéder à cette page.";
    case 500:
      return "Quelque chose s'est mal passé de notre côté. Réessayez dans un instant.";
    default:
      return "Une erreur inattendue est survenue. Réessayez ou retournez à l'accueil.";
  }
});

const handleError = () => clearError({ redirect: '/dashboard' });
const goBack = () => {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    clearError({ redirect: '/dashboard' });
  }
};
</script>
