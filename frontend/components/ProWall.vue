<template>
  <div class="pro-wall relative overflow-hidden rounded-2xl" :class="compact ? 'p-0' : ''">
    <!-- Blurred preview behind -->
    <div v-if="!compact" class="relative">
      <div class="blur-[6px] opacity-40 pointer-events-none select-none" aria-hidden="true">
        <slot name="preview">
          <div
            class="h-32 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-800 dark:to-primary-900 rounded-xl"
          ></div>
        </slot>
      </div>
    </div>

    <!-- Overlay card -->
    <div :class="compact ? '' : 'absolute inset-0 flex items-center justify-center'">
      <div class="pro-wall-card w-full" :class="compact ? '' : 'max-w-sm mx-4'">
        <!-- Animated gradient border -->
        <div class="relative rounded-2xl p-[1.5px] pro-wall-border-wrap">
          <div class="pro-wall-border-glow"></div>

          <div
            class="relative rounded-2xl bg-white/95 dark:bg-primary-900/95 backdrop-blur-xl p-5 md:p-6 overflow-hidden"
          >
            <!-- Floating particles -->
            <div class="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
              <div class="pro-particle pro-particle-1"></div>
              <div class="pro-particle pro-particle-2"></div>
              <div class="pro-particle pro-particle-3"></div>
            </div>

            <div class="relative z-10">
              <!-- Icon -->
              <div class="flex justify-center mb-4">
                <div class="relative">
                  <div
                    class="w-14 h-14 rounded-2xl bg-gradient-to-br from-sand-500 to-sand-700 flex items-center justify-center pro-wall-icon"
                  >
                    <svg
                      v-if="icon === 'camera'"
                      class="w-7 h-7 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <svg
                      v-else-if="icon === 'dumbbell'"
                      class="w-7 h-7 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M3 12h1m16 0h1M5.5 8.5v7M18.5 8.5v7M7 10v4a1 1 0 001 1h8a1 1 0 001-1v-4a1 1 0 00-1-1H8a1 1 0 00-1 1z"
                      />
                    </svg>
                    <svg
                      v-else-if="icon === 'target'"
                      class="w-7 h-7 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    <svg
                      v-else-if="icon === 'template'"
                      class="w-7 h-7 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                      />
                    </svg>
                    <svg
                      v-else
                      class="w-7 h-7 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <!-- Pulse ring -->
                  <div
                    class="absolute inset-0 rounded-2xl bg-sand-500/20 animate-ping"
                    style="animation-duration: 3s"
                  ></div>
                </div>
              </div>

              <!-- Text -->
              <div class="text-center mb-5">
                <h4 class="text-base font-bold text-primary-900 dark:text-primary-100 mb-1.5">
                  {{ title }}
                </h4>
                <p class="text-sm text-primary-500 dark:text-primary-400 leading-relaxed">
                  {{ message }}
                </p>
              </div>

              <!-- Price teaser -->
              <div class="flex items-center justify-center gap-3 mb-5">
                <div
                  class="flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary-50 dark:bg-primary-800/60"
                >
                  <span class="text-xs text-primary-500 dark:text-primary-400">{{
                    t('proWall.startingAt')
                  }}</span>
                  <span class="text-sm font-bold text-primary-900 dark:text-primary-100"
                    >4,16€</span
                  >
                  <span class="text-xs text-primary-500 dark:text-primary-400">{{
                    t('subscription.perMonth')
                  }}</span>
                </div>
              </div>

              <!-- CTA — Slide to unlock style -->
              <NuxtLink to="/subscription" class="block">
                <div
                  class="pro-wall-cta relative h-12 rounded-xl overflow-hidden cursor-pointer group"
                  @mouseenter="ctaHover = true"
                  @mouseleave="ctaHover = false"
                >
                  <!-- Background -->
                  <div
                    class="absolute inset-0 bg-gradient-to-r from-sand-500 via-sand-600 to-sand-700 transition-all duration-500"
                    :class="ctaHover ? 'opacity-100' : 'opacity-90'"
                  ></div>

                  <!-- Shimmer -->
                  <div class="absolute inset-0 pro-wall-shimmer"></div>

                  <!-- Content -->
                  <div
                    class="relative z-10 h-full flex items-center justify-center gap-2 transition-transform duration-300"
                    :class="ctaHover ? 'scale-[1.02]' : ''"
                  >
                    <span class="text-white font-semibold text-sm tracking-wide">{{
                      t('proWall.unlockPro')
                    }}</span>
                    <svg
                      class="w-4 h-4 text-white/80 transition-transform duration-300"
                      :class="ctaHover ? 'translate-x-1' : ''"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </div>
                </div>
              </NuxtLink>

              <!-- Subtle label -->
              <p class="text-center text-[10px] text-primary-400 dark:text-primary-500 mt-3">
                14 jours d'essai gratuit inclus
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useLocale();
defineProps<{
  title?: string;
  message?: string;
  icon?: 'camera' | 'dumbbell' | 'target' | 'template' | 'lock';
  compact?: boolean;
}>();

const ctaHover = ref(false);
</script>

<style scoped>
.pro-wall-border-wrap {
  position: relative;
  background: linear-gradient(
    135deg,
    rgb(var(--sand-500)) 0%,
    rgb(var(--sand-700)) 25%,
    rgba(var(--sand-500), 0.3) 50%,
    rgb(var(--sand-700)) 75%,
    rgb(var(--sand-500)) 100%
  );
  background-size: 300% 300%;
  animation: pro-border-flow 4s ease infinite;
}

.pro-wall-border-glow {
  position: absolute;
  inset: -2px;
  border-radius: 1rem;
  background: linear-gradient(
    135deg,
    rgba(var(--sand-500), 0.4),
    transparent,
    rgba(var(--sand-500), 0.2),
    transparent,
    rgba(var(--sand-500), 0.4)
  );
  background-size: 300% 300%;
  animation: pro-border-flow 4s ease infinite;
  filter: blur(8px);
  z-index: -1;
}

@keyframes pro-border-flow {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.pro-wall-icon {
  animation: pro-icon-float 3s ease-in-out infinite;
}

@keyframes pro-icon-float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}

.pro-wall-shimmer {
  background: linear-gradient(
    105deg,
    transparent 40%,
    rgba(255, 255, 255, 0.15) 50%,
    transparent 60%
  );
  background-size: 200% 100%;
  animation: pro-shimmer 3s infinite;
}

@keyframes pro-shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Floating particles */
.pro-particle {
  position: absolute;
  border-radius: 50%;
  background: rgba(var(--sand-500), 0.15);
}

.pro-particle-1 {
  width: 60px;
  height: 60px;
  top: -10px;
  right: -10px;
  animation: pro-float-1 6s ease-in-out infinite;
}

.pro-particle-2 {
  width: 40px;
  height: 40px;
  bottom: 10px;
  left: -5px;
  animation: pro-float-2 5s ease-in-out infinite;
}

.pro-particle-3 {
  width: 25px;
  height: 25px;
  top: 40%;
  right: 20%;
  animation: pro-float-3 7s ease-in-out infinite;
}

@keyframes pro-float-1 {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.15;
  }
  50% {
    transform: translate(-10px, 10px) scale(1.1);
    opacity: 0.25;
  }
}

@keyframes pro-float-2 {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.1;
  }
  50% {
    transform: translate(8px, -8px) scale(1.15);
    opacity: 0.2;
  }
}

@keyframes pro-float-3 {
  0%,
  100% {
    transform: translate(0, 0);
    opacity: 0.1;
  }
  50% {
    transform: translate(-5px, 5px);
    opacity: 0.2;
  }
}
</style>
