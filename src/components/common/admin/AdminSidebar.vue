<script setup lang="ts">
import {
  BookOpen,
  CircleUser,
  GraduationCap,
  Layers,
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  Shield,
  Users,
} from '@lucide/vue'
import { RouterLink, useRouter } from 'vue-router'
import { computed, type Component } from 'vue'

import { useAuth } from '@/hooks/useAuth'
import { formatInitials } from '@/utils/formatters'

interface NavItem {
  label: string
  to: string
  icon: Component
}

const { user, logout } = useAuth()
const router = useRouter()

const navItems: NavItem[] = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Kategori', to: '/admin/categories', icon: Layers },
  { label: 'Kursus', to: '/admin/courses', icon: BookOpen },
  { label: 'Siswa', to: '/admin/students', icon: Users },
  { label: 'Ulasan', to: '/admin/reviews', icon: MessageSquareText },
]

const profileLinks: NavItem[] = [{ label: 'Profile', to: '/admin/profile', icon: CircleUser }]

const linkClass = computed(() => ({
  base: 'flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
  idle: 'text-text-soft hover:bg-primary-50 hover:text-primary',
  active: 'bg-primary-50 text-primary',
}))

function isActive(to: string) {
  return router.currentRoute.value.path === to
}

async function handleLogout() {
  await logout()
  await router.push({ name: 'login' })
}
</script>

<template>
  <aside class="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-surface">
    <RouterLink
      to="/"
      class="flex h-16 items-center gap-2 border-b border-border px-6 no-underline"
    >
      <GraduationCap class="h-6 w-6 text-primary" />
      <span class="text-lg font-bold text-heading">DevAcademy</span>
    </RouterLink>

    <nav class="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
      <p class="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-text-soft">
        Menu Admin
      </p>
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="no-underline"
        :class="[linkClass.base, isActive(item.to) ? linkClass.active : linkClass.idle]"
      >
        <component :is="item.icon" :size="18" />
        {{ item.label }}
      </RouterLink>

      <p class="mt-6 px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-text-soft">
        Akun
      </p>
      <RouterLink
        v-for="item in profileLinks"
        :key="item.to"
        :to="item.to"
        class="no-underline"
        :class="[linkClass.base, isActive(item.to) ? linkClass.active : linkClass.idle]"
      >
        <component :is="item.icon" :size="18" />
        {{ item.label }}
      </RouterLink>
    </nav>

    <div class="border-t border-border p-4">
      <div class="flex items-center gap-3">
        <span
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white"
        >
          {{ formatInitials(user?.full_name) }}
        </span>
        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-semibold text-heading">{{ user?.full_name }}</p>
          <p class="flex items-center gap-1 text-xs capitalize text-amber-500">
            <Shield :size="12" class="fill-amber-500" />
            Admin
          </p>
        </div>
        <button
          type="button"
          class="rounded-md p-2 text-text-soft transition-colors hover:bg-red-50 hover:text-red-600"
          :aria-label="`Logout ${user?.full_name ?? ''}`"
          @click="handleLogout"
        >
          <LogOut :size="18" />
        </button>
      </div>
    </div>
  </aside>
</template>
