import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

const JWT_ACCESS_SECRET = env.jwtAccessSecret
const JWT_REFRESH_SECRET = env.jwtRefreshSecret

// Prevent weak/default JWT secrets in production
const WEAK_SECRETS = ['secret', 'jwt_secret', 'changeme', 'password', 'default', 'your_jwt_secret', 'test']
if (process.env.NODE_ENV === 'production' && (
  WEAK_SECRETS.includes(JWT_ACCESS_SECRET.toLowerCase()) ||
  WEAK_SECRETS.includes(JWT_REFRESH_SECRET.toLowerCase())
)) {
  throw new Error('JWT secret is too weak for production. Use a strong, random secret (at least 32 characters).')
}

export interface AuthRequest extends Request {
  userId?: number
  user?: {
    id: number
    email: string
    isAdmin: boolean
  }
}

export interface JWTPayload {
  userId: number
  email: string
  isAdmin?: boolean
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token manquant ou invalide' })
    }

    const token = authHeader.substring(7)

    const decoded = jwt.verify(token, JWT_ACCESS_SECRET) as JWTPayload

    req.userId = decoded.userId
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      isAdmin: decoded.isAdmin ?? false
    }

    next()
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'Token expiré' })
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Token invalide' })
    }
    return res.status(401).json({ error: 'Authentification échouée' })
  }
}

export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: '15m' })
}

export const generateRefreshToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '30d' })
}
