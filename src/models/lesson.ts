import type { Assignment } from './assignment'
import type { CourseAssignment } from './assignment'
import type { Quiz } from './quiz'
import type { CourseQuiz } from './quiz'

export type LessonFileKind = 'pdf' | 'zip' | 'doc' | 'ppt' | 'other'

export const LESSON_FILE_TYPES: { label: string; kind: LessonFileKind; accept: string[] }[] = [
  { label: 'PDF', kind: 'pdf', accept: ['.pdf'] },
  { label: 'ZIP', kind: 'zip', accept: ['.zip'] },
  { label: 'DOC/DOCX', kind: 'doc', accept: ['.doc', '.docx'] },
  { label: 'PPT/PPTX', kind: 'ppt', accept: ['.ppt', '.pptx'] },
]

export const LESSON_FILE_ACCEPT = LESSON_FILE_TYPES.flatMap((item) => item.accept).join(',')

export function resolveFileKind(name: string): LessonFileKind {
  const extension = name.toLowerCase().split('.').pop() ?? ''
  const match = LESSON_FILE_TYPES.find((item) => item.accept.includes(`.${extension}`))
  return match?.kind ?? 'other'
}

export interface LessonFile {
  id?: string
  name: string
  size?: number
  kind?: LessonFileKind
  url?: string
}

export interface Lesson {
  id?: string
  title: string
  description: string
  video_url?: string
  duration: number
  order_number: number
  is_preview: boolean
  files: LessonFile[]
  quiz?: Quiz
  assignment?: Assignment
}

export interface LessonPayload {
  section_id?: string
  title: string
  description: string
  video_url?: string
  duration: number
  order_number: number
  is_preview: boolean
}

export interface CourseLesson {
  id: string
  section_id: string
  title: string
  description: string
  video_url?: string
  duration: number
  order_number: number
  is_preview: boolean
  files: LessonFile[]
  quiz: CourseQuiz | null
  assignment: CourseAssignment | null
}

export function createEmptyLesson(): Lesson {
  return {
    title: '',
    description: '',
    duration: 0,
    order_number: 0,
    is_preview: false,
    files: [],
  }
}
