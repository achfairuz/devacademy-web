<script setup lang="ts">
import { FolderPlus, Layers, Plus } from '@lucide/vue'
import { computed, ref } from 'vue'

import BaseConfirmModal from '@/components/base/BaseConfirmModal.vue'
import LessonEditorDrawer from '@/components/course-builder/LessonEditorDrawer.vue'
import SectionItem from '@/components/course-builder/SectionItem.vue'
import type { CourseBuilder } from '@/hooks/useCourseBuilder'
import { createEmptyLesson, type Lesson, type Section } from '@/models/course'

const props = defineProps<{
  builder: CourseBuilder
}>()

interface PendingDelete {
  kind: 'section' | 'lesson'
  sectionId?: string
  lessonId?: string
  title: string
}

const toDelete = ref<PendingDelete | null>(null)

const deleteDescription = computed(() => {
  if (!toDelete.value) return ''
  const target = toDelete.value
  if (target.kind === 'section') {
    return `Section "${target.title}" beserta seluruh lesson di dalamnya akan dihapus. Tindakan ini tidak bisa dibatalkan.`
  }
  return `Lesson "${target.title}" akan dihapus dari section. Tindakan ini tidak bisa dibatalkan.`
})

function requestDeleteSection(section: Section) {
  toDelete.value = { kind: 'section', sectionId: section.id, title: section.title }
}

function requestDeleteLesson(sectionId: string, lesson: Lesson) {
  toDelete.value = { kind: 'lesson', sectionId, lessonId: lesson.id, title: lesson.title }
}

function confirmDelete() {
  const target = toDelete.value
  if (!target) return
  if (target.kind === 'section' && target.sectionId) {
    props.builder.removeSection(target.sectionId)
  } else if (target.kind === 'lesson' && target.sectionId && target.lessonId) {
    props.builder.removeLesson(target.sectionId, target.lessonId)
  }
  toDelete.value = null
}

interface EditorState {
  mode: 'create' | 'edit'
  sectionId: string
  lesson: Lesson
}

const editor = ref<EditorState | null>(null)

function openCreateLesson(sectionId: string) {
  editor.value = { mode: 'create', sectionId, lesson: createEmptyLesson() }
}

function openEditLesson(sectionId: string, lesson: Lesson) {
  editor.value = { mode: 'edit', sectionId, lesson }
}

function onSaveLesson(draft: Lesson) {
  const state = editor.value
  if (!state) return
  if (state.mode === 'create') {
    props.builder.addLesson(state.sectionId, draft)
    props.builder.showToast('Lesson berhasil ditambahkan.')
  } else {
    props.builder.updateLesson(state.sectionId, state.lesson.id ?? '', draft)
    props.builder.showToast('Lesson berhasil diperbarui.')
  }
  editor.value = null
}

const lessonCount = computed(() =>
  props.builder.course.sections.reduce((sum, section) => sum + section.lessons.length, 0),
)
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex items-center gap-3">
        <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary">
          <Layers :size="18" />
        </span>
        <div>
          <h2 class="font-semibold text-heading">Curriculum</h2>
          <p class="text-sm text-text-soft">
            Susun section dan lesson course Anda
          </p>
        </div>
      </div>
      <span class="inline-flex w-fit items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-text-soft">
        {{ builder.course.sections.length }} section &middot; {{ lessonCount }} lesson
      </span>
    </div>

    <div v-if="builder.course.sections.length === 0" class="flex flex-col gap-4">
      <div
        class="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border py-16 text-center"
      >
        <Layers :size="32" class="text-text-soft" />
        <p class="font-semibold text-heading">Belum ada section</p>
        <p class="text-sm text-text-soft">
          Mulai dengan menambahkan section pertama untuk mengelompokkan materi Anda.
        </p>
      </div>
      <button
        type="button"
        class="inline-flex items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-surface py-4 text-sm font-semibold text-text transition-colors hover:border-primary/50 hover:bg-primary-50/40 hover:text-primary"
        @click="builder.addSection"
      >
        <FolderPlus :size="18" />
        Tambah Section
      </button>
    </div>

    <template v-else>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <SectionItem
          v-for="(section, index) in builder.course.sections"
          :key="section.id"
          :builder="builder"
          :section="section"
          :index="index"
          :total="builder.course.sections.length"
          @add-lesson="openCreateLesson"
          @edit-lesson="openEditLesson"
          @delete-section="requestDeleteSection"
          @delete-lesson="requestDeleteLesson"
        />
      </div>

      <button
        type="button"
        class="inline-flex items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-surface py-4 text-sm font-semibold text-text transition-colors hover:border-primary/50 hover:bg-primary-50/40 hover:text-primary"
        @click="builder.addSection"
      >
        <Plus :size="18" />
        Tambah Section
      </button>
    </template>

    <BaseConfirmModal
      :model-value="toDelete != null"
      title="Hapus Item Ini?"
      :description="deleteDescription"
      confirm-text="Ya, Hapus"
      cancel-text="Batal"
      variant="danger"
      @update:model-value="(value) => { if (!value) toDelete = null }"
      @confirm="confirmDelete"
    />

    <LessonEditorDrawer
      :model-value="editor != null"
      :lesson="editor?.lesson ?? createEmptyLesson()"
      :mode="editor?.mode ?? 'create'"
      @update:model-value="(value) => { if (!value) editor = null }"
      @save="onSaveLesson"
    />
  </div>
</template>
