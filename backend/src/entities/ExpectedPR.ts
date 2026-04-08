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

@Entity('expected_prs')
@Index(['userId', 'exerciseName'])
export class ExpectedPR {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('int')
  userId!: number;

  @Column('varchar')
  exerciseName!: string;

  @Column({ type: 'float' })
  predicted!: number;

  @Column({ type: 'timestamp' })
  predictedAt!: Date;

  @Column({ type: 'float', nullable: true })
  confidence?: number;

  @Column({ type: 'varchar', nullable: true })
  modelSource?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne('User', 'workouts', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;
}

export default ExpectedPR;
