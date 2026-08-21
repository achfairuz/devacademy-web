<script setup lang="ts">
import { RouterView } from 'vue-router'

import AppFooter from '@/components/common/AppFooter.vue'
import AppHeader from '@/components/common/AppHeader.vue'
import AppNavbar from '@/components/common/user/AppNavbar.vue'
import { useAuth } from '@/hooks/auth/useAuth'

const { isAuthenticated } = useAuth()
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <AppHeader v-if="!isAuthenticated" />
    <AppNavbar v-else />
    <main class="flex-1">
      <RouterView />
    </main>
    <AppFooter />
  </div>
</template>
