<script setup lang="ts">
import { ArrowLeft, ArrowRight, CircleAlert, Rocket, Save } from '@lucide/vue'
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import BaseButton from '@/components/base/BaseButton.vue'
import BaseToast from '@/components/base/BaseToast.vue'
import CourseInformationStep from '@/components/course-builder/CourseInformationStep.vue'
import CourseReviewStep from '@/components/course-builder/CourseReviewStep.vue'
import CurriculumStep from '@/components/course-builder/CurriculumStep.vue'
import StepperHeader from '@/components/course-builder/StepperHeader.vue'
import type { CourseBuilder } from '@/hooks/course/useCourseBuilder'

const props = defineProps<{
  builder: CourseBuilder
}>()

const pageTitle = computed(() => (props.builder.isEditing ? 'Edit Course' : 'Create Course'))
const pageSubtitle = computed(() =>
  props.builder.isEditing
    ? 'Perbarui course Anda langkah demi langkah'
    : 'Buat course baru secara bertahap',
)

const hasSections = computed(() => props.builder.course.sections.length > 0)

function onPublish() {
  void props.builder.publish()
}

function onSaveDraft() {
  void props.builder.saveDraft()
}

function closeToast() {
  props.builder.toast = null
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div class="flex flex-col gap-1">
        <RouterLink
          to="/mentor/courses"
          class="inline-flex w-fit items-center gap-1 text-sm font-medium text-text-soft no-underline transition-colors hover:text-primary"
        >
          <ArrowLeft :size="15" />
          Kembali ke Course
        </RouterLink>
        <h1 class="text-2xl font-bold text-heading">{{ pageTitle }}</h1>
        <p class="text-sm text-text-soft">{{ pageSubtitle }}</p>
      </div>

      <div class="flex items-center gap-2">
        <span
          v-if="builder.localOnly"
          class="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700"
        >
          <CircleAlert :size="13" />
          Disimpan lokal
        </span>
        <span
          v-if="builder.dirty"
          class="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-text-soft"
        >
          <span class="h-1.5 w-1.5 rounded-full bg-amber-500" />
          Belum disimpan
        </span>
        <span
          v-else-if="builder.course.title"
          class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700"
        >
          Tersimpan
        </span>
      </div>
    </div>

    <StepperHeader :step="builder.step" @select="builder.goTo" />

    <div v-if="builder.loading" class="flex flex-1 flex-col gap-4">
      <div class="flex h-40 animate-pulse items-center justify-center rounded-xl border border-border bg-surface">
        <span class="text-sm text-text-soft">Memuat course...</span>
      </div>
      <div class="h-64 animate-pulse rounded-xl border border-border bg-surface" />
    </div>

    <div
      v-else-if="builder.loadError"
      class="flex flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-border bg-surface py-20 text-center"
    >
      <CircleAlert :size="32" class="text-red-500" />
      <p class="font-semibold text-heading">Gagal memuat course</p>
      <p class="text-sm text-text-soft">{{ builder.loadError }}</p>
      <RouterLink
        to="/mentor/courses"
        class="text-sm font-medium text-primary no-underline hover:underline"
      >
        Kembali ke daftar course
      </RouterLink>
    </div>

    <div v-else class="flex flex-1">
      <CourseInformationStep v-if="builder.step === 1" :builder="builder" />
      <CurriculumStep v-else-if="builder.step === 2" :builder="builder" />
      <CourseReviewStep v-else :builder="builder" />
    </div>

    <footer
      class="sticky bottom-4 z-20 flex items-center justify-between gap-4 rounded-xl border border-border bg-surface/95 px-5 py-4 shadow-lg backdrop-blur"
    >
      <p class="hidden text-sm text-text-soft md:block">
        <template v-if="builder.step === 1">Isi informasi dasar course untuk melanjutkan.</template>
        <template v-else-if="builder.step === 2">
          {{ hasSections ? 'Susun section dan lesson course Anda.' : 'Tambahkan section pertama untuk memulai kurikulum.' }}
        </template>
        <template v-else>Periksa kembali sebelum memublikasikan course.</template>
      </p>

      <div class="flex flex-1 items-center justify-end gap-2 md:flex-none">
        <BaseButton
          v-if="builder.step > 1"
          type="button"
          variant="secondary"
          class="!bg-gray-100 !text-text"
          @click="builder.back"
        >
          <ArrowLeft :size="16" />
          <span class="hidden sm:inline">Back</span>
        </BaseButton>

        <BaseButton
          v-if="builder.step !== 3"
          type="button"
          variant="secondary"
          class="!bg-gray-100 !text-text"
          :loading="builder.saving"
          @click="onSaveDraft"
        >
          <Save :size="16" />
          Save Draft
        </BaseButton>

        <BaseButton v-if="builder.step === 1" type="button" @click="builder.next">
          Continue
          <ArrowRight :size="16" />
        </BaseButton>

        <BaseButton v-else-if="builder.step === 2" type="button" @click="builder.next">
          Continue
          <ArrowRight :size="16" />
        </BaseButton>

        <BaseButton v-else type="button" :loading="builder.publishing" @click="onPublish">
          <Rocket :size="16" />
          Publish Course
        </BaseButton>
      </div>
    </footer>

    <BaseToast :toast="builder.toast" @close="closeToast" />
  </div>
</template>
