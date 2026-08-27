import type { CourseSection, Section } from './section'

export type CourseStatus = 'draft' | 'published'
export type CourseLevel = 'beginner' | 'intermediate' | 'advanced'

export const COURSE_LEVELS: { value: CourseLevel; label: string }[] = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
]

export interface Course {
  id?: string
  slug?: string
  title: string
  description: string
  category_id: string
  thumbnail?: string
  price: number
  level: CourseLevel
  duration: number
  status: CourseStatus
  sections: Section[]
}

export interface CoursePayload {
  title: string
  description: string
  category_id: string
  thumbnail?: string
  price: number
  level: CourseLevel
  duration: number
  status?: CourseStatus
}

export interface CourseChecklistItem {
  key: string
  label: string
  valid: boolean
  message?: string
}

export interface CourseMentor {
  id: string
  full_name: string
  username: string
  email: string
  avatar: string
  role: string
}

export interface CourseCategoryRef {
  id: string
  name: string
  slug: string
  icon?: string
}

export interface CourseLevelRef {
  id: string
  name: string
  slug: string
}

export interface CourseDetail {
  id: string
  mentor_id: string
  category_id: string
  level_id: string
  title: string
  slug: string
  description: string
  thumbnail: string
  price: number
  duration: number
  status: CourseStatus
  created_at: string
  updated_at: string
  mentor: CourseMentor | null
  category: CourseCategoryRef | null
  level: CourseLevelRef | null
  progress?: number
  sections: CourseSection[]
}

export interface CourseCardList {
  id: string
  title: string
  slug: string
  description: string
  thumbnail: string
  price: number
  duration: number
  status: CourseStatus
  mentor: CourseMentor | null
  category: CourseCategoryRef | null
  level: CourseLevelRef | null
  total_modules: number
  progress: number
  total_bought: number
  total_rated: number
}

export function createEmptyCourse(): Course {
  return {
    title: '',
    description: '',
    category_id: '',
    price: 0,
    level: 'beginner',
    duration: 0,
    status: 'draft',
    sections: [],
  }
}
