<script setup lang="ts">
import { useAuth } from '@/hooks/auth/useAuth'
import { RouterView } from 'vue-router'
import AppFooter from '@/components/common/AppFooter.vue'
import AppNavbar from '@/components/common/user/AppNavbar.vue'

const { isAuthenticated } = useAuth()
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <AppNavbar v-if="isAuthenticated" />
    <main class="flex-1 px-4 py-6 sm:px-8 sm:py-10 lg:px-20 lg:py-16">
      <RouterView />
    </main>
    <AppFooter />
  </div>
</template>
