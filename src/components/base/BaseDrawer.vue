<script setup lang="ts">
import { X } from '@lucide/vue'
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    title?: string
    description?: string
    size?: 'md' | 'lg' | 'xl'
    closeOnOverlay?: boolean
    closeOnEsc?: boolean
  }>(),
  {
    modelValue: false,
    title: undefined,
    description: undefined,
    size: 'lg',
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
  md: 'sm:max-w-md',
  lg: 'sm:max-w-2xl',
  xl: 'sm:max-w-4xl',
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
        class="fixed inset-0 z-50 flex justify-end bg-gray-900/50 backdrop-blur-sm"
        @click.self="onOverlayClick"
      >
        <transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="translate-x-full"
          enter-to-class="translate-x-0"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="translate-x-0"
          leave-to-class="translate-x-full"
        >
          <div
            v-if="isOpen"
            ref="panelRef"
            role="dialog"
            aria-modal="true"
            :aria-label="title ?? 'Drawer'"
            tabindex="-1"
            class="flex h-full w-full flex-col border-l border-border bg-surface shadow-xl outline-none"
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
