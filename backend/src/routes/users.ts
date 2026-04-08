import express from 'express';
import multer from 'multer';
import { z } from 'zod';
import cloudinary from '../config/cloudinary.js';
import { AppDataSource } from '../config/database.js';
import { logger } from '../utils/logger.js';
import { User } from '../entities/User.js';
import { authenticate, AuthRequest } from '../middlewares/auth.js';
import { validateImageMagicBytes } from '../utils/fileValidation.js';

const router = express.Router();
const userRepository = AppDataSource.getRepository(User);

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Type de fichier non autorisé. Utilisez JPG, PNG, WebP ou GIF.'));
    }
  },
});

// Get current user profile
router.get('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await userRepository.findOne({
      where: { id: req.user!.id },
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'avatarUrl',
        'goal',
        'gender',
        'streakGoalPerWeek',
        'bestStreak',
        'reminderEnabled',
        'reminderTime',
        'inactivityThresholdDays',
        'createdAt',
        'updatedAt',
      ],
    });

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du profil' });
  }
});

// Update user profile
router.put('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    const updateSchema = z.object({
      firstName: z.string().max(100).nullish(),
      lastName: z.string().max(100).nullish(),
      avatarUrl: z.string().url().nullish(),
      goal: z.enum(['BULK', 'STRENGTH', 'RECOMP', 'CUT']).nullish(),
      gender: z.enum(['male', 'female']).nullish(),
      streakGoalPerWeek: z.number().int().min(1).max(7).nullish(),
      reminderEnabled: z.boolean().nullish(),
      reminderTime: z
        .string()
        .regex(/^\d{2}:\d{2}$/)
        .nullish(),
      inactivityThresholdDays: z.number().int().min(1).max(14).nullish(),
    });

    const data = updateSchema.parse(req.body);

    // Build update object with only explicitly allowed fields
    const updateData: Record<string, unknown> = {};
    const allowedFields = [
      'firstName',
      'lastName',
      'goal',
      'gender',
      'reminderEnabled',
      'reminderTime',
      'streakGoalPerWeek',
      'inactivityThresholdDays',
    ] as const;
    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        updateData[field] = data[field] === null ? undefined : data[field];
      }
    }

    await userRepository.update(req.user!.id, updateData);

    const user = await userRepository.findOne({
      where: { id: req.user!.id },
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'avatarUrl',
        'goal',
        'gender',
        'streakGoalPerWeek',
        'bestStreak',
        'reminderEnabled',
        'reminderTime',
        'inactivityThresholdDays',
        'updatedAt',
      ],
    });

    res.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Erreur de validation', details: error.errors });
    }
    res.status(500).json({ error: 'Erreur lors de la mise à jour du profil' });
  }
});

// Upload avatar
router.post('/me/avatar', authenticate, upload.single('avatar'), async (req: AuthRequest, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucune image fournie' });
    }

    if (!validateImageMagicBytes(req.file.buffer)) {
      return res.status(400).json({
        error: 'Type de fichier non autorisé. Le contenu ne correspond pas à une image valide.',
      });
    }

    // Delete old avatar from Cloudinary if exists
    const currentUser = await userRepository.findOne({
      where: { id: req.user!.id },
      select: ['avatarUrl'],
    });
    if (currentUser?.avatarUrl) {
      const parts = currentUser.avatarUrl.split('/');
      const athletiqIndex = parts.indexOf('athletiq');
      if (athletiqIndex !== -1) {
        const publicId = parts
          .slice(athletiqIndex)
          .join('/')
          .replace(/\.[^.]+$/, '');
        await cloudinary.uploader.destroy(publicId).catch(() => {});
      }
    }

    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'athletiq/avatars',
          transformation: [
            { width: 400, height: 400, crop: 'fill', gravity: 'face' },
            { quality: 'auto', fetch_format: 'auto' },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file!.buffer);
    });

    if (!result?.secure_url) {
      return res.status(500).json({ error: 'Erreur Cloudinary : réponse invalide' });
    }

    await userRepository.update(req.user!.id, { avatarUrl: result.secure_url });

    const user = await userRepository.findOne({
      where: { id: req.user!.id },
      select: ['id', 'email', 'firstName', 'lastName', 'avatarUrl', 'goal', 'gender'],
    });

    res.json(user);
  } catch (error) {
    logger.error({ err: error, route: 'users' }, 'Avatar upload error');
    res.status(500).json({ error: "Erreur lors du téléchargement de l'avatar" });
  }
});

// Delete avatar
router.delete('/me/avatar', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await userRepository.findOne({
      where: { id: req.user!.id },
      select: ['id', 'avatarUrl'],
    });
    if (!user?.avatarUrl) {
      return res.status(400).json({ error: 'Aucun avatar à supprimer' });
    }

    // Delete from Cloudinary
    const parts = user.avatarUrl.split('/');
    const athletiqIndex = parts.indexOf('athletiq');
    if (athletiqIndex === -1) {
      logger.error(
        { avatarUrl: user.avatarUrl, route: 'users' },
        'Could not extract Cloudinary publicId from URL'
      );
    } else {
      const publicId = parts
        .slice(athletiqIndex)
        .join('/')
        .replace(/\.[^.]+$/, '');
      await cloudinary.uploader.destroy(publicId).catch(() => {});
    }

    // Remove from DB
    await userRepository.update(req.user!.id, { avatarUrl: undefined });

    res.json({ message: 'Avatar supprimé' });
  } catch (error) {
    logger.error({ err: error, route: 'users' }, 'Avatar delete error');
    res.status(500).json({ error: "Erreur lors de la suppression de l'avatar" });
  }
});

// Delete user account
router.delete('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    await userRepository.delete(req.user!.id);
    res.json({ message: 'Compte supprimé' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression du compte' });
  }
});

export default router;
