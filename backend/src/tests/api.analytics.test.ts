import express from 'express'
import request from 'supertest'
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock authenticate middleware to set req.user
vi.mock('../middlewares/auth.js', () => ({
  authenticate: (req: any, res: any, next: any) => {
    req.user = { id: 1 }
    next()
  }
}))

// Mock analytics service (default export)
vi.mock('../services/analyticsService.js', () => ({
  default: {
    getLatestFatigueForUser: vi.fn().mockResolvedValue({ id: 1, userId: 1, score: 0.75, date: new Date(), createdAt: new Date() }),
    computeForAllUsers: vi.fn().mockResolvedValue([])
  }
}))

import analyticsRoutes from '../routes/analytics.js'

let app: express.Express
beforeEach(() => {
  app = express()
  app.use(express.json())
  app.use('/api/analytics', analyticsRoutes)
})

describe('GET /api/analytics/fatigue/latest', () => {
  it('returns latest fatigue for authenticated user', async () => {
    const res = await request(app).get('/api/analytics/fatigue/latest')
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('score')
    expect(res.body.score).toBeCloseTo(0.75)
  })
})
