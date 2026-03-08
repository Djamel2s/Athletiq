<template>
  <div class="rounded-2xl border border-[#d4c4b0]/30 bg-gradient-to-r from-[#d4c4b0]/10 to-[#9d8569]/10 dark:from-[#d4c4b0]/5 dark:to-[#9d8569]/5 p-4 md:p-5">
    <div class="flex items-center gap-3 md:gap-4">
      <div class="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
        </svg>
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-semibold text-primary-900 dark:text-primary-100">{{ title }}</p>
        <p class="text-xs text-primary-500 dark:text-primary-400 mt-0.5">{{ message }}</p>
      </div>
      <NuxtLink to="/subscription" class="btn-primary text-xs px-4 py-2 flex-shrink-0">
        Passer Pro
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
  message?: string
}>()
</script>
