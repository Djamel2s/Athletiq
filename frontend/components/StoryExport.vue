<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
    <div
      class="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl max-w-md w-full max-h-[95vh] overflow-y-auto p-5"
    >
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-bold text-zinc-900 dark:text-white">Partager sur Instagram</h2>
        <button
          @click="emit('close')"
          class="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
        >
          <svg class="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Template selector -->
      <div class="flex gap-3 mb-4">
        <button
          v-for="t in templates"
          :key="t.id"
          @click="selectedTemplate = t.id"
          class="flex-1 rounded-xl border-2 p-2 transition-all"
          :class="
            selectedTemplate === t.id
              ? 'border-amber-500 shadow-lg scale-[1.02]'
              : 'border-zinc-200 dark:border-zinc-700 opacity-60 hover:opacity-80'
          "
        >
          <div class="w-full aspect-[9/16] rounded-lg" :style="{ background: t.preview }" />
          <p class="text-xs text-center mt-1.5 font-medium text-zinc-600 dark:text-zinc-400">
            {{ t.label }}
          </p>
        </button>
      </div>

      <!-- Phone frame preview -->
      <div class="relative mx-auto w-full max-w-[260px] mb-5">
        <div
          class="rounded-[28px] border-[3px] border-zinc-300 dark:border-zinc-600 bg-black p-1.5 shadow-xl"
        >
          <div class="rounded-[22px] overflow-hidden">
            <img v-if="previewUrl" :src="previewUrl" alt="Story preview" class="w-full block" />
            <div v-else class="w-full aspect-[9/16] flex items-center justify-center bg-zinc-800">
              <svg class="w-8 h-8 text-zinc-500 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Action buttons -->
      <div class="flex gap-3">
        <button
          @click="handleShare"
          class="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-sm shadow-lg hover:shadow-xl transition"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
          Partager
        </button>
        <button
          @click="handleDownload"
          class="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Telecharger
        </button>
      </div>
    </div>

    <!-- Hidden canvas -->
    <canvas ref="canvasRef" class="hidden" width="1080" height="1920" />
  </div>
</template>

<script setup lang="ts">
interface StoryData {
  workoutName: string;
  duration: number;
  totalVolume: number;
  exerciseCount: number;
  setCount: number;
  prsBeaten: number;
  streak: number;
  date: string;
}

const props = withDefaults(
  defineProps<{
    data: StoryData;
    template?: 'minimal' | 'bold' | 'dark';
  }>(),
  {
    template: 'minimal',
  }
);

const emit = defineEmits<{
  close: [];
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
const previewUrl = ref<string | null>(null);
const selectedTemplate = ref<'minimal' | 'bold' | 'dark'>(props.template);

const templates = [
  {
    id: 'minimal' as const,
    label: 'Minimal',
    preview: 'linear-gradient(135deg, #f5f0eb 0%, #e8e0d6 100%)',
  },
  {
    id: 'bold' as const,
    label: 'Bold',
    preview: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  },
  {
    id: 'dark' as const,
    label: 'Dark',
    preview: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
  },
];

const W = 1080;
const H = 1920;
const MARGIN = 80;
const FONT = 'system-ui, -apple-system, sans-serif';

// --- French date formatting ---
function formatDateFrench(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateStr;
  }
}

// --- Duration formatting ---
function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m.toString().padStart(2, '0')}min`;
  return `${m}min`;
}

// --- Volume formatting ---
function formatVolume(kg: number): string {
  return kg.toLocaleString('fr-FR').replace(/,/g, ' ') + ' kg';
}

// --- Round rect helper ---
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// --- Word-wrap helper ---
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const test = line ? line + ' ' + word : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

// ============================
// TEMPLATE: MINIMAL
// ============================
function drawMinimal(ctx: CanvasRenderingContext2D) {
  const bg = '#f5f0eb';
  const textDark = '#2c2418';
  const textMuted = '#8a7e72';
  const accent = '#c8a97e';
  const accentDark = '#a68b62';

  // Background
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Subtle grain
  for (let i = 0; i < 3000; i++) {
    ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.02})`;
    ctx.fillRect(Math.random() * W, Math.random() * H, 1, 1);
  }

  // Top thin line
  ctx.fillStyle = accent;
  ctx.fillRect(MARGIN, 100, W - MARGIN * 2, 1.5);

  // ATHLETIQ logo
  ctx.font = `600 40px ${FONT}`;
  ctx.fillStyle = textDark;
  ctx.textAlign = 'center';
  ctx.letterSpacing = '10px';
  ctx.fillText('A T H L E T I Q', W / 2, 180);
  ctx.letterSpacing = '0px';

  // Date
  ctx.font = `400 32px ${FONT}`;
  ctx.fillStyle = textMuted;
  ctx.fillText(formatDateFrench(props.data.date), W / 2, 240);

  // Separator
  ctx.fillStyle = accentDark;
  ctx.fillRect(W / 2 - 40, 280, 80, 2);

  // Workout name
  ctx.font = `700 64px ${FONT}`;
  ctx.fillStyle = textDark;
  ctx.textAlign = 'center';
  const nameLines = wrapText(ctx, props.data.workoutName, W - MARGIN * 2);
  nameLines.forEach((line, i) => {
    ctx.fillText(line, W / 2, 380 + i * 78);
  });

  let y = 380 + nameLines.length * 78 + 80;

  // Duration - big highlight
  ctx.font = `300 36px ${FONT}`;
  ctx.fillStyle = textMuted;
  ctx.fillText('DUREE', W / 2, y);
  y += 70;
  ctx.font = `700 96px ${FONT}`;
  ctx.fillStyle = textDark;
  ctx.fillText(formatDuration(props.data.duration), W / 2, y);
  y += 80;

  // Thin separator
  ctx.fillStyle = accent;
  ctx.fillRect(W / 2 - 60, y, 120, 1);
  y += 60;

  // Volume
  ctx.font = `300 36px ${FONT}`;
  ctx.fillStyle = textMuted;
  ctx.fillText('VOLUME TOTAL', W / 2, y);
  y += 70;
  ctx.font = `700 80px ${FONT}`;
  ctx.fillStyle = textDark;
  ctx.fillText(formatVolume(props.data.totalVolume), W / 2, y);
  y += 80;

  // Stats row: exercises + sets
  ctx.fillStyle = accent;
  ctx.fillRect(W / 2 - 60, y, 120, 1);
  y += 60;

  const statsRowY = y;
  ctx.font = `700 72px ${FONT}`;
  ctx.fillStyle = textDark;
  ctx.textAlign = 'center';
  ctx.fillText(String(props.data.exerciseCount), W / 2 - 200, statsRowY);
  ctx.fillText(String(props.data.setCount), W / 2 + 200, statsRowY);

  ctx.font = `400 28px ${FONT}`;
  ctx.fillStyle = textMuted;
  ctx.fillText('exercices', W / 2 - 200, statsRowY + 40);
  ctx.fillText('series', W / 2 + 200, statsRowY + 40);

  // Dot separator between
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.arc(W / 2, statsRowY - 15, 4, 0, Math.PI * 2);
  ctx.fill();

  y = statsRowY + 100;

  // PRs beaten
  if (props.data.prsBeaten > 0) {
    y += 30;
    ctx.font = `600 48px ${FONT}`;
    ctx.fillStyle = accentDark;
    ctx.textAlign = 'center';
    const prText =
      props.data.prsBeaten === 1
        ? '\uD83C\uDFC6  1 record battu'
        : `\uD83C\uDFC6  ${props.data.prsBeaten} records battus`;
    ctx.fillText(prText, W / 2, y);
    y += 60;
  }

  // Streak
  if (props.data.streak > 0) {
    y += 10;
    ctx.font = `500 38px ${FONT}`;
    ctx.fillStyle = textMuted;
    ctx.textAlign = 'center';
    const streakText =
      props.data.streak === 1 ? '1 semaine de suite' : `${props.data.streak} semaines de suite`;
    ctx.fillText(streakText, W / 2, y);
  }

  // Bottom line
  ctx.fillStyle = accent;
  ctx.fillRect(MARGIN, H - 130, W - MARGIN * 2, 1.5);

  // Watermark
  ctx.font = `400 28px ${FONT}`;
  ctx.fillStyle = textMuted;
  ctx.textAlign = 'center';
  ctx.fillText('athletiq.fr', W / 2, H - 80);
}

// ============================
// TEMPLATE: BOLD
// ============================
function drawBold(ctx: CanvasRenderingContext2D) {
  const bg1 = '#1a1a2e';
  const bg2 = '#16213e';
  const textWhite = '#ffffff';
  const textMuted = '#8892a8';
  const accent = '#e94560';
  const accent2 = '#0f3460';

  // Gradient background
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, bg1);
  grad.addColorStop(0.5, bg2);
  grad.addColorStop(1, bg1);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Accent bars
  const barGrad = ctx.createLinearGradient(0, 0, W, 0);
  barGrad.addColorStop(0, accent);
  barGrad.addColorStop(1, accent2);
  ctx.fillStyle = barGrad;
  ctx.fillRect(0, 0, W, 8);
  ctx.fillRect(0, H - 8, W, 8);

  // Side accent strips
  ctx.fillStyle = accent;
  ctx.fillRect(0, 0, 6, H);
  ctx.fillRect(W - 6, 0, 6, H);

  // ATHLETIQ logo
  ctx.font = `800 48px ${FONT}`;
  ctx.fillStyle = textWhite;
  ctx.textAlign = 'center';
  ctx.letterSpacing = '12px';
  ctx.fillText('A T H L E T I Q', W / 2, 130);
  ctx.letterSpacing = '0px';

  // Date
  ctx.font = `400 30px ${FONT}`;
  ctx.fillStyle = textMuted;
  ctx.fillText(formatDateFrench(props.data.date), W / 2, 190);

  // Workout name - large
  ctx.font = `900 72px ${FONT}`;
  ctx.fillStyle = textWhite;
  const nameLines = wrapText(ctx, props.data.workoutName.toUpperCase(), W - MARGIN * 2);
  nameLines.forEach((line, i) => {
    ctx.fillText(line, W / 2, 330 + i * 86);
  });

  let y = 330 + nameLines.length * 86 + 60;

  // Accent bar under title
  const barW = 200;
  const accentBarGrad = ctx.createLinearGradient(W / 2 - barW / 2, 0, W / 2 + barW / 2, 0);
  accentBarGrad.addColorStop(0, accent);
  accentBarGrad.addColorStop(1, accent2);
  ctx.fillStyle = accentBarGrad;
  roundRect(ctx, W / 2 - barW / 2, y, barW, 6, 3);
  ctx.fill();
  y += 70;

  // Big number stats - 2 columns
  const colLeft = W / 2 - 240;
  const colRight = W / 2 + 240;

  // Duration
  ctx.font = `900 110px ${FONT}`;
  ctx.fillStyle = textWhite;
  ctx.textAlign = 'center';
  ctx.fillText(formatDuration(props.data.duration), W / 2, y);
  ctx.font = `500 28px ${FONT}`;
  ctx.fillStyle = textMuted;
  ctx.fillText('DUREE', W / 2, y + 40);
  y += 120;

  // Volume
  ctx.font = `900 90px ${FONT}`;
  ctx.fillStyle = accent;
  ctx.fillText(formatVolume(props.data.totalVolume), W / 2, y);
  ctx.font = `500 28px ${FONT}`;
  ctx.fillStyle = textMuted;
  ctx.fillText('VOLUME TOTAL', W / 2, y + 40);
  y += 130;

  // Stats boxes
  const boxW = (W - MARGIN * 2 - 30) / 2;
  const boxH = 160;

  // Exercises box
  roundRect(ctx, MARGIN, y, boxW, boxH, 20);
  ctx.fillStyle = 'rgba(255,255,255,0.05)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.1)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.font = `900 68px ${FONT}`;
  ctx.fillStyle = textWhite;
  ctx.textAlign = 'center';
  ctx.fillText(String(props.data.exerciseCount), MARGIN + boxW / 2, y + 75);
  ctx.font = `500 26px ${FONT}`;
  ctx.fillStyle = textMuted;
  ctx.fillText('EXERCICES', MARGIN + boxW / 2, y + 115);

  // Sets box
  roundRect(ctx, MARGIN + boxW + 30, y, boxW, boxH, 20);
  ctx.fillStyle = 'rgba(255,255,255,0.05)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.1)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.font = `900 68px ${FONT}`;
  ctx.fillStyle = textWhite;
  ctx.textAlign = 'center';
  ctx.fillText(String(props.data.setCount), MARGIN + boxW + 30 + boxW / 2, y + 75);
  ctx.font = `500 26px ${FONT}`;
  ctx.fillStyle = textMuted;
  ctx.fillText('SERIES', MARGIN + boxW + 30 + boxW / 2, y + 115);

  y += boxH + 60;

  // PRs beaten
  if (props.data.prsBeaten > 0) {
    roundRect(ctx, MARGIN, y, W - MARGIN * 2, 100, 20);
    const prGrad = ctx.createLinearGradient(MARGIN, y, W - MARGIN, y);
    prGrad.addColorStop(0, 'rgba(233,69,96,0.2)');
    prGrad.addColorStop(1, 'rgba(15,52,96,0.2)');
    ctx.fillStyle = prGrad;
    ctx.fill();

    ctx.font = `700 44px ${FONT}`;
    ctx.fillStyle = accent;
    ctx.textAlign = 'center';
    const prText =
      props.data.prsBeaten === 1
        ? '\uD83C\uDFC6  1 RECORD BATTU'
        : `\uD83C\uDFC6  ${props.data.prsBeaten} RECORDS BATTUS`;
    ctx.fillText(prText, W / 2, y + 62);
    y += 130;
  }

  // Streak
  if (props.data.streak > 0) {
    ctx.font = `600 40px ${FONT}`;
    ctx.fillStyle = textWhite;
    ctx.textAlign = 'center';
    const streakText =
      props.data.streak === 1 ? '1 semaine de suite' : `${props.data.streak} semaines de suite`;
    ctx.fillText(streakText, W / 2, y + 20);
  }

  // Watermark
  ctx.font = `400 28px ${FONT}`;
  ctx.fillStyle = textMuted;
  ctx.textAlign = 'center';
  ctx.fillText('athletiq.fr', W / 2, H - 60);
}

// ============================
// TEMPLATE: DARK
// ============================
function drawDark(ctx: CanvasRenderingContext2D) {
  const bgColor = '#000000';
  const textWhite = '#f0f0f0';
  const textMuted = '#666666';
  const neonSand = '#d4a853';
  const neonGold = '#f0c957';

  // Pure black background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, W, H);

  // Subtle radial glow center
  const radGrad = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, 700);
  radGrad.addColorStop(0, 'rgba(212,168,83,0.04)');
  radGrad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = radGrad;
  ctx.fillRect(0, 0, W, H);

  // Top neon line
  const topLineGrad = ctx.createLinearGradient(MARGIN * 2, 0, W - MARGIN * 2, 0);
  topLineGrad.addColorStop(0, 'rgba(212,168,83,0)');
  topLineGrad.addColorStop(0.3, neonSand);
  topLineGrad.addColorStop(0.7, neonGold);
  topLineGrad.addColorStop(1, 'rgba(212,168,83,0)');
  ctx.fillStyle = topLineGrad;
  ctx.fillRect(MARGIN * 2, 80, W - MARGIN * 4, 2);

  // ATHLETIQ logo with glow
  ctx.shadowColor = neonSand;
  ctx.shadowBlur = 20;
  ctx.font = `300 44px ${FONT}`;
  ctx.fillStyle = neonSand;
  ctx.textAlign = 'center';
  ctx.letterSpacing = '14px';
  ctx.fillText('A T H L E T I Q', W / 2, 160);
  ctx.letterSpacing = '0px';
  ctx.shadowBlur = 0;

  // Date
  ctx.font = `300 30px ${FONT}`;
  ctx.fillStyle = textMuted;
  ctx.fillText(formatDateFrench(props.data.date), W / 2, 220);

  // Workout name
  ctx.font = `600 60px ${FONT}`;
  ctx.fillStyle = textWhite;
  const nameLines = wrapText(ctx, props.data.workoutName, W - MARGIN * 2);
  nameLines.forEach((line, i) => {
    ctx.fillText(line, W / 2, 340 + i * 74);
  });

  let y = 340 + nameLines.length * 74 + 60;

  // Neon accent dot
  ctx.shadowColor = neonGold;
  ctx.shadowBlur = 15;
  ctx.fillStyle = neonGold;
  ctx.beginPath();
  ctx.arc(W / 2, y, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  y += 60;

  // Duration
  ctx.font = `200 34px ${FONT}`;
  ctx.fillStyle = textMuted;
  ctx.textAlign = 'center';
  ctx.fillText('DUREE', W / 2, y);
  y += 65;

  ctx.shadowColor = neonSand;
  ctx.shadowBlur = 10;
  ctx.font = `600 100px ${FONT}`;
  ctx.fillStyle = neonSand;
  ctx.fillText(formatDuration(props.data.duration), W / 2, y);
  ctx.shadowBlur = 0;
  y += 80;

  // Volume
  ctx.font = `200 34px ${FONT}`;
  ctx.fillStyle = textMuted;
  ctx.fillText('VOLUME', W / 2, y);
  y += 65;

  ctx.font = `600 80px ${FONT}`;
  ctx.fillStyle = textWhite;
  ctx.fillText(formatVolume(props.data.totalVolume), W / 2, y);
  y += 90;

  // Stats with neon borders
  const boxW = (W - MARGIN * 2 - 40) / 2;
  const boxH = 150;

  // Exercises
  roundRect(ctx, MARGIN, y, boxW, boxH, 16);
  ctx.strokeStyle = 'rgba(212,168,83,0.3)';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = 'rgba(212,168,83,0.03)';
  ctx.fill();

  ctx.font = `600 64px ${FONT}`;
  ctx.fillStyle = neonGold;
  ctx.shadowColor = neonGold;
  ctx.shadowBlur = 8;
  ctx.textAlign = 'center';
  ctx.fillText(String(props.data.exerciseCount), MARGIN + boxW / 2, y + 72);
  ctx.shadowBlur = 0;
  ctx.font = `300 24px ${FONT}`;
  ctx.fillStyle = textMuted;
  ctx.fillText('exercices', MARGIN + boxW / 2, y + 112);

  // Sets
  roundRect(ctx, MARGIN + boxW + 40, y, boxW, boxH, 16);
  ctx.strokeStyle = 'rgba(212,168,83,0.3)';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = 'rgba(212,168,83,0.03)';
  ctx.fill();

  ctx.font = `600 64px ${FONT}`;
  ctx.fillStyle = neonGold;
  ctx.shadowColor = neonGold;
  ctx.shadowBlur = 8;
  ctx.textAlign = 'center';
  ctx.fillText(String(props.data.setCount), MARGIN + boxW + 40 + boxW / 2, y + 72);
  ctx.shadowBlur = 0;
  ctx.font = `300 24px ${FONT}`;
  ctx.fillStyle = textMuted;
  ctx.fillText('series', MARGIN + boxW + 40 + boxW / 2, y + 112);

  y += boxH + 60;

  // PRs beaten
  if (props.data.prsBeaten > 0) {
    ctx.shadowColor = neonGold;
    ctx.shadowBlur = 12;
    ctx.font = `600 46px ${FONT}`;
    ctx.fillStyle = neonGold;
    ctx.textAlign = 'center';
    const prText =
      props.data.prsBeaten === 1
        ? '\uD83C\uDFC6  1 record battu'
        : `\uD83C\uDFC6  ${props.data.prsBeaten} records battus`;
    ctx.fillText(prText, W / 2, y);
    ctx.shadowBlur = 0;
    y += 70;
  }

  // Streak
  if (props.data.streak > 0) {
    ctx.font = `400 36px ${FONT}`;
    ctx.fillStyle = textMuted;
    ctx.textAlign = 'center';
    const streakText =
      props.data.streak === 1 ? '1 semaine de suite' : `${props.data.streak} semaines de suite`;
    ctx.fillText(streakText, W / 2, y + 10);
  }

  // Bottom neon line
  const btmLineGrad = ctx.createLinearGradient(MARGIN * 2, 0, W - MARGIN * 2, 0);
  btmLineGrad.addColorStop(0, 'rgba(212,168,83,0)');
  btmLineGrad.addColorStop(0.3, neonSand);
  btmLineGrad.addColorStop(0.7, neonGold);
  btmLineGrad.addColorStop(1, 'rgba(212,168,83,0)');
  ctx.fillStyle = btmLineGrad;
  ctx.fillRect(MARGIN * 2, H - 120, W - MARGIN * 4, 1.5);

  // Watermark
  ctx.font = `300 26px ${FONT}`;
  ctx.fillStyle = textMuted;
  ctx.textAlign = 'center';
  ctx.fillText('athletiq.fr', W / 2, H - 70);
}

// ============================
// RENDERING ENGINE
// ============================
function render() {
  const canvas = canvasRef.value;
  if (!canvas) return;

  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  switch (selectedTemplate.value) {
    case 'minimal':
      drawMinimal(ctx);
      break;
    case 'bold':
      drawBold(ctx);
      break;
    case 'dark':
      drawDark(ctx);
      break;
  }

  previewUrl.value = canvas.toDataURL('image/png');
}

// ============================
// ACTIONS
// ============================
async function handleShare() {
  if (!previewUrl.value) return;

  try {
    const response = await fetch(previewUrl.value);
    const blob = await response.blob();
    const file = new File([blob], 'athletiq-story.png', { type: 'image/png' });

    if (navigator.share) {
      await navigator.share({
        title: `Athletiq - ${props.data.workoutName}`,
        files: [file],
      });
    } else {
      handleDownload();
    }
  } catch {
    handleDownload();
  }
}

function handleDownload() {
  if (!previewUrl.value) return;
  const a = document.createElement('a');
  a.href = previewUrl.value;
  a.download = 'athletiq-story.png';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// ============================
// LIFECYCLE
// ============================
onMounted(() => {
  nextTick(() => render());
});

watch(selectedTemplate, () => {
  nextTick(() => render());
});

watch(
  () => props.data,
  () => {
    nextTick(() => render());
  },
  { deep: true }
);

defineExpose({ render, handleShare, handleDownload });
</script>
