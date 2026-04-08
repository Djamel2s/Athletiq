import express from 'express'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { z } from 'zod'
import jwt from 'jsonwebtoken'
import { logger } from '../utils/logger.js'
import { AppDataSource } from '../config/database.js'
import { User } from '../entities/User.js'
import { generateToken, generateRefreshToken, JWTPayload, authenticate, AuthRequest } from '../middlewares/auth.js'
import { env } from '../config/env.js'

const router = express.Router()
const userRepository = AppDataSource.getRepository(User)

const isProduction = process.env.NODE_ENV === 'production'

// Helper pour envoyer le refresh token en httpOnly cookie
const setRefreshTokenCookie = (res: express.Response, refreshToken: string) => {
  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 jours
    path: '/api/auth',
    domain: isProduction ? '.athletiq.fr' : undefined
  })
}

const clearRefreshTokenCookie = (res: express.Response) => {
  res.clearCookie('refresh_token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/api/auth',
    domain: isProduction ? '.athletiq.fr' : undefined
  })
}

// Validation schemas
const registerSchema = z.object({
  email: z.string().email().max(255),
  username: z.string().min(3).max(20).regex(/^[a-z0-9_]+$/, 'Username must be lowercase alphanumeric or underscore'),
  password: z.string().min(8).max(128)
    .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
    .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
    .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre'),
  firstName: z.string().max(100).nullish(),
  lastName: z.string().max(100).nullish(),
  gender: z.enum(['male', 'female']).nullish()
})

const loginSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().max(128)
})

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, username, password, firstName, lastName, gender } = registerSchema.parse(req.body)

    // Check if email or username exists
    const existingByEmail = await userRepository.findOne({ where: { email } })
    if (existingByEmail) {
      return res.status(400).json({ error: 'Email déjà enregistré' })
    }
    const existingByUsername = await userRepository.findOne({ where: { username } })
    if (existingByUsername) {
      return res.status(409).json({ error: 'Username déjà pris' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const newUser = userRepository.create({
      email,
      username,
      password: hashedPassword,
      firstName: firstName ?? undefined,
      lastName: lastName ?? undefined,
      gender: gender ?? undefined,
      isAdmin: false,
    })
    await userRepository.save(newUser)

    // Return user without password
    const user = {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      goal: newUser.goal,
      gender: newUser.gender,
      avatarUrl: newUser.avatarUrl,
      createdAt: newUser.createdAt
    }

    // Generate JWT and refresh token
    const token = generateToken({ userId: user.id, email: user.email, isAdmin: newUser.isAdmin })
    const refreshToken = generateRefreshToken({ userId: user.id, email: user.email, isAdmin: newUser.isAdmin })

    // Save hashed refresh token
    newUser.refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex')
    await userRepository.save(newUser)

    setRefreshTokenCookie(res, refreshToken)
    res.status(201).json({ user, token })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Erreur de validation', details: error.errors })
    }
    res.status(500).json({ error: 'Erreur lors de la création du compte' })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body)

    // Find user
    const user = await userRepository.findOne({ where: { email } })

    // Toujours exécuter bcrypt.compare pour éviter le timing attack
    // Si l'utilisateur n'existe pas, on compare avec un hash factice
    const dummyHash = '$2b$10$dummyHashForTimingAttackProtection000000000000000000'
    const validPassword = await bcrypt.compare(password, user?.password || dummyHash)

    if (!user || !validPassword) {
      logger.warn({ ip: req.ip }, 'Failed login attempt')
      return res.status(401).json({ error: 'Identifiants invalides' })
    }

    // Generate JWT and refresh token
    const token = generateToken({ userId: user.id, email: user.email, isAdmin: user.isAdmin })
    const refreshToken = generateRefreshToken({ userId: user.id, email: user.email, isAdmin: user.isAdmin })

    // Save hashed refresh token
    user.refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex')
    await userRepository.save(user)

    setRefreshTokenCookie(res, refreshToken)
    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        goal: user.goal,
        gender: user.gender,
        avatarUrl: user.avatarUrl
      },
      token
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Erreur de validation', details: error.errors })
    }
    res.status(500).json({ error: 'Erreur lors de la connexion' })
  }
})

// Refresh token
router.post('/refresh', async (req, res) => {
  try {
    // Lire le refresh token depuis le cookie httpOnly uniquement
    const refreshToken = req.cookies?.refresh_token

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token manquant' })
    }

    // Verify refresh token
    const refreshSecret = env.jwtRefreshSecret
    if (!refreshSecret) {
      return res.status(500).json({ error: 'Configuration serveur manquante' })
    }
    const decoded = jwt.verify(refreshToken, refreshSecret) as JWTPayload

    // Find user
    const user = await userRepository.findOne({ where: { id: decoded.userId } })
    if (!user) {
      return res.status(401).json({ error: 'Utilisateur non trouvé' })
    }

    // Verify refresh token hash matches
    const receivedHash = crypto.createHash('sha256').update(refreshToken).digest('hex')
    if (!user.refreshTokenHash || user.refreshTokenHash !== receivedHash) {
      return res.status(401).json({ error: 'Refresh token invalide' })
    }

    // Generate new tokens
    const newToken = generateToken({ userId: user.id, email: user.email, isAdmin: user.isAdmin })
    const newRefreshToken = generateRefreshToken({ userId: user.id, email: user.email, isAdmin: user.isAdmin })

    // Update hashed refresh token
    user.refreshTokenHash = crypto.createHash('sha256').update(newRefreshToken).digest('hex')
    await userRepository.save(user)

    setRefreshTokenCookie(res, newRefreshToken)
    res.json({ token: newToken })
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'Refresh token expiré' })
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Refresh token invalide' })
    }
    res.status(500).json({ error: 'Échec du rafraîchissement du token' })
  }
})

// Logout
router.post('/logout', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await userRepository.findOne({ where: { id: req.user!.id } })
    if (user) {
      user.refreshTokenHash = undefined
      await userRepository.save(user)
    }
    clearRefreshTokenCookie(res)
    res.json({ message: 'Déconnexion réussie' })
  } catch {
    res.status(500).json({ error: 'Erreur lors de la déconnexion' })
  }
})

export default router
