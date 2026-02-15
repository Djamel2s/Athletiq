import express from 'express'
import bcrypt from 'bcrypt'
import { z } from 'zod'
import jwt from 'jsonwebtoken'
import { AppDataSource } from '../config/database.js'
import { User } from '../entities/User.js'
import { generateToken, generateRefreshToken, JWTPayload } from '../middlewares/auth.js'

const router = express.Router()
const userRepository = AppDataSource.getRepository(User)

// Validation schemas
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().optional(),
  lastName: z.string().optional()
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
})

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = registerSchema.parse(req.body)

    // Check if user exists
    const existingUser = await userRepository.findOne({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const newUser = userRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName
    })
    await userRepository.save(newUser)

    // Return user without password
    const user = {
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      createdAt: newUser.createdAt
    }

    // Generate JWT and refresh token
    const token = generateToken({ userId: user.id, email: user.email })
    const refreshToken = generateRefreshToken({ userId: user.id, email: user.email })

    res.status(201).json({ user, token, refreshToken })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors })
    }
    res.status(500).json({ error: 'Failed to register user' })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body)

    // Find user
    const user = await userRepository.findOne({ where: { email } })
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Generate JWT and refresh token
    const token = generateToken({ userId: user.id, email: user.email })
    const refreshToken = generateRefreshToken({ userId: user.id, email: user.email })

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      },
      token,
      refreshToken
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors })
    }
    res.status(500).json({ error: 'Failed to login' })
  }
})

// Refresh token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token manquant' })
    }

    // Verify refresh token
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
    const decoded = jwt.verify(refreshToken, JWT_SECRET) as JWTPayload

    // Find user
    const user = await userRepository.findOne({ where: { id: decoded.userId } })
    if (!user) {
      return res.status(401).json({ error: 'Utilisateur non trouvé' })
    }

    // Generate new tokens
    const newToken = generateToken({ userId: user.id, email: user.email })
    const newRefreshToken = generateRefreshToken({ userId: user.id, email: user.email })

    res.json({ token: newToken, refreshToken: newRefreshToken })
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

export default router
