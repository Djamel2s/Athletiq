import { defineStore } from 'pinia';
import type { BodyStat, Measurement, ProgressPhoto, PersonalRecord } from '~/types/body';
import { tSync } from '~/composables/useLocale';

interface BodyState {
  bodyStats: BodyStat[];
  measurements: Measurement[];
  photos: ProgressPhoto[];
  records: PersonalRecord[];
  isLoading: boolean;
  error: string | null;
}

export const useBodyStore = defineStore('body', {
  state: (): BodyState => ({
    bodyStats: [],
    measurements: [],
    photos: [],
    records: [],
    isLoading: false,
    error: null,
  }),

  getters: {
    latestWeight: (state) => {
      if (state.bodyStats.length === 0) return null;
      return state.bodyStats[0];
    },

    weightChange30d: (state) => {
      if (state.bodyStats.length < 2) return null;
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const recent = state.bodyStats[0];
      const older = state.bodyStats.find((s) => new Date(s.date) <= thirtyDaysAgo);
      if (!older) return null;
      return +(recent.weight - older.weight).toFixed(1);
    },

    latestMeasurement: (state) => {
      if (state.measurements.length === 0) return null;
      return state.measurements[0];
    },

    primaryPhotos: (state) => {
      return state.photos.filter((p) => p.isPrimary);
    },
  },

  actions: {
    // ========== BODY STATS ==========
    async fetchBodyStats() {
      this.isLoading = true;
      this.error = null;
      try {
        const api = useBodyApi();
        const { data } = await api.getBodyStats();
        this.bodyStats = data;
      } catch (error: any) {
        this.error = error.message || tSync('bodyStore.errorLoadStats');
        logger.error('Fetch body stats error:', error);
      } finally {
        this.isLoading = false;
      }
    },

    async addBodyStat(data: { weight: number; bodyFat?: number; notes?: string; date?: string }) {
      try {
        const api = useBodyApi();
        const stat = await api.createBodyStat(data);
        this.bodyStats.unshift(stat);
        return stat;
      } catch (error: any) {
        this.error = error.message || tSync('bodyStore.errorAddStat');
        throw error;
      }
    },

    async updateBodyStat(id: number, data: Partial<BodyStat>) {
      try {
        const api = useBodyApi();
        const updated = await api.updateBodyStat(id, data);
        const index = this.bodyStats.findIndex((s) => s.id === id);
        if (index !== -1) this.bodyStats[index] = updated;
        return updated;
      } catch (error: any) {
        this.error = error.message || tSync('bodyStore.errorUpdateStat');
        throw error;
      }
    },

    async deleteBodyStat(id: number) {
      try {
        const api = useBodyApi();
        await api.deleteBodyStat(id);
        this.bodyStats = this.bodyStats.filter((s) => s.id !== id);
      } catch (error: any) {
        this.error = error.message || tSync('bodyStore.errorDeleteStat');
        throw error;
      }
    },

    // ========== MEASUREMENTS ==========
    async fetchMeasurements() {
      this.isLoading = true;
      this.error = null;
      try {
        const api = useBodyApi();
        const { data } = await api.getMeasurements();
        this.measurements = data;
      } catch (error: any) {
        this.error = error.message || tSync('bodyStore.errorLoadMeasurements');
        logger.error('Fetch measurements error:', error);
      } finally {
        this.isLoading = false;
      }
    },

    async addMeasurement(data: Partial<Omit<Measurement, 'id' | 'userId'>>) {
      try {
        const api = useBodyApi();
        const measurement = await api.createMeasurement(data);
        this.measurements.unshift(measurement);
        return measurement;
      } catch (error: any) {
        this.error = error.message || tSync('bodyStore.errorAddMeasurement');
        throw error;
      }
    },

    async updateMeasurement(id: number, data: Partial<Measurement>) {
      try {
        const api = useBodyApi();
        const updated = await api.updateMeasurement(id, data);
        const index = this.measurements.findIndex((m) => m.id === id);
        if (index !== -1) this.measurements[index] = updated;
        return updated;
      } catch (error: any) {
        this.error = error.message || tSync('bodyStore.errorUpdateMeasurement');
        throw error;
      }
    },

    async deleteMeasurement(id: number) {
      try {
        const api = useBodyApi();
        await api.deleteMeasurement(id);
        this.measurements = this.measurements.filter((m) => m.id !== id);
      } catch (error: any) {
        this.error = error.message || tSync('bodyStore.errorDeleteMeasurement');
        throw error;
      }
    },

    // ========== PHOTOS ==========
    async fetchPhotos() {
      this.isLoading = true;
      this.error = null;
      try {
        const api = useBodyApi();
        this.photos = await api.getRecentPhotos(50);
      } catch (error: any) {
        this.error = error.message || tSync('bodyStore.errorLoadPhotos');
        logger.error('Fetch photos error:', error);
      } finally {
        this.isLoading = false;
      }
    },

    async uploadPhoto(workoutId: number, file: File, isPrimary = false) {
      try {
        const api = useBodyApi();
        const photo = await api.uploadPhoto(workoutId, file, isPrimary);
        this.photos.unshift(photo);
        return photo;
      } catch (error: any) {
        this.error = error.message || tSync('bodyStore.errorUpload');
        throw error;
      }
    },

    async fetchTimelapse(startDate?: string, endDate?: string) {
      try {
        const api = useBodyApi();
        return await api.getTimelapse(startDate, endDate);
      } catch (error: any) {
        this.error = error.message || tSync('bodyStore.errorLoadTimelapse');
        throw error;
      }
    },

    async deletePhoto(id: number) {
      try {
        const api = useBodyApi();
        await api.deletePhoto(id);
        this.photos = this.photos.filter((p) => p.id !== id);
      } catch (error: any) {
        this.error = error.message || tSync('bodyStore.errorDeletePhoto');
        throw error;
      }
    },

    // ========== RECORDS ==========
    async fetchRecords() {
      this.isLoading = true;
      this.error = null;
      try {
        const api = useBodyApi();
        this.records = await api.getPersonalRecords();
      } catch (error: any) {
        this.error = error.message || tSync('bodyStore.errorLoadRecords');
        logger.error('Fetch records error:', error);
      } finally {
        this.isLoading = false;
      }
    },

    clearError() {
      this.error = null;
    },
  },
});
