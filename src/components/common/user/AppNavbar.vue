<script setup lang="ts">
import { BookOpen, GraduationCap, House, LayoutDashboard, LogOut, ShieldCheck, Users } from '@lucide/vue'
import { RouterLink } from 'vue-router'
import { computed, type Component } from 'vue'

import { useAuthController } from '@/controllers/authController'
import { useAuth } from '@/hooks/useAuth'
import type { UserRole } from '@/models/auth'
import { formatInitials } from '@/utils/formatters'

interface NavItem {
  label: string
  to: string
  icon: Component
  roles?: UserRole[]
  requiresAuth?: boolean
}

const { user, isAuthenticated } = useAuth()
const { logout } = useAuthController()

const navItems: NavItem[] = [
  { label: 'Beranda', to: '/', icon: House },
  { label: 'Profile', to: '/profile', icon: LayoutDashboard, requiresAuth: true },
  { label: 'Kelas', to: '/courses', icon: BookOpen, roles: ['student'] },
  { label: 'Mengajar', to: '/mentor', icon: Users, roles: ['mentor'] },
  { label: 'Admin', to: '/admin', icon: ShieldCheck, roles: ['admin'] },
]

const visibleItems = computed(() =>
  navItems.filter((item) => {
    if (item.roles) {
      return isAuthenticated.value && user.value != null && item.roles.includes(user.value.role)
    }
    if (item.requiresAuth) return isAuthenticated.value
    return true
  }),
)
</script>

<template>
  <header class="border-b border-border bg-surface">
    <div
      class="mx-auto flex w-full max-w-[1024px] flex-wrap items-center justify-between gap-x-4 gap-y-2 px-6 py-4"
    >
      <RouterLink to="/" class="flex items-center gap-2 text-xl font-bold text-heading no-underline">
        <GraduationCap class="h-6 w-6 text-primary" />
        DevAcademy
      </RouterLink>

      <nav class="flex flex-wrap items-center gap-1">
        <RouterLink
          v-for="item in visibleItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-text-soft transition-colors hover:bg-gray-100 hover:text-heading"
          active-class="!bg-primary/10 !text-primary"
        >
          <component :is="item.icon" :size="16" />
          {{ item.label }}
        </RouterLink>
      </nav>

      <div v-if="isAuthenticated" class="flex items-center gap-3">
        <div class="hidden text-right sm:block">
          <p class="text-sm font-medium text-heading">{{ user?.name }}</p>
          <p class="text-xs capitalize text-text-soft">{{ user?.role }}</p>
        </div>
        <span
          class="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-white"
        >
          {{ formatInitials(user?.name ?? '') }}
        </span>
        <button
          type="button"
          title="Logout"
          class="flex h-9 w-9 items-center justify-center rounded-md text-text-soft transition-colors hover:bg-gray-100 hover:text-red-600"
          @click="logout"
        >
          <LogOut :size="16" />
        </button>
      </div>

      <RouterLink
        v-else
        to="/login"
        class="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white"
      >
        Masuk
      </RouterLink>
    </div>
  </header>
</template>
