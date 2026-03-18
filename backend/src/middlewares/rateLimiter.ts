import rateLimit from 'express-rate-limit'

// Rate limiter global — 100 requêtes par minute par IP
export const globalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  message: { error: 'Trop de requêtes, réessayez dans une minute' },
  standardHeaders: true,
  legacyHeaders: false
})

// Rate limiter pour les endpoints API authentifiés — 60 req/min par IP
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: { error: 'Trop de requêtes, réessayez dans une minute' },
  standardHeaders: true,
  legacyHeaders: false
})

// Rate limiter pour webhook — 100 req/min par IP
export const webhookLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { error: 'Trop de requêtes webhook, réessayez dans une minute' },
  standardHeaders: true,
  legacyHeaders: false
})

// Rate limiter strict pour auth — 30 tentatives par 15 min par IP
// Empêche le brute-force sur login/register
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30,
  message: { error: 'Trop de tentatives de connexion, réessayez dans 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false
})

// Rate limiter strict pour password reset — 5 tentatives par heure par IP
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 5,
  message: { error: 'Trop de demandes de réinitialisation, réessayez dans une heure' },
  standardHeaders: true,
  legacyHeaders: false
})
