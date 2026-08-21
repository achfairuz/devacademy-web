<script setup lang="ts">
import {
  ArrowRight,
  Award,
  BadgeCheck,
  BookOpen,
  Clock,
  Flame,
  GraduationCap,
  Play,
  Star,
  Users,
} from '@lucide/vue'
import { RouterLink } from 'vue-router'
import { computed } from 'vue'

import BaseCard from '@/components/base/BaseCard.vue'
import { useAuth } from '@/hooks/auth/useAuth'
import { courses } from '../course/courseData'

const { user } = useAuth()

const enrolledCourses = computed(() => courses.filter((course) => course.isEnrolled))

const totalProgress = computed(() => {
  if (enrolledCourses.value.length === 0) return 0
  const sum = enrolledCourses.value.reduce((total, course) => total + course.progress, 0)
  return Math.round(sum / enrolledCourses.value.length)
})

const completedLessons = computed(() =>
  enrolledCourses.value.reduce(
    (total, course) =>
      total +
      course.modulesData.reduce(
        (sum, module) => sum + module.lessons.filter((lesson) => lesson.completed).length,
        0,
      ),
    0,
  ),
)

const totalLessons = computed(() =>
  enrolledCourses.value.reduce(
    (total, course) =>
      total + course.modulesData.reduce((sum, module) => sum + module.lessons.length, 0),
    0,
  ),
)

const stats = [
  { label: 'Course Dimiliki', value: computed(() => String(enrolledCourses.value.length)), icon: BadgeCheck },
  { label: 'Pelajaran Selesai', value: computed(() => `${completedLessons.value}/${totalLessons.value}`), icon: Award },
  { label: 'Rata-rata Progress', value: computed(() => `${totalProgress.value}%`), icon: Star },
] as const
</script>

<template>
  <div v-if="user" class="flex flex-col gap-6">
    <div class="flex flex-col gap-1">
      <h1 class="text-2xl font-bold text-heading">Learning</h1>
      <p class="text-sm text-text-soft">Course yang sudah Anda miliki dan sedang dipelajari</p>
    </div>

    <section
      v-if="enrolledCourses.length > 0"
      class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500 p-6 text-white shadow-lg"
    >
      <div class="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
      <div class="pointer-events-none absolute -bottom-20 right-24 h-40 w-40 rounded-full bg-white/10 blur-xl" />

      <div class="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-white/80">Progress keseluruhan</p>
          <p class="text-3xl font-bold">{{ totalProgress }}%</p>
        </div>
        <div class="flex flex-wrap items-center gap-3 text-sm text-white/90">
          <span class="inline-flex items-center gap-1.5">
            <BadgeCheck :size="15" />
            {{ enrolledCourses.length }} course
          </span>
          <span class="inline-flex items-center gap-1.5">
            <Award :size="15" />
            {{ completedLessons }}/{{ totalLessons }} pelajaran
          </span>
          <span class="inline-flex items-center gap-1.5">
            <Flame :size="15" class="text-amber-300" />
            12 hari streak
          </span>
        </div>
      </div>

      <div class="relative mt-5 h-2.5 w-full overflow-hidden rounded-full bg-white/20">
        <div class="h-full rounded-full bg-white" :style="{ width: `${totalProgress}%` }" />
      </div>
    </section>

    <div v-if="enrolledCourses.length > 0" class="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <BaseCard v-for="stat in stats" :key="stat.label" class="flex items-center gap-4 !p-5">
        <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary">
          <component :is="stat.icon" :size="20" />
        </span>
        <div class="min-w-0">
          <p class="truncate text-xl font-bold text-heading">{{ stat.value }}</p>
          <p class="truncate text-sm text-text-soft">{{ stat.label }}</p>
        </div>
      </BaseCard>
    </div>

    <div v-if="enrolledCourses.length === 0" class="rounded-2xl border border-dashed border-border py-20 text-center">
      <GraduationCap :size="40" class="mx-auto text-text-soft" />
      <p class="mt-4 font-semibold text-heading">Belum ada course yang dimiliki</p>
      <p class="mt-1 text-sm text-text-soft">Belilah course pertama Anda untuk mulai belajar.</p>
      <RouterLink
        to="/user/courses"
        class="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white no-underline transition-opacity hover:opacity-90"
      >
        Jelajahi Courses
        <ArrowRight :size="16" />
      </RouterLink>
    </div>

    <div v-else class="flex flex-col gap-4">
      <BaseCard
        v-for="course in enrolledCourses"
        :key="course.id"
        class="group flex flex-col gap-4 p-5 transition-all hover:border-primary/40 hover:shadow-md sm:flex-row sm:items-center"
      >
        <RouterLink
          :to="`/user/courses/${course.id}`"
          class="flex min-w-0 flex-1 flex-col gap-4 no-underline sm:flex-row sm:items-center"
        >
          <span
            class="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
            :class="course.color"
          >
            <Play :size="22" class="transition-transform group-hover:scale-110" />
          </span>

          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-2">
              <p class="text-xs font-semibold uppercase tracking-wide text-text-soft">
                {{ course.category }}
              </p>
              <span class="h-1 w-1 rounded-full bg-text-soft/50" />
              <p class="text-xs text-text-soft">{{ course.level }}</p>
              <span v-if="course.progress === 100" class="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                <BadgeCheck :size="13" />
                Selesai
              </span>
            </div>
            <h3 class="mt-1 truncate font-semibold text-heading">{{ course.title }}</h3>
            <div class="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                class="h-full rounded-full"
                :class="course.color"
                :style="{ width: `${course.progress}%` }"
              />
            </div>
          </div>

          <div class="flex shrink-0 flex-wrap items-center gap-4 text-sm text-text-soft">
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

        <RouterLink
          :to="`/user/courses/${course.id}`"
          class="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white no-underline transition-opacity hover:opacity-90"
        >
          {{ course.progress > 0 && course.progress < 100 ? 'Lanjut Belajar' : 'Buka Course' }}
          <ArrowRight :size="16" />
        </RouterLink>
      </BaseCard>
    </div>
  </div>
</template>
