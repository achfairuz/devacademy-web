import { createRouter, createWebHistory } from 'vue-router'

import { routes } from './routes'
import { setupRouterGuards } from './guards'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth', top: -80 }
    }
    return savedPosition ?? { top: 0 }
  },
})

setupRouterGuards(router)

export default router
