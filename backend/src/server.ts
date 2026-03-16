import dotenv from 'dotenv'

// IMPORTANT: Charger .env AVANT tous les autres imports
dotenv.config()

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import { initializeDatabase } from './config/database.js'
import { globalLimiter, authLimiter, apiLimiter } from './middlewares/rateLimiter.js'
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

const app = express()
const PORT = process.env.PORT || 3001

// Trust proxy (Fly.io, Render, etc.) pour rate limiting et IP correcte
app.set('trust proxy', 1)

// Initialiser la base de données
await initializeDatabase()

// Sécurité — headers HTTP (XSS, clickjacking, MIME sniffing, etc.)
app.use(helmet())

// Rate limiting global — 100 req/min par IP
app.use(globalLimiter)

// Middlewares
app.use(cors({
  origin: (origin, callback) => {
    const allowed = process.env.CORS_ORIGIN
    if (!origin || (allowed && allowed === origin)) {
      callback(null, true)
    } else if (!allowed && process.env.NODE_ENV !== 'production' && origin.match(/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))
app.use(cookieParser())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Athletiq API is running' })
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
app.use('/api/webhook', webhookRoutes)
app.use('/api/email', authLimiter, emailRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  const isProduction = process.env.NODE_ENV === 'production'
  res.status(500).json({
    error: 'Internal server error',
    ...(isProduction ? {} : { message: err.message })
  })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/health`)
})
