import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm'
import { User } from './User.js'
import { Exercise } from './Exercise.js'
import { WorkoutPhoto } from './WorkoutPhoto.js'

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

  @ManyToOne(() => User, user => user.workouts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User

  @OneToMany(() => Exercise, exercise => exercise.workout)
  exercises!: Exercise[]

  @OneToMany(() => WorkoutPhoto, photo => photo.workout)
  photos!: WorkoutPhoto[]
}
