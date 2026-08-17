import { request } from '@/api/http'
import { endpoints } from '@/constants/endpoint'
import type { ApiResponse } from '@/models/api'
import type { AuthData, LoginPayload, RegisterPayload, User } from '@/models/auth'

export async function login(payload: LoginPayload): Promise<AuthData> {
  const response = await request<ApiResponse<AuthData>>(endpoints.auth.login, {
    method: 'POST',
    body: payload,
  })
  return response.data
}

export async function register(payload: RegisterPayload): Promise<{ message: string }> {
  const response = await request<ApiResponse<unknown>>(endpoints.auth.register, {
    method: 'POST',
    body: payload,
  })
  return { message: response.message }
}

export function fetchCurrentUser(): Promise<User> {
  return request<ApiResponse<User>>(endpoints.auth.me).then((res) => res.data)
}
