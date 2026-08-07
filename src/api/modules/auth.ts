import { request } from '@/api/http'
import { endpoints } from '@/constants/endpoint'
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

const ROLES: UserRole[] = ['admin', 'mentor', 'student']

function toRole(value: string | undefined): UserRole {
  const role = value?.trim().toLowerCase() as UserRole
  return ROLES.includes(role) ? role : 'student'
}

type UserLike = Partial<RawUser> &
  Partial<Pick<User, 'id' | 'name' | 'email' | 'role' | 'avatar'>> & {
    FullName?: string
  }

function toUser(raw: UserLike): User {
  return {
    id: raw.ID ?? raw.id ?? '',
    name: raw.FullName ?? raw.Name ?? raw.name ?? '',
    email: raw.Email ?? raw.email ?? '',
    role: toRole(raw.Role ?? raw.role),
    avatar: raw.Avatar ?? raw.avatar,
  }
}

export async function login(payload: LoginPayload): Promise<AuthData> {
  const response = await request<ApiResponse<RawAuthData>>(endpoints.auth.login, {
    method: 'POST',
    body: payload,
  })
  return { token: response.data.token, user: toUser(response.data.user) }
}

export async function register(payload: RegisterPayload): Promise<{ message: string }> {
  const response = await request<ApiResponse<RawAuthData>>(endpoints.auth.register, {
    method: 'POST',
    body: payload,
  })
  return { message: response.message }
}

export function fetchCurrentUser(): Promise<User> {
  return request<RawUser | User>(endpoints.auth.me).then((raw) => toUser(raw))
}
