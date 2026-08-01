<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="not-found">
    <h1>404</h1>
    <p>Halaman yang kamu cari tidak ditemukan.</p>
    <RouterLink to="/">Kembali ke beranda</RouterLink>
  </div>
</template>
