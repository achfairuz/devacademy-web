import { onMounted, ref } from 'vue'

import { getCategories } from '@/api/modules/category'
import type { Category } from '@/models/category'

const categories = ref<Category[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
let loaded = false

export function useCategories() {
  async function load() {
    if (loaded) return
    loaded = true
    loading.value = true
    error.value = null
    try {
      categories.value = await getCategories()
    } catch (err) {
      console.error('[categories] Gagal memuat kategori.', err)
      error.value = 'Gagal memuat kategori.'
    } finally {
      loading.value = false
    }
  }

  onMounted(load)

  return { categories, loading, error, reload: load }
}
