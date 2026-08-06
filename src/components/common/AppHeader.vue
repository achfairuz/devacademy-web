<script setup lang="ts">
import { LogIn, House, CircleUserRound, Menu, X } from '@lucide/vue'
import { RouterLink, useRoute } from 'vue-router'
import { computed, ref, watch, type Component } from 'vue'

import { useAuth } from '@/hooks/useAuth'
import { linked } from '@/constants/constans'

interface NavItem {
  label: string
  to: string
  icon: Component
  requiresAuth?: boolean
  onlyWhenLoggedOut?: boolean
}

const { isAuthenticated } = useAuth()
const route = useRoute()

const mobileMenuOpen = ref(false)

watch(
  () => route.fullPath,
  () => {
    mobileMenuOpen.value = false
  },
)

const navItems: NavItem[] = [
  { label: 'Home', to: '/', icon: House },
  { label: 'Profile', to: '/profile', icon: CircleUserRound, requiresAuth: true },
  { label: 'Login', to: '/login', icon: LogIn, onlyWhenLoggedOut: true },
]

const visibleItems = computed(() =>
  navItems.filter((item) => {
    if (item.requiresAuth) return isAuthenticated.value
    if (item.onlyWhenLoggedOut) return !isAuthenticated.value
    return true
  }),
)
</script>

<template>
  <header class="sticky top-0 z-50 bg-surface/95 backdrop-blur border-b border-border">
    <div class="flex items-center justify-between px-4 sm:px-6 py-4 max-w-7xl mx-auto">
      <RouterLink to="/" class="text-xl font-bold text-heading no-underline">
        <img src="https://placehold.co/40x40/EEE/31343C" alt="logo" class="inline-block mr-2 w-12" />
      </RouterLink>

      <nav class="hidden md:flex items-center gap-6">
        <RouterLink
          v-for="item in Object.values(linked)"
          :key="item.path"
          :to="item.path"
          class="text-lg font-normal text-gray-600 no-underline hover:underline"
          active-class="text-primary font-semibold"
        >
          {{ item.name }}
        </RouterLink>
      </nav>

      <nav class="hidden md:flex items-center gap-4">
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

      <button
        class="md:hidden p-2 rounded-md border border-border text-text-soft hover:bg-gray-100"
        aria-label="Toggle menu"
        @click="mobileMenuOpen = !mobileMenuOpen"
      >
        <Menu v-if="!mobileMenuOpen" class="w-6 h-6" />
        <X v-else class="w-6 h-6" />
      </button>
    </div>

    <div v-if="mobileMenuOpen" class="md:hidden border-t border-border bg-surface px-4 py-4">
      <nav class="flex flex-col gap-2">
        <RouterLink
          v-for="item in Object.values(linked)"
          :key="item.path"
          :to="item.path"
          class="rounded-md px-3 py-2 text-base font-normal text-gray-600 no-underline hover:bg-gray-100"
          active-class="text-primary font-semibold"
        >
          {{ item.name }}
        </RouterLink>
        <RouterLink
          v-for="item in visibleItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-text-soft transition-colors hover:bg-gray-100 hover:text-heading"
          active-class="!bg-primary/10 !text-primary"
        >
          <component :is="item.icon" :size="16" />
          {{ item.label }}
        </RouterLink>
      </nav>
    </div>
  </header>
</template>
