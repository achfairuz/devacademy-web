import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'

import { assignmentApi } from '@/api/modules/assignment'
import { courseApi } from '@/api/modules/course'
import { lessonApi } from '@/api/modules/lesson'
import { quizApi } from '@/api/modules/quiz'
import { sectionApi } from '@/api/modules/section'
import { COURSE_LEVELS, createEmptyCourse, type Course, type CourseChecklistItem, type CourseLevel, type CoursePayload } from '@/models/course'
import type { AssignmentPayload } from '@/models/assignment'
import type { Lesson } from '@/models/lesson'
import type { QuizPayload } from '@/models/quiz'
import type { Section } from '@/models/section'
import { courseDraftService } from '@/services/courseDraftService'
import { cloneDeep } from '@/utils/clone'

export type StepNumber = 1 | 2 | 3

export const STEP_META: { title: string; short: string }[] = [
  { title: 'Course Information', short: 'Informasi' },
  { title: 'Curriculum', short: 'Kurikulum' },
  { title: 'Review & Publish', short: 'Review' },
]

export interface ToastState {
  message: string
  type?: 'success' | 'error' | 'info'
}

let uid = 0

function makeId(prefix: string): string {
  uid += 1
  return `temp-${prefix}-${Date.now().toString(36)}-${uid}`
}

function clone<T>(value: T): T {
  return cloneDeep(value)
}

export function useCourseBuilder(options: { courseId?: string } = {}) {
  const router = useRouter()
  const isEditing = Boolean(options.courseId)

  const course = reactive<Course>(createEmptyCourse())
  const step = ref<StepNumber>(1)
  const loading = ref(false)
  const saving = ref(false)
  const publishing = ref(false)
  const dirty = ref(false)
  const localOnly = ref(false)
  const loadError = ref<string | null>(null)
  const toast = ref<ToastState | null>(null)
  const infoErrors = reactive<Record<string, string>>({})

  let loaded = false
  let autosaveTimer: ReturnType<typeof setTimeout> | undefined

  function showToast(message: string, type: ToastState['type'] = 'success') {
    toast.value = { message, type }
  }

  function markDirty() {
    dirty.value = true
  }

  function saveLocalDraft() {
    try {
      courseDraftService.save(clone(course))
    } catch (error) {
      console.error('[course-builder] Gagal menyimpan draft lokal.', error)
    }
  }

  // ------------------------------------------------------------------
  // Validation
  // ------------------------------------------------------------------

  function validateInfo(): boolean {
    infoErrors.title = course.title.trim() ? '' : 'Judul course wajib diisi.'
    infoErrors.description = course.description.trim() ? '' : 'Deskripsi course wajib diisi.'
    infoErrors.category_id = course.category_id ? '' : 'Pilih kategori course.'
    infoErrors.price = course.price > 0 ? '' : 'Harga course wajib diisi.'
    infoErrors.level = COURSE_LEVELS.some((item) => item.value === course.level)
      ? ''
      : 'Pilih level course.'
    return Object.values(infoErrors).every((error) => !error)
  }

  const reviewChecklist = computed<CourseChecklistItem[]>(() => {
    const items: CourseChecklistItem[] = [
      { key: 'title', label: 'Judul course diisi', valid: course.title.trim() !== '' },
      { key: 'description', label: 'Deskripsi course diisi', valid: course.description.trim() !== '' },
      { key: 'category', label: 'Kategori dipilih', valid: Boolean(course.category_id) },
      { key: 'thumbnail', label: 'Thumbnail diunggah', valid: Boolean(course.thumbnail) },
      { key: 'price', label: 'Harga diisi', valid: course.price > 0 },
      { key: 'sections', label: 'Minimal satu section', valid: course.sections.length > 0 },
    ]

    course.sections.forEach((section) => {
      if (section.lessons.length === 0) {
        items.push({
          key: `section-empty-${section.id}`,
          label: `Section "${section.title}" memiliki minimal satu lesson`,
          valid: false,
          message: `Section "${section.title}" belum memiliki lesson.`,
        })
      }
    })

    course.sections.forEach((section) => {
      section.lessons.forEach((lesson) => {
        if (!lesson.title.trim()) {
          items.push({
            key: `lesson-title-${lesson.id}`,
            label: 'Setiap lesson memiliki judul',
            valid: false,
            message: 'Ada lesson yang belum memiliki judul.',
          })
        }
        const hasContent =
          Boolean(lesson.video_url) ||
          lesson.files.length > 0 ||
          Boolean(lesson.quiz) ||
          Boolean(lesson.assignment)
        if (!hasContent) {
          items.push({
            key: `lesson-content-${lesson.id}`,
            label: `Lesson "${lesson.title}" memiliki konten`,
            valid: false,
            message: `Lesson "${lesson.title}" belum memiliki konten (video, file, quiz, atau assignment).`,
          })
        }
        if (lesson.quiz && lesson.quiz.questions.length === 0) {
          items.push({
            key: `quiz-${lesson.id}`,
            label: `Quiz "${lesson.quiz.title}" memiliki pertanyaan`,
            valid: false,
            message: `Quiz "${lesson.quiz.title}" belum memiliki pertanyaan.`,
          })
        }
      })
    })

    return items
  })

  const reviewValid = computed(() => reviewChecklist.value.every((item) => item.valid))

  // ------------------------------------------------------------------
  // Sections
  // ------------------------------------------------------------------

  function addSection(): Section {
    const section: Section = {
      id: makeId('section'),
      title: `Section ${course.sections.length + 1}`,
      order_number: course.sections.length,
      lessons: [],
    }
    course.sections.push(section)
    markDirty()
    return section
  }

  function renameSection(sectionId: string, title: string) {
    const section = findSection(sectionId)
    if (!section) return
    section.title = title.trim() || section.title
    markDirty()
  }

  function removeSection(sectionId: string) {
    course.sections = course.sections.filter((section) => section.id !== sectionId)
    course.sections.forEach((section, index) => {
      section.order_number = index
    })
    markDirty()
  }

  function moveSection(fromIndex: number, toIndex: number) {
    const sections = course.sections
    if (
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= sections.length ||
      toIndex >= sections.length ||
      fromIndex === toIndex
    ) {
      return
    }
    const [moved] = sections.splice(fromIndex, 1)
    if (!moved) return
    sections.splice(toIndex, 0, moved)
    sections.forEach((section, index) => {
      section.order_number = index
    })
    markDirty()
  }

  // ------------------------------------------------------------------
  // Lessons
  // ------------------------------------------------------------------

  function findSection(sectionId: string): Section | undefined {
    return course.sections.find((section) => section.id === sectionId)
  }

  function addLesson(sectionId: string, lesson: Lesson): Lesson | undefined {
    const section = findSection(sectionId)
    if (!section) return undefined
    const next: Lesson = {
      ...lesson,
      id: lesson.id ?? makeId('lesson'),
      order_number: section.lessons.length,
    }
    section.lessons.push(next)
    markDirty()
    return next
  }

  function updateLesson(sectionId: string, lessonId: string, patch: Lesson) {
    const section = findSection(sectionId)
    if (!section) return
    const index = section.lessons.findIndex((lesson) => lesson.id === lessonId)
    const current = section.lessons[index]
    if (index === -1 || !current) return
    section.lessons[index] = { ...patch, id: lessonId, order_number: current.order_number }
    markDirty()
  }

  function removeLesson(sectionId: string, lessonId: string) {
    const section = findSection(sectionId)
    if (!section) return
    section.lessons = section.lessons.filter((lesson) => lesson.id !== lessonId)
    section.lessons.forEach((lesson, index) => {
      lesson.order_number = index
    })
    markDirty()
  }

  function moveLesson(sectionId: string, fromIndex: number, toIndex: number) {
    const section = findSection(sectionId)
    if (!section) return
    const lessons = section.lessons
    if (
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= lessons.length ||
      toIndex >= lessons.length ||
      fromIndex === toIndex
    ) {
      return
    }
    const [moved] = lessons.splice(fromIndex, 1)
    if (!moved) return
    lessons.splice(toIndex, 0, moved)
    lessons.forEach((lesson, index) => {
      lesson.order_number = index
    })
    markDirty()
  }

  // ------------------------------------------------------------------
  // Step navigation
  // ------------------------------------------------------------------

  function goTo(next: StepNumber) {
    if (next === step.value) return
    if (next > step.value && step.value === 1 && !validateInfo()) {
      showToast('Lengkapi informasi course terlebih dahulu.', 'error')
      return
    }
    step.value = next
  }

  function next() {
    if (step.value === 1) {
      if (!validateInfo()) {
        showToast('Lengkapi informasi course terlebih dahulu.', 'error')
        return
      }
      step.value = 2
      return
    }
    if (step.value === 2) {
      if (course.sections.length === 0) {
        showToast('Tambahkan minimal satu section terlebih dahulu.', 'error')
        return
      }
      step.value = 3
    }
  }

  function back() {
    if (step.value > 1) {
      step.value = (step.value - 1) as StepNumber
    }
  }

  // ------------------------------------------------------------------
  // Persistence
  // ------------------------------------------------------------------

  function toPayload(): CoursePayload {
    return {
      title: course.title.trim(),
      description: course.description.trim(),
      category_id: course.category_id,
      thumbnail: course.thumbnail || undefined,
      price: course.price,
      level: course.level as CourseLevel,
      duration: course.duration,
      status: course.status,
    }
  }

  async function syncQuiz(courseId: string, sectionId: string, lessonId: string, lesson: Lesson) {
    const quiz = lesson.quiz
    if (!quiz) return
    const payload: QuizPayload = {
      title: quiz.title,
      passing_score: quiz.passing_score,
      questions: quiz.questions.map((question) => ({
        question_text: question.question_text,
        type: question.type,
        options: question.options.map((option) => ({
          option_text: option.option_text,
          is_correct: option.is_correct,
        })),
      })),
    }
    const existingId = quiz.id && !quiz.id.startsWith('temp-') ? quiz.id : undefined
    try {
      if (existingId) {
        await quizApi.update(courseId, sectionId, lessonId, existingId, payload)
      } else {
        const created = await quizApi.create(courseId, sectionId, lessonId, payload)
        quiz.id = created.id
      }
    } catch {
      return
    }
  }

  async function syncAssignment(courseId: string, sectionId: string, lessonId: string, lesson: Lesson) {
    const assignment = lesson.assignment
    if (!assignment) return
    const payload: AssignmentPayload = {
      title: assignment.title,
      description: assignment.description,
      due_date: assignment.due_date,
    }
    const existingId =
      assignment.id && !assignment.id.startsWith('temp-') ? assignment.id : undefined
    try {
      if (existingId) {
        await assignmentApi.update(courseId, sectionId, lessonId, existingId, payload)
      } else {
        const created = await assignmentApi.create(courseId, sectionId, lessonId, payload)
        assignment.id = created.id
      }
    } catch {
      return
    }
  }

  async function syncCurriculum(): Promise<void> {
    const courseId = course.id
    if (!courseId) return

    for (const section of course.sections) {
      const existingSectionId =
        section.id && !section.id.startsWith('temp-') ? section.id : undefined
      let sectionId = existingSectionId
      if (!sectionId) {
        try {
          const created = await sectionApi.create(courseId, {
            title: section.title,
            order_number: section.order_number,
          })
          sectionId = created.id
          section.id = created.id
        } catch {
          continue
        }
      } else {
        try {
          await sectionApi.update(courseId, sectionId, {
            title: section.title,
            order_number: section.order_number,
          })
        } catch {
          continue
        }
      }

      if (!sectionId) continue

      for (const lesson of section.lessons) {
        const existingLessonId =
          lesson.id && !lesson.id.startsWith('temp-') ? lesson.id : undefined
        let lessonId = existingLessonId
        if (!lessonId) {
          try {
            const created = await lessonApi.create(courseId, sectionId, {
              title: lesson.title,
              description: lesson.description,
              video_url: lesson.video_url || undefined,
              duration: lesson.duration,
              order_number: lesson.order_number,
              is_preview: lesson.is_preview,
            })
            lessonId = created.id
            lesson.id = created.id
          } catch {
            continue
          }
        } else {
          try {
            await lessonApi.update(courseId, sectionId, lessonId, {
              title: lesson.title,
              description: lesson.description,
              video_url: lesson.video_url || undefined,
              duration: lesson.duration,
              order_number: lesson.order_number,
              is_preview: lesson.is_preview,
            })
          } catch {
            continue
          }
        }

        if (!lessonId) continue

        await syncQuiz(courseId, sectionId, lessonId, lesson)
        await syncAssignment(courseId, sectionId, lessonId, lesson)
      }
    }
  }

  async function saveDraft(): Promise<boolean> {
    saving.value = true
    try {
      if (course.id) {
        const updated = await courseApi.update(course.id, toPayload())
        course.slug = updated.slug ?? course.slug
      } else {
        const created = await courseApi.create(toPayload())
        course.id = created.id
        course.slug = created.slug ?? course.slug
      }
      localOnly.value = false
      await syncCurriculum()
      showToast('Draft course berhasil disimpan.')
    } catch (error) {
      console.error('[course-builder] Backend tidak tersedia, draft disimpan secara lokal.', error)
      localOnly.value = true
      showToast('Draft disimpan secara lokal (backend belum tersedia).', 'info')
    } finally {
      saveLocalDraft()
      dirty.value = false
      saving.value = false
    }
    return true
  }

  async function publish(): Promise<void> {
    if (!reviewValid.value) {
      const invalidCount = reviewChecklist.value.filter((item) => !item.valid).length
      showToast(`Masih ada ${invalidCount} item yang belum lengkap untuk dipublikasikan.`, 'error')
      return
    }

    publishing.value = true
    try {
      course.status = 'published'

      if (!course.id) {
        try {
          const created = await courseApi.create(toPayload())
          course.id = created.id
        } catch (error) {
          console.error('[course-builder] Gagal membuat course di backend.', error)
        }
      }

      if (course.id) {
        try {
          const updated = await courseApi.update(course.id, toPayload())
          course.slug = updated.slug ?? course.slug
          if (course.slug) {
            await courseApi.publish(course.slug)
          }
          await syncCurriculum()
          localOnly.value = false
        } catch (error) {
          console.error('[course-builder] Gagal memublikasikan course di backend.', error)
          localOnly.value = true
        }
      } else {
        localOnly.value = true
      }

      saveLocalDraft()
      dirty.value = false
      showToast('Course berhasil dipublikasikan!')
      window.setTimeout(() => {
        void router.push({ name: 'mentor-courses' })
      }, 900)
    } finally {
      publishing.value = false
    }
  }

  // ------------------------------------------------------------------
  // Load (create restore / edit fetch)
  // ------------------------------------------------------------------

  async function load() {
    if (loaded) return
    loaded = true

    if (!isEditing) {
      const draft = courseDraftService.loadPending()
      if (draft) Object.assign(course, draft)
      return
    }

    const id = options.courseId as string
    loading.value = true
    loadError.value = null
    try {
      try {
        const data = await courseApi.get(id)
        Object.assign(course, data)
      } catch (error) {
        console.error('[course-builder] Gagal memuat course dari backend, mencoba draft lokal.', error)
        const draft = courseDraftService.load(id)
        if (draft) {
          Object.assign(course, draft)
        } else {
          loadError.value = 'Course tidak ditemukan.'
        }
      }
      dirty.value = false
    } finally {
      loading.value = false
    }
  }

  // ------------------------------------------------------------------
  // Unsaved-changes guard + autosave
  // ------------------------------------------------------------------

  function onBeforeUnload(event: BeforeUnloadEvent) {
    if (dirty.value) {
      event.preventDefault()
      event.returnValue = ''
    }
  }

  window.addEventListener('beforeunload', onBeforeUnload)

  onBeforeRouteLeave(() => !dirty.value)

  watch(
    () => JSON.stringify(course),
    () => {
      if (!loaded || loading.value || saving.value || publishing.value) return
      markDirty()
      if (autosaveTimer) clearTimeout(autosaveTimer)
      autosaveTimer = setTimeout(() => {
        saveLocalDraft()
      }, 1500)
    },
  )

  onBeforeUnmount(() => {
    window.removeEventListener('beforeunload', onBeforeUnload)
    if (autosaveTimer) clearTimeout(autosaveTimer)
  })

  return reactive({
    course,
    isEditing,
    step,
    loading,
    saving,
    publishing,
    dirty,
    localOnly,
    loadError,
    toast,
    infoErrors,
    reviewChecklist,
    reviewValid,
    showToast,
    validateInfo,
    addSection,
    renameSection,
    removeSection,
    moveSection,
    findSection,
    addLesson,
    updateLesson,
    removeLesson,
    moveLesson,
    goTo,
    next,
    back,
    saveDraft,
    publish,
    load,
    markDirty,
  })
}

export type CourseBuilder = ReturnType<typeof useCourseBuilder>
