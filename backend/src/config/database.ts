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

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: '127.0.0.1',
  port: 5433,
  username: 'postgres',
  password: 'postgres',
  database: 'athletiq',
  schema: 'public',
  synchronize: true, // Synchroniser automatiquement (DEVELOPMENT ONLY)
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Workout, Exercise, Set, WorkoutPhoto, BodyStat, Measurement, ExerciseLibrary, UserGoal, Notification],
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
