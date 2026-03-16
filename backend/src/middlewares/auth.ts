import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required')
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

    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload

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
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export const generateRefreshToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' })
}
