import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm'
import type { User } from './User.js'

@Entity('feed_posts')
@Index(['userId'])
@Index(['createdAt'])
export class FeedPost {
  @PrimaryGeneratedColumn()
  id!: number

  @Column('int')
  userId!: number

  @Column('varchar')
  type!: string  // WORKOUT_COMPLETED, PHOTO, TIMELAPSE, TEMPLATE_SHARED, PR_ACHIEVED

  @Column({ type: 'json', nullable: true })
  data?: any  // Flexible JSON for different post types

  @Column({ type: 'int', default: 0 })
  reactions!: number  // Simple reaction count

  @CreateDateColumn()
  createdAt!: Date

  @ManyToOne('User', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User
}
