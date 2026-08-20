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
const { isCoachMode: appIsCoachMode } = useAppMode();

const isLanding = computed(() => route.path === '/' || route.path === '/coach-landing');
const isCoachLandingPage = computed(() => route.path === '/coach-landing');
const isCoachSection = computed(() =>
  isLanding.value ? isCoachLandingPage.value : appIsCoachMode.value
);

const athleteLogoSrc = computed(() =>
  isRose.value ? '/athletiq-icon-rose.svg' : '/athletiq-icon.svg'
);
const coachLogoSrc = '/coach-athletiq-icon.svg';

const currentLogoSrc = computed(() => (isCoachSection.value ? coachLogoSrc : athleteLogoSrc.value));
const otherLogoSrc = computed(() => (isCoachSection.value ? athleteLogoSrc.value : coachLogoSrc));

const currentHome = computed(() => {
  if (isLanding.value) return isCoachSection.value ? '/coach-landing' : '/';
  return isCoachSection.value ? '/coaching' : '/dashboard';
});
const currentLabel = computed(() => (isCoachSection.value ? 'Coach Athletiq' : 'Athletiq'));
const switchLabel = computed(() =>
  isCoachSection.value ? t('nav.switchToAthlete') : t('nav.switchToCoach')
);

const flipping = ref(false);
const resetting = ref(false);

const animatingCurrentLogo = ref('');
const animatingOtherLogo = ref('');

const handleFlip = async () => {
  if (flipping.value) return;

  // On mémorise les logos AVANT le changement de route
  animatingCurrentLogo.value = currentLogoSrc.value;
  animatingOtherLogo.value = otherLogoSrc.value;
  flipping.value = true;

  const target = isLanding.value
    ? isCoachSection.value
      ? '/'
      : '/coach-landing'
    : isCoachSection.value
      ? '/dashboard'
      : '/coaching';

  await new Promise((resolve) => setTimeout(resolve, 300));
  await navigateTo(target);
  await nextTick();

  resetting.value = true;
  flipping.value = false;
  await nextTick();
  requestAnimationFrame(() => {
    resetting.value = false;
  });
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
