<script setup lang="ts">
import { CircleAlert } from '@lucide/vue'

withDefaults(
  defineProps<{
    id?: string
    label?: string
    type?: 'text' | 'email' | 'password' | 'number'
    modelValue?: string
    placeholder?: string
    error?: string
    disabled?: boolean
    required?: boolean
    autocomplete?: string
  }>(),
  {
    id: undefined,
    label: undefined,
    type: 'text',
    modelValue: '',
    placeholder: undefined,
    error: undefined,
    disabled: false,
    required: false,
    autocomplete: undefined,
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
    <div class="relative">
      <span
        v-if="$slots.icon"
        class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-soft"
      >
        <slot name="icon" />
      </span>
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :autocomplete="autocomplete"
        class="w-full rounded-md border bg-surface px-3 py-2 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50"
        :class="[error ? 'border-red-500' : 'border-border', $slots.icon ? 'pl-10' : '']"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
    </div>
    <p v-if="error" class="flex items-center gap-1 text-xs text-red-500">
      <CircleAlert :size="12" />
      {{ error }}
    </p>
  </label>
</template>
