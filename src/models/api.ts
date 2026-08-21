export interface ApiResponse<T = unknown> {
  data: T
  errors: string | Record<string, string[]> | null
  message: string
  meta?: PaginationMeta
  status: number
}

export interface ApiErrorPayload {
  data?: unknown
  errors?: string | Record<string, string[]> | null
  message?: string
  meta?: PaginationMeta
  status?: number
}

export interface PaginationMeta {
  page: number
  page_size: number
  total: number
  total_pages: number
}

export interface Paginated<T> {
  items: T[]
  meta: PaginationMeta
}
