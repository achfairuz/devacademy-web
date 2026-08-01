<script setup lang="ts">
import { RouterView } from 'vue-router'

import AppHeader from '@/components/common/AppHeader.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <AppHeader />
    <main class="mx-auto w-full max-w-[1024px] flex-1 px-6 py-8">
      <RouterView />
    </main>
  </div>
</template>
