<script setup lang="ts">
import { ArrowLeft, Layers, LoaderCircle, ShieldCheck } from '@lucide/vue'
import { RouterLink } from 'vue-router'
import { computed, onMounted } from 'vue'

import BaseCard from '@/components/base/BaseCard.vue'
import { useCategoryController } from '@/controllers/categoryController'
import { formatDate } from '@/utils/formatters'
import { resolveCategoryIcon } from '@/utils/icon'

const { categories, loading, loadCategories } = useCategoryController()

onMounted(loadCategories)

const sortedCategories = computed(() =>
  [...categories.value].sort((a, b) => a.name.localeCompare(b.name)),
)
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div class="flex flex-col gap-1">
        <RouterLink
          to="/mentor/courses"
          class="inline-flex w-fit items-center gap-1 text-sm font-medium text-text-soft no-underline transition-colors hover:text-primary"
        >
          <ArrowLeft :size="15" />
          Kembali ke Kelas
        </RouterLink>
        <h1 class="text-2xl font-bold text-heading">Kategori</h1>
        <p class="text-sm text-text-soft">Jelajahi kategori yang tersedia untuk kelas Anda</p>
      </div>

      <p
        class="inline-flex w-fit items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium text-text-soft"
      >
        <ShieldCheck :size="14" />
        Kategori dikelola oleh admin
      </p>
    </div>

    <BaseCard class="!p-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary-50 text-secondary-600">
            <Layers :size="18" />
          </span>
          <div>
            <h2 class="font-semibold text-heading">Daftar Kategori</h2>
            <p class="text-sm text-text-soft">{{ categories.length }} kategori tersedia</p>
          </div>
        </div>
      </div>

      <div v-if="loading" class="flex flex-col items-center gap-3 py-16 text-center">
        <LoaderCircle :size="28" class="animate-spin text-primary" />
        <p class="text-sm text-text-soft">Memuat kategori...</p>
      </div>

      <div
        v-else-if="categories.length === 0"
        class="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border py-16 text-center"
      >
        <Layers :size="32" class="text-text-soft" />
        <p class="font-semibold text-heading">Belum ada kategori</p>
        <p class="text-sm text-text-soft">Kategori akan muncul di sini setelah dibuat oleh admin.</p>
      </div>

      <div
        v-else
        class="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
      >
        <div
          v-for="category in sortedCategories"
          :key="category.id"
          class="flex items-center gap-3 rounded-xl border border-border px-4 py-3.5 transition-colors hover:border-primary/40 hover:bg-primary-50/40"
        >
          <span
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary"
          >
            <component :is="resolveCategoryIcon(category.icon)" :size="18" />
          </span>
          <div class="min-w-0 flex-1">
            <p class="truncate font-semibold text-heading">{{ category.name }}</p>
            <p class="truncate text-xs text-text-soft">
              {{ category.slug }} &middot; dibuat {{ formatDate(category.createdAt) }}
            </p>
          </div>
        </div>
      </div>
    </BaseCard>
  </div>
</template>
