<script setup lang="ts">
import {
  ChevronDown,
  ChevronRight,
  CircleAlert,
  GripVertical,
  MoreVertical,
  MoveDown,
  MoveUp,
  Pencil,
  Plus,
  Trash2,
} from '@lucide/vue'
import { ref } from 'vue'

import DropdownMenu from '@/components/course-builder/DropdownMenu.vue'
import LessonItem from '@/components/course-builder/LessonItem.vue'
import { dragState } from '@/components/course-builder/drag'
import type { CourseBuilder } from '@/hooks/useCourseBuilder'
import type { Lesson } from '@/models/lesson'
import type { Section } from '@/models/section'

const props = defineProps<{
  builder: CourseBuilder
  section: Section
  index: number
  total: number
}>()

const emit = defineEmits<{
  'add-lesson': [sectionId: string]
  'edit-lesson': [sectionId: string, lesson: Lesson]
  'delete-section': [section: Section]
  'delete-lesson': [sectionId: string, lesson: Lesson]
}>()

const collapsed = ref(false)
const renaming = ref(false)
const renameText = ref(props.section.title)
const isDragging = ref(false)
const isDragOver = ref(false)

function toggleCollapse() {
  collapsed.value = !collapsed.value
}

function startRename() {
  renaming.value = true
  renameText.value = props.section.title
}

function commitRename() {
  props.builder.renameSection(props.section.id ?? '', renameText.value)
  renaming.value = false
}

function cancelRename() {
  renaming.value = false
  renameText.value = props.section.title
}

function onDragStart(event: DragEvent) {
  dragState.value = { type: 'section', fromIndex: props.index }
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
  if (source?.type === 'section') {
    props.builder.moveSection(source.fromIndex, props.index)
  }
  dragState.value = null
}

function onDragEnd() {
  isDragging.value = false
  dragState.value = null
}

function move(direction: -1 | 1) {
  props.builder.moveSection(props.index, props.index + direction)
}
</script>

<template>
  <div
    draggable="true"
    class="rounded-xl border bg-surface shadow-sm transition-all"
    :class="[
      isDragging ? 'border-primary/40 opacity-50' : 'border-border',
      isDragOver ? 'border-primary ring-2 ring-primary/20' : '',
    ]"
    @dragstart="onDragStart"
    @dragover.prevent="onDragOver"
    @dragleave="isDragOver = false"
    @drop.prevent="onDrop"
    @dragend="onDragEnd"
  >
    <div class="flex items-center gap-1 px-3 py-3 sm:gap-2">
      <span
        class="hidden shrink-0 cursor-grab text-text-soft hover:text-heading active:cursor-grabbing sm:inline-flex"
        title="Seret untuk mengurutkan"
      >
        <GripVertical :size="17" />
      </span>

      <button
        type="button"
        class="shrink-0 rounded-md p-1 text-text-soft transition-colors hover:bg-gray-100 hover:text-heading"
        :aria-label="collapsed ? 'Perluas section' : 'Ciutkan section'"
        @click.stop="toggleCollapse"
      >
        <ChevronDown v-if="!collapsed" :size="17" />
        <ChevronRight v-else :size="17" />
      </button>

      <div class="flex min-w-0 flex-1 items-center gap-2">
        <template v-if="renaming">
          <input
            v-model="renameText"
            type="text"
            class="w-full max-w-xs rounded-md border border-primary bg-surface px-2 py-1 text-sm font-semibold text-heading outline-none ring-2 ring-primary/20"
            @keydown.enter.prevent="commitRename"
            @keydown.esc="cancelRename"
            @click.stop
          />
          <button
            type="button"
            class="rounded-md px-1.5 py-1 text-xs font-semibold text-primary hover:bg-primary-50"
            @click.stop="commitRename"
          >
            Simpan
          </button>
          <button
            type="button"
            class="rounded-md px-1.5 py-1 text-xs font-semibold text-text-soft hover:bg-gray-100"
            @click.stop="cancelRename"
          >
            Batal
          </button>
        </template>
        <template v-else>
          <button
            type="button"
            class="min-w-0 text-left font-semibold text-heading transition-colors hover:text-primary"
            @click="toggleCollapse"
          >
            <span class="truncate">{{ section.title }}</span>
          </button>
          <span
            class="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-text-soft"
          >
            {{ section.lessons.length }} lesson
          </span>
        </template>
      </div>

      <div class="flex shrink-0 items-center gap-0.5">
        <button
          v-if="!collapsed"
          type="button"
          class="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs font-semibold text-text transition-colors hover:border-primary/40 hover:text-primary sm:px-3"
          @click.stop="emit('add-lesson', section.id ?? '')"
        >
          <Plus :size="13" />
          <span class="hidden sm:inline">Add Lesson</span>
        </button>

        <DropdownMenu width-class="w-48">
          <template #trigger="{ toggle }">
            <button
              type="button"
              class="rounded-md p-1.5 text-text-soft transition-colors hover:bg-gray-100 hover:text-heading"
              aria-label="Menu section"
              @click.stop="toggle"
            >
              <MoreVertical :size="17" />
            </button>
          </template>
          <template #default="{ close }">
            <button
              type="button"
              class="flex items-center gap-2 px-3 py-2 text-left text-sm text-text transition-colors hover:bg-gray-50"
              @click="startRename(); close()"
            >
              <Pencil :size="14" />
              Rename Section
            </button>
            <button
              type="button"
              class="flex items-center gap-2 px-3 py-2 text-left text-sm text-text transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              :disabled="index === 0"
              @click="move(-1); close()"
            >
              <MoveUp :size="14" />
              Pindah ke Atas
            </button>
            <button
              type="button"
              class="flex items-center gap-2 px-3 py-2 text-left text-sm text-text transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              :disabled="index === total - 1"
              @click="move(1); close()"
            >
              <MoveDown :size="14" />
              Pindah ke Bawah
            </button>
            <div class="my-1 h-px bg-border" />
            <button
              type="button"
              class="flex items-center gap-2 px-3 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
              @click="emit('delete-section', section); close()"
            >
              <Trash2 :size="14" />
              Hapus Section
            </button>
          </template>
        </DropdownMenu>
      </div>
    </div>

    <div class="grid transition-all duration-200" :class="collapsed ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]'">
      <div class="overflow-hidden">
        <div class="flex flex-col gap-1.5 border-t border-border p-3">
          <div v-if="section.lessons.length === 0" class="flex items-center gap-2 py-1 text-sm text-amber-600">
            <CircleAlert :size="15" />
            Section ini belum memiliki lesson.
          </div>

          <LessonItem
            v-for="(lesson, lessonIndex) in section.lessons"
            :key="lesson.id"
            :builder="builder"
            :section-id="section.id ?? ''"
            :lesson="lesson"
            :index="lessonIndex"
            :total="section.lessons.length"
            @edit="emit('edit-lesson', section.id ?? '', $event)"
            @delete="emit('delete-lesson', section.id ?? '', $event)"
          />

          <button
            type="button"
            class="inline-flex w-fit items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-semibold text-primary transition-colors hover:bg-primary-50"
            @click="emit('add-lesson', section.id ?? '')"
          >
            <Plus :size="15" />
            Add Lesson
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
