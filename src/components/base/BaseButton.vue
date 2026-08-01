<script setup lang="ts">
import BaseSpinner from '@/components/base/BaseSpinner.vue'

withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset'
    variant?: 'primary' | 'secondary'
    disabled?: boolean
    loading?: boolean
  }>(),
  {
    type: 'button',
    variant: 'primary',
    disabled: false,
    loading: false,
  },
)
</script>

<template>
  <button
    :type="type"
    class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold transition-opacity duration-150 disabled:cursor-not-allowed disabled:opacity-50"
    :class="variant === 'secondary' ? 'bg-secondary-600 text-white' : 'bg-primary text-white'"
    :disabled="disabled || loading"
  >
    <BaseSpinner v-if="loading" size="sm" />
    <slot />
  </button>
</template>
