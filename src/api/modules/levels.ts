import type { Level } from '@/models/levels'
import { request } from '../http'
import type { ApiResponse } from '@/models/api'
import type { rawLevel } from '../contracts/levels'
import { endpoints } from '@/constants/endpoint'
import { toLevel } from '../mappers/levels'

export const levelApi = {
  async getLevels(): Promise<Level[]> {
    const response = await request<ApiResponse<rawLevel[]>>(endpoints.levels.list)
    return (response.data ?? []).map(toLevel)
  },
}
