import type { Router } from 'vue-router'

import { useAuthStore } from '@/stores/auth'

export function setupRouterGuards(router: Router) {
  router.beforeEach((to) => {
    const auth = useAuthStore()

    if (to.matched.some((record) => record.meta.requiresAuth) && !auth.isAuthenticated) {
      return { name: 'login', query: { redirect: to.fullPath } }
    }

    const roles = to.matched.flatMap((record) => record.meta.roles ?? [])
    if (roles.length > 0 && (auth.user == null || !roles.includes(auth.user.role))) {
      return { name: 'landing-page' }
    }

    if (to.matched.some((record) => record.meta.guestOnly) && auth.isAuthenticated) {
      return { name: 'landing-page' }
    }
  })
}
