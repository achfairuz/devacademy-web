import { request } from '@/api/http'
import { endpoints } from '@/constants/endpoint'
import type { ApiResponse } from '@/models/api'
import type { Lesson, LessonFile, LessonPayload } from '@/models/lesson'

export const lessonApi = {
  async create(courseId: string, sectionId: string, payload: LessonPayload): Promise<Lesson> {
    const response = await request<ApiResponse<Lesson>>(
      endpoints.courses.lessons(courseId, sectionId),
      { method: 'POST', body: payload },
    )
    return { ...response.data, files: response.data.files ?? [] }
  },

  async update(
    courseId: string,
    sectionId: string,
    lessonId: string,
    payload: LessonPayload,
  ): Promise<Lesson> {
    const response = await request<ApiResponse<Lesson>>(
      endpoints.courses.lessonDetail(courseId, sectionId, lessonId),
      { method: 'PUT', body: payload },
    )
    return { ...response.data, files: response.data.files ?? [] }
  },

  async remove(courseId: string, sectionId: string, lessonId: string): Promise<void> {
    await request<ApiResponse<null>>(
      endpoints.courses.lessonDetail(courseId, sectionId, lessonId),
      { method: 'DELETE' },
    )
  },

  async createFile(
    courseId: string,
    sectionId: string,
    lessonId: string,
    file: File,
  ): Promise<LessonFile> {
    const body = new FormData()
    body.append('file', file)
    const response = await request<ApiResponse<LessonFile>>(
      endpoints.courses.lessonFiles(courseId, sectionId, lessonId),
      { method: 'POST', body },
    )
    return response.data
  },

  async deleteFile(
    courseId: string,
    sectionId: string,
    lessonId: string,
    fileId: string,
  ): Promise<void> {
    await request<ApiResponse<null>>(
      endpoints.courses.lessonFileDetail(courseId, sectionId, lessonId, fileId),
      { method: 'DELETE' },
    )
  },
}
