import { useSubscriptionStore } from '~/stores/subscription';
import { useAuthStore } from '~/stores/auth';

interface Usage {
  workoutsThisWeek: number;
  templates: number;
  photos: number;
  goals: number;
}

interface Limits {
  workoutsPerWeek: number;
  workoutTemplates: number;
  historyDays: number;
  photos: number;
  goals: number;
}

export function useSubscriptionLimits() {
  const subscriptionStore = useSubscriptionStore();
  const authStore = useAuthStore();

  const usage = ref<Usage>({ workoutsThisWeek: 0, templates: 0, photos: 0, goals: 0 });
  const isLoading = ref(false);

  const isPremium = computed(() => {
    return subscriptionStore.status === 'ACTIVE' || subscriptionStore.status === 'TRIAL';
  });

  const limits = computed<Limits>(() => {
    if (isPremium.value) {
      return { workoutsPerWeek: -1, workoutTemplates: -1, historyDays: -1, photos: -1, goals: -1 };
    }
    return { workoutsPerWeek: 2, workoutTemplates: 2, historyDays: 30, photos: 3, goals: 1 };
  });

  // -1 = illimité
  const isUnlimited = (val: number) => val === -1;

  const canCreateWorkout = computed(
    () =>
      isUnlimited(limits.value.workoutsPerWeek) ||
      usage.value.workoutsThisWeek < limits.value.workoutsPerWeek
  );

  const canCreateTemplate = computed(
    () =>
      isUnlimited(limits.value.workoutTemplates) ||
      usage.value.templates < limits.value.workoutTemplates
  );

  const canUploadPhoto = computed(
    () => isUnlimited(limits.value.photos) || usage.value.photos < limits.value.photos
  );

  const canCreateGoal = computed(
    () => isUnlimited(limits.value.goals) || usage.value.goals < limits.value.goals
  );

  const fetchUsage = async () => {
    if (!authStore.token) return;
    isLoading.value = true;
    try {
      const config = useRuntimeConfig();
      const data = await $fetch<{ usage: Usage }>(`${config.public.apiUrl}/subscription/usage`, {
        timeout: 30000,
        headers: { Authorization: `Bearer ${authStore.token}` },
      });
      usage.value = data.usage;
    } catch (error) {
      logger.error('Error fetching usage:', error);
    } finally {
      isLoading.value = false;
    }
  };

  // Texte d'usage formaté : "1/2" ou "Illimité"
  const formatUsage = (current: number, limit: number) => {
    if (isUnlimited(limit)) return 'Illimité';
    return `${current}/${limit}`;
  };

  const workoutUsageText = computed(() =>
    formatUsage(usage.value.workoutsThisWeek, limits.value.workoutsPerWeek)
  );

  const templateUsageText = computed(() =>
    formatUsage(usage.value.templates, limits.value.workoutTemplates)
  );

  const photoUsageText = computed(() => formatUsage(usage.value.photos, limits.value.photos));

  const goalUsageText = computed(() => formatUsage(usage.value.goals, limits.value.goals));

  return {
    usage,
    limits,
    isPremium,
    isLoading,
    canCreateWorkout,
    canCreateTemplate,
    canUploadPhoto,
    canCreateGoal,
    fetchUsage,
    workoutUsageText,
    templateUsageText,
    photoUsageText,
    goalUsageText,
  };
}
