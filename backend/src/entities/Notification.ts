import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import type { User } from './User.js';

export enum NotificationType {
  PR_ACHIEVED = 'PR_ACHIEVED',
  STREAK_MILESTONE = 'STREAK_MILESTONE',
  GOAL_PROGRESS = 'GOAL_PROGRESS',
  GOAL_ACHIEVED = 'GOAL_ACHIEVED',
  INACTIVITY = 'INACTIVITY',
  FRIEND_REQUEST = 'FRIEND_REQUEST',
  FRIEND_ACCEPTED = 'FRIEND_ACCEPTED',
  WORKOUT_INVITATION = 'WORKOUT_INVITATION',
  WORKOUT_INVITATION_ACCEPTED = 'WORKOUT_INVITATION_ACCEPTED',
  SESSION_INVITE = 'SESSION_INVITE',
  COACH_LINK_REQUEST = 'COACH_LINK_REQUEST',
  COACH_LINK_ACCEPTED = 'COACH_LINK_ACCEPTED',
  COACH_LINK_JOINED = 'COACH_LINK_JOINED',
  COACH_LINK_REVOKED = 'COACH_LINK_REVOKED',
  COACH_CLIENT_INACTIVE = 'COACH_CLIENT_INACTIVE',
  COACH_CLIENT_VOLUME_DROP = 'COACH_CLIENT_VOLUME_DROP',
  PROGRAM_ASSIGNED = 'PROGRAM_ASSIGNED',
}

@Entity('notifications')
@Index(['userId', 'read'])
export class Notification {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('int')
  userId!: number;

  @Column({ type: 'enum', enum: NotificationType })
  type!: NotificationType;

  @Column('varchar')
  title!: string;

  @Column({ type: 'text', nullable: true })
  message?: string;

  @Column({ type: 'boolean', default: false })
  read!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne('User', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;
}
