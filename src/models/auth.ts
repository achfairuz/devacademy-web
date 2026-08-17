export type UserRole = 'admin' | 'mentor' | 'student'

export interface User {
  id: string
  full_name: string
  username?: string
  email: string
  phone?: string
  avatar?: string
  role: UserRole
  status?: string
  email_verified?: boolean
  created_at?: string
  updated_at?: string
}

export interface AuthData {
  token: string
  user: User
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
