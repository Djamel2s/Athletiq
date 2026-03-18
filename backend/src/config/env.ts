import dotenv from 'dotenv'
dotenv.config()

const isProduction = process.env.NODE_ENV === 'production'

// Variables obligatoires en production
const requiredInProduction = [
  'JWT_SECRET',
  'DATABASE_URL',
  'CORS_ORIGIN',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'RESEND_API_KEY',
] as const

if (isProduction) {
  const missing = requiredInProduction.filter(key => !process.env[key])
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables in production: ${missing.join(', ')}`)
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
