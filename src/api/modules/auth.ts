import { request } from '@/api/http'
import type { LoginPayload, LoginResponse, User } from '@/models/auth'

export function login(payload: LoginPayload): Promise<LoginResponse> {
  return request<LoginResponse>('/auth/login', { method: 'POST', body: payload })
}

export function fetchCurrentUser(): Promise<User> {
  return request<User>('/auth/me')
}
