<template>
  <Teleport to="body">
    <div class="fixed top-6 right-6 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto rounded-xl p-4 shadow-xl backdrop-blur-md border transition-all"
          :class="toastClasses(toast.type)"
        >
          <div class="flex items-start gap-3">
            <div class="w-5 h-5 flex-shrink-0 mt-0.5" v-html="toastIcon(toast.type)"></div>
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-sm">{{ toast.title }}</p>
              <p v-if="toast.message" class="text-xs mt-1 opacity-80">{{ toast.message }}</p>
            </div>
            <button @click="removeToast(toast.id)" class="opacity-60 hover:opacity-100 transition-opacity flex-shrink-0">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const { toasts, removeToast } = useToast()

const toastClasses = (type: string) => {
  switch (type) {
    case 'success':
      return 'bg-green-50/90 dark:bg-green-900/80 border-green-200 dark:border-green-700 text-green-900 dark:text-green-100'
    case 'error':
      return 'bg-red-50/90 dark:bg-red-900/80 border-red-200 dark:border-red-700 text-red-900 dark:text-red-100'
    case 'warning':
      return 'bg-yellow-50/90 dark:bg-yellow-900/80 border-yellow-200 dark:border-yellow-700 text-yellow-900 dark:text-yellow-100'
    default:
      return 'bg-blue-50/90 dark:bg-blue-900/80 border-blue-200 dark:border-blue-700 text-blue-900 dark:text-blue-100'
  }
}

const toastIcon = (type: string) => {
  switch (type) {
    case 'success':
      return '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>'
    case 'error':
      return '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>'
    case 'warning':
      return '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>'
    default:
      return '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
  }
}
</script>

<style scoped>
.toast-enter-active {
  transition: all 0.3s ease;
}
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
