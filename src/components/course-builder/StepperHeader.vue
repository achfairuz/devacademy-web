<script setup lang="ts">
import { Check, ClipboardList, Layers, Type } from '@lucide/vue'
import type { Component } from 'vue'

import { STEP_META, type StepNumber } from '@/hooks/useCourseBuilder'

defineProps<{
  step: StepNumber
}>()

const emit = defineEmits<{
  select: [step: StepNumber]
}>()

const icons: Component[] = [Type, Layers, ClipboardList]
</script>

<template>
  <ol class="flex items-center gap-2 sm:gap-3">
    <li
      v-for="(meta, index) in STEP_META"
      :key="meta.title"
      class="flex flex-1 items-center gap-2 sm:gap-3"
    >
      <button
        type="button"
        class="group flex items-center gap-2.5 sm:gap-3"
        :class="index < step ? 'cursor-pointer' : 'cursor-default'"
        :aria-current="step === index + 1 ? 'step' : undefined"
        @click="index < step && emit('select', (index + 1) as StepNumber)"
      >
        <span
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors"
          :class="
            step === index + 1
              ? 'border-primary bg-primary text-white'
              : index < step
                ? 'border-primary bg-primary-50 text-primary'
                : 'border-border bg-surface text-text-soft'
          "
        >
          <Check v-if="index < step" :size="16" />
          <component :is="icons[index]" v-else-if="step === index + 1" :size="16" />
          <span v-else>{{ index + 1 }}</span>
        </span>

        <span class="flex flex-col text-left">
          <span
            class="hidden text-[11px] font-medium uppercase tracking-wide text-text-soft sm:block"
          >
            Step {{ index + 1 }}
          </span>
          <span
            class="text-sm font-semibold leading-tight transition-colors"
            :class="index <= step - 1 ? 'text-heading' : 'text-text-soft'"
          >
            {{ meta.title }}
          </span>
        </span>
      </button>

      <span
        v-if="index < STEP_META.length - 1"
        class="mx-1 hidden h-px flex-1 sm:block"
        :class="index < step - 1 ? 'bg-primary/50' : 'bg-border'"
      />
    </li>
  </ol>
</template>
