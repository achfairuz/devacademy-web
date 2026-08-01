/// <reference types="vite/client" />

import 'vue-router'

import type { UserRole } from '@/models/auth'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    guestOnly?: boolean
    roles?: UserRole[]
  }
}
