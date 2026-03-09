import { computed, type Ref } from 'vue'
import type { Exercise } from '~/types/workout'

/**
 * Priority map for muscle groups.
 * Lower number = higher priority (should come first).
 */
const MUSCLE_PRIORITY: Record<string, number> = {
  LEGS: 1,
  QUADS: 1,
  HAMSTRINGS: 1,
  GLUTES: 1,
  BACK: 2,
  CHEST: 3,
  SHOULDERS: 4,
  BICEPS: 5,
  TRICEPS: 5,
  ABS: 6,
  CALVES: 6,
  CARDIO: 7,
}

/**
 * Priority map for equipment types.
 * Lower number = higher priority.
 */
const EQUIPMENT_PRIORITY: Record<string, number> = {
  BARBELL: 1,
  DUMBBELL: 2,
  CABLE: 3,
  MACHINE: 3,
  BODYWEIGHT: 4,
  RESISTANCE_BAND: 5,
  OTHER: 6,
}

/**
 * Determines whether an exercise is a compound movement
 * (targets 2 or more muscle groups according to exerciseLibrary.muscleGroups).
 */
function isCompound(exercise: Exercise): boolean {
  const muscleGroups = exercise.exerciseLibrary?.muscleGroups
  return Array.isArray(muscleGroups) && muscleGroups.length >= 2
}

/**
 * Returns the best (lowest) muscle priority value for an exercise.
 * Uses exerciseLibrary.muscleGroups first, falls back to primaryMuscle.
 */
function getMusclePriority(exercise: Exercise): number {
  const lib = exercise.exerciseLibrary
  if (!lib) return 99

  const groups = lib.muscleGroups
  if (Array.isArray(groups) && groups.length > 0) {
    return Math.min(...groups.map((g) => MUSCLE_PRIORITY[g] ?? 99))
  }

  if (lib.primaryMuscle) {
    return MUSCLE_PRIORITY[lib.primaryMuscle] ?? 99
  }

  return 99
}

/**
 * Returns the equipment priority for an exercise (lower = higher priority).
 */
function getEquipmentPriority(exercise: Exercise): number {
  const equipment = exercise.exerciseLibrary?.equipment
  if (!equipment) return 99
  return EQUIPMENT_PRIORITY[equipment] ?? 99
}

/**
 * Returns the target weight for comparison (higher = should come first).
 */
function getTargetWeight(exercise: Exercise): number {
  return exercise.targetWeight ?? 0
}

/**
 * Sorts an array of exercises for optimal training order.
 *
 * Ordering rules:
 *   1. Compound exercises (2+ muscle groups) before isolation exercises.
 *   2. Within the same compound/isolation group, order by muscle priority
 *      (legs > back > chest > shoulders > biceps/triceps > abs/calves).
 *   3. Within the same muscle priority, BARBELL > DUMBBELL > CABLE/MACHINE.
 *   4. Within the same equipment priority, heavier target weight first.
 *
 * Does NOT mutate the original array.
 */
export function optimizeExerciseOrder(exercises: Exercise[]): Exercise[] {
  return [...exercises].sort((a, b) => {
    // 1. Compounds first
    const aCompound = isCompound(a) ? 0 : 1
    const bCompound = isCompound(b) ? 0 : 1
    if (aCompound !== bCompound) return aCompound - bCompound

    // 2. Muscle group priority (lower = first)
    const aMusclePri = getMusclePriority(a)
    const bMusclePri = getMusclePriority(b)
    if (aMusclePri !== bMusclePri) return aMusclePri - bMusclePri

    // 3. Equipment priority (lower = first)
    const aEquipPri = getEquipmentPriority(a)
    const bEquipPri = getEquipmentPriority(b)
    if (aEquipPri !== bEquipPri) return aEquipPri - bEquipPri

    // 4. Heavier target weight first
    return getTargetWeight(b) - getTargetWeight(a)
  })
}

/**
 * Composable that provides a reactive computed wrapper around optimizeExerciseOrder.
 *
 * @param exercises - A ref containing the exercise array.
 * @returns An object with:
 *   - `optimizedExercises`: a computed ref of the sorted exercises
 *   - `optimizeExerciseOrder`: the raw sort function for imperative use
 */
export function useExerciseOrder(exercises: Ref<Exercise[]>) {
  const optimizedExercises = computed(() => optimizeExerciseOrder(exercises.value))

  return {
    optimizedExercises,
    optimizeExerciseOrder,
  }
}
