<script setup lang="ts">
import BaseCard from '@/components/base/BaseCard.vue'

withDefaults(
  defineProps<{
    name: string
    role: string
    testimonial: string
    image?: string
  }>(),
  {
    image: 'https://placehold.co/600x600/EEE/31343C',
  },
)
</script>

<template>
  <BaseCard
    class="flex flex-col items-center justify-center gap-4 w-full min-w-64 sm:min-w-80 md:min-w-2xl mx-auto border-primary-400 border-2"
  >
    <p class="flex-1 w-full flex items-center justify-center text-center overflow-hidden">
      "{{ testimonial }}"
    </p>
    <div class="flex flex-row max-w-xl gap-4">
      <img :src="image" alt="" class="w-12 h-12 rounded-full object-cover" />
      <div class="flex flex-col text-start">
        <p class="font-semibold">{{ name }}</p>
        <p class="text-xs text-gray-400">{{ role }}</p>
      </div>
    </div>
  </BaseCard>
</template>
