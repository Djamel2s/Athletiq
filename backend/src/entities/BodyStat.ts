import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm'
import { User } from './User.js'

@Entity('body_stats')
@Index(['userId', 'date'])
export class BodyStat {
  @PrimaryGeneratedColumn()
  id!: number

  @Column('int')
  userId!: number

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date!: Date

  @Column('float')
  weight!: number

  @Column({ type: 'float', nullable: true })
  bodyFat?: number

  @Column({ type: 'text', nullable: true })
  notes?: string

  @ManyToOne(() => User, user => user.bodyStats, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User
}
