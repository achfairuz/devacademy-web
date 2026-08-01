<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue'
import { useAuthController } from '@/controllers/authController'
import { formatInitials } from '@/utils/formatters'

const { user, logout } = useAuthController()
</script>

<template>
  <div class="profile">
    <h1>Profile</h1>
    <div v-if="user" class="profile__card">
      <span class="profile__avatar">{{ formatInitials(user.name) }}</span>
      <dl>
        <dt>Nama</dt>
        <dd>{{ user.name }}</dd>
        <dt>Email</dt>
        <dd>{{ user.email }}</dd>
        <dt>Role</dt>
        <dd>{{ user.role }}</dd>
      </dl>
      <BaseButton variant="secondary" @click="logout()">Logout</BaseButton>
    </div>
  </div>
</template>

<style scoped>
.profile__card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  max-width: 24rem;
  padding: 1.5rem;
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
}

.profile__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
  background: var(--color-primary);
  color: #fff;
  font-weight: 700;
}

.profile__card dl {
  margin: 0;
}

.profile__card dt {
  font-size: 0.75rem;
  color: var(--color-text-soft);
}

.profile__card dd {
  margin: 0 0 0.75rem;
}
</style>
