<template>
  <Transition name="offline-toast">
    <div
      v-if="!isOnline || isSyncing"
      class="fixed bottom-[88px] left-4 z-[200] px-4 py-2 rounded-full backdrop-blur-md border text-xs font-medium inline-flex items-center gap-2 shadow-lg"
      style="transform: translateZ(0);"
      :class="isSyncing
        ? 'bg-white/80 dark:bg-primary-800/80 border-primary-200/60 dark:border-primary-700/60 text-primary-600 dark:text-primary-400'
        : 'bg-white/80 dark:bg-primary-800/80 border-primary-200/60 dark:border-primary-700/60 text-primary-500 dark:text-primary-400'"
    >
      <span v-if="isSyncing" class="w-3 h-3 border-2 border-primary-300 dark:border-primary-600 border-t-sand-500 rounded-full animate-spin"></span>
      <Icon v-else name="lucide:wifi-off" class="w-3.5 h-3.5" />
      <span v-if="isSyncing">Synchronisation...</span>
      <span v-else>Hors-ligne<span v-if="pendingCount > 0"> · {{ pendingCount }} en attente</span></span>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const { isOnline, isSyncing, pendingCount } = useOfflineStorage()
</script>

<style scoped>
.offline-toast-enter-active, .offline-toast-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.offline-toast-enter-from, .offline-toast-leave-to {
  opacity: 0;
  opacity: 0;
  transform: translateY(10px);
}
</style>
