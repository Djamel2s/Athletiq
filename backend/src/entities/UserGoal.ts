import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, Index } from 'typeorm'
import { User } from './User.js'

export enum GoalType {
  WEIGHT = 'WEIGHT',
  PR = 'PR',
  BODY_FAT = 'BODY_FAT'
}

@Entity('user_goals')
@Index(['userId'])
export class UserGoal {
  @PrimaryGeneratedColumn()
  id!: number

  @Column('int')
  userId!: number

  @Column({ type: 'enum', enum: GoalType })
  type!: GoalType

  @Column('varchar')
  title!: string

  @Column('float')
  targetValue!: number

  @Column('float')
  startValue!: number

  @Column({ type: 'varchar', nullable: true })
  exerciseName?: string

  @Column({ type: 'int', nullable: true })
  exerciseLibraryId?: number

  @Column({ type: 'timestamp', nullable: true })
  deadline?: Date

  @Column({ type: 'boolean', default: false })
  achieved!: boolean

  @Column({ type: 'timestamp', nullable: true })
  achievedAt?: Date

  @CreateDateColumn()
  createdAt!: Date

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User
}
