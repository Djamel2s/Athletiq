import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm'
import type { User } from './User.js'

@Entity('fatigue')
@Index(['userId', 'date'])
export class Fatigue {
  @PrimaryGeneratedColumn()
  id!: number

  @Column('int')
  userId!: number

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date!: Date

  @Column({ type: 'float' })
  score!: number

  @Column({ type: 'varchar', nullable: true })
  source?: string

  @Column({ type: 'text', nullable: true })
  notes?: string

  @CreateDateColumn()
  createdAt!: Date

  @ManyToOne('User', 'workouts', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User
}

export default Fatigue
