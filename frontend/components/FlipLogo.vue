<template>
  <div class="relative flex-shrink-0" style="width: 3.5rem; height: 2.75rem">
    <!-- Carte arriere : l'autre espace, en biais et attenuee, vient devant au clic -->
    <button
      type="button"
      class="absolute inset-0"
      :class="flipping ? 'flip-logo-active' : 'flip-logo-idle'"
      @click="handleFlip"
      :aria-label="switchLabel"
      :title="switchLabel"
    >
      <img :src="otherLogoSrc" alt="" class="h-10 w-auto pointer-events-none select-none" />
    </button>

    <!-- Carte avant : espace courant, lien normal -->
    <NuxtLink
      :to="currentHome"
      class="absolute inset-0 block"
      :class="flipping ? 'flip-logo-fading' : 'flip-logo-front'"
      :aria-label="currentLabel"
    >
      <img :src="currentLogoSrc" :alt="currentLabel" class="h-10 w-auto" />
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const { t } = useLocale();
const { isRose } = useTheme();

const isCoachSection = computed(() => route.path.startsWith('/coaching'));

const athleteLogoSrc = computed(() =>
  isRose.value ? '/athletiq-icon-rose.svg' : '/athletiq-icon.svg'
);
const coachLogoSrc = '/coach-athletiq-icon.svg';

const currentLogoSrc = computed(() => (isCoachSection.value ? coachLogoSrc : athleteLogoSrc.value));
const otherLogoSrc = computed(() => (isCoachSection.value ? athleteLogoSrc.value : coachLogoSrc));

const currentHome = computed(() => (isCoachSection.value ? '/coaching' : '/dashboard'));
const currentLabel = computed(() => (isCoachSection.value ? 'Coach Athletiq' : 'Athletiq'));
const switchLabel = computed(() =>
  isCoachSection.value ? t('nav.switchToAthlete') : t('nav.switchToCoach')
);

const flipping = ref(false);

const handleFlip = () => {
  if (flipping.value) return;
  flipping.value = true;
  setTimeout(() => {
    navigateTo(isCoachSection.value ? '/dashboard' : '/coaching');
    // Laisse le temps a la nouvelle route de s'appliquer avant de reinitialiser
    setTimeout(() => (flipping.value = false), 50);
  }, 360);
};
</script>

<style scoped>
.flip-logo-idle {
  transform: rotate(0deg) translate(15px, -12px) scale(0.6);
  opacity: 0.3;
  z-index: 20;
  transition:
    transform 0.36s cubic-bezier(0.34, 1.56, 0.64, 1),
    opacity 0.36s ease;
}
.flip-logo-active {
  transform: rotate(0deg) translate(0, 0) scale(1);
  opacity: 1;
  z-index: 20;
  transition:
    transform 0.36s cubic-bezier(0.34, 1.56, 0.64, 1),
    opacity 0.36s ease;
}
.flip-logo-front {
  transform: rotate(0deg) translate(0, 0) scale(1);
  opacity: 1;
  z-index: 10;
  transition:
    transform 0.36s ease,
    opacity 0.36s ease;
}
.flip-logo-fading {
  transform: rotate(9deg) translate(5px, 3px) scale(0.82);
  opacity: 0;
  z-index: 5;
  pointer-events: none;
  transition:
    transform 0.36s ease,
    opacity 0.36s ease;
}
</style>
