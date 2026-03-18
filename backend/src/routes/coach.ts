import express from 'express'
import { authenticate, AuthRequest } from '../middlewares/auth.js'
import { generateInsights } from '../services/coachService.js'

const router = express.Router()

// GET /api/coach/insights — Obtenir les conseils personnalisés
router.get('/insights', authenticate, async (req: AuthRequest, res) => {
  try {
    const insights = await generateInsights(req.user!.id)
    res.json({ insights })
  } catch (error) {
    console.error('Error generating coach insights:', error)
    res.status(500).json({ error: 'Erreur lors de la génération des conseils' })
  }
})

export default router
