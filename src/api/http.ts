import type { ApiErrorPayload } from '@/models/api'

export class ApiError extends Error {
  readonly status: number
  readonly payload: ApiErrorPayload | null

  constructor(status: number, message: string, payload: ApiErrorPayload | null = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.payload = payload
  }
}

interface ApiClientOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  params?: Record<string, string | number | boolean | null | undefined>
  body?: unknown
  headers?: HeadersInit
  signal?: AbortSignal
}

const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '/api').replace(/\/+$/, '')

export async function request<T>(path: string, options: ApiClientOptions = {}): Promise<T> {
  const { method = 'GET', params, body, headers, signal } = options

  const url = new URL(`${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`, window.location.origin)
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value))
    }
  }

  const response = await fetch(url, {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal,
  })

  if (response.status === 204) {
    return undefined as T
  }

  const data = (await response.json().catch(() => null)) as ApiErrorPayload | T

  if (!response.ok) {
    const payload = data as ApiErrorPayload | null
    throw new ApiError(response.status, payload?.message ?? response.statusText, payload)
  }

  return data as T
}
