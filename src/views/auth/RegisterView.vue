<script setup lang="ts">
import { AtSign, LockKeyhole, UserRound } from '@lucide/vue'

import BaseButton from '@/components/base/BaseButton.vue'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseDivider from '@/components/base/BaseDivider.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import AuthSosmedButton from '@/components/common/AuthSosmedButton.vue'
import AuthTabs from '@/components/common/AuthTabs.vue'
import { useAuthController } from '@/controllers/authController'
import { useAsync } from '@/hooks/useAsync'
import { useForm } from '@/hooks/useForm'

const { register } = useAuthController()
const { form } = useForm({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})
const { loading, error, run } = useAsync(register)

async function onSubmit() {
  if (form.password !== form.confirmPassword) {
    error.value = 'Konfirmasi password tidak cocok.'
    return
  }
  try {
    await run({ name: form.name, email: form.email, password: form.password })
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Pendaftaran gagal. Silakan coba lagi.'
  }
}
</script>

<template>
  <BaseCard class="flex w-full max-w-md flex-col gap-6">
    <AuthTabs />

    <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
      <BaseInput
        id="name"
        v-model="form.name"
        label="Nama"
        type="text"
        required
        autocomplete="name"
      >
        <template #icon>
          <UserRound class="h-4 w-4" />
        </template>
      </BaseInput>
      <BaseInput
        id="email"
        v-model="form.email"
        label="Email"
        type="email"
        required
        autocomplete="email"
      >
        <template #icon>
          <AtSign class="h-4 w-4" />
        </template>
      </BaseInput>
      <BaseInput
        id="password"
        v-model="form.password"
        label="Password"
        type="password"
        required
        autocomplete="new-password"
      >
        <template #icon>
          <LockKeyhole class="h-4 w-4" />
        </template>
      </BaseInput>
      <BaseInput
        id="confirm-password"
        v-model="form.confirmPassword"
        label="Konfirmasi Password"
        type="password"
        required
        autocomplete="new-password"
      >
        <template #icon>
          <LockKeyhole class="h-4 w-4" />
        </template>
      </BaseInput>
      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
      <BaseButton type="submit" :loading="loading">Daftar</BaseButton>
    </form>

    <BaseDivider>Or</BaseDivider>

    <div class="flex flex-col gap-3">
      <AuthSosmedButton sosmed="google" />
      <AuthSosmedButton sosmed="twitter" />
      <AuthSosmedButton sosmed="facebook" />
    </div>
  </BaseCard>
</template>
