import type { CourseLesson, Lesson } from './lesson'

export interface Section {
  id?: string
  title: string
  order_number: number
  lessons: Lesson[]
}

export interface SectionPayload {
  course_id?: string
  title: string
  order_number: number
}

export interface CourseSection {
  id: string
  course_id: string
  title: string
  order_number: number
  lessons: CourseLesson[]
}
