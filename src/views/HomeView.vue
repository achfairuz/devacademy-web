<script setup lang="ts">
import { RouterLink } from 'vue-router'

import { useAuthController } from '@/controllers/authController'
import { formatInitials } from '@/utils/formatters'

const { user, isAuthenticated } = useAuthController()
</script>

<template>
  <div class="home">
    <h1>Selamat datang di DevAcademy</h1>
    <p v-if="isAuthenticated" class="home__user">
      Halo, {{ user?.name }}
      <span class="home__avatar">{{ formatInitials(user?.name ?? '') }}</span>
    </p>
    <RouterLink v-else to="/login">Login untuk mengakses profile</RouterLink>
  </div>
</template>

<style scoped>
.home__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  margin-left: 0.5rem;
  border-radius: 9999px;
  background: var(--color-primary);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
}
</style>
