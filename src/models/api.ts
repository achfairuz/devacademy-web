export interface ApiResponse<T = unknown> {
  data: T
  errors: string | Record<string, string[]> | null
  message: string
  status: number
}

export interface ApiErrorPayload {
  data?: unknown
  errors?: string | Record<string, string[]> | null
  message?: string
  status?: number
}

export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}
