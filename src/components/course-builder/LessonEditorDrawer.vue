<script setup lang="ts">
import {
  FileArchive,
  FileQuestionMark,
  FileText,
  FileUp,
  ListChecks,
  NotebookPen,
  Trash2,
} from '@lucide/vue'
import type { Component } from 'vue'
import { ref, watch } from 'vue'

import BaseButton from '@/components/base/BaseButton.vue'
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseTabs from '@/components/base/BaseTabs.vue'
import BaseToggle from '@/components/base/BaseToggle.vue'
import RichTextEditor from '@/components/base/RichTextEditor.vue'
import AssignmentEditor from '@/components/course-builder/AssignmentEditor.vue'
import QuizEditor from '@/components/course-builder/QuizEditor.vue'
import { createEmptyAssignment } from '@/models/assignment'
import { LESSON_FILE_ACCEPT, LESSON_FILE_TYPES, resolveFileKind, type Lesson, type LessonFileKind } from '@/models/lesson'
import { createEmptyQuiz } from '@/models/quiz'
import { cloneDeep } from '@/utils/clone'
import { formatFileSize } from '@/utils/formatters'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    lesson: Lesson
    mode?: 'create' | 'edit'
  }>(),
  {
    modelValue: false,
    mode: 'create',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  save: [lesson: Lesson]
}>()

type LessonTab = 'info' | 'files' | 'quiz' | 'assignment'

const tabOptions: { label: string; value: LessonTab }[] = [
  { label: 'Basic Info', value: 'info' },
  { label: 'Files', value: 'files' },
  { label: 'Quiz', value: 'quiz' },
  { label: 'Assignment', value: 'assignment' },
]

const draft = ref<Lesson>(cloneDeep(props.lesson))
const activeTab = ref<LessonTab>('info')
const titleError = ref('')

function initDraft() {
  draft.value = cloneDeep(props.lesson)
  activeTab.value = 'info'
  titleError.value = ''
}

function onDurationChange(value: string | number) {
  const parsed = Number(value)
  draft.value.duration = Number.isFinite(parsed) ? parsed : 0
}

watch(
  () => props.modelValue,
  (open) => {
    if (open) initDraft()
  },
)

function onFileSelected(event: Event) {
  const files = Array.from((event.target as HTMLInputElement).files ?? [])
  const accepted = LESSON_FILE_ACCEPT.split(',')
  files.forEach((file) => {
    const extension = `.${file.name.toLowerCase().split('.').pop() ?? ''}`
    if (!accepted.includes(extension)) return
    draft.value.files.push({
      name: file.name,
      size: file.size,
      kind: resolveFileKind(file.name),
    })
  })
  ;(event.target as HTMLInputElement).value = ''
}

function removeFile(index: number) {
  draft.value.files.splice(index, 1)
}

function fileIcon(kind?: LessonFileKind): Component {
  if (kind === 'zip') return FileArchive
  if (kind) return FileText
  return FileQuestionMark
}

function close() {
  emit('update:modelValue', false)
}

function save() {
  if (!draft.value.title.trim()) {
    titleError.value = 'Judul lesson wajib diisi.'
    activeTab.value = 'info'
    return
  }
  emit('save', cloneDeep(draft.value))
}
</script>

<template>
  <BaseDrawer
    :model-value="modelValue"
    :title="mode === 'create' ? 'Tambah Lesson' : 'Edit Lesson'"
    :description="`Section · ${lesson.title || 'Lesson tanpa judul'}`"
    size="xl"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="flex flex-col gap-5">
      <BaseTabs v-model="activeTab" :options="tabOptions" />

      <!-- Basic Info -->
      <section v-if="activeTab === 'info'" class="flex flex-col gap-4">
        <BaseInput
          v-model="draft.title"
          label="Judul Lesson"
          placeholder="cth: Pengenalan Routing"
          required
          :error="titleError"
        />
        <RichTextEditor
          v-model="draft.description"
          label="Deskripsi"
          placeholder="Jelaskan tujuan dan isi lesson ini..."
          min-height="140px"
        />
        <BaseInput
          v-model="draft.video_url"
          label="Video URL"
          type="text"
          placeholder="cth: https://youtu.be/xxxx atau URL mp4"
        />

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div class="flex flex-col gap-1">
            <BaseInput
              :model-value="draft.duration"
              label="Durasi Video (menit)"
              type="number"
              placeholder="cth: 30"
              @update:model-value="onDurationChange"
            />
            <p class="text-xs text-text-soft">Durasi video lesson ini dalam menit.</p>
          </div>

          <div class="flex items-center justify-between rounded-lg border border-border px-4 py-3">
            <div>
              <p class="text-sm font-medium text-heading">Preview Gratis</p>
              <p class="text-xs text-text-soft">Siswa bisa menonton tanpa berlangganan</p>
            </div>
            <BaseToggle v-model="draft.is_preview" size="sm" />
          </div>
        </div>
      </section>

      <!-- Files -->
      <section v-else-if="activeTab === 'files'" class="flex flex-col gap-4">
        <label
          class="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-border px-6 py-8 text-center transition-colors hover:border-primary/50 hover:bg-primary-50/40"
        >
          <span class="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary">
            <FileUp :size="22" />
          </span>
          <span class="text-sm font-semibold text-heading">Upload Lesson Files</span>
          <span class="text-xs text-text-soft">
            Klik untuk memilih file dari perangkat Anda
          </span>
          <input
            type="file"
            :accept="LESSON_FILE_ACCEPT"
            multiple
            class="hidden"
            @change="onFileSelected"
          />
        </label>

        <div class="flex flex-wrap gap-1.5">
          <span
            v-for="type in LESSON_FILE_TYPES"
            :key="type.kind"
            class="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-text-soft"
          >
            {{ type.label }}
          </span>
        </div>

        <div v-if="draft.files.length === 0" class="flex flex-col items-center gap-1.5 py-6 text-center">
          <FileText :size="26" class="text-text-soft" />
          <p class="text-sm text-text-soft">Belum ada file yang ditambahkan.</p>
        </div>

        <ul v-else class="flex flex-col gap-2">
          <li
            v-for="(file, index) in draft.files"
            :key="`${file.name}-${index}`"
            class="flex items-center gap-3 rounded-lg border border-border px-3 py-2.5"
          >
            <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <component :is="fileIcon(file.kind)" :size="16" />
            </span>
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-medium text-heading">{{ file.name }}</p>
              <p v-if="file.size" class="text-xs text-text-soft">{{ formatFileSize(file.size) }}</p>
            </div>
            <button
              type="button"
              class="shrink-0 rounded-md p-1.5 text-text-soft transition-colors hover:bg-red-50 hover:text-red-600"
              :aria-label="`Hapus file ${file.name}`"
              @click="removeFile(index)"
            >
              <Trash2 :size="15" />
            </button>
          </li>
        </ul>
      </section>

      <!-- Quiz -->
      <section v-else-if="activeTab === 'quiz'" class="flex flex-col gap-4">
        <div v-if="!draft.quiz" class="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-12 text-center">
          <span class="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600">
            <ListChecks :size="22" />
          </span>
          <div>
            <p class="font-semibold text-heading">Belum ada quiz</p>
            <p class="text-sm text-text-soft">Tambahkan kuis untuk menguji pemahaman siswa.</p>
          </div>
          <BaseButton type="button" @click="draft.quiz = createEmptyQuiz()">
            Tambahkan Quiz
          </BaseButton>
        </div>
        <template v-else>
          <QuizEditor :quiz="draft.quiz" />
          <button
            type="button"
            class="inline-flex w-fit items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
            @click="draft.quiz = undefined"
          >
            <Trash2 :size="14" />
            Hapus Quiz
          </button>
        </template>
      </section>

      <!-- Assignment -->
      <section v-else class="flex flex-col gap-4">
        <div v-if="!draft.assignment" class="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-12 text-center">
          <span class="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <NotebookPen :size="22" />
          </span>
          <div>
            <p class="font-semibold text-heading">Belum ada assignment</p>
            <p class="text-sm text-text-soft">Berikan tugas untuk memperdalam materi.</p>
          </div>
          <BaseButton type="button" @click="draft.assignment = createEmptyAssignment()">
            Tambahkan Assignment
          </BaseButton>
        </div>
        <template v-else>
          <AssignmentEditor :assignment="draft.assignment" />
          <button
            type="button"
            class="inline-flex w-fit items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
            @click="draft.assignment = undefined"
          >
            <Trash2 :size="14" />
            Hapus Assignment
          </button>
        </template>
      </section>
    </div>

    <template #footer>
      <BaseButton type="button" variant="secondary" class="!bg-gray-100 !text-text" @click="close">
        Batal
      </BaseButton>
      <BaseButton type="button" @click="save">
        Simpan Lesson
      </BaseButton>
    </template>
  </BaseDrawer>
</template>
