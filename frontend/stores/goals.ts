import { defineStore } from 'pinia'
import type { UserGoal, CreateGoalPayload } from '~/types/goals'

interface GoalState {
  goals: UserGoal[]
  isLoading: boolean
  error: string | null
}

export const useGoalStore = defineStore('goals', {
  state: (): GoalState => ({
    goals: [],
    isLoading: false,
    error: null
  }),

  getters: {
    activeGoals: (state) => state.goals.filter(g => !g.achieved),
    achievedGoals: (state) => state.goals.filter(g => g.achieved)
  },

  actions: {
    async fetchGoals() {
      this.isLoading = true
      this.error = null
      try {
        const api = useGoalApi()
        this.goals = await api.getGoals()
      } catch (error: any) {
        this.error = error.message || 'Erreur lors du chargement des objectifs'
        console.error('Fetch goals error:', error)
      } finally {
        this.isLoading = false
      }
    },

    async addGoal(data: CreateGoalPayload) {
      try {
        const api = useGoalApi()
        const goal = await api.createGoal(data)
        this.goals.unshift(goal)
        return goal
      } catch (error: any) {
        this.error = error.message || 'Erreur lors de la création'
        throw error
      }
    },

    async removeGoal(id: number) {
      try {
        const api = useGoalApi()
        await api.deleteGoal(id)
        this.goals = this.goals.filter(g => g.id !== id)
      } catch (error: any) {
        this.error = error.message || 'Erreur lors de la suppression'
        throw error
      }
    },

    async markAchieved(id: number) {
      try {
        const api = useGoalApi()
        const updated = await api.achieveGoal(id)
        const index = this.goals.findIndex(g => g.id === id)
        if (index !== -1) this.goals[index] = { ...this.goals[index], ...updated, achieved: true, achievedAt: new Date().toISOString() }
      } catch (error: any) {
        this.error = error.message || 'Erreur lors de la validation'
        throw error
      }
    }
  }
})
