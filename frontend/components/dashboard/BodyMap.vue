<template>
  <div class="card-glass">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-xl md:text-2xl font-bold text-primary-900 dark:text-primary-100">Carte musculaire</h3>
      <div class="flex items-center gap-1.5">
        <button
          @click="view = 'front'"
          :class="[
            'px-3 py-1 rounded-lg text-xs font-medium transition-colors',
            view === 'front'
              ? 'bg-gradient-to-br from-[#d4c4b0] to-[#b8a48f] text-white'
              : 'text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-800'
          ]"
        >
          Face
        </button>
        <button
          @click="view = 'back'"
          :class="[
            'px-3 py-1 rounded-lg text-xs font-medium transition-colors',
            view === 'back'
              ? 'bg-gradient-to-br from-[#d4c4b0] to-[#b8a48f] text-white'
              : 'text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-800'
          ]"
        >
          Dos
        </button>
      </div>
    </div>

    <!-- Body Map SVG -->
    <div class="flex justify-center mb-6">
      <div class="relative w-[200px] h-[380px] md:w-[260px] md:h-[480px]">
        <svg
          viewBox="0 0 200 380"
          class="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <!-- Body silhouette outline -->
          <path
            d="M100 8 C88 8 80 16 80 28 C80 40 88 48 100 48 C112 48 120 40 120 28 C120 16 112 8 100 8Z"
            fill="none"
            stroke="currentColor"
            stroke-width="1.2"
            class="text-primary-300 dark:text-primary-600"
          />

          <!-- Neck -->
          <path
            d="M93 48 L93 58 L107 58 L107 48"
            fill="none"
            stroke="currentColor"
            stroke-width="1.2"
            class="text-primary-300 dark:text-primary-600"
          />

          <!-- FRONT VIEW muscle groups -->
          <template v-if="view === 'front'">
            <!-- Shoulders (left) -->
            <path
              d="M58 62 C48 64 42 72 40 82 L58 82 L62 68 Z"
              :fill="getMuscleColor('SHOULDERS')"
              class="muscle-path"
              @mouseenter="showTooltip($event, 'SHOULDERS')"
              @mouseleave="hideTooltip"
              @click="selectMuscle('SHOULDERS')"
            />
            <!-- Shoulders (right) -->
            <path
              d="M142 62 C152 64 158 72 160 82 L142 82 L138 68 Z"
              :fill="getMuscleColor('SHOULDERS')"
              class="muscle-path"
              @mouseenter="showTooltip($event, 'SHOULDERS')"
              @mouseleave="hideTooltip"
              @click="selectMuscle('SHOULDERS')"
            />

            <!-- Chest (left pec) -->
            <path
              d="M62 68 L62 100 L98 100 L98 68 C90 60 72 60 62 68Z"
              :fill="getMuscleColor('CHEST')"
              class="muscle-path"
              @mouseenter="showTooltip($event, 'CHEST')"
              @mouseleave="hideTooltip"
              @click="selectMuscle('CHEST')"
            />
            <!-- Chest (right pec) -->
            <path
              d="M138 68 L138 100 L102 100 L102 68 C110 60 128 60 138 68Z"
              :fill="getMuscleColor('CHEST')"
              class="muscle-path"
              @mouseenter="showTooltip($event, 'CHEST')"
              @mouseleave="hideTooltip"
              @click="selectMuscle('CHEST')"
            />

            <!-- Biceps (left) -->
            <path
              d="M40 82 L36 130 L42 140 L54 140 L58 82 Z"
              :fill="getMuscleColor('BICEPS')"
              class="muscle-path"
              @mouseenter="showTooltip($event, 'BICEPS')"
              @mouseleave="hideTooltip"
              @click="selectMuscle('BICEPS')"
            />
            <!-- Biceps (right) -->
            <path
              d="M160 82 L164 130 L158 140 L146 140 L142 82 Z"
              :fill="getMuscleColor('BICEPS')"
              class="muscle-path"
              @mouseenter="showTooltip($event, 'BICEPS')"
              @mouseleave="hideTooltip"
              @click="selectMuscle('BICEPS')"
            />

            <!-- Forearms (left) -->
            <path
              d="M36 140 L30 190 L36 192 L46 192 L54 140 Z"
              fill="none"
              stroke="currentColor"
              stroke-width="1.2"
              class="text-primary-300 dark:text-primary-600"
            />
            <!-- Forearms (right) -->
            <path
              d="M164 140 L170 190 L164 192 L154 192 L146 140 Z"
              fill="none"
              stroke="currentColor"
              stroke-width="1.2"
              class="text-primary-300 dark:text-primary-600"
            />

            <!-- Abs -->
            <path
              d="M82 104 L82 180 C82 186 88 190 100 190 C112 190 118 186 118 180 L118 104 Z"
              :fill="getMuscleColor('ABS')"
              class="muscle-path"
              @mouseenter="showTooltip($event, 'ABS')"
              @mouseleave="hideTooltip"
              @click="selectMuscle('ABS')"
            />
            <!-- Abs lines -->
            <line x1="100" y1="108" x2="100" y2="180" stroke="currentColor" stroke-width="0.5" class="text-primary-400/50 dark:text-primary-500/50 pointer-events-none" />
            <line x1="84" y1="124" x2="116" y2="124" stroke="currentColor" stroke-width="0.5" class="text-primary-400/50 dark:text-primary-500/50 pointer-events-none" />
            <line x1="84" y1="142" x2="116" y2="142" stroke="currentColor" stroke-width="0.5" class="text-primary-400/50 dark:text-primary-500/50 pointer-events-none" />
            <line x1="84" y1="160" x2="116" y2="160" stroke="currentColor" stroke-width="0.5" class="text-primary-400/50 dark:text-primary-500/50 pointer-events-none" />

            <!-- Obliques (left) -->
            <path
              d="M62 100 L62 178 L82 180 L82 104 Z"
              fill="none"
              stroke="currentColor"
              stroke-width="1.2"
              class="text-primary-300 dark:text-primary-600"
            />
            <!-- Obliques (right) -->
            <path
              d="M138 100 L138 178 L118 180 L118 104 Z"
              fill="none"
              stroke="currentColor"
              stroke-width="1.2"
              class="text-primary-300 dark:text-primary-600"
            />

            <!-- Quads (left) -->
            <path
              d="M68 192 L60 280 L66 290 L96 290 L98 192 Z"
              :fill="getMuscleColor('QUADS')"
              class="muscle-path"
              @mouseenter="showTooltip($event, 'QUADS')"
              @mouseleave="hideTooltip"
              @click="selectMuscle('QUADS')"
            />
            <!-- Quads (right) -->
            <path
              d="M132 192 L140 280 L134 290 L104 290 L102 192 Z"
              :fill="getMuscleColor('QUADS')"
              class="muscle-path"
              @mouseenter="showTooltip($event, 'QUADS')"
              @mouseleave="hideTooltip"
              @click="selectMuscle('QUADS')"
            />

            <!-- Calves (left) -->
            <path
              d="M62 296 L58 350 L64 362 L80 362 L86 350 L90 296 Z"
              :fill="getMuscleColor('CALVES')"
              class="muscle-path"
              @mouseenter="showTooltip($event, 'CALVES')"
              @mouseleave="hideTooltip"
              @click="selectMuscle('CALVES')"
            />
            <!-- Calves (right) -->
            <path
              d="M138 296 L142 350 L136 362 L120 362 L114 350 L110 296 Z"
              :fill="getMuscleColor('CALVES')"
              class="muscle-path"
              @mouseenter="showTooltip($event, 'CALVES')"
              @mouseleave="hideTooltip"
              @click="selectMuscle('CALVES')"
            />
          </template>

          <!-- BACK VIEW muscle groups -->
          <template v-else>
            <!-- Shoulders (left) -->
            <path
              d="M58 62 C48 64 42 72 40 82 L58 82 L62 68 Z"
              :fill="getMuscleColor('SHOULDERS')"
              class="muscle-path"
              @mouseenter="showTooltip($event, 'SHOULDERS')"
              @mouseleave="hideTooltip"
              @click="selectMuscle('SHOULDERS')"
            />
            <!-- Shoulders (right) -->
            <path
              d="M142 62 C152 64 158 72 160 82 L142 82 L138 68 Z"
              :fill="getMuscleColor('SHOULDERS')"
              class="muscle-path"
              @mouseenter="showTooltip($event, 'SHOULDERS')"
              @mouseleave="hideTooltip"
              @click="selectMuscle('SHOULDERS')"
            />

            <!-- Back (upper left) -->
            <path
              d="M62 68 L62 120 L98 120 L98 68 C90 60 72 60 62 68Z"
              :fill="getMuscleColor('BACK')"
              class="muscle-path"
              @mouseenter="showTooltip($event, 'BACK')"
              @mouseleave="hideTooltip"
              @click="selectMuscle('BACK')"
            />
            <!-- Back (upper right) -->
            <path
              d="M138 68 L138 120 L102 120 L102 68 C110 60 128 60 138 68Z"
              :fill="getMuscleColor('BACK')"
              class="muscle-path"
              @mouseenter="showTooltip($event, 'BACK')"
              @mouseleave="hideTooltip"
              @click="selectMuscle('BACK')"
            />
            <!-- Back (lower) -->
            <path
              d="M66 120 L66 180 C66 186 80 190 100 190 C120 190 134 186 134 180 L134 120 Z"
              :fill="getMuscleColor('BACK')"
              class="muscle-path"
              @mouseenter="showTooltip($event, 'BACK')"
              @mouseleave="hideTooltip"
              @click="selectMuscle('BACK')"
            />
            <!-- Back spine line -->
            <line x1="100" y1="68" x2="100" y2="180" stroke="currentColor" stroke-width="0.5" class="text-primary-400/50 dark:text-primary-500/50 pointer-events-none" />

            <!-- Triceps (left) -->
            <path
              d="M40 82 L36 130 L42 140 L54 140 L58 82 Z"
              :fill="getMuscleColor('TRICEPS')"
              class="muscle-path"
              @mouseenter="showTooltip($event, 'TRICEPS')"
              @mouseleave="hideTooltip"
              @click="selectMuscle('TRICEPS')"
            />
            <!-- Triceps (right) -->
            <path
              d="M160 82 L164 130 L158 140 L146 140 L142 82 Z"
              :fill="getMuscleColor('TRICEPS')"
              class="muscle-path"
              @mouseenter="showTooltip($event, 'TRICEPS')"
              @mouseleave="hideTooltip"
              @click="selectMuscle('TRICEPS')"
            />

            <!-- Forearms (left) -->
            <path
              d="M36 140 L30 190 L36 192 L46 192 L54 140 Z"
              fill="none"
              stroke="currentColor"
              stroke-width="1.2"
              class="text-primary-300 dark:text-primary-600"
            />
            <!-- Forearms (right) -->
            <path
              d="M164 140 L170 190 L164 192 L154 192 L146 140 Z"
              fill="none"
              stroke="currentColor"
              stroke-width="1.2"
              class="text-primary-300 dark:text-primary-600"
            />

            <!-- Glutes (left) -->
            <path
              d="M68 184 L68 210 L98 210 L98 184 C92 196 74 196 68 184Z"
              :fill="getMuscleColor('GLUTES')"
              class="muscle-path"
              @mouseenter="showTooltip($event, 'GLUTES')"
              @mouseleave="hideTooltip"
              @click="selectMuscle('GLUTES')"
            />
            <!-- Glutes (right) -->
            <path
              d="M132 184 L132 210 L102 210 L102 184 C108 196 126 196 132 184Z"
              :fill="getMuscleColor('GLUTES')"
              class="muscle-path"
              @mouseenter="showTooltip($event, 'GLUTES')"
              @mouseleave="hideTooltip"
              @click="selectMuscle('GLUTES')"
            />

            <!-- Hamstrings (left) -->
            <path
              d="M66 212 L60 280 L66 290 L96 290 L98 212 Z"
              :fill="getMuscleColor('HAMSTRINGS')"
              class="muscle-path"
              @mouseenter="showTooltip($event, 'HAMSTRINGS')"
              @mouseleave="hideTooltip"
              @click="selectMuscle('HAMSTRINGS')"
            />
            <!-- Hamstrings (right) -->
            <path
              d="M134 212 L140 280 L134 290 L104 290 L102 212 Z"
              :fill="getMuscleColor('HAMSTRINGS')"
              class="muscle-path"
              @mouseenter="showTooltip($event, 'HAMSTRINGS')"
              @mouseleave="hideTooltip"
              @click="selectMuscle('HAMSTRINGS')"
            />

            <!-- Calves (left) -->
            <path
              d="M62 296 L58 350 L64 362 L80 362 L86 350 L90 296 Z"
              :fill="getMuscleColor('CALVES')"
              class="muscle-path"
              @mouseenter="showTooltip($event, 'CALVES')"
              @mouseleave="hideTooltip"
              @click="selectMuscle('CALVES')"
            />
            <!-- Calves (right) -->
            <path
              d="M138 296 L142 350 L136 362 L120 362 L114 350 L110 296 Z"
              :fill="getMuscleColor('CALVES')"
              class="muscle-path"
              @mouseenter="showTooltip($event, 'CALVES')"
              @mouseleave="hideTooltip"
              @click="selectMuscle('CALVES')"
            />
          </template>
        </svg>

        <!-- Tooltip -->
        <Transition name="fade">
          <div
            v-if="tooltip.visible"
            class="absolute z-10 px-3 py-2 rounded-xl bg-white/95 dark:bg-primary-800/95 backdrop-blur-sm border border-primary-200 dark:border-primary-700 shadow-lg pointer-events-none"
            :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px', transform: 'translate(-50%, -100%) translateY(-8px)' }"
          >
            <p class="text-sm font-semibold text-primary-900 dark:text-primary-100">{{ getMuscleLabel(tooltip.muscle) }}</p>
            <div class="flex items-center gap-2 mt-1">
              <div
                class="w-2.5 h-2.5 rounded-full flex-shrink-0"
                :style="{ backgroundColor: getMuscleColor(tooltip.muscle) }"
              ></div>
              <span class="text-xs text-primary-600 dark:text-primary-400">
                {{ getMuscleData(tooltip.muscle)?.score != null ? Math.round(getMuscleData(tooltip.muscle)!.score) + '% recupere' : 'Non entraine' }}
              </span>
            </div>
            <p v-if="getMuscleData(tooltip.muscle)?.daysSince != null" class="text-xs text-primary-500 dark:text-primary-400 mt-0.5">
              Il y a {{ getMuscleData(tooltip.muscle)!.daysSince }} jour{{ getMuscleData(tooltip.muscle)!.daysSince > 1 ? 's' : '' }}
            </p>
          </div>
        </Transition>
      </div>
    </div>

    <!-- Selected muscle detail (mobile-friendly) -->
    <Transition name="slide">
      <div v-if="selectedMuscle" class="mb-5 p-3 rounded-xl bg-primary-50 dark:bg-primary-800/60 border border-primary-200 dark:border-primary-700">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div
              class="w-4 h-4 rounded-full flex-shrink-0"
              :style="{ backgroundColor: getMuscleColor(selectedMuscle) }"
            ></div>
            <div>
              <p class="text-sm font-semibold text-primary-900 dark:text-primary-100">{{ getMuscleLabel(selectedMuscle) }}</p>
              <p class="text-xs text-primary-600 dark:text-primary-400">
                <template v-if="getMuscleData(selectedMuscle)?.score != null">
                  {{ Math.round(getMuscleData(selectedMuscle)!.score) }}% recupere
                  <span v-if="getMuscleData(selectedMuscle)?.daysSince != null" class="ml-1">
                    &middot; il y a {{ getMuscleData(selectedMuscle)!.daysSince }}j
                  </span>
                </template>
                <template v-else>Non entraine recemment</template>
              </p>
            </div>
          </div>
          <button
            @click="selectedMuscle = null"
            class="w-6 h-6 flex items-center justify-center rounded-full hover:bg-primary-200 dark:hover:bg-primary-700 transition-colors"
          >
            <svg class="w-3.5 h-3.5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </Transition>

    <!-- Legend -->
    <div class="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
      <div v-for="item in legend" :key="item.label" class="flex items-center gap-1.5">
        <div class="w-3 h-3 rounded-sm" :style="{ backgroundColor: item.color }"></div>
        <span class="text-xs text-primary-600 dark:text-primary-400">{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface MuscleRecovery {
  muscle: string
  score: number
  daysSince: number
}

interface Props {
  muscleRecovery: MuscleRecovery[]
}

const props = defineProps<Props>()

const view = ref<'front' | 'back'>('front')
const selectedMuscle = ref<string | null>(null)

const tooltip = reactive({
  visible: false,
  x: 0,
  y: 0,
  muscle: ''
})

const legend = [
  { label: 'Repos necessaire', color: '#ef4444' },
  { label: 'Recuperation', color: '#f59e0b' },
  { label: 'Presque pret', color: '#d4c4b0' },
  { label: 'Pret', color: '#22c55e' },
  { label: 'Non entraine', color: '#9ca3af' }
]

const muscleLabels: Record<string, string> = {
  CHEST: 'Pectoraux',
  BACK: 'Dos',
  SHOULDERS: 'Epaules',
  BICEPS: 'Biceps',
  TRICEPS: 'Triceps',
  ABS: 'Abdominaux',
  QUADS: 'Quadriceps',
  HAMSTRINGS: 'Ischio-jambiers',
  GLUTES: 'Fessiers',
  CALVES: 'Mollets'
}

const getMuscleLabel = (muscle: string): string => {
  return muscleLabels[muscle] || muscle
}

const getMuscleData = (muscle: string): MuscleRecovery | undefined => {
  return props.muscleRecovery.find(m => m.muscle === muscle)
}

const getMuscleColor = (muscle: string): string => {
  const data = getMuscleData(muscle)
  if (!data) return '#9ca3af' // gray - not trained
  const score = data.score
  if (score <= 30) return '#ef4444'
  if (score <= 60) return '#f59e0b'
  if (score <= 85) return '#d4c4b0'
  return '#22c55e'
}

const showTooltip = (event: MouseEvent, muscle: string) => {
  const svgContainer = (event.target as SVGElement).closest('.relative')
  if (!svgContainer) return
  const rect = svgContainer.getBoundingClientRect()
  const targetRect = (event.target as SVGElement).getBoundingClientRect()
  tooltip.x = targetRect.left + targetRect.width / 2 - rect.left
  tooltip.y = targetRect.top - rect.top
  tooltip.muscle = muscle
  tooltip.visible = true
}

const hideTooltip = () => {
  tooltip.visible = false
}

const selectMuscle = (muscle: string) => {
  selectedMuscle.value = selectedMuscle.value === muscle ? null : muscle
}
</script>

<style scoped>
.muscle-path {
  stroke: rgba(0, 0, 0, 0.1);
  stroke-width: 1;
  cursor: pointer;
  transition: opacity 0.2s ease, filter 0.2s ease;
}

.muscle-path:hover {
  opacity: 0.8;
  filter: brightness(1.15);
}

:root.dark .muscle-path {
  stroke: rgba(255, 255, 255, 0.08);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
