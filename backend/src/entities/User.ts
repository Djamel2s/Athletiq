import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import type { Workout } from './Workout.js';
import type { BodyStat } from './BodyStat.js';
import type { Measurement } from './Measurement.js';

export enum Goal {
  BULK = 'BULK',
  STRENGTH = 'STRENGTH',
  RECOMP = 'RECOMP',
  CUT = 'CUT',
}

export enum UserRole {
  ATHLETE = 'ATHLETE',
  COACH = 'COACH',
}

export enum CoachPlan {
  FREE = 'FREE',
  PRO = 'PRO',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', unique: true })
  email!: string;

  @Column('varchar')
  password!: string;

  @Column({ type: 'varchar', nullable: true })
  firstName?: string;

  @Column({ type: 'varchar', nullable: true })
  lastName?: string;

  @Column({ type: 'varchar', nullable: true, unique: true })
  username?: string;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Column({ type: 'boolean', default: true })
  isPublic!: boolean;

  @Column({ type: 'varchar', nullable: true })
  avatarUrl?: string;

  @Column({ type: 'enum', enum: Goal, nullable: true })
  goal?: Goal;

  @Column({ type: 'varchar', nullable: true })
  gender?: string;

  @Column({ type: 'int', default: 2 })
  streakGoalPerWeek!: number;

  @Column({ type: 'int', default: 0 })
  bestStreak!: number;

  @Column({ type: 'boolean', default: false })
  isAdmin!: boolean;

  // --- Espace Coach ---
  @Column({ type: 'varchar', default: UserRole.ATHLETE })
  role!: UserRole;

  // Code unique que le coach communique à ses clients (en salle, par QR code, etc.)
  @Column({ type: 'varchar', nullable: true, unique: true })
  coachInviteCode?: string;

  // Bio / spécialité affichée aux clients (ex: "Préparateur physique, spécialiste force")
  @Column({ type: 'text', nullable: true })
  coachBio?: string;

  @Column({ type: 'varchar', default: CoachPlan.FREE })
  coachPlan!: CoachPlan;

  @Column({ type: 'boolean', default: true })
  reminderEnabled!: boolean;

  @Column({ type: 'varchar', default: '18:00' })
  reminderTime!: string;

  @Column({ type: 'int', default: 3 })
  inactivityThresholdDays!: number;

  @Column({ type: 'varchar', default: 'en' })
  locale!: string;

  // Email verification
  @Column({ type: 'boolean', default: false })
  emailVerified!: boolean;

  @Column({ type: 'varchar', nullable: true })
  emailVerificationToken?: string;

  @Column({ type: 'timestamp', nullable: true })
  emailVerificationExpires?: Date;

  @Column({ type: 'varchar', nullable: true })
  refreshTokenHash?: string;

  @Column({ type: 'varchar', nullable: true })
  passwordResetToken?: string;

  @Column({ type: 'timestamp', nullable: true })
  passwordResetExpires?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany('Workout', 'user')
  workouts!: Workout[];

  @OneToMany('BodyStat', 'user')
  bodyStats!: BodyStat[];

  @OneToMany('Measurement', 'user')
  measurements!: Measurement[];
}
