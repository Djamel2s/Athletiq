import { describe, it, expect } from 'vitest'
import { z } from 'zod'
import jwt from 'jsonwebtoken'

// Mêmes schemas que dans routes/auth.ts
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

const JWT_SECRET = 'test-secret'

describe('Auth Validation', () => {
  describe('Register schema', () => {
    it('accepte un email et password valides', () => {
      const result = registerSchema.safeParse({
        email: 'test@example.com',
        password: 'password123'
      })
      expect(result.success).toBe(true)
    })

    it('accepte avec prénom et nom', () => {
      const result = registerSchema.safeParse({
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Jean',
        lastName: 'Dupont'
      })
      expect(result.success).toBe(true)
    })

    it('rejette un email invalide', () => {
      const result = registerSchema.safeParse({
        email: 'not-an-email',
        password: 'password123'
      })
      expect(result.success).toBe(false)
    })

    it('rejette un password trop court (< 8 chars)', () => {
      const result = registerSchema.safeParse({
        email: 'test@example.com',
        password: '1234567'
      })
      expect(result.success).toBe(false)
    })

    it('rejette un body vide', () => {
      const result = registerSchema.safeParse({})
      expect(result.success).toBe(false)
    })

    it('rejette sans email', () => {
      const result = registerSchema.safeParse({ password: 'password123' })
      expect(result.success).toBe(false)
    })

    it('rejette sans password', () => {
      const result = registerSchema.safeParse({ email: 'test@example.com' })
      expect(result.success).toBe(false)
    })
  })

  describe('Login schema', () => {
    it('accepte email + password', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: 'any'
      })
      expect(result.success).toBe(true)
    })

    it('rejette un email invalide', () => {
      const result = loginSchema.safeParse({
        email: 'bad',
        password: 'password'
      })
      expect(result.success).toBe(false)
    })
  })
})

describe('JWT Token', () => {
  it('génère un token valide', () => {
    const payload = { userId: 1, email: 'test@example.com' }
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })

    expect(token).toBeTruthy()
    expect(typeof token).toBe('string')
  })

  it('décode correctement le payload', () => {
    const payload = { userId: 42, email: 'user@athletiq.fr' }
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
    const decoded = jwt.verify(token, JWT_SECRET) as any

    expect(decoded.userId).toBe(42)
    expect(decoded.email).toBe('user@athletiq.fr')
  })

  it('rejette un token avec mauvais secret', () => {
    const token = jwt.sign({ userId: 1 }, JWT_SECRET)

    expect(() => {
      jwt.verify(token, 'wrong-secret')
    }).toThrow()
  })

  it('rejette un token expiré', () => {
    const token = jwt.sign({ userId: 1 }, JWT_SECRET, { expiresIn: '0s' })

    expect(() => {
      jwt.verify(token, JWT_SECRET)
    }).toThrow(jwt.TokenExpiredError)
  })

  it('rejette un token malformé', () => {
    expect(() => {
      jwt.verify('not.a.real.token', JWT_SECRET)
    }).toThrow()
  })
})
