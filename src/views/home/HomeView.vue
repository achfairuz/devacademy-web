<script setup lang="ts">
import { RouterLink } from 'vue-router'

import { useAuthController } from '@/controllers/authController'
import { formatInitials } from '@/utils/formatters'

const { user, isAuthenticated } = useAuthController()
</script>

<template>
  <div>
    <h1>Selamat datang di DevAcademy</h1>
    <p v-if="isAuthenticated">
      Halo, {{ user?.name }}
      <span
        class="ml-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white"
      >
        {{ formatInitials(user?.name ?? '') }}
      </span>
    </p>
    <RouterLink v-else to="/login">Login untuk mengakses profile</RouterLink>
  </div>
</template>
