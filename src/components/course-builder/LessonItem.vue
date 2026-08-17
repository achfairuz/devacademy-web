<script setup lang="ts">
import {
  Clock,
  Eye,
  FileText,
  GripVertical,
  ListChecks,
  NotebookPen,
  Pencil,
  Play,
  Trash2,
  Type,
  Video,
} from '@lucide/vue'
import type { Component } from 'vue'
import { computed, ref } from 'vue'

import { dragState } from '@/components/course-builder/drag'
import type { CourseBuilder } from '@/hooks/useCourseBuilder'
import type { Lesson } from '@/models/lesson'
import { formatMinutes } from '@/utils/formatters'

const props = defineProps<{
  builder: CourseBuilder
  sectionId: string
  lesson: Lesson
  index: number
  total: number
}>()

const emit = defineEmits<{
  edit: [lesson: Lesson]
  delete: [lesson: Lesson]
}>()

const isDragging = ref(false)
const isDragOver = ref(false)

const iconConfig = computed<{ icon: Component; classes: string }>(() => {
  if (props.lesson.quiz) {
    return { icon: ListChecks, classes: 'bg-amber-50 text-amber-600' }
  }
  if (props.lesson.assignment) {
    return { icon: NotebookPen, classes: 'bg-emerald-50 text-emerald-600' }
  }
  if (props.lesson.files.length > 0) {
    return { icon: FileText, classes: 'bg-blue-50 text-blue-600' }
  }
  if (props.lesson.video_url) {
    return { icon: Video, classes: 'bg-primary-50 text-primary' }
  }
  return { icon: Type, classes: 'bg-gray-100 text-text-soft' }
})

const badges = computed(() => {
  const items: { key: string; icon: Component; label: string; classes: string }[] = []
  if (props.lesson.video_url) {
    items.push({ key: 'video', icon: Play, label: 'Video', classes: 'text-primary' })
  }
  if (props.lesson.files.length > 0) {
    items.push({
      key: 'files',
      icon: FileText,
      label: `${props.lesson.files.length} file`,
      classes: 'text-blue-600',
    })
  }
  if (props.lesson.quiz) {
    items.push({
      key: 'quiz',
      icon: ListChecks,
      label: `${props.lesson.quiz.questions.length} soal`,
      classes: 'text-amber-600',
    })
  }
  if (props.lesson.assignment) {
    items.push({ key: 'assignment', icon: NotebookPen, label: 'Tugas', classes: 'text-emerald-600' })
  }
  return items
})

function onDragStart(event: DragEvent) {
  dragState.value = { type: 'lesson', sectionId: props.sectionId, fromIndex: props.index }
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', String(props.index))
  }
  isDragging.value = true
}

function onDragOver() {
  isDragOver.value = true
}

function onDrop() {
  isDragOver.value = false
  const source = dragState.value
  if (source?.type === 'lesson' && source.sectionId === props.sectionId) {
    props.builder.moveLesson(props.sectionId, source.fromIndex, props.index)
  }
  dragState.value = null
}

function onDragEnd() {
  isDragging.value = false
  dragState.value = null
}
</script>

<template>
  <div
    draggable="true"
    class="flex items-start gap-2 rounded-lg border border-transparent px-2 py-1.5 transition-colors"
    :class="[
      isDragging ? 'border-primary/40 bg-primary-50/50 opacity-50' : 'hover:border-border hover:bg-gray-50/70',
      isDragOver ? 'border-primary bg-primary-50/50' : '',
    ]"
    @dragstart="onDragStart"
    @dragover.prevent="onDragOver"
    @dragleave="isDragOver = false"
    @drop.prevent="onDrop"
    @dragend="onDragEnd"
  >
    <span
      class="mt-1 hidden shrink-0 cursor-grab text-text-soft/70 hover:text-text-soft active:cursor-grabbing sm:inline-flex"
      title="Seret untuk mengurutkan"
    >
      <GripVertical :size="15" />
    </span>

    <span
      class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
      :class="iconConfig.classes"
    >
      <component :is="iconConfig.icon" :size="15" />
    </span>

    <div class="flex min-w-0 flex-1 flex-col gap-1">
      <div class="flex min-w-0 items-center gap-1">
        <button
          type="button"
          class="min-w-0 flex-1 text-left"
          @click="emit('edit', lesson)"
        >
          <span class="block truncate text-sm font-medium text-heading hover:text-primary">
            {{ lesson.title || 'Lesson tanpa judul' }}
          </span>
        </button>

        <div class="flex shrink-0 items-center gap-0.5">
          <button
            type="button"
            class="rounded-md p-1 text-text-soft transition-colors hover:bg-primary-50 hover:text-primary"
            :aria-label="`Edit lesson ${lesson.title}`"
            @click="emit('edit', lesson)"
          >
            <Pencil :size="14" />
          </button>
          <button
            type="button"
            class="rounded-md p-1 text-text-soft transition-colors hover:bg-red-50 hover:text-red-600"
            :aria-label="`Hapus lesson ${lesson.title}`"
            @click="emit('delete', lesson)"
          >
            <Trash2 :size="14" />
          </button>
        </div>
      </div>

      <div v-if="badges.length > 0 || lesson.duration > 0 || lesson.is_preview" class="flex flex-wrap items-center gap-x-2 gap-y-1 pl-0">
        <span
          v-for="badge in badges"
          :key="badge.key"
          class="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-text-soft"
          :class="badge.classes"
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
          v-if="lesson.is_preview"
          class="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2 py-0.5 text-[11px] font-medium text-primary"
        >
          <Eye :size="11" />
          Preview
        </span>
      </div>
    </div>
  </div>
</template>
