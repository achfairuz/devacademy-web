<script setup lang="ts">
import { RouterView } from 'vue-router'

import AppHeader from '@/components/common/AppHeader.vue'
</script>

<template>
  <div class="app-layout">
    <AppHeader />
    <main class="app-layout__main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-layout__main {
  flex: 1;
  width: 100%;
  max-width: 1024px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}
</style>
