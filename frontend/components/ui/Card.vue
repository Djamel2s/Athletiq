<template>
  <div :class="cardClasses">
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'default' | 'dark' | 'bordered'
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  hover: true,
  padding: 'md'
})

const cardClasses = computed(() => {
  const base = 'rounded-2xl transition-all duration-300'

  const variants = {
    default: 'card-glass',
    dark: 'glass-dark',
    bordered: 'glass border-2 border-primary-500/30'
  }

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }

  const hoverEffect = props.hover ? 'cursor-pointer' : ''

  return [base, variants[props.variant], paddings[props.padding], hoverEffect].join(' ')
})
</script>
