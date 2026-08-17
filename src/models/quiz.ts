export type QuestionType = 'multiple_choice' | 'true_false'

export const QUESTION_TYPES: { value: QuestionType; label: string }[] = [
  { value: 'multiple_choice', label: 'Multiple Choice' },
  { value: 'true_false', label: 'True / False' },
]

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
