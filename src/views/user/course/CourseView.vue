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
  Users,
} from '@lucide/vue'
import { RouterLink } from 'vue-router'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import BaseCard from '@/components/base/BaseCard.vue'
import BaseSpinner from '@/components/base/BaseSpinner.vue'
import { useCategories } from '@/hooks/category/useCategories'
import { useCourses } from '@/hooks/course/useCourses'
import { useLevel } from '@/hooks/level/useLevel'
import { buildPageItems } from '@/utils/pagination'
import { formatMinutes, formatRupiah } from '@/utils/formatters'

const PAGE_SIZE = 12

const { categories } = useCategories()
const { levels } = useLevel()
const { coursesCard, cardMeta, loading, error, loadCard } = useCourses()

const searchQuery = ref('')
const selectedCategory = ref<string>('all')
const selectedLevel = ref<string>('all')
const currentPage = ref(1)

const categoryOptions = computed(() => [
  { slug: 'all', name: 'Semua' },
  ...categories.value.map((category) => ({ slug: category.slug, name: category.name })),
])
const levelOptions = computed(() => [
  { slug: 'all', name: 'Semua' },
  ...levels.value.map((level) => ({ slug: level.slug, name: level.name })),
])

const totalPages = computed(() => Math.max(1, cardMeta.value.total_pages))
const isEmpty = computed(() => !loading.value && !error.value && coursesCard.value.length === 0)

function fetchCards() {
  loadCard({
    page: currentPage.value,
    pageSize: PAGE_SIZE,
    search: searchQuery.value,
    category: selectedCategory.value === 'all' ? undefined : selectedCategory.value,
    level: selectedLevel.value === 'all' ? undefined : selectedLevel.value,
  })
}

let searchTimer: ReturnType<typeof setTimeout> | undefined
watch(searchQuery, () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    currentPage.value = 1
    fetchCards()
  }, 300)
})

watch([selectedCategory, selectedLevel], () => {
  currentPage.value = 1
  fetchCards()
})

watch(currentPage, fetchCards)

onMounted(fetchCards)

onBeforeUnmount(() => clearTimeout(searchTimer))

const pageItems = computed(() => buildPageItems(currentPage.value, totalPages.value))
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-1">
      <h1 class="text-2xl font-bold text-heading">Courses</h1>
      <p class="text-sm text-text-soft">Jelajahi dan pilih kursus yang sesuai minat Anda</p>
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

      <div class="flex items-center gap-2">
        <SlidersHorizontal :size="15" class="shrink-0 text-text-soft" />
        <div class="relative min-w-0 flex-1">
          <div
            class="flex items-center gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <button
              v-for="category in categoryOptions"
              :key="category.slug"
              type="button"
              class="shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors"
              :class="
                selectedCategory === category.slug
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-text-soft hover:bg-gray-200'
              "
              @click="selectedCategory = category.slug"
            >
              {{ category.name }}
            </button>
          </div>
          <div
            class="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent"
          />
        </div>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-x-6 gap-y-3">
      <div class="flex flex-wrap items-center gap-2">
        <GraduationCap :size="15" class="text-text-soft" />
        <button
          v-for="level in levelOptions"
          :key="level.slug"
          type="button"
          class="rounded-md border px-3 py-1.5 text-sm font-medium transition-colors"
          :class="
            selectedLevel === level.slug
              ? 'border-primary bg-primary-50 text-primary'
              : 'border-border text-text-soft hover:border-primary/40 hover:text-primary'
          "
          @click="selectedLevel = level.slug"
        >
          {{ level.name }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="flex items-center justify-center gap-2 py-16 text-text-soft">
      <BaseSpinner />
      <span class="text-sm">Memuat course...</span>
    </div>

    <div v-else-if="error" class="py-16 text-center">
      <p class="font-semibold text-heading">Gagal memuat course</p>
      <p class="mt-1 text-sm text-text-soft">{{ error }}</p>
      <button
        type="button"
        class="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        @click="fetchCards"
      >
        Coba Lagi
      </button>
    </div>

    <template v-else>
      <div class="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        <BaseCard
          v-for="course in coursesCard"
          :key="course.id"
          class="group flex flex-col gap-4 p-5 transition-all hover:border-primary/40 hover:shadow-md justify-between"
        >
          <RouterLink :to="`/user/courses/${course.id}`" class="flex flex-col gap-4 no-underline">
            <div class="flex items-start justify-between">
              <img
                v-if="course.thumbnail"
                :src="course.thumbnail"
                :alt="course.title"
                class="h-14 w-14 rounded-xl object-cover shadow-sm transition-transform group-hover:scale-105"
              />
              <span
                v-else
                class="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-50 text-primary shadow-sm"
              >
                <Play :size="22" class="transition-transform group-hover:scale-110" />
              </span>
              <div class="flex flex-col items-end gap-1">
                <span
                  v-if="course.progress > 0"
                  class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600"
                >
                  <BadgeCheck :size="13" />
                  Dimiliki
                </span>
                <span
                  v-if="course.level"
                  class="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-text-soft"
                >
                  {{ course.level.name }}
                </span>
              </div>
            </div>

            <div class="flex flex-col gap-1">
              <p class="text-xs font-semibold uppercase tracking-wide text-text-soft">
                {{ course.category?.name }}
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
                  class="h-full rounded-full bg-primary"
                  :style="{ width: `${course.progress}%` }"
                />
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-soft">
              <span class="inline-flex items-center gap-1">
                <BookOpen :size="15" />
                {{ course.total_modules }} modul
              </span>
              <span class="inline-flex items-center gap-1">
                <Clock :size="15" />
                {{ formatMinutes(course.duration) }}
              </span>
              <span class="inline-flex items-center gap-1">
                <Users :size="15" />
                {{ course.total_bought }}
              </span>
            </div>
          </RouterLink>

          <div class="flex items-center gap-2 border-t border-border pt-4">
            <span class="text-sm font-semibold text-heading">{{ formatRupiah(course.price) }}</span>
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

      <div v-if="isEmpty" class="py-16 text-center">
        <p class="font-semibold text-heading">Course tidak ditemukan</p>
        <p class="mt-1 text-sm text-text-soft">Coba ubah kata kunci atau kategori yang dipilih.</p>
      </div>

      <div v-if="totalPages > 1" class="mt-2 flex flex-wrap items-center justify-center gap-1.5">
        <button
          type="button"
          class="flex h-9 w-9 items-center justify-center rounded-md border border-border text-text-soft transition-colors hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
          :disabled="currentPage === 1 || loading"
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
            :disabled="loading"
            @click="currentPage = item"
          >
            {{ item }}
          </button>
        </template>

        <button
          type="button"
          class="flex h-9 w-9 items-center justify-center rounded-md border border-border text-text-soft transition-colors hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
          :disabled="currentPage === totalPages || loading"
          @click="currentPage++"
        >
          <ChevronRight :size="16" />
        </button>
      </div>
    </template>
  </div>
</template>
