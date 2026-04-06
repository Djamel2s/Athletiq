import express from 'express'
import { authenticate, AuthRequest } from '../middlewares/auth.js'
import fs from 'fs/promises'
import fsSync from 'fs'
import os from 'os'
import path from 'path'
import { spawn } from 'child_process'
import { spawnSync } from 'child_process'
import fetch from 'node-fetch'
import cloudinary from '../config/cloudinary.js'
import { logger } from '../utils/logger.js'
import Sharp from 'sharp'
import GIFEncoder from 'gifencoder'

const router = express.Router()

// Generate a timelapse video server-side from an array of image URLs
router.post('/generate', authenticate, async (req: AuthRequest, res) => {
  try {
    // If running with SKIP_DB for local testing, `authenticate` may not set req.user — provide a fallback id
    if (!req.user) {
      // @ts-ignore
      req.user = { id: 'local-test' }
    }
    const images: string[] = req.body.images
    const fps = parseInt(req.body.fps, 10) || 1

    if (!Array.isArray(images) || images.length < 2) {
      return res.status(400).json({ error: 'Provide at least 2 image URLs in `images` array' })
    }

    // Check if ffmpeg is available; if not we'll fall back to GIF generation + Cloudinary upload
    let hasFfmpeg = true
    try {
      const v = spawnSync('ffmpeg', ['-version'])
      if (v.error) throw v.error
    } catch (e) {
      hasFfmpeg = false
      logger.info('ffmpeg not found on server — will use Cloudinary GIF fallback')
    }

    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), `athletiq-timelapse-${req.user!.id}-`))

    // Download images
    for (let i = 0; i < images.length; i++) {
      const url = images[i]
      const filename = path.join(tmpDir, `${String(i + 1).padStart(4, '0')}.jpg`)
      const resp = await fetch(url)
      if (!resp.ok) throw new Error(`Failed to download image ${url}`)
      const buffer = await resp.arrayBuffer()
      await fs.writeFile(filename, Buffer.from(buffer))
    }

    // If ffmpeg is available, use it to build an MP4; otherwise create an animated GIF and upload
    let result: any = null
    if (hasFfmpeg) {
      const outFile = path.join(tmpDir, 'out.mp4')
      // ffmpeg command: create slideshow from images
      // -framerate fps -i %04d.jpg -c:v libx264 -pix_fmt yuv420p -vf scale=1080:1440:force_original_aspect_ratio=decrease,pad=1080:1440:(ow-iw)/2:(oh-ih)/2 -r 30 out.mp4
      await new Promise((resolve, reject) => {
        const args = [
          '-y',
          '-framerate', String(fps),
          '-i', path.join(tmpDir, '%04d.jpg'),
          '-c:v', 'libx264',
          '-pix_fmt', 'yuv420p',
          '-vf', "scale=1080:1440:force_original_aspect_ratio=decrease,pad=1080:1440:(ow-iw)/2:(oh-ih)/2",
          '-r', '30',
          outFile
        ]

        const ff = spawn('ffmpeg', args, { stdio: 'inherit' })
        ff.on('error', (err) => reject(err))
        ff.on('exit', (code) => {
          if (code === 0) resolve(null)
          else reject(new Error(`ffmpeg exited with code ${code}`))
        })
      })

      // Upload MP4 to Cloudinary
      result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: 'video', folder: `athletiq/timelapses/${req.user!.id}`, quality: 'auto' },
          (error: any, result: any) => {
            if (error) reject(error)
            else resolve(result)
          }
        )
        fs.readFile(path.join(tmpDir, 'out.mp4')).then(buf => uploadStream.end(buf)).catch(reject)
      })
    } else {
        // Fallback: create an animated GIF from downloaded images using Sharp + gifencoder
        try {
            // Load first image to determine size
            const first = await Sharp(path.join(tmpDir, '0001.jpg'))
                .metadata()
                .then(metadata => ({
                width: metadata.width || 0,
                height: metadata.height || 0
                }))
            const width = Math.min(1080, first.width)
            const height = Math.min(1440, first.height)

            const encoder = new GIFEncoder(width, height)
            const gifPath = path.join(tmpDir, 'out.gif')
            const writeStream = fsSync.createWriteStream(gifPath)
            encoder.createReadStream().pipe(writeStream)
            encoder.start()
            encoder.setRepeat(0)
            encoder.setDelay(Math.max(40, Math.floor(1000 / fps)))
            encoder.setQuality(10)

            for (let i = 0; i < images.length; i++) {
                const file = path.join(tmpDir, `${String(i + 1).padStart(4, '0')}.jpg`)
                const img = await Sharp(file)
                .resize(width, height)
                .toBuffer()
                encoder.addFrame(img.data)
            }
            encoder.finish()

            // wait for writeStream finish
            await new Promise((resolve, reject) => {
                writeStream.on('finish', resolve)
                writeStream.on('error', reject)
            })

            // Upload GIF to Cloudinary
            result = await cloudinary.uploader.upload(gifPath, { folder: `athletiq/timelapses/${req.user!.id}`, resource_type: 'image', quality: 'auto' })
        } catch (e) {
            logger.error({ err: e }, 'GIF fallback generation failed')
            throw e
        }
    }

    // Cleanup tmp
    try {
      await fs.rm(tmpDir, { recursive: true, force: true })
    } catch (e) {
      logger.warn({ err: e }, 'Failed to cleanup timelapse tmp dir')
    }

    if (!result?.secure_url) return res.status(500).json({ error: 'Cloudinary upload failed' })
    return res.json({ url: result.secure_url })
  } catch (error) {
    logger.error({ err: error }, 'Timelapse generate error')
    return res.status(500).json({ error: 'Failed to generate timelapse' })
  }
})

export default router
