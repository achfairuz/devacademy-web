<script setup lang="ts">
import { CloudUpload, Image, RefreshCw, X } from '@lucide/vue'
import { computed, ref } from 'vue'

import BaseCard from '@/components/base/BaseCard.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import BaseTextarea from '@/components/base/BaseTextarea.vue'
import { useCategories } from '@/hooks/useCategories'
import type { CourseBuilder } from '@/hooks/useCourseBuilder'
import { COURSE_LEVELS } from '@/models/course'

const props = defineProps<{
  builder: CourseBuilder
}>()

const {
  categories,
  loading: categoriesLoading,
  error: categoriesError,
  reload: reloadCategories,
} = useCategories()

const categoryOptions = computed(() =>
  categories.value.map((category) => ({ value: category.id, label: category.name })),
)

const levelOptions = computed(() =>
  COURSE_LEVELS.map((level) => ({ value: level.value, label: level.label })),
)

const priceText = computed<string>({
  get: () => (props.builder.course.price ? props.builder.course.price.toLocaleString('id-ID') : ''),
  set: (value: string) => {
    const digits = value.replace(/\D/g, '')
    props.builder.course.price = digits ? Number(digits) : 0
  },
})

const durationText = computed<string>({
  get: () => (props.builder.course.duration ? String(props.builder.course.duration) : ''),
  set: (value: string) => {
    props.builder.course.duration = Math.max(0, Number(value) || 0)
  },
})

const thumbnailInput = ref<HTMLInputElement | null>(null)

function onThumbnailChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (!file.type.startsWith('image/')) {
    props.builder.showToast('File yang dipilih harus berupa gambar.', 'error')
    return
  }
  const reader = new FileReader()
  reader.onload = () => {
    props.builder.course.thumbnail = typeof reader.result === 'string' ? reader.result : undefined
  }
  reader.readAsDataURL(file)
}

function removeThumbnail() {
  props.builder.course.thumbnail = undefined
  if (thumbnailInput.value) thumbnailInput.value.value = ''
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <BaseCard class="flex flex-col gap-5">
      <div class="flex items-center gap-3">
        <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary">
          <Image :size="18" />
        </span>
        <div>
          <h2 class="font-semibold text-heading">Informasi Dasar</h2>
          <p class="text-sm text-text-soft">Lengkapi informasi utama course Anda</p>
        </div>
      </div>

      <BaseInput
        id="course-title"
        v-model="builder.course.title"
        label="Judul Course"
        placeholder="cth: Fundamental JavaScript untuk Pemula"
        required
        :error="builder.infoErrors.title"
      />

      <BaseTextarea
        id="course-description"
        v-model="builder.course.description"
        label="Deskripsi"
        placeholder="Jelaskan apa yang akan dipelajari siswa di course ini..."
        :rows="5"
        required
        :error="builder.infoErrors.description"
      />

      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div class="flex flex-col gap-1">
          <div
            v-if="categoriesLoading"
            class="flex h-10 animate-pulse items-center rounded-md border border-border bg-gray-50 px-3"
          >
            <span class="text-sm text-text-soft">Memuat kategori...</span>
          </div>
          <div v-else-if="categoriesError" class="flex flex-col gap-1.5">
            <BaseSelect
              id="course-category"
              label="Kategori"
              required
              :options="[]"
              :error="builder.infoErrors.category_id"
              disabled
            />
            <button
              type="button"
              class="inline-flex w-fit items-center gap-1.5 text-xs font-medium text-primary"
              @click="reloadCategories"
            >
              <RefreshCw :size="13" />
              Coba muat ulang kategori
            </button>
          </div>
          <BaseSelect
            v-else
            id="course-category"
            v-model="builder.course.category_id"
            label="Kategori"
            placeholder="Pilih kategori course"
            :options="categoryOptions"
            required
            :error="builder.infoErrors.category_id"
          />
          <p v-if="!categoriesLoading && !categoriesError && categories.length === 0" class="text-xs text-text-soft">
            Belum ada kategori tersedia. Hubungi admin untuk membuat kategori.
          </p>
        </div>

        <BaseSelect
          id="course-level"
          v-model="builder.course.level"
          label="Level"
          placeholder="Pilih level course"
          :options="levelOptions"
          required
          :error="builder.infoErrors.level"
        />
      </div>

      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div class="flex flex-col gap-1">
          <span class="text-sm">
            Harga
            <span class="text-red-500">*</span>
          </span>
          <div class="relative">
            <span
              class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-text-soft"
            >
              Rp
            </span>
            <input
              v-model="priceText"
              type="text"
              inputmode="numeric"
              placeholder="0"
              class="w-full rounded-md border bg-surface py-2 pl-9 pr-3 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30"
              :class="builder.infoErrors.price ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30' : 'border-border'"
            />
          </div>
          <p v-if="builder.infoErrors.price" class="text-xs text-red-500">
            {{ builder.infoErrors.price }}
          </p>
        </div>

        <div class="flex flex-col gap-1">
          <BaseInput
            id="course-duration"
            v-model="durationText"
            label="Total Durasi"
            type="number"
            placeholder="cth: 240"
            :error="undefined"
          />
          <p class="text-xs text-text-soft">Total durasi seluruh course dalam menit. cth: 240 = 4 jam</p>
        </div>
      </div>
    </BaseCard>

    <BaseCard class="flex flex-col gap-4">
      <div class="flex items-center gap-3">
        <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary-50 text-secondary-600">
          <CloudUpload :size="18" />
        </span>
        <div>
          <h2 class="font-semibold text-heading">Thumbnail</h2>
          <p class="text-sm text-text-soft">Rekomendasi ukuran 1280 &times; 720 px</p>
        </div>
      </div>

      <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label
          class="group relative flex aspect-video w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed sm:w-72"
          :class="builder.course.thumbnail ? 'border-transparent' : 'border-border hover:border-primary/50 hover:bg-primary-50/40'"
        >
          <img
            v-if="builder.course.thumbnail"
            :src="builder.course.thumbnail"
            alt="Preview thumbnail"
            class="absolute inset-0 h-full w-full object-cover"
          />
          <span
            v-else
            class="flex flex-col items-center gap-1.5 text-center text-text-soft"
          >
            <CloudUpload :size="22" class="transition-colors group-hover:text-primary" />
            <span class="text-sm font-medium">Unggah thumbnail</span>
          </span>
          <input
            ref="thumbnailInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="onThumbnailChange"
          />
        </label>

        <div class="flex flex-col gap-1.5">
          <p class="text-sm text-text-soft">
            Klik area di samping untuk memilih gambar, atau seret file gambar ke area tersebut.
          </p>
          <div v-if="builder.course.thumbnail" class="flex items-center gap-2">
            <button
              type="button"
              class="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-text transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600"
              @click="removeThumbnail"
            >
              <X :size="14" />
              Hapus thumbnail
            </button>
          </div>
        </div>
      </div>
    </BaseCard>
  </div>
</template>
