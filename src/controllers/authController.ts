import router from '@/router'
import { useAuthStore } from '@/stores/auth'
import type { LoginPayload } from '@/models/auth'

export function useAuthController() {
  const auth = useAuthStore()

  async function login(payload: LoginPayload) {
    await auth.login(payload)
    await router.push({ name: 'home' })
  }

  function logout() {
    auth.logout()
    router.push({ name: 'login' })
  }

  return {
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    loading: auth.loading,
    login,
    logout,
    fetchUser: auth.fetchUser,
  }
}
