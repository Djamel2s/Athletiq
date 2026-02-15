import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm'
import { Workout } from './Workout.js'
import { BodyStat } from './BodyStat.js'
import { Measurement } from './Measurement.js'

export enum Goal {
  BULK = 'BULK',
  STRENGTH = 'STRENGTH',
  RECOMP = 'RECOMP',
  CUT = 'CUT'
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'varchar', unique: true })
  email!: string

  @Column('varchar')
  password!: string

  @Column({ type: 'varchar', nullable: true })
  firstName?: string

  @Column({ type: 'varchar', nullable: true })
  lastName?: string

  @Column({ type: 'varchar', nullable: true })
  avatarUrl?: string

  @Column({ type: 'enum', enum: Goal, nullable: true })
  goal?: Goal

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @OneToMany(() => Workout, workout => workout.user)
  workouts!: Workout[]

  @OneToMany(() => BodyStat, bodyStat => bodyStat.user)
  bodyStats!: BodyStat[]

  @OneToMany(() => Measurement, measurement => measurement.user)
  measurements!: Measurement[]
}
