import axios, { type AxiosRequestConfig } from 'axios'

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

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

export async function request<T>(path: string, options: ApiClientOptions = {}): Promise<T> {
  const { method = 'GET', params, body, headers, signal } = options

  const config: AxiosRequestConfig = {
    method,
    url: path,
    params,
    data: body,
    headers: headers as Record<string, string>,
    signal,
  }

  try {
    const response = await client.request<T>(config)
    if (response.status === 204) {
      return undefined as T
    }
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const response = error.response
      const status = response?.status ?? 0
      const payload = (response?.data ?? null) as ApiErrorPayload | null
      throw new ApiError(status, payload?.message ?? error.message, payload)
    }
    throw error
  }
}
