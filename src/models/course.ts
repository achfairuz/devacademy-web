export type CourseStatus = 'draft' | 'published'
export type CourseLevel = 'beginner' | 'intermediate' | 'advanced'
export type QuestionType = 'multiple_choice' | 'true_false'
export type LessonFileKind = 'pdf' | 'zip' | 'doc' | 'ppt' | 'other'

export const COURSE_LEVELS: { value: CourseLevel; label: string }[] = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
]

export const QUESTION_TYPES: { value: QuestionType; label: string }[] = [
  { value: 'multiple_choice', label: 'Multiple Choice' },
  { value: 'true_false', label: 'True / False' },
]

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

export interface Section {
  id?: string
  title: string
  order_number: number
  lessons: Lesson[]
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

export interface LessonFile {
  id?: string
  name: string
  size?: number
  kind?: LessonFileKind
  url?: string
}

export interface Quiz {
  id?: string
  title: string
  passing_score: number
  questions: QuizQuestion[]
}

export interface QuizQuestion {
  id?: string
  question_text: string
  type: QuestionType
  options: QuizOption[]
}

export interface QuizOption {
  id?: string
  option_text: string
  is_correct: boolean
}

export interface Assignment {
  id?: string
  title: string
  description: string
  due_date: string
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

export interface SectionPayload {
  course_id?: string
  title: string
  order_number: number
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

export interface QuizOptionPayload {
  option_text: string
  is_correct: boolean
}

export interface QuizQuestionPayload {
  question_text: string
  type: QuestionType
  options: QuizOptionPayload[]
}

export interface QuizPayload {
  lesson_id?: string
  title: string
  passing_score: number
  questions: QuizQuestionPayload[]
}

export interface AssignmentPayload {
  lesson_id?: string
  title: string
  description: string
  due_date: string
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

export interface CourseQuizOption {
  id: string
  option_text: string
}

export interface CourseQuizQuestion {
  id: string
  question: string
  question_type: QuestionType
  options: CourseQuizOption[]
}

export interface CourseQuiz {
  id: string
  title: string
  passing_score: number
  questions: CourseQuizQuestion[]
}

export interface CourseAssignment {
  id: string
  title: string
  description: string
  due_date: string
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

export interface CourseSection {
  id: string
  course_id: string
  title: string
  order_number: number
  lessons: CourseLesson[]
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
  sections: CourseSection[]
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

export function createEmptyQuiz(): Quiz {
  return {
    title: '',
    passing_score: 60,
    questions: [],
  }
}

export function createEmptyQuestion(): QuizQuestion {
  return {
    question_text: '',
    type: 'multiple_choice',
    options: [
      { option_text: '', is_correct: false },
      { option_text: '', is_correct: false },
    ],
  }
}

export function createEmptyOption(): QuizOption {
  return { option_text: '', is_correct: false }
}

export function createEmptyAssignment(): Assignment {
  return {
    title: '',
    description: '',
    due_date: '',
  }
}
