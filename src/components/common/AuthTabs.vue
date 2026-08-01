<script setup lang="ts">
import { LogInIcon, PersonStandingIcon } from '@lucide/vue'

import BaseTabs from '@/components/base/BaseTabs.vue'

type AuthTab = 'login' | 'register'

withDefaults(
  defineProps<{
    modelValue?: AuthTab
  }>(),
  {
    modelValue: 'login',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: AuthTab]
}>()

const tabs: { label: string; value: AuthTab }[] = [
  { label: 'Login', value: 'login' },
  { label: 'Register', value: 'register' },
]
</script>

<template>
  <BaseTabs
    :model-value="modelValue"
    :options="tabs"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template #label="{ option }">
      <LogInIcon v-if="option.value === 'login'" class="h-4 w-4" />
      <PersonStandingIcon v-else class="h-4 w-4" />
      {{ option.label }}
    </template>
  </BaseTabs>
</template>
