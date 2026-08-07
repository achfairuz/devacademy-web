<script setup lang="ts">
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Clock,
  GraduationCap,
  MessageSquareText,
  Play,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Wallet,
} from '@lucide/vue'
import { RouterLink } from 'vue-router'
import type { Component } from 'vue'

import BaseButton from '@/components/base/BaseButton.vue'
import BaseCard from '@/components/base/BaseCard.vue'
import { useAuthController } from '@/controllers/authController'
import { formatInitials } from '@/utils/formatters'

const { user } = useAuthController()

const stats: { label: string; value: string; icon: Component; accent: string }[] = [
  { label: 'Total Siswa', value: '128', icon: Users, accent: 'bg-blue-50 text-blue-600' },
  { label: 'Kelas Aktif', value: '5', icon: BookOpen, accent: 'bg-primary-50 text-primary' },
  { label: 'Pendapatan', value: 'Rp 8,4jt', icon: Wallet, accent: 'bg-emerald-50 text-emerald-600' },
  { label: 'Rating', value: '4.9', icon: Star, accent: 'bg-amber-50 text-amber-500' },
]

interface MentorCourse {
  title: string
  category: string
  students: number
  progress: number
  rating: number
  color: string
}

const courses: MentorCourse[] = [
  {
    title: 'Fundamental JavaScript',
    category: 'Programming',
    students: 48,
    progress: 68,
    rating: 4.9,
    color: 'bg-primary-500',
  },
  {
    title: 'UI/UX Design Dasar',
    category: 'Design',
    students: 35,
    progress: 40,
    rating: 4.8,
    color: 'bg-secondary-500',
  },
  {
    title: 'Database & SQL',
    category: 'Data',
    students: 21,
    progress: 25,
    rating: 5.0,
    color: 'bg-emerald-500',
  },
]

const schedule = [
  { day: 'Senin', time: '09:00 - 11:00', course: 'Fundamental JavaScript', class: 'Kelas A' },
  { day: 'Rabu', time: '13:00 - 15:00', course: 'UI/UX Design Dasar', class: 'Kelas B' },
  { day: 'Jumat', time: '10:00 - 12:00', course: 'Database & SQL', class: 'Kelas A' },
]

const recentReviews = [
  { name: 'Andi Pratama', course: 'Fundamental JavaScript', rating: 5, comment: 'Materi mudah dipahami, terima kasih!' },
  { name: 'Sari Wulandari', course: 'UI/UX Design Dasar', rating: 5, comment: 'Penjelasan mentor sangat jelas.' },
  { name: 'Budi Santoso', course: 'Database & SQL', rating: 4, comment: 'Contoh studi kasusnya membantu.' },
]
</script>

<template>
  <div v-if="user" class="flex flex-col gap-8">
    <section
      class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500 p-8 text-white shadow-lg"
    >
      <div
        class="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl"
      />
      <div
        class="pointer-events-none absolute -bottom-20 right-24 h-40 w-40 rounded-full bg-white/10 blur-xl"
      />

      <div class="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-4">
          <span
            class="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-xl font-bold backdrop-blur"
          >
            {{ formatInitials(user.name) }}
          </span>
          <div>
            <p class="text-sm text-white/80">Halo, selamat mengajar kembali</p>
            <h1 class="text-2xl font-bold sm:text-3xl">{{ user.name }}</h1>
            <p class="mt-1 inline-flex items-center gap-1.5 text-sm text-white/90">
              <Sparkles :size="15" />
              Anda adalah mentor luar biasa, terus berbagi ilmu!
            </p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div
            class="flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 backdrop-blur"
            title="Rating mentor"
          >
            <Star :size="20" class="fill-amber-300 text-amber-300" />
            <div>
              <p class="text-lg font-bold leading-none">4.9</p>
              <p class="text-xs text-white/80">Rating</p>
            </div>
          </div>
          <BaseButton variant="secondary" class="!bg-white !text-primary-700 hover:!bg-white/90">
            <Play :size="16" />
            Buat Kelas Baru
          </BaseButton>
        </div>
      </div>
    </section>

    <section class="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <BaseCard v-for="stat in stats" :key="stat.label" class="flex items-center gap-4 !p-5">
        <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" :class="stat.accent">
          <component :is="stat.icon" :size="20" />
        </span>
        <div class="min-w-0">
          <p class="truncate text-2xl font-bold text-heading">{{ stat.value }}</p>
          <p class="truncate text-sm text-text-soft">{{ stat.label }}</p>
        </div>
      </BaseCard>
    </section>

    <section class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div class="flex flex-col gap-6 lg:col-span-2">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-semibold text-heading">Kelas yang Saya Ajar</h2>
            <p class="text-sm text-text-soft">Kelas aktif yang sedang berlangsung</p>
          </div>
          <RouterLink
            to="/mentor/courses"
            class="inline-flex items-center gap-1 text-sm font-medium text-primary no-underline"
          >
            Lihat semua
            <ArrowRight :size="16" />
          </RouterLink>
        </div>

        <div class="flex flex-col gap-4">
          <BaseCard
            v-for="course in courses"
            :key="course.title"
            class="group flex cursor-pointer flex-col gap-4 p-5 transition-all hover:border-primary/40 hover:shadow-md sm:flex-row sm:items-center"
          >
            <span
              class="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
              :class="course.color"
            >
              <Play :size="22" class="transition-transform group-hover:scale-110" />
            </span>

            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2">
                <p class="text-xs font-semibold uppercase tracking-wide text-text-soft">
                  {{ course.category }}
                </p>
                <span class="h-1 w-1 rounded-full bg-text-soft/50" />
                <p class="inline-flex items-center gap-1 text-xs text-text-soft">
                  <Users :size="13" />
                  {{ course.students }} siswa
                </p>
                <p class="inline-flex items-center gap-1 text-xs text-amber-500">
                  <Star :size="13" class="fill-amber-500" />
                  {{ course.rating }}
                </p>
              </div>
              <h3 class="mt-1 truncate font-semibold text-heading">{{ course.title }}</h3>
              <div class="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  class="h-full rounded-full transition-all"
                  :class="course.color"
                  :style="{ width: `${course.progress}%` }"
                />
              </div>
            </div>

            <div class="flex shrink-0 flex-col items-end gap-1 text-sm">
              <p class="font-semibold text-text">{{ course.progress }}% selesai</p>
              <p class="text-xs text-text-soft">materi sudah disampaikan</p>
            </div>
          </BaseCard>
        </div>
      </div>

      <div class="flex flex-col gap-6">
        <BaseCard class="!p-5">
          <div class="flex items-center justify-between">
            <h3 class="font-semibold text-heading">Jadwal Mengajar</h3>
            <CalendarDays :size="18" class="text-text-soft" />
          </div>
          <ul class="mt-4 flex flex-col gap-3">
            <li
              v-for="item in schedule"
              :key="item.course"
              class="flex items-center gap-3 rounded-lg border border-border p-3 text-sm"
            >
              <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary">
                <Clock :size="16" />
              </span>
              <div class="min-w-0">
                <p class="truncate font-medium text-heading">{{ item.course }}</p>
                <p class="truncate text-xs text-text-soft">
                  {{ item.day }}, {{ item.time }} &middot; {{ item.class }}
                </p>
              </div>
            </li>
          </ul>
        </BaseCard>

        <BaseCard class="!p-5">
          <div class="flex items-center justify-between">
            <h3 class="font-semibold text-heading">Ulasan Terbaru</h3>
            <MessageSquareText :size="18" class="text-text-soft" />
          </div>
          <ul class="mt-4 flex flex-col gap-3">
            <li
              v-for="review in recentReviews"
              :key="review.name"
              class="flex flex-col gap-1.5 text-sm"
            >
              <div class="flex items-center justify-between gap-2">
                <p class="truncate font-medium text-heading">{{ review.name }}</p>
                <p class="inline-flex shrink-0 items-center gap-0.5 text-xs text-amber-500">
                  <Star :size="12" class="fill-amber-500" />
                  {{ review.rating }}
                </p>
              </div>
              <p class="text-xs leading-relaxed text-text-soft">{{ review.comment }}</p>
              <p class="text-xs text-text-soft/70">{{ review.course }}</p>
            </li>
          </ul>
        </BaseCard>

        <BaseCard class="!p-5">
          <div class="flex items-center gap-3">
            <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp :size="20" />
            </span>
            <div class="flex-1">
              <p class="text-sm font-semibold text-heading">Pendapatan Bulan Ini</p>
              <p class="text-xs text-text-soft">Naik 25% dibanding bulan lalu</p>
            </div>
            <GraduationCap :size="20" class="text-text-soft" />
          </div>
        </BaseCard>
      </div>
    </section>
  </div>
</template>
