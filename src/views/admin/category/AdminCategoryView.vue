<script setup lang="ts">
import { Check, Layers, LoaderCircle, Plus, Tag, Trash2 } from '@lucide/vue'
import { computed, ref } from 'vue'

import { ApiError } from '@/api/http'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseConfirmModal from '@/components/base/BaseConfirmModal.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseToast from '@/components/base/BaseToast.vue'
import IconPicker from '@/components/common/mentor/IconPicker.vue'
import { useCategories } from '@/hooks/useCategories'
import type { Category } from '@/models/category'
import { formatDate } from '@/utils/formatters'
import { resolveCategoryIcon } from '@/utils/icon'

const { categories, loading, addCategory, removeCategory } = useCategories()

const name = ref('')
const icon = ref('')
const submitting = ref(false)
const formError = ref<string | null>(null)
const formSuccess = ref<string | null>(null)

const toDelete = ref<Category | null>(null)
const deleting = ref(false)
const deleteError = ref<string | null>(null)

const toast = ref<{ message: string; type?: 'success' | 'error' | 'info' } | null>(null)

const remaining = computed(() => name.value.trim().length)

const deleteDescription = computed(() =>
  toDelete.value
    ? `Kategori "${toDelete.value.name}" akan dihapus permanen. Pastikan tidak ada kursus yang masih memakainya.`
    : '',
)

function showToast(message: string, type: 'success' | 'error' | 'info' = 'success') {
  toast.value = { message, type }
}

async function onSubmit() {
  const trimmed = name.value.trim()
  if (!trimmed) {
    formError.value = 'Nama kategori wajib diisi dulu ya.'
    return
  }

  submitting.value = true
  formError.value = null
  formSuccess.value = null
  try {
    await addCategory({ name: trimmed, icon: icon.value })
    name.value = ''
    icon.value = ''
    formSuccess.value = 'Kategori berhasil ditambahkan. Mantap!'
    showToast('Kategori baru berhasil ditambahkan. Selamat berkarya!')
  } catch (err) {
    formError.value = err instanceof Error ? err.message : 'Terjadi kesalahan.'
  } finally {
    submitting.value = false
  }
}

function requestDelete(category: Category) {
  toDelete.value = category
  deleteError.value = null
}

async function confirmDelete() {
  const target = toDelete.value
  if (!target) return

  deleting.value = true
  deleteError.value = null
  try {
    await removeCategory(target.id)
    showToast('Kategori berhasil dihapus. Kursus Anda makin rapi!')
    toDelete.value = null
  } catch (err) {
    if (err instanceof ApiError && err.status === 400) {
      deleteError.value = `Kategori "${target.name}" masih dipakai oleh kursus. Hapus atau pindahkan kursusnya dulu ya.`
    } else {
      deleteError.value = err instanceof Error ? err.message : 'Terjadi kesalahan.'
    }
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-1">
      <h1 class="text-2xl font-bold text-heading">Kategori</h1>
      <p class="text-sm text-text-soft">Kelola kategori kursus di platform DevAcademy</p>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <BaseCard class="!p-6">
        <div class="flex items-center gap-2.5">
          <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary">
            <Plus :size="18" />
          </span>
          <div>
            <h2 class="font-semibold text-heading">Tambah Kategori</h2>
            <p class="text-sm text-text-soft">Buat kategori baru untuk mengelompokkan kursus</p>
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

          <div class="flex flex-col gap-1.5">
            <label for="category-icon" class="flex items-center gap-1 text-sm">
              Ikon
              <span class="text-xs text-text-soft">(Lucide)</span>
            </label>
            <IconPicker v-model="icon" />
          </div>

          <p v-if="formError" class="text-sm text-red-600">{{ formError }}</p>
          <p v-if="formSuccess" class="flex items-center gap-1.5 text-sm text-emerald-600">
            <Check :size="15" />
            {{ formSuccess }}
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
            <span
              class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary"
            >
              <component :is="resolveCategoryIcon(category.icon)" :size="16" />
            </span>
            <div class="min-w-0 flex-1">
              <p class="truncate font-medium text-heading">{{ category.name }}</p>
              <p class="truncate text-xs text-text-soft">
                {{ category.slug }} &middot; dibuat {{ formatDate(category.createdAt) }}
              </p>
            </div>
            <div class="flex shrink-0 items-center gap-1">
              <button
                type="button"
                class="rounded-md p-2 text-text-soft transition-colors hover:bg-red-50 hover:text-red-600"
                :aria-label="`Hapus kategori ${category.name}`"
                @click="requestDelete(category)"
              >
                <Trash2 :size="16" />
              </button>
            </div>
          </li>
        </ul>
      </BaseCard>
    </div>

    <BaseConfirmModal
      :model-value="toDelete != null"
      title="Hapus Kategori Ini?"
      :description="deleteDescription"
      confirm-text="Ya, Hapus"
      cancel-text="Batal"
      variant="danger"
      :loading="deleting"
      @update:model-value="(value) => { if (!value) toDelete = null }"
      @confirm="confirmDelete"
    >
      <p v-if="deleteError" class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
        {{ deleteError }}
      </p>
    </BaseConfirmModal>

    <BaseToast :toast="toast" @close="toast = null" />
  </div>
</template>
