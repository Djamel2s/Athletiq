<template>
  <div class="w-full">
    <label v-if="label" :for="inputId" class="block text-sm font-medium text-dark-300 mb-2">
      {{ label }}
      <span v-if="required" class="text-primary-500">*</span>
    </label>

    <div class="relative">
      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :class="inputClasses"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @blur="$emit('blur', $event)"
        @focus="$emit('focus', $event)"
      />

      <div v-if="icon" class="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500">
        {{ icon }}
      </div>
    </div>

    <p v-if="error" class="mt-2 text-sm text-primary-500">
      {{ error }}
    </p>

    <p v-else-if="hint" class="mt-2 text-sm text-dark-500">
      {{ hint }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string | number
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  label?: string
  placeholder?: string
  icon?: string
  error?: string
  hint?: string
  disabled?: boolean
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  required: false
})

defineEmits<{
  'update:modelValue': [value: string | number]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const inputId = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`)

const inputClasses = computed(() => {
  const base = 'input'
  const withIcon = props.icon ? 'pl-12' : ''
  const errorState = props.error ? 'ring-2 ring-primary-500 dark:ring-primary-400' : ''

  return [base, withIcon, errorState].join(' ')
})
</script>
