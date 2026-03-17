import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm'
import type { User } from './User.js'

export enum SubscriptionStatus {
  TRIAL = 'TRIAL',           // Essai gratuit en cours
  ACTIVE = 'ACTIVE',         // Abonnement payant actif
  PAST_DUE = 'PAST_DUE',    // Paiement échoué, en attente
  CANCELED = 'CANCELED',     // Annulé par l'utilisateur
  EXPIRED = 'EXPIRED'        // Essai ou abo expiré
}

export enum SubscriptionPlan {
  FREE = 'FREE',              // Plan gratuit (après essai expiré, sans payer)
  FREE_TRIAL = 'FREE_TRIAL',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY'
}

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn()
  id!: number

  @Index({ unique: true })
  @Column({ type: 'int' })
  userId!: number

  @ManyToOne('User', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User

  // Stripe
  @Column({ type: 'varchar', nullable: true })
  stripeCustomerId?: string

  @Column({ type: 'varchar', nullable: true })
  stripeSubscriptionId?: string

  // Plan & Status — varchar pour éviter les problèmes de migration d'enum PostgreSQL
  @Column({ type: 'varchar', default: SubscriptionPlan.FREE_TRIAL })
  plan!: SubscriptionPlan

  @Column({ type: 'varchar', default: SubscriptionStatus.TRIAL })
  status!: SubscriptionStatus

  // Dates
  @Column({ type: 'timestamp', nullable: true })
  trialStartDate?: Date

  @Column({ type: 'timestamp', nullable: true })
  trialEndDate?: Date

  @Column({ type: 'timestamp', nullable: true })
  currentPeriodStart?: Date

  @Column({ type: 'timestamp', nullable: true })
  currentPeriodEnd?: Date

  @Column({ type: 'timestamp', nullable: true })
  canceledAt?: Date

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}
