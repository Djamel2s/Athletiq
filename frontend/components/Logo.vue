<template>
  <div class="flex items-center space-x-3">
    <!-- Logo image -->
    <img
      :src="logoUrl"
      :alt="alt"
      :class="sizeClasses"
      class="transition-transform duration-300 hover:scale-105"
    />

    <!-- Texte optionnel -->
    <span v-if="showText" class="text-xl font-bold text-primary-900">
      {{ text }}
    </span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  logoUrl?: string
  alt?: string
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  text?: string
}

const props = withDefaults(defineProps<Props>(), {
  logoUrl: '/logo.svg',
  alt: 'Athletiq',
  size: 'md',
  showText: false,
  text: 'Athletiq'
})

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'h-8 w-auto',
    md: 'h-10 w-auto',
    lg: 'h-12 w-auto'
  }
  return sizes[props.size]
})
</script>
