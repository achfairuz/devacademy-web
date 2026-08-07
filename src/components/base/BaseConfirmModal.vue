<script setup lang="ts">
import { CheckCircle2, Info, TriangleAlert } from '@lucide/vue'
import { computed } from 'vue'

import BaseModal from '@/components/base/BaseModal.vue'
import BaseButton from '@/components/base/BaseButton.vue'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    title?: string
    description?: string
    variant?: 'danger' | 'success' | 'info'
    confirmText?: string
    cancelText?: string
    loading?: boolean
    closeOnOverlay?: boolean
  }>(),
  {
    modelValue: false,
    title: 'Konfirmasi',
    description: undefined,
    variant: 'danger',
    confirmText: 'Ya, Lanjutkan',
    cancelText: 'Batal',
    loading: false,
    closeOnOverlay: true,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
  cancel: []
}>()

const config = computed(() => ({
  danger: {
    icon: TriangleAlert,
    iconWrap: 'bg-red-50 text-red-600',
    confirmClass: '!bg-red-600 hover:!bg-red-700',
  },
  success: {
    icon: CheckCircle2,
    iconWrap: 'bg-emerald-50 text-emerald-600',
    confirmClass: '!bg-emerald-600 hover:!bg-emerald-700',
  },
  info: {
    icon: Info,
    iconWrap: 'bg-primary-50 text-primary',
    confirmClass: '',
  },
}[props.variant]))

function onCancel() {
  emit('cancel')
  emit('update:modelValue', false)
}

function onConfirm() {
  emit('confirm')
}
</script>

<template>
  <BaseModal
    :model-value="modelValue"
    :title="title"
    size="sm"
    :close-on-overlay="closeOnOverlay"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="flex flex-col items-center gap-4 text-center">
      <span
        class="flex h-14 w-14 items-center justify-center rounded-full"
        :class="config.iconWrap"
      >
        <component :is="config.icon" :size="28" />
      </span>

      <div class="flex flex-col gap-1.5">
        <slot name="title">
          <h2 class="text-lg font-bold text-heading">{{ title }}</h2>
        </slot>
        <slot name="description">
          <p class="text-sm leading-relaxed text-text-soft">{{ description }}</p>
        </slot>
      </div>

      <slot />
    </div>

    <template #footer>
      <BaseButton
        type="button"
        variant="secondary"
        class="!bg-gray-100 !text-text"
        :disabled="loading"
        @click="onCancel"
      >
        {{ cancelText }}
      </BaseButton>
      <BaseButton
        type="button"
        :class="config.confirmClass"
        :loading="loading"
        @click="onConfirm"
      >
        {{ confirmText }}
      </BaseButton>
    </template>
  </BaseModal>
</template>
