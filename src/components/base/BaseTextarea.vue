<script setup lang="ts">
import { CircleAlert } from '@lucide/vue'

withDefaults(
  defineProps<{
    id?: string
    label?: string
    modelValue?: string
    placeholder?: string
    error?: string
    disabled?: boolean
    required?: boolean
    rows?: number
  }>(),
  {
    id: undefined,
    label: undefined,
    modelValue: '',
    placeholder: undefined,
    error: undefined,
    disabled: false,
    required: false,
    rows: 4,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <label :for="id" class="flex flex-col gap-1 text-sm">
    <span v-if="label">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </span>
    <textarea
      :id="id"
      :rows="rows"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      class="w-full resize-y rounded-md border bg-surface px-3 py-2 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50"
      :class="error ? 'border-red-500' : 'border-border'"
      @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />
    <p v-if="error" class="flex items-center gap-1 text-xs text-red-500">
      <CircleAlert :size="12" />
      {{ error }}
    </p>
  </label>
</template>
