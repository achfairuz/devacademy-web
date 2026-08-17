import { request } from '@/api/http'
import { endpoints } from '@/constants/endpoint'
import type { ApiResponse } from '@/models/api'
import type { Quiz, QuizPayload } from '@/models/quiz'

export const quizApi = {
  async create(
    courseId: string,
    sectionId: string,
    lessonId: string,
    payload: QuizPayload,
  ): Promise<Quiz> {
    const response = await request<ApiResponse<Quiz>>(
      endpoints.courses.lessonQuiz(courseId, sectionId, lessonId),
      { method: 'POST', body: payload },
    )
    return { ...response.data, questions: response.data.questions ?? [] }
  },

  async update(
    courseId: string,
    sectionId: string,
    lessonId: string,
    quizId: string,
    payload: QuizPayload,
  ): Promise<Quiz> {
    const response = await request<ApiResponse<Quiz>>(
      endpoints.courses.quizDetail(courseId, sectionId, lessonId, quizId),
      { method: 'PUT', body: payload },
    )
    return { ...response.data, questions: response.data.questions ?? [] }
  },

  async remove(
    courseId: string,
    sectionId: string,
    lessonId: string,
    quizId: string,
  ): Promise<void> {
    await request<ApiResponse<null>>(
      endpoints.courses.quizDetail(courseId, sectionId, lessonId, quizId),
      { method: 'DELETE' },
    )
  },
}
