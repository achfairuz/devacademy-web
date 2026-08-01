<script setup lang="ts" generic="T extends string | number">
withDefaults(
  defineProps<{
    modelValue?: T
    options: { label: string; value: T }[]
    disabled?: boolean
  }>(),
  {
    modelValue: undefined,
    disabled: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: T]
}>()
</script>

<template>
  <div class="flex w-full gap-2 rounded-full bg-gray-100 p-1">
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      class="flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
      :class="
        option.value === modelValue ? 'bg-white text-text shadow-sm' : 'text-text-soft'
      "
      :disabled="disabled"
      @click="emit('update:modelValue', option.value)"
    >
      <slot name="label" :option="option">{{ option.label }}</slot>
    </button>
  </div>
</template>
