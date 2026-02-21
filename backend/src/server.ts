import dotenv from 'dotenv'

// IMPORTANT: Charger .env AVANT tous les autres imports
dotenv.config()

import express from 'express'
import cors from 'cors'
import { initializeDatabase } from './config/database.js'
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

const app = express()
const PORT = process.env.PORT || 3001

// Initialiser la base de données
await initializeDatabase()

// Middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Athletiq API is running' })
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/workouts', workoutRoutes)
app.use('/api/exercises', exerciseRoutes)
app.use('/api/users', userRoutes)
app.use('/api/body-stats', bodyStatRoutes)
app.use('/api/measurements', measurementRoutes)
app.use('/api/photos', photoRoutes)
app.use('/api/records', recordRoutes)
app.use('/api/goals', goalRoutes)
app.use('/api/notifications', notificationRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal server error', message: err.message })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/health`)
})
