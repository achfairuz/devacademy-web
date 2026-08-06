<script setup lang="ts">
import {
  BadgeCheck,
  CalendarDays,
  Check,
  CheckCircle2,
  CreditCard,
  Crown,
  Infinity as InfinityIcon,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  Zap,
} from '@lucide/vue'
import { computed, ref } from 'vue'

import BaseButton from '@/components/base/BaseButton.vue'
import BaseCard from '@/components/base/BaseCard.vue'
import { getSubscriptionPlan, setSubscriptionPlan } from '@/utils/subscription'

const billing = ref<'monthly' | 'yearly'>('monthly')
const currentPlanId = ref(getSubscriptionPlan())

interface Plan {
  id: string
  name: string
  icon: typeof Crown
  monthlyPrice: number
  yearlyPrice: number
  description: string
  features: string[]
  popular: boolean
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    icon: Zap,
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: 'Mulai belajar secara gratis',
    features: [
      'Akses 3 course dasar',
      'Progress belajar',
      'Forum diskusi umum',
      'Kuis per modul',
    ],
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    icon: Sparkles,
    monthlyPrice: 149,
    yearlyPrice: 119,
    description: 'Untuk pembelajar serius',
    features: [
      'Akses semua course',
      'Materi & quiz premium',
      'Sertifikat penyelesaian',
      'Mentoring terbatas',
      'Tracking progress lanjutan',
    ],
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    icon: Crown,
    monthlyPrice: 299,
    yearlyPrice: 239,
    description: 'Pengalaman belajar maksimal',
    features: [
      'Semua fitur Pro',
      'Mentoring 1-on-1',
      'Proyek portofolio',
      'Prioritas bantuan',
      'Diskon webinar eksklusif',
      'Akses komunitas alumni',
    ],
    popular: false,
  },
]

const currentPlan = computed(() => plans.find((plan) => plan.id === currentPlanId.value))

const displayPrice = (plan: Plan) => {
  const price = billing.value === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice
  return price === 0 ? 'Gratis' : `Rp ${price * 1000}`
}

const selectedPlan = (plan: Plan) => plan.id === currentPlanId.value

function choosePlan(plan: Plan) {
  setSubscriptionPlan(plan.id)
  currentPlanId.value = plan.id
}

const paymentHistory = [
  { id: 'INV-2026-014', date: '12 Jul 2026', plan: 'Premium', amount: 'Rp 299.000', status: 'Lunas' },
  { id: 'INV-2026-011', date: '12 Jun 2026', plan: 'Premium', amount: 'Rp 299.000', status: 'Lunas' },
  { id: 'INV-2026-008', date: '12 Mei 2026', plan: 'Premium', amount: 'Rp 299.000', status: 'Lunas' },
]
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-1">
      <h1 class="text-2xl font-bold text-heading">Subscription</h1>
      <p class="text-sm text-text-soft">Kelola langganan dan pilih plan terbaik untuk Anda</p>
    </div>

    <section
      class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 via-amber-400 to-yellow-400 p-8 text-white shadow-lg"
    >
      <div class="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/15 blur-2xl" />
      <div class="pointer-events-none absolute -bottom-20 right-24 h-40 w-40 rounded-full bg-white/15 blur-xl" />

      <div class="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-4">
          <span class="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
            <component :is="currentPlan?.icon ?? Crown" :size="30" />
          </span>
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-xl font-bold">Plan {{ currentPlan?.name ?? 'Premium' }}</h2>
              <span class="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold backdrop-blur">
                <BadgeCheck :size="13" />
                Aktif
              </span>
            </div>
            <p class="mt-0.5 text-sm text-white/90">
              {{ currentPlan?.id === 'free' ? 'Berlangganan gratis aktif' : 'Berakhir pada 12 Agustus 2026' }}
            </p>
          </div>
        </div>
        <div class="flex flex-wrap items-center gap-3 text-sm text-white/90">
          <span class="inline-flex items-center gap-1.5">
            <InfinityIcon :size="15" />
            Akses course sesuai plan
          </span>
          <span class="inline-flex items-center gap-1.5">
            <ShieldCheck :size="15" />
            Sertifikat
          </span>
          <span class="inline-flex items-center gap-1.5">
            <CalendarDays :size="15" />
            Tagihan bulanan
          </span>
        </div>
      </div>
    </section>

    <div class="flex items-center justify-center gap-2">
      <span class="text-sm font-medium" :class="billing === 'monthly' ? 'text-heading' : 'text-text-soft'">
        Bulanan
      </span>
      <button
        type="button"
        role="switch"
        :aria-checked="billing === 'yearly'"
        class="relative h-6 w-12 rounded-full transition-colors"
        :class="billing === 'yearly' ? 'bg-primary' : 'bg-gray-200'"
        @click="billing = billing === 'monthly' ? 'yearly' : 'monthly'"
      >
        <span
          class="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all"
          :class="billing === 'yearly' ? 'left-7' : 'left-0.5'"
        />
      </button>
      <span class="text-sm font-medium" :class="billing === 'yearly' ? 'text-heading' : 'text-text-soft'">
        Tahunan
        <span class="ml-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-600">
          Hemat 20%
        </span>
      </span>
    </div>

    <div class="grid grid-cols-1 gap-5 md:grid-cols-3">
      <BaseCard
        v-for="plan in plans"
        :key="plan.id"
        class="relative flex flex-col gap-4 p-6 transition-all"
        :class="plan.popular ? 'border-2 border-primary shadow-md' : 'hover:border-primary/40'"
      >
        <span
          v-if="plan.popular"
          class="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white"
        >
          Terpopuler
        </span>

        <div class="flex items-center justify-between">
          <span
            class="flex h-12 w-12 items-center justify-center rounded-xl"
            :class="selectedPlan(plan) ? 'bg-amber-50 text-amber-500' : 'bg-gray-100 text-text-soft'"
          >
            <component :is="plan.icon" :size="22" />
          </span>
          <span
            v-if="selectedPlan(plan)"
            class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600"
          >
            <CheckCircle2 :size="13" />
            Plan Anda
          </span>
        </div>

        <div>
          <h3 class="text-lg font-bold text-heading">{{ plan.name }}</h3>
          <p class="text-sm text-text-soft">{{ plan.description }}</p>
        </div>

        <div class="flex items-baseline gap-1">
          <p class="text-3xl font-bold text-heading">{{ displayPrice(plan) }}</p>
          <p v-if="plan.monthlyPrice > 0" class="text-sm text-text-soft">/bulan</p>
        </div>

        <ul class="flex flex-col gap-2.5">
          <li v-for="feature in plan.features" :key="feature" class="flex items-start gap-2 text-sm text-text">
            <Check :size="16" class="mt-0.5 shrink-0 text-emerald-500" />
            {{ feature }}
          </li>
        </ul>

        <BaseButton
          class="mt-auto w-full"
          :variant="plan.popular || selectedPlan(plan) ? 'primary' : 'secondary'"
          :disabled="selectedPlan(plan)"
          @click="choosePlan(plan)"
        >
          {{ selectedPlan(plan) ? 'Berlangganan Aktif' : plan.monthlyPrice === 0 ? 'Gunakan Gratis' : 'Pilih Plan' }}
        </BaseButton>
      </BaseCard>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <BaseCard>
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-heading">Metode Pembayaran</h2>
          <CreditCard :size="18" class="text-text-soft" />
        </div>
        <div class="mt-4 flex items-center gap-4 rounded-lg border border-border p-4">
          <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary">
            <CreditCard :size="20" />
          </span>
          <div class="min-w-0 flex-1">
            <p class="text-sm font-medium text-heading">Visa •••• 4242</p>
            <p class="text-xs text-text-soft">Berlaku hingga 08/28</p>
          </div>
          <button
            type="button"
            class="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-text transition-colors hover:border-primary/40 hover:text-primary"
          >
            Ganti
          </button>
        </div>
        <p class="mt-4 flex items-center gap-1.5 text-xs text-text-soft">
          <ShieldCheck :size="14" class="text-emerald-500" />
          Pembayaran Anda aman dan terenkripsi.
        </p>
      </BaseCard>

      <BaseCard>
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-heading">Riwayat Tagihan</h2>
          <ReceiptText :size="18" class="text-text-soft" />
        </div>
        <div class="mt-4 flex flex-col gap-3">
          <div
            v-for="payment in paymentHistory"
            :key="payment.id"
            class="flex items-center gap-4 rounded-lg border border-border px-4 py-3"
          >
            <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-text-soft">
              <ReceiptText :size="16" />
            </span>
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-medium text-heading">{{ payment.id }}</p>
              <p class="text-xs text-text-soft">{{ payment.date }} • {{ payment.plan }}</p>
            </div>
            <div class="text-right">
              <p class="text-sm font-semibold text-heading">{{ payment.amount }}</p>
              <p class="text-xs font-medium text-emerald-600">{{ payment.status }}</p>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>
