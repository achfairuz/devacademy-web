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
  const loading = ref(false)

  const isAuthenticated = computed(() => user.value !== null && authService.token !== null)

  async function login(payload: LoginPayload) {
    loading.value = true
    try {
      const response = await loginRequest(payload)
      authService.setSession(response.accessToken, response.user)
      user.value = response.user
    } finally {
      loading.value = false
    }
  }

  async function register(payload: RegisterPayload): Promise<string> {
    loading.value = true
    try {
      const response = await registerRequest(payload)
      return response.message
    } finally {
      loading.value = false
    }
  }

  async function fetchUser() {
    const currentUser = await fetchCurrentUser()
    user.value = currentUser
  }

  function logout() {
    authService.clearSession()
    user.value = null
  }

  return { user, loading, isAuthenticated, login, fetchUser, logout, register }
})
