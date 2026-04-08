import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Unique,
} from 'typeorm';
import type { User } from './User.js';

@Entity('friendships')
@Unique(['requesterId', 'addresseeId'])
@Index(['requesterId'])
@Index(['addresseeId'])
export class Friendship {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('int')
  requesterId!: number;

  @Column('int')
  addresseeId!: number;

  @Column({ type: 'varchar', default: 'PENDING' })
  status!: 'PENDING' | 'ACCEPTED' | 'BLOCKED';

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne('User', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'requesterId' })
  requester!: User;

  @ManyToOne('User', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'addresseeId' })
  addressee!: User;
}
