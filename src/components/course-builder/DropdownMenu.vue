<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

withDefaults(
  defineProps<{
    align?: 'left' | 'right'
    widthClass?: string
  }>(),
  {
    align: 'right',
    widthClass: 'w-44',
  },
)

const open = ref(false)
const rootRef = ref<HTMLElement | null>(null)

function onClickOutside(event: MouseEvent) {
  if (rootRef.value && !rootRef.value.contains(event.target as Node)) {
    open.value = false
  }
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') open.value = false
}

onMounted(() => {
  document.addEventListener('mousedown', onClickOutside)
  document.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onClickOutside)
  document.removeEventListener('keydown', onKeydown)
})

function toggle() {
  open.value = !open.value
}

function close() {
  open.value = false
}
</script>

<template>
  <div ref="rootRef" class="relative">
    <slot name="trigger" :open="open" :toggle="toggle" />

    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="scale-95 opacity-0"
      enter-to-class="scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="scale-100 opacity-100"
      leave-to-class="scale-95 opacity-0"
    >
      <div
        v-if="open"
        class="absolute z-30 mt-1 flex flex-col overflow-hidden rounded-lg border border-border bg-surface py-1 shadow-lg"
        :class="[widthClass, align === 'right' ? 'right-0' : 'left-0']"
      >
        <slot :close="close" />
      </div>
    </transition>
  </div>
</template>
