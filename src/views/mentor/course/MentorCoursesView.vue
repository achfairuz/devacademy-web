<script setup lang="ts">
import {
  BookOpen,
  CircleAlert,
  Layers,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Star,
  Trash2,
  Users,
} from '@lucide/vue'
import { RouterLink } from 'vue-router'
import { computed, ref } from 'vue'

import BaseButton from '@/components/base/BaseButton.vue'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseConfirmModal from '@/components/base/BaseConfirmModal.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseModal from '@/components/base/BaseModal.vue'
import BaseToast from '@/components/base/BaseToast.vue'
import BaseToggle from '@/components/base/BaseToggle.vue'

type CourseStatus = 'published' | 'draft'

interface MentorCourse {
  id: string
  title: string
  category: string
  level: 'Pemula' | 'Menengah' | 'Mahir'
  students: number
  rating: number
  status: CourseStatus
  price: string
  color: string
}

const courses = ref<MentorCourse[]>([
  {
    id: 'js-fundamental',
    title: 'Fundamental JavaScript',
    category: 'Programming',
    level: 'Pemula',
    students: 48,
    rating: 4.9,
    status: 'published',
    price: 'Rp 199.000',
    color: 'bg-primary-500',
  },
  {
    id: 'ui-ux-dasar',
    title: 'UI/UX Design Dasar',
    category: 'Design',
    level: 'Menengah',
    students: 35,
    rating: 4.8,
    status: 'published',
    price: 'Rp 249.000',
    color: 'bg-secondary-500',
  },
  {
    id: 'database-sql',
    title: 'Database & SQL',
    category: 'Data',
    level: 'Pemula',
    students: 21,
    rating: 5.0,
    status: 'draft',
    price: 'Rp 179.000',
    color: 'bg-emerald-500',
  },
  {
    id: 'react-modern',
    title: 'React JS Modern',
    category: 'Programming',
    level: 'Mahir',
    students: 0,
    rating: 0,
    status: 'draft',
    price: 'Rp 299.000',
    color: 'bg-blue-500',
  },
])

const searchQuery = ref('')
const statusFilter = ref<'all' | CourseStatus>('all')

const filteredCourses = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  return courses.value.filter((course) => {
    const matchesSearch =
      query === '' ||
      course.title.toLowerCase().includes(query) ||
      course.category.toLowerCase().includes(query)
    const matchesStatus = statusFilter.value === 'all' || course.status === statusFilter.value
    return matchesSearch && matchesStatus
  })
})

const stats = computed(() => [
  { label: 'Total Kelas', value: courses.value.length },
  { label: 'Kelas Terbit', value: courses.value.filter((c) => c.status === 'published').length },
  { label: 'Draft', value: courses.value.filter((c) => c.status === 'draft').length },
  {
    label: 'Total Siswa',
    value: courses.value.reduce((sum, course) => sum + course.students, 0),
  },
])

const statusTabs = [
  { label: 'Semua', value: 'all' },
  { label: 'Terbit', value: 'published' },
  { label: 'Draft', value: 'draft' },
] as const

function toggleStatus(id: string) {
  const course = courses.value.find((item) => item.id === id)
  if (!course) return
  course.status = course.status === 'published' ? 'draft' : 'published'
}

const isAddModalOpen = ref(false)
const editingCourse = ref<MentorCourse | null>(null)
const addForm = ref({
  title: '',
  category: '',
  level: 'Pemula' as MentorCourse['level'],
  price: '',
})
const addError = ref<string | null>(null)

const toDelete = ref<MentorCourse | null>(null)
const toast = ref<{ message: string; type?: 'success' | 'error' | 'info' } | null>(null)

const courseColors = ['bg-primary-500', 'bg-secondary-500', 'bg-emerald-500', 'bg-blue-500', 'bg-amber-500']

const courseModalTitle = computed(() => (editingCourse.value ? 'Edit Kelas' : 'Tambah Kelas'))
const courseModalDescription = computed(() =>
  editingCourse.value
    ? 'Perbarui informasi kelas ini agar tetap relevan dan menarik.'
    : 'Lengkapi informasi kelas baru untuk Anda kelola.',
)
const deleteCourseDescription = computed(() =>
  toDelete.value
    ? `Kelas "${toDelete.value.title}" beserta seluruh materinya akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.`
    : '',
)

function showToast(message: string, type: 'success' | 'error' | 'info' = 'success') {
  toast.value = { message, type }
}

function openAddModal() {
  editingCourse.value = null
  addError.value = null
  addForm.value = { title: '', category: '', level: 'Pemula', price: '' }
  isAddModalOpen.value = true
}

function openEditModal(course: MentorCourse) {
  editingCourse.value = course
  addError.value = null
  addForm.value = {
    title: course.title,
    category: course.category,
    level: course.level,
    price: course.price,
  }
  isAddModalOpen.value = true
}

function submitCourse() {
  if (!addForm.value.title.trim() || !addForm.value.category.trim() || !addForm.value.price.trim()) {
    addError.value = 'Lengkapi semua kolom terlebih dahulu ya.'
    return
  }

  if (editingCourse.value) {
    const course = courses.value.find((item) => item.id === editingCourse.value?.id)
    if (course) {
      course.title = addForm.value.title.trim()
      course.category = addForm.value.category.trim()
      course.level = addForm.value.level
      course.price = addForm.value.price.trim()
    }
    showToast('Kelas berhasil diperbarui. Tetap semangat mengajar!')
  } else {
    courses.value.unshift({
      id: `course-${Date.now()}`,
      title: addForm.value.title.trim(),
      category: addForm.value.category.trim(),
      level: addForm.value.level,
      students: 0,
      rating: 0,
      status: 'draft',
      price: addForm.value.price.trim(),
      color: courseColors[courses.value.length % courseColors.length] ?? 'bg-primary-500',
    })
    showToast('Kelas baru berhasil dibuat. Selamat mengajar!')
  }
  isAddModalOpen.value = false
}

function requestDelete(course: MentorCourse) {
  toDelete.value = course
}

function confirmDelete() {
  if (!toDelete.value) return
  const target = toDelete.value
  courses.value = courses.value.filter((course) => course.id !== target.id)
  showToast(`Kelas "${target.title}" berhasil dihapus.`)
  toDelete.value = null
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex flex-col gap-1">
        <h1 class="text-2xl font-bold text-heading">Kelas</h1>
        <p class="text-sm text-text-soft">Kelola kelas yang Anda buat dan terbitkan</p>
      </div>

      <div class="flex items-center gap-2">
        <RouterLink
          to="/mentor/categories"
          class="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-text no-underline transition-colors hover:border-primary/40 hover:text-primary"
        >
          <Layers :size="16" />
          Kategori
        </RouterLink>
        <BaseButton @click="openAddModal">
          <Plus :size="16" />
          Tambah Kelas
        </BaseButton>
      </div>
    </div>

    <section class="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <BaseCard v-for="stat in stats" :key="stat.label" class="flex items-center gap-3 !p-5">
        <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary">
          <BookOpen :size="18" />
        </span>
        <div class="min-w-0">
          <p class="truncate text-xl font-bold text-heading">{{ stat.value }}</p>
          <p class="truncate text-sm text-text-soft">{{ stat.label }}</p>
        </div>
      </BaseCard>
    </section>

    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="relative flex-1 sm:max-w-xs">
        <Search
          :size="16"
          class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-soft"
        />
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Cari kelas..."
          class="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-sm text-heading outline-none transition-colors placeholder:text-text-soft focus:border-primary"
        />
      </div>

      <div class="flex items-center gap-1 rounded-full bg-gray-100 p-1">
        <button
          v-for="tab in statusTabs"
          :key="tab.value"
          type="button"
          class="rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
          :class="
            statusFilter === tab.value ? 'bg-white text-text shadow-sm' : 'text-text-soft'
          "
          @click="statusFilter = tab.value"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <BaseCard class="overflow-hidden !p-0">
      <div class="overflow-x-auto">
        <table class="w-full min-w-[720px] text-sm">
          <thead>
            <tr class="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-text-soft">
              <th class="px-5 py-3.5">Kelas</th>
              <th class="px-5 py-3.5">Level</th>
              <th class="px-5 py-3.5">Siswa</th>
              <th class="px-5 py-3.5">Rating</th>
              <th class="px-5 py-3.5">Status</th>
              <th class="px-5 py-3.5">Harga</th>
              <th class="px-5 py-3.5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="course in filteredCourses"
              :key="course.id"
              class="border-b border-border last:border-0 hover:bg-gray-50/70"
            >
              <td class="px-5 py-4">
                <div class="flex items-center gap-3">
                  <span
                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white"
                    :class="course.color"
                  >
                    <BookOpen :size="18" />
                  </span>
                  <div class="min-w-0">
                    <p class="truncate font-semibold text-heading">{{ course.title }}</p>
                    <p class="truncate text-xs text-text-soft">{{ course.category }}</p>
                  </div>
                </div>
              </td>
              <td class="px-5 py-4">
                <span class="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-text-soft">
                  {{ course.level }}
                </span>
              </td>
              <td class="px-5 py-4">
                <span class="inline-flex items-center gap-1 text-text-soft">
                  <Users :size="14" />
                  {{ course.students }}
                </span>
              </td>
              <td class="px-5 py-4">
                <span
                  v-if="course.rating > 0"
                  class="inline-flex items-center gap-1 text-amber-500"
                >
                  <Star :size="14" class="fill-amber-500" />
                  {{ course.rating }}
                </span>
                <span v-else class="text-xs text-text-soft/70">Belum ada</span>
              </td>
              <td class="px-5 py-4">
                <div class="flex items-center gap-2">
                  <BaseToggle
                    :model-value="course.status === 'published'"
                    size="sm"
                    @update:model-value="toggleStatus(course.id)"
                  />
                  <span
                    class="text-xs font-medium"
                    :class="course.status === 'published' ? 'text-emerald-600' : 'text-text-soft'"
                  >
                    {{ course.status === 'published' ? 'Terbit' : 'Draft' }}
                  </span>
                </div>
              </td>
              <td class="px-5 py-4 font-medium text-heading">{{ course.price }}</td>
              <td class="px-5 py-4">
                <div class="flex items-center justify-end gap-1">
                  <button
                    type="button"
                    class="rounded-md p-2 text-text-soft transition-colors hover:bg-gray-100 hover:text-heading"
                    :aria-label="`Detail ${course.title}`"
                  >
                    <MoreHorizontal :size="16" />
                  </button>
                  <button
                    type="button"
                    class="rounded-md p-2 text-text-soft transition-colors hover:bg-primary-50 hover:text-primary"
                    :aria-label="`Edit ${course.title}`"
                    @click="openEditModal(course)"
                  >
                    <Pencil :size="16" />
                  </button>
                  <button
                    type="button"
                    class="rounded-md p-2 text-text-soft transition-colors hover:bg-red-50 hover:text-red-600"
                    :aria-label="`Hapus ${course.title}`"
                    @click="requestDelete(course)"
                  >
                    <Trash2 :size="16" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredCourses.length === 0" class="flex flex-col items-center gap-2 py-16 text-center">
        <CircleAlert :size="36" class="text-text-soft" />
        <p class="font-semibold text-heading">Kelas tidak ditemukan</p>
        <p class="text-sm text-text-soft">Coba ubah kata kunci atau filter yang dipilih.</p>
      </div>
    </BaseCard>

    <BaseModal
      v-model="isAddModalOpen"
      :title="courseModalTitle"
      :description="courseModalDescription"
      size="md"
    >
      <form id="add-course-form" class="flex flex-col gap-4" @submit.prevent="submitCourse">
        <BaseInput
          id="course-title"
          v-model="addForm.title"
          label="Judul Kelas"
          placeholder="cth: Fundamental JavaScript"
          required
        />
        <BaseInput
          id="course-category"
          v-model="addForm.category"
          label="Kategori"
          placeholder="cth: Programming"
          required
        />
        <div class="flex flex-col gap-1.5">
          <span class="text-sm">Level</span>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="option in ['Pemula', 'Menengah', 'Mahir'] as const"
              :key="option"
              type="button"
              class="rounded-md border px-3.5 py-2 text-sm font-medium transition-colors"
              :class="
                addForm.level === option
                  ? 'border-primary bg-primary-50 text-primary'
                  : 'border-border text-text-soft hover:border-primary/40 hover:text-primary'
              "
              @click="addForm.level = option"
            >
              {{ option }}
            </button>
          </div>
        </div>
        <BaseInput
          id="course-price"
          v-model="addForm.price"
          label="Harga"
          placeholder="cth: Rp 199.000"
          required
        />
        <p v-if="addError" class="text-sm text-red-600">{{ addError }}</p>
      </form>

      <template #footer>
        <BaseButton
          type="button"
          variant="secondary"
          class="!bg-gray-100 !text-text"
          @click="isAddModalOpen = false"
        >
          Batal
        </BaseButton>
        <BaseButton type="submit" form="add-course-form">
          <component :is="editingCourse ? Pencil : Plus" :size="16" />
          {{ editingCourse ? 'Simpan Perubahan' : 'Simpan Kelas' }}
        </BaseButton>
      </template>
    </BaseModal>

    <BaseConfirmModal
      :model-value="toDelete != null"
      title="Hapus Kelas Ini?"
      :description="deleteCourseDescription"
      confirm-text="Ya, Hapus Kelas"
      cancel-text="Batal"
      variant="danger"
      @update:model-value="(value) => { if (!value) toDelete = null }"
      @confirm="confirmDelete"
    />

    <BaseToast :toast="toast" @close="toast = null" />
  </div>
</template>
