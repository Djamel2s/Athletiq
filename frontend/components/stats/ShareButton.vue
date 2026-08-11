<template>
  <button
    @click="handleShare"
    :disabled="generating"
    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-primary-500 dark:text-primary-400 hover:text-sand-700 hover:bg-sand-500/10 transition-all"
  >
    <div
      v-if="generating"
      class="w-3.5 h-3.5 border-2 border-primary-300 border-t-sand-700 rounded-full animate-spin"
    ></div>
    <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
      />
    </svg>
    Partager
  </button>
</template>

<script setup lang="ts">
const { t, locale } = useLocale();
const props = defineProps<{
  cardType: 'progression' | 'top5' | 'records' | 'goals' | 'overview';
  data: Record<string, any>;
  userName?: string;
}>();

const generating = ref(false);

// Design constants
const W = 1080;
const H = 1920;
const M = 72;
const FONT = 'system-ui, -apple-system, sans-serif';
const C = {
  bg1: '#1a1612',
  bg2: '#2a2318',
  bg3: '#1f1b16',
  sand: '#d4c4b0',
  sandLight: '#e8ddd0',
  sandDark: '#b8a48f',
  accent: '#9d8569',
  text: '#ffffff',
  textSoft: '#c8bfb5',
  textMuted: '#7a7068',
  cardBg: 'rgba(212, 196, 176, 0.06)',
  cardBorder: 'rgba(212, 196, 176, 0.12)',
};

const roundRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) => {
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
};

const drawBg = (ctx: CanvasRenderingContext2D) => {
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, C.bg1);
  grad.addColorStop(0.5, C.bg3);
  grad.addColorStop(1, C.bg2);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 4000; i++) {
    ctx.fillStyle = `rgba(212, 196, 176, ${Math.random() * 0.015})`;
    ctx.fillRect(Math.random() * W, Math.random() * H, 1, 1);
  }
  const lg = ctx.createLinearGradient(M, 0, W - M, 0);
  lg.addColorStop(0, 'rgba(212,196,176,0)');
  lg.addColorStop(0.3, C.sandDark);
  lg.addColorStop(0.7, C.sandDark);
  lg.addColorStop(1, 'rgba(212,196,176,0)');
  ctx.fillStyle = lg;
  ctx.fillRect(M, 48, W - M * 2, 2);
};

const drawHeader = (ctx: CanvasRenderingContext2D) => {
  ctx.font = `600 42px ${FONT}`;
  ctx.fillStyle = C.sand;
  ctx.textAlign = 'center';
  ctx.letterSpacing = '8px';
  ctx.fillText('A T H L E T I Q', W / 2, 110);
  ctx.letterSpacing = '0px';
};

const drawFooter = (ctx: CanvasRenderingContext2D) => {
  const lg = ctx.createLinearGradient(M, 0, W - M, 0);
  lg.addColorStop(0, 'rgba(212,196,176,0)');
  lg.addColorStop(0.3, 'rgba(212,196,176,0.3)');
  lg.addColorStop(0.7, 'rgba(212,196,176,0.3)');
  lg.addColorStop(1, 'rgba(212,196,176,0)');
  ctx.fillStyle = lg;
  ctx.fillRect(M, H - 130, W - M * 2, 1);
  if (props.userName) {
    ctx.font = `600 30px ${FONT}`;
    ctx.fillStyle = C.sand;
    ctx.textAlign = 'left';
    ctx.fillText(props.userName, M, H - 80);
  }
  ctx.font = `400 28px ${FONT}`;
  ctx.fillStyle = C.textMuted;
  ctx.textAlign = 'right';
  ctx.fillText('athletiq.fr', W - M, H - 80);
};

const drawStatBox = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  bw: number,
  bh: number,
  value: string,
  label: string,
  unit?: string
) => {
  roundRect(ctx, x, y, bw, bh, 16);
  ctx.fillStyle = C.cardBg;
  ctx.fill();
  ctx.strokeStyle = C.cardBorder;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  if (unit) {
    // Draw value and unit separately to avoid overlap
    ctx.font = `700 48px ${FONT}`;
    ctx.fillStyle = C.text;
    const valW = ctx.measureText(value).width;
    ctx.font = `400 28px ${FONT}`;
    const unitW = ctx.measureText(unit).width;
    const totalW = valW + 6 + unitW;
    const startX = x + (bw - totalW) / 2;
    ctx.font = `700 48px ${FONT}`;
    ctx.fillStyle = C.text;
    ctx.textAlign = 'left';
    ctx.fillText(value, startX, y + bh / 2 - 4);
    ctx.font = `400 28px ${FONT}`;
    ctx.fillStyle = C.sandDark;
    ctx.fillText(unit, startX + valW + 6, y + bh / 2 - 4);
  } else {
    ctx.font = `700 48px ${FONT}`;
    ctx.fillStyle = C.text;
    ctx.textAlign = 'center';
    ctx.fillText(value, x + bw / 2, y + bh / 2 - 4);
  }

  ctx.font = `400 22px ${FONT}`;
  ctx.fillStyle = C.textMuted;
  ctx.textAlign = 'center';
  ctx.fillText(label, x + bw / 2, y + bh / 2 + 34);
};

// ────── Card Renderers ──────

const drawOverview = (ctx: CanvasRenderingContext2D) => {
  const d = props.data;
  drawBg(ctx);
  drawHeader(ctx);

  // Title
  ctx.font = `700 64px ${FONT}`;
  ctx.fillStyle = C.text;
  ctx.textAlign = 'center';
  ctx.fillText(t('shareButton.myProgress'), W / 2, 220);

  ctx.font = `400 32px ${FONT}`;
  ctx.fillStyle = C.textMuted;
  ctx.fillText(d.period || t('shareButton.sinceStart'), W / 2, 270);

  // Big number - total workouts
  ctx.font = `800 220px ${FONT}`;
  ctx.fillStyle = C.sand;
  ctx.fillText(String(d.totalWorkouts || 0), W / 2, 530);
  ctx.font = `500 44px ${FONT}`;
  ctx.fillStyle = C.sandDark;
  ctx.fillText(t('shareButton.workoutsUpper'), W / 2, 590);

  // Separator
  ctx.fillStyle = C.cardBorder;
  ctx.fillRect(W / 2 - 120, 630, 240, 1);

  // Stats grid 2x2
  const bw = 440,
    bh = 150,
    gap = 24;
  const startX = (W - bw * 2 - gap) / 2;
  const startY = 680;

  drawStatBox(ctx, startX, startY, bw, bh, d.calories || '0', t('shareButton.caloriesBurned'));
  drawStatBox(
    ctx,
    startX + bw + gap,
    startY,
    bw,
    bh,
    d.totalTime || '0h',
    t('shareButton.totalTime')
  );
  drawStatBox(
    ctx,
    startX,
    startY + bh + gap,
    bw,
    bh,
    d.avgDuration || '0min',
    t('shareButton.avgDuration')
  );
  drawStatBox(
    ctx,
    startX + bw + gap,
    startY + bh + gap,
    bw,
    bh,
    String(d.streak || 0),
    t('shareButton.currentStreak')
  );

  // Volume - value and unit drawn separately
  const volStr = `${d.totalVolume || '0'}`;
  const volUnit = ' kg';
  ctx.font = `700 56px ${FONT}`;
  const volValW = ctx.measureText(volStr).width;
  ctx.font = `400 32px ${FONT}`;
  const volUnitW = ctx.measureText(volUnit).width;
  const volTotalW = volValW + volUnitW;
  const volStartX = (W - volTotalW) / 2;
  const volY = startY + bh * 2 + gap * 2 + 100;
  ctx.font = `700 56px ${FONT}`;
  ctx.fillStyle = C.sand;
  ctx.textAlign = 'left';
  ctx.fillText(volStr, volStartX, volY);
  ctx.font = `400 32px ${FONT}`;
  ctx.fillStyle = C.sandDark;
  ctx.fillText(volUnit, volStartX + volValW, volY);
  ctx.font = `400 28px ${FONT}`;
  ctx.fillStyle = C.textMuted;
  ctx.textAlign = 'center';
  ctx.fillText(t('shareButton.totalVolumeLifted'), W / 2, volY + 45);

  drawFooter(ctx);
};

const drawTop5 = (ctx: CanvasRenderingContext2D) => {
  const exercises = props.data.exercises || [];
  drawBg(ctx);
  drawHeader(ctx);

  ctx.font = `700 64px ${FONT}`;
  ctx.fillStyle = C.text;
  ctx.textAlign = 'center';
  ctx.fillText(t('shareButton.top5Exercises'), W / 2, 220);

  const startY = 320;
  const rowH = 160;
  const rowW = W - M * 2;

  exercises.slice(0, 5).forEach((ex: any, i: number) => {
    const y = startY + i * (rowH + 20);

    // Row background
    roundRect(ctx, M, y, rowW, rowH, 20);
    ctx.fillStyle = i === 0 ? 'rgba(212, 196, 176, 0.12)' : C.cardBg;
    ctx.fill();
    ctx.strokeStyle = C.cardBorder;
    ctx.lineWidth = 1;
    ctx.stroke();

    // Rank badge
    const badgeSize = 64;
    const badgeX = M + 30;
    const badgeY = y + (rowH - badgeSize) / 2;
    roundRect(ctx, badgeX, badgeY, badgeSize, badgeSize, 16);
    const g = ctx.createLinearGradient(badgeX, badgeY, badgeX + badgeSize, badgeY + badgeSize);
    g.addColorStop(0, C.sand);
    g.addColorStop(1, C.accent);
    ctx.fillStyle = g;
    ctx.fill();
    ctx.font = `800 32px ${FONT}`;
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.fillText(String(i + 1), badgeX + badgeSize / 2, badgeY + badgeSize / 2 + 11);

    // Exercise name
    ctx.font = `600 36px ${FONT}`;
    ctx.fillStyle = C.text;
    ctx.textAlign = 'left';
    ctx.fillText(ex.name, badgeX + badgeSize + 28, y + rowH / 2 - 8);

    // Count
    ctx.font = `400 26px ${FONT}`;
    ctx.fillStyle = C.textMuted;
    ctx.fillText(`${ex.count} seances`, badgeX + badgeSize + 28, y + rowH / 2 + 28);

    // Count on right
    ctx.font = `700 40px ${FONT}`;
    ctx.fillStyle = C.sand;
    ctx.textAlign = 'right';
    ctx.fillText(`${ex.count}x`, W - M - 30, y + rowH / 2 + 12);
  });

  drawFooter(ctx);
};

const drawRecords = (ctx: CanvasRenderingContext2D) => {
  const records = props.data.records || [];
  drawBg(ctx);
  drawHeader(ctx);

  ctx.font = `700 64px ${FONT}`;
  ctx.fillStyle = C.text;
  ctx.textAlign = 'center';
  ctx.fillText(t('shareButton.personalRecords'), W / 2, 220);

  // Star icon
  ctx.font = `400 28px ${FONT}`;
  ctx.fillStyle = C.textMuted;
  ctx.fillText(t('shareButton.bestPerformances'), W / 2, 268);

  const startY = 340;
  const cardW = (W - M * 2 - 24) / 2;
  const cardH = 220;
  const gap = 24;

  records.slice(0, 6).forEach((r: any, i: number) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = M + col * (cardW + gap);
    const y = startY + row * (cardH + gap);

    roundRect(ctx, x, y, cardW, cardH, 20);
    ctx.fillStyle = C.cardBg;
    ctx.fill();
    ctx.strokeStyle = C.cardBorder;
    ctx.lineWidth = 1;
    ctx.stroke();

    // Exercise name
    ctx.font = `600 28px ${FONT}`;
    ctx.fillStyle = C.textSoft;
    ctx.textAlign = 'left';
    const name =
      (r.exerciseName || '').length > 18
        ? (r.exerciseName || '').substring(0, 18) + '...'
        : r.exerciseName || '';
    ctx.fillText(name, x + 28, y + 50);

    // Weight - big
    ctx.font = `800 72px ${FONT}`;
    ctx.fillStyle = C.sand;
    ctx.textAlign = 'left';
    const weightStr = `${r.maxWeight || 0}`;
    const weightWidth = ctx.measureText(weightStr).width;
    ctx.fillText(weightStr, x + 28, y + 138);
    ctx.font = `500 32px ${FONT}`;
    ctx.fillStyle = C.sandDark;
    ctx.fillText('kg', x + 28 + weightWidth + 8, y + 138);

    // Reps + date
    ctx.font = `400 22px ${FONT}`;
    ctx.fillStyle = C.textMuted;
    ctx.textAlign = 'left';
    ctx.fillText(`${r.reps || 0} reps`, x + 28, y + 180);

    if (r.date) {
      ctx.textAlign = 'right';
      const d = new Date(r.date);
      const dateStr = new Intl.DateTimeFormat(locale.value === 'fr' ? 'fr-FR' : 'en-US', {
        day: 'numeric',
        month: 'short',
      }).format(d);
      ctx.fillText(dateStr, x + cardW - 28, y + 180);
    }
  });

  drawFooter(ctx);
};

const drawGoals = (ctx: CanvasRenderingContext2D) => {
  const goals = props.data.goals || [];
  drawBg(ctx);
  drawHeader(ctx);

  ctx.font = `700 64px ${FONT}`;
  ctx.fillStyle = C.text;
  ctx.textAlign = 'center';
  ctx.fillText(t('shareButton.myGoals'), W / 2, 220);

  const achieved = goals.filter((g: any) => g.achieved).length;
  const total = goals.length;
  ctx.font = `400 30px ${FONT}`;
  ctx.fillStyle = C.textMuted;
  ctx.fillText(`${achieved}/${total} atteints`, W / 2, 270);

  const startY = 340;
  const rowH = 180;
  const rowW = W - M * 2;

  goals.slice(0, 6).forEach((g: any, i: number) => {
    const y = startY + i * (rowH + 20);
    roundRect(ctx, M, y, rowW, rowH, 20);
    ctx.fillStyle = g.achieved ? 'rgba(212, 196, 176, 0.1)' : C.cardBg;
    ctx.fill();
    ctx.strokeStyle = C.cardBorder;
    ctx.lineWidth = 1;
    ctx.stroke();

    // Title
    ctx.font = `600 34px ${FONT}`;
    ctx.fillStyle = C.text;
    ctx.textAlign = 'left';
    ctx.fillText(g.title || '', M + 30, y + 50);

    // Progress bar
    const barX = M + 30,
      barY = y + 75,
      barW = rowW - 60,
      barH = 16;
    roundRect(ctx, barX, barY, barW, barH, 8);
    ctx.fillStyle = 'rgba(212, 196, 176, 0.1)';
    ctx.fill();

    const progress = g.achieved ? 1 : Math.min(1, Math.max(0, g.progress || 0));
    if (progress > 0) {
      roundRect(ctx, barX, barY, barW * progress, barH, 8);
      const pg = ctx.createLinearGradient(barX, barY, barX + barW * progress, barY);
      pg.addColorStop(0, C.sand);
      pg.addColorStop(1, C.accent);
      ctx.fillStyle = pg;
      ctx.fill();
    }

    // Progress text
    ctx.font = `700 28px ${FONT}`;
    ctx.fillStyle = g.achieved ? C.sand : C.textSoft;
    ctx.textAlign = 'left';
    ctx.fillText(
      g.achieved ? t('streak.achieved') : `${Math.round(progress * 100)}%`,
      M + 30,
      y + 140
    );

    // Target value on right
    ctx.font = `400 26px ${FONT}`;
    ctx.fillStyle = C.textMuted;
    ctx.textAlign = 'right';
    ctx.fillText(`Objectif: ${g.targetValue}${g.unit || ''}`, W - M - 30, y + 140);
  });

  drawFooter(ctx);
};

const drawProgression = (ctx: CanvasRenderingContext2D) => {
  const d = props.data;
  drawBg(ctx);
  drawHeader(ctx);

  ctx.font = `700 64px ${FONT}`;
  ctx.fillStyle = C.text;
  ctx.textAlign = 'center';
  ctx.fillText(t('progressionChart.progress'), W / 2, 220);

  ctx.font = `400 30px ${FONT}`;
  ctx.fillStyle = C.textMuted;
  ctx.fillText(d.exerciseName || t('shareButton.allExercises'), W / 2, 270);

  // Draw simple chart
  const points: { date: string; weight: number }[] = d.points || [];
  if (points.length < 2) {
    ctx.font = `400 36px ${FONT}`;
    ctx.fillStyle = C.textMuted;
    ctx.fillText(t('shareButton.notEnoughData'), W / 2, H / 2);
    drawFooter(ctx);
    return;
  }

  const chartX = M + 20,
    chartY = 360,
    chartW = W - M * 2 - 40,
    chartH = 800;
  const maxW = Math.max(...points.map((p) => p.weight));
  const minW = Math.min(...points.map((p) => p.weight));
  const range = maxW - minW || 1;

  // Y axis labels
  ctx.font = `400 24px ${FONT}`;
  ctx.fillStyle = C.textMuted;
  ctx.textAlign = 'right';
  for (let i = 0; i <= 4; i++) {
    const val = Math.round(minW + (range * i) / 4);
    const ly = chartY + chartH - (chartH * i) / 4;
    ctx.fillText(`${val}kg`, chartX - 12, ly + 8);
    // Grid line
    ctx.strokeStyle = 'rgba(212, 196, 176, 0.06)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(chartX, ly);
    ctx.lineTo(chartX + chartW, ly);
    ctx.stroke();
  }

  // Draw line
  ctx.beginPath();
  ctx.strokeStyle = C.sand;
  ctx.lineWidth = 4;
  points.forEach((p, i) => {
    const x = chartX + (i / (points.length - 1)) * chartW;
    const y = chartY + chartH - ((p.weight - minW) / range) * chartH;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Area fill
  ctx.lineTo(chartX + chartW, chartY + chartH);
  ctx.lineTo(chartX, chartY + chartH);
  ctx.closePath();
  const ag = ctx.createLinearGradient(0, chartY, 0, chartY + chartH);
  ag.addColorStop(0, 'rgba(212, 196, 176, 0.2)');
  ag.addColorStop(1, 'rgba(212, 196, 176, 0)');
  ctx.fillStyle = ag;
  ctx.fill();

  // Dots on line
  points.forEach((p, i) => {
    const x = chartX + (i / (points.length - 1)) * chartW;
    const y = chartY + chartH - ((p.weight - minW) / range) * chartH;
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fillStyle = C.sand;
    ctx.fill();
  });

  // X axis labels (first and last date)
  ctx.font = `400 22px ${FONT}`;
  ctx.fillStyle = C.textMuted;
  ctx.textAlign = 'center';
  if (points[0]?.date) {
    const d1 = new Intl.DateTimeFormat(locale.value === 'fr' ? 'fr-FR' : 'en-US', {
      day: 'numeric',
      month: 'short',
    }).format(new Date(points[0].date));
    ctx.fillText(d1, chartX, chartY + chartH + 40);
  }
  if (points[points.length - 1]?.date) {
    const d2 = new Intl.DateTimeFormat(locale.value === 'fr' ? 'fr-FR' : 'en-US', {
      day: 'numeric',
      month: 'short',
    }).format(new Date(points[points.length - 1].date));
    ctx.fillText(d2, chartX + chartW, chartY + chartH + 40);
  }

  // Summary stats below chart
  const sumY = chartY + chartH + 100;
  const bw = 280,
    bh = 130,
    gap = 28;
  const totalBw = 3 * bw + 2 * gap;
  const sx = (W - totalBw) / 2;
  drawStatBox(
    ctx,
    sx,
    sumY,
    bw,
    bh,
    `${points[points.length - 1]?.weight || 0}`,
    t('shareButton.current'),
    'kg'
  );
  drawStatBox(ctx, sx + bw + gap, sumY, bw, bh, `${maxW}`, 'Max', 'kg');
  const diff =
    points.length >= 2
      ? Math.round((points[points.length - 1].weight - points[0].weight) * 10) / 10
      : 0;
  drawStatBox(
    ctx,
    sx + 2 * (bw + gap),
    sumY,
    bw,
    bh,
    `${diff > 0 ? '+' : ''}${diff}`,
    t('progressionChart.progress'),
    'kg'
  );

  drawFooter(ctx);
};

// ────── Main ──────

const handleShare = async () => {
  generating.value = true;
  try {
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    switch (props.cardType) {
      case 'overview':
        drawOverview(ctx);
        break;
      case 'top5':
        drawTop5(ctx);
        break;
      case 'records':
        drawRecords(ctx);
        break;
      case 'goals':
        drawGoals(ctx);
        break;
      case 'progression':
        drawProgression(ctx);
        break;
    }

    canvas.toBlob(async (blob) => {
      if (!blob) return;

      const fileName = `athletiq-${props.cardType}.png`;

      if (navigator.share) {
        try {
          const file = new File([blob], fileName, { type: 'image/png' });
          await navigator.share({ title: t('shareButton.myStatsTitle'), files: [file] });
        } catch {
          downloadBlob(blob, fileName);
        }
      } else {
        downloadBlob(blob, fileName);
      }
      generating.value = false;
    }, 'image/png');
  } catch {
    generating.value = false;
  }
};

const downloadBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
</script>
