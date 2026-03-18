import 'reflect-metadata'
import { DataSource } from 'typeorm'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Pour ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Charger .env
const envPath = path.resolve(__dirname, '../../.env')
dotenv.config({ path: envPath })

// Import des entités
import { User } from '../entities/User.js'
import { Workout } from '../entities/Workout.js'
import { Exercise } from '../entities/Exercise.js'
import { Set } from '../entities/Set.js'
import { WorkoutPhoto } from '../entities/WorkoutPhoto.js'
import { BodyStat } from '../entities/BodyStat.js'
import { Measurement } from '../entities/Measurement.js'
import { ExerciseLibrary } from '../entities/ExerciseLibrary.js'
import { UserGoal } from '../entities/UserGoal.js'
import { Notification } from '../entities/Notification.js'
import { Subscription } from '../entities/Subscription.js'
import { UserAchievement } from '../entities/Achievement.js'
import { WorkoutProgram } from '../entities/WorkoutProgram.js'
import { ProgramDay } from '../entities/ProgramDay.js'

const isProduction = process.env.NODE_ENV === 'production'

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL || undefined,
  host: process.env.DATABASE_URL ? undefined : (process.env.DB_HOST || '127.0.0.1'),
  port: process.env.DATABASE_URL ? undefined : Number(process.env.DB_PORT || 5433),
  username: process.env.DATABASE_URL ? undefined : (process.env.DB_USER || 'postgres'),
  password: process.env.DATABASE_URL ? undefined : (process.env.DB_PASSWORD || 'postgres'),
  database: process.env.DATABASE_URL ? undefined : (process.env.DB_NAME || 'athletiq'),
  schema: 'public',
  ssl: isProduction ? { rejectUnauthorized: true } : false,
  synchronize: !isProduction || process.env.SYNC_DATABASE === 'true',
  logging: !isProduction,
  entities: [User, Workout, Exercise, Set, WorkoutPhoto, BodyStat, Measurement, ExerciseLibrary, UserGoal, Notification, Subscription, UserAchievement, WorkoutProgram, ProgramDay],
  extra: {
    max: 20,
    min: 2,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000
  }
})

// Initialiser la connexion
export const initializeDatabase = async () => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize()
      console.log('✅ Database connected successfully with TypeORM')
    }
  } catch (error) {
    console.error('❌ Error connecting to database:', error)
    throw error
  }
}

// Helper pour obtenir un repository
export const getRepository = <T>(entity: new () => T) => {
  return AppDataSource.getRepository(entity)
}
