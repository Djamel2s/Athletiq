import dotenv from 'dotenv'
dotenv.config()

import { logger } from '../utils/logger.js'

const isProduction = process.env.NODE_ENV === 'production'

// Variables obligatoires en production
// Variables obligatoires en production (bloquantes)
const requiredInProduction = [
  'JWT_SECRET',
  'DATABASE_URL',
  'CORS_ORIGIN',
] as const

// Variables recommandées (warning mais pas bloquantes — features désactivées si absentes)
const recommendedInProduction = [
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'RESEND_API_KEY',
] as const

if (isProduction) {
  const missing = requiredInProduction.filter(key => !process.env[key])
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables in production: ${missing.join(', ')}`)
  }

  const missingRecommended = recommendedInProduction.filter(key => !process.env[key])
  if (missingRecommended.length > 0) {
    logger.warn({ missing: missingRecommended }, 'Missing recommended env variables (features disabled)')
  }
}

// Variables toujours obligatoires
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required. Set it in your .env file.')
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction,
  port: Number(process.env.PORT || 3001),
  jwtSecret: process.env.JWT_SECRET,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  appUrl: process.env.APP_URL || 'http://localhost:3000',
  databaseUrl: process.env.DATABASE_URL,
} as const
