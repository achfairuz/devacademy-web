import { computed } from 'vue'

import { useAuthStore } from '@/stores/auth'

export function useAuth() {
  const auth = useAuthStore()

  return {
    user: computed(() => auth.user),
    isAuthenticated: computed(() => auth.isAuthenticated),
    isLoading: computed(() => auth.loading),
    login: auth.login,
    logout: auth.logout,
    fetchUser: auth.fetchUser,
  }
}
