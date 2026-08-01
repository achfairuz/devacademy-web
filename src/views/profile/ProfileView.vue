<script setup lang="ts">
import { LogOut } from '@lucide/vue'

import BaseButton from '@/components/base/BaseButton.vue'
import { useAuthController } from '@/controllers/authController'
import { formatInitials } from '@/utils/formatters'

const { user, logout } = useAuthController()
</script>

<template>
  <div>
    <h1>Profile</h1>
    <div v-if="user" class="flex max-w-md flex-col items-start gap-4 rounded-lg border border-border p-6">
      <span
        class="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary font-bold text-white"
      >
        {{ formatInitials(user.name) }}
      </span>
      <dl>
        <dt class="text-xs text-text-soft">Nama</dt>
        <dd class="mb-3">{{ user.name }}</dd>
        <dt class="text-xs text-text-soft">Email</dt>
        <dd class="mb-3">{{ user.email }}</dd>
        <dt class="text-xs text-text-soft">Role</dt>
        <dd class="mb-3">{{ user.role }}</dd>
      </dl>
      <BaseButton variant="secondary" @click="logout()">
        <LogOut :size="16" />
        Logout
      </BaseButton>
    </div>
  </div>
</template>
