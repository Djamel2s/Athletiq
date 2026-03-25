import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm'
import type { User } from './User.js'
import type { Workout } from './Workout.js'

@Entity('planned_workouts')
@Index(['inviterId'])
@Index(['inviteeId'])
@Index(['scheduledAt'])
export class PlannedWorkout {
  @PrimaryGeneratedColumn()
  id!: number

  @Column('int')
  inviterId!: number

  @Column('int')
  inviteeId!: number

  @Column({ type: 'int', nullable: true })
  workoutTemplateId?: number

  @Column('varchar')
  name!: string

  @Column({ type: 'timestamp' })
  scheduledAt!: Date

  @Column({ type: 'varchar', default: 'PENDING' })
  status!: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'COMPLETED'

  @Column({ type: 'text', nullable: true })
  notes?: string

  @CreateDateColumn()
  createdAt!: Date

  @ManyToOne('User', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'inviterId' })
  inviter!: User

  @ManyToOne('User', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'inviteeId' })
  invitee!: User

  @ManyToOne('Workout', { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'workoutTemplateId' })
  workoutTemplate?: Workout
}
