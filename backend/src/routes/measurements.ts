import express from 'express'
import { z } from 'zod'
import { AppDataSource } from '../config/database.js'
import { Measurement } from '../entities/Measurement.js'
import { authenticate, AuthRequest } from '../middlewares/auth.js'

const router = express.Router()
const measurementRepository = AppDataSource.getRepository(Measurement)

// Get all measurements for current user
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50
    const offset = parseInt(req.query.offset as string) || 0

    const [measurements, total] = await measurementRepository.findAndCount({
      where: { userId: req.user!.id },
      order: { date: 'DESC' },
      take: limit,
      skip: offset
    })

    res.json({ data: measurements, total })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch measurements' })
  }
})

// Create a measurement entry
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const schema = z.object({
      chest: z.number().positive().optional(),
      waist: z.number().positive().optional(),
      hips: z.number().positive().optional(),
      biceps: z.number().positive().optional(),
      thighs: z.number().positive().optional(),
      calves: z.number().positive().optional(),
      date: z.string().datetime().optional()
    }).refine(
      (data) => data.chest || data.waist || data.hips || data.biceps || data.thighs || data.calves,
      { message: 'At least one measurement is required' }
    )

    const data = schema.parse(req.body)

    const measurement = measurementRepository.create({
      userId: req.user!.id,
      chest: data.chest,
      waist: data.waist,
      hips: data.hips,
      biceps: data.biceps,
      thighs: data.thighs,
      calves: data.calves,
      date: data.date ? new Date(data.date) : new Date()
    })

    const saved = await measurementRepository.save(measurement)
    res.status(201).json(saved)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors })
    }
    res.status(500).json({ error: 'Failed to create measurement' })
  }
})

// Update a measurement entry
router.put('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const schema = z.object({
      chest: z.number().positive().optional().nullable(),
      waist: z.number().positive().optional().nullable(),
      hips: z.number().positive().optional().nullable(),
      biceps: z.number().positive().optional().nullable(),
      thighs: z.number().positive().optional().nullable(),
      calves: z.number().positive().optional().nullable(),
      date: z.string().datetime().optional()
    })

    const data = schema.parse(req.body)

    const measurement = await measurementRepository.findOne({
      where: { id: parseInt(req.params.id), userId: req.user!.id }
    })

    if (!measurement) {
      return res.status(404).json({ error: 'Measurement not found' })
    }

    if (data.chest !== undefined) measurement.chest = data.chest ?? undefined
    if (data.waist !== undefined) measurement.waist = data.waist ?? undefined
    if (data.hips !== undefined) measurement.hips = data.hips ?? undefined
    if (data.biceps !== undefined) measurement.biceps = data.biceps ?? undefined
    if (data.thighs !== undefined) measurement.thighs = data.thighs ?? undefined
    if (data.calves !== undefined) measurement.calves = data.calves ?? undefined
    if (data.date) measurement.date = new Date(data.date)

    const updated = await measurementRepository.save(measurement)
    res.json(updated)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors })
    }
    res.status(500).json({ error: 'Failed to update measurement' })
  }
})

// Delete a measurement entry
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const measurement = await measurementRepository.findOne({
      where: { id: parseInt(req.params.id), userId: req.user!.id }
    })

    if (!measurement) {
      return res.status(404).json({ error: 'Measurement not found' })
    }

    await measurementRepository.remove(measurement)
    res.json({ message: 'Measurement deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete measurement' })
  }
})

export default router
