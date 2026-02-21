import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, Index } from 'typeorm'
import { User } from './User.js'

export enum NotificationType {
  PR_ACHIEVED = 'PR_ACHIEVED',
  STREAK_MILESTONE = 'STREAK_MILESTONE',
  GOAL_PROGRESS = 'GOAL_PROGRESS',
  GOAL_ACHIEVED = 'GOAL_ACHIEVED',
  INACTIVITY = 'INACTIVITY'
}

@Entity('notifications')
@Index(['userId', 'read'])
export class Notification {
  @PrimaryGeneratedColumn()
  id!: number

  @Column('int')
  userId!: number

  @Column({ type: 'enum', enum: NotificationType })
  type!: NotificationType

  @Column('varchar')
  title!: string

  @Column({ type: 'text', nullable: true })
  message?: string

  @Column({ type: 'boolean', default: false })
  read!: boolean

  @CreateDateColumn()
  createdAt!: Date

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User
}
