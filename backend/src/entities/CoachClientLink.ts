import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Unique,
} from 'typeorm';
import type { User } from './User.js';

export enum CoachLinkStatus {
  PENDING = 'PENDING', // Invitation envoyée par le coach, en attente de l'athlète
  ACTIVE = 'ACTIVE', // Lien actif, le coach a accès selon les permissions accordées
  REVOKED = 'REVOKED', // Résilié par l'une ou l'autre des parties
}

/**
 * Relation entre un coach et un client (athlète).
 * Le client garde le contrôle total : c'est lui qui accorde les permissions
 * et peut révoquer l'accès à tout moment.
 */
@Entity('coach_client_links')
@Unique(['coachId', 'athleteId'])
@Index(['coachId', 'status'])
@Index(['athleteId', 'status'])
export class CoachClientLink {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('int')
  coachId!: number;

  @Column('int')
  athleteId!: number;

  @Column({ type: 'varchar', default: CoachLinkStatus.ACTIVE })
  status!: CoachLinkStatus;

  // Qui a initié la relation : utile pour l'affichage ("invitation envoyée" vs "a rejoint")
  @Column({ type: 'varchar', default: 'ATHLETE' })
  initiatedBy!: 'COACH' | 'ATHLETE';

  // Permissions accordées par l'athlète au coach — l'athlète peut les modifier à tout moment
  @Column({ type: 'boolean', default: true })
  canViewWorkouts!: boolean;

  @Column({ type: 'boolean', default: false })
  canViewPhotos!: boolean;

  @Column({ type: 'boolean', default: false })
  canViewMeasurements!: boolean;

  @Column({ type: 'boolean', default: false })
  canViewBodyStats!: boolean;

  @Column({ type: 'boolean', default: true })
  canAssignPrograms!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ type: 'timestamp', nullable: true })
  acceptedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  revokedAt?: Date;

  @ManyToOne('User', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'coachId' })
  coach!: User;

  @ManyToOne('User', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'athleteId' })
  athlete!: User;
}
