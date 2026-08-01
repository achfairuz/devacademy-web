<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center px-6 py-8">
    <main class="w-full max-w-sm">
      <RouterView />
    </main>
  </div>
</template>
