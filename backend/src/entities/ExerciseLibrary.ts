import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

export enum MuscleGroup {
  CHEST = 'CHEST',
  BACK = 'BACK',
  SHOULDERS = 'SHOULDERS',
  BICEPS = 'BICEPS',
  TRICEPS = 'TRICEPS',
  LEGS = 'LEGS',
  GLUTES = 'GLUTES',
  HAMSTRINGS = 'HAMSTRINGS',
  QUADS = 'QUADS',
  CALVES = 'CALVES',
  ABS = 'ABS',
  CARDIO = 'CARDIO',
  FULL_BODY = 'FULL_BODY'
}

export enum Equipment {
  BARBELL = 'BARBELL',
  DUMBBELL = 'DUMBBELL',
  MACHINE = 'MACHINE',
  CABLE = 'CABLE',
  BODYWEIGHT = 'BODYWEIGHT',
  KETTLEBELL = 'KETTLEBELL',
  RESISTANCE_BAND = 'RESISTANCE_BAND',
  OTHER = 'OTHER'
}

export enum Difficulty {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED'
}

@Entity('exercise_library')
export class ExerciseLibrary {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'varchar', unique: true })
  name!: string

  @Column({ type: 'text', nullable: true })
  description?: string

  @Column({ type: 'text', nullable: true })
  instructions?: string

  @Column({
    type: 'enum',
    enum: MuscleGroup,
    array: true,
    default: []
  })
  muscleGroups!: MuscleGroup[]

  @Column({
    type: 'enum',
    enum: MuscleGroup,
    nullable: true
  })
  primaryMuscle?: MuscleGroup

  @Column({
    type: 'enum',
    enum: Equipment,
    default: Equipment.BODYWEIGHT
  })
  equipment!: Equipment

  @Column({
    type: 'enum',
    enum: Difficulty,
    default: Difficulty.INTERMEDIATE
  })
  difficulty!: Difficulty

  @Column({ type: 'varchar', nullable: true })
  videoUrl?: string

  @Column({ type: 'varchar', nullable: true })
  imageUrl?: string

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}
