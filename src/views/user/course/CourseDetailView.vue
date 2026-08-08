<script setup lang="ts">
import {
  ArrowLeft,
  Award,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  FileText,
  ListChecks,
  MonitorPlay,
  Play,
  Search,
  Star,
  Users,
} from '@lucide/vue'
import { RouterLink, useRoute } from 'vue-router'
import { computed, ref } from 'vue'

import BaseCard from '@/components/base/BaseCard.vue'
import { courses, type Lesson } from './courseData'

const route = useRoute()

const course = computed(() => courses.find((item) => item.id === route.params.id))

const totalLessons = computed(() =>
  course.value ? course.value.modulesData.reduce((total, m) => total + m.lessons.length, 0) : 0,
)

const completedLessons = computed(() =>
  course.value
    ? course.value.modulesData.reduce(
        (total, m) => total + m.lessons.filter((lesson) => lesson.completed).length,
        0,
      )
    : 0,
)

const openModules = ref<Set<string>>(new Set())

function toggleModule(title: string) {
  const next = new Set(openModules.value)
  if (next.has(title)) next.delete(title)
  else next.add(title)
  openModules.value = next
}

const lessonIcon = (type: Lesson['type']) =>
  type === 'video' ? MonitorPlay : type === 'article' ? FileText : ListChecks
</script>

<template>
  <div v-if="course" class="flex flex-col gap-6">
    <RouterLink
      to="/user/courses"
      class="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-text-soft no-underline transition-colors hover:text-primary"
    >
      <ArrowLeft :size="16" />
      Kembali ke Courses
    </RouterLink>

    <section
      class="relative overflow-hidden rounded-2xl p-8 text-white shadow-lg"
      :class="course.color"
    >
      <div class="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
      <div class="pointer-events-none absolute -bottom-20 right-24 h-40 w-40 rounded-full bg-white/10 blur-xl" />

      <div class="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div class="flex max-w-2xl flex-col gap-3">
          <div class="flex flex-wrap items-center gap-2">
            <span class="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur">
              {{ course.category }}
            </span>
            <span class="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur">
              {{ course.level }}
            </span>
          </div>
          <h1 class="text-3xl font-bold">{{ course.title }}</h1>
          <p class="text-sm text-white/90">{{ course.description }}</p>
          <div class="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/90">
            <span class="inline-flex items-center gap-1.5">
              <BookOpen :size="15" />
              {{ course.modulesData.length }} modul
            </span>
            <span class="inline-flex items-center gap-1.5">
              <Clock :size="15" />
              {{ course.duration }}
            </span>
            <span class="inline-flex items-center gap-1.5">
              <Users :size="15" />
              {{ course.students }} siswa
            </span>
            <span class="inline-flex items-center gap-1.5">
              <Star :size="15" class="fill-white" />
              {{ course.rating }}
            </span>
          </div>
        </div>

        <div class="flex w-full flex-col gap-3 lg:w-72">
          <div v-if="course.progress > 0">
            <div class="mb-1.5 flex justify-between text-xs text-white/90">
              <span>Progress Anda</span>
              <span>{{ course.progress }}%</span>
            </div>
            <div class="h-2 w-full overflow-hidden rounded-full bg-white/20">
              <div class="h-full rounded-full bg-white" :style="{ width: `${course.progress}%` }" />
            </div>
          </div>
          <button
            type="button"
            class="inline-flex w-full items-center justify-center gap-2 rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-heading transition-opacity hover:opacity-90"
          >
            <Play :size="16" />
            {{ course.progress > 0 ? 'Lanjut Belajar' : 'Mulai Belajar' }}
          </button>
        </div>
      </div>
    </section>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div class="flex flex-col gap-6 lg:col-span-2">
        <BaseCard class="!p-6">
          <h2 class="text-lg font-semibold text-heading">Apa yang akan Anda pelajari</h2>
          <ul class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <li v-for="objective in course.objectives" :key="objective" class="flex items-start gap-2.5 text-sm text-text">
              <CheckCircle2 :size="18" class="mt-0.5 shrink-0 text-emerald-500" />
              {{ objective }}
            </li>
          </ul>
        </BaseCard>

        <BaseCard class="!p-6">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-heading">Kurikulum</h2>
            <p class="text-sm text-text-soft">
              {{ completedLessons }}/{{ totalLessons }} pelajaran selesai
            </p>
          </div>

          <div class="mt-5 flex flex-col gap-4">
            <div
              v-for="(module, index) in course.modulesData"
              :key="module.title"
              class="overflow-hidden rounded-lg border border-border"
            >
              <button
                type="button"
                class="flex w-full items-center gap-3 bg-gray-50 px-4 py-3.5 text-left transition-colors hover:bg-gray-100"
                @click="toggleModule(module.title)"
              >
                <ChevronDown
                  :size="18"
                  class="shrink-0 text-text-soft transition-transform"
                  :class="openModules.has(module.title) ? 'rotate-180' : ''"
                />
                <span class="text-sm font-semibold text-heading">
                  Modul {{ index + 1 }}: {{ module.title }}
                </span>
                <span class="ml-auto text-xs text-text-soft">
                  {{ module.lessons.length }} pelajaran
                </span>
              </button>

              <div v-if="openModules.has(module.title)" class="flex flex-col">
                <div
                  v-for="lesson in module.lessons"
                  :key="lesson.title"
                  class="flex items-center gap-3 border-t border-border px-4 py-3"
                >
                  <Check
                    v-if="lesson.completed"
                    :size="18"
                    class="shrink-0 text-emerald-500"
                  />
                  <span
                    v-else
                    class="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 border-gray-300"
                  />
                  <component
                    :is="lessonIcon(lesson.type)"
                    :size="16"
                    class="shrink-0 text-text-soft"
                  />
                  <span class="min-w-0 flex-1 truncate text-sm text-text">
                    {{ lesson.title }}
                  </span>
                  <span class="inline-flex items-center gap-1 text-xs text-text-soft">
                    <Clock :size="13" />
                    {{ lesson.duration }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>

      <div class="flex flex-col gap-6">
        <BaseCard class="!p-6">
          <div class="flex items-center gap-4">
            <span
              class="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-sm font-bold text-white"
            >
              {{ course.instructor
                .split(' ')
                .slice(0, 2)
                .map((part) => part[0])
                .join('') }}
            </span>
            <div>
              <p class="text-sm font-semibold text-heading">{{ course.instructor }}</p>
              <p class="text-xs text-text-soft">Mentor DevAcademy</p>
            </div>
          </div>
        </BaseCard>

        <BaseCard class="!p-6">
          <div class="flex flex-col gap-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs text-text-soft">Harga Course</p>
                <p class="text-xl font-bold text-heading">{{ course.price }}</p>
              </div>
              <Award :size="24" class="text-amber-500" />
            </div>
            <button
              type="button"
              class="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              <BookOpen :size="16" />
              {{ course.progress > 0 ? 'Lanjut Belajar' : 'Daftar Kursus' }}
            </button>
          </div>
        </BaseCard>

        <BaseCard class="!p-6">
          <h3 class="font-semibold text-heading">Kursus Lainnya</h3>
          <div class="mt-4 flex flex-col gap-3">
            <RouterLink
              v-for="related in courses.filter((item) => item.id !== course?.id).slice(0, 3)"
              :key="related.id"
              :to="`/user/courses/${related.id}`"
              class="group flex items-center gap-3 rounded-lg border border-border p-3 no-underline transition-colors hover:border-primary/40"
            >
              <span
                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white"
                :class="related.color"
              >
                <Search :size="16" />
              </span>
              <div class="min-w-0">
                <p class="truncate text-sm font-medium text-heading">{{ related.title }}</p>
                <p class="text-xs text-text-soft">{{ related.category }}</p>
              </div>
            </RouterLink>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>

  <div v-else class="py-20 text-center">
    <p class="font-semibold text-heading">Course tidak ditemukan</p>
    <RouterLink
      to="/user/courses"
      class="mt-2 inline-block text-sm font-medium text-primary no-underline hover:underline"
    >
      Kembali ke Courses
    </RouterLink>
  </div>
</template>
