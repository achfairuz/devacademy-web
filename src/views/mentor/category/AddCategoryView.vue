<script setup lang="ts">
import { ArrowLeft, Check, Layers, LoaderCircle, Plus, Tag, Trash2 } from '@lucide/vue'
import { RouterLink } from 'vue-router'
import { computed, onMounted, ref } from 'vue'

import { ApiError } from '@/api/http'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import { useCategoryController } from '@/controllers/categoryController'
import { formatDate } from '@/utils/formatters'

const { categories, loading, loadCategories, addCategory, removeCategory } = useCategoryController()

const name = ref('')
const submitting = ref(false)
const deletingId = ref<string | null>(null)
const error = ref<string | null>(null)
const success = ref<string | null>(null)

onMounted(loadCategories)

const remaining = computed(() => name.value.trim().length)

async function onSubmit() {
  const trimmed = name.value.trim()
  if (!trimmed) {
    error.value = 'Nama kategori wajib diisi.'
    return
  }

  submitting.value = true
  error.value = null
  success.value = null
  try {
    await addCategory({ name: trimmed })
    name.value = ''
    success.value = 'Kategori berhasil ditambahkan.'
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Terjadi kesalahan.'
  } finally {
    submitting.value = false
  }
}

async function onDelete(id: string) {
  deletingId.value = id
  error.value = null
  try {
    await removeCategory(id)
    success.value = 'Kategori berhasil dihapus.'
  } catch (err) {
    if (err instanceof ApiError && err.status === 400) {
      error.value = 'Kategori masih dipakai oleh kelas dan tidak bisa dihapus.'
    } else {
      error.value = err instanceof Error ? err.message : 'Terjadi kesalahan.'
    }
  } finally {
    deletingId.value = null
  }
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex flex-col gap-1">
        <RouterLink
          to="/mentor/courses"
          class="inline-flex w-fit items-center gap-1 text-sm font-medium text-text-soft no-underline transition-colors hover:text-primary"
        >
          <ArrowLeft :size="15" />
          Kembali ke Kelas
        </RouterLink>
        <h1 class="text-2xl font-bold text-heading">Kategori</h1>
        <p class="text-sm text-text-soft">Kelola kategori untuk kelas Anda</p>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <BaseCard class="!p-6">
        <div class="flex items-center gap-2.5">
          <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary">
            <Plus :size="18" />
          </span>
          <div>
            <h2 class="font-semibold text-heading">Tambah Kategori</h2>
            <p class="text-sm text-text-soft">Buat kategori baru untuk mengelompokkan kelas</p>
          </div>
        </div>

        <form class="mt-5 flex flex-col gap-4" @submit.prevent="onSubmit">
          <BaseInput
            id="category-name"
            v-model="name"
            label="Nama Kategori"
            placeholder="cth: Programming"
            required
          >
            <template #icon>
              <Tag :size="16" />
            </template>
          </BaseInput>

          <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
          <p v-if="success" class="flex items-center gap-1.5 text-sm text-emerald-600">
            <Check :size="15" />
            {{ success }}
          </p>

          <div class="flex items-center justify-between gap-3">
            <p class="text-xs text-text-soft">{{ remaining }} karakter</p>
            <BaseButton type="submit" :loading="submitting">
              <Plus :size="16" />
              Simpan Kategori
            </BaseButton>
          </div>
        </form>
      </BaseCard>

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
          <p class="text-sm text-text-soft">Tambahkan kategori pertama Anda.</p>
        </div>

        <ul v-else class="mt-5 flex flex-col gap-2.5">
          <li
            v-for="category in categories"
            :key="category.id"
            class="flex items-center gap-3 rounded-lg border border-border px-3.5 py-3"
          >
            <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-text-soft">
              <Tag :size="16" />
            </span>
            <div class="min-w-0 flex-1">
              <p class="truncate font-medium text-heading">{{ category.name }}</p>
              <p class="truncate text-xs text-text-soft">
                {{ category.slug }} &middot; dibuat {{ formatDate(category.createdAt) }}
              </p>
            </div>
            <button
              type="button"
              class="rounded-md p-2 text-text-soft transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              :aria-label="`Hapus kategori ${category.name}`"
              :disabled="deletingId === category.id"
              @click="onDelete(category.id)"
            >
              <LoaderCircle v-if="deletingId === category.id" :size="16" class="animate-spin" />
              <Trash2 v-else :size="16" />
            </button>
          </li>
        </ul>
      </BaseCard>
    </div>
  </div>
</template>
