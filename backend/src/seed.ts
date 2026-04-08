import 'reflect-metadata';
import { AppDataSource } from './config/database.js';
import { User } from './entities/User.js';
import { Workout } from './entities/Workout.js';
import { Exercise } from './entities/Exercise.js';
import { Set } from './entities/Set.js';
import { BodyStat } from './entities/BodyStat.js';
import { Measurement } from './entities/Measurement.js';
import { ExerciseLibrary, MuscleGroup, Equipment, Difficulty } from './entities/ExerciseLibrary.js';
import { UserGoal } from './entities/UserGoal.js';
import { Notification } from './entities/Notification.js';
import bcrypt from 'bcrypt';

// ─── Helpers ───
const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randFloat = (min: number, max: number, decimals = 1) =>
  parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const daysAgo = (n: number, hourOffset = 0): Date => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(rand(7, 20), rand(0, 59), 0, 0);
  if (hourOffset) d.setHours(d.getHours() + hourOffset);
  return d;
};

async function seed() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Seeding is disabled in production');
  }

  await AppDataSource.initialize();
  console.log('🔌 Connected to database');

  // ─── Clean everything ───
  console.log('🧹 Cleaning existing data...');
  await AppDataSource.query('TRUNCATE TABLE notifications CASCADE');
  await AppDataSource.query('TRUNCATE TABLE user_goals CASCADE');
  await AppDataSource.query('TRUNCATE TABLE measurements CASCADE');
  await AppDataSource.query('TRUNCATE TABLE body_stats CASCADE');
  await AppDataSource.query('TRUNCATE TABLE workout_photos CASCADE');
  await AppDataSource.query('TRUNCATE TABLE sets CASCADE');
  await AppDataSource.query('TRUNCATE TABLE exercises CASCADE');
  await AppDataSource.query('TRUNCATE TABLE workouts CASCADE');
  await AppDataSource.query('TRUNCATE TABLE exercise_library CASCADE');
  await AppDataSource.query('TRUNCATE TABLE users CASCADE');

  // ─── 1. User ───
  console.log('👤 Creating user...');
  const userRepo = AppDataSource.getRepository(User);
  const hashedPassword = await bcrypt.hash('password123', 12);
  const user = await userRepo.save({
    email: 'thomas@athletiq.fr',
    password: hashedPassword,
    firstName: 'Thomas',
    lastName: 'Durand',
    goal: 'BULK' as any,
  });
  console.log(`   → User: ${user.email}`);

  // ─── 2. Exercise Library ───
  console.log('📚 Creating exercise library...');
  const libRepo = AppDataSource.getRepository(ExerciseLibrary);
  const exerciseData = [
    // Chest
    {
      name: 'Développé couché',
      primaryMuscle: MuscleGroup.CHEST,
      muscleGroups: [MuscleGroup.CHEST, MuscleGroup.TRICEPS, MuscleGroup.SHOULDERS],
      equipment: Equipment.BARBELL,
      difficulty: Difficulty.INTERMEDIATE,
    },
    {
      name: 'Développé incliné haltères',
      primaryMuscle: MuscleGroup.CHEST,
      muscleGroups: [MuscleGroup.CHEST, MuscleGroup.SHOULDERS],
      equipment: Equipment.DUMBBELL,
      difficulty: Difficulty.INTERMEDIATE,
    },
    {
      name: 'Écarté poulie vis-à-vis',
      primaryMuscle: MuscleGroup.CHEST,
      muscleGroups: [MuscleGroup.CHEST],
      equipment: Equipment.CABLE,
      difficulty: Difficulty.BEGINNER,
    },
    {
      name: 'Dips',
      primaryMuscle: MuscleGroup.CHEST,
      muscleGroups: [MuscleGroup.CHEST, MuscleGroup.TRICEPS],
      equipment: Equipment.BODYWEIGHT,
      difficulty: Difficulty.INTERMEDIATE,
    },
    // Back
    {
      name: 'Tractions',
      primaryMuscle: MuscleGroup.BACK,
      muscleGroups: [MuscleGroup.BACK, MuscleGroup.BICEPS],
      equipment: Equipment.BODYWEIGHT,
      difficulty: Difficulty.INTERMEDIATE,
    },
    {
      name: 'Rowing barre',
      primaryMuscle: MuscleGroup.BACK,
      muscleGroups: [MuscleGroup.BACK, MuscleGroup.BICEPS],
      equipment: Equipment.BARBELL,
      difficulty: Difficulty.INTERMEDIATE,
    },
    {
      name: 'Tirage vertical',
      primaryMuscle: MuscleGroup.BACK,
      muscleGroups: [MuscleGroup.BACK, MuscleGroup.BICEPS],
      equipment: Equipment.CABLE,
      difficulty: Difficulty.BEGINNER,
    },
    {
      name: 'Rowing haltère unilatéral',
      primaryMuscle: MuscleGroup.BACK,
      muscleGroups: [MuscleGroup.BACK],
      equipment: Equipment.DUMBBELL,
      difficulty: Difficulty.BEGINNER,
    },
    {
      name: 'Soulevé de terre',
      primaryMuscle: MuscleGroup.BACK,
      muscleGroups: [MuscleGroup.BACK, MuscleGroup.HAMSTRINGS, MuscleGroup.GLUTES],
      equipment: Equipment.BARBELL,
      difficulty: Difficulty.ADVANCED,
    },
    // Shoulders
    {
      name: 'Développé militaire',
      primaryMuscle: MuscleGroup.SHOULDERS,
      muscleGroups: [MuscleGroup.SHOULDERS, MuscleGroup.TRICEPS],
      equipment: Equipment.BARBELL,
      difficulty: Difficulty.INTERMEDIATE,
    },
    {
      name: 'Élévations latérales',
      primaryMuscle: MuscleGroup.SHOULDERS,
      muscleGroups: [MuscleGroup.SHOULDERS],
      equipment: Equipment.DUMBBELL,
      difficulty: Difficulty.BEGINNER,
    },
    {
      name: 'Oiseau haltères',
      primaryMuscle: MuscleGroup.SHOULDERS,
      muscleGroups: [MuscleGroup.SHOULDERS, MuscleGroup.BACK],
      equipment: Equipment.DUMBBELL,
      difficulty: Difficulty.BEGINNER,
    },
    {
      name: 'Face pull',
      primaryMuscle: MuscleGroup.SHOULDERS,
      muscleGroups: [MuscleGroup.SHOULDERS, MuscleGroup.BACK],
      equipment: Equipment.CABLE,
      difficulty: Difficulty.BEGINNER,
    },
    // Arms
    {
      name: 'Curl barre',
      primaryMuscle: MuscleGroup.BICEPS,
      muscleGroups: [MuscleGroup.BICEPS],
      equipment: Equipment.BARBELL,
      difficulty: Difficulty.BEGINNER,
    },
    {
      name: 'Curl haltères alternés',
      primaryMuscle: MuscleGroup.BICEPS,
      muscleGroups: [MuscleGroup.BICEPS],
      equipment: Equipment.DUMBBELL,
      difficulty: Difficulty.BEGINNER,
    },
    {
      name: 'Extension triceps poulie',
      primaryMuscle: MuscleGroup.TRICEPS,
      muscleGroups: [MuscleGroup.TRICEPS],
      equipment: Equipment.CABLE,
      difficulty: Difficulty.BEGINNER,
    },
    {
      name: 'Barre au front',
      primaryMuscle: MuscleGroup.TRICEPS,
      muscleGroups: [MuscleGroup.TRICEPS],
      equipment: Equipment.BARBELL,
      difficulty: Difficulty.INTERMEDIATE,
    },
    // Legs
    {
      name: 'Squat barre',
      primaryMuscle: MuscleGroup.QUADS,
      muscleGroups: [MuscleGroup.QUADS, MuscleGroup.GLUTES, MuscleGroup.HAMSTRINGS],
      equipment: Equipment.BARBELL,
      difficulty: Difficulty.INTERMEDIATE,
    },
    {
      name: 'Presse à cuisses',
      primaryMuscle: MuscleGroup.QUADS,
      muscleGroups: [MuscleGroup.QUADS, MuscleGroup.GLUTES],
      equipment: Equipment.MACHINE,
      difficulty: Difficulty.BEGINNER,
    },
    {
      name: 'Fentes haltères',
      primaryMuscle: MuscleGroup.QUADS,
      muscleGroups: [MuscleGroup.QUADS, MuscleGroup.GLUTES],
      equipment: Equipment.DUMBBELL,
      difficulty: Difficulty.INTERMEDIATE,
    },
    {
      name: 'Leg curl',
      primaryMuscle: MuscleGroup.HAMSTRINGS,
      muscleGroups: [MuscleGroup.HAMSTRINGS],
      equipment: Equipment.MACHINE,
      difficulty: Difficulty.BEGINNER,
    },
    {
      name: 'Leg extension',
      primaryMuscle: MuscleGroup.QUADS,
      muscleGroups: [MuscleGroup.QUADS],
      equipment: Equipment.MACHINE,
      difficulty: Difficulty.BEGINNER,
    },
    {
      name: 'Mollets debout',
      primaryMuscle: MuscleGroup.CALVES,
      muscleGroups: [MuscleGroup.CALVES],
      equipment: Equipment.MACHINE,
      difficulty: Difficulty.BEGINNER,
    },
    {
      name: 'Hip thrust',
      primaryMuscle: MuscleGroup.GLUTES,
      muscleGroups: [MuscleGroup.GLUTES, MuscleGroup.HAMSTRINGS],
      equipment: Equipment.BARBELL,
      difficulty: Difficulty.INTERMEDIATE,
    },
    // Abs
    {
      name: 'Crunch poulie haute',
      primaryMuscle: MuscleGroup.ABS,
      muscleGroups: [MuscleGroup.ABS],
      equipment: Equipment.CABLE,
      difficulty: Difficulty.BEGINNER,
    },
    {
      name: 'Relevé de jambes suspendu',
      primaryMuscle: MuscleGroup.ABS,
      muscleGroups: [MuscleGroup.ABS],
      equipment: Equipment.BODYWEIGHT,
      difficulty: Difficulty.INTERMEDIATE,
    },
  ];

  const library: ExerciseLibrary[] = [];
  for (const ex of exerciseData) {
    library.push(await libRepo.save(ex));
  }
  console.log(`   → ${library.length} exercices créés`);

  // Helpers to find library exercises
  const findLib = (name: string) => library.find((e) => e.name === name)!;

  // ─── 3. Workout Templates ───
  // Define workout routines (Push/Pull/Legs split)
  const routines = {
    push: {
      name: 'Push - Pecs / Épaules / Triceps',
      exercises: [
        {
          lib: 'Développé couché',
          sets: [
            { w: 80, r: 10 },
            { w: 85, r: 8 },
            { w: 90, r: 6 },
            { w: 85, r: 8 },
          ],
        },
        {
          lib: 'Développé incliné haltères',
          sets: [
            { w: 30, r: 12 },
            { w: 32, r: 10 },
            { w: 34, r: 8 },
          ],
        },
        {
          lib: 'Écarté poulie vis-à-vis',
          sets: [
            { w: 15, r: 15 },
            { w: 17, r: 12 },
            { w: 17, r: 12 },
          ],
        },
        {
          lib: 'Développé militaire',
          sets: [
            { w: 40, r: 10 },
            { w: 45, r: 8 },
            { w: 45, r: 8 },
          ],
        },
        {
          lib: 'Élévations latérales',
          sets: [
            { w: 10, r: 15 },
            { w: 12, r: 12 },
            { w: 12, r: 12 },
          ],
        },
        {
          lib: 'Extension triceps poulie',
          sets: [
            { w: 25, r: 15 },
            { w: 30, r: 12 },
            { w: 30, r: 10 },
          ],
        },
      ],
    },
    pull: {
      name: 'Pull - Dos / Biceps',
      exercises: [
        {
          lib: 'Tractions',
          sets: [
            { w: 0, r: 10 },
            { w: 0, r: 8 },
            { w: 0, r: 8 },
            { w: 0, r: 6 },
          ],
        },
        {
          lib: 'Rowing barre',
          sets: [
            { w: 70, r: 10 },
            { w: 75, r: 8 },
            { w: 80, r: 6 },
          ],
        },
        {
          lib: 'Tirage vertical',
          sets: [
            { w: 55, r: 12 },
            { w: 60, r: 10 },
            { w: 60, r: 10 },
          ],
        },
        {
          lib: 'Rowing haltère unilatéral',
          sets: [
            { w: 28, r: 12 },
            { w: 30, r: 10 },
            { w: 30, r: 10 },
          ],
        },
        {
          lib: 'Face pull',
          sets: [
            { w: 20, r: 15 },
            { w: 22, r: 15 },
            { w: 22, r: 12 },
          ],
        },
        {
          lib: 'Curl barre',
          sets: [
            { w: 30, r: 12 },
            { w: 32, r: 10 },
            { w: 35, r: 8 },
          ],
        },
        {
          lib: 'Curl haltères alternés',
          sets: [
            { w: 12, r: 12 },
            { w: 14, r: 10 },
            { w: 14, r: 10 },
          ],
        },
      ],
    },
    legs: {
      name: 'Legs - Quadriceps / Ischios / Fessiers',
      exercises: [
        {
          lib: 'Squat barre',
          sets: [
            { w: 90, r: 10 },
            { w: 100, r: 8 },
            { w: 110, r: 6 },
            { w: 100, r: 8 },
          ],
        },
        {
          lib: 'Presse à cuisses',
          sets: [
            { w: 180, r: 12 },
            { w: 200, r: 10 },
            { w: 220, r: 8 },
          ],
        },
        {
          lib: 'Fentes haltères',
          sets: [
            { w: 16, r: 12 },
            { w: 18, r: 10 },
            { w: 18, r: 10 },
          ],
        },
        {
          lib: 'Leg curl',
          sets: [
            { w: 40, r: 12 },
            { w: 45, r: 10 },
            { w: 45, r: 10 },
          ],
        },
        {
          lib: 'Leg extension',
          sets: [
            { w: 50, r: 15 },
            { w: 55, r: 12 },
            { w: 55, r: 12 },
          ],
        },
        {
          lib: 'Mollets debout',
          sets: [
            { w: 60, r: 20 },
            { w: 70, r: 15 },
            { w: 70, r: 15 },
          ],
        },
      ],
    },
    upperBody: {
      name: 'Upper Body - Haut du corps',
      exercises: [
        {
          lib: 'Développé couché',
          sets: [
            { w: 82, r: 8 },
            { w: 85, r: 6 },
            { w: 82, r: 8 },
          ],
        },
        {
          lib: 'Tractions',
          sets: [
            { w: 0, r: 10 },
            { w: 0, r: 8 },
            { w: 0, r: 8 },
          ],
        },
        {
          lib: 'Développé militaire',
          sets: [
            { w: 42, r: 10 },
            { w: 45, r: 8 },
            { w: 42, r: 10 },
          ],
        },
        {
          lib: 'Rowing barre',
          sets: [
            { w: 72, r: 10 },
            { w: 75, r: 8 },
            { w: 72, r: 10 },
          ],
        },
        {
          lib: 'Dips',
          sets: [
            { w: 0, r: 12 },
            { w: 0, r: 10 },
            { w: 0, r: 10 },
          ],
        },
        {
          lib: 'Curl haltères alternés',
          sets: [
            { w: 14, r: 12 },
            { w: 14, r: 10 },
          ],
        },
      ],
    },
  };

  // ─── 4. Generate ~3 months of workouts (PPL split, ~4-5x/week) ───
  console.log('🏋️ Creating workouts...');
  const workoutRepo = AppDataSource.getRepository(Workout);
  const exerciseRepo = AppDataSource.getRepository(Exercise);
  const setRepo = AppDataSource.getRepository(Set);

  // Schedule: 90 days, training ~4-5x/week with rest days
  const schedule: { day: number; routine: keyof typeof routines }[] = [];
  const rotationOrder: (keyof typeof routines)[] = ['push', 'pull', 'legs', 'push', 'pull', 'legs'];
  let rotIndex = 0;

  for (let day = 90; day >= 0; day--) {
    const date = new Date();
    date.setDate(date.getDate() - day);
    const dow = date.getDay(); // 0=Sun

    // Rest on some Sundays and occasional Wednesdays
    if (dow === 0) continue; // Sunday = rest
    if (dow === 3 && Math.random() < 0.4) continue; // Sometimes skip Wednesday

    // Occasional extra rest day
    if (Math.random() < 0.1) continue;

    const routine = rotationOrder[rotIndex % rotationOrder.length];
    schedule.push({ day, routine });
    rotIndex++;
  }

  // Progressive overload: weights increase ~2-5% over 3 months
  const progressFactor = (dayIndex: number, totalDays: number) => {
    const progress = 1 - dayIndex / totalDays;
    return 1 + progress * 0.12; // up to +12% at the end vs start
  };

  let totalWorkoutsCreated = 0;
  for (let i = 0; i < schedule.length; i++) {
    const { day, routine } = schedule[i];
    const routineData = routines[routine];
    const pf = progressFactor(i, schedule.length);

    const startDate = daysAgo(day);
    const durationSec = rand(3600, 5400); // 60-90 min
    const completedDate = new Date(startDate.getTime() + durationSec * 1000);

    // Calculate total volume
    let totalVolume = 0;
    const exercisesToCreate: { libName: string; sets: { w: number; r: number }[] }[] = [];

    for (const exDef of routineData.exercises) {
      const adjustedSets = exDef.sets.map((s) => {
        const weight = s.w === 0 ? 0 : Math.round((s.w * pf) / 2.5) * 2.5; // round to 2.5kg
        const reps = s.r + rand(-1, 1);
        totalVolume += weight * Math.max(reps, 0);
        return { w: weight, r: Math.max(reps, 1) };
      });
      exercisesToCreate.push({ libName: exDef.lib, sets: adjustedSets });
    }

    const workout = await workoutRepo.save({
      userId: user.id,
      name: routineData.name,
      startedAt: startDate,
      completedAt: completedDate,
      duration: durationSec,
      totalVolume: Math.round(totalVolume),
      date: startDate,
    });

    for (let ei = 0; ei < exercisesToCreate.length; ei++) {
      const exData = exercisesToCreate[ei];
      const lib = findLib(exData.libName);

      const exercise = await exerciseRepo.save({
        workoutId: workout.id,
        exerciseLibraryId: lib.id,
        name: lib.name,
        orderIndex: ei,
        targetSets: exData.sets.length,
        targetReps: exData.sets[0].r,
        targetWeight: exData.sets[0].w,
      });

      for (let si = 0; si < exData.sets.length; si++) {
        await setRepo.save({
          exerciseId: exercise.id,
          setNumber: si + 1,
          reps: exData.sets[si].r,
          weight: exData.sets[si].w,
          rpe: rand(7, 10),
        });
      }
    }

    totalWorkoutsCreated++;
  }
  console.log(`   → ${totalWorkoutsCreated} workouts créés (~3 mois)`);

  // ─── 5. Body Stats (weekly weigh-ins, ~3 months) ───
  console.log('⚖️ Creating body stats...');
  const bodyStatRepo = AppDataSource.getRepository(BodyStat);
  let weight = 78.5; // Starting weight
  const bodyStats: BodyStat[] = [];

  for (let week = 12; week >= 0; week--) {
    const date = daysAgo(week * 7);
    date.setHours(7, rand(0, 30), 0, 0); // Morning weigh-in

    // Slow bulk: gain ~0.2-0.4 kg/week
    weight += randFloat(0.1, 0.4);
    const bodyFat = randFloat(14.5, 16.5);

    bodyStats.push(
      await bodyStatRepo.save({
        userId: user.id,
        date,
        weight: parseFloat(weight.toFixed(1)),
        bodyFat,
      })
    );
  }
  console.log(`   → ${bodyStats.length} body stats créés`);

  // ─── 6. Measurements (bi-weekly, ~3 months) ───
  console.log('📏 Creating measurements...');
  const measRepo = AppDataSource.getRepository(Measurement);
  let chest = 100,
    waist = 82,
    hips = 97,
    biceps = 35,
    thighs = 58,
    calves = 37;
  const measurements: Measurement[] = [];

  for (let biweek = 6; biweek >= 0; biweek--) {
    const date = daysAgo(biweek * 14);
    date.setHours(7, rand(30, 59), 0, 0);

    // Slow progression
    chest += randFloat(0.1, 0.4);
    waist += randFloat(-0.1, 0.2);
    hips += randFloat(0.0, 0.2);
    biceps += randFloat(0.1, 0.3);
    thighs += randFloat(0.1, 0.4);
    calves += randFloat(0.0, 0.2);

    measurements.push(
      await measRepo.save({
        userId: user.id,
        date,
        chest: parseFloat(chest.toFixed(1)),
        waist: parseFloat(waist.toFixed(1)),
        hips: parseFloat(hips.toFixed(1)),
        biceps: parseFloat(biceps.toFixed(1)),
        thighs: parseFloat(thighs.toFixed(1)),
        calves: parseFloat(calves.toFixed(1)),
      })
    );
  }
  console.log(`   → ${measurements.length} measurements créés`);

  // ─── 7. Goals ───
  console.log('🎯 Creating goals...');
  const goalRepo = AppDataSource.getRepository(UserGoal);

  await goalRepo.save([
    {
      userId: user.id,
      type: 'WEIGHT' as any,
      title: 'Atteindre 85 kg',
      targetValue: 85,
      startValue: 78.5,
      deadline: new Date(Date.now() + 90 * 86400000), // 3 months from now
    },
    {
      userId: user.id,
      type: 'PR' as any,
      title: 'Développé couché 100 kg',
      targetValue: 100,
      startValue: 80,
      exerciseName: 'Développé couché',
      exerciseLibraryId: findLib('Développé couché').id,
    },
    {
      userId: user.id,
      type: 'PR' as any,
      title: 'Squat 130 kg',
      targetValue: 130,
      startValue: 90,
      exerciseName: 'Squat barre',
      exerciseLibraryId: findLib('Squat barre').id,
    },
    {
      userId: user.id,
      type: 'BODY_FAT' as any,
      title: 'Passer sous 14% BF',
      targetValue: 14,
      startValue: 16,
      achieved: true,
      achievedAt: daysAgo(15),
      createdAt: daysAgo(60),
    },
  ]);
  console.log('   → 4 goals créés (3 actifs, 1 atteint)');

  // ─── 8. Notifications ───
  console.log('🔔 Creating notifications...');
  const notifRepo = AppDataSource.getRepository(Notification);

  await notifRepo.save([
    {
      userId: user.id,
      type: 'PR_ACHIEVED' as any,
      title: 'Nouveau record personnel !',
      message: 'Développé couché : 92.5 kg — Bravo, tu progresses !',
      read: false,
      createdAt: daysAgo(2),
    },
    {
      userId: user.id,
      type: 'STREAK_MILESTONE' as any,
      title: 'Série de 7 jours !',
      message: "Tu t'es entraîné 7 jours consécutifs. Continue comme ça !",
      read: false,
      createdAt: daysAgo(5),
    },
    {
      userId: user.id,
      type: 'GOAL_ACHIEVED' as any,
      title: 'Objectif atteint !',
      message: 'Tu es passé sous les 14% de masse grasse. Bien joué !',
      read: true,
      createdAt: daysAgo(15),
    },
    {
      userId: user.id,
      type: 'PR_ACHIEVED' as any,
      title: 'Nouveau record personnel !',
      message: 'Squat barre : 115 kg — Tu deviens fort !',
      read: true,
      createdAt: daysAgo(20),
    },
    {
      userId: user.id,
      type: 'STREAK_MILESTONE' as any,
      title: 'Série de 14 jours !',
      message: "2 semaines consécutives d'entraînement ! Impressionnant.",
      read: true,
      createdAt: daysAgo(30),
    },
    {
      userId: user.id,
      type: 'STREAK_MILESTONE' as any,
      title: 'Série de 30 jours !',
      message: "1 mois complet d'entraînement ! Tu es une machine.",
      read: true,
      createdAt: daysAgo(45),
    },
  ]);
  console.log('   → 6 notifications créées');

  // ─── Done ───
  console.log('\n✅ Seed terminé avec succès !');
  console.log('─────────────────────────────');
  console.log(`📧 Email:    thomas@athletiq.fr`);
  console.log(`🏋️ Workouts: ${totalWorkoutsCreated}`);
  console.log(`⚖️ Body stats: ${bodyStats.length}`);
  console.log(`📏 Measurements: ${measurements.length}`);
  console.log(`🎯 Goals: 4`);
  console.log(`🔔 Notifications: 6`);
  console.log(`📚 Exercices lib: ${library.length}`);
  console.log('─────────────────────────────');

  await AppDataSource.destroy();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
