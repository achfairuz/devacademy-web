<script setup lang="ts">
import { X } from '@lucide/vue'
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    title?: string
    description?: string
    size?: 'sm' | 'md' | 'lg'
    closeOnOverlay?: boolean
    closeOnEsc?: boolean
  }>(),
  {
    modelValue: false,
    title: undefined,
    description: undefined,
    size: 'md',
    closeOnOverlay: true,
    closeOnEsc: true,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const panelRef = ref<HTMLElement | null>(null)
const previouslyFocused = ref<HTMLElement | null>(null)

const sizes = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
}

const isOpen = computed(() => props.modelValue)

function close() {
  if (props.modelValue) emit('update:modelValue', false)
}

function onOverlayClick() {
  if (props.closeOnOverlay) close()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.closeOnEsc) {
    event.preventDefault()
    close()
  }
}

watch(isOpen, async (open) => {
  if (open) {
    previouslyFocused.value = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeydown)
    await nextTick()
    panelRef.value?.focus()
  } else {
    document.body.style.overflow = ''
    document.removeEventListener('keydown', onKeydown)
    previouslyFocused.value?.focus()
    previouslyFocused.value = null
  }
})

onBeforeUnmount(() => {
  document.body.style.overflow = ''
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Teleport to="body">
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-end justify-center bg-gray-900/50 p-4 backdrop-blur-sm sm:items-center"
        @click.self="onOverlayClick"
      >
        <transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="translate-y-4 scale-95 opacity-0 sm:translate-y-0"
          enter-to-class="translate-y-0 scale-100 opacity-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="translate-y-0 scale-100 opacity-100"
          leave-to-class="translate-y-4 scale-95 opacity-0 sm:translate-y-0"
        >
          <div
            v-if="isOpen"
            ref="panelRef"
            role="dialog"
            aria-modal="true"
            :aria-label="title ?? 'Dialog'"
            tabindex="-1"
            class="relative flex w-full flex-col rounded-xl border border-border bg-surface shadow-xl outline-none"
            :class="sizes[size]"
          >
            <div
              v-if="title || description || $slots.header"
              class="flex items-start justify-between gap-4 border-b border-border px-6 py-4"
            >
              <div class="min-w-0">
                <slot name="header">
                  <h2 class="text-lg font-semibold text-heading">{{ title }}</h2>
                  <p v-if="description" class="mt-0.5 text-sm text-text-soft">{{ description }}</p>
                </slot>
              </div>
              <button
                type="button"
                class="shrink-0 rounded-md p-1.5 text-text-soft transition-colors hover:bg-gray-100 hover:text-heading"
                aria-label="Tutup"
                @click="close"
              >
                <X :size="18" />
              </button>
            </div>

            <div class="flex-1 overflow-y-auto px-6 py-5">
              <slot />
            </div>

            <div
              v-if="$slots.footer"
              class="flex items-center justify-end gap-2 border-t border-border px-6 py-4"
            >
              <slot name="footer" />
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </Teleport>
</template>
