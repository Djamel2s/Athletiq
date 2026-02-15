import dotenv from 'dotenv'
dotenv.config()

import { initializeDatabase, AppDataSource } from '../config/database.js'
import { seedExerciseLibrary } from './exerciseLibrary.js'

async function runSeeds() {
  try {
    console.log('🚀 Starting seed process...')

    // Initialize database connection
    await initializeDatabase()

    // Run seeds
    await seedExerciseLibrary()

    console.log('✨ All seeds completed successfully!')

    // Close connection
    await AppDataSource.destroy()
    process.exit(0)
  } catch (error) {
    console.error('❌ Error running seeds:', error)
    process.exit(1)
  }
}

runSeeds()
