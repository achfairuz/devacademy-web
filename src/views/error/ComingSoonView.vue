<script setup lang="ts">
import { ArrowLeft, ArrowRight, Construction, Hammer, Home, Sparkles } from '@lucide/vue'
import { RouterLink, useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const featureName = computed(() => {
  const name = typeof route.query.feature === 'string' ? route.query.feature : ''
  return name || 'Fitur'
})

const featureLists: { title: string; description: string }[] = [
  { title: 'Jadwal & Materi', description: 'Akses jadwal kelas dan materi pembelajaran yang terstruktur.' },
  { title: 'Quiz & Evaluasi', description: 'Uji pemahaman Anda melalui kuis interaktif dan evaluasi berkala.' },
  { title: 'Sertifikat', description: 'Dapatkan sertifikat setelah menyelesaikan course yang Anda ikuti.' },
]
</script>

<template>
  <div class="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-6 py-16">
    <div class="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-amber-400/10 blur-3xl" />
    <div class="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

    <div class="relative flex max-w-xl flex-col items-center text-center">
      <div class="relative">
        <span
          class="flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-lg shadow-amber-500/30"
        >
          <Construction :size="52" />
        </span>
        <span
          class="absolute -right-3 -top-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-md"
        >
          <Hammer :size="22" class="text-amber-500" />
        </span>
      </div>

      <h1 class="mt-8 text-2xl font-bold text-heading sm:text-3xl">{{ featureName }} Sedang Dalam Pengembangan</h1>
      <p class="mt-3 text-sm leading-relaxed text-text-soft">
        Fitur ini masih kami kerjakan dengan sepenuh hati. Tim kami sedang berusaha
        menghadirkan pengalaman terbaik untuk Anda. Mohon tunggu sebentar ya!
      </p>

      <div class="mt-8 grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
        <div
          v-for="feature in featureLists"
          :key="feature.title"
          class="rounded-xl border border-border bg-surface p-4 text-left"
        >
          <p class="flex items-center gap-1.5 text-sm font-semibold text-heading">
            <Sparkles :size="15" class="text-amber-500" />
            {{ feature.title }}
          </p>
          <p class="mt-1.5 text-xs leading-relaxed text-text-soft">{{ feature.description }}</p>
        </div>
      </div>

      <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
        <RouterLink
          :to="route.query.from ? String(route.query.from) : '/user/dashboard'"
          class="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white no-underline transition-opacity hover:opacity-90"
        >
          <ArrowRight :size="16" />
          Kembali
        </RouterLink>
        <RouterLink
          to="/"
          class="inline-flex items-center gap-2 rounded-md border border-border px-5 py-2.5 text-sm font-semibold text-text transition-colors hover:border-primary/40 hover:text-primary no-underline"
        >
          <Home :size="16" />
          Beranda
        </RouterLink>
      </div>

      <div class="mt-10 flex items-center gap-2 text-xs text-text-soft">
        <ArrowLeft :size="14" />
        Estimasi selesai: segera hadir
      </div>
    </div>
  </div>
</template>
