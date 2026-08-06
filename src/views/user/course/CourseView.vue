<script setup lang="ts">
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Clock,
  GraduationCap,
  Play,
  Search,
  SlidersHorizontal,
  Star,
  Users,
} from '@lucide/vue'
import { RouterLink } from 'vue-router'
import { computed, ref, watch } from 'vue'

import BaseCard from '@/components/base/BaseCard.vue'
import { courses } from './courseData'

const categories = ['Semua', 'Programming', 'Design', 'Data', 'Business'] as const
const levels = ['Semua', 'Pemula', 'Menengah', 'Mahir'] as const
const PAGE_SIZE = 12

const selectedCategory = ref<(typeof categories)[number]>('Semua')
const selectedLevel = ref<(typeof levels)[number]>('Semua')
const searchQuery = ref('')
const currentPage = ref(1)

const filteredCourses = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  return courses.filter((course) => {
    const matchesCategory =
      selectedCategory.value === 'Semua' || course.category === selectedCategory.value
    const matchesLevel = selectedLevel.value === 'Semua' || course.level === selectedLevel.value
    const matchesSearch = query === '' || course.title.toLowerCase().includes(query)
    return matchesCategory && matchesLevel && matchesSearch
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredCourses.value.length / PAGE_SIZE)))

const paginatedCourses = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return filteredCourses.value.slice(start, start + PAGE_SIZE)
})

const pageItems = computed<Array<number | 'ellipsis'>>(() => {
  const total = totalPages.value
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1)

  const pages = new Set<number>([1, total, currentPage.value])
  for (let offset = -1; offset <= 1; offset++) {
    const page = currentPage.value + offset
    if (page >= 1 && page <= total) pages.add(page)
  }

  const sorted = [...pages].sort((a, b) => a - b)
  const items: Array<number | 'ellipsis'> = []
  sorted.forEach((page, index) => {
    if (index > 0 && page - (sorted[index - 1] ?? 0) > 1) items.push('ellipsis')
    items.push(page)
  })
  return items
})

watch([selectedCategory, selectedLevel, searchQuery], () => {
  currentPage.value = 1
})
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-1">
      <h1 class="text-2xl font-bold text-heading">Courses</h1>
      <p class="text-sm text-text-soft">Jelajahi dan pilih kelas yang sesuai minat Anda</p>
    </div>

    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="relative flex-1 sm:max-w-sm">
        <Search
          :size="16"
          class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-soft"
        />
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Cari course..."
          class="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-sm text-heading outline-none transition-colors placeholder:text-text-soft focus:border-primary"
        />
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <SlidersHorizontal :size="15" class="text-text-soft" />
        <button
          v-for="category in categories"
          :key="category"
          type="button"
          class="rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors"
          :class="
            selectedCategory === category
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-text-soft hover:bg-gray-200'
          "
          @click="selectedCategory = category"
        >
          {{ category }}
        </button>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-x-6 gap-y-3">
      <div class="flex flex-wrap items-center gap-2">
        <GraduationCap :size="15" class="text-text-soft" />
        <button
          v-for="level in levels"
          :key="level"
          type="button"
          class="rounded-md border px-3 py-1.5 text-sm font-medium transition-colors"
          :class="
            selectedLevel === level
              ? 'border-primary bg-primary-50 text-primary'
              : 'border-border text-text-soft hover:border-primary/40 hover:text-primary'
          "
          @click="selectedLevel = level"
        >
          {{ level }}
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      <BaseCard
        v-for="course in paginatedCourses"
        :key="course.id"
        class="group flex flex-col gap-4 p-5 transition-all hover:border-primary/40 hover:shadow-md justify-between"
      >
        <RouterLink :to="`/user/courses/${course.id}`" class="flex flex-col gap-4 no-underline">
          <div class="flex items-start justify-between">
            <span
              class="flex h-14 w-14 items-center justify-center rounded-xl text-white shadow-sm"
              :class="course.color"
            >
              <Play :size="22" class="transition-transform group-hover:scale-110" />
            </span>
            <div class="flex flex-col items-end gap-1">
              <span
                v-if="course.isEnrolled"
                class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600"
              >
                <BadgeCheck :size="13" />
                Dimiliki
              </span>
              <span class="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-text-soft">
                {{ course.level }}
              </span>
            </div>
          </div>

          <div class="flex flex-col gap-1">
            <p class="text-xs font-semibold uppercase tracking-wide text-text-soft">
              {{ course.category }}
            </p>
            <h3 class="font-semibold text-heading">{{ course.title }}</h3>
          </div>

          <p class="line-clamp-2 text-sm text-text-soft">{{ course.description }}</p>

          <div v-if="course.progress > 0">
            <div class="mb-1.5 flex items-center justify-between text-xs text-text-soft">
              <span>{{ course.progress }}% selesai</span>
            </div>
            <div class="h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                class="h-full rounded-full"
                :class="course.color"
                :style="{ width: `${course.progress}%` }"
              />
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-soft">
            <span class="inline-flex items-center gap-1">
              <BookOpen :size="15" />
              {{ course.modulesData.length }} modul
            </span>
            <span class="inline-flex items-center gap-1">
              <Clock :size="15" />
              {{ course.duration }}
            </span>
            <span class="inline-flex items-center gap-1">
              <Users :size="15" />
              {{ course.students }}
            </span>
            <span class="inline-flex items-center gap-1 text-amber-500">
              <Star :size="15" class="fill-amber-500" />
              {{ course.rating }}
            </span>
          </div>
        </RouterLink>

        <div class="flex items-center gap-2 border-t border-border pt-4">
          <span class="text-sm font-semibold text-heading">{{ course.price }}</span>
          <RouterLink
            :to="`/user/courses/${course.id}`"
            class="ml-auto inline-flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white no-underline transition-opacity hover:opacity-90"
          >
            Detail
            <ArrowRight :size="16" />
          </RouterLink>
        </div>
      </BaseCard>
    </div>

    <div v-if="filteredCourses.length === 0" class="py-16 text-center">
      <p class="font-semibold text-heading">Course tidak ditemukan</p>
      <p class="mt-1 text-sm text-text-soft">Coba ubah kata kunci atau kategori yang dipilih.</p>
    </div>

    <div v-if="totalPages > 1" class="mt-2 flex flex-wrap items-center justify-center gap-1.5">
      <button
        type="button"
        class="flex h-9 w-9 items-center justify-center rounded-md border border-border text-text-soft transition-colors hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
        :disabled="currentPage === 1"
        @click="currentPage--"
      >
        <ChevronLeft :size="16" />
      </button>

      <template v-for="(item, index) in pageItems" :key="`${item}-${index}`">
        <span v-if="item === 'ellipsis'" class="px-1 text-text-soft">&hellip;</span>
        <button
          v-else
          type="button"
          class="h-9 min-w-9 rounded-md border px-3 text-sm font-medium transition-colors"
          :class="
            item === currentPage
              ? 'border-primary bg-primary text-white'
              : 'border-border text-text-soft hover:border-primary/40 hover:text-primary'
          "
          @click="currentPage = item"
        >
          {{ item }}
        </button>
      </template>

      <button
        type="button"
        class="flex h-9 w-9 items-center justify-center rounded-md border border-border text-text-soft transition-colors hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
        :disabled="currentPage === totalPages"
        @click="currentPage++"
      >
        <ChevronRight :size="16" />
      </button>
    </div>
  </div>
</template>
