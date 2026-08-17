import { request } from '@/api/http'
import { endpoints } from '@/constants/endpoint'
import type { ApiResponse } from '@/models/api'
import type { Category } from '@/models/category'

export async function getCategories(): Promise<Category[]> {
  const response = await request<ApiResponse<Category[]>>(endpoints.categories.list)
  return response.data ?? []
}

export async function createCategory(payload: { name: string; icon?: string }): Promise<Category> {
  const body = new URLSearchParams()
  body.append('name', payload.name)
  if (payload.icon) body.append('icon', payload.icon)

  const response = await request<ApiResponse<Category>>(endpoints.categories.list, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })
  return response.data
}

export async function deleteCategory(id: string): Promise<void> {
  await request<ApiResponse<null>>(endpoints.categories.detail(id), { method: 'DELETE' })
}
