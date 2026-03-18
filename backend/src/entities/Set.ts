import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm'
import type { Exercise } from './Exercise.js'

@Entity('sets')
@Index(['exerciseId'])
export class Set {
  @PrimaryGeneratedColumn()
  id!: number

  @Column('int')
  exerciseId!: number

  @Column('int')
  setNumber!: number

  @Column('int')
  reps!: number

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, default: 0, transformer: { to: (v: number) => v, from: (v: string) => v ? parseFloat(v) : 0 } })
  weight!: number

  @Column({ type: 'int', nullable: true })
  rpe?: number

  @Column({ type: 'text', nullable: true })
  notes?: string

  @ManyToOne('Exercise', 'sets', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'exerciseId' })
  exercise!: Exercise
}
