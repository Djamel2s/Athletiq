import express from 'express';
import { z } from 'zod';
import { AppDataSource } from '../config/database.js';
import { BodyStat } from '../entities/BodyStat.js';
import { authenticate, AuthRequest } from '../middlewares/auth.js';
import { parseId } from '../utils/validation.js';
import { isHttpError } from '../utils/errors.js';

const router = express.Router();
const bodyStatRepository = AppDataSource.getRepository(BodyStat);

const handleRouteError = (res: express.Response, error: unknown) => {
  if (isHttpError(error)) {
    return res.status(error.statusCode).json({ error: error.message });
  }
  return res.status(500).json({ error: 'Erreur interne du serveur' });
};

// Get all body stats for current user
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const limit = Math.min(Math.max(parseInt(req.query.limit as string, 10) || 50, 1), 100);
    const offset = Math.max(parseInt(req.query.offset as string, 10) || 0, 0);

    const [stats, total] = await bodyStatRepository.findAndCount({
      where: { userId: req.user!.id },
      order: { date: 'DESC' },
      take: limit,
      skip: offset,
    });

    res.json({ data: stats, total });
  } catch (error) {
    handleRouteError(res, error);
  }
});

// Create a body stat entry
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const schema = z.object({
      weight: z.number().positive().max(1000),
      bodyFat: z.number().min(0).max(100).nullish(),
      notes: z.string().max(2000).nullish(),
      date: z
        .string()
        .datetime()
        .nullish()
        .refine(
          (val) =>
            !val ||
            (new Date(val).getFullYear() >= 2000 &&
              new Date(val) <= new Date(Date.now() + 3600000)),
          { message: 'Date invalide' }
        ),
    });

    const data = schema.parse(req.body);

    const stat = bodyStatRepository.create({
      userId: req.user!.id,
      weight: data.weight,
      bodyFat: data.bodyFat ?? undefined,
      notes: data.notes ?? undefined,
      date: data.date ? new Date(data.date) : new Date(),
    });

    const saved = await bodyStatRepository.save(stat);
    res.status(201).json(saved);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Erreur de validation', details: error.errors });
    }
    handleRouteError(res, error);
  }
});

// Update a body stat entry
router.put('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const schema = z.object({
      weight: z.number().positive().nullish(),
      bodyFat: z.number().min(0).max(100).nullish(),
      notes: z.string().max(2000).nullish(),
      date: z.string().datetime().nullish(),
    });

    const data = schema.parse(req.body);

    const stat = await bodyStatRepository.findOne({
      where: { id: parseId(req.params.id), userId: req.user!.id },
    });

    if (!stat) {
      return res.status(404).json({ error: 'Stat corporelle non trouvée' });
    }

    if (data.weight != null) stat.weight = data.weight;
    if (data.bodyFat !== undefined) stat.bodyFat = data.bodyFat ?? undefined;
    if (data.notes !== undefined) stat.notes = data.notes ?? undefined;
    if (data.date) stat.date = new Date(data.date);

    const updated = await bodyStatRepository.save(stat);
    res.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Erreur de validation', details: error.errors });
    }
    handleRouteError(res, error);
  }
});

// Delete a body stat entry
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const stat = await bodyStatRepository.findOne({
      where: { id: parseId(req.params.id), userId: req.user!.id },
    });

    if (!stat) {
      return res.status(404).json({ error: 'Stat corporelle non trouvée' });
    }

    await bodyStatRepository.remove(stat);
    res.json({ message: 'Stat corporelle supprimée' });
  } catch (error) {
    handleRouteError(res, error);
  }
});

export default router;
