<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="close">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="close"></div>

        <!-- Modal -->
        <div class="relative glass-dark rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto custom-scrollbar">
          <!-- Header -->
          <div v-if="title || $slots.header" class="flex items-center justify-between p-6 border-b border-white/10">
            <slot name="header">
              <h3 class="text-2xl font-semibold">{{ title }}</h3>
            </slot>
            <button
              v-if="closable"
              @click="close"
              class="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors"
            >
              ✕
            </button>
          </div>

          <!-- Body -->
          <div class="p-6">
            <slot />
          </div>

          <!-- Footer -->
          <div v-if="$slots.footer" class="p-6 border-t border-white/10">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  show: boolean
  title?: string
  closable?: boolean
}

withDefaults(defineProps<Props>(), {
  closable: true
})

const emit = defineEmits<{
  close: []
}>()

const close = () => {
  emit('close')
}

// Fermer avec Escape
onMounted(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') close()
  }
  document.addEventListener('keydown', handleEscape)
  onUnmounted(() => document.removeEventListener('keydown', handleEscape))
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .glass-dark,
.modal-leave-active .glass-dark {
  transition: transform 0.3s ease;
}

.modal-enter-from .glass-dark,
.modal-leave-to .glass-dark {
  transform: scale(0.9);
}
</style>
