import { AppDataSource } from '../config/database.js';
import { UserAchievement } from '../entities/Achievement.js';
import { Workout } from '../entities/Workout.js';
import { BodyStat } from '../entities/BodyStat.js';
import { WorkoutPhoto } from '../entities/WorkoutPhoto.js';
import { Notification } from '../entities/Notification.js';
import { User } from '../entities/User.js';
import { ACHIEVEMENTS } from '../config/achievements.js';

const achievementRepo = AppDataSource.getRepository(UserAchievement);
const workoutRepo = AppDataSource.getRepository(Workout);
const bodyStatRepo = AppDataSource.getRepository(BodyStat);
const photoRepo = AppDataSource.getRepository(WorkoutPhoto);
const notificationRepo = AppDataSource.getRepository(Notification);
const userRepo = AppDataSource.getRepository(User);

interface UserStats {
  workoutCount: number;
  totalVolume: number;
  bestStreak: number;
  prCount: number;
  bodyEntries: number;
  photoCount: number;
  daysMember: number;
}

async function getUserStats(userId: number): Promise<UserStats> {
  const [workoutCount, totalVolumeResult, bodyEntries, photoCount, user, prCount] =
    await Promise.all([
      workoutRepo
        .count({ where: { userId, completedAt: undefined as any } })
        .then(() =>
          workoutRepo
            .createQueryBuilder('w')
            .where('w.userId = :userId', { userId })
            .andWhere('w.completedAt IS NOT NULL')
            .andWhere('w.isTemplate = false')
            .getCount()
        ),
      workoutRepo
        .createQueryBuilder('w')
        .select('COALESCE(SUM(w.totalVolume), 0)', 'total')
        .where('w.userId = :userId', { userId })
        .andWhere('w.completedAt IS NOT NULL')
        .getRawOne(),
      bodyStatRepo.count({ where: { userId } }),
      photoRepo
        .createQueryBuilder('p')
        .innerJoin('p.workout', 'w')
        .where('w.userId = :userId', { userId })
        .getCount(),
      userRepo.findOne({ where: { id: userId }, select: ['id', 'bestStreak', 'createdAt'] }),
      // Count distinct exercises where user has beaten their previous max
      AppDataSource.query(
        `
      SELECT COUNT(DISTINCT e.name) as count
      FROM sets s
      INNER JOIN exercises e ON s."exerciseId" = e.id
      INNER JOIN workouts w ON e."workoutId" = w.id
      WHERE w."userId" = $1 AND w."completedAt" IS NOT NULL AND s.weight > 0
    `,
        [userId]
      ).then((r: any[]) => parseInt(r[0]?.count || '0', 10)),
    ]);

  const daysMember = user
    ? Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return {
    workoutCount,
    totalVolume: Number(totalVolumeResult?.total) || 0,
    bestStreak: user?.bestStreak || 0,
    prCount,
    bodyEntries,
    photoCount,
    daysMember,
  };
}

function checkCondition(stats: UserStats, condition: { type: string; threshold: number }): boolean {
  switch (condition.type) {
    case 'workout_count':
      return stats.workoutCount >= condition.threshold;
    case 'total_volume':
      return stats.totalVolume >= condition.threshold;
    case 'streak_weeks':
      return stats.bestStreak >= condition.threshold;
    case 'pr_count':
      return stats.prCount >= condition.threshold;
    case 'body_entries':
      return stats.bodyEntries >= condition.threshold;
    case 'photo_count':
      return stats.photoCount >= condition.threshold;
    case 'days_member':
      return stats.daysMember >= condition.threshold;
    default:
      return false;
  }
}

/**
 * Vérifie et débloque les achievements pour un utilisateur.
 * Appelé après chaque action significative (workout completed, body stat added, etc.)
 */
export async function checkAndUnlockAchievements(userId: number): Promise<UserAchievement[]> {
  const [stats, existing] = await Promise.all([
    getUserStats(userId),
    achievementRepo.find({ where: { userId }, select: ['achievementId'] }),
  ]);

  const existingIds = new Set(existing.map((a) => a.achievementId));
  const newlyUnlocked: UserAchievement[] = [];

  for (const achievement of ACHIEVEMENTS) {
    if (existingIds.has(achievement.id)) continue;
    if (!checkCondition(stats, achievement.condition)) continue;

    const ua = achievementRepo.create({
      userId,
      achievementId: achievement.id,
    });
    await achievementRepo.save(ua);
    newlyUnlocked.push(ua);

    // Créer une notification pour chaque achievement débloqué
    const notification = notificationRepo.create({
      userId,
      type: 'ACHIEVEMENT' as any,
      title: `Badge débloqué : ${achievement.name}`,
      message: achievement.description,
    });
    await notificationRepo.save(notification);
  }

  return newlyUnlocked;
}

/**
 * Récupère tous les achievements d'un utilisateur avec leur statut.
 */
export async function getUserAchievements(userId: number) {
  const [unlocked, stats] = await Promise.all([
    achievementRepo.find({ where: { userId } }),
    getUserStats(userId),
  ]);

  const unlockedMap = new Map(unlocked.map((a) => [a.achievementId, a.unlockedAt]));

  return ACHIEVEMENTS.map((achievement) => ({
    ...achievement,
    unlocked: unlockedMap.has(achievement.id),
    unlockedAt: unlockedMap.get(achievement.id) || null,
    progress: getProgress(stats, achievement.condition),
  }));
}

function getProgress(
  stats: UserStats,
  condition: { type: string; threshold: number }
): { current: number; target: number; percent: number } {
  let current = 0;
  switch (condition.type) {
    case 'workout_count':
      current = stats.workoutCount;
      break;
    case 'total_volume':
      current = stats.totalVolume;
      break;
    case 'streak_weeks':
      current = stats.bestStreak;
      break;
    case 'pr_count':
      current = stats.prCount;
      break;
    case 'body_entries':
      current = stats.bodyEntries;
      break;
    case 'photo_count':
      current = stats.photoCount;
      break;
    case 'days_member':
      current = stats.daysMember;
      break;
  }
  return {
    current,
    target: condition.threshold,
    percent: Math.min(100, Math.round((current / condition.threshold) * 100)),
  };
}
