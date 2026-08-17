import { request } from '@/api/http'
import { endpoints } from '@/constants/endpoint'
import type { ApiResponse } from '@/models/api'
import type { Assignment, AssignmentPayload } from '@/models/assignment'

export const assignmentApi = {
  async create(
    courseId: string,
    sectionId: string,
    lessonId: string,
    payload: AssignmentPayload,
  ): Promise<Assignment> {
    const response = await request<ApiResponse<Assignment>>(
      endpoints.courses.lessonAssignment(courseId, sectionId, lessonId),
      { method: 'POST', body: payload },
    )
    return response.data
  },

  async update(
    courseId: string,
    sectionId: string,
    lessonId: string,
    assignmentId: string,
    payload: AssignmentPayload,
  ): Promise<Assignment> {
    const response = await request<ApiResponse<Assignment>>(
      endpoints.courses.assignmentDetail(courseId, sectionId, lessonId, assignmentId),
      { method: 'PUT', body: payload },
    )
    return response.data
  },

  async remove(
    courseId: string,
    sectionId: string,
    lessonId: string,
    assignmentId: string,
  ): Promise<void> {
    await request<ApiResponse<null>>(
      endpoints.courses.assignmentDetail(courseId, sectionId, lessonId, assignmentId),
      { method: 'DELETE' },
    )
  },
}
