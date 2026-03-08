<template>
  <div>
    <!-- Hidden canvas for generation -->
    <canvas ref="canvasRef" class="hidden" :width="cardWidth" :height="cardHeight"></canvas>

    <!-- Preview -->
    <div v-if="previewUrl" class="relative">
      <img :src="previewUrl" :alt="title" class="w-full rounded-2xl shadow-lg" />

      <!-- Action buttons -->
      <div class="flex gap-3 mt-4">
        <button @click="share" class="flex-1 btn-primary flex items-center justify-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
          </svg>
          Partager
        </button>
        <button @click="download" class="flex-1 btn-outline flex items-center justify-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          Telecharger
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  type: 'streak' | 'recap' | 'beforeAfter'
  title: string
  data: Record<string, any>
  beforeImage?: string
  afterImage?: string
}>()

const emit = defineEmits<{
  generated: [url: string]
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const previewUrl = ref<string | null>(null)

const cardWidth = 1080
const cardHeight = computed(() => props.type === 'beforeAfter' ? 1350 : 1920)

// --- Design System ---
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
}

const MARGIN = 72
const FONT = 'system-ui, -apple-system, sans-serif'

// --- Drawing helpers ---
const roundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

const drawBg = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
  // Gradient background
  const grad = ctx.createLinearGradient(0, 0, 0, h)
  grad.addColorStop(0, C.bg1)
  grad.addColorStop(0.5, C.bg3)
  grad.addColorStop(1, C.bg2)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, w, h)

  // Subtle noise texture
  for (let i = 0; i < 4000; i++) {
    ctx.fillStyle = `rgba(212, 196, 176, ${Math.random() * 0.015})`
    ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1)
  }

  // Top accent line
  const lineGrad = ctx.createLinearGradient(MARGIN, 0, w - MARGIN, 0)
  lineGrad.addColorStop(0, 'rgba(212, 196, 176, 0)')
  lineGrad.addColorStop(0.3, C.sandDark)
  lineGrad.addColorStop(0.7, C.sandDark)
  lineGrad.addColorStop(1, 'rgba(212, 196, 176, 0)')
  ctx.fillStyle = lineGrad
  ctx.fillRect(MARGIN, 48, w - MARGIN * 2, 2)
}

const drawHeader = (ctx: CanvasRenderingContext2D, w: number) => {
  // ATHLETIQ wordmark - top center
  ctx.font = `600 42px ${FONT}`
  ctx.fillStyle = C.sand
  ctx.textAlign = 'center'
  ctx.letterSpacing = '8px'
  ctx.fillText('A T H L E T I Q', w / 2, 110)
  ctx.letterSpacing = '0px'
}

const drawFooter = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
  // Bottom accent line
  const lineGrad = ctx.createLinearGradient(MARGIN, 0, w - MARGIN, 0)
  lineGrad.addColorStop(0, 'rgba(212, 196, 176, 0)')
  lineGrad.addColorStop(0.3, 'rgba(212, 196, 176, 0.3)')
  lineGrad.addColorStop(0.7, 'rgba(212, 196, 176, 0.3)')
  lineGrad.addColorStop(1, 'rgba(212, 196, 176, 0)')
  ctx.fillStyle = lineGrad
  ctx.fillRect(MARGIN, h - 130, w - MARGIN * 2, 1)

  // Username (left) + site (right)
  const footerY = h - 80
  if (props.data.userName) {
    ctx.font = `600 30px ${FONT}`
    ctx.fillStyle = C.sand
    ctx.textAlign = 'left'
    ctx.fillText(props.data.userName, MARGIN, footerY)
  }

  ctx.font = `400 28px ${FONT}`
  ctx.fillStyle = C.textMuted
  ctx.textAlign = 'right'
  ctx.fillText('athletiq.app', w - MARGIN, footerY)
}

const drawStatBox = (ctx: CanvasRenderingContext2D, x: number, y: number, bw: number, bh: number, value: string, label: string) => {
  roundRect(ctx, x, y, bw, bh, 16)
  ctx.fillStyle = C.cardBg
  ctx.fill()
  ctx.strokeStyle = C.cardBorder
  ctx.lineWidth = 1.5
  ctx.stroke()

  ctx.font = `700 52px ${FONT}`
  ctx.fillStyle = C.text
  ctx.textAlign = 'center'
  ctx.fillText(value, x + bw / 2, y + bh / 2 - 4)

  ctx.font = `400 24px ${FONT}`
  ctx.fillStyle = C.textMuted
  ctx.fillText(label, x + bw / 2, y + bh / 2 + 36)
}

// --- Card renderers ---
const drawStreakCard = (ctx: CanvasRenderingContext2D) => {
  const w = cardWidth
  const h = cardHeight.value
  drawBg(ctx, w, h)
  drawHeader(ctx, w)

  // Streak section - centered vertically in upper area
  const streak = props.data.streak || 0

  // Large streak number
  ctx.font = `800 260px ${FONT}`
  ctx.fillStyle = C.sand
  ctx.textAlign = 'center'
  ctx.fillText(String(streak), w / 2, 460)

  // Label below number
  ctx.font = `500 48px ${FONT}`
  ctx.fillStyle = C.sandDark
  const label = streak > 1 ? 'SEMAINES DE SUITE' : 'SEMAINE DE SUITE'
  ctx.fillText(label, w / 2, 530)

  // Thin separator
  ctx.fillStyle = C.cardBorder
  ctx.fillRect(w / 2 - 120, 580, 240, 1)

  // Motivation quote
  const msg = props.data.message || 'La regularite fait la difference.'
  ctx.font = `italic 32px ${FONT}`
  ctx.fillStyle = C.textSoft
  ctx.textAlign = 'center'
  ctx.fillText(`"${msg}"`, w / 2, 640)

  // Stats row (3 boxes)
  const statsY = 720
  const boxW = 280
  const boxH = 140
  const gap = 28
  const totalW = 3 * boxW + 2 * gap
  const startX = (w - totalW) / 2

  const stats = [
    { value: String(props.data.totalWorkouts || 0), label: 'Seances' },
    { value: `${props.data.totalHours || 0}h`, label: 'Heures' },
    { value: `${props.data.bestStreak || 0} sem`, label: 'Record' },
  ]

  stats.forEach((stat, i) => {
    drawStatBox(ctx, startX + i * (boxW + gap), statsY, boxW, boxH, stat.value, stat.label)
  })

  // Heatmap section
  if (props.data.weeklyHistory?.length) {
    const hmY = 960
    ctx.font = `600 26px ${FONT}`
    ctx.fillStyle = C.textMuted
    ctx.textAlign = 'center'
    ctx.fillText('12 DERNIERES SEMAINES', w / 2, hmY)

    const weeks = (props.data.weeklyHistory as any[]).slice(-12)
    const cellSize = 56
    const cellGap = 12
    const totalCellW = weeks.length * (cellSize + cellGap) - cellGap
    const cellStartX = (w - totalCellW) / 2

    weeks.forEach((week: any, i: number) => {
      const x = cellStartX + i * (cellSize + cellGap)
      const y = hmY + 24

      roundRect(ctx, x, y, cellSize, cellSize, 10)
      if (week.metGoal) {
        const grad = ctx.createLinearGradient(x, y, x + cellSize, y + cellSize)
        grad.addColorStop(0, C.sand)
        grad.addColorStop(1, C.accent)
        ctx.fillStyle = grad
      } else if (week.count > 0) {
        ctx.fillStyle = 'rgba(212, 196, 176, 0.25)'
      } else {
        ctx.fillStyle = 'rgba(212, 196, 176, 0.06)'
      }
      ctx.fill()

      if (week.count > 0) {
        ctx.font = `700 22px ${FONT}`
        ctx.fillStyle = week.metGoal ? C.bg1 : C.sandDark
        ctx.textAlign = 'center'
        ctx.fillText(String(week.count), x + cellSize / 2, y + cellSize / 2 + 7)
      }
    })

    // Legend
    const legendY = hmY + 24 + cellSize + 24
    ctx.font = `400 20px ${FONT}`
    ctx.fillStyle = C.textMuted
    ctx.textAlign = 'center'

    // Empty square
    roundRect(ctx, w / 2 - 180, legendY, 16, 16, 4)
    ctx.fillStyle = 'rgba(212, 196, 176, 0.06)'
    ctx.fill()
    ctx.fillStyle = C.textMuted
    ctx.textAlign = 'left'
    ctx.fillText('0', w / 2 - 158, legendY + 13)

    // Partial square
    roundRect(ctx, w / 2 - 100, legendY, 16, 16, 4)
    ctx.fillStyle = 'rgba(212, 196, 176, 0.25)'
    ctx.fill()
    ctx.fillStyle = C.textMuted
    ctx.textAlign = 'left'
    ctx.fillText('Partiel', w / 2 - 78, legendY + 13)

    // Goal met square
    roundRect(ctx, w / 2 + 20, legendY, 16, 16, 4)
    const lgGrad = ctx.createLinearGradient(w / 2 + 20, legendY, w / 2 + 36, legendY + 16)
    lgGrad.addColorStop(0, C.sand)
    lgGrad.addColorStop(1, C.accent)
    ctx.fillStyle = lgGrad
    ctx.fill()
    ctx.fillStyle = C.textMuted
    ctx.textAlign = 'left'
    ctx.fillText('Objectif', w / 2 + 42, legendY + 13)
  }

  drawFooter(ctx, w, h)
}

const drawRecapCard = (ctx: CanvasRenderingContext2D) => {
  const w = cardWidth
  const h = cardHeight.value
  drawBg(ctx, w, h)
  drawHeader(ctx, w)

  // Subtitle
  ctx.font = `500 30px ${FONT}`
  ctx.fillStyle = C.textMuted
  ctx.textAlign = 'center'
  ctx.fillText('RECAP DE LA SEMAINE', w / 2, 180)

  // Week label
  ctx.font = `700 44px ${FONT}`
  ctx.fillStyle = C.sand
  ctx.fillText(props.data.weekLabel || 'Cette semaine', w / 2, 240)

  // Stats grid (2x3)
  const gridY = 310
  const gridStats = [
    { value: String(props.data.totalWorkouts || 0), label: 'Seances' },
    { value: props.data.totalDurationFormatted || '0min', label: 'Duree totale' },
    { value: `${(props.data.totalCalories || 0).toLocaleString('fr-FR')}`, label: 'Calories' },
    { value: `${((props.data.totalVolume || 0) / 1000).toFixed(1)}T`, label: 'Volume total' },
    { value: String(props.data.exerciseCount || 0), label: 'Exercices' },
    { value: String(props.data.prsAchieved || 0), label: 'Records' },
  ]

  const cols = 2
  const cellW = 440
  const cellH = 160
  const gapX = 36
  const gapY = 24
  const gridStartX = (w - (cols * cellW + (cols - 1) * gapX)) / 2

  gridStats.forEach((stat, i) => {
    const col = i % cols
    const row = Math.floor(i / cols)
    const x = gridStartX + col * (cellW + gapX)
    const y = gridY + row * (cellH + gapY)

    drawStatBox(ctx, x, y, cellW, cellH, stat.value, stat.label)
  })

  // Muscles trained
  const musclesY = gridY + 3 * (cellH + gapY) + 30
  if (props.data.musclesTrained?.length) {
    ctx.font = `600 26px ${FONT}`
    ctx.fillStyle = C.textMuted
    ctx.textAlign = 'center'
    ctx.fillText('MUSCLES TRAVAILLES', w / 2, musclesY)

    const muscles = props.data.musclesTrained as string[]
    const pillGap = 14
    const pillH = 48
    const pillFont = `500 26px ${FONT}`
    ctx.font = pillFont

    const pillWidths = muscles.map(m => ctx.measureText(m).width + 36)
    const totalPillW = pillWidths.reduce((s, pw) => s + pw + pillGap, -pillGap)
    let px = (w - Math.min(totalPillW, w - MARGIN * 2)) / 2

    muscles.forEach((muscle, i) => {
      const pw = pillWidths[i]
      const py = musclesY + 16

      roundRect(ctx, px, py, pw, pillH, pillH / 2)
      ctx.fillStyle = C.cardBg
      ctx.fill()
      ctx.strokeStyle = C.cardBorder
      ctx.lineWidth = 1
      ctx.stroke()

      ctx.font = pillFont
      ctx.fillStyle = C.sand
      ctx.textAlign = 'center'
      ctx.fillText(muscle, px + pw / 2, py + 33)

      px += pw + pillGap
    })
  }

  // Streak badge at bottom
  const badgeY = h - 280
  const badgeW = 400
  const badgeH = 100
  const badgeX = (w - badgeW) / 2

  roundRect(ctx, badgeX, badgeY, badgeW, badgeH, 20)
  ctx.fillStyle = C.cardBg
  ctx.fill()
  ctx.strokeStyle = C.cardBorder
  ctx.lineWidth = 1.5
  ctx.stroke()

  // Flame icon (SVG path approximation via filled shape)
  const flameX = badgeX + 50
  const flameY = badgeY + badgeH / 2
  ctx.fillStyle = C.sand
  ctx.beginPath()
  ctx.arc(flameX, flameY, 18, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = C.bg1
  ctx.font = `700 20px ${FONT}`
  ctx.textAlign = 'center'
  ctx.fillText('S', flameX, flameY + 7)

  ctx.font = `700 48px ${FONT}`
  ctx.fillStyle = C.text
  ctx.textAlign = 'center'
  ctx.fillText(String(props.data.currentStreak || 0), badgeX + badgeW / 2 + 10, badgeY + badgeH / 2 + 6)

  ctx.font = `400 22px ${FONT}`
  ctx.fillStyle = C.textMuted
  ctx.fillText('sem. de suite', badgeX + badgeW / 2 + 10, badgeY + badgeH / 2 + 36)

  drawFooter(ctx, w, h)
}

const drawBeforeAfterCard = async (ctx: CanvasRenderingContext2D) => {
  const w = cardWidth
  const h = cardHeight.value
  drawBg(ctx, w, h)
  drawHeader(ctx, w)

  // Subtitle
  ctx.font = `500 32px ${FONT}`
  ctx.fillStyle = C.textMuted
  ctx.textAlign = 'center'
  ctx.fillText('MA TRANSFORMATION', w / 2, 180)

  // Load and draw images
  const imgGap = 24
  const imgW = (w - MARGIN * 2 - imgGap) / 2
  const imgH = 780
  const imgY = 220

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = src
    })
  }

  const drawImg = async (src: string | undefined, x: number) => {
    if (!src) return
    try {
      const img = await loadImage(src)
      roundRect(ctx, x, imgY, imgW, imgH, 16)
      ctx.save()
      ctx.clip()
      const scale = Math.max(imgW / img.width, imgH / img.height)
      const dx = (imgW - img.width * scale) / 2
      const dy = (imgH - img.height * scale) / 2
      ctx.drawImage(img, x + dx, imgY + dy, img.width * scale, img.height * scale)
      ctx.restore()
    } catch { /* skip */ }
  }

  await drawImg(props.beforeImage, MARGIN)
  await drawImg(props.afterImage, MARGIN + imgW + imgGap)

  // Labels under images
  const labelY = imgY + imgH + 40
  ctx.font = `600 32px ${FONT}`

  ctx.fillStyle = C.textMuted
  ctx.textAlign = 'center'
  ctx.fillText('AVANT', MARGIN + imgW / 2, labelY)

  ctx.fillStyle = C.sand
  ctx.fillText('APRES', MARGIN + imgW + imgGap + imgW / 2, labelY)

  // Dates
  ctx.font = `400 24px ${FONT}`
  ctx.fillStyle = C.textMuted
  if (props.data.beforeDate) {
    ctx.textAlign = 'center'
    ctx.fillText(props.data.beforeDate, MARGIN + imgW / 2, labelY + 36)
  }
  if (props.data.afterDate) {
    ctx.textAlign = 'center'
    ctx.fillText(props.data.afterDate, MARGIN + imgW + imgGap + imgW / 2, labelY + 36)
  }

  drawFooter(ctx, w, h)
}

// --- Generate & actions ---
const generate = async () => {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  canvas.width = cardWidth
  canvas.height = cardHeight.value

  if (props.type === 'streak') {
    drawStreakCard(ctx)
  } else if (props.type === 'recap') {
    drawRecapCard(ctx)
  } else if (props.type === 'beforeAfter') {
    await drawBeforeAfterCard(ctx)
  }

  previewUrl.value = canvas.toDataURL('image/png')
  emit('generated', previewUrl.value)
}

const share = async () => {
  if (!previewUrl.value) return

  try {
    const response = await fetch(previewUrl.value)
    const blob = await response.blob()
    const file = new File([blob], `athletiq-${props.type}.png`, { type: 'image/png' })

    if (navigator.share) {
      await navigator.share({
        title: props.title,
        files: [file]
      })
    } else {
      download()
    }
  } catch (err) {
    download()
  }
}

const download = () => {
  if (!previewUrl.value) return
  const a = document.createElement('a')
  a.href = previewUrl.value
  a.download = `athletiq-${props.type}.png`
  a.click()
}

onMounted(() => {
  nextTick(() => generate())
})

watch(() => props.data, () => {
  nextTick(() => generate())
}, { deep: true })

defineExpose({ generate, share, download })
</script>
