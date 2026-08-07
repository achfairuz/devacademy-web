<script setup lang="ts">
import { AtSign, LockKeyhole } from '@lucide/vue'
import { ApiError } from '@/api/http'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseDivider from '@/components/base/BaseDivider.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import AuthSosmedButton from '@/components/common/AuthSosmedButton.vue'
import AuthTabs from '@/components/common/AuthTabs.vue'
import { useAuthController } from '@/controllers/authController'
import { useAsync } from '@/hooks/useAsync'
import { useForm } from '@/hooks/useForm'
import { useRoute } from 'vue-router'

const { login } = useAuthController()
const route = useRoute()
const { form } = useForm({
  email: '',
  password: '',
})
const { loading, error, run } = useAsync(login)

async function onSubmit() {
  try {
    await run({ email: form.email, password: form.password })
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      error.value = 'Email atau password salah.'
    } else {
      error.value = err instanceof Error ? err.message : 'Terjadi kesalahan.'
    }
  }
}

async function fillTestCredentialsStudent() {
  form.email = 'student@devacademy.com'
  form.password = 'student123'
  await onSubmit()
}

async function fillTestCredentialsMentor() {
  form.email = 'mentor@devacademy.com'
  form.password = 'mentor123'
  await onSubmit()
}

async function fillTestCredentialsAdmin() {
  form.email = 'admin@devacademy.com'
  form.password = 'admin123'
  await onSubmit()
}
</script>

<template>
  <BaseCard class="flex w-full max-w-md flex-col gap-6">
    <AuthTabs />

    <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
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
        autocomplete="current-password"
      >
        <template #icon>
          <LockKeyhole class="h-4 w-4" />
        </template>
      </BaseInput>
      <p v-if="route.query.message" class="text-sm text-secondary-700">{{ route.query.message }}</p>
      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
      <div class="flex flex-col gap-2">
        <BaseButton type="submit" :loading="loading">Masuk</BaseButton>
        <BaseButton
          type="button"
          variant="secondary"
          class="w-full"
          :loading="loading"
          @click="fillTestCredentialsStudent"
        >
          Login Student (student@devacademy.com)
        </BaseButton>
        <BaseButton
          type="button"
          variant="secondary"
          class="w-full"
          :loading="loading"
          @click="fillTestCredentialsMentor"
        >
          Login Mentor (mentor@devacademy.com)
        </BaseButton>
        <BaseButton
          type="button"
          class="w-full bg-red-500"
          :loading="loading"
          @click="fillTestCredentialsAdmin"
        >
          Login Admin (admin@devacademy.com)
        </BaseButton>
      </div>
    </form>

    <BaseDivider>Or</BaseDivider>

    <div class="flex flex-col gap-3">
      <AuthSosmedButton sosmed="google" />
      <AuthSosmedButton sosmed="twitter" />
      <AuthSosmedButton sosmed="facebook" />
    </div>
  </BaseCard>
</template>
