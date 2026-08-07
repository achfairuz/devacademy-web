<script setup lang="ts">
import { RouterView } from 'vue-router'

import AdminSidebar from '@/components/common/admin/AdminSidebar.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AdminSidebar />
    <main class="ml-64 min-h-screen px-8 py-8">
      <RouterView />
    </main>
  </div>
</template>
