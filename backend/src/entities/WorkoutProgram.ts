import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import type { ProgramDay } from './ProgramDay.js';

export enum ProgramDifficulty {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

export enum ProgramGoal {
  STRENGTH = 'STRENGTH',
  HYPERTROPHY = 'HYPERTROPHY',
  ENDURANCE = 'ENDURANCE',
  GENERAL = 'GENERAL',
}

@Entity('workout_programs')
export class WorkoutProgram {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'varchar' })
  slug!: string; // ex: 'ppl-6j', 'upper-lower-4j'

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'varchar', default: ProgramDifficulty.INTERMEDIATE })
  difficulty!: ProgramDifficulty;

  @Column({ type: 'varchar', default: ProgramGoal.HYPERTROPHY })
  goal!: ProgramGoal;

  @Column({ type: 'int' })
  daysPerWeek!: number; // 3, 4, 5, 6

  @Column({ type: 'int', default: 8 })
  durationWeeks!: number; // Durée recommandée en semaines

  @Column({ type: 'varchar', nullable: true })
  icon?: string;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ type: 'int', default: 0 })
  popularity!: number; // Compteur d'adoptions

  @OneToMany('ProgramDay', 'program')
  days!: ProgramDay[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
