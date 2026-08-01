import { request } from '@/api/http'
import type { ApiResponse } from '@/models/api'
import type { AuthData, LoginPayload, RegisterPayload, User, UserRole } from '@/models/auth'

interface RawUser {
  ID: string
  Name: string
  Email: string
  Role: string
  Avatar?: string
}

interface RawAuthData {
  token: string
  user: RawUser
}

function toUser(raw: RawUser): User {
  return {
    id: raw.ID,
    name: raw.Name,
    email: raw.Email,
    role: raw.Role as UserRole,
    avatar: raw.Avatar,
  }
}

export async function login(payload: LoginPayload): Promise<AuthData> {
  const response = await request<ApiResponse<RawAuthData>>('/auth/login', {
    method: 'POST',
    body: payload,
  })
  return { token: response.data.token, user: toUser(response.data.user) }
}

export async function register(payload: RegisterPayload): Promise<{ message: string }> {
  const response = await request<ApiResponse<RawAuthData>>('/auth/register', {
    method: 'POST',
    body: payload,
  })
  return { message: response.message }
}

export function fetchCurrentUser(): Promise<User> {
  return request<User>('/auth/me')
}
