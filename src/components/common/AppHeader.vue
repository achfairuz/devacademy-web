<script setup lang="ts">
import { RouterLink } from 'vue-router'

import { useAuth } from '@/composables/useAuth'

const { isAuthenticated } = useAuth()
</script>

<template>
  <header class="app-header">
    <RouterLink to="/" class="app-header__brand">DevAcademy</RouterLink>
    <nav class="app-header__nav">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink v-if="isAuthenticated" to="/profile">Profile</RouterLink>
      <RouterLink v-else to="/login">Login</RouterLink>
    </nav>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--color-border);
}

.app-header__brand {
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--color-heading);
  text-decoration: none;
}

.app-header__nav {
  display: flex;
  gap: 1rem;
}
</style>
