<script setup lang="ts">
import { CircleAlert } from '@lucide/vue'
import { ChevronDown } from '@lucide/vue'

interface SelectOption {
  value: string
  label: string
}

withDefaults(
  defineProps<{
    id?: string
    label?: string
    modelValue?: string
    placeholder?: string
    options: SelectOption[]
    error?: string
    disabled?: boolean
    required?: boolean
  }>(),
  {
    id: undefined,
    label: undefined,
    modelValue: '',
    placeholder: 'Pilih salah satu',
    error: undefined,
    disabled: false,
    required: false,
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
      <select
        :id="id"
        :value="modelValue"
        :disabled="disabled"
        :required="required"
        class="w-full appearance-none rounded-md border border-border bg-surface px-3 py-2 pr-9 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50"
        :class="error ? 'border-red-500' : 'border-border'"
        @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      >
        <option value="" disabled>{{ placeholder }}</option>
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <ChevronDown
        :size="16"
        class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-soft"
      />
    </div>
    <p v-if="error" class="flex items-center gap-1 text-xs text-red-500">
      <CircleAlert :size="12" />
      {{ error }}
    </p>
  </label>
</template>
