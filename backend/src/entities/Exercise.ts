import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm'
import { Workout } from './Workout.js'
import { Set } from './Set.js'
import { ExerciseLibrary } from './ExerciseLibrary.js'

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

  @Column({ type: 'float', nullable: true })
  targetWeight?: number

  @Column({ type: 'int', nullable: true })
  restTime?: number

  @Column({ type: 'json', nullable: true })
  plannedSets?: Array<{ setNumber: number; targetReps: number; targetWeight: number }>

  @ManyToOne(() => Workout, workout => workout.exercises, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workoutId' })
  workout!: Workout

  @ManyToOne(() => ExerciseLibrary, { nullable: true })
  @JoinColumn({ name: 'exerciseLibraryId' })
  exerciseLibrary?: ExerciseLibrary

  @OneToMany(() => Set, set => set.exercise)
  sets!: Set[]
}
