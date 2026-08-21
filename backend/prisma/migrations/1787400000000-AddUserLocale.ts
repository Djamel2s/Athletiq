import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Ajoute la colonne `locale` sur users pour que la langue preferee suive le
 * compte (au lieu du seul localStorage du navigateur/appareil).
 */
export class AddUserLocale1787400000000 implements MigrationInterface {
  name = 'AddUserLocale1787400000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
        ADD COLUMN IF NOT EXISTS "locale" varchar NOT NULL DEFAULT 'en';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
        DROP COLUMN IF EXISTS "locale";
    `);
  }
}
