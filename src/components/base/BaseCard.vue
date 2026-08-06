<script setup lang="ts">
withDefaults(
  defineProps<{
    padded?: boolean
    rounded?: string
  }>(),
  {
    padded: true,
    rounded: 'rounded-lg',
  },
)
</script>

<template>
  <div
    class="border border-border bg-surface shadow-sm"
    :class="[rounded, padded ? 'p-6' : '']"
  >
    <slot />
  </div>
</template>
