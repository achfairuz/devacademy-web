<script setup lang="ts">
import {
  Award,
  BookOpen,
  Clock,
  FileBadge,
  GraduationCap,
  LayoutDashboard,
  Play,
  ShieldCheck,
  Star,
  TrendingUp,
  Users,
} from '@lucide/vue'
import { RouterLink } from 'vue-router'
import { computed, type Component } from 'vue'

import BaseCard from '@/components/base/BaseCard.vue'
import { useAuthController } from '@/controllers/authController'
import { formatInitials } from '@/utils/formatters'

const { user, isAuthenticated } = useAuthController()

const stats: { label: string; value: string; icon: Component; accent: string }[] = [
  { label: 'Kelas Diikuti', value: '3', icon: BookOpen, accent: 'bg-blue-50 text-blue-600' },
  { label: 'Sertifikat', value: '1', icon: Award, accent: 'bg-emerald-50 text-emerald-600' },
  { label: 'Poin Belajar', value: '240', icon: Star, accent: 'bg-amber-50 text-amber-600' },
  { label: 'Jam Belajar', value: '12.5', icon: Clock, accent: 'bg-violet-50 text-violet-600' },
]

const quickActions = computed(() => {
  const items: { label: string; description: string; to: string; icon: Component }[] = [
    {
      label: 'Profile Saya',
      description: 'Kelola informasi akun',
      to: '/profile',
      icon: LayoutDashboard,
    },
  ]

  if (user?.role === 'student') {
    items.unshift({
      label: 'Jelajahi Kelas',
      description: 'Lihat dan ikuti kelas baru',
      to: '/courses',
      icon: Play,
    })
  }
  if (user?.role === 'mentor') {
    items.unshift({
      label: 'Kelas Saya',
      description: 'Kelola kelas yang Anda ajarkan',
      to: '/mentor',
      icon: Users,
    })
  }
  if (user?.role === 'admin') {
    items.unshift({
      label: 'Panel Admin',
      description: 'Kelola pengguna dan kelas',
      to: '/admin',
      icon: ShieldCheck,
    })
  }
  return items
})
</script>

<template>
  <div v-if="isAuthenticated && user" class="flex flex-col gap-8">
    <section
      class="flex flex-col items-start gap-4 rounded-lg border border-border bg-gradient-to-br from-primary/10 to-transparent p-6 sm:flex-row sm:items-center sm:justify-between"
    >
      <div class="flex items-center gap-4">
        <span
          class="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-lg font-bold text-white"
        >
          {{ formatInitials(user.name) }}
        </span>
        <div>
          <p class="text-sm text-text-soft">Selamat datang kembali</p>
          <h1 class="text-2xl font-bold text-heading">{{ user.name }}</h1>
          <span
            class="mt-1 inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-0.5 text-xs font-medium capitalize text-primary"
          >
            <GraduationCap :size="14" />
            {{ user.role }}
          </span>
        </div>
      </div>
      <div class="flex flex-col gap-1 text-sm text-text-soft">
        <span class="inline-flex items-center gap-1.5">
          <TrendingUp :size="16" class="text-primary" />
          Terus belajar, terus berkembang!
        </span>
      </div>
    </section>

    <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <BaseCard v-for="stat in stats" :key="stat.label" class="flex items-center gap-4">
        <span class="flex h-11 w-11 items-center justify-center rounded-lg" :class="stat.accent">
          <component :is="stat.icon" :size="20" />
        </span>
        <div>
          <p class="text-2xl font-bold text-heading">{{ stat.value }}</p>
          <p class="text-sm text-text-soft">{{ stat.label }}</p>
        </div>
      </BaseCard>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-lg font-semibold text-heading">Menu Cepat</h2>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <RouterLink
          v-for="action in quickActions"
          :key="action.label"
          :to="action.to"
          class="group rounded-lg border border-border bg-surface p-5 no-underline transition-colors hover:border-primary/40 hover:bg-primary/5"
        >
          <div class="flex items-center justify-between">
            <component :is="action.icon" :size="22" class="text-primary" />
            <span
              class="text-xs font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100"
            >
              Buka
            </span>
          </div>
          <h3 class="mt-4 font-semibold text-heading">{{ action.label }}</h3>
          <p class="mt-1 text-sm text-text-soft">{{ action.description }}</p>
        </RouterLink>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-lg font-semibold text-heading">Kelas Terbaru</h2>
      <BaseCard class="flex flex-col items-center gap-3 py-12 text-center">
        <FileBadge :size="40" class="text-text-soft" />
        <div>
          <p class="font-medium text-heading">Belum ada kelas</p>
          <p class="text-sm text-text-soft">Kelas yang Anda ikuti akan tampil di sini.</p>
        </div>
      </BaseCard>
    </section>
  </div>

  <div v-else class="flex flex-col gap-4">
    <h1 class="text-2xl font-bold text-heading">Selamat datang di DevAcademy</h1>
    <p class="text-text-soft">
      Platform belajar online untuk meningkatkan keterampilan Anda. Masuk untuk mengakses kelas dan
      dashboard pribadi.
    </p>
    <div>
      <RouterLink
        to="/login"
        class="inline-flex rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white no-underline"
      >
        Masuk
      </RouterLink>
    </div>
  </div>
</template>
