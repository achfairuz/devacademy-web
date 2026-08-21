<script setup lang="ts">
import {
  ArrowLeft,
  BookOpen,
  CalendarClock,
  CircleAlert,
  Clock,
  FileText,
  GraduationCap,
  Layers,
  ListChecks,
  Pencil,
  Sparkles,
  Tag,
  User,
} from '@lucide/vue'
import { RouterLink, useRoute } from 'vue-router'
import { computed, onMounted, ref } from 'vue'

import BaseButton from '@/components/base/BaseButton.vue'
import BaseCard from '@/components/base/BaseCard.vue'
import { useCourseDetail } from '@/hooks/course/useCourseDetail'
import { formatDate, formatMinutes, formatRupiah } from '@/utils/formatters'

const route = useRoute()

const { course, loading, loadError, load } = useCourseDetail()
const openSections = ref<Set<string>>(new Set())

const LEVEL_LABELS: Record<string, string> = {
  beginner: 'Pemula',
  intermediate: 'Menengah',
  advanced: 'Mahir',
}

const totalLessons = computed(() =>
  course.value
    ? course.value.sections.reduce((total, section) => total + section.lessons.length, 0)
    : 0,
)

const totalQuizzes = computed(() =>
  course.value
    ? course.value.sections.reduce(
        (total, section) => total + section.lessons.filter((lesson) => lesson.quiz != null).length,
        0,
      )
    : 0,
)

const totalAssignments = computed(() =>
  course.value
    ? course.value.sections.reduce(
        (total, section) =>
          total + section.lessons.filter((lesson) => lesson.assignment != null).length,
        0,
      )
    : 0,
)

function toggleSection(sectionId: string) {
  const next = new Set(openSections.value)
  if (next.has(sectionId)) next.delete(sectionId)
  else next.add(sectionId)
  openSections.value = next
}

onMounted(() => {
  load(String(route.params.id ?? ''))
})
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <RouterLink
        to="/mentor/courses"
        class="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-text-soft no-underline transition-colors hover:text-primary"
      >
        <ArrowLeft :size="16" />
        Kembali ke Kursus
      </RouterLink>
      <RouterLink
        v-if="course"
        :to="`/mentor/courses/${course.id}/edit`"
        class="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white no-underline transition-colors hover:bg-primary-600"
      >
        <Pencil :size="16" />
        Edit Course
      </RouterLink>
    </div>

    <div v-if="loading" class="flex flex-col gap-6">
      <div class="h-44 animate-pulse rounded-2xl bg-gray-200/70" />
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div class="h-96 animate-pulse rounded-lg bg-gray-200/70 lg:col-span-2" />
        <div class="h-80 animate-pulse rounded-lg bg-gray-200/70" />
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
      <BaseButton variant="secondary" class="mt-2" @click="load(String(route.params.id ?? ''))"
        >Coba Lagi</BaseButton
      >
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
                {{ course.category?.name ?? '—' }}
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
                <User :size="15" />
                {{ course.mentor?.full_name ?? '—' }}
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
                <Tag :size="15" />
                {{ course.price > 0 ? formatRupiah(course.price) : 'Gratis' }}
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
              <p class="text-sm text-text-soft">
                {{ course.sections?.length ?? 0 }} section
              </p>
            </div>

            <div v-if="(course.sections?.length ?? 0) > 0" class="mt-5 flex flex-col gap-4">
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
                  <span
                    class="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary-50 text-xs font-semibold text-primary"
                  >
                    {{ section.order_number }}
                  </span>
                  <span class="text-sm font-semibold text-heading">{{ section.title }}</span>
                  <span class="ml-auto text-xs text-text-soft">
                    {{ section.lessons?.length ?? 0 }} pelajaran
                  </span>
                </button>

                <div
                  v-if="openSections.has(section.id ?? String(sectionIndex))"
                  class="flex flex-col divide-y divide-border"
                >
                  <div
                    v-for="lesson in section.lessons"
                    :key="lesson.id ?? lesson.title"
                    class="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:gap-3"
                  >
                    <div class="flex min-w-0 flex-1 items-center gap-3">
                      <span
                        class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-text-soft"
                      >
                        <BookOpen :size="15" />
                      </span>
                      <div class="min-w-0">
                        <p class="truncate text-sm font-medium text-text">{{ lesson.title }}</p>
                        <p class="truncate text-xs text-text-soft">
                          Pelajaran {{ lesson.order_number }}
                        </p>
                      </div>
                      <span
                        v-if="lesson.is_preview"
                        class="rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary"
                      >
                        Preview
                      </span>
                    </div>

                    <div class="flex shrink-0 flex-wrap items-center gap-2">
                      <span
                        v-if="lesson.quiz"
                        class="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-600"
                      >
                        <ListChecks :size="12" />
                        Quiz · {{ lesson.quiz.questions.length }} soal
                      </span>
                      <span
                        v-if="lesson.assignment"
                        class="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-600"
                      >
                        <FileText :size="12" />
                        Tugas
                      </span>
                      <span class="inline-flex shrink-0 items-center gap-1 text-xs text-text-soft">
                        <Clock :size="13" />
                        {{ lesson.duration > 0 ? formatMinutes(lesson.duration) : '—' }}
                      </span>
                    </div>
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
            <h3 class="font-semibold text-heading">Informasi Course</h3>
            <dl class="mt-4 flex flex-col divide-y divide-border text-sm">
              <div class="flex items-center justify-between py-2.5">
                <dt class="flex items-center gap-1.5 text-text-soft">
                  <Layers :size="14" />
                  Kategori
                </dt>
                <dd class="font-medium text-heading">{{ course.category?.name ?? '—' }}</dd>
              </div>
              <div class="flex items-center justify-between py-2.5">
                <dt class="flex items-center gap-1.5 text-text-soft">
                  <GraduationCap :size="14" />
                  Level
                </dt>
                <dd class="font-medium text-heading">
                  {{ LEVEL_LABELS[course.level?.slug ?? ''] ?? course.level?.name ?? '—' }}
                </dd>
              </div>
              <div class="flex items-center justify-between py-2.5">
                <dt class="flex items-center gap-1.5 text-text-soft">
                  <Clock :size="14" />
                  Durasi
                </dt>
                <dd class="font-medium text-heading">
                  {{ course.duration > 0 ? formatMinutes(course.duration) : '—' }}
                </dd>
              </div>
              <div class="flex items-center justify-between py-2.5">
                <dt class="flex items-center gap-1.5 text-text-soft">
                  <ListChecks :size="14" />
                  Pelajaran
                </dt>
                <dd class="font-medium text-heading">{{ totalLessons }}</dd>
              </div>
              <div class="flex items-center justify-between py-2.5">
                <dt class="flex items-center gap-1.5 text-text-soft">
                  <CircleAlert :size="14" />
                  Quiz
                </dt>
                <dd class="font-medium text-heading">{{ totalQuizzes }}</dd>
              </div>
              <div class="flex items-center justify-between py-2.5">
                <dt class="flex items-center gap-1.5 text-text-soft">
                  <FileText :size="14" />
                  Tugas
                </dt>
                <dd class="font-medium text-heading">{{ totalAssignments }}</dd>
              </div>
              <div class="flex items-center justify-between py-2.5">
                <dt class="flex items-center gap-1.5 text-text-soft">
                  <CalendarClock :size="14" />
                  Dibuat
                </dt>
                <dd class="font-medium text-heading">{{ formatDate(course.created_at) }}</dd>
              </div>
            </dl>
          </BaseCard>

          <BaseCard class="!p-6">
            <h3 class="font-semibold text-heading">Mentor</h3>
            <div class="mt-4 flex items-center gap-3">
              <span
                class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-50 font-semibold text-primary"
              >
                {{ course.mentor?.full_name?.charAt(0).toUpperCase() ?? '—' }}
              </span>
              <div class="min-w-0">
                <p class="truncate text-sm font-semibold text-heading">
                  {{ course.mentor?.full_name ?? '—' }}
                </p>
                <p class="truncate text-xs text-text-soft">{{ course.mentor?.email ?? '—' }}</p>
              </div>
            </div>
          </BaseCard>
        </div>
      </div>
    </template>
  </div>
</template>
