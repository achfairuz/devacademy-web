<script setup lang="ts">
import {
  Award,
  BookOpen,
  CalendarDays,
  Check,
  Flame,
  LogOut,
  Mail,
  Pencil,
  Save,
  ShieldCheck,
  Star,
} from '@lucide/vue'
import { storeToRefs } from 'pinia'
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import BaseButton from '@/components/base/BaseButton.vue'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import { useAuthStore } from '@/stores/auth'
import { formatInitials } from '@/utils/formatters'
import { getSubscriptionPlan } from '@/utils/subscription'
import { courses } from '@/views/user/course/courseData'

const auth = useAuthStore()
const router = useRouter()
const { user } = storeToRefs(auth)

const isEditing = ref(false)
const saved = ref(false)

const form = reactive({
  name: user.value?.name ?? '',
  email: user.value?.email ?? '',
})

const roleLabels: Record<string, string> = {
  student: 'Siswa',
  mentor: 'Mentor',
  admin: 'Admin',
}

const planLabels: Record<string, string> = {
  free: 'Free',
  pro: 'Pro',
  premium: 'Premium',
}

const subscriptionPlan = computed(() => {
  const plan = getSubscriptionPlan()
  return planLabels[plan] ?? 'Premium'
})

const enrolledCourses = computed(() => courses.filter((course) => course.isEnrolled))

const completedLessons = computed(() =>
  enrolledCourses.value.reduce(
    (total, course) =>
      total +
      course.modulesData.reduce(
        (sum, module) => sum + module.lessons.filter((lesson) => lesson.completed).length,
        0,
      ),
    0,
  ),
)

const stats = computed(() => [
  { label: 'Course Dimiliki', value: String(enrolledCourses.value.length), icon: BookOpen, accent: 'bg-primary-50 text-primary' },
  { label: 'Pelajaran Selesai', value: String(completedLessons.value), icon: Award, accent: 'bg-emerald-50 text-emerald-600' },
  { label: 'Poin Belajar', value: '240', icon: Star, accent: 'bg-amber-50 text-amber-500' },
  { label: 'Hari Streak', value: '12', icon: Flame, accent: 'bg-orange-50 text-orange-500' },
])

function toggleEdit() {
  isEditing.value = !isEditing.value
}

function saveProfile() {
  auth.updateProfile({ name: form.name, email: form.email })
  isEditing.value = false
  saved.value = true
  setTimeout(() => (saved.value = false), 2500)
}

function handleLogout() {
  auth.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <div v-if="user" class="flex flex-col gap-6">
    <div class="flex flex-col gap-1">
      <h1 class="text-2xl font-bold text-heading">Profile</h1>
      <p class="text-sm text-text-soft">Kelola informasi akun Anda</p>
    </div>

    <section
      class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500 p-8 text-white shadow-lg"
    >
      <div class="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
      <div class="pointer-events-none absolute -bottom-20 right-24 h-40 w-40 rounded-full bg-white/10 blur-xl" />

      <div class="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center">
        <img
          v-if="user.avatar"
          :src="user.avatar"
          :alt="user.name"
          class="h-20 w-20 rounded-2xl object-cover shadow-lg"
        />
        <span
          v-else
          class="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 text-2xl font-bold backdrop-blur"
        >
          {{ formatInitials(user.name) }}
        </span>

        <div class="flex-1">
          <div class="flex flex-wrap items-center gap-2">
            <h2 class="text-2xl font-bold">{{ user.name }}</h2>
            <span
              class="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur"
            >
              <ShieldCheck :size="13" />
              {{ roleLabels[user.role] ?? user.role }}
            </span>
          </div>
          <p class="mt-1 inline-flex items-center gap-1.5 text-sm text-white/90">
            <Mail :size="14" />
            {{ user.email }}
          </p>
          <p class="mt-1 inline-flex items-center gap-1.5 text-sm text-white/80">
            <CalendarDays :size="14" />
            Bergabung sejak Januari 2026
          </p>
        </div>

        <BaseButton
          variant="secondary"
          class="!bg-white !text-primary-700 hover:!bg-white/90"
          @click="handleLogout"
        >
          <LogOut :size="16" />
          Keluar
        </BaseButton>
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

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <BaseCard class="lg:col-span-2">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-semibold text-heading">Informasi Pribadi</h2>
            <p class="text-sm text-text-soft">Perbarui informasi yang ingin Anda tampilkan</p>
          </div>
          <BaseButton v-if="!isEditing" variant="secondary" class="!px-4 !py-2" @click="toggleEdit">
            <Pencil :size="15" />
            Edit
          </BaseButton>
          <p
            v-if="saved"
            class="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-600"
          >
            <Check :size="16" />
            Perubahan berhasil disimpan
          </p>
        </div>

        <form
          class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2"
          @submit.prevent="saveProfile"
        >
          <BaseInput
            v-model="form.name"
            id="profile-name"
            label="Nama Lengkap"
            :disabled="!isEditing"
            required
          />
          <BaseInput
            v-model="form.email"
            id="profile-email"
            label="Email"
            type="email"
            :disabled="!isEditing"
            required
          />

          <div class="flex items-center gap-3 sm:col-span-2">
            <BaseButton v-if="isEditing" type="submit" class="w-full sm:w-auto">
              <Save :size="16" />
              Simpan Perubahan
            </BaseButton>
            <BaseButton
              v-if="isEditing"
              type="button"
              variant="secondary"
              class="w-full sm:w-auto"
              @click="toggleEdit"
            >
              Batal
            </BaseButton>
          </div>
        </form>
      </BaseCard>

      <BaseCard>
        <h2 class="text-lg font-semibold text-heading">Keamanan Akun</h2>
        <p class="mt-1 text-sm text-text-soft">Pertahankan akun Anda tetap aman</p>
        <div class="mt-5 flex flex-col gap-3">
          <div class="flex items-center justify-between rounded-lg border border-border px-4 py-3">
            <div>
              <p class="text-sm font-medium text-heading">Kata Sandi</p>
              <p class="text-xs text-text-soft">Terakhir diubah 3 bulan lalu</p>
            </div>
            <button
              type="button"
              class="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-text transition-colors hover:border-primary/40 hover:text-primary"
            >
              Ubah
            </button>
          </div>
          <div class="flex items-center justify-between rounded-lg border border-border px-4 py-3">
            <div>
              <p class="text-sm font-medium text-heading">Verifikasi Email</p>
              <p class="text-xs text-emerald-600">Terverifikasi</p>
            </div>
            <span class="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
              <Check :size="14" />
            </span>
          </div>
          <div class="flex items-center justify-between rounded-lg border border-border px-4 py-3">
            <div>
              <p class="text-sm font-medium text-heading">Plan Berlangganan</p>
              <p class="text-xs text-text-soft">{{ subscriptionPlan }}</p>
            </div>
            <span
              class="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-600"
            >
              <Star :size="12" class="fill-amber-500" />
              {{ subscriptionPlan === 'Free' ? 'Gratis' : 'Aktif' }}
            </span>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>
