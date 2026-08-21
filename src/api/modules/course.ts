import { request } from '@/api/http'
import { endpoints } from '@/constants/endpoint'
import type { ApiResponse, Paginated } from '@/models/api'
import type { Course, CourseCardList, CourseDetail, CoursePayload } from '@/models/course'

export interface CourseCardQuery {
  page?: number
  pageSize?: number
  search?: string
  category?: string
  level?: string
}

export const courseApi = {
  async list(): Promise<Course[]> {
    const response = await request<ApiResponse<Course[]>>(endpoints.courses.list)
    return response.data ?? []
  },

  async listCard({
    page = 1,
    pageSize = 12,
    search,
    category,
    level,
  }: CourseCardQuery = {}): Promise<Paginated<CourseCardList>> {
    const response = await request<ApiResponse<CourseCardList[]>>(endpoints.courses.card, {
      params: {
        page,
        page_size: pageSize,
        search: search?.trim() || undefined,
        category: category || undefined,
        level: level || undefined,
      },
    })
    return {
      items: response.data ?? [],
      meta:
        response.meta ??
        { page, page_size: pageSize, total: response.data?.length ?? 0, total_pages: 1 },
    }
  },

  async create(payload: CoursePayload): Promise<Course> {
    const response = await request<ApiResponse<Course>>(endpoints.courses.list, {
      method: 'POST',
      body: payload,
    })
    return response.data
  },

  async get(id: string): Promise<Course> {
    const response = await request<ApiResponse<Course>>(endpoints.courses.detail(id))
    return response.data
  },

  async getDetail(id: string): Promise<CourseDetail> {
    const response = await request<ApiResponse<CourseDetail>>(endpoints.courses.detail(id))
    return response.data
  },

  async getDetailBySlug(slug: string): Promise<CourseDetail> {
    const response = await request<ApiResponse<CourseDetail>>(endpoints.courses.detailsBySlug(slug))
    return response.data
  },

  async update(id: string, payload: CoursePayload): Promise<Course> {
    const response = await request<ApiResponse<Course>>(endpoints.courses.detail(id), {
      method: 'PUT',
      body: payload,
    })
    return response.data
  },

  async remove(id: string): Promise<void> {
    await request<ApiResponse<null>>(endpoints.courses.detail(id), { method: 'DELETE' })
  },

  async publish(slug: string): Promise<void> {
    await request<ApiResponse<null>>(endpoints.courses.status(slug), {
      method: 'PATCH',
      body: { status: 'published' },
    })
  },

  async updateStatus(slug: string, status: 'draft' | 'published'): Promise<void> {
    await request<ApiResponse<null>>(endpoints.courses.status(slug), {
      method: 'PATCH',
      body: { status },
    })
  },
}
