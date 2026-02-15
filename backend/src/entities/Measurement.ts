import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm'
import { User } from './User.js'

@Entity('measurements')
@Index(['userId', 'date'])
export class Measurement {
  @PrimaryGeneratedColumn()
  id!: number

  @Column('int')
  userId!: number

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date!: Date

  @Column({ type: 'float', nullable: true })
  chest?: number

  @Column({ type: 'float', nullable: true })
  waist?: number

  @Column({ type: 'float', nullable: true })
  hips?: number

  @Column({ type: 'float', nullable: true })
  biceps?: number

  @Column({ type: 'float', nullable: true })
  thighs?: number

  @Column({ type: 'float', nullable: true })
  calves?: number

  @ManyToOne(() => User, user => user.measurements, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User
}
