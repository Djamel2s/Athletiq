<template>
  <div class="card-glass">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-bold text-primary-900 dark:text-primary-100">
        Analyse de progression
      </h3>
    </div>

    <!-- Exercise Selector -->
    <div class="mb-4">
      <select
        v-model="selectedExercise"
        class="w-full px-4 py-2.5 rounded-xl bg-white/50 dark:bg-primary-800/50 border border-primary-200 dark:border-primary-700 text-primary-900 dark:text-primary-100 text-sm focus:outline-none focus:ring-2 focus:ring-sand-500 transition-all"
      >
        <option value="">Choisir un exercice...</option>
        <option v-for="name in exerciseNames" :key="name" :value="name">
          {{ name }}
        </option>
      </select>
    </div>

    <!-- Empty State -->
    <div v-if="!selectedExercise" class="text-center py-12">
      <div
        class="w-14 h-14 bg-primary-100 dark:bg-primary-800 rounded-xl flex items-center justify-center mx-auto mb-4"
      >
        <svg
          class="w-7 h-7 text-primary-400 dark:text-primary-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
          />
        </svg>
      </div>
      <p class="text-primary-500 dark:text-primary-400 text-sm">
        Sélectionnez un exercice pour voir sa courbe de progression.
      </p>
    </div>

    <div v-else-if="dataPoints.length < 2" class="text-center py-12">
      <div
        class="w-14 h-14 bg-primary-100 dark:bg-primary-800 rounded-xl flex items-center justify-center mx-auto mb-4"
      >
        <svg
          class="w-7 h-7 text-primary-400 dark:text-primary-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
      </div>
      <p class="text-primary-500 dark:text-primary-400 text-sm">
        Pas assez de données pour cet exercice (minimum 2 séances).
      </p>
    </div>

    <!-- Chart -->
    <template v-else>
      <div class="relative mb-6">
        <canvas
          ref="canvasRef"
          :width="canvasWidth"
          :height="250"
          class="w-full rounded-xl"
          style="height: 250px"
        />
      </div>

      <!-- Stats Summary -->
      <div class="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div class="bg-white/30 dark:bg-primary-800/30 rounded-xl p-3 text-center">
          <p class="text-xs text-primary-500 dark:text-primary-400 mb-1">Poids initial</p>
          <p class="text-lg font-bold text-primary-900 dark:text-primary-100">
            {{ stats.startWeight }} kg
          </p>
        </div>
        <div class="bg-white/30 dark:bg-primary-800/30 rounded-xl p-3 text-center">
          <p class="text-xs text-primary-500 dark:text-primary-400 mb-1">Poids actuel</p>
          <p class="text-lg font-bold text-primary-900 dark:text-primary-100">
            {{ stats.currentWeight }} kg
          </p>
        </div>
        <div class="bg-white/30 dark:bg-primary-800/30 rounded-xl p-3 text-center">
          <p class="text-xs text-primary-500 dark:text-primary-400 mb-1">Progression</p>
          <p
            class="text-lg font-bold"
            :class="
              stats.improvement >= 0
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-500 dark:text-red-400'
            "
          >
            {{ stats.improvement >= 0 ? '+' : '' }}{{ stats.improvement }}%
          </p>
        </div>
        <div class="bg-white/30 dark:bg-primary-800/30 rounded-xl p-3 text-center">
          <p class="text-xs text-primary-500 dark:text-primary-400 mb-1">Séances</p>
          <p class="text-lg font-bold text-primary-900 dark:text-primary-100">
            {{ stats.totalSessions }}
          </p>
        </div>
        <div
          class="col-span-2 sm:col-span-1 bg-white/30 dark:bg-primary-800/30 rounded-xl p-3 text-center"
        >
          <p class="text-xs text-primary-500 dark:text-primary-400 mb-1">Plateaux</p>
          <p
            class="text-lg font-bold"
            :class="
              stats.plateauCount > 0
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-primary-900 dark:text-primary-100'
            "
          >
            {{ stats.plateauCount }}
          </p>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Workout } from '~/types/workout';

interface Props {
  workouts: Workout[];
}

const props = defineProps<Props>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
const canvasWidth = ref(800);
const selectedExercise = ref('');

const colorMode = useColorMode();
const isDark = computed(() => colorMode.value === 'dark');
const { accentColors } = useTheme();

// Extract unique exercise names from completed workouts
const exerciseNames = computed(() => {
  const names = new Set<string>();
  for (const workout of props.workouts) {
    if (!workout.completedAt || !workout.exercises) continue;
    for (const exercise of workout.exercises) {
      if (exercise.sets && exercise.sets.some((s) => s.weight && s.weight > 0)) {
        names.add(exercise.name);
      }
    }
  }
  return Array.from(names).sort((a, b) => a.localeCompare(b, 'fr'));
});

interface DataPoint {
  date: string;
  weight: number;
  timestamp: number;
}

// Extract data points for the selected exercise
const dataPoints = computed<DataPoint[]>(() => {
  if (!selectedExercise.value) return [];

  const pointsByDate = new Map<string, number>();

  for (const workout of props.workouts) {
    if (!workout.completedAt || !workout.exercises) continue;

    const date = workout.completedAt.split('T')[0] || workout.completedAt;

    for (const exercise of workout.exercises) {
      if (exercise.name !== selectedExercise.value) continue;
      if (!exercise.sets) continue;

      let maxWeight = 0;
      for (const set of exercise.sets) {
        if (set.weight && set.weight > maxWeight) {
          maxWeight = set.weight;
        }
      }

      if (maxWeight > 0) {
        const existing = pointsByDate.get(date) ?? 0;
        if (maxWeight > existing) {
          pointsByDate.set(date, maxWeight);
        }
      }
    }
  }

  return Array.from(pointsByDate.entries())
    .map(([date, weight]) => ({
      date,
      weight,
      timestamp: new Date(date).getTime(),
    }))
    .sort((a, b) => a.timestamp - b.timestamp);
});

// Plateau detection: 3+ consecutive sessions where range < 2.5kg
interface PlateauZone {
  startIndex: number;
  endIndex: number;
}

const plateauZones = computed<PlateauZone[]>(() => {
  const points = dataPoints.value;
  if (points.length < 3) return [];

  const zones: PlateauZone[] = [];
  let i = 0;

  while (i < points.length - 2) {
    let j = i + 2; // minimum window of 3
    // Expand window as long as range stays under 2.5kg
    while (j < points.length) {
      const windowWeights = points.slice(i, j + 1).map((p) => p.weight);
      const range = Math.max(...windowWeights) - Math.min(...windowWeights);
      if (range >= 2.5) break;
      j++;
    }
    const windowEnd = j - 1;
    const windowSize = windowEnd - i + 1;
    if (windowSize >= 3) {
      zones.push({ startIndex: i, endIndex: windowEnd });
      i = windowEnd + 1;
    } else {
      i++;
    }
  }

  return zones;
});

// Linear regression (least squares)
function linearRegression(points: DataPoint[]): { slope: number; intercept: number } {
  const n = points.length;
  if (n < 2) return { slope: 0, intercept: points[0]?.weight ?? 0 };

  let sumX = 0,
    sumY = 0,
    sumXY = 0,
    sumXX = 0;
  for (let i = 0; i < n; i++) {
    const w = points[i]!.weight;
    sumX += i;
    sumY += w;
    sumXY += i * w;
    sumXX += i * i;
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  return { slope, intercept };
}

// Stats
const stats = computed(() => {
  const points = dataPoints.value;
  if (points.length === 0) {
    return { startWeight: 0, currentWeight: 0, improvement: 0, totalSessions: 0, plateauCount: 0 };
  }

  const startWeight = points[0]!.weight;
  const currentWeight = points[points.length - 1]!.weight;
  const improvement =
    startWeight > 0 ? Math.round(((currentWeight - startWeight) / startWeight) * 1000) / 10 : 0;

  return {
    startWeight,
    currentWeight,
    improvement,
    totalSessions: points.length,
    plateauCount: plateauZones.value.length,
  };
});

// Drawing
function drawChart() {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const points = dataPoints.value;
  if (points.length < 2) return;

  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = 250 * dpr;
  ctx.scale(dpr, dpr);

  const w = rect.width;
  const h = 250;

  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const chartW = w - padding.left - padding.right;
  const chartH = h - padding.top - padding.bottom;

  const weights = points.map((p) => p.weight);
  const minW = Math.floor(Math.min(...weights) - 2.5);
  const maxW = Math.ceil(Math.max(...weights) + 2.5);
  const rangeW = maxW - minW || 1;

  const xScale = (i: number) => padding.left + (i / (points.length - 1)) * chartW;
  const yScale = (v: number) => padding.top + chartH - ((v - minW) / rangeW) * chartH;

  // Clear
  ctx.clearRect(0, 0, w, h);

  // Grid lines and Y labels
  const dark = isDark.value;
  ctx.strokeStyle = dark ? 'rgba(168, 162, 158, 0.15)' : 'rgba(87, 83, 78, 0.1)';
  ctx.lineWidth = 1;
  ctx.font = '11px system-ui, sans-serif';
  ctx.fillStyle = dark ? '#a8a29e' : '#78716c';
  ctx.textAlign = 'right';

  const ySteps = 5;
  for (let i = 0; i <= ySteps; i++) {
    const val = minW + (rangeW / ySteps) * i;
    const y = yScale(val);
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(w - padding.right, y);
    ctx.stroke();
    ctx.fillText(`${Math.round(val)}`, padding.left - 8, y + 4);
  }

  // X labels (dates)
  ctx.textAlign = 'center';
  const maxLabels = Math.min(points.length, 8);
  const labelStep = Math.max(1, Math.floor(points.length / maxLabels));
  for (let i = 0; i < points.length; i += labelStep) {
    const x = xScale(i);
    const date = new Date(points[i]!.date);
    const label = `${date.getDate()}/${date.getMonth() + 1}`;
    ctx.fillText(label, x, h - padding.bottom + 20);
  }

  // Plateau zones
  for (const zone of plateauZones.value) {
    const x1 = xScale(zone.startIndex);
    const x2 = xScale(zone.endIndex);
    ctx.fillStyle = 'rgba(245, 158, 11, 0.1)';
    ctx.fillRect(x1, padding.top, x2 - x1, chartH);

    // Top border
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(x1, padding.top);
    ctx.lineTo(x1, padding.top + chartH);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x2, padding.top);
    ctx.lineTo(x2, padding.top + chartH);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Trend line (linear regression)
  const reg = linearRegression(points);
  ctx.strokeStyle = dark ? 'rgba(168, 162, 158, 0.35)' : 'rgba(87, 83, 78, 0.25)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([6, 4]);
  ctx.beginPath();
  ctx.moveTo(xScale(0), yScale(reg.intercept));
  ctx.lineTo(xScale(points.length - 1), yScale(reg.intercept + reg.slope * (points.length - 1)));
  ctx.stroke();
  ctx.setLineDash([]);

  // Main line with gradient
  const gradient = ctx.createLinearGradient(padding.left, 0, w - padding.right, 0);
  gradient.addColorStop(0, accentColors.value[500]);
  gradient.addColorStop(1, accentColors.value[700]);

  ctx.strokeStyle = gradient;
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.beginPath();
  for (let i = 0; i < points.length; i++) {
    const x = xScale(i);
    const y = yScale(points[i]!.weight);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Fill area under curve
  const areaGradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH);
  areaGradient.addColorStop(
    0,
    dark ? `rgba(${accentColors.value.rgb500}, 0.15)` : `rgba(${accentColors.value.rgb500}, 0.2)`
  );
  areaGradient.addColorStop(1, `rgba(${accentColors.value.rgb500}, 0)`);

  ctx.fillStyle = areaGradient;
  ctx.beginPath();
  ctx.moveTo(xScale(0), yScale(points[0]!.weight));
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(xScale(i), yScale(points[i]!.weight));
  }
  ctx.lineTo(xScale(points.length - 1), padding.top + chartH);
  ctx.lineTo(xScale(0), padding.top + chartH);
  ctx.closePath();
  ctx.fill();

  // Data points
  for (let i = 0; i < points.length; i++) {
    const x = xScale(i);
    const y = yScale(points[i].weight);

    // Outer ring
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = dark ? '#292524' : '#ffffff';
    ctx.fill();
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Inner dot
    ctx.beginPath();
    ctx.arc(x, y, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = accentColors.value[700];
    ctx.fill();
  }
}

// Responsive width
function updateWidth() {
  const canvas = canvasRef.value;
  if (canvas) {
    const rect = canvas.parentElement?.getBoundingClientRect();
    if (rect) canvasWidth.value = rect.width;
  }
}

let resizeObserver: ResizeObserver | null = null;

watch([dataPoints, isDark], () => {
  nextTick(() => drawChart());
});

onMounted(() => {
  updateWidth();
  nextTick(() => drawChart());

  resizeObserver = new ResizeObserver(() => {
    updateWidth();
    nextTick(() => drawChart());
  });

  if (canvasRef.value?.parentElement) {
    resizeObserver.observe(canvasRef.value.parentElement);
  }
});

onUnmounted(() => {
  resizeObserver?.disconnect();
});
</script>
