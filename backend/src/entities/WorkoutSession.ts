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

@Entity('workout_sessions')
@Index(['hostId'])
@Index(['status'])
export class WorkoutSession {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('int')
  hostId!: number;

  @Column({ type: 'varchar', unique: true })
  sessionCode!: string; // 6-char code to join

  @Column({ type: 'varchar', default: 'WAITING' })
  status!: 'WAITING' | 'ACTIVE' | 'PAUSED' | 'COMPLETED';

  @Column({ type: 'json', default: '[]' })
  participants!: Array<{
    userId: number;
    username: string;
    firstName: string;
    avatarUrl?: string;
    workoutId?: number;
    workoutName?: string;
    currentExerciseIndex: number;
    currentSetNumber: number;
    totalExercises: number;
    restTimeRemaining: number;
    restDuration: number;
    isFinished: boolean;
  }>;

  @Column({ type: 'int', default: 0 })
  currentTurnIndex!: number; // Index in participants array

  @Column({ type: 'varchar', default: 'TURN_BASED' })
  mode!: 'TURN_BASED'; // For future modes

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne('User', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hostId' })
  host!: User;
}
