<script setup lang="ts">
import {
  Bold,
  CircleAlert,
  Code,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  Link,
  List,
  ListOrdered,
  Quote,
  Redo2,
  RemoveFormatting,
  Strikethrough,
  Underline,
  Undo2,
} from '@lucide/vue'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import StarterKit from '@tiptap/starter-kit'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import type { Component } from 'vue'
import { computed, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    id?: string
    label?: string
    modelValue?: string
    placeholder?: string
    error?: string
    disabled?: boolean
    required?: boolean
    minHeight?: string
  }>(),
  {
    id: undefined,
    label: undefined,
    modelValue: '',
    placeholder: 'Tulis sesuatu...',
    error: undefined,
    disabled: false,
    required: false,
    minHeight: '160px',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const isFocused = ref(false)

const editor = useEditor({
  extensions: [
    StarterKit.configure({
      link: { openOnClick: false },
    }),
    Placeholder.configure({ placeholder: props.placeholder }),
    Image.configure({ inline: false, allowBase64: true }),
  ],
  content: props.modelValue,
  onUpdate: ({ editor: current }) => {
    emit('update:modelValue', current.getHTML())
  },
})

watch(
  () => props.modelValue,
  (value) => {
    if (!editor.value) return
    if (value !== editor.value.getHTML()) {
      editor.value.commands.setContent(value ?? '', { emitUpdate: false })
    }
  },
)

watch(
  () => props.disabled,
  (value) => {
    editor.value?.setEditable(!value)
  },
)

interface ToolbarButton {
  key: string
  icon: Component
  label: string
  active?: () => boolean
  action: () => void
}

const toolbar = computed<ToolbarButton[]>(() => [
  {
    key: 'h2',
    icon: Heading2,
    label: 'Heading 2',
    active: () => editor.value?.isActive('heading', { level: 2 }) ?? false,
    action: () => editor.value?.chain().focus().toggleHeading({ level: 2 }).run(),
  },
  {
    key: 'h3',
    icon: Heading3,
    label: 'Heading 3',
    active: () => editor.value?.isActive('heading', { level: 3 }) ?? false,
    action: () => editor.value?.chain().focus().toggleHeading({ level: 3 }).run(),
  },
  {
    key: 'bold',
    icon: Bold,
    label: 'Tebal',
    active: () => editor.value?.isActive('bold') ?? false,
    action: () => editor.value?.chain().focus().toggleBold().run(),
  },
  {
    key: 'italic',
    icon: Italic,
    label: 'Miring',
    active: () => editor.value?.isActive('italic') ?? false,
    action: () => editor.value?.chain().focus().toggleItalic().run(),
  },
  {
    key: 'underline',
    icon: Underline,
    label: 'Garis bawah',
    active: () => editor.value?.isActive('underline') ?? false,
    action: () => editor.value?.chain().focus().toggleUnderline().run(),
  },
  {
    key: 'strike',
    icon: Strikethrough,
    label: 'Coret',
    active: () => editor.value?.isActive('strike') ?? false,
    action: () => editor.value?.chain().focus().toggleStrike().run(),
  },
  {
    key: 'bulletList',
    icon: List,
    label: 'Daftar poin',
    active: () => editor.value?.isActive('bulletList') ?? false,
    action: () => editor.value?.chain().focus().toggleBulletList().run(),
  },
  {
    key: 'orderedList',
    icon: ListOrdered,
    label: 'Daftar angka',
    active: () => editor.value?.isActive('orderedList') ?? false,
    action: () => editor.value?.chain().focus().toggleOrderedList().run(),
  },
  {
    key: 'blockquote',
    icon: Quote,
    label: 'Kutipan',
    active: () => editor.value?.isActive('blockquote') ?? false,
    action: () => editor.value?.chain().focus().toggleBlockquote().run(),
  },
  {
    key: 'code',
    icon: Code,
    label: 'Kode',
    active: () => editor.value?.isActive('code') ?? false,
    action: () => editor.value?.chain().focus().toggleCode().run(),
  },
  {
    key: 'link',
    icon: Link,
    label: 'Tautan',
    active: () => editor.value?.isActive('link') ?? false,
    action: () => {
      const previousUrl = (editor.value?.getAttributes('link').href as string | undefined) ?? ''
      const url = window.prompt('Masukkan URL tautan:', previousUrl || 'https://')
      if (url === null) return
      if (url === '') {
        editor.value?.chain().focus().extendMarkRange('link').unsetLink().run()
        return
      }
      editor.value?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    },
  },
  {
    key: 'image',
    icon: ImageIcon,
    label: 'Gambar',
    action: () => {
      const url = window.prompt('Masukkan URL gambar:')
      if (!url) return
      editor.value?.chain().focus().setImage({ src: url }).run()
    },
  },
  {
    key: 'clear',
    icon: RemoveFormatting,
    label: 'Hapus format',
    action: () => editor.value?.chain().focus().unsetAllMarks().clearNodes().run(),
  },
  {
    key: 'undo',
    icon: Undo2,
    label: 'Urungkan',
    action: () => editor.value?.chain().focus().undo().run(),
  },
  {
    key: 'redo',
    icon: Redo2,
    label: 'Ulangi',
    action: () => editor.value?.chain().focus().redo().run(),
  },
])

const DIVIDER_AFTER = new Set(['code', 'image'])
</script>

<template>
  <div class="flex flex-col gap-1 text-sm">
    <span v-if="label">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </span>
    <div
      class="overflow-hidden rounded-md border bg-surface transition-colors"
      :class="[
        isFocused ? 'border-primary ring-2 ring-primary/30' : 'border-border',
        error ? 'border-red-500' : '',
        disabled ? 'opacity-60' : '',
      ]"
      @focusin="isFocused = true"
      @focusout="isFocused = false"
    >
      <div class="flex flex-wrap items-center gap-0.5 border-b border-border bg-gray-50 px-1.5 py-1">
        <template v-for="button in toolbar" :key="button.key">
          <button
            type="button"
            class="inline-flex h-8 w-8 items-center justify-center rounded-md text-text-soft transition-colors hover:bg-gray-200/70 hover:text-heading disabled:cursor-not-allowed disabled:opacity-40"
            :class="button.active ? (button.active() ? 'bg-primary-100 text-primary' : '') : ''"
            :title="button.label"
            :aria-label="button.label"
            :disabled="disabled"
            @mousedown.prevent
            @click="button.action"
          >
            <component :is="button.icon" :size="15" />
          </button>
          <span
            v-if="DIVIDER_AFTER.has(button.key)"
            class="mx-1 h-5 w-px shrink-0 bg-border"
          />
        </template>
      </div>
      <div
        class="editor-content"
        :class="{ 'pointer-events-none': disabled }"
        :style="{ minHeight }"
      >
        <EditorContent :editor="editor" />
      </div>
    </div>
    <p v-if="error" class="flex items-center gap-1 text-xs text-red-500">
      <CircleAlert :size="12" />
      {{ error }}
    </p>
  </div>
</template>

<style scoped>
.editor-content {
  min-height: inherit;
}

.editor-content :deep(.ProseMirror) {
  padding: 0.75rem 0.875rem;
  outline: none;
  color: var(--color-heading);
}

.editor-content :deep(.ProseMirror > * + *) {
  margin-top: 0.5rem;
}

.editor-content :deep(.ProseMirror h1) {
  font-size: 1.375rem;
}
.editor-content :deep(.ProseMirror h2) {
  font-size: 1.25rem;
}
.editor-content :deep(.ProseMirror h3) {
  font-size: 1.125rem;
}
.editor-content :deep(.ProseMirror h1),
.editor-content :deep(.ProseMirror h2),
.editor-content :deep(.ProseMirror h3) {
  font-weight: 600;
  line-height: 1.25;
  color: var(--color-heading);
}

.editor-content :deep(.ProseMirror ul) {
  list-style: disc;
  padding-left: 1.25rem;
}
.editor-content :deep(.ProseMirror ol) {
  list-style: decimal;
  padding-left: 1.25rem;
}

.editor-content :deep(.ProseMirror blockquote) {
  border-left: 3px solid var(--color-primary-300);
  padding-left: 0.75rem;
  color: var(--color-text);
}

.editor-content :deep(.ProseMirror code) {
  background: var(--color-primary-50);
  padding: 0.125rem 0.375rem;
  border-radius: 0.375rem;
  font-size: 0.875em;
  color: var(--color-primary-700);
}

.editor-content :deep(.ProseMirror pre) {
  background: #111827;
  color: #f9fafb;
  padding: 0.75rem;
  border-radius: 0.5rem;
  overflow-x: auto;
}
.editor-content :deep(.ProseMirror pre code) {
  background: transparent;
  padding: 0;
  color: inherit;
}

.editor-content :deep(.ProseMirror a) {
  color: var(--color-primary-600);
  text-decoration: underline;
}

.editor-content :deep(.ProseMirror img) {
  max-width: 100%;
  border-radius: 0.5rem;
}

.editor-content :deep(.ProseMirror p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  float: left;
  color: var(--color-text-soft);
  pointer-events: none;
  height: 0;
}
</style>
