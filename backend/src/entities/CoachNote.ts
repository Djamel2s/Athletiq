import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import type { User } from './User.js';
import type { Workout } from './Workout.js';

/**
 * Note privée qu'un coach laisse sur un client, éventuellement rattachée
 * à une séance précise (feedback sur l'exécution, ajustement à prévoir, etc.).
 * Visible uniquement par le coach et l'athlète concerné.
 */
@Entity('coach_notes')
@Index(['coachId', 'athleteId'])
export class CoachNote {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('int')
  coachId!: number;

  @Column('int')
  athleteId!: number;

  @Column({ type: 'int', nullable: true })
  workoutId?: number;

  @Column({ type: 'text' })
  content!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne('User', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'coachId' })
  coach!: User;

  @ManyToOne('User', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'athleteId' })
  athlete!: User;

  @ManyToOne('Workout', { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'workoutId' })
  workout?: Workout;
}
