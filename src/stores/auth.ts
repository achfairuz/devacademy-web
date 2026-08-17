import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { authService } from '@/services/authService'
import {
  login as loginRequest,
  register as registerRequest,
  fetchCurrentUser,
} from '@/api/modules/auth'
import type { LoginPayload, RegisterPayload, User } from '@/models/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(authService.getSessionUser())

  if (user.value === null && authService.token !== null) {
    authService.clearSession()
  }

  const loading = ref(false)

  const isAuthenticated = computed(() => user.value != null && authService.token != null)

  async function login(payload: LoginPayload) {
    loading.value = true
    try {
      const data = await loginRequest(payload)
      authService.setSession(data.token, data.user)
      user.value = data.user
    } finally {
      loading.value = false
    }
  }

  async function register(payload: RegisterPayload): Promise<string> {
    loading.value = true
    try {
      const result = await registerRequest(payload)
      return result.message
    } finally {
      loading.value = false
    }
  }

  async function fetchUser() {
    const currentUser = await fetchCurrentUser()
    user.value = currentUser
  }

  function updateProfile(patch: Partial<Pick<User, 'full_name' | 'email' | 'avatar'>>) {
    if (user.value == null) return
    user.value = { ...user.value, ...patch }
    authService.updateSessionUser(user.value)
  }

  function logout() {
    authService.clearSession()
    user.value = null
  }

  return { user, loading, isAuthenticated, login, fetchUser, updateProfile, logout, register }
})
