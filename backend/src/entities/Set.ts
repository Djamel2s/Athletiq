import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm'
import { Exercise } from './Exercise.js'

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

  @Column('float')
  weight!: number

  @Column({ type: 'int', nullable: true })
  rpe?: number

  @Column({ type: 'text', nullable: true })
  notes?: string

  @ManyToOne(() => Exercise, exercise => exercise.sets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'exerciseId' })
  exercise!: Exercise
}
