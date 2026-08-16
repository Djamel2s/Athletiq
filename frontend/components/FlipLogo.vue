<template>
  <div class="relative flex-shrink-0" style="width: 3.5rem; height: 2.75rem">
    <!-- Carte arriere : l'autre espace, en biais et attenuee, vient devant au clic -->
    <button
      type="button"
      class="absolute inset-0"
      :class="[
        flipping ? 'flip-logo-active' : 'flip-logo-idle',
        resetting ? 'no-logo-transition' : '',
      ]"
      @click="handleFlip"
      :aria-label="switchLabel"
      :title="switchLabel"
    >
      <img
        :src="flipping ? animatingOtherLogo : otherLogoSrc"
        alt=""
        class="h-10 w-auto pointer-events-none select-none"
      />
    </button>

    <!-- Carte avant : espace courant, lien normal -->
    <NuxtLink
      :to="currentHome"
      class="absolute inset-0 block"
      :class="[
        flipping ? 'flip-logo-fading' : 'flip-logo-front',
        resetting ? 'no-logo-transition' : '',
      ]"
      :aria-label="currentLabel"
    >
      <img
        :src="flipping ? animatingCurrentLogo : currentLogoSrc"
        :alt="currentLabel"
        class="h-10 w-auto"
      />
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const { t } = useLocale();
const { isRose } = useTheme();

const isCoachSection = computed(() => route.path.startsWith('/coaching'));
const isLanding = computed(() => route.path === '/');

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
const resetting = ref(false);

const animatingCurrentLogo = ref('');
const animatingOtherLogo = ref('');

const handleFlip = () => {
  if (flipping.value) return;
  // On mémorise les logos AVANT le changement de route
  animatingCurrentLogo.value = currentLogoSrc.value;
  animatingOtherLogo.value = otherLogoSrc.value;
  flipping.value = true;
  if (isLanding.value) {
    setTimeout(() => {
      resetting.value = true;
      flipping.value = false;
      requestAnimationFrame(() => {
        resetting.value = false;
      });
    }, 300);
    return;
  }
  setTimeout(async () => {
    await navigateTo(isCoachSection.value ? '/dashboard' : '/coaching');
    // On remet l'état normal SANS jouer l'animation inverse
    resetting.value = true;
    flipping.value = false;
    requestAnimationFrame(() => {
      resetting.value = false;
    });
  }, 300);
};
</script>

<style scoped>
.flip-logo-idle {
  transform: rotate(0deg) translate(15px, -12px) scale(0.5);
  opacity: 0.3;
  z-index: 20;
  transition:
    transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
    opacity 0.3s ease;
}

.flip-logo-active {
  transform: rotate(0deg) translate(0, 0) scale(1);
  opacity: 1;
  z-index: 20;
  transition:
    transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
    opacity 0.3s ease;
}

.flip-logo-front {
  transform: rotate(0deg) translate(0, 0) scale(1);
  opacity: 1;
  z-index: 10;
  transition:
    transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
    opacity 0.3s ease;
}

.flip-logo-fading {
  transform: rotate(0deg) translate(15px, -12px) scale(0.5);
  opacity: 0.3;
  z-index: 5;
  pointer-events: none;
  transition:
    transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
    opacity 0.3s ease;
}
.no-logo-transition {
  transition: none !important;
}
</style>
