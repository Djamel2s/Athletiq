import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm'
import type { User } from './User.js'

export enum AchievementCategory {
  WORKOUT = 'WORKOUT',       // Liés aux séances
  VOLUME = 'VOLUME',         // Volume total soulevé
  STREAK = 'STREAK',         // Régularité
  PR = 'PR',                 // Records personnels
  BODY = 'BODY',             // Suivi corporel
  SOCIAL = 'SOCIAL',         // Partage, etc.
  MILESTONE = 'MILESTONE'    // Étapes importantes
}

/**
 * Définition statique d'un achievement (pas en DB).
 * Seuls les achievements débloqués sont stockés via UserAchievement.
 */
export interface AchievementDefinition {
  id: string            // ex: 'first_workout', 'volume_1000'
  name: string
  description: string
  icon: string          // emoji ou nom d'icône
  category: AchievementCategory
  condition: {
    type: 'workout_count' | 'total_volume' | 'streak_weeks' | 'pr_count' | 'body_entries' | 'photo_count' | 'share_count' | 'days_member'
    threshold: number
  }
  xp: number            // Points d'expérience
}

@Entity('user_achievements')
@Index(['userId', 'achievementId'], { unique: true })
export class UserAchievement {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'int' })
  userId!: number

  @ManyToOne('User', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User

  @Column({ type: 'varchar' })
  achievementId!: string  // Référence à AchievementDefinition.id

  @CreateDateColumn()
  unlockedAt!: Date
}
