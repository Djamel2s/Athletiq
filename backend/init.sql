-- Create tables for Athletiq

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    "firstName" VARCHAR(255),
    "lastName" VARCHAR(255),
    "avatarUrl" TEXT,
    goal VARCHAR(50),
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Workouts table
CREATE TABLE IF NOT EXISTS workouts (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    duration INTEGER,
    notes TEXT,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_workouts_user_date ON workouts("userId", date);

-- Exercises table
CREATE TABLE IF NOT EXISTS exercises (
    id SERIAL PRIMARY KEY,
    "workoutId" INTEGER NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(255),
    notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_exercises_workout ON exercises("workoutId");

-- Sets table
CREATE TABLE IF NOT EXISTS sets (
    id SERIAL PRIMARY KEY,
    "exerciseId" INTEGER NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    "setNumber" INTEGER NOT NULL,
    reps INTEGER NOT NULL,
    weight DOUBLE PRECISION NOT NULL,
    rpe INTEGER,
    notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_sets_exercise ON sets("exerciseId");

-- Workout photos table
CREATE TABLE IF NOT EXISTS workout_photos (
    id SERIAL PRIMARY KEY,
    "workoutId" INTEGER NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
    "photoUrl" TEXT NOT NULL,
    "isPrimary" BOOLEAN DEFAULT FALSE,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_workout_photos_workout_primary ON workout_photos("workoutId", "isPrimary");
CREATE INDEX IF NOT EXISTS idx_workout_photos_created ON workout_photos("createdAt");

-- Body stats table
CREATE TABLE IF NOT EXISTS body_stats (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    weight DOUBLE PRECISION NOT NULL,
    "bodyFat" DOUBLE PRECISION,
    notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_body_stats_user_date ON body_stats("userId", date);

-- Measurements table
CREATE TABLE IF NOT EXISTS measurements (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    chest DOUBLE PRECISION,
    waist DOUBLE PRECISION,
    hips DOUBLE PRECISION,
    biceps DOUBLE PRECISION,
    thighs DOUBLE PRECISION,
    calves DOUBLE PRECISION
);

CREATE INDEX IF NOT EXISTS idx_measurements_user_date ON measurements("userId", date);

-- Prisma migrations table (pour que Prisma soit content)
CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
    id VARCHAR(36) PRIMARY KEY,
    checksum VARCHAR(64) NOT NULL,
    finished_at TIMESTAMP,
    migration_name VARCHAR(255) NOT NULL,
    logs TEXT,
    rolled_back_at TIMESTAMP,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    applied_steps_count INTEGER DEFAULT 0
);
