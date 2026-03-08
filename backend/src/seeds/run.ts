import dotenv from 'dotenv'
dotenv.config()

import { initializeDatabase, AppDataSource } from '../config/database.js'
import { seedExerciseLibrary } from './exerciseLibrary.js'
import { seedDemoAccount } from './demoAccount.js'

async function runSeeds() {
  try {
    console.log('Starting seed process...')

    // Initialize database connection
    await initializeDatabase()

    // Run seeds
    console.log('\n[1/2] Seeding exercise library...')
    await seedExerciseLibrary()

    console.log('\n[2/2] Seeding demo account...')
    await seedDemoAccount()

    console.log('\nAll seeds completed successfully!')

    // Close connection
    await AppDataSource.destroy()
    process.exit(0)
  } catch (error) {
    console.error('Error running seeds:', error)
    process.exit(1)
  }
}

runSeeds()
