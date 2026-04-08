import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import type { Workout } from './Workout.js';

@Entity('workout_photos')
@Index(['workoutId', 'isPrimary'])
@Index(['createdAt'])
export class WorkoutPhoto {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('int')
  workoutId!: number;

  @Column('varchar')
  photoUrl!: string;

  @Column({ type: 'boolean', default: false })
  isPrimary!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne('Workout', 'photos', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workoutId' })
  workout!: Workout;
}
