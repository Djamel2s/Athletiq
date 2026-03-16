import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm'
import type { User } from './User.js'
import type { Exercise } from './Exercise.js'
import type { WorkoutPhoto } from './WorkoutPhoto.js'

@Entity('workouts')
@Index(['userId', 'date'])
export class Workout {
  @PrimaryGeneratedColumn()
  id!: number

  @Column('int')
  userId!: number

  @Column('varchar')
  name!: string

  @Column({ type: 'text', nullable: true })
  description?: string

  @Column({ type: 'boolean', default: false })
  isTemplate!: boolean

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date!: Date

  @Column({ type: 'timestamp', nullable: true })
  startedAt?: Date

  @Index()
  @Column({ type: 'timestamp', nullable: true })
  completedAt?: Date

  @Column({ type: 'int', nullable: true })
  duration?: number

  @Column({ type: 'int', nullable: true })
  totalVolume?: number

  @Column({ type: 'text', nullable: true })
  notes?: string

  @CreateDateColumn()
  createdAt!: Date

  @ManyToOne('User', 'workouts', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User

  @OneToMany('Exercise', 'workout')
  exercises!: Exercise[]

  @OneToMany('WorkoutPhoto', 'workout')
  photos!: WorkoutPhoto[]
}
