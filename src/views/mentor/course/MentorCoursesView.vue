<script setup lang="ts">
import {
  BookOpen,
  CircleAlert,
  Layers,
  MoreHorizontal,
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

function removeCourse(id: string) {
  courses.value = courses.value.filter((course) => course.id !== id)
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
        <BaseButton>
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
                    class="rounded-md p-2 text-text-soft transition-colors hover:bg-red-50 hover:text-red-600"
                    :aria-label="`Hapus ${course.title}`"
                    @click="removeCourse(course.id)"
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
  </div>
</template>
