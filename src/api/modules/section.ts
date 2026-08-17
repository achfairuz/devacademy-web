import { request } from '@/api/http'
import { endpoints } from '@/constants/endpoint'
import type { ApiResponse } from '@/models/api'
import type { Section, SectionPayload } from '@/models/section'

export const sectionApi = {
  async create(courseId: string, payload: SectionPayload): Promise<Section> {
    const response = await request<ApiResponse<Section>>(endpoints.courses.sections(courseId), {
      method: 'POST',
      body: payload,
    })
    return { ...response.data, lessons: response.data.lessons ?? [] }
  },

  async update(courseId: string, sectionId: string, payload: SectionPayload): Promise<Section> {
    const response = await request<ApiResponse<Section>>(
      endpoints.courses.sectionDetail(courseId, sectionId),
      { method: 'PUT', body: payload },
    )
    return { ...response.data, lessons: response.data.lessons ?? [] }
  },

  async remove(courseId: string, sectionId: string): Promise<void> {
    await request<ApiResponse<null>>(endpoints.courses.sectionDetail(courseId, sectionId), {
      method: 'DELETE',
    })
  },
}
