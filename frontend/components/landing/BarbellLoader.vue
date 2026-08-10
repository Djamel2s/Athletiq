<template>
  <div class="select-none">
    <!-- Barbell visual -->
    <div class="flex items-center justify-center h-40 md:h-48 mb-6">
      <div class="flex items-center">
        <!-- Left plates (mirrored, largest closest to collar) -->
        <div class="flex items-center flex-row-reverse">
          <div
            v-for="(plate, i) in leftPlates"
            :key="`l-${i}`"
            class="rounded-sm mx-[1.5px] transition-all duration-300"
            :class="plateClass(plate.isRecord)"
            :style="plateStyle(plate.weight)"
          />
        </div>
        <!-- Collar -->
        <div class="w-2 h-6 bg-iron-600 rounded-sm mx-0.5" />
        <!-- Sleeve -->
        <div class="w-10 md:w-16 h-2.5 bg-iron-600" />
        <!-- Bar handle -->
        <div class="w-24 md:w-40 h-1.5 bg-iron-700 rounded-full" />
        <!-- Sleeve -->
        <div class="w-10 md:w-16 h-2.5 bg-iron-600" />
        <!-- Collar -->
        <div class="w-2 h-6 bg-iron-600 rounded-sm mx-0.5" />
        <!-- Right plates -->
        <div class="flex items-center">
          <div
            v-for="(plate, i) in rightPlates"
            :key="`r-${i}`"
            class="rounded-sm mx-[1.5px] transition-all duration-300"
            :class="plateClass(plate.isRecord)"
            :style="plateStyle(plate.weight)"
          />
        </div>
      </div>
    </div>

    <!-- Readout -->
    <div class="flex items-baseline justify-center gap-2 mb-5">
      <span class="font-plate text-4xl md:text-5xl font-bold" :class="isPR ? 'text-ember-500' : 'text-chalk-100'">
        {{ totalWeight }}
      </span>
      <span class="font-plate text-lg text-iron-600 dark:text-chalk-100/50">kg</span>
      <span class="font-plate text-lg text-iron-600 dark:text-chalk-100/40 mx-1">×</span>
      <span class="font-plate text-3xl md:text-4xl font-bold text-chalk-100/90">{{ reps }}</span>
      <span class="font-plate text-lg text-iron-600 dark:text-chalk-100/50">reps</span>
    </div>

    <Transition name="fade">
      <p v-if="isPR" class="text-center text-ember-500 font-display text-sm tracking-widest uppercase mb-5">
        Record personnel
      </p>
    </Transition>

    <!-- Controls -->
    <div class="max-w-sm mx-auto space-y-4">
      <div>
        <div class="flex items-center justify-between text-xs font-plate text-chalk-100/50 mb-1.5">
          <span>Charge</span>
          <span>20 – 220 kg</span>
        </div>
        <input
          v-model.number="targetWeight"
          type="range"
          min="20"
          max="220"
          step="2.5"
          aria-label="Charge de la barre, en kilogrammes"
          class="w-full accent-sand-500"
        />
      </div>
      <div class="flex items-center justify-center gap-4">
        <button
          @click="reps = Math.max(1, reps - 1)"
          class="w-9 h-9 rounded-full bg-iron-800 text-chalk-100 flex items-center justify-center hover:bg-iron-700 transition-colors"
          aria-label="Moins de répétitions"
        >
          −
        </button>
        <span class="font-plate text-chalk-100/70 text-sm w-20 text-center">{{ reps }} rép.</span>
        <button
          @click="reps = Math.min(20, reps + 1)"
          class="w-9 h-9 rounded-full bg-iron-800 text-chalk-100 flex items-center justify-center hover:bg-iron-700 transition-colors"
          aria-label="Plus de répétitions"
        >
          +
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const BAR_WEIGHT = 20;
const PLATE_SIZES = [25, 20, 15, 10, 5, 2.5, 1.25];
// Précédent record fictif utilisé uniquement pour illustrer la mécanique de détection de PR
const DEMO_PREVIOUS_BEST = 100;

const targetWeight = ref(60);
const reps = ref(6);

function decomposeSide(sideWeight: number) {
  let remaining = Math.round(sideWeight * 100) / 100;
  const plates: number[] = [];
  for (const size of PLATE_SIZES) {
    while (remaining >= size - 0.01 && plates.length < 8) {
      plates.push(size);
      remaining = Math.round((remaining - size) * 100) / 100;
    }
  }
  return plates;
}

const isPR = computed(() => targetWeight.value > DEMO_PREVIOUS_BEST);

const sidePlates = computed(() => {
  const sideWeight = Math.max(0, (targetWeight.value - BAR_WEIGHT) / 2);
  return decomposeSide(sideWeight).map((weight) => ({ weight, isRecord: isPR.value }));
});

const leftPlates = computed(() => [...sidePlates.value].reverse());
const rightPlates = computed(() => sidePlates.value);

const totalWeight = computed(() => targetWeight.value.toFixed(1).replace(/\.0$/, ''));

function plateStyle(weight: number) {
  // Hauteur/largeur proportionnelles au poids réel de la fonte
  const height = 40 + weight * 2.4;
  const width = weight >= 20 ? 14 : weight >= 10 ? 11 : weight >= 5 ? 9 : 7;
  return {
    height: `${Math.min(height, 160)}px`,
    width: `${width}px`,
  };
}

function plateClass(isRecord: boolean) {
  return isRecord ? 'bg-ember-500/80' : 'bg-sand-500/70';
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
