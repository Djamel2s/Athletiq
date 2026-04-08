<template>
  <img :src="logoSrc" alt="Athletiq" :class="classes" width="56" height="56" />
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    class?: string;
  }>(),
  {
    class: 'h-10 md:h-14 w-auto transition-transform duration-300 hover:scale-105',
  }
);

const { isRose } = useTheme();
const logoSrc = computed(() => (isRose.value ? '/athletiq-icon-rose.svg' : '/athletiq-icon.svg'));
const classes = computed(() => props.class);
</script>
