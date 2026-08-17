<script setup lang="ts">
import {
  ArrowRight,
  Award,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock,
  Flame,
  Play,
  Rocket,
  Sparkles,
  Star,
  Target,
  TrendingUp,
} from '@lucide/vue'
import { RouterLink, useRouter } from 'vue-router'
import type { Component } from 'vue'

import BaseButton from '@/components/base/BaseButton.vue'
import BaseCard from '@/components/base/BaseCard.vue'
import { useAuth } from '@/hooks/useAuth'
import { formatInitials } from '@/utils/formatters'

const { user } = useAuth()
const router = useRouter()

const stats: { label: string; value: string; icon: Component; accent: string }[] = [
  { label: 'Kursus Diikuti', value: '3', icon: BookOpen, accent: 'bg-blue-50 text-blue-600' },
  { label: 'Sertifikat', value: '1', icon: Award, accent: 'bg-emerald-50 text-emerald-600' },
  { label: 'Poin Belajar', value: '240', icon: Star, accent: 'bg-amber-50 text-amber-600' },
  { label: 'Hari Streak', value: '12', icon: Flame, accent: 'bg-orange-50 text-orange-500' },
]

interface Course {
  title: string
  category: string
  progress: number
  modules: number
  duration: string
  color: string
}

const courses: Course[] = [
  {
    title: 'Fundamental JavaScript',
    category: 'Programming',
    progress: 68,
    modules: 12,
    duration: '8 jam',
    color: 'bg-primary-500',
  },
  {
    title: 'UI/UX Design Dasar',
    category: 'Design',
    progress: 40,
    modules: 9,
    duration: '6 jam',
    color: 'bg-secondary-500',
  },
  {
    title: 'Database & SQL',
    category: 'Data',
    progress: 25,
    modules: 10,
    duration: '7 jam',
    color: 'bg-emerald-500',
  },
]

const achievements: { label: string; icon: Component; done: boolean }[] = [
  { label: 'Menyelesaikan 3 modul', icon: CheckCircle2, done: true },
  { label: 'Streak belajar 7 hari', icon: Flame, done: true },
  { label: 'Mendapatkan sertifikat pertama', icon: Award, done: false },
  { label: 'Mencapai 500 poin', icon: Star, done: false },
]

const weekActivity = [
  { day: 'Sen', active: true },
  { day: 'Sel', active: true },
  { day: 'Rab', active: true },
  { day: 'Kam', active: false },
  { day: 'Jum', active: true },
  { day: 'Sab', active: false },
  { day: 'Min', active: false },
]

const quickLinks: { label: string; to: string }[] = [
  { label: 'Jelajahi Kursus', to: '/user/courses' },
  { label: 'Profile Saya', to: '/user/profile' },
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
            {{ formatInitials(user.full_name) }}
          </span>
          <div>
            <p class="text-sm text-white/80">Halo, selamat belajar kembali</p>
            <h1 class="text-2xl font-bold sm:text-3xl">{{ user.full_name }}</h1>
            <p class="mt-1 inline-flex items-center gap-1.5 text-sm text-white/90">
              <Sparkles :size="15" />
              Terus konsisten, setiap hari adalah kesempatan untuk berkembang!
            </p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div
            class="flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 backdrop-blur"
            title="Streak belajar"
          >
            <Flame :size="20" class="text-amber-300" />
            <div>
              <p class="text-lg font-bold leading-none">12 hari</p>
              <p class="text-xs text-white/80">Streak</p>
            </div>
          </div>
          <BaseButton
            variant="secondary"
            class="!bg-white !text-primary-700 hover:!bg-white/90"
            @click="router.push({ name: 'courses' })"
          >
            <Play :size="16" />
            Lanjutkan Belajar
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
            <h2 class="text-lg font-semibold text-heading">Lanjutkan Belajar</h2>
            <p class="text-sm text-text-soft">Kursus yang sedang Anda ikuti</p>
          </div>
          <RouterLink to="/user/courses" class="inline-flex items-center gap-1 text-sm font-medium text-primary">
            Lihat semua
            <ChevronRight :size="16" />
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
                <p class="text-xs text-text-soft">{{ course.progress }}% selesai</p>
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

            <div class="flex shrink-0 items-center gap-4 text-sm text-text-soft">
              <span class="inline-flex items-center gap-1">
                <BookOpen :size="15" />
                {{ course.modules }} modul
              </span>
              <span class="inline-flex items-center gap-1">
                <Clock :size="15" />
                {{ course.duration }}
              </span>
              <BaseButton class="!px-3 !py-2">Lanjut</BaseButton>
            </div>
          </BaseCard>
        </div>
      </div>

      <div class="flex flex-col gap-6">
        <BaseCard class="!p-5">
          <div class="flex items-center justify-between">
            <h3 class="font-semibold text-heading">Pencapaian</h3>
            <Trophy :size="18" class="text-amber-500" />
          </div>
          <ul class="mt-4 flex flex-col gap-3">
            <li
              v-for="item in achievements"
              :key="item.label"
              class="flex items-center gap-3 text-sm"
            >
              <component
                :is="item.done ? CheckCircle2 : Circle"
                :size="18"
                :class="item.done ? 'text-emerald-500' : 'text-gray-300'"
              />
              <span :class="item.done ? 'text-heading' : 'text-text-soft'">{{ item.label }}</span>
            </li>
          </ul>
        </BaseCard>

        <BaseCard class="!p-5">
          <div class="flex items-center justify-between">
            <h3 class="font-semibold text-heading">Aktivitas Minggu Ini</h3>
            <CalendarDays :size="18" class="text-text-soft" />
          </div>
          <div class="mt-4 flex items-center justify-between gap-2">
            <div v-for="day in weekActivity" :key="day.day" class="flex flex-col items-center gap-1.5">
              <span
                class="flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium"
                :class="
                  day.active
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-gray-100 text-gray-300'
                "
              >
                {{ day.day }}
              </span>
            </div>
          </div>
          <div class="mt-5 flex items-center gap-2 rounded-lg bg-primary-50 px-3 py-2.5 text-sm text-primary-700">
            <TrendingUp :size="16" />
            Naik <strong>25%</strong> dibanding minggu lalu
          </div>
        </BaseCard>

        <BaseCard class="!p-5">
          <div class="flex items-center gap-3">
            <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
              <Rocket :size="20" />
            </span>
            <div class="flex-1">
              <p class="text-sm font-semibold text-heading">Tantangan Harian</p>
              <p class="text-xs text-text-soft">Selesaikan 1 modul hari ini</p>
            </div>
            <Target :size="20" class="text-text-soft" />
          </div>
          <div class="mt-4 flex flex-col gap-2">
            <RouterLink
              v-for="link in quickLinks"
              :key="link.label"
              :to="link.to"
              class="flex items-center justify-between rounded-lg border border-border px-3 py-2.5 text-sm text-text transition-colors hover:border-primary/40 hover:text-primary"
            >
              {{ link.label }}
              <ArrowRight :size="15" />
            </RouterLink>
          </div>
        </BaseCard>
      </div>
    </section>
  </div>
</template>
