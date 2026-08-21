<script setup lang="ts">
import {
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  Clock,
  FileText,
  GraduationCap,
  ListChecks,
  MonitorPlay,
  Play,
  Sparkles,
  Users,
} from '@lucide/vue'
import { RouterLink, useRoute } from 'vue-router'
import { computed, onMounted, ref } from 'vue'

import { courseApi } from '@/api/modules/course'
import { getCategories } from '@/api/modules/category'
import { ApiError } from '@/api/http'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseCard from '@/components/base/BaseCard.vue'
import type { Course, CourseDetail } from '@/models/course'
import type { CourseLesson, Lesson } from '@/models/lesson'
import { formatMinutes, formatRupiah } from '@/utils/formatters'

const route = useRoute()

type LessonKind = 'video' | 'quiz' | 'assignment' | 'article'

const LESSON_ICONS = {
  video: MonitorPlay,
  quiz: ListChecks,
  assignment: FileText,
  article: BookOpen,
} as const

function lessonKind(lesson: Lesson | CourseLesson): LessonKind {
  if (lesson.video_url) return 'video'
  if (lesson.quiz) return 'quiz'
  if (lesson.assignment) return 'assignment'
  return 'article'
}

const course = ref<CourseDetail | null>(null)
const categoryName = ref('')
const relatedCourses = ref<Course[]>([])
const loading = ref(true)
const loadError = ref<string | null>(null)
const openSections = ref<Set<string>>(new Set())

const totalLessons = computed(() =>
  course.value
    ? course.value.sections.reduce((total, section) => total + section.lessons.length, 0)
    : 0,
)

const displayedPrice = computed(() => {
  const price = course.value?.price ?? 0
  return price > 0 ? formatRupiah(price) : 'Gratis'
})

function toggleSection(sectionId: string) {
  const next = new Set(openSections.value)
  if (next.has(sectionId)) next.delete(sectionId)
  else next.add(sectionId)
  openSections.value = next
}

async function load() {
  loading.value = true
  loadError.value = null
  try {
    const id = String(route.params.id ?? '')
    const [data, categories, allCourses] = await Promise.all([
      courseApi.getDetail(id),
      getCategories().catch(() => []),
      courseApi.list().catch(() => []),
    ])
    course.value = data
    categoryName.value = categories.find((category) => category.id === data.category_id)?.name ?? ''
    relatedCourses.value = allCourses.filter((item) => item.id !== id).slice(0, 3)
  } catch (error) {
    console.error('[course-detail] Gagal memuat course.', error)
    loadError.value =
      error instanceof ApiError && error.status === 404
        ? 'Course tidak ditemukan.'
        : 'Gagal memuat detail course.'
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <div class="flex flex-col gap-6">
    <RouterLink
      to="/user/courses"
      class="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-text-soft no-underline transition-colors hover:text-primary"
    >
      <ArrowLeft :size="16" />
      Kembali ke Courses
    </RouterLink>

    <div v-if="loading" class="flex flex-col gap-6">
      <div class="h-56 animate-pulse rounded-2xl bg-gray-200/70" />
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div class="flex flex-col gap-6 lg:col-span-2">
          <div class="h-40 animate-pulse rounded-lg bg-gray-200/70" />
          <div class="h-72 animate-pulse rounded-lg bg-gray-200/70" />
        </div>
        <div class="h-96 animate-pulse rounded-lg bg-gray-200/70" />
      </div>
    </div>

    <div v-else-if="loadError" class="flex flex-col items-center gap-3 py-20 text-center">
      <span
        class="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-text-soft"
      >
        <CircleAlert :size="26" />
      </span>
      <p class="font-semibold text-heading">{{ loadError }}</p>
      <p class="text-sm text-text-soft">Course tidak dapat dimuat saat ini.</p>
      <BaseButton variant="secondary" class="mt-2" @click="load">Coba Lagi</BaseButton>
    </div>

    <template v-else-if="course">
      <section
        class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500 p-8 text-white shadow-lg"
      >
        <div
          class="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl"
        />
        <div
          class="pointer-events-none absolute -bottom-20 right-24 h-40 w-40 rounded-full bg-white/10 blur-xl"
        />

        <div class="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div class="flex max-w-2xl flex-col gap-3">
            <div class="flex flex-wrap items-center gap-2">
              <span class="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur">
                {{ categoryName || '—' }}
              </span>
              <span class="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur">
                {{ course.level?.name ?? '—' }}
              </span>
              <span
                class="rounded-full px-3 py-1 text-xs font-semibold backdrop-blur"
                :class="course.status === 'published' ? 'bg-emerald-400/90' : 'bg-white/20'"
              >
                {{ course.status === 'published' ? 'Terbit' : 'Draft' }}
              </span>
            </div>

            <h1 class="text-3xl font-bold">{{ course.title }}</h1>
            <p class="text-sm text-white/90">{{ course.description }}</p>

            <div class="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/90">
              <span class="inline-flex items-center gap-1.5">
                <GraduationCap :size="15" />
                {{ course.level?.name ?? '—' }}
              </span>
              <span class="inline-flex items-center gap-1.5">
                <Clock :size="15" />
                {{ course.duration > 0 ? formatMinutes(course.duration) : '—' }}
              </span>
              <span class="inline-flex items-center gap-1.5">
                <ListChecks :size="15" />
                {{ totalLessons }} pelajaran
              </span>
              <span class="inline-flex items-center gap-1.5">
                <Users :size="15" />
                {{ displayedPrice }}
              </span>
            </div>
          </div>

          <img
            v-if="course.thumbnail"
            :src="course.thumbnail"
            :alt="course.title"
            class="h-48 w-full max-w-sm shrink-0 rounded-xl object-cover shadow-md lg:w-64"
          />
          <span
            v-else
            class="flex h-48 w-full max-w-sm shrink-0 items-center justify-center rounded-xl bg-white/10 backdrop-blur lg:w-64"
          >
            <BookOpen :size="40" class="text-white/70" />
          </span>
        </div>
      </section>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div class="flex flex-col gap-6 lg:col-span-2">
          <BaseCard class="!p-6">
            <div class="flex items-center gap-2">
              <Sparkles :size="18" class="text-primary" />
              <h2 class="text-lg font-semibold text-heading">Tentang Course</h2>
            </div>
            <p class="mt-3 text-sm leading-relaxed text-text">
              {{ course.description || 'Deskripsi course belum tersedia.' }}
            </p>
          </BaseCard>

          <BaseCard class="!p-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <BookOpen :size="18" class="text-primary" />
                <h2 class="text-lg font-semibold text-heading">Kurikulum</h2>
              </div>
              <p class="text-sm text-text-soft">{{ course.sections.length }} section</p>
            </div>

            <div v-if="course.sections.length > 0" class="mt-5 flex flex-col gap-4">
              <div
                v-for="(section, sectionIndex) in course.sections"
                :key="section.id ?? sectionIndex"
                class="overflow-hidden rounded-lg border border-border"
              >
                <button
                  type="button"
                  class="flex w-full items-center gap-3 bg-gray-50 px-4 py-3.5 text-left transition-colors hover:bg-gray-100"
                  @click="toggleSection(section.id ?? String(sectionIndex))"
                >
                  <ChevronDown
                    :size="18"
                    class="shrink-0 text-text-soft transition-transform"
                    :class="
                      openSections.has(section.id ?? String(sectionIndex)) ? 'rotate-180' : ''
                    "
                  />
                  <span class="text-sm font-semibold text-heading">
                    Section {{ sectionIndex + 1 }}: {{ section.title }}
                  </span>
                  <span class="ml-auto text-xs text-text-soft">
                    {{ section.lessons.length }} pelajaran
                  </span>
                </button>

                <div
                  v-if="openSections.has(section.id ?? String(sectionIndex))"
                  class="flex flex-col"
                >
                  <div
                    v-for="lesson in section.lessons"
                    :key="lesson.id ?? lesson.title"
                    class="flex items-center gap-3 border-t border-border px-4 py-3"
                  >
                    <component
                      :is="LESSON_ICONS[lessonKind(lesson)]"
                      :size="16"
                      class="shrink-0 text-text-soft"
                    />
                    <span class="min-w-0 flex-1 truncate text-sm text-text">{{
                      lesson.title
                    }}</span>
                    <span
                      v-if="lesson.is_preview"
                      class="rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary"
                    >
                      Preview
                    </span>
                    <span class="inline-flex shrink-0 items-center gap-1 text-xs text-text-soft">
                      <Clock :size="13" />
                      {{ lesson.duration > 0 ? formatMinutes(lesson.duration) : '—' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div
              v-else
              class="mt-5 rounded-lg border border-dashed border-border py-10 text-center"
            >
              <p class="text-sm font-medium text-heading">Kurikulum belum tersedia</p>
              <p class="mt-1 text-xs text-text-soft">
                Section dan pelajaran belum ditambahkan oleh mentor.
              </p>
            </div>
          </BaseCard>
        </div>

        <div class="flex flex-col gap-6">
          <BaseCard class="!p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs text-text-soft">Harga Course</p>
                <p class="text-2xl font-bold text-heading">{{ displayedPrice }}</p>
              </div>
              <Award :size="24" class="text-amber-500" />
            </div>
            <ul class="mt-4 flex flex-col gap-2">
              <li class="flex items-center gap-2 text-sm text-text">
                <CheckCircle2 :size="16" class="shrink-0 text-emerald-500" />
                Akses penuh seluruh materi
              </li>
              <li class="flex items-center gap-2 text-sm text-text">
                <CheckCircle2 :size="16" class="shrink-0 text-emerald-500" />
                Quiz dan tugas di setiap modul
              </li>
              <li class="flex items-center gap-2 text-sm text-text">
                <CheckCircle2 :size="16" class="shrink-0 text-emerald-500" />
                Sertifikat penyelesaian
              </li>
            </ul>
            <BaseButton class="mt-5 w-full">
              <Play :size="16" />
              Daftar Kursus
            </BaseButton>
          </BaseCard>

          <BaseCard class="!p-6">
            <h3 class="font-semibold text-heading">Informasi Course</h3>
            <dl class="mt-4 flex flex-col divide-y divide-border text-sm">
              <div class="flex items-center justify-between py-2.5">
                <dt class="text-text-soft">Level</dt>
                <dd class="font-medium text-heading">
                  {{ course.level?.name ?? '—' }}
                </dd>
              </div>
              <div class="flex items-center justify-between py-2.5">
                <dt class="text-text-soft">Kategori</dt>
                <dd class="font-medium text-heading">{{ categoryName || '—' }}</dd>
              </div>
              <div class="flex items-center justify-between py-2.5">
                <dt class="text-text-soft">Durasi</dt>
                <dd class="font-medium text-heading">
                  {{ course.duration > 0 ? formatMinutes(course.duration) : '—' }}
                </dd>
              </div>
              <div class="flex items-center justify-between py-2.5">
                <dt class="text-text-soft">Total Pelajaran</dt>
                <dd class="font-medium text-heading">{{ totalLessons }}</dd>
              </div>
            </dl>
          </BaseCard>

          <BaseCard v-if="relatedCourses.length > 0" class="!p-6">
            <h3 class="font-semibold text-heading">Kursus Lainnya</h3>
            <div class="mt-4 flex flex-col gap-3">
              <RouterLink
                v-for="related in relatedCourses"
                :key="related.id"
                :to="`/user/courses/${related.id}`"
                class="group flex items-center gap-3 rounded-lg border border-border p-3 no-underline transition-colors hover:border-primary/40"
              >
                <span
                  class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary"
                >
                  <BookOpen :size="16" />
                </span>
                <div class="min-w-0">
                  <p class="truncate text-sm font-medium text-heading">{{ related.title }}</p>
                  <p class="text-xs text-text-soft">
                    {{ related.price > 0 ? formatRupiah(related.price) : 'Gratis' }}
                  </p>
                </div>
              </RouterLink>
            </div>
          </BaseCard>
        </div>
      </div>
    </template>
  </div>
</template>
