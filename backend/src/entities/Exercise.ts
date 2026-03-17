import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm'
import type { Workout } from './Workout.js'
import type { Set } from './Set.js'
import type { ExerciseLibrary } from './ExerciseLibrary.js'

@Entity('exercises')
@Index(['workoutId'])
@Index(['exerciseLibraryId'])
export class Exercise {
  @PrimaryGeneratedColumn()
  id!: number

  @Column('int')
  workoutId!: number

  @Column({ type: 'int', nullable: true })
  exerciseLibraryId?: number

  @Column('varchar')
  name!: string

  @Column({ type: 'int', default: 0 })
  orderIndex!: number

  @Column({ type: 'text', nullable: true })
  notes?: string

  @Column({ type: 'int', nullable: true })
  targetSets?: number

  @Column({ type: 'int', nullable: true })
  targetReps?: number

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, transformer: { to: (v: number) => v, from: (v: string) => v ? parseFloat(v) : v } })
  targetWeight?: number

  @Column({ type: 'int', nullable: true })
  restTime?: number

  @Column({ type: 'json', nullable: true })
  plannedSets?: Array<{ setNumber: number; targetReps: number; targetWeight: number; restTime?: number }>

  @ManyToOne('Workout', 'exercises', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workoutId' })
  workout!: Workout

  @ManyToOne('ExerciseLibrary', { nullable: true })
  @JoinColumn({ name: 'exerciseLibraryId' })
  exerciseLibrary?: ExerciseLibrary

  @OneToMany('Set', 'exercise')
  sets!: Set[]
}
