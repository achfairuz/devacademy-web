<script setup lang="ts">
import { GraduationCap, ChevronRight } from '@lucide/vue'
import { RouterLink } from 'vue-router'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseTruncateText from '@/components/base/BaseTruncateText.vue'

withDefaults(
  defineProps<{
    program: {
      id: string | number
      name: string
      description: string
      route?: string
    }
  }>(),
  {},
)
</script>

<template>
  <BaseCard
    :padded="false"
    rounded="rounded-3xl"
    class="p-4 border-2 border-primary-400 flex flex-col justify-start items-start"
  >
    <div>
      <div class="flex flex-row gap-4">
        <GraduationCap class="w-12 h-12 text-primary" />
        <h1 class="text-xl font-semibold text-primary">{{ program.name }}</h1>
      </div>
      <div class="text-start flex-1 mt-2 overflow-hidden mb-4">
        <BaseTruncateText :text="program.description" :max="255" />
      </div>
    </div>
    <RouterLink
      :to="`/programs/${program.name.toLowerCase().replace(/ /g, '-')}`"
      class="text-gray-400 font-semibold hover:underline mt-2 inline-block"
      >Read More<ChevronRight class="w-4 h-4 inline-block ml-2" />
    </RouterLink>
  </BaseCard>
</template>
