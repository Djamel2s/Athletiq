/**
 * Composable pour le mode hors-ligne des séances.
 * Sauvegarde la séance en cours dans IndexedDB pour éviter la perte de données.
 * Sync automatique quand la connexion revient.
 */

const DB_NAME = 'athletiq-offline'
const DB_VERSION = 1
const STORE_NAME = 'pending-workout'

interface OfflineSet {
  exerciseIndex: number
  setNumber: number
  reps: number
  weight: number
  rpe?: number
}

interface OfflineWorkout {
  workoutId: number
  workoutName: string
  startedAt: string
  sets: OfflineSet[]
  lastSavedAt: string
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'workoutId' })
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export const useOfflineWorkout = () => {
  /**
   * Sauvegarde l'état actuel de la séance en IndexedDB.
   */
  const saveWorkoutLocally = async (data: OfflineWorkout): Promise<void> => {
    if (!process.client || !('indexedDB' in window)) return
    try {
      const db = await openDB()
      const tx = db.transaction(STORE_NAME, 'readwrite')
      tx.objectStore(STORE_NAME).put({ ...data, lastSavedAt: new Date().toISOString() })
      await new Promise<void>((resolve, reject) => {
        tx.oncomplete = () => resolve()
        tx.onerror = () => reject(tx.error)
      })
      db.close()
    } catch (e) {
      logger.warn('Offline save failed:', e)
    }
  }

  /**
   * Récupère la séance sauvegardée localement.
   */
  const getLocalWorkout = async (workoutId: number): Promise<OfflineWorkout | null> => {
    if (!process.client || !('indexedDB' in window)) return null
    try {
      const db = await openDB()
      const tx = db.transaction(STORE_NAME, 'readonly')
      const request = tx.objectStore(STORE_NAME).get(workoutId)
      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          db.close()
          resolve(request.result || null)
        }
        request.onerror = () => {
          db.close()
          reject(request.error)
        }
      })
    } catch {
      return null
    }
  }

  /**
   * Supprime la séance locale (après sync réussie).
   */
  const clearLocalWorkout = async (workoutId: number): Promise<void> => {
    if (!process.client || !('indexedDB' in window)) return
    try {
      const db = await openDB()
      const tx = db.transaction(STORE_NAME, 'readwrite')
      tx.objectStore(STORE_NAME).delete(workoutId)
      await new Promise<void>((resolve, reject) => {
        tx.oncomplete = () => resolve()
        tx.onerror = () => reject(tx.error)
      })
      db.close()
    } catch {
      // Silently fail
    }
  }

  /**
   * Vérifie si une séance non synchronisée existe.
   */
  const hasPendingWorkout = async (): Promise<boolean> => {
    if (!process.client || !('indexedDB' in window)) return false
    try {
      const db = await openDB()
      const tx = db.transaction(STORE_NAME, 'readonly')
      const request = tx.objectStore(STORE_NAME).count()
      return new Promise((resolve) => {
        request.onsuccess = () => {
          db.close()
          resolve(request.result > 0)
        }
        request.onerror = () => {
          db.close()
          resolve(false)
        }
      })
    } catch {
      return false
    }
  }

  /**
   * Récupère toutes les séances en attente.
   */
  const getAllPendingWorkouts = async (): Promise<OfflineWorkout[]> => {
    if (!process.client || !('indexedDB' in window)) return []
    try {
      const db = await openDB()
      const tx = db.transaction(STORE_NAME, 'readonly')
      const request = tx.objectStore(STORE_NAME).getAll()
      return new Promise((resolve) => {
        request.onsuccess = () => {
          db.close()
          resolve(request.result || [])
        }
        request.onerror = () => {
          db.close()
          resolve([])
        }
      })
    } catch {
      return []
    }
  }

  return {
    saveWorkoutLocally,
    getLocalWorkout,
    clearLocalWorkout,
    hasPendingWorkout,
    getAllPendingWorkouts
  }
}
