import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import type { User } from './User.js';

@Entity('measurements')
@Index(['userId', 'date'])
export class Measurement {
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
    transformer: { to: (v: number) => v, from: (v: string) => (v ? parseFloat(v) : v) },
  })
  chest?: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: { to: (v: number) => v, from: (v: string) => (v ? parseFloat(v) : v) },
  })
  waist?: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: { to: (v: number) => v, from: (v: string) => (v ? parseFloat(v) : v) },
  })
  hips?: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: { to: (v: number) => v, from: (v: string) => (v ? parseFloat(v) : v) },
  })
  biceps?: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: { to: (v: number) => v, from: (v: string) => (v ? parseFloat(v) : v) },
  })
  thighs?: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: { to: (v: number) => v, from: (v: string) => (v ? parseFloat(v) : v) },
  })
  calves?: number;

  @ManyToOne('User', 'measurements', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;
}
