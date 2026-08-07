import router from '@/router'
import { useAuthStore } from '@/stores/auth'
import type { LoginPayload, RegisterPayload, UserRole } from '@/models/auth'

const roleDashboard: Record<UserRole, string> = {
  student: '/user/dashboard',
  mentor: '/mentor/dashboard',
  admin: '/admin/categories',
}

export function useAuthController() {
  const auth = useAuthStore()

  async function login(payload: LoginPayload) {
    await auth.login(payload)
    const redirect = router.currentRoute.value.query.redirect
    if (typeof redirect === 'string' && redirect) {
      await router.push(redirect)
      return
    }
    const role = auth.user?.role ?? 'student'
    await router.push(roleDashboard[role] ?? '/user/dashboard')
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
    updateProfile: auth.updateProfile,
    fetchUser: auth.fetchUser,
  }
}
