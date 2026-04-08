import { AppDataSource } from '../config/database.js';
import { User } from '../entities/User.js';
import { Fatigue } from '../entities/Fatigue.js';
import { ProgressionSlope } from '../entities/ProgressionSlope.js';
import { ExpectedPR } from '../entities/ExpectedPR.js';
import { logger } from '../utils/logger.js';

// Heuristic fatigue computation based on recent training load
export async function computeFatigueForUser(userId: number) {
  try {
    // Compute weekly load: sum(weight * reps) for sets in workouts in last 7 days
    const weeklySql = `SELECT COALESCE(SUM(CAST(s.weight AS FLOAT) * s.reps),0) as load FROM sets s JOIN exercises e ON e.id = s."exerciseId" JOIN workouts w ON w.id = e."workoutId" WHERE w."userId" = $1 AND w.date >= NOW() - INTERVAL '7 days'`;
    const weeklyRes = await AppDataSource.query(weeklySql, [userId]);
    const weeklyLoad = Number(weeklyRes[0]?.load || 0);

    // Baseline: average weekly load over last 28 days (divide by 4)
    const baselineSql = `SELECT COALESCE(SUM(CAST(s.weight AS FLOAT) * s.reps),0) as load28 FROM sets s JOIN exercises e ON e.id = s."exerciseId" JOIN workouts w ON w.id = e."workoutId" WHERE w."userId" = $1 AND w.date >= NOW() - INTERVAL '28 days'`;
    const baselineRes = await AppDataSource.query(baselineSql, [userId]);
    const load28 = Number(baselineRes[0]?.load28 || 0);
    const baselineWeekly = load28 / 4 || 0;

    // Compute score: closer to 1 = recovered, lower = fatigued
    let score = 1;
    if (baselineWeekly > 0) {
      const delta = (weeklyLoad - baselineWeekly) / (baselineWeekly + 1);
      score = Math.max(0, Math.min(1, 1 - delta));
    } else {
      // No baseline: use a decaying function
      score = 1 / (1 + weeklyLoad / 10000);
    }

    // Persist Fatigue
    const fatigueRepo = AppDataSource.getRepository(Fatigue);
    const f = fatigueRepo.create({
      userId,
      date: new Date(),
      score,
      source: 'heuristic-v1',
      notes: `weeklyLoad=${weeklyLoad},baseline=${baselineWeekly}`,
    });
    await fatigueRepo.save(f);
    return f;
  } catch (err) {
    logger.error({ err, userId }, 'computeFatigueForUser error');
    throw err;
  }
}

export async function computeForAllUsers() {
  const users = await AppDataSource.getRepository(User).find();
  const results: any[] = [];
  for (const u of users) {
    try {
      const res = await computeFatigueForUser(u.id);
      results.push({ userId: u.id, fatigueId: res.id });
    } catch (e) {
      // continue
    }
  }
  return results;
}

export async function getLatestFatigueForUser(userId: number) {
  const repo = AppDataSource.getRepository(Fatigue);
  const latest = await repo
    .createQueryBuilder('f')
    .where('f.userId = :userId', { userId })
    .orderBy('f.date', 'DESC')
    .getOne();
  return latest;
}

export default { computeFatigueForUser, computeForAllUsers, getLatestFatigueForUser };
