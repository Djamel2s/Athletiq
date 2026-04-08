import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import type { User } from './User.js';

@Entity('body_stats')
@Index(['userId', 'date'])
export class BodyStat {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('int')
  userId!: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date!: Date;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    default: 0,
    transformer: { to: (v: number) => v, from: (v: string) => (v ? parseFloat(v) : 0) },
  })
  weight!: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: { to: (v: number) => v, from: (v: string) => (v ? parseFloat(v) : v) },
  })
  bodyFat?: number;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ManyToOne('User', 'bodyStats', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;
}
