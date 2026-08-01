import { request } from '@/api/http'
import type {
  LoginPayload,
  LoginResponse,
  User,
  RegisterPayload,
  RegisterResponse,
} from '@/models/auth'

export function login(payload: LoginPayload): Promise<LoginResponse> {
  return request<LoginResponse>('/auth/login', { method: 'POST', body: payload })
}
export function register(payload: RegisterPayload): Promise<RegisterResponse> {
  return request<RegisterResponse>('/auth/register', { method: 'POST', body: payload })
}

export function fetchCurrentUser(): Promise<User> {
  return request<User>('/auth/me')
}
