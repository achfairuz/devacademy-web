<script setup lang="ts">
import { ArrowLeft, Compass, Home, SearchX } from '@lucide/vue'
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-6 py-16">
    <div class="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
    <div class="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-secondary-500/10 blur-3xl" />

    <div class="relative flex max-w-lg flex-col items-center text-center">
      <div class="relative">
        <p class="bg-gradient-to-br from-primary-600 to-secondary-500 bg-clip-text text-[8rem] font-black leading-none text-transparent sm:text-[10rem]">
          404
        </p>
        <span
          class="absolute -right-8 top-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary shadow-sm sm:top-10"
        >
          <SearchX :size="28" />
        </span>
      </div>

      <h1 class="mt-2 text-2xl font-bold text-heading">Oops, halaman tidak ditemukan</h1>
      <p class="mt-3 text-sm leading-relaxed text-text-soft">
        Halaman yang Anda cari mungkin telah dipindahkan, dihapus, atau tidak pernah ada.
        Jangan khawatir, banyak hal menarik lain yang menunggu Anda.
      </p>

      <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
        <RouterLink
          to="/"
          class="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white no-underline transition-opacity hover:opacity-90"
        >
          <Home :size="16" />
          Kembali ke Beranda
        </RouterLink>
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-md border border-border px-5 py-2.5 text-sm font-semibold text-text transition-colors hover:border-primary/40 hover:text-primary"
          @click="$router.back()"
        >
          <ArrowLeft :size="16" />
          Halaman Sebelumnya
        </button>
      </div>

      <div class="mt-10 flex items-center gap-2 text-sm text-text-soft">
        <Compass :size="16" class="text-primary" />
        Atau jelajahi halaman populer lainnya
      </div>
      <div class="mt-3 flex flex-wrap items-center justify-center gap-2">
        <RouterLink
          to="/user/courses"
          class="rounded-full bg-gray-100 px-4 py-1.5 text-sm font-medium text-text-soft no-underline transition-colors hover:bg-gray-200 hover:text-heading"
        >
          Courses
        </RouterLink>
        <RouterLink
          to="/user/learning"
          class="rounded-full bg-gray-100 px-4 py-1.5 text-sm font-medium text-text-soft no-underline transition-colors hover:bg-gray-200 hover:text-heading"
        >
          Learning
        </RouterLink>
        <RouterLink
          to="/user/dashboard"
          class="rounded-full bg-gray-100 px-4 py-1.5 text-sm font-medium text-text-soft no-underline transition-colors hover:bg-gray-200 hover:text-heading"
        >
          Dashboard
        </RouterLink>
      </div>
    </div>
  </div>
</template>
