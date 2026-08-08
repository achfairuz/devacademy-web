<script setup lang="ts">
import { CalendarClock } from '@lucide/vue'

import BaseInput from '@/components/base/BaseInput.vue'
import RichTextEditor from '@/components/base/RichTextEditor.vue'
import type { Assignment } from '@/models/course'

defineProps<{
  assignment: Assignment
}>()
</script>

<template>
  <div class="flex flex-col gap-4">
    <BaseInput v-model="assignment.title" label="Judul Assignment" placeholder="cth: Tugas Membuat Routing Sederhana" />

    <RichTextEditor
      v-model="assignment.description"
      label="Deskripsi"
      placeholder="Jelaskan instruksi pengerjaan assignment..."
      min-height="140px"
    />

    <div class="flex flex-col gap-1">
      <span class="text-sm">Due Date</span>
      <div class="relative">
        <CalendarClock
          :size="15"
          class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-soft"
        />
        <input
          :value="assignment.due_date"
          type="datetime-local"
          class="w-full rounded-md border border-border bg-surface py-2 pl-9 pr-3 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30"
          @input="assignment.due_date = ($event.target as HTMLInputElement).value"
        />
      </div>
      <p class="text-xs text-text-soft">Batas waktu pengumpulan tugas siswa.</p>
    </div>
  </div>
</template>
