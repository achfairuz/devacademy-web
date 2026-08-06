<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  icon: Component
  title: string
  description: string
}>()
</script>

<template>
  <div class="flex flex-col items-center text-center md:items-start md:text-start">
    <div class="bg-primary rounded-full w-14 h-14 flex items-center justify-center mb-4">
      <component :is="icon" class="w-6 h-6 text-white" />
    </div>
    <h2 class="text-2xl md:text-3xl font-bold text-heading mb-4">{{ title }}</h2>
    <p class="text-text-soft mb-8">
      {{ description }}
    </p>
  </div>
</template>
