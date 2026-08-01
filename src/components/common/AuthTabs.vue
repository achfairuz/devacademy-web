<script setup lang="ts">
import { LogInIcon, PersonStandingIcon } from '@lucide/vue'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import BaseTabs from '@/components/base/BaseTabs.vue'

type AuthTab = 'login' | 'register'

const route = useRoute()
const router = useRouter()

const modelValue = computed<AuthTab>(() => (route.name === 'register' ? 'register' : 'login'))

const tabs: { label: string; value: AuthTab }[] = [
  { label: 'Login', value: 'login' },
  { label: 'Register', value: 'register' },
]

function onSelect(value: AuthTab) {
  if (value === modelValue.value) return
  router.push({ name: value })
}
</script>

<template>
  <BaseTabs :model-value="modelValue" :options="tabs" @update:model-value="onSelect">
    <template #label="{ option }">
      <LogInIcon v-if="option.value === 'login'" class="h-4 w-4" />
      <PersonStandingIcon v-else class="h-4 w-4" />
      {{ option.label }}
    </template>
  </BaseTabs>
</template>
