import type { Level } from '@/models/levels'
import { request } from '../http'
import type { ApiResponse } from '@/models/api'
import { endpoints } from '@/constants/endpoint'

export const levelApi = {
  async getLevels(): Promise<Level[]> {
    const response = await request<ApiResponse<Level[]>>(endpoints.levels.list)
    return response.data ?? []
  },
}
