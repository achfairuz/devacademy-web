<script setup lang="ts">
import { RouterView } from 'vue-router'

import AppHeader from '@/components/common/AppHeader.vue'
import AppNavbar from '@/components/common/user/AppNavbar.vue'
import { useAuth } from '@/hooks/useAuth'

const { isAuthenticated } = useAuth()
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <AppHeader v-if="!isAuthenticated" />
    <AppNavbar v-else />
    <main class="mx-auto w-full max-w-[1024px] flex-1 px-6 py-8">
      <RouterView />
    </main>
  </div>
</template>
