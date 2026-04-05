import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm'
import type { User } from './User.js'

@Entity('progression_slopes')
@Index(['userId', 'metric', 'startDate', 'endDate'])
export class ProgressionSlope {
  @PrimaryGeneratedColumn()
  id!: number

  @Column('int')
  userId!: number

  @Column('varchar')
  metric!: string

  @Column({ type: 'float' })
  slope!: number

  @Column({ type: 'timestamp' })
  startDate!: Date

  @Column({ type: 'timestamp' })
  endDate!: Date

  @Column('int')
  sampleCount!: number

  @CreateDateColumn()
  createdAt!: Date

  @ManyToOne('User', 'workouts', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User
}

export default ProgressionSlope
