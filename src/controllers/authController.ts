import router from '@/router'
import { useAuthStore } from '@/stores/auth'
import type { LoginPayload, RegisterPayload } from '@/models/auth'

export function useAuthController() {
  const auth = useAuthStore()

  async function login(payload: LoginPayload) {
    await auth.login(payload)
    await router.push({ name: 'home' })
  }

  async function register(payload: RegisterPayload) {
    const message = await auth.register(payload)
    await router.push({ name: 'login', query: { message } })
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
    register,
    logout,
    fetchUser: auth.fetchUser,
  }
}
