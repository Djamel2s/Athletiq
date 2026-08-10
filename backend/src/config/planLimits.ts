// Limites par plan — FREE = après essai gratuit, PREMIUM = abonnement actif
export const PLAN_LIMITS = {
  FREE: {
    workoutsPerWeek: 2, // 2 séances max par semaine
    workoutTemplates: 2, // 2 templates max
    historyDays: 30, // Historique limité à 30 jours
    photos: 3, // 3 photos max au total
    goals: 1, // 1 objectif max
  },
  PREMIUM: {
    workoutsPerWeek: Infinity,
    workoutTemplates: Infinity,
    historyDays: Infinity,
    photos: Infinity,
    goals: Infinity,
  },
} as const;

export type PlanType = keyof typeof PLAN_LIMITS;

// Limites de l'espace coach — FREE permet de tester avant de passer Pro
export const COACH_PLAN_LIMITS = {
  FREE: {
    maxClients: 3,
  },
  PRO: {
    maxClients: Infinity,
  },
} as const;

export type CoachPlanType = keyof typeof COACH_PLAN_LIMITS;
