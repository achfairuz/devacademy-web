export interface ApiErrorPayload {
  message?: string
  errors?: Record<string, string[]>
}

export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}
