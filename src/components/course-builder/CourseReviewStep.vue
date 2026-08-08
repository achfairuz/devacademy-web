<script setup lang="ts">
import {
  BadgeCheck,
  BookOpen,
  CalendarDays,
  CircleDollarSign,
  Clock,
  Layers,
  ListChecks,
  NotebookPen,
  Play,
  Sparkles,
  Tag,
  TriangleAlert,
} from '@lucide/vue'
import type { Component } from 'vue'
import { computed } from 'vue'

import BaseCard from '@/components/base/BaseCard.vue'
import { useCategories } from '@/hooks/useCategories'
import type { CourseBuilder } from '@/hooks/useCourseBuilder'
import { COURSE_LEVELS, type Lesson } from '@/models/course'
import { formatMinutes, formatRupiah } from '@/utils/formatters'

const props = defineProps<{
  builder: CourseBuilder
}>()

const { categories } = useCategories()

const categoryName = computed(() => {
  const match = categories.value.find((category) => category.id === props.builder.course.category_id)
  return match?.name ?? 'Kategori tidak ditemukan'
})

const levelLabel = computed(() => {
  const match = COURSE_LEVELS.find((item) => item.value === props.builder.course.level)
  return match?.label ?? props.builder.course.level
})

const validCount = computed(() =>
  props.builder.reviewChecklist.filter((item) => item.valid).length,
)

function lessonBadges(lesson: Lesson): { key: string; icon: Component; label: string }[] {
  const badges: { key: string; icon: Component; label: string }[] = []
  if (lesson.video_url) badges.push({ key: 'video', icon: Play, label: 'Video' })
  if (lesson.files.length > 0)
    badges.push({ key: 'files', icon: BookOpen, label: `${lesson.files.length} file` })
  if (lesson.quiz)
    badges.push({ key: 'quiz', icon: ListChecks, label: `${lesson.quiz.questions.length} soal` })
  if (lesson.assignment)
    badges.push({ key: 'assignment', icon: NotebookPen, label: 'Assignment' })
  return badges
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <div
      class="flex items-center gap-3 rounded-xl border px-5 py-4"
      :class="
        builder.reviewValid
          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
          : 'border-amber-200 bg-amber-50 text-amber-700'
      "
    >
      <Sparkles v-if="builder.reviewValid" :size="20" class="shrink-0" />
      <TriangleAlert v-else :size="20" class="shrink-0" />
      <div>
        <p class="font-semibold">
          {{ builder.reviewValid ? 'Course siap dipublikasikan!' : 'Course belum lengkap' }}
        </p>
        <p class="text-sm opacity-80">
          {{
            builder.reviewValid
              ? 'Semua checklist terpenuhi. Klik Publish Course untuk menerbitkan.'
              : `${builder.reviewChecklist.length - validCount} item perlu diperbaiki sebelum dipublikasikan.`
          }}
        </p>
      </div>
    </div>

    <BaseCard class="flex flex-col gap-5">
      <div class="flex items-center gap-3">
        <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary">
          <BookOpen :size="18" />
        </span>
        <div>
          <h2 class="font-semibold text-heading">Course Information</h2>
          <p class="text-sm text-text-soft">Ringkasan informasi course Anda</p>
        </div>
      </div>

      <div class="flex flex-col gap-5 sm:flex-row">
        <div
          class="flex aspect-video w-full shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-gray-50 sm:w-56"
        >
          <img
            v-if="builder.course.thumbnail"
            :src="builder.course.thumbnail"
            alt="Thumbnail course"
            class="h-full w-full object-cover"
          />
          <BookOpen v-else :size="28" class="text-text-soft" />
        </div>

        <dl class="grid flex-1 grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
          <div>
            <dt class="text-xs font-medium uppercase tracking-wide text-text-soft">Judul</dt>
            <dd class="mt-0.5 font-semibold text-heading">{{ builder.course.title || '—' }}</dd>
          </div>
          <div>
            <dt class="text-xs font-medium uppercase tracking-wide text-text-soft">Kategori</dt>
            <dd class="mt-0.5 inline-flex items-center gap-1.5 font-medium text-text">
              <Tag :size="13" class="text-text-soft" />
              {{ categoryName }}
            </dd>
          </div>
          <div>
            <dt class="text-xs font-medium uppercase tracking-wide text-text-soft">Level</dt>
            <dd class="mt-0.5 font-medium text-text">{{ levelLabel }}</dd>
          </div>
          <div>
            <dt class="text-xs font-medium uppercase tracking-wide text-text-soft">Harga</dt>
            <dd class="mt-0.5 inline-flex items-center gap-1.5 font-semibold text-heading">
              <CircleDollarSign :size="14" class="text-emerald-600" />
              {{ formatRupiah(builder.course.price) }}
            </dd>
          </div>
          <div>
            <dt class="text-xs font-medium uppercase tracking-wide text-text-soft">Total Durasi</dt>
            <dd class="mt-0.5 inline-flex items-center gap-1.5 font-medium text-text">
              <Clock :size="13" class="text-text-soft" />
              {{ formatMinutes(builder.course.duration) }}
            </dd>
          </div>
          <div>
            <dt class="text-xs font-medium uppercase tracking-wide text-text-soft">Status</dt>
            <dd class="mt-0.5">
              <span
                class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium"
                :class="
                  builder.course.status === 'published'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-gray-100 text-text-soft'
                "
              >
                {{ builder.course.status === 'published' ? 'Published' : 'Draft' }}
              </span>
            </dd>
          </div>
        </dl>
      </div>
    </BaseCard>

    <BaseCard class="flex flex-col gap-4">
      <div class="flex items-center gap-3">
        <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary-50 text-secondary-600">
          <Layers :size="18" />
        </span>
        <div>
          <h2 class="font-semibold text-heading">Curriculum</h2>
          <p class="text-sm text-text-soft">
            {{ builder.course.sections.length }} section &middot;
            {{ builder.course.sections.reduce((sum, s) => sum + s.lessons.length, 0) }} lesson
          </p>
        </div>
      </div>

      <div v-if="builder.course.sections.length === 0" class="rounded-xl border border-dashed border-border py-10 text-center text-sm text-text-soft">
        Belum ada section.
      </div>

      <ol v-else class="flex flex-col gap-4">
        <li v-for="(section, sectionIndex) in builder.course.sections" :key="section.id" class="flex flex-col gap-2">
          <div class="flex items-center gap-2">
            <span class="flex h-6 w-6 items-center justify-center rounded-md bg-gray-100 text-xs font-bold text-text-soft">
              {{ sectionIndex + 1 }}
            </span>
            <p class="font-semibold text-heading">{{ section.title }}</p>
            <span class="text-xs text-text-soft">{{ section.lessons.length }} lesson</span>
          </div>

          <div v-if="section.lessons.length === 0" class="flex items-center gap-1.5 text-xs text-amber-600">
            <TriangleAlert :size="13" />
            Section ini belum memiliki lesson.
          </div>

          <ul class="flex flex-col gap-1.5 pl-8">
            <li
              v-for="lesson in section.lessons"
              :key="lesson.id"
              class="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg bg-gray-50/70 px-3 py-2"
            >
              <Play :size="13" class="text-text-soft" />
              <span class="text-sm font-medium text-heading">{{ lesson.title || 'Lesson tanpa judul' }}</span>
              <span
                v-for="badge in lessonBadges(lesson)"
                :key="badge.key"
                class="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-text-soft"
              >
                <component :is="badge.icon" :size="11" />
                {{ badge.label }}
              </span>
              <span
                v-if="lesson.duration > 0"
                class="inline-flex items-center gap-1 text-[11px] text-text-soft"
              >
                <Clock :size="11" />
                {{ formatMinutes(lesson.duration) }}
              </span>
              <span
                v-if="lesson.assignment"
                class="inline-flex items-center gap-1 text-[11px] text-text-soft"
              >
                <CalendarDays :size="11" />
                Due {{ lesson.assignment.due_date || '—' }}
              </span>
            </li>
          </ul>
        </li>
      </ol>
    </BaseCard>

    <BaseCard class="flex flex-col gap-4">
      <div class="flex items-center gap-3">
        <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <BadgeCheck :size="18" />
        </span>
        <div>
          <h2 class="font-semibold text-heading">Validation Checklist</h2>
          <p class="text-sm text-text-soft">
            {{ validCount }} dari {{ builder.reviewChecklist.length }} item terpenuhi
          </p>
        </div>
      </div>

      <ul class="flex flex-col gap-1.5">
        <li
          v-for="item in builder.reviewChecklist"
          :key="item.key"
          class="flex items-start gap-2.5 rounded-lg px-3 py-2"
          :class="item.valid ? 'bg-emerald-50/60' : 'bg-amber-50/60'"
        >
          <span
            class="mt-0.5 shrink-0"
            :class="item.valid ? 'text-emerald-600' : 'text-amber-600'"
          >
            <BadgeCheck v-if="item.valid" :size="16" />
            <TriangleAlert v-else :size="16" />
          </span>
          <div class="min-w-0">
            <p class="text-sm font-medium" :class="item.valid ? 'text-emerald-800' : 'text-amber-800'">
              {{ item.label }}
            </p>
            <p v-if="item.message" class="text-xs text-amber-700">{{ item.message }}</p>
          </div>
        </li>
      </ul>
    </BaseCard>
  </div>
</template>
