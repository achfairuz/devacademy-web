import type { ApiResponse } from './api'

export type UserRole = 'admin' | 'mentor' | 'student'

export interface User {
  id: number
  name: string
  email: string
  role: UserRole
  avatar?: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
}

export type RegisterResponse = ApiResponse<null>

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: User
}
