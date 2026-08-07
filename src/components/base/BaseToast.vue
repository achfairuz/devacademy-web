<script setup lang="ts">
import { CheckCircle2, CircleAlert, Info, X } from '@lucide/vue'
import { computed, onBeforeUnmount, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    toast: { message: string; type?: 'success' | 'error' | 'info' } | null
    duration?: number
  }>(),
  {
    toast: null,
    duration: 3500,
  },
)

const emit = defineEmits<{
  close: []
}>()

const config = computed(() => {
  switch (props.toast?.type ?? 'info') {
    case 'success':
      return { icon: CheckCircle2, classes: 'border-emerald-200 bg-emerald-50 text-emerald-700', iconClass: 'text-emerald-500' }
    case 'error':
      return { icon: CircleAlert, classes: 'border-red-200 bg-red-50 text-red-700', iconClass: 'text-red-500' }
    default:
      return { icon: Info, classes: 'border-primary-200 bg-primary-50 text-primary-700', iconClass: 'text-primary' }
  }
})

let timer: ReturnType<typeof setTimeout> | undefined

function scheduleClose() {
  clearTimer()
  if (!props.toast) return
  timer = setTimeout(() => emit('close'), props.duration)
}

function clearTimer() {
  if (timer) {
    clearTimeout(timer)
    timer = undefined
  }
}

watch(
  () => props.toast,
  () => scheduleClose(),
)

onBeforeUnmount(clearTimer)
</script>

<template>
  <Teleport to="body">
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="translate-y-2 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-2 opacity-0"
    >
      <div
        v-if="toast"
        role="status"
        class="fixed right-4 top-4 z-[60] flex w-full max-w-sm items-center gap-3 rounded-xl border px-4 py-3 shadow-lg"
        :class="config.classes"
      >
        <component :is="config.icon" :size="20" class="shrink-0" :class="config.iconClass" />
        <p class="flex-1 text-sm font-medium">{{ toast.message }}</p>
        <button
          type="button"
          class="shrink-0 rounded p-0.5 opacity-60 transition-opacity hover:opacity-100"
          aria-label="Tutup notifikasi"
          @click="emit('close')"
        >
          <X :size="15" />
        </button>
      </div>
    </transition>
  </Teleport>
</template>
