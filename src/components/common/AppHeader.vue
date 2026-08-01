<script setup lang="ts">
import { LogIn, House, CircleUserRound } from '@lucide/vue'
import { RouterLink } from 'vue-router'

import { useAuth } from '@/hooks/useAuth'

const { isAuthenticated } = useAuth()
</script>

<template>
  <header class="flex items-center justify-between border-b border-border px-6 py-4">
    <RouterLink to="/" class="text-xl font-bold text-heading no-underline">DevAcademy</RouterLink>
    <nav class="flex gap-4">
      <RouterLink to="/" class="flex items-center gap-1.5">
        <House :size="16" />
        Home
      </RouterLink>
      <RouterLink v-if="isAuthenticated" to="/profile" class="flex items-center gap-1.5">
        <CircleUserRound :size="16" />
        Profile
      </RouterLink>
      <RouterLink v-else to="/login" class="flex items-center gap-1.5">
        <LogIn :size="16" />
        Login
      </RouterLink>
    </nav>
  </header>
</template>
