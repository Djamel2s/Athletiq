import dotenv from 'dotenv'

// IMPORTANT: Charger .env AVANT tous les autres imports
dotenv.config()

// Initialize OpenTelemetry (optional) - safe no-op if env not configured
import './telemetry.js'

import http from 'http'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import * as Sentry from '@sentry/node'
import { collectDefaultMetrics, register } from 'prom-client'
import cloudinary from 'cloudinary'
import { initializeDatabase } from './config/database.js'
import { globalLimiter, authLimiter, apiLimiter, webhookLimiter, passwordResetLimiter } from './middlewares/rateLimiter.js'
import authRoutes from './routes/auth.js'
import workoutRoutes from './routes/workouts.js'
import exerciseRoutes from './routes/exercises.js'
import userRoutes from './routes/users.js'
import bodyStatRoutes from './routes/bodyStats.js'
import measurementRoutes from './routes/measurements.js'
import photoRoutes from './routes/photos.js'
import recordRoutes from './routes/records.js'
import goalRoutes from './routes/goals.js'
import notificationRoutes from './routes/notifications.js'
import statsRoutes from './routes/stats.js'
import subscriptionRoutes from './routes/subscription.js'
import webhookRoutes from './routes/webhook.js'
import emailRoutes from './routes/email.js'
import programRoutes from './routes/programs.js'
import achievementRoutes from './routes/achievements.js'
import coachRoutes from './routes/coach.js'
import calculatorRoutes from './routes/calculators.js'
import shareRoutes from './routes/share.js'
import fcmTokenRoutes from './routes/fcmTokens.js'
import profileRoutes from './routes/profile.js'
import socialRoutes from './routes/social.js'
import feedRoutes from './routes/feed.js'
import plannedWorkoutRoutes from './routes/plannedWorkouts.js'
import sessionRoutes from './routes/sessions.js'
import timelapseRoutes from './routes/timelapse.js'
import analyticsRoutes from './routes/analytics.js'
import { seedPrograms } from './routes/programs.js'
import { startScheduler } from './services/schedulerService.js'
import { setupWebSocket } from './websocket.js'
import { logger } from './utils/logger.js'
import { errorHandler } from './middlewares/errorHandler.js'

const app = express()
// Initialize Sentry if DSN provided
if (process.env.SENTRY_DSN) {
  Sentry.init({ dsn: process.env.SENTRY_DSN })
  // Request handler must be the first middleware
  app.use(Sentry.Handlers.requestHandler())
}
const PORT = process.env.PORT || 3001
const isProduction = process.env.NODE_ENV === 'production'

// Trust proxy (Fly.io, Render, etc.) pour rate limiting et IP correcte
app.set('trust proxy', 1)

// Validate critical environment variables early
const validateEnv = () => {
  const missing: string[] = []

  const hasDb = !!(process.env.DATABASE_URL || process.env.DB_HOST)
  if (!hasDb) missing.push('DATABASE_URL or DB_HOST')

  // JWT secret required in production
  if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) missing.push('JWT_SECRET')

  if (missing.length > 0) {
    logger.error({ missing }, 'Missing required environment variables')
    if (process.env.NODE_ENV === 'production') {
      logger.error('Exiting: required env vars missing in production')
      process.exit(1)
    }
  }

  // Non-fatal warnings
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    logger.warn('Cloudinary credentials missing — image uploads may fail')
  }
  if (!process.env.STRIPE_SECRET) {
    logger.warn('Stripe secret not configured — payments disabled')
  }
}

validateEnv()

// Initialize the base de données + seed data (skip possible in local dev)
if (process.env.SKIP_DB !== 'true') {
  await initializeDatabase()
  await seedPrograms()
  startScheduler()
} else {
  logger.info('SKIP_DB is set — skipping database initialization and scheduler')
}

// Vérifier les credentials Cloudinary en production
if (process.env.NODE_ENV === 'production') {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    logger.warn('Missing Cloudinary credentials (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, or CLOUDINARY_API_SECRET). Photo uploads will not work.')
  }
}

// Sécurité — headers HTTP (XSS, clickjacking, MIME sniffing, etc.)
// Security headers
app.use(helmet({
  contentSecurityPolicy: false // CSP handled in Nuxt config for frontend; customize here if needed
}))

// Start collecting default metrics for Prometheus
collectDefaultMetrics()

// Expose metrics endpoint
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType)
    res.end(await register.metrics())
  } catch (err) {
    res.status(500).end(err instanceof Error ? err.message : String(err))
  }
})

// Cache-Control: no-store on API responses
app.use('/api', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store')
  next()
})

// Rate limiting global — 100 req/min par IP
app.use(globalLimiter)

// Middlewares
// CORS: support single origin or comma-separated list in CORS_ORIGIN
app.use(cors({
  origin: (origin, callback) => {
    const raw = process.env.CORS_ORIGIN || ''
    const allowedOrigins = raw ? raw.split(',').map(s => s.trim()).filter(Boolean) : null

    // Allow non-browser requests (no origin)
    if (!origin) return callback(null, true)

    if (allowedOrigins) {
      if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) return callback(null, true)
      return callback(new Error('Not allowed by CORS'))
    }

    // Fallback during development: allow localhost origins when not in production
    if (!isProduction && origin.match(/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/)) {
      return callback(null, true)
    }

    // If no CORS_ORIGIN configured in production, reject
    return callback(new Error('Not allowed by CORS'))
  },
  credentials: true
}))
app.use(cookieParser())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Request logging
app.use((req, res, next) => {
  const start = Date.now()
  res.on('finish', () => {
    const duration = Date.now() - start
    if (req.path !== '/health') {
      logger.info({ method: req.method, path: req.path, status: res.statusCode, duration: `${duration}ms` }, 'request')
    }
  })
  next()
})

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Athletiq API is running' })
})

// Readiness check: ensures DB initialized and important integrations available
app.get('/ready', async (req, res) => {
  const checks: Record<string, any> = { uptime: process.uptime() }

  try {
    // Database readiness
    const dbReady = !!(await (async () => {
      try {
        // AppDataSource may not be imported here to avoid circular deps; use initializeDatabase state
        const { AppDataSource } = await import('./config/database.js')
        return AppDataSource.isInitialized === true
      } catch (e) {
        return false
      }
    })())
    checks.database = dbReady ? { ok: true } : { ok: false }

    // Cloudinary active check: try a lightweight API call with timeout
    const cloudinaryConfigured = !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET)
    if (cloudinaryConfigured) {
      cloudinary.v2.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
      })

      const checkCloudinary = async (timeoutMs = 2000) => {
        return await Promise.race([
          (async () => {
            try {
              // lightweight call: list resources with max_results=1
              await cloudinary.v2.api.resources({ max_results: 1 })
              return { ok: true }
            } catch (e) {
              return { ok: false, error: String(e) }
            }
          })(),
          new Promise(resolve => setTimeout(() => resolve({ ok: false, error: 'timeout' }), timeoutMs))
        ])
      }

      // perform check
      // @ts-ignore
      const cloudRes = await checkCloudinary(2000)
      checks.cloudinary = cloudRes
    } else {
      checks.cloudinary = { ok: false, error: 'missing_credentials' }
    }

    const stripeConfigured = !!process.env.STRIPE_SECRET
    checks.stripe = stripeConfigured ? { ok: true } : { ok: false }

    const ready = checks.database.ok && checks.cloudinary.ok

    res.status(ready ? 200 : 503).json({ ready, checks })
  } catch (err) {
    res.status(500).json({ ready: false, error: String(err) })
  }
})

// Routes
app.use('/api/auth', authLimiter, authRoutes)
app.use('/api/workouts', apiLimiter, workoutRoutes)
app.use('/api/exercises', apiLimiter, exerciseRoutes)
app.use('/api/users', apiLimiter, userRoutes)
app.use('/api/body-stats', apiLimiter, bodyStatRoutes)
app.use('/api/measurements', apiLimiter, measurementRoutes)
app.use('/api/photos', apiLimiter, photoRoutes)
app.use('/api/records', apiLimiter, recordRoutes)
app.use('/api/goals', apiLimiter, goalRoutes)
app.use('/api/notifications', apiLimiter, notificationRoutes)
app.use('/api/stats', apiLimiter, statsRoutes)
app.use('/api/subscription', apiLimiter, subscriptionRoutes)
app.use('/api/webhook', webhookLimiter, webhookRoutes)
app.use('/api/email/verify', authLimiter, emailRoutes)
app.use('/api/email/forgot-password', passwordResetLimiter, emailRoutes)
app.use('/api/email/reset-password', passwordResetLimiter, emailRoutes)
app.use('/api/programs', apiLimiter, programRoutes)
app.use('/api/achievements', apiLimiter, achievementRoutes)
app.use('/api/coach', apiLimiter, coachRoutes)
app.use('/api/calculators', apiLimiter, calculatorRoutes)
app.use('/api/share', apiLimiter, shareRoutes)
app.use('/api/fcm-tokens', apiLimiter, fcmTokenRoutes)
app.use('/api/profile', apiLimiter, profileRoutes)
app.use('/api/social', apiLimiter, socialRoutes)
app.use('/api/feed', apiLimiter, feedRoutes)
app.use('/api/planned-workouts', apiLimiter, plannedWorkoutRoutes)
app.use('/api/sessions', apiLimiter, sessionRoutes)
app.use('/api/timelapse', apiLimiter, timelapseRoutes)
app.use('/api/analytics', apiLimiter, analyticsRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Error handler
// Sentry error handler (should be before custom error handler)
if (process.env.SENTRY_DSN) {
  app.use(Sentry.Handlers.errorHandler())
}
app.use(errorHandler)

const httpServer = http.createServer(app)
setupWebSocket(httpServer)

httpServer.listen(PORT, () => {
  logger.info({ port: PORT }, 'Server running')
  logger.info({ url: `http://localhost:${PORT}/health` }, 'Health check available')
})
