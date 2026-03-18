import { AchievementCategory, type AchievementDefinition } from '../entities/Achievement.js'

/**
 * Catalogue complet des achievements.
 * Les conditions sont vérifiées côté serveur dans achievementService.
 */
export const ACHIEVEMENTS: AchievementDefinition[] = [
  // === WORKOUT ===
  {
    id: 'first_workout',
    name: 'Premier pas',
    description: 'Terminer sa première séance',
    icon: '💪',
    category: AchievementCategory.WORKOUT,
    condition: { type: 'workout_count', threshold: 1 },
    xp: 10
  },
  {
    id: 'workout_10',
    name: 'Habitué',
    description: 'Terminer 10 séances',
    icon: '🏋️',
    category: AchievementCategory.WORKOUT,
    condition: { type: 'workout_count', threshold: 10 },
    xp: 50
  },
  {
    id: 'workout_25',
    name: 'Régulier',
    description: 'Terminer 25 séances',
    icon: '⚡',
    category: AchievementCategory.WORKOUT,
    condition: { type: 'workout_count', threshold: 25 },
    xp: 100
  },
  {
    id: 'workout_50',
    name: 'Acharné',
    description: 'Terminer 50 séances',
    icon: '🔥',
    category: AchievementCategory.WORKOUT,
    condition: { type: 'workout_count', threshold: 50 },
    xp: 200
  },
  {
    id: 'workout_100',
    name: 'Centurion',
    description: 'Terminer 100 séances',
    icon: '🏆',
    category: AchievementCategory.WORKOUT,
    condition: { type: 'workout_count', threshold: 100 },
    xp: 500
  },
  {
    id: 'workout_250',
    name: 'Machine',
    description: 'Terminer 250 séances',
    icon: '🤖',
    category: AchievementCategory.WORKOUT,
    condition: { type: 'workout_count', threshold: 250 },
    xp: 1000
  },

  // === VOLUME ===
  {
    id: 'volume_1000',
    name: 'Première tonne',
    description: 'Soulever 1 000 kg au total',
    icon: '🪨',
    category: AchievementCategory.VOLUME,
    condition: { type: 'total_volume', threshold: 1000 },
    xp: 20
  },
  {
    id: 'volume_10000',
    name: '10 tonnes',
    description: 'Soulever 10 000 kg au total',
    icon: '🏗️',
    category: AchievementCategory.VOLUME,
    condition: { type: 'total_volume', threshold: 10000 },
    xp: 100
  },
  {
    id: 'volume_100000',
    name: '100 tonnes',
    description: 'Soulever 100 000 kg au total',
    icon: '🚀',
    category: AchievementCategory.VOLUME,
    condition: { type: 'total_volume', threshold: 100000 },
    xp: 500
  },
  {
    id: 'volume_1000000',
    name: 'Titan',
    description: 'Soulever 1 000 000 kg au total',
    icon: '🌍',
    category: AchievementCategory.VOLUME,
    condition: { type: 'total_volume', threshold: 1000000 },
    xp: 2000
  },

  // === STREAK ===
  {
    id: 'streak_2',
    name: 'Lancé',
    description: 'Maintenir un streak de 2 semaines',
    icon: '📅',
    category: AchievementCategory.STREAK,
    condition: { type: 'streak_weeks', threshold: 2 },
    xp: 30
  },
  {
    id: 'streak_4',
    name: 'Un mois solide',
    description: 'Maintenir un streak de 4 semaines',
    icon: '🗓️',
    category: AchievementCategory.STREAK,
    condition: { type: 'streak_weeks', threshold: 4 },
    xp: 80
  },
  {
    id: 'streak_12',
    name: 'Trimestre de fer',
    description: 'Maintenir un streak de 12 semaines',
    icon: '🛡️',
    category: AchievementCategory.STREAK,
    condition: { type: 'streak_weeks', threshold: 12 },
    xp: 300
  },
  {
    id: 'streak_26',
    name: 'Six mois',
    description: 'Maintenir un streak de 26 semaines',
    icon: '👑',
    category: AchievementCategory.STREAK,
    condition: { type: 'streak_weeks', threshold: 26 },
    xp: 800
  },
  {
    id: 'streak_52',
    name: 'Un an sans faillir',
    description: 'Maintenir un streak de 52 semaines',
    icon: '💎',
    category: AchievementCategory.STREAK,
    condition: { type: 'streak_weeks', threshold: 52 },
    xp: 2000
  },

  // === PR ===
  {
    id: 'pr_1',
    name: 'Premier record',
    description: 'Battre son premier record personnel',
    icon: '🥇',
    category: AchievementCategory.PR,
    condition: { type: 'pr_count', threshold: 1 },
    xp: 20
  },
  {
    id: 'pr_5',
    name: 'Collectionneur',
    description: 'Battre 5 records personnels',
    icon: '🥈',
    category: AchievementCategory.PR,
    condition: { type: 'pr_count', threshold: 5 },
    xp: 80
  },
  {
    id: 'pr_25',
    name: 'Briseur de records',
    description: 'Battre 25 records personnels',
    icon: '🥉',
    category: AchievementCategory.PR,
    condition: { type: 'pr_count', threshold: 25 },
    xp: 300
  },
  {
    id: 'pr_100',
    name: 'Légende',
    description: 'Battre 100 records personnels',
    icon: '🏅',
    category: AchievementCategory.PR,
    condition: { type: 'pr_count', threshold: 100 },
    xp: 1000
  },

  // === BODY ===
  {
    id: 'body_first',
    name: 'Premier pesage',
    description: 'Enregistrer sa première entrée corporelle',
    icon: '⚖️',
    category: AchievementCategory.BODY,
    condition: { type: 'body_entries', threshold: 1 },
    xp: 10
  },
  {
    id: 'body_30',
    name: 'Suivi assidu',
    description: 'Enregistrer 30 entrées corporelles',
    icon: '📊',
    category: AchievementCategory.BODY,
    condition: { type: 'body_entries', threshold: 30 },
    xp: 100
  },
  {
    id: 'photo_first',
    name: 'Première photo',
    description: 'Ajouter sa première photo de progression',
    icon: '📸',
    category: AchievementCategory.BODY,
    condition: { type: 'photo_count', threshold: 1 },
    xp: 15
  },

  // === MILESTONE ===
  {
    id: 'member_30',
    name: 'Nouveau venu',
    description: 'Membre depuis 30 jours',
    icon: '🌱',
    category: AchievementCategory.MILESTONE,
    condition: { type: 'days_member', threshold: 30 },
    xp: 20
  },
  {
    id: 'member_365',
    name: 'Vétéran',
    description: 'Membre depuis 1 an',
    icon: '🎖️',
    category: AchievementCategory.MILESTONE,
    condition: { type: 'days_member', threshold: 365 },
    xp: 500
  },
]
