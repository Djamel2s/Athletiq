/**
 * Calculateurs fitness — utilisés côté API et exposés en endpoint.
 */

/**
 * Estime le 1RM (one rep max) avec la formule d'Epley.
 * @param weight Poids soulevé (kg)
 * @param reps Nombre de répétitions effectuées
 * @returns 1RM estimé
 */
export function estimate1RM(weight: number, reps: number): number {
  if (reps <= 0 || weight <= 0) return 0
  if (reps === 1) return weight
  // Formule d'Epley : 1RM = w × (1 + r/30)
  return Math.round(weight * (1 + reps / 30) * 10) / 10
}

/**
 * Calcule le TDEE (Total Daily Energy Expenditure).
 * Utilise la formule de Mifflin-St Jeor.
 */
export function calculateTDEE(params: {
  weight: number        // kg
  height: number        // cm
  age: number
  gender: 'male' | 'female'
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
}): {
  bmr: number
  tdee: number
  macros: {
    maintenance: { calories: number; protein: number; carbs: number; fat: number }
    cut: { calories: number; protein: number; carbs: number; fat: number }
    bulk: { calories: number; protein: number; carbs: number; fat: number }
  }
} {
  const { weight, height, age, gender, activityLevel } = params

  // Mifflin-St Jeor
  let bmr: number
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161
  }

  const activityMultiplier: Record<string, number> = {
    sedentary: 1.2,      // Bureau, peu d'activité
    light: 1.375,         // 1-3 jours de sport/semaine
    moderate: 1.55,       // 3-5 jours
    active: 1.725,        // 6-7 jours
    very_active: 1.9      // Travail physique + sport
  }

  const tdee = Math.round(bmr * (activityMultiplier[activityLevel] || 1.55))

  // Macros par objectif
  const protein = Math.round(weight * 2) // 2g/kg

  return {
    bmr: Math.round(bmr),
    tdee,
    macros: {
      maintenance: {
        calories: tdee,
        protein,
        fat: Math.round(weight * 1), // 1g/kg
        carbs: Math.round((tdee - protein * 4 - weight * 9) / 4)
      },
      cut: {
        calories: tdee - 500,
        protein: Math.round(weight * 2.2), // Plus de protéines en cut
        fat: Math.round(weight * 0.8),
        carbs: Math.round((tdee - 500 - weight * 2.2 * 4 - weight * 0.8 * 9) / 4)
      },
      bulk: {
        calories: tdee + 300,
        protein,
        fat: Math.round(weight * 1),
        carbs: Math.round((tdee + 300 - protein * 4 - weight * 9) / 4)
      }
    }
  }
}

/**
 * Calcule les plaques à charger de chaque côté de la barre.
 * @param targetWeight Poids total visé (kg)
 * @param barWeight Poids de la barre (kg, par défaut 20)
 * @param availablePlates Plaques disponibles (kg, un côté)
 * @returns Liste des plaques par côté
 */
export function calculatePlates(
  targetWeight: number,
  barWeight: number = 20,
  availablePlates: number[] = [25, 20, 15, 10, 5, 2.5, 1.25]
): { plates: number[]; totalWeight: number; perSide: number } {
  let remaining = (targetWeight - barWeight) / 2

  if (remaining < 0) {
    return { plates: [], totalWeight: barWeight, perSide: 0 }
  }

  const plates: number[] = []
  const sortedPlates = [...availablePlates].sort((a, b) => b - a)

  for (const plate of sortedPlates) {
    while (remaining >= plate) {
      plates.push(plate)
      remaining -= plate
    }
  }

  const perSide = plates.reduce((sum, p) => sum + p, 0)
  return {
    plates,
    totalWeight: barWeight + perSide * 2,
    perSide
  }
}
