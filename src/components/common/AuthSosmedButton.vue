<script setup lang="ts">
import { Icon } from '@iconify/vue'

withDefaults(
  defineProps<{
    sosmed: 'google' | 'facebook' | 'twitter'
    disabled?: boolean
  }>(),
  {
    disabled: false,
  },
)

const emit = defineEmits<{
  click: []
}>()

const icons = {
  google: 'logos:google-icon',
  facebook: 'logos:facebook',
  twitter: 'logos:x',
}

const labels = {
  google: 'Lanjut dengan Google',
  facebook: 'Lanjut dengan Facebook',
  twitter: 'Lanjut dengan X',
}
</script>

<template>
  <button
    type="button"
    class="flex w-full items-center justify-center gap-3 rounded-md border border-border bg-surface px-4 py-2.5 text-sm font-medium text-text transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
    :disabled="disabled"
    @click="emit('click')"
  >
    <Icon :icon="icons[sosmed]" class="h-4 w-4" />
    {{ labels[sosmed] }}
  </button>
</template>
