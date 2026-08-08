<script setup lang="ts">
import { CircleAlert, Plus, Trash2 } from '@lucide/vue'

import BaseInput from '@/components/base/BaseInput.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import BaseTextarea from '@/components/base/BaseTextarea.vue'
import {
  createEmptyOption,
  createEmptyQuestion,
  QUESTION_TYPES,
  type QuestionType,
  type Quiz,
  type QuizQuestion,
} from '@/models/course'

const props = defineProps<{
  quiz: Quiz
}>()

const questionTypeOptions = QUESTION_TYPES.map((item) => ({ value: item.value, label: item.label }))

function addQuestion() {
  props.quiz.questions.push(createEmptyQuestion())
}

function removeQuestion(index: number) {
  props.quiz.questions.splice(index, 1)
}

function onTypeChange(question: QuizQuestion, type: QuestionType) {
  question.type = type
  if (type === 'true_false') {
    question.options = [
      { option_text: 'Benar', is_correct: false },
      { option_text: 'Salah', is_correct: false },
    ]
  } else if (question.options.length === 0) {
    question.options = [createEmptyOption(), createEmptyOption()]
  }
}

function addOption(question: QuizQuestion) {
  question.options.push(createEmptyOption())
}

function removeOption(question: QuizQuestion, index: number) {
  question.options.splice(index, 1)
}

function setCorrect(question: QuizQuestion, index: number) {
  question.options.forEach((option, optionIndex) => {
    option.is_correct = optionIndex === index
  })
}

function isCorrect(question: QuizQuestion, index: number): boolean {
  return Boolean(question.options[index]?.is_correct)
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <BaseInput
        v-model="quiz.title"
        label="Judul Quiz"
        placeholder="cth: Quiz Dasar Routing"
      />
      <div class="flex flex-col gap-1">
        <span class="text-sm">Passing Score (%)</span>
        <input
          :value="quiz.passing_score"
          type="number"
          min="0"
          max="100"
          class="w-full rounded-md border border-border bg-surface px-3 py-2 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30"
          @input="quiz.passing_score = Math.max(0, Math.min(100, Number(($event.target as HTMLInputElement).value) || 0))"
        />
      </div>
    </div>

    <div class="flex items-center justify-between">
      <div>
        <h4 class="text-sm font-semibold text-heading">Pertanyaan</h4>
        <p class="text-xs text-text-soft">{{ quiz.questions.length }} pertanyaan</p>
      </div>
      <button
        type="button"
        class="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-semibold text-primary transition-colors hover:border-primary/40 hover:bg-primary-50"
        @click="addQuestion"
      >
        <Plus :size="14" />
        Tambah Pertanyaan
      </button>
    </div>

    <div v-if="quiz.questions.length === 0" class="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border py-10 text-center">
      <CircleAlert :size="26" class="text-text-soft" />
      <p class="text-sm font-medium text-heading">Belum ada pertanyaan</p>
      <p class="text-xs text-text-soft">Tambahkan pertanyaan untuk quiz ini.</p>
    </div>

    <div v-else class="flex flex-col gap-4">
      <div
        v-for="(question, questionIndex) in quiz.questions"
        :key="questionIndex"
        class="flex flex-col gap-3 rounded-xl border border-border bg-gray-50/50 p-4"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex min-w-0 flex-1 flex-col gap-1">
            <p class="text-xs font-semibold uppercase tracking-wide text-text-soft">
              Pertanyaan {{ questionIndex + 1 }}
            </p>
            <BaseTextarea
              v-model="question.question_text"
              placeholder="Tulis pertanyaan..."
              :rows="2"
            />
          </div>
          <button
            type="button"
            class="shrink-0 rounded-md p-1.5 text-text-soft transition-colors hover:bg-red-50 hover:text-red-600"
            :aria-label="`Hapus pertanyaan ${questionIndex + 1}`"
            @click="removeQuestion(questionIndex)"
          >
            <Trash2 :size="15" />
          </button>
        </div>

        <BaseSelect
          :model-value="question.type"
          :options="questionTypeOptions"
          label="Tipe Pertanyaan"
          @update:model-value="onTypeChange(question, $event as QuestionType)"
        />

        <div class="flex flex-col gap-2">
          <p class="text-xs font-medium text-text-soft">Pilihan Jawaban</p>

          <div
            v-for="(option, optionIndex) in question.options"
            :key="optionIndex"
            class="flex items-center gap-2 rounded-lg border bg-surface px-3 py-2 transition-colors"
            :class="isCorrect(question, optionIndex) ? 'border-emerald-300 bg-emerald-50/60' : 'border-border'"
          >
            <input
              type="radio"
              class="h-4 w-4 shrink-0 cursor-pointer accent-emerald-600"
              :name="`correct-option-${questionIndex}`"
              :checked="isCorrect(question, optionIndex)"
              :title="'Jadikan kunci jawaban'"
              :aria-label="`Jadikan kunci jawaban untuk pertanyaan ${questionIndex + 1}`"
              @change="setCorrect(question, optionIndex)"
            />
            <input
              v-if="question.type === 'multiple_choice'"
              v-model="option.option_text"
              type="text"
              placeholder="Teks pilihan jawaban..."
              class="w-full border-0 bg-transparent px-1 py-0.5 text-sm text-heading outline-none"
            />
            <span v-else class="flex-1 px-1 py-0.5 text-sm font-medium text-heading">
              {{ option.option_text }}
            </span>
            <button
              v-if="question.type === 'multiple_choice' && question.options.length > 2"
              type="button"
              class="shrink-0 rounded-md p-1 text-text-soft transition-colors hover:bg-red-50 hover:text-red-600"
              :aria-label="`Hapus pilihan ${optionIndex + 1}`"
              @click="removeOption(question, optionIndex)"
            >
              <Trash2 :size="14" />
            </button>
          </div>

          <button
            v-if="question.type === 'multiple_choice'"
            type="button"
            class="inline-flex w-fit items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary-50"
            @click="addOption(question)"
          >
            <Plus :size="13" />
            Add Option
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
