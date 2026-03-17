import express from 'express'
import { z } from 'zod'
import { AppDataSource } from '../config/database.js'
import { Measurement } from '../entities/Measurement.js'
import { authenticate, AuthRequest } from '../middlewares/auth.js'
import { parseId } from '../utils/validation.js'

const router = express.Router()
const measurementRepository = AppDataSource.getRepository(Measurement)

// Get all measurements for current user
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const limit = Math.min(Math.max(parseInt(req.query.limit as string, 10) || 50, 1), 100)
    const offset = Math.max(parseInt(req.query.offset as string, 10) || 0, 0)

    const [measurements, total] = await measurementRepository.findAndCount({
      where: { userId: req.user!.id },
      order: { date: 'DESC' },
      take: limit,
      skip: offset
    })

    res.json({ data: measurements, total })
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des mensurations' })
  }
})

// Create a measurement entry
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const schema = z.object({
      chest: z.number().positive().nullish(),
      waist: z.number().positive().nullish(),
      hips: z.number().positive().nullish(),
      biceps: z.number().positive().nullish(),
      thighs: z.number().positive().nullish(),
      calves: z.number().positive().nullish(),
      date: z.string().datetime().nullish().refine(
        val => !val || (new Date(val).getFullYear() >= 2000 && new Date(val) <= new Date(Date.now() + 3600000)),
        { message: 'Date invalide' }
      )
    }).refine(
      (data) => data.chest || data.waist || data.hips || data.biceps || data.thighs || data.calves,
      { message: 'Au moins une mensuration est requise' }
    )

    const data = schema.parse(req.body)

    const measurement = measurementRepository.create({
      userId: req.user!.id,
      chest: data.chest ?? undefined,
      waist: data.waist ?? undefined,
      hips: data.hips ?? undefined,
      biceps: data.biceps ?? undefined,
      thighs: data.thighs ?? undefined,
      calves: data.calves ?? undefined,
      date: data.date ? new Date(data.date) : new Date()
    })

    const saved = await measurementRepository.save(measurement)
    res.status(201).json(saved)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Erreur de validation', details: error.errors })
    }
    res.status(500).json({ error: 'Erreur lors de la création de la mensuration' })
  }
})

// Update a measurement entry
router.put('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const schema = z.object({
      chest: z.number().positive().nullish(),
      waist: z.number().positive().nullish(),
      hips: z.number().positive().nullish(),
      biceps: z.number().positive().nullish(),
      thighs: z.number().positive().nullish(),
      calves: z.number().positive().nullish(),
      date: z.string().datetime().nullish().refine(
        val => !val || (new Date(val).getFullYear() >= 2000 && new Date(val) <= new Date(Date.now() + 3600000)),
        { message: 'Date invalide' }
      )
    })

    const data = schema.parse(req.body)

    const measurement = await measurementRepository.findOne({
      where: { id: parseId(req.params.id), userId: req.user!.id }
    })

    if (!measurement) {
      return res.status(404).json({ error: 'Mensuration non trouvée' })
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
      return res.status(400).json({ error: 'Erreur de validation', details: error.errors })
    }
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la mensuration' })
  }
})

// Delete a measurement entry
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const measurement = await measurementRepository.findOne({
      where: { id: parseId(req.params.id), userId: req.user!.id }
    })

    if (!measurement) {
      return res.status(404).json({ error: 'Mensuration non trouvée' })
    }

    await measurementRepository.remove(measurement)
    res.json({ message: 'Mensuration supprimée' })
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de la mensuration' })
  }
})

export default router
