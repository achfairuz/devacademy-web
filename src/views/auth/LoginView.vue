<script setup lang="ts">
import { AtSign, LockKeyhole, PersonStandingIcon } from '@lucide/vue'
import { RouterLink } from 'vue-router'
import { ref } from 'vue'

import BaseButton from '@/components/base/BaseButton.vue'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import AuthTabs from '@/components/common/AuthTabs.vue'
import { useAuthController } from '@/controllers/authController'
import { useAsync } from '@/hooks/useAsync'
import { useForm } from '@/hooks/useForm'

const { login } = useAuthController()
const activeTab = ref<'login' | 'register'>('login')
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
  <BaseCard class="flex w-full max-w-md flex-col gap-6">
    <AuthTabs v-model="activeTab" />

    <form v-if="activeTab === 'login'" class="flex flex-col gap-4" @submit.prevent="onSubmit">
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
      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
      <BaseButton type="submit" :loading="loading">Masuk</BaseButton>
    </form>

    <div v-else class="flex flex-col items-center gap-2 py-6 text-center">
      <PersonStandingIcon class="h-10 w-10 text-text-soft" />
      <p class="text-text-soft">Pendaftaran segera hadir.</p>
    </div>

    <RouterLink to="/" class="text-sm text-primary">Kembali ke beranda</RouterLink>
  </BaseCard>
</template>
