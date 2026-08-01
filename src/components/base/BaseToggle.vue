<script setup lang="ts">
import { CircleCheck, CircleX } from '@lucide/vue'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    disabled?: boolean
    size?: 'sm' | 'md' | 'lg'
  }>(),
  {
    modelValue: false,
    disabled: false,
    size: 'md',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const sizes = {
  sm: { track: 'h-6 w-11', knob: 'h-4 w-4', knobOn: 'translate-x-5', icon: 12 },
  md: { track: 'h-8 w-14', knob: 'h-6 w-6', knobOn: 'translate-x-7', icon: 14 },
  lg: { track: 'h-10 w-[4.5rem]', knob: 'h-8 w-8', knobOn: 'translate-x-9', icon: 16 },
}

function toggle() {
  if (props.disabled) return
  emit('update:modelValue', !props.modelValue)
}
</script>

<template>
  <button
    type="button"
    role="switch"
    :aria-checked="modelValue"
    aria-label="toggle"
    class="relative inline-flex items-center rounded-full transition-colors duration-200"
    :class="[
      sizes[size].track,
      modelValue ? 'bg-primary' : 'bg-gray-300',
      disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
    ]"
    @click="toggle"
  >
    <span
      class="absolute left-1 top-1 flex items-center justify-center rounded-full bg-white shadow transition-transform duration-200"
      :class="[sizes[size].knob, modelValue ? sizes[size].knobOn : 'translate-x-0']"
    >
      <CircleCheck v-if="modelValue" :size="sizes[size].icon" class="text-primary" />
      <CircleX v-else :size="sizes[size].icon" class="text-gray-400" />
    </span>
  </button>
</template>
