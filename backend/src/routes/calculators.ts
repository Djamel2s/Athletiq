import express from 'express'
import { z } from 'zod'
import { authenticate } from '../middlewares/auth.js'
import { estimate1RM, calculateTDEE, calculatePlates } from '../utils/calculators.js'

const router = express.Router()

// POST /api/calculators/1rm
const oneRMSchema = z.object({
  weight: z.number().positive().max(1000),
  reps: z.number().int().min(1).max(30)
})

router.post('/1rm', authenticate, async (req, res) => {
  try {
    const { weight, reps } = oneRMSchema.parse(req.body)
    const oneRM = estimate1RM(weight, reps)

    // Calculer les pourcentages utiles
    const percentages = [100, 95, 90, 85, 80, 75, 70, 65, 60, 50].map(pct => ({
      percentage: pct,
      weight: Math.round(oneRM * pct / 100 * 10) / 10,
      reps: pct >= 95 ? '1' : pct >= 90 ? '2-3' : pct >= 85 ? '4-5' : pct >= 80 ? '6-8' : pct >= 70 ? '8-10' : '10-15'
    }))

    res.json({ estimated_1rm: oneRM, percentages })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Données invalides' })
    }
    res.status(500).json({ error: 'Erreur' })
  }
})

// POST /api/calculators/tdee
const tdeeSchema = z.object({
  weight: z.number().positive().max(500),
  height: z.number().positive().max(300),
  age: z.number().int().min(10).max(120),
  gender: z.enum(['male', 'female']),
  // Accepter les deux formats (camelCase et snake_case)
  activityLevel: z.enum(['sedentary', 'light', 'lightly_active', 'moderate', 'moderately_active', 'active', 'very_active']).optional(),
  activity_level: z.enum(['sedentary', 'light', 'lightly_active', 'moderate', 'moderately_active', 'active', 'very_active']).optional()
})

router.post('/tdee', authenticate, async (req, res) => {
  try {
    const data = tdeeSchema.parse(req.body)

    // Normaliser le niveau d'activité
    const rawLevel = data.activityLevel || data.activity_level || 'moderate'
    const activityMap: Record<string, string> = {
      sedentary: 'sedentary', light: 'light', lightly_active: 'light',
      moderate: 'moderate', moderately_active: 'moderate',
      active: 'active', very_active: 'very_active'
    }
    const activityLevel = activityMap[rawLevel] || 'moderate'

    const result = calculateTDEE({
      weight: data.weight,
      height: data.height,
      age: data.age,
      gender: data.gender,
      activityLevel: activityLevel as 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
    })

    // Transformer la réponse pour matcher le frontend
    res.json({
      bmr: result.bmr,
      tdee: result.tdee,
      goals: {
        maintenance: result.macros.maintenance,
        cutting: result.macros.cut,
        bulking: result.macros.bulk
      }
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Données invalides' })
    }
    res.status(500).json({ error: 'Erreur' })
  }
})

// POST /api/calculators/plates
const platesSchema = z.object({
  targetWeight: z.number().positive().max(1000).optional(),
  target_weight: z.number().positive().max(1000).optional(),
  barWeight: z.number().positive().max(100).optional(),
  bar_weight: z.number().positive().max(100).optional()
})

router.post('/plates', authenticate, async (req, res) => {
  try {
    const data = platesSchema.parse(req.body)
    const targetWeight = data.targetWeight || data.target_weight
    const barWeight = data.barWeight || data.bar_weight || 20
    if (!targetWeight) {
      return res.status(400).json({ error: 'Poids visé requis' })
    }
    const result = calculatePlates(targetWeight, barWeight)
    res.json({
      bar_weight: barWeight,
      weight_per_side: result.perSide,
      plates_per_side: result.plates,
      totalWeight: result.totalWeight
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Données invalides' })
    }
    res.status(500).json({ error: 'Erreur' })
  }
})

export default router
