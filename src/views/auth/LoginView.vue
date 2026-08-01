<script setup lang="ts">
import { RouterLink } from 'vue-router'

import BaseButton from '@/components/base/BaseButton.vue'
import { useAuthController } from '@/controllers/authController'
import { useAsync } from '@/hooks/useAsync'
import { useForm } from '@/hooks/useForm'

const { login } = useAuthController()
const { form } = useForm({
  email: '',
  password: '',
})
const { loading, error, run } = useAsync(login)

async function onSubmit() {
  try {
    await run({ email: form.email, password: form.password })
  } catch {
    error.value = 'Email atau password salah.'
  }
}
</script>

<template>
  <div class="login">
    <h1>Login</h1>
    <form class="login__form" @submit.prevent="onSubmit">
      <label>
        Email
        <input v-model="form.email" type="email" required autocomplete="email" />
      </label>
      <label>
        Password
        <input v-model="form.password" type="password" required autocomplete="current-password" />
      </label>
      <p v-if="error" class="login__error">{{ error }}</p>
      <BaseButton type="submit" :disabled="loading">
        {{ loading ? 'Memproses...' : 'Masuk' }}
      </BaseButton>
    </form>
    <RouterLink to="/">Kembali ke beranda</RouterLink>
  </div>
</template>

<style scoped>
.login__form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 24rem;
}

.login__form label {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.875rem;
}

.login__form input {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 0.375rem;
}

.login__error {
  color: #dc2626;
  font-size: 0.875rem;
}
</style>
