<script setup lang="ts">
import { CreditCard } from '@lucide/vue'
</script>

<template>
  <div>
    <h1 class="mb-4 text-2xl font-bold text-heading">Subscription</h1>
    <div
      class="flex max-w-md flex-col items-start gap-4 rounded-lg border border-border p-6"
    >
      <span class="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
        <CreditCard :size="20" />
      </span>
      <p class="text-sm text-text-soft">Halaman subscription sedang dalam pengembangan.</p>
    </div>
  </div>
</template>
