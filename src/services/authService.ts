import type { User } from '@/models/auth'

const TOKEN_KEY = 'devacademy.access_token'
const USER_KEY = 'devacademy.user'

export const authService = {
  get token(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  },

  setSession(accessToken: string, user: User) {
    localStorage.setItem(TOKEN_KEY, accessToken)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  },

  getSessionUser(): User | null {
    const raw = localStorage.getItem(USER_KEY)
    if (!raw) return null
    try {
      return JSON.parse(raw) as User
    } catch {
      return null
    }
  },

  clearSession() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  },
}
