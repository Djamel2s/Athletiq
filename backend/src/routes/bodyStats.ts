import express from 'express'
import { z } from 'zod'
import { AppDataSource } from '../config/database.js'
import { BodyStat } from '../entities/BodyStat.js'
import { authenticate, AuthRequest } from '../middlewares/auth.js'

const router = express.Router()
const bodyStatRepository = AppDataSource.getRepository(BodyStat)

// Get all body stats for current user
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50
    const offset = parseInt(req.query.offset as string) || 0

    const [stats, total] = await bodyStatRepository.findAndCount({
      where: { userId: req.user!.id },
      order: { date: 'DESC' },
      take: limit,
      skip: offset
    })

    res.json({ data: stats, total })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch body stats' })
  }
})

// Create a body stat entry
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const schema = z.object({
      weight: z.number().positive(),
      bodyFat: z.number().min(0).max(100).optional(),
      notes: z.string().optional(),
      date: z.string().datetime().optional()
    })

    const data = schema.parse(req.body)

    const stat = bodyStatRepository.create({
      userId: req.user!.id,
      weight: data.weight,
      bodyFat: data.bodyFat,
      notes: data.notes,
      date: data.date ? new Date(data.date) : new Date()
    })

    const saved = await bodyStatRepository.save(stat)
    res.status(201).json(saved)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors })
    }
    res.status(500).json({ error: 'Failed to create body stat' })
  }
})

// Update a body stat entry
router.put('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const schema = z.object({
      weight: z.number().positive().optional(),
      bodyFat: z.number().min(0).max(100).optional().nullable(),
      notes: z.string().optional().nullable(),
      date: z.string().datetime().optional()
    })

    const data = schema.parse(req.body)

    const stat = await bodyStatRepository.findOne({
      where: { id: parseInt(req.params.id), userId: req.user!.id }
    })

    if (!stat) {
      return res.status(404).json({ error: 'Body stat not found' })
    }

    if (data.weight !== undefined) stat.weight = data.weight
    if (data.bodyFat !== undefined) stat.bodyFat = data.bodyFat ?? undefined
    if (data.notes !== undefined) stat.notes = data.notes ?? undefined
    if (data.date) stat.date = new Date(data.date)

    const updated = await bodyStatRepository.save(stat)
    res.json(updated)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors })
    }
    res.status(500).json({ error: 'Failed to update body stat' })
  }
})

// Delete a body stat entry
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const stat = await bodyStatRepository.findOne({
      where: { id: parseInt(req.params.id), userId: req.user!.id }
    })

    if (!stat) {
      return res.status(404).json({ error: 'Body stat not found' })
    }

    await bodyStatRepository.remove(stat)
    res.json({ message: 'Body stat deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete body stat' })
  }
})

export default router
