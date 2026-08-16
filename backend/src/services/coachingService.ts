import crypto from 'crypto';
import { AppDataSource } from '../config/database.js';
import { User, UserRole, CoachPlan } from '../entities/User.js';
import { CoachClientLink, CoachLinkStatus } from '../entities/CoachClientLink.js';
import { CoachNote } from '../entities/CoachNote.js';
import { Workout } from '../entities/Workout.js';
import { Exercise } from '../entities/Exercise.js';
import { ExerciseLibrary } from '../entities/ExerciseLibrary.js';
import { BodyStat } from '../entities/BodyStat.js';
import { Measurement } from '../entities/Measurement.js';
import { WorkoutPhoto } from '../entities/WorkoutPhoto.js';
import { WorkoutProgram } from '../entities/WorkoutProgram.js';
import { ProgramDay } from '../entities/ProgramDay.js';
import { COACH_PLAN_LIMITS } from '../config/planLimits.js';
import { withUserLock } from './limitService.js';
import { createNotification } from './notificationService.js';
import { NotificationType } from '../entities/Notification.js';
import { BadRequestError, HttpError } from '../utils/errors.js';

const userRepo = () => AppDataSource.getRepository(User);
const linkRepo = () => AppDataSource.getRepository(CoachClientLink);
const noteRepo = () => AppDataSource.getRepository(CoachNote);
const workoutRepo = () => AppDataSource.getRepository(Workout);

class ForbiddenError extends HttpError {
  constructor(message: string) {
    super(403, message);
    this.name = 'ForbiddenError';
  }
}

class NotFoundError extends HttpError {
  constructor(message: string) {
    super(404, message);
    this.name = 'NotFoundError';
  }
}

// Caractères sans ambiguïté visuelle (pas de 0/O, 1/I/L)
const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

function generateCode(length = 7): string {
  let code = '';
  const bytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    code += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length];
  }
  return code;
}

/**
 * Active le rôle coach pour l'utilisateur et génère son code d'invitation
 * s'il n'en a pas déjà un. Idempotent.
 */
export async function becomeCoach(userId: number): Promise<User> {
  const user = await userRepo().findOne({ where: { id: userId } });
  if (!user) throw new NotFoundError('Utilisateur introuvable');

  let changed = false;
  if (user.role !== UserRole.COACH) {
    user.role = UserRole.COACH;
    changed = true;
  }
  if (!user.coachInviteCode) {
    // Garantir l'unicité (collision extrêmement improbable, mais on vérifie)
    let code = generateCode();
    while (await userRepo().findOne({ where: { coachInviteCode: code } })) {
      code = generateCode();
    }
    user.coachInviteCode = code;
    changed = true;
  }

  if (changed) await userRepo().save(user);
  return user;
}

export async function updateCoachProfile(
  userId: number,
  data: { coachBio?: string }
): Promise<User> {
  const user = await userRepo().findOne({ where: { id: userId } });
  if (!user) throw new NotFoundError('Utilisateur introuvable');
  if (user.role !== UserRole.COACH) throw new ForbiddenError("Vous n'êtes pas coach");

  if (data.coachBio !== undefined) user.coachBio = data.coachBio.slice(0, 1000);
  await userRepo().save(user);
  return user;
}

export async function countActiveClients(coachId: number): Promise<number> {
  return linkRepo().count({ where: { coachId, status: CoachLinkStatus.ACTIVE } });
}

async function assertCoachHasCapacity(coach: User) {
  const limit = COACH_PLAN_LIMITS[coach.coachPlan as CoachPlan].maxClients;
  if (limit === Infinity) return;
  const current = await countActiveClients(coach.id);
  if (current >= limit) {
    throw new HttpError(
      403,
      `Limite de ${limit} clients atteinte pour votre plan. Passez au plan Coach Pro pour un nombre illimité de clients.`
    );
  }
}

export async function getCoachStatus(userId: number) {
  const user = await userRepo().findOne({ where: { id: userId } });
  if (!user) throw new NotFoundError('Utilisateur introuvable');

  const isCoach = user.role === UserRole.COACH;
  const clientCount = isCoach ? await countActiveClients(userId) : 0;
  const limit = COACH_PLAN_LIMITS[user.coachPlan as CoachPlan].maxClients;

  return {
    isCoach,
    coachInviteCode: user.coachInviteCode ?? null,
    coachBio: user.coachBio ?? null,
    coachPlan: user.coachPlan,
    clientCount,
    maxClients: limit === Infinity ? null : limit,
  };
}

/**
 * Un athlète rejoint le roster d'un coach via son code d'invitation.
 * Le lien est immédiatement ACTIVE : l'athlète, en saisissant le code, donne
 * lui-même son consentement (contrairement à une invitation reçue par email).
 */
export async function joinCoachByCode(
  athleteId: number,
  rawCode: string
): Promise<CoachClientLink> {
  const code = rawCode.trim().toUpperCase();
  if (!code) throw new BadRequestError('Code invalide');

  const coach = await userRepo().findOne({ where: { coachInviteCode: code } });
  if (!coach || coach.role !== UserRole.COACH) {
    throw new BadRequestError('Code coach invalide');
  }
  if (coach.id === athleteId) {
    throw new BadRequestError('Vous ne pouvez pas vous ajouter vous-même');
  }

  return withUserLock(coach.id, 'coach-link-capacity', async () => {
    const existing = await linkRepo().findOne({
      where: { coachId: coach.id, athleteId },
    });

    if (existing?.status === CoachLinkStatus.ACTIVE) {
      throw new BadRequestError('Ce coach fait déjà partie de vos coachs');
    }

    await assertCoachHasCapacity(coach);

    let link: CoachClientLink;
    if (existing) {
      existing.status = CoachLinkStatus.ACTIVE;
      existing.initiatedBy = 'ATHLETE';
      existing.acceptedAt = new Date();
      existing.revokedAt = undefined;
      link = await linkRepo().save(existing);
    } else {
      link = await linkRepo().save(
        linkRepo().create({
          coachId: coach.id,
          athleteId,
          status: CoachLinkStatus.ACTIVE,
          initiatedBy: 'ATHLETE',
          acceptedAt: new Date(),
        })
      );
    }

    const athlete = await userRepo().findOne({ where: { id: athleteId } });
    await createNotification(
      coach.id,
      NotificationType.COACH_LINK_JOINED,
      'Nouveau client',
      `${athlete?.firstName || 'Un athlète'} a rejoint votre espace coach.`
    );

    return link;
  });
}

/**
 * Un coach invite un client par email ou nom d'utilisateur.
 * Le lien reste PENDING tant que le client n'a pas accepté.
 */
export async function inviteClient(coachId: number, identifier: string): Promise<CoachClientLink> {
  const coach = await userRepo().findOne({ where: { id: coachId } });
  if (!coach) throw new NotFoundError('Utilisateur introuvable');
  if (coach.role !== UserRole.COACH) throw new ForbiddenError("Vous n'êtes pas coach");

  const normalized = identifier.trim().toLowerCase();
  const athlete = await userRepo()
    .createQueryBuilder('u')
    .where('LOWER(u.email) = :normalized OR LOWER(u.username) = :normalized', { normalized })
    .getOne();

  if (!athlete) throw new NotFoundError('Aucun utilisateur trouvé avec cet identifiant');
  if (athlete.id === coachId)
    throw new BadRequestError('Vous ne pouvez pas vous inviter vous-même');

  return withUserLock(coachId, 'coach-link-capacity', async () => {
    const existing = await linkRepo().findOne({ where: { coachId, athleteId: athlete.id } });

    if (existing?.status === CoachLinkStatus.ACTIVE) {
      throw new BadRequestError('Cet athlète fait déjà partie de vos clients');
    }
    if (existing?.status === CoachLinkStatus.PENDING) {
      throw new BadRequestError('Une invitation est déjà en attente pour cet athlète');
    }

    await assertCoachHasCapacity(coach);

    let link: CoachClientLink;
    if (existing) {
      existing.status = CoachLinkStatus.PENDING;
      existing.initiatedBy = 'COACH';
      existing.revokedAt = undefined;
      link = await linkRepo().save(existing);
    } else {
      link = await linkRepo().save(
        linkRepo().create({
          coachId,
          athleteId: athlete.id,
          status: CoachLinkStatus.PENDING,
          initiatedBy: 'COACH',
        })
      );
    }

    await createNotification(
      athlete.id,
      NotificationType.COACH_LINK_REQUEST,
      'Invitation coach',
      `${coach.firstName || 'Un coach'} souhaite vous suivre sur Athletiq.`
    );

    return link;
  });
}

export async function acceptCoachInvite(
  athleteId: number,
  linkId: number
): Promise<CoachClientLink> {
  const link = await linkRepo().findOne({ where: { id: linkId, athleteId } });
  if (!link) throw new NotFoundError('Invitation introuvable');
  if (link.status !== CoachLinkStatus.PENDING) {
    throw new BadRequestError('Cette invitation ne peut plus être acceptée');
  }

  const coach = await userRepo().findOne({ where: { id: link.coachId } });
  if (!coach) throw new NotFoundError('Coach introuvable');

  return withUserLock(coach.id, 'coach-link-capacity', async () => {
    await assertCoachHasCapacity(coach);

    link.status = CoachLinkStatus.ACTIVE;
    link.acceptedAt = new Date();
    const saved = await linkRepo().save(link);

    const athlete = await userRepo().findOne({ where: { id: athleteId } });
    await createNotification(
      coach.id,
      NotificationType.COACH_LINK_ACCEPTED,
      'Invitation acceptée',
      `${athlete?.firstName || 'Votre invité'} a accepté de rejoindre votre espace coach.`
    );

    return saved;
  });
}

export async function declineCoachInvite(athleteId: number, linkId: number): Promise<void> {
  const link = await linkRepo().findOne({ where: { id: linkId, athleteId } });
  if (!link) throw new NotFoundError('Invitation introuvable');
  if (link.status !== CoachLinkStatus.PENDING) {
    throw new BadRequestError('Cette invitation ne peut plus être déclinée');
  }
  link.status = CoachLinkStatus.REVOKED;
  link.revokedAt = new Date();
  await linkRepo().save(link);
}

/**
 * Révoque un lien coach-client. Utilisable par le coach OU l'athlète —
 * le client garde toujours la main pour couper l'accès.
 */
export async function revokeLink(userId: number, linkId: number): Promise<void> {
  const link = await linkRepo().findOne({ where: { id: linkId } });
  if (!link) throw new NotFoundError('Lien introuvable');
  if (link.coachId !== userId && link.athleteId !== userId) {
    throw new ForbiddenError("Vous n'avez pas accès à ce lien");
  }
  if (link.status === CoachLinkStatus.REVOKED) return;

  link.status = CoachLinkStatus.REVOKED;
  link.revokedAt = new Date();
  await linkRepo().save(link);

  const otherPartyId = userId === link.coachId ? link.athleteId : link.coachId;
  await createNotification(
    otherPartyId,
    NotificationType.COACH_LINK_REVOKED,
    'Accès coach révoqué',
    'Une relation coach-client a été résiliée.'
  );
}

export async function updateClientPermissions(
  athleteId: number,
  linkId: number,
  perms: Partial<
    Pick<
      CoachClientLink,
      | 'canViewWorkouts'
      | 'canViewPhotos'
      | 'canViewMeasurements'
      | 'canViewBodyStats'
      | 'canAssignPrograms'
    >
  >
): Promise<CoachClientLink> {
  const link = await linkRepo().findOne({ where: { id: linkId, athleteId } });
  if (!link) throw new NotFoundError('Lien introuvable');
  if (link.status !== CoachLinkStatus.ACTIVE) {
    throw new BadRequestError("Ce lien n'est pas actif");
  }

  Object.assign(link, perms);
  return linkRepo().save(link);
}

export async function listClients(coachId: number) {
  const links = await linkRepo().find({
    where: { coachId, status: CoachLinkStatus.ACTIVE },
    order: { createdAt: 'DESC' },
  });

  const now = new Date();
  const startOfWeek = new Date(now);
  const dayOfWeek = startOfWeek.getDay() || 7; // dimanche -> 7
  startOfWeek.setDate(startOfWeek.getDate() - (dayOfWeek - 1));
  startOfWeek.setHours(0, 0, 0, 0);

  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  const twentyEightDaysAgo = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000);

  const results = [];
  for (const link of links) {
    const athlete = await userRepo().findOne({
      where: { id: link.athleteId },
      select: ['id', 'firstName', 'lastName', 'username', 'avatarUrl', 'streakGoalPerWeek'],
    });
    if (!athlete) continue;

    const lastWorkout = await workoutRepo()
      .createQueryBuilder('w')
      .where('w.userId = :id', { id: link.athleteId })
      .andWhere('w.completedAt IS NOT NULL')
      .orderBy('w.completedAt', 'DESC')
      .getOne();

    // Observance : seances realisees cette semaine (lun-dim) vs objectif hebdo du client
    const sessionsThisWeek = await workoutRepo()
      .createQueryBuilder('w')
      .where('w.userId = :id', { id: link.athleteId })
      .andWhere('w.completedAt >= :start', { start: startOfWeek })
      .getCount();

    // Tendance de volume : 14 derniers jours vs les 14 jours precedents
    let volumeTrend: 'up' | 'down' | 'flat' | null = null;
    if (link.canViewWorkouts) {
      const recentVolumeRaw = await workoutRepo()
        .createQueryBuilder('w')
        .select('COALESCE(SUM(w.totalVolume), 0)', 'sum')
        .where('w.userId = :id', { id: link.athleteId })
        .andWhere('w.completedAt >= :from', { from: fourteenDaysAgo })
        .getRawOne();
      const previousVolumeRaw = await workoutRepo()
        .createQueryBuilder('w')
        .select('COALESCE(SUM(w.totalVolume), 0)', 'sum')
        .where('w.userId = :id', { id: link.athleteId })
        .andWhere('w.completedAt >= :from AND w.completedAt < :to', {
          from: twentyEightDaysAgo,
          to: fourteenDaysAgo,
        })
        .getRawOne();

      const recentVolume = Number(recentVolumeRaw?.sum || 0);
      const previousVolume = Number(previousVolumeRaw?.sum || 0);

      if (previousVolume === 0 && recentVolume === 0) {
        volumeTrend = null;
      } else if (previousVolume === 0) {
        volumeTrend = 'up';
      } else {
        const change = (recentVolume - previousVolume) / previousVolume;
        if (change > 0.05) volumeTrend = 'up';
        else if (change < -0.05) volumeTrend = 'down';
        else volumeTrend = 'flat';
      }
    }

    results.push({
      linkId: link.id,
      athlete: {
        id: athlete.id,
        firstName: athlete.firstName,
        lastName: athlete.lastName,
        username: athlete.username,
        avatarUrl: athlete.avatarUrl,
      },
      permissions: {
        canViewWorkouts: link.canViewWorkouts,
        canViewPhotos: link.canViewPhotos,
        canViewMeasurements: link.canViewMeasurements,
        canViewBodyStats: link.canViewBodyStats,
        canAssignPrograms: link.canAssignPrograms,
      },
      lastWorkoutAt: lastWorkout?.completedAt ?? null,
      clientSince: link.acceptedAt ?? link.createdAt,
      sessionsThisWeek,
      weeklyTarget: athlete.streakGoalPerWeek || 2,
      volumeTrend,
    });
  }

  return results;
}

/**
 * Vue d'ensemble d'un client pour le coach — chaque section n'est incluse
 * que si l'athlète a explicitement accordé la permission correspondante.
 */
export async function getClientOverview(coachId: number, athleteId: number) {
  const link = await linkRepo().findOne({
    where: { coachId, athleteId, status: CoachLinkStatus.ACTIVE },
  });
  if (!link) throw new ForbiddenError("Vous n'avez pas accès à cet athlète");

  const athlete = await userRepo().findOne({
    where: { id: athleteId },
    select: ['id', 'firstName', 'lastName', 'username', 'avatarUrl', 'goal'],
  });
  if (!athlete) throw new NotFoundError('Athlète introuvable');

  const overview: Record<string, unknown> = {
    athlete,
    permissions: {
      canViewWorkouts: link.canViewWorkouts,
      canViewPhotos: link.canViewPhotos,
      canViewMeasurements: link.canViewMeasurements,
      canViewBodyStats: link.canViewBodyStats,
      canAssignPrograms: link.canAssignPrograms,
    },
  };

  if (link.canViewWorkouts) {
    // 200 seances (pas juste les 10 dernieres) : necessaire pour calculer des courbes
    // de progression et tendances cote coach, pas juste afficher une liste
    overview.recentWorkouts = await workoutRepo().find({
      where: { userId: athleteId, isTemplate: false },
      order: { completedAt: 'DESC' },
      take: 200,
      relations: ['exercises', 'exercises.sets'],
    });

    const totalCompleted = await workoutRepo().count({
      where: { userId: athleteId, isTemplate: false },
    });
    overview.totalWorkouts = totalCompleted;
  }

  if (link.canViewBodyStats) {
    overview.recentBodyStats = await AppDataSource.getRepository(BodyStat).find({
      where: { userId: athleteId },
      order: { date: 'DESC' },
      take: 10,
    });
  }

  if (link.canViewMeasurements) {
    overview.recentMeasurements = await AppDataSource.getRepository(Measurement).find({
      where: { userId: athleteId },
      order: { date: 'DESC' },
      take: 5,
    });
  }

  if (link.canViewPhotos) {
    overview.recentPhotos = await AppDataSource.getRepository(WorkoutPhoto)
      .createQueryBuilder('p')
      .innerJoin('p.workout', 'w')
      .where('w.userId = :athleteId', { athleteId })
      .orderBy('p.createdAt', 'DESC')
      .take(10)
      .getMany();
  }

  const assignedWorkouts = await workoutRepo().find({
    where: { userId: athleteId, assignedByCoachId: coachId },
    order: { createdAt: 'DESC' },
  });
  overview.assignedPrograms = assignedWorkouts;

  return overview;
}

/**
 * Assigne un programme du catalogue à un client : crée les templates
 * directement dans le compte du client, comme le ferait "adopter un programme",
 * mais initié par le coach et tagué assignedByCoachId.
 */
export async function assignCatalogProgram(
  coachId: number,
  athleteId: number,
  slug: string,
  note?: string
) {
  const link = await linkRepo().findOne({
    where: { coachId, athleteId, status: CoachLinkStatus.ACTIVE },
  });
  if (!link) throw new ForbiddenError("Vous n'avez pas accès à cet athlète");
  if (!link.canAssignPrograms) {
    throw new ForbiddenError("Ce client n'a pas autorisé l'assignation de programmes");
  }

  const program = await AppDataSource.getRepository(WorkoutProgram).findOne({
    where: { slug, isActive: true },
    relations: ['days'],
  });
  if (!program) throw new NotFoundError('Programme introuvable');

  const exerciseRepo = AppDataSource.getRepository(Exercise);
  const exerciseLibraryRepo = AppDataSource.getRepository(ExerciseLibrary);
  const createdWorkouts: Workout[] = [];

  for (const day of program.days.sort((a, b) => a.dayIndex - b.dayIndex)) {
    const workout = workoutRepo().create({
      name: `${program.name} — ${day.name}`,
      description: program.description,
      isTemplate: true,
      userId: athleteId,
      assignedByCoachId: coachId,
      date: new Date(),
      notes: note?.slice(0, 500),
    });
    await workoutRepo().save(workout);

    for (let i = 0; i < day.exercises.length; i++) {
      const ex = day.exercises[i];
      const libraryExercise = await exerciseLibraryRepo.findOne({
        where: { name: ex.exerciseName },
      });
      const exercise = exerciseRepo.create({
        workoutId: workout.id,
        name: ex.exerciseName,
        exerciseLibraryId: libraryExercise?.id ?? undefined,
        orderIndex: i,
        targetSets: ex.sets,
        restTime: ex.restSeconds,
        notes: ex.notes ?? undefined,
      });
      await exerciseRepo.save(exercise);
    }

    createdWorkouts.push(workout);
  }

  const coach = await userRepo().findOne({ where: { id: coachId } });
  await createNotification(
    athleteId,
    NotificationType.PROGRAM_ASSIGNED,
    'Nouveau programme',
    `${coach?.firstName || 'Votre coach'} vous a assigné le programme "${program.name}".`
  );

  return createdWorkouts;
}

export async function addCoachNote(
  coachId: number,
  athleteId: number,
  content: string,
  workoutId?: number
): Promise<CoachNote> {
  const link = await linkRepo().findOne({
    where: { coachId, athleteId, status: CoachLinkStatus.ACTIVE },
  });
  if (!link) throw new ForbiddenError("Vous n'avez pas accès à cet athlète");
  if (!content?.trim()) throw new BadRequestError('La note ne peut pas être vide');

  const note = noteRepo().create({
    coachId,
    athleteId,
    content: content.trim().slice(0, 2000),
    workoutId,
  });
  return noteRepo().save(note);
}

export async function listCoachNotes(requesterId: number, athleteId: number, coachId?: number) {
  // Le coach ne voit que ses propres notes sur ce client ; le client voit toutes les notes reçues
  if (requesterId === athleteId) {
    return noteRepo().find({ where: { athleteId }, order: { createdAt: 'DESC' } });
  }
  if (coachId && requesterId === coachId) {
    const link = await linkRepo().findOne({
      where: { coachId, athleteId, status: CoachLinkStatus.ACTIVE },
    });
    if (!link) throw new ForbiddenError("Vous n'avez pas accès à cet athlète");
    return noteRepo().find({ where: { coachId, athleteId }, order: { createdAt: 'DESC' } });
  }
  throw new ForbiddenError('Accès refusé');
}

/**
 * Liens actifs et invitations reçues pour un athlète (vue "Mon coach").
 */
export async function getMyCoaches(athleteId: number) {
  const activeLinks = await linkRepo().find({
    where: { athleteId, status: CoachLinkStatus.ACTIVE },
    order: { acceptedAt: 'DESC' },
  });
  const pendingInvites = await linkRepo().find({
    where: { athleteId, status: CoachLinkStatus.PENDING, initiatedBy: 'COACH' },
    order: { createdAt: 'DESC' },
  });

  const hydrate = async (link: CoachClientLink) => {
    const coach = await userRepo().findOne({
      where: { id: link.coachId },
      select: ['id', 'firstName', 'lastName', 'username', 'avatarUrl', 'coachBio'],
    });
    return {
      linkId: link.id,
      coach,
      status: link.status,
      permissions: {
        canViewWorkouts: link.canViewWorkouts,
        canViewPhotos: link.canViewPhotos,
        canViewMeasurements: link.canViewMeasurements,
        canViewBodyStats: link.canViewBodyStats,
        canAssignPrograms: link.canAssignPrograms,
      },
      since: link.acceptedAt ?? link.createdAt,
    };
  };

  return {
    coaches: await Promise.all(activeLinks.map(hydrate)),
    pendingInvites: await Promise.all(pendingInvites.map(hydrate)),
  };
}
