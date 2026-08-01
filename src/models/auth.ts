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

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: User
}
