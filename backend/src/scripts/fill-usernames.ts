import { AppDataSource } from '../config/database.js';
import { User } from '../entities/User.js';
import { logger } from '../utils/logger.js';

const run = async () => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      logger.info('Database initialized for fill-usernames script');
    }

    const repo = AppDataSource.getRepository(User);

    // Find users with null or empty username
    const users = await repo
      .createQueryBuilder('u')
      .where('u.username IS NULL OR u.username = :empty', { empty: '' })
      .getMany();

    logger.info({ count: users.length }, 'Users without username found');

    for (const u of users) {
      // Base candidate from firstName/lastName or fallback to user<id>
      const nameBase = (u.firstName || '').trim() || '';
      const last = (u.lastName || '').trim() || '';
      let candidate = '';
      if (nameBase) {
        candidate = (nameBase + (last ? '-' + last : '')).toLowerCase().replace(/[^a-z0-9-_]/g, '');
      } else {
        candidate = `user${u.id}`;
      }

      // Ensure uniqueness by appending numbers if needed
      let final = candidate;
      let suffix = 1;
      // eslint-disable-next-line no-await-in-loop
      while (await repo.findOne({ where: { username: final } })) {
        final = `${candidate}${suffix}`;
        suffix += 1;
      }

      u.username = final;
      // eslint-disable-next-line no-await-in-loop
      await repo.save(u);
      logger.info({ id: u.id, username: u.username }, 'Updated user username');
    }

    logger.info('fill-usernames script completed');
    process.exit(0);
  } catch (err) {
    logger.error({ err }, 'fill-usernames failed');
    process.exit(1);
  }
};

run();
