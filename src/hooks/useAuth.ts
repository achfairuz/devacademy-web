import { computed } from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStore } from '@/stores/auth'
import type { LoginPayload, RegisterPayload, UserRole } from '@/models/auth'

const roleDashboard: Record<UserRole, string> = {
  student: '/user/dashboard',
  mentor: '/mentor/dashboard',
  admin: '/admin/categories',
}

export function useAuth() {
  const auth = useAuthStore()
  const router = useRouter()

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
    user: computed(() => auth.user),
    isAuthenticated: computed(() => auth.isAuthenticated),
    loading: computed(() => auth.loading),
    login,
    register,
    logout,
    fetchUser: auth.fetchUser,
    updateProfile: auth.updateProfile,
  }
}
