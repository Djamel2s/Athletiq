import express from 'express'
import { authenticate, AuthRequest } from '../middlewares/auth.js'
import { getUserAchievements, checkAndUnlockAchievements } from '../services/achievementService.js'

const router = express.Router()

// GET /api/achievements — Liste tous les achievements avec statut
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const achievements = await getUserAchievements(req.user!.id)
    const totalXP = achievements
      .filter(a => a.unlocked)
      .reduce((sum, a) => sum + a.xp, 0)

    res.json({
      achievements,
      stats: {
        total: achievements.length,
        unlocked: achievements.filter(a => a.unlocked).length,
        totalXP
      }
    })
  } catch (error) {
    console.error('Error fetching achievements:', error)
    res.status(500).json({ error: 'Erreur lors de la récupération des badges' })
  }
})

// POST /api/achievements/check — Vérifier et débloquer (appelé après actions clés)
router.post('/check', authenticate, async (req: AuthRequest, res) => {
  try {
    const newlyUnlocked = await checkAndUnlockAchievements(req.user!.id)
    res.json({
      newlyUnlocked: newlyUnlocked.map(ua => ua.achievementId)
    })
  } catch (error) {
    console.error('Error checking achievements:', error)
    res.status(500).json({ error: 'Erreur' })
  }
})

export default router
