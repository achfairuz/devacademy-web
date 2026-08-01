import type { Router } from 'vue-router'

import { useAuthStore } from '@/stores/auth'

export function setupRouterGuards(router: Router) {
  router.beforeEach((to) => {
    const auth = useAuthStore()

    if (to.matched.some((record) => record.meta.requiresAuth) && !auth.isAuthenticated) {
      return { name: 'login', query: { redirect: to.fullPath } }
    }

    if (to.matched.some((record) => record.meta.guestOnly) && auth.isAuthenticated) {
      return { name: 'home' }
    }
  })
}
