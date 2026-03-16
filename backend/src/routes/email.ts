import express from 'express'
import crypto from 'crypto'
import bcrypt from 'bcrypt'
import { z } from 'zod'
import { AppDataSource } from '../config/database.js'
import { User } from '../entities/User.js'
import { authenticate, AuthRequest } from '../middlewares/auth.js'
import {
  sendVerificationEmail,
  sendPasswordResetEmail
} from '../services/email.js'

const router = express.Router()
const userRepo = AppDataSource.getRepository(User)

// ============================================================
// POST /api/email/verify/send — Envoyer l'email de vérification
// ============================================================
router.post('/verify/send', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await userRepo.findOne({ where: { id: req.userId } })
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' })

    if (user.emailVerified) {
      return res.json({ message: 'Email déjà vérifié' })
    }

    // Cooldown : ne pas renvoyer si un token a été envoyé il y a moins de 2 minutes
    if (user.emailVerificationExpires) {
      const tokenAge = 24 * 60 * 60 * 1000 - (user.emailVerificationExpires.getTime() - Date.now())
      if (tokenAge < 2 * 60 * 1000) {
        return res.json({ message: 'Un email a déjà été envoyé récemment. Réessayez dans quelques minutes.' })
      }
    }

    // Générer un token unique
    const token = crypto.randomBytes(32).toString('hex')
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
    user.emailVerificationToken = hashedToken
    user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000)
    await userRepo.save(user)

    // Envoyer l'email avec le token NON hashé
    await sendVerificationEmail(user.email, token)

    res.json({ message: 'Email de vérification envoyé' })
  } catch (error) {
    console.error('Error sending verification email:', error)
    res.status(500).json({ error: 'Erreur lors de l\'envoi' })
  }
})

// ============================================================
// GET /api/email/verify/:token — Confirmer l'email
// ============================================================
router.get('/verify/:token', async (req, res) => {
  try {
    const { token } = req.params
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

    const user = await userRepo.findOne({
      where: { emailVerificationToken: hashedToken }
    })

    if (!user) {
      return res.status(400).json({ error: 'Token invalide ou expiré' })
    }

    if (!user.emailVerificationExpires || user.emailVerificationExpires < new Date()) {
      return res.status(400).json({ error: 'Token expiré' })
    }

    user.emailVerified = true
    user.emailVerificationToken = undefined
    user.emailVerificationExpires = undefined
    await userRepo.save(user)

    // Rediriger vers le frontend avec un message de succès
    const appUrl = process.env.APP_URL || 'http://localhost:3000'
    res.redirect(`${appUrl}/login?verified=true`)
  } catch (error) {
    console.error('Error verifying email:', error)
    res.status(500).json({ error: 'Erreur de vérification' })
  }
})

// ============================================================
// POST /api/email/forgot-password — Demander un reset de mot de passe
// ============================================================
const forgotSchema = z.object({
  email: z.string().email().max(255)
})

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = forgotSchema.parse(req.body)

    const user = await userRepo.findOne({ where: { email } })

    // Toujours répondre OK (même si l'email n'existe pas) pour éviter l'énumération
    if (!user) {
      return res.json({ message: 'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.' })
    }

    // Cooldown : ne pas renvoyer si un token a été envoyé il y a moins de 2 minutes
    if (user.passwordResetExpires) {
      const tokenAge = 60 * 60 * 1000 - (user.passwordResetExpires.getTime() - Date.now())
      if (tokenAge < 2 * 60 * 1000) {
        return res.json({ message: 'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.' })
      }
    }

    // Générer un token + expiration (1h)
    const token = crypto.randomBytes(32).toString('hex')
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
    user.passwordResetToken = hashedToken
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000) // 1 heure
    await userRepo.save(user)

    await sendPasswordResetEmail(email, token)

    res.json({ message: 'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.' })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Email invalide' })
    }
    console.error('Error forgot password:', error)
    res.status(500).json({ error: 'Erreur' })
  }
})

// ============================================================
// POST /api/email/reset-password — Réinitialiser le mot de passe
// ============================================================
const resetSchema = z.object({
  token: z.string(),
  password: z.string().min(8).max(128)
})

router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = resetSchema.parse(req.body)
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

    const user = await userRepo.findOne({
      where: { passwordResetToken: hashedToken }
    })

    if (!user || !user.passwordResetExpires || user.passwordResetExpires < new Date()) {
      return res.status(400).json({ error: 'Token invalide ou expiré' })
    }

    // Mettre à jour le mot de passe
    user.password = await bcrypt.hash(password, 10)
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await userRepo.save(user)

    res.json({ message: 'Mot de passe réinitialisé avec succès' })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Données invalides' })
    }
    console.error('Error resetting password:', error)
    res.status(500).json({ error: 'Erreur lors de la réinitialisation' })
  }
})

export default router
