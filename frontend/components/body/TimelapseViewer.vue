<template>
  <div class="relative">
    <!-- Photo Display -->
    <div class="relative aspect-[3/4] bg-primary-100 dark:bg-primary-800 rounded-2xl overflow-hidden">
      <img
        v-if="photos.length > 0"
        :src="photos[currentIndex]?.photoUrl"
        :alt="`Photo ${currentIndex + 1}`"
        class="w-full h-full object-cover transition-opacity duration-300"
      />
      <div v-else class="flex items-center justify-center h-full text-primary-400">
        Aucune photo
      </div>

      <!-- Date Overlay -->
      <div v-if="photos.length > 0" class="absolute top-4 left-4 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-xl text-white text-sm font-medium">
        {{ formatDate(photos[currentIndex]?.workout?.date || photos[currentIndex]?.createdAt) }}
      </div>

      <!-- Counter -->
      <div v-if="photos.length > 1" class="absolute top-4 right-4 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-xl text-white text-sm font-medium">
        {{ currentIndex + 1 }} / {{ photos.length }}
      </div>
    </div>

    <!-- Controls -->
    <div v-if="photos.length > 1" class="mt-4 space-y-3">
      <!-- Progress Bar -->
      <div class="w-full h-1.5 bg-primary-200 dark:bg-primary-700 rounded-full overflow-hidden">
        <div
          class="h-full bg-gradient-to-r from-sand-500 to-sand-600 rounded-full transition-all duration-300"
          :style="{ width: `${((currentIndex + 1) / photos.length) * 100}%` }"
        ></div>
      </div>

      <!-- Buttons -->
      <div class="flex items-center justify-center space-x-4">
        <button
          @click="prev"
          class="w-10 h-10 flex items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-800 hover:bg-primary-200 dark:hover:bg-primary-700 transition-colors"
        >
          <svg class="w-5 h-5 text-primary-700 dark:text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>

        <button
          @click="togglePlay"
          class="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-r from-sand-500 to-sand-600 text-white hover:shadow-lg transition-all"
        >
          <svg v-if="!isPlaying" class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
          <svg v-else class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
          </svg>
        </button>

        <button
          @click="next"
          class="w-10 h-10 flex items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-800 hover:bg-primary-200 dark:hover:bg-primary-700 transition-colors"
        >
          <svg class="w-5 h-5 text-primary-700 dark:text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>

        <!-- Speed Control -->
        <select
          v-model="speed"
          class="input-primary !w-auto !py-2 !px-3 text-sm"
        >
          <option :value="2000">0.5x</option>
          <option :value="1000">1x</option>
          <option :value="500">2x</option>
        </select>
      </div>

      <!-- Export actions -->
      <div class="flex gap-3 mt-2">
        <button
          @click="exportVideo"
          :disabled="exporting"
          class="flex-1 btn-primary flex items-center justify-center gap-2 text-sm"
        >
          <template v-if="exporting">
            <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            {{ exportProgress }}
          </template>
          <template v-else>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
            </svg>
            Exporter en video
          </template>
        </button>
        <button
          @click="downloadCurrentPhoto"
          class="btn-outline flex items-center justify-center gap-2 text-sm !px-4"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          Photo
        </button>
      </div>
    </div>

    <!-- Hidden canvas for video export -->
    <canvas ref="exportCanvas" class="hidden"></canvas>
  </div>
</template>

<script setup lang="ts">
import type { ProgressPhoto } from '~/types/body'

interface Props {
  photos: ProgressPhoto[]
}

const props = defineProps<Props>()

const currentIndex = ref(0)
const isPlaying = ref(false)
const speed = ref(1000)
const exporting = ref(false)
const exportProgress = ref('')
const exportCanvas = ref<HTMLCanvasElement | null>(null)
let interval: ReturnType<typeof setInterval> | null = null

const next = () => {
  if (props.photos.length === 0) return
  currentIndex.value = (currentIndex.value + 1) % props.photos.length
}

const prev = () => {
  if (props.photos.length === 0) return
  currentIndex.value = (currentIndex.value - 1 + props.photos.length) % props.photos.length
}

const togglePlay = () => {
  isPlaying.value = !isPlaying.value
  if (isPlaying.value) {
    startAutoplay()
  } else {
    stopAutoplay()
  }
}

const startAutoplay = () => {
  stopAutoplay()
  interval = setInterval(next, speed.value)
}

const stopAutoplay = () => {
  if (interval) {
    clearInterval(interval)
    interval = null
  }
}

watch(speed, () => {
  if (isPlaying.value) {
    startAutoplay()
  }
})

onUnmounted(() => {
  stopAutoplay()
})

const formatDate = (dateString?: string) => {
  if (!dateString) return ''
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date(dateString))
}

// --- Download current photo ---
const downloadCurrentPhoto = async () => {
  const photo = props.photos[currentIndex.value]
  if (!photo?.photoUrl) return

  try {
    const response = await fetch(photo.photoUrl)
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `athletiq-photo-${formatDate(photo.workout?.date || photo.createdAt).replace(/\s/g, '-')}.jpg`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch {
    // Fallback: open in new tab
    window.open(photo.photoUrl, '_blank')
  }
}

// --- Video export via Canvas + MediaRecorder ---
const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

const exportVideo = async () => {
  if (exporting.value || props.photos.length < 2) return
  exporting.value = true
  exportProgress.value = 'Chargement...'

  try {
    // Load all images first
    const images: HTMLImageElement[] = []
    for (let i = 0; i < props.photos.length; i++) {
      exportProgress.value = `Chargement ${i + 1}/${props.photos.length}`
      try {
        const img = await loadImage(props.photos[i].photoUrl)
        images.push(img)
      } catch {
        // Skip failed images
      }
    }

    if (images.length < 2) {
      exportProgress.value = ''
      exporting.value = false
      return
    }

    // Setup canvas
    const canvas = exportCanvas.value
    if (!canvas) return

    // Use 1080x1440 (3:4 ratio, good for stories)
    const W = 1080
    const H = 1440
    canvas.width = W
    canvas.height = H

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Create video stream
    const stream = canvas.captureStream(30)
    const recorder = new MediaRecorder(stream, {
      mimeType: getSupportedMimeType(),
      videoBitsPerSecond: 5000000
    })

    const chunks: Blob[] = []
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data)
    }

    recorder.onstop = () => {
      const ext = recorder.mimeType.includes('mp4') ? 'mp4' : 'webm'
      const blob = new Blob(chunks, { type: recorder.mimeType })
      const url = URL.createObjectURL(blob)

      // Try share first, fallback to download
      if (navigator.share) {
        const file = new File([blob], `athletiq-timelapse.${ext}`, { type: recorder.mimeType })
        navigator.share({ title: 'Mon timelapse Athletiq', files: [file] }).catch(() => {
          downloadBlob(url, `athletiq-timelapse.${ext}`)
        })
      } else {
        downloadBlob(url, `athletiq-timelapse.${ext}`)
      }

      exporting.value = false
      exportProgress.value = ''
    }

    recorder.start()

    // Draw each frame with branding
    const frameDuration = 1000 // 1 second per photo
    for (let i = 0; i < images.length; i++) {
      exportProgress.value = `Export ${i + 1}/${images.length}`

      drawVideoFrame(ctx, W, H, images[i], i, images.length)

      // Hold frame for duration
      await new Promise(resolve => setTimeout(resolve, frameDuration))
    }

    // Hold last frame a bit longer
    await new Promise(resolve => setTimeout(resolve, 500))

    // Draw outro frame with branding
    drawOutroFrame(ctx, W, H)
    await new Promise(resolve => setTimeout(resolve, 1500))

    recorder.stop()
  } catch (e) {
    logger.error('Video export error:', e)
    exporting.value = false
    exportProgress.value = ''
  }
}

const getSupportedMimeType = (): string => {
  const types = [
    'video/mp4;codecs=avc1',
    'video/mp4',
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm'
  ]
  for (const type of types) {
    if (MediaRecorder.isTypeSupported(type)) return type
  }
  return 'video/webm'
}

const downloadBlob = (url: string, filename: string) => {
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

const drawVideoFrame = (ctx: CanvasRenderingContext2D, w: number, h: number, img: HTMLImageElement, index: number, total: number) => {
  // Dark background
  ctx.fillStyle = '#1a1612'
  ctx.fillRect(0, 0, w, h)

  // Draw image (cover fit with padding)
  const padding = 40
  const imgW = w - padding * 2
  const imgH = h - 200 // Leave space for branding
  const imgY = 100

  const scale = Math.max(imgW / img.width, imgH / img.height)
  const dw = img.width * scale
  const dh = img.height * scale
  const dx = padding + (imgW - dw) / 2
  const dy = imgY + (imgH - dh) / 2

  // Clip to rounded rect
  ctx.save()
  roundRect(ctx, padding, imgY, imgW, imgH, 20)
  ctx.clip()
  ctx.drawImage(img, dx, dy, dw, dh)
  ctx.restore()

  // Top bar: ATHLETIQ
  ctx.font = `600 36px system-ui, -apple-system, sans-serif`
  ctx.fillStyle = '#d4c4b0'
  ctx.textAlign = 'center'
  ctx.letterSpacing = '6px'
  ctx.fillText('A T H L E T I Q', w / 2, 60)
  ctx.letterSpacing = '0px'

  // Bottom bar: progress + athletiq.fr
  const bottomY = h - 60

  // Progress dots
  const dotSize = 8
  const dotGap = 6
  const totalDotsW = total * (dotSize + dotGap) - dotGap
  const dotsX = (w - totalDotsW) / 2

  for (let d = 0; d < total; d++) {
    ctx.beginPath()
    ctx.arc(dotsX + d * (dotSize + dotGap) + dotSize / 2, bottomY, dotSize / 2, 0, Math.PI * 2)
    ctx.fillStyle = d <= index ? '#d4c4b0' : 'rgba(212, 196, 176, 0.2)'
    ctx.fill()
  }

  // Site name
  ctx.font = `400 24px system-ui, -apple-system, sans-serif`
  ctx.fillStyle = '#7a7068'
  ctx.textAlign = 'center'
  ctx.fillText('athletiq.fr', w / 2, h - 24)

  // Date overlay on image
  const photo = props.photos[index]
  if (photo) {
    const dateStr = formatDate(photo.workout?.date || photo.createdAt)
    ctx.font = `500 28px system-ui, -apple-system, sans-serif`
    const textW = ctx.measureText(dateStr).width
    roundRect(ctx, padding + 16, imgY + 16, textW + 24, 40, 10)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
    ctx.fill()
    ctx.fillStyle = '#ffffff'
    ctx.textAlign = 'left'
    ctx.fillText(dateStr, padding + 28, imgY + 43)
  }
}

const drawOutroFrame = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
  // Dark background
  const grad = ctx.createLinearGradient(0, 0, 0, h)
  grad.addColorStop(0, '#1a1612')
  grad.addColorStop(1, '#2a2318')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, w, h)

  // ATHLETIQ large
  ctx.font = `700 72px system-ui, -apple-system, sans-serif`
  ctx.fillStyle = '#d4c4b0'
  ctx.textAlign = 'center'
  ctx.letterSpacing = '12px'
  ctx.fillText('A T H L E T I Q', w / 2, h / 2 - 20)
  ctx.letterSpacing = '0px'

  // Tagline
  ctx.font = `400 32px system-ui, -apple-system, sans-serif`
  ctx.fillStyle = '#7a7068'
  ctx.fillText('athletiq.fr', w / 2, h / 2 + 40)
}

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
</script>
