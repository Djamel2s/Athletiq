import express from 'express';
import { authenticate, AuthRequest } from '../middlewares/auth.js';
import { isHttpError } from '../utils/errors.js';
import { parseId } from '../utils/validation.js';
import { logger } from '../utils/logger.js';
import * as coachingService from '../services/coachingService.js';

const router = express.Router();

// Petit wrapper pour éviter de dupliquer le try/catch HttpError dans chaque route
function handle(fn: (req: AuthRequest, res: express.Response) => Promise<void>) {
  return async (req: AuthRequest, res: express.Response) => {
    try {
      await fn(req, res);
    } catch (error) {
      if (isHttpError(error)) {
        res.status(error.statusCode).json({ error: error.message });
        return;
      }
      logger.error({ err: error, route: 'coaching' }, 'Coaching route error');
      res.status(500).json({ error: 'Une erreur est survenue' });
    }
  };
}

// ---------- Espace coach (compte du coach) ----------

// GET /api/coaching/status — infos sur mon espace coach (rôle, code, quota)
router.get(
  '/status',
  authenticate,
  handle(async (req, res) => {
    const status = await coachingService.getCoachStatus(req.user!.id);
    res.json(status);
  })
);

// POST /api/coaching/become-coach — activer le rôle coach + générer le code
router.post(
  '/become-coach',
  authenticate,
  handle(async (req, res) => {
    await coachingService.becomeCoach(req.user!.id);
    const status = await coachingService.getCoachStatus(req.user!.id);
    res.status(201).json(status);
  })
);

// PATCH /api/coaching/profile — mettre à jour la bio coach
router.patch(
  '/profile',
  authenticate,
  handle(async (req, res) => {
    const { coachBio } = req.body ?? {};
    const user = await coachingService.updateCoachProfile(req.user!.id, { coachBio });
    res.json({ coachBio: user.coachBio });
  })
);

// GET /api/coaching/clients — liste des clients actifs du coach
router.get(
  '/clients',
  authenticate,
  handle(async (req, res) => {
    const clients = await coachingService.listClients(req.user!.id);
    res.json({ clients });
  })
);

// GET /api/coaching/clients/:athleteId — vue d'ensemble d'un client
router.get(
  '/clients/:athleteId',
  authenticate,
  handle(async (req, res) => {
    const athleteId = parseId(req.params.athleteId);
    const overview = await coachingService.getClientOverview(req.user!.id, athleteId);
    res.json(overview);
  })
);

// POST /api/coaching/invite — inviter un client par email ou pseudo
router.post(
  '/invite',
  authenticate,
  handle(async (req, res) => {
    const { identifier } = req.body ?? {};
    if (!identifier || typeof identifier !== 'string') {
      res.status(400).json({ error: 'Identifiant requis (email ou pseudo)' });
      return;
    }
    const link = await coachingService.inviteClient(req.user!.id, identifier);
    res.status(201).json({ link });
  })
);

// POST /api/coaching/clients/:athleteId/assign-program — assigner un programme du catalogue
router.post(
  '/clients/:athleteId/assign-program',
  authenticate,
  handle(async (req, res) => {
    const athleteId = parseId(req.params.athleteId);
    const { slug, note } = req.body ?? {};
    if (!slug || typeof slug !== 'string') {
      res.status(400).json({ error: 'slug du programme requis' });
      return;
    }
    const workouts = await coachingService.assignCatalogProgram(
      req.user!.id,
      athleteId,
      slug,
      note
    );
    res.status(201).json({ message: 'Programme assigné', workoutIds: workouts.map((w) => w.id) });
  })
);

// POST /api/coaching/clients/:athleteId/notes — ajouter une note sur un client
router.post(
  '/clients/:athleteId/notes',
  authenticate,
  handle(async (req, res) => {
    const athleteId = parseId(req.params.athleteId);
    const { content, workoutId } = req.body ?? {};
    if (!content || typeof content !== 'string') {
      res.status(400).json({ error: 'Contenu requis' });
      return;
    }
    const note = await coachingService.addCoachNote(
      req.user!.id,
      athleteId,
      content,
      workoutId ? parseId(String(workoutId)) : undefined
    );
    res.status(201).json({ note });
  })
);

// GET /api/coaching/clients/:athleteId/notes — notes du coach sur ce client
router.get(
  '/clients/:athleteId/notes',
  authenticate,
  handle(async (req, res) => {
    const athleteId = parseId(req.params.athleteId);
    const notes = await coachingService.listCoachNotes(req.user!.id, athleteId, req.user!.id);
    res.json({ notes });
  })
);

// ---------- Côté athlète ----------

// GET /api/coaching/my-coaches — mes coachs actifs + invitations reçues
router.get(
  '/my-coaches',
  authenticate,
  handle(async (req, res) => {
    const data = await coachingService.getMyCoaches(req.user!.id);
    res.json(data);
  })
);

// GET /api/coaching/my-notes — notes que mes coachs m'ont laissées
router.get(
  '/my-notes',
  authenticate,
  handle(async (req, res) => {
    const notes = await coachingService.listCoachNotes(req.user!.id, req.user!.id);
    res.json({ notes });
  })
);

// POST /api/coaching/join/:code — rejoindre un coach via son code d'invitation
router.post(
  '/join/:code',
  authenticate,
  handle(async (req, res) => {
    const link = await coachingService.joinCoachByCode(req.user!.id, req.params.code);
    res.status(201).json({ link });
  })
);

// POST /api/coaching/links/:linkId/accept — accepter une invitation reçue d'un coach
router.post(
  '/links/:linkId/accept',
  authenticate,
  handle(async (req, res) => {
    const linkId = parseId(req.params.linkId);
    const link = await coachingService.acceptCoachInvite(req.user!.id, linkId);
    res.json({ link });
  })
);

// POST /api/coaching/links/:linkId/decline — décliner une invitation reçue d'un coach
router.post(
  '/links/:linkId/decline',
  authenticate,
  handle(async (req, res) => {
    const linkId = parseId(req.params.linkId);
    await coachingService.declineCoachInvite(req.user!.id, linkId);
    res.json({ success: true });
  })
);

// PATCH /api/coaching/links/:linkId/permissions — l'athlète ajuste ce que son coach peut voir
router.patch(
  '/links/:linkId/permissions',
  authenticate,
  handle(async (req, res) => {
    const linkId = parseId(req.params.linkId);
    const {
      canViewWorkouts,
      canViewPhotos,
      canViewMeasurements,
      canViewBodyStats,
      canAssignPrograms,
    } = req.body ?? {};
    const link = await coachingService.updateClientPermissions(req.user!.id, linkId, {
      canViewWorkouts,
      canViewPhotos,
      canViewMeasurements,
      canViewBodyStats,
      canAssignPrograms,
    });
    res.json({ link });
  })
);

// DELETE /api/coaching/links/:linkId — révoquer un lien (coach ou athlète)
router.delete(
  '/links/:linkId',
  authenticate,
  handle(async (req, res) => {
    const linkId = parseId(req.params.linkId);
    await coachingService.revokeLink(req.user!.id, linkId);
    res.json({ success: true });
  })
);

export default router;
