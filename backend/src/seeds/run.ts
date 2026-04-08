import dotenv from 'dotenv';
dotenv.config();

import { initializeDatabase, AppDataSource } from '../config/database.js';
import { seedExerciseLibrary } from './exerciseLibrary.js';
import { seedDemoAccount } from './demoAccount.js';
import { seedTestAccounts } from './testAccounts.js';

async function runSeeds() {
  try {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Seeding is disabled in production');
    }

    console.log('Starting seed process...\n');

    // Initialize database connection
    await initializeDatabase();

    // Run seeds
    console.log('[1/3] Seeding exercise library...');
    await seedExerciseLibrary();

    console.log('\n[2/3] Seeding demo account...');
    await seedDemoAccount();

    console.log('\n[3/3] Seeding test accounts (11 accounts)...');
    await seedTestAccounts();

    console.log('\n════════════════════════════════');
    console.log('All seeds completed successfully!');
    console.log('════════════════════════════════');
    console.log('\nAccounts created:');
    console.log('  demo@athletiq.fr       — Premium (demo principal)');
    console.log('  demo2@athletiq.fr      — Premium Yearly (Emma)');
    console.log('  partner1@athletiq.fr   — Premium Monthly (Hugo)');
    console.log('  partner2@athletiq.fr   — Premium Yearly (Chloé)');
    console.log('  partner3@athletiq.fr   — Premium Monthly (Raphaël)');
    console.log('  partner4@athletiq.fr   — Premium Monthly (Inès)');
    console.log('  free1@athletiq.fr      — Free expired (Sarah)');
    console.log('  free2@athletiq.fr      — Free trial (Théo)');
    console.log('  free3@athletiq.fr      — Free expired (Léa)');
    console.log('  free4@athletiq.fr      — Free expired (Nathan)');
    console.log('  free5@athletiq.fr      — Free trial (Manon)');
    console.log('  freefull@athletiq.fr   — Free MAXED (Maxime) — paywalls');
    console.log('\nPassword: Athletiq!Test2025 (all test accounts)');
    console.log('Password: Athletiq!Demo2025 (demo account)');

    // Close connection
    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('Error running seeds:', error);
    process.exit(1);
  }
}

runSeeds();
