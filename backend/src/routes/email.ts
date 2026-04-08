import express from 'express';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { logger } from '../utils/logger.js';
import { AppDataSource } from '../config/database.js';
import { User } from '../entities/User.js';
import { authenticate, AuthRequest } from '../middlewares/auth.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../services/email.js';

const router = express.Router();
const userRepo = AppDataSource.getRepository(User);

// ============================================================
// POST /api/email/verify/send — Envoyer l'email de vérification
// ============================================================
router.post('/verify/send', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await userRepo.findOne({ where: { id: req.user!.id } });
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

    if (user.emailVerified) {
      return res.json({ message: 'Email déjà vérifié' });
    }

    // Check cooldown: if token was created less than 2 minutes ago, block
    if (user.emailVerificationExpires) {
      const TOKEN_LIFETIME = 24 * 60 * 60 * 1000; // 24h
      const tokenCreatedAt = user.emailVerificationExpires.getTime() - TOKEN_LIFETIME;
      const timeSinceCreation = Date.now() - tokenCreatedAt;
      if (timeSinceCreation < 2 * 60 * 1000) {
        return res.json({ message: 'Un email de vérification a déjà été envoyé récemment' });
      }
    }

    // Générer un token unique
    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await userRepo.save(user);

    // Envoyer l'email avec le token NON hashé
    await sendVerificationEmail(user.email, token);

    res.json({ message: 'Email de vérification envoyé' });
  } catch (error) {
    logger.error({ err: error, route: 'email' }, 'Error sending verification email');
    res.status(500).json({ error: "Erreur lors de l'envoi" });
  }
});

// ============================================================
// GET /api/email/verify/:token — Confirmer l'email
// ============================================================
router.get('/verify/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find users with a pending verification token
    const user = await userRepo.findOne({
      where: { emailVerificationToken: hashedToken },
    });

    if (!user || !user.emailVerificationToken) {
      // Dummy timing-safe comparison to ensure constant-time response (result intentionally ignored)
      const dummyBuf = crypto.randomBytes(32);
      const receivedBuf = Buffer.from(hashedToken, 'hex');
      crypto.timingSafeEqual(dummyBuf, receivedBuf);
      return res.status(400).json({ error: 'Token invalide ou expiré' });
    }

    // Timing-safe comparison to prevent timing attacks
    const storedTokenBuf = Buffer.from(user.emailVerificationToken, 'hex');
    const receivedTokenBuf = Buffer.from(hashedToken, 'hex');
    if (
      storedTokenBuf.length !== receivedTokenBuf.length ||
      !crypto.timingSafeEqual(storedTokenBuf, receivedTokenBuf)
    ) {
      return res.status(400).json({ error: 'Token invalide ou expiré' });
    }

    if (!user.emailVerificationExpires || user.emailVerificationExpires < new Date()) {
      return res.status(400).json({ error: 'Token expiré' });
    }

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await userRepo.save(user);

    // Rediriger vers le frontend avec un message de succès
    const appUrl = process.env.APP_URL || 'http://localhost:3000';
    res.redirect(`${appUrl}/login?verified=true`);
  } catch (error) {
    logger.error({ err: error, route: 'email' }, 'Error verifying email');
    res.status(500).json({ error: 'Erreur de vérification' });
  }
});

// ============================================================
// POST /api/email/forgot-password — Demander un reset de mot de passe
// ============================================================
const forgotSchema = z.object({
  email: z.string().email().max(255),
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = forgotSchema.parse(req.body);

    const user = await userRepo.findOne({ where: { email } });

    // Toujours répondre OK (même si l'email n'existe pas) pour éviter l'énumération
    if (!user) {
      return res.json({
        message: 'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.',
      });
    }

    // Cooldown : ne pas renvoyer si un token a été envoyé il y a moins de 2 minutes
    if (user.passwordResetExpires) {
      const tokenCreatedAt = user.passwordResetExpires.getTime() - 60 * 60 * 1000;
      const timeSinceCreation = Date.now() - tokenCreatedAt;
      if (timeSinceCreation < 2 * 60 * 1000) {
        return res.json({
          message: 'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.',
        });
      }
    }

    // Générer un token + expiration (1h)
    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 heure
    await userRepo.save(user);

    await sendPasswordResetEmail(email, token);

    res.json({
      message: 'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Email invalide' });
    }
    logger.error({ err: error, route: 'email' }, 'Error forgot password');
    res.status(500).json({ error: 'Erreur' });
  }
});

// ============================================================
// POST /api/email/reset-password — Réinitialiser le mot de passe
// ============================================================
const resetSchema = z.object({
  token: z.string(),
  password: z
    .string()
    .min(8)
    .max(128)
    .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
    .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
    .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre'),
});

router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = resetSchema.parse(req.body);
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await userRepo.findOne({
      where: { passwordResetToken: hashedToken },
    });

    if (!user || !user.passwordResetExpires || user.passwordResetExpires < new Date()) {
      // Dummy timing-safe comparison to ensure constant-time response (result intentionally ignored)
      const dummyBuf = crypto.randomBytes(32);
      const receivedBuf = Buffer.from(hashedToken, 'hex');
      crypto.timingSafeEqual(dummyBuf, receivedBuf);
      return res.status(400).json({ error: 'Token invalide ou expiré' });
    }

    // Mettre à jour le mot de passe
    user.password = await bcrypt.hash(password, 12);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await userRepo.save(user);

    res.json({ message: 'Mot de passe réinitialisé avec succès' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Données invalides' });
    }
    logger.error({ err: error, route: 'email' }, 'Error resetting password');
    res.status(500).json({ error: 'Erreur lors de la réinitialisation' });
  }
});

export default router;
