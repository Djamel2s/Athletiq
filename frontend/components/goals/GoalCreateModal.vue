<template>
  <UiModal :show="show" :title="t('goalModal.title')" @close="$emit('close')">
    <form @submit.prevent="handleSubmit" class="space-y-5">
      <!-- Type -->
      <div>
        <label class="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">{{
          t('goalModal.type')
        }}</label>
        <select v-model="form.type" class="input-primary">
          <option value="WEIGHT">{{ t('goalModal.targetWeight') }}</option>
          <option value="PR">{{ t('goalModal.personalRecord') }}</option>
          <option value="BODY_FAT">{{ t('goalModal.targetBodyFat') }}</option>
        </select>
      </div>

      <!-- Title -->
      <div>
        <label class="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">{{
          t('goalModal.titleLabel')
        }}</label>
        <input
          v-model="form.title"
          type="text"
          class="input-primary"
          :placeholder="t('goalModal.titlePlaceholder')"
          required
        />
      </div>

      <!-- Exercise (only for PR) -->
      <div v-if="form.type === 'PR'">
        <label class="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">{{
          t('goalModal.exercise')
        }}</label>
        <select v-model="form.exerciseName" class="input-primary" required>
          <option value="" disabled>{{ t('goalModal.selectExercise') }}</option>
          <option v-for="name in exerciseNames" :key="name" :value="name">{{ name }}</option>
        </select>
      </div>

      <!-- Target Value -->
      <div>
        <label class="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">
          {{ t('goalModal.targetValue') }} {{ form.type === 'BODY_FAT' ? '(%)' : '(kg)' }}
        </label>
        <input
          v-model.number="form.targetValue"
          type="number"
          step="0.1"
          min="0"
          class="input-primary"
          required
        />
      </div>

      <!-- Deadline -->
      <div>
        <label class="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">{{
          t('goalModal.deadline')
        }}</label>
        <input v-model="form.deadline" type="date" class="input-primary" />
      </div>

      <!-- Submit -->
      <div class="flex justify-end gap-3 pt-2">
        <button type="button" @click="$emit('close')" class="btn-outline">
          {{ t('common.cancel') }}
        </button>
        <button type="submit" class="btn-primary" :disabled="isSubmitting">
          {{ isSubmitting ? t('goalModal.creating') : t('goalModal.create') }}
        </button>
      </div>
    </form>
  </UiModal>
</template>

<script setup lang="ts">
import { GoalType } from '~/types/goals';
import type { CreateGoalPayload } from '~/types/goals';

const { t } = useLocale();

interface Props {
  show: boolean;
  exerciseNames: string[];
  currentWeight?: number | null;
  currentBodyFat?: number | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
  created: [payload: CreateGoalPayload];
}>();

const form = reactive({
  type: 'WEIGHT' as string,
  title: '',
  targetValue: 0,
  exerciseName: '',
  deadline: '',
});

const isSubmitting = ref(false);

const handleSubmit = async () => {
  isSubmitting.value = true;
  try {
    // Calculate startValue based on type
    let startValue = 0;
    if (form.type === 'WEIGHT') {
      startValue = props.currentWeight ?? 0;
    } else if (form.type === 'BODY_FAT') {
      startValue = props.currentBodyFat ?? 0;
    }
    // For PR, startValue will be calculated server-side from existing records

    const payload: CreateGoalPayload = {
      type: form.type as GoalType,
      title: form.title,
      targetValue: form.targetValue,
      startValue,
      exerciseName: form.type === 'PR' ? form.exerciseName : undefined,
      deadline: form.deadline || undefined,
    };

    emit('created', payload);

    // Reset form
    form.type = 'WEIGHT';
    form.title = '';
    form.targetValue = 0;
    form.exerciseName = '';
    form.deadline = '';
  } finally {
    isSubmitting.value = false;
  }
};
</script>
