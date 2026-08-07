import type { User } from '@/models/auth'

const TOKEN_KEY = 'devacademy.access_token'
const USER_KEY = 'devacademy.user'

export const authService = {
  get token(): string | null {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token || token === 'undefined' || token === 'null') return null
    return token
  },

  setSession(accessToken: string, user: User) {
    if (accessToken && (user.id || user.email)) {
      localStorage.setItem(TOKEN_KEY, accessToken)
      localStorage.setItem(USER_KEY, JSON.stringify(user))
    }
  },

  updateSessionUser(user: User) {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  },

  getSessionUser(): User | null {
    const raw = localStorage.getItem(USER_KEY)
    if (!raw) return null
    try {
      const user = JSON.parse(raw) as User
      if (!user || (!user.name && !user.id)) return null
      return user
    } catch {
      return null
    }
  },

  clearSession() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  },
}
