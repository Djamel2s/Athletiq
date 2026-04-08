import { Capacitor } from '@capacitor/core';
import { logger } from '~/utils/logger';

export const useHealthSync = () => {
  let healthPlugin: any = null;

  const loadPlugin = async () => {
    if (healthPlugin) return healthPlugin;
    // Health plugin is only available on native after manual install
    // On web, this will always return null
    return null;
  };

  const isAvailable = async (): Promise<boolean> => {
    if (!Capacitor.isNativePlatform()) return false;
    const plugin = await loadPlugin();
    if (!plugin) return false;
    try {
      const result = await plugin.isAvailable();
      return result.available === true;
    } catch {
      return false;
    }
  };

  const requestPermissions = async (): Promise<boolean> => {
    const plugin = await loadPlugin();
    if (!plugin) return false;
    try {
      const result = await plugin.requestAuthorization({
        all: [
          { read: true, write: true, sampleName: 'workout' },
          { read: true, write: true, sampleName: 'weight' },
          { read: true, write: true, sampleName: 'body_fat_percentage' },
        ],
      });
      return result.authorized === true;
    } catch (error) {
      logger.error('Health permissions error:', error);
      return false;
    }
  };

  const syncWorkout = async (workout: {
    name: string;
    startedAt: string;
    completedAt: string;
    durationMinutes?: number;
    caloriesBurned?: number;
  }): Promise<boolean> => {
    const plugin = await loadPlugin();
    if (!plugin) return false;
    try {
      const startDate = new Date(workout.startedAt).toISOString();
      const endDate = new Date(workout.completedAt).toISOString();

      await plugin.store({
        sampleName: 'workout',
        startDate,
        endDate,
        value: workout.name,
        unitName: 'activityType',
        metadata: {
          source: 'Athletiq',
          ...(workout.caloriesBurned ? { calories: String(workout.caloriesBurned) } : {}),
        },
      });
      return true;
    } catch (error) {
      logger.error('Health sync workout error:', error);
      return false;
    }
  };

  const syncBodyStat = async (stat: {
    type: 'weight' | 'body_fat';
    value: number;
    date: string;
  }): Promise<boolean> => {
    const plugin = await loadPlugin();
    if (!plugin) return false;
    try {
      const sampleName = stat.type === 'weight' ? 'weight' : 'body_fat_percentage';
      const unitName = stat.type === 'weight' ? 'kg' : 'percent';

      await plugin.store({
        sampleName,
        startDate: new Date(stat.date).toISOString(),
        endDate: new Date(stat.date).toISOString(),
        value: stat.value,
        unitName,
        metadata: { source: 'Athletiq' },
      });
      return true;
    } catch (error) {
      logger.error('Health sync body stat error:', error);
      return false;
    }
  };

  const syncAllWorkouts = async (
    workouts: Array<{
      name: string;
      startedAt: string;
      completedAt: string;
      durationMinutes?: number;
      caloriesBurned?: number;
    }>
  ): Promise<{ synced: number; failed: number }> => {
    let synced = 0;
    let failed = 0;

    for (const workout of workouts) {
      const success = await syncWorkout(workout);
      if (success) synced++;
      else failed++;
    }

    return { synced, failed };
  };

  return { isAvailable, requestPermissions, syncWorkout, syncBodyStat, syncAllWorkouts };
};
