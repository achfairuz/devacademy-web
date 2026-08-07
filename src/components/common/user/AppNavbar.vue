<script setup lang="ts">
import {
  BookOpen,
  ChevronDown,
  CircleUser,
  CreditCard,
  GraduationCap,
  House,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  Users,
} from '@lucide/vue'
import { RouterLink } from 'vue-router'
import { computed, onBeforeUnmount, onMounted, ref, type Component } from 'vue'

import { useAuthController } from '@/controllers/authController'
import { useAuth } from '@/hooks/useAuth'
import type { UserRole } from '@/models/auth'
import { formatInitials } from '@/utils/formatters'

interface NavItem {
  label: string
  to: string
  query?: Record<string, string>
  icon: Component
  roles?: UserRole[]
  requiresAuth?: boolean
}

const { user, isAuthenticated } = useAuth()
const { logout } = useAuthController()

const isDropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value
}

function onDocumentClick(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isDropdownOpen.value = false
  }
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') isDropdownOpen.value = false
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onKeydown)
})

const prefix = computed(() => (isAuthenticated.value ? '/user' : ''))
const navItems: NavItem[] = [
  { label: 'Beranda', to: prefix.value + '/dashboard', icon: House },
  { label: 'Courses', to: prefix.value + '/courses', icon: LayoutDashboard, requiresAuth: true },
  { label: 'Learning', to: prefix.value + '/learning', icon: BookOpen, roles: ['student'] },
  {
    label: 'Mentors',
    to: prefix.value + '/mentors',
    icon: Users,
    roles: ['student'],
    query: { feature: 'Mentors' },
  },
  {
    label: 'Dashboard Mentor',
    to: '/mentor/dashboard',
    icon: Users,
    roles: ['mentor'],
  },
  {
    label: 'Admin',
    to: '/admin/categories',
    icon: ShieldCheck,
    roles: ['admin'],
  },
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
      <RouterLink
        to="/"
        class="flex items-center gap-2 text-xl font-bold text-heading no-underline"
      >
        <GraduationCap class="h-6 w-6 text-primary" />
        DevAcademy
      </RouterLink>

      <nav class="flex flex-wrap items-center gap-1">
        <RouterLink
          v-for="item in visibleItems"
          :key="item.to"
          :to="item.query ? { path: item.to, query: item.query } : item.to"
          class="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-text-soft transition-colors hover:bg-gray-100 hover:text-heading"
          active-class="!bg-primary/10 !text-primary"
        >
          <component :is="item.icon" :size="16" />
          {{ item.label }}
        </RouterLink>
      </nav>

      <div v-if="isAuthenticated" class="relative flex items-center gap-3">
        <div class="hidden text-right sm:block">
          <p class="text-sm font-medium text-heading">{{ user?.name }}</p>
          <p class="text-xs capitalize text-text-soft">{{ user?.role }}</p>
        </div>

        <button
          type="button"
          class="flex items-center gap-1.5 rounded-full transition-opacity hover:opacity-80"
          :aria-expanded="isDropdownOpen"
          aria-haspopup="menu"
          @click.stop="toggleDropdown"
        >
          <img
            v-if="user?.avatar"
            :src="user.avatar"
            :alt="user?.name ?? 'Avatar'"
            class="h-9 w-9 rounded-full object-cover"
          />
          <span
            v-else
            class="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-white"
          >
            {{ formatInitials(user?.name ?? '') }}
          </span>
          <ChevronDown :size="16" class="hidden text-text-soft sm:block" />
        </button>

        <transition
          enter-active-class="transition duration-100 ease-out"
          enter-from-class="scale-95 opacity-0"
          enter-to-class="scale-100 opacity-100"
          leave-active-class="transition duration-75 ease-in"
          leave-from-class="scale-100 opacity-100"
          leave-to-class="scale-95 opacity-0"
        >
          <div
            v-if="isDropdownOpen"
            ref="dropdownRef"
            role="menu"
            class="absolute right-0 top-full z-50 mt-2 w-56 origin-top-right rounded-lg border border-border bg-surface p-1 shadow-lg"
          >
            <div class="border-b border-border px-3 py-2.5">
              <p class="truncate text-sm font-semibold text-heading">{{ user?.name }}</p>
              <p class="truncate text-xs text-text-soft">{{ user?.email }}</p>
            </div>

            <RouterLink
              :to="prefix + '/profile'"
              role="menuitem"
              class="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-text-soft transition-colors hover:bg-gray-100 hover:text-heading"
              @click="isDropdownOpen = false"
            >
              <CircleUser :size="16" />
              Profile
            </RouterLink>

            <RouterLink
              :to="prefix + '/subscription'"
              role="menuitem"
              class="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-text-soft transition-colors hover:bg-gray-100 hover:text-heading"
              @click="isDropdownOpen = false"
            >
              <CreditCard :size="16" />
              Subscription
            </RouterLink>

            <button
              type="button"
              role="menuitem"
              class="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-text-soft transition-colors hover:bg-red-50 hover:text-red-600"
              @click="logout"
            >
              <LogOut :size="16" />
              Logout
            </button>
          </div>
        </transition>
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
