import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { reactive } from 'vue'

import CurriculumStep from '@/components/course-builder/CurriculumStep.vue'
import type { CourseBuilder } from '@/hooks/useCourseBuilder'
import { createEmptyLesson, createEmptyCourse } from '@/models/course'

function makeBuilder(): CourseBuilder {
  const course = reactive(createEmptyCourse())
  course.sections.push({
    id: 'temp-section-1',
    title: 'Section 1',
    order_number: 0,
    lessons: [],
  })

  return reactive({
    course,
    isEditing: false,
    step: 2,
    loading: false,
    saving: false,
    publishing: false,
    dirty: false,
    localOnly: false,
    loadError: null,
    toast: null,
    infoErrors: {},
    reviewChecklist: [],
    reviewValid: false,
    showToast: () => undefined,
    validateInfo: () => true,
    addSection: () => undefined,
    renameSection: () => undefined,
    removeSection: () => undefined,
    moveSection: () => undefined,
    findSection: () => undefined,
    addLesson: (sectionId: string, lesson: ReturnType<typeof createEmptyLesson>) => {
      const section = course.sections.find((s) => s.id === sectionId)
      section?.lessons.push({ ...lesson, id: 'temp-lesson-1', order_number: 0 })
      return undefined
    },
    updateLesson: () => undefined,
    removeLesson: () => undefined,
    moveLesson: () => undefined,
    goTo: () => undefined,
    next: () => undefined,
    back: () => undefined,
    saveDraft: () => undefined,
    publish: () => undefined,
    load: () => undefined,
    markDirty: () => undefined,
  } as unknown as CourseBuilder)
}

describe('CurriculumStep add lesson', () => {
  it('opens the lesson drawer when Add Lesson is clicked', async () => {
    const builder = makeBuilder()
    const wrapper = mount(CurriculumStep, {
      props: { builder },
      global: {
        stubs: {
          Teleport: true,
          transition: false,
        },
      },
    })

    const buttons = wrapper.findAll('button')
    const addLessonButton = buttons.find((button) => button.text().includes('Add Lesson'))
    expect(addLessonButton).toBeTruthy()

    await addLessonButton!.trigger('click')
    await flushPromises()

    expect(wrapper.findComponent({ name: 'LessonEditorDrawer' }).props('modelValue')).toBe(true)
  })

  it('adds a lesson to the section after filling and saving the drawer', async () => {
    const builder = makeBuilder()
    const wrapper = mount(CurriculumStep, {
      props: { builder },
      global: {
        stubs: {
          Teleport: true,
          transition: false,
        },
      },
    })

    const addLessonButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Add Lesson'))
    await addLessonButton!.trigger('click')
    await flushPromises()

    const drawer = wrapper.findComponent({ name: 'LessonEditorDrawer' })
    const titleInput = drawer.find('input')
    await titleInput.setValue('Pengenalan Routing')

    const saveButton = drawer
      .findAll('button')
      .find((button) => button.text().includes('Simpan Lesson'))
    await saveButton!.trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('Pengenalan Routing')
    expect(builder.course.sections[0]?.lessons).toHaveLength(1)
  })
})
