<script setup lang="ts">
import { Search, Check } from '@lucide/vue'
import { computed, ref } from 'vue'

import { categoryIconNames, resolveCategoryIcon } from '@/utils/icon'

const props = withDefaults(
  defineProps<{
    modelValue?: string
  }>(),
  {
    modelValue: '',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const searchQuery = ref('')

const filteredIcons = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return categoryIconNames
  return categoryIconNames.filter((name) => name.toLowerCase().includes(query))
})

function selectIcon(name: string) {
  emit('update:modelValue', props.modelValue === name ? '' : name)
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="relative">
      <Search
        :size="15"
        class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-soft"
      />
      <input
        v-model="searchQuery"
        type="search"
        placeholder="Cari ikon..."
        class="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-sm text-heading outline-none transition-colors placeholder:text-text-soft focus:border-primary"
      />
    </div>

    <div
      class="grid max-h-56 grid-cols-6 gap-1.5 overflow-y-auto rounded-lg border border-border p-2 sm:grid-cols-8"
    >
      <button
        v-for="name in filteredIcons"
        :key="name"
        type="button"
        class="relative flex aspect-square items-center justify-center rounded-lg border transition-colors"
        :class="
          modelValue === name
            ? 'border-primary bg-primary-50 text-primary'
            : 'border-transparent text-text-soft hover:border-border hover:bg-gray-50 hover:text-heading'
        "
        :title="name"
        :aria-label="`Pilih ikon ${name}`"
        @click="selectIcon(name)"
      >
        <component :is="resolveCategoryIcon(name)" :size="18" />
        <span
          v-if="modelValue === name"
          class="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-white"
        >
          <Check :size="10" />
        </span>
      </button>
    </div>

    <p v-if="filteredIcons.length === 0" class="py-6 text-center text-sm text-text-soft">
      Ikon tidak ditemukan
    </p>

    <p class="text-xs text-text-soft">
      {{ filteredIcons.length }} ikon tersedia
      <span v-if="modelValue"> &middot; dipilih: <strong class="text-primary">{{ modelValue }}</strong></span>
    </p>
  </div>
</template>
