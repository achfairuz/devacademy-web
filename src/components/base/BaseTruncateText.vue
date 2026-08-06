<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    text: string
    max?: number
    suffix?: string
  }>(),
  {
    max: 255,
    suffix: '...',
  },
)

const display = computed(() =>
  props.text.length > props.max ? props.text.slice(0, props.max) + props.suffix : props.text,
)
</script>

<template>
  <span class="text-text-soft"><slot :text="display">{{ display }}</slot></span>
</template>
