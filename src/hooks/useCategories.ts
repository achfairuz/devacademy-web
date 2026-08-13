import { onMounted, ref } from 'vue'

import {
  createCategory as createCategoryRequest,
  deleteCategory as deleteCategoryRequest,
  getCategories,
} from '@/api/modules/category'
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

  async function addCategory(payload: { name: string; icon?: string }): Promise<Category> {
    const created = await createCategoryRequest(payload)
    categories.value = [...categories.value, created]
    return created
  }

  async function removeCategory(id: string) {
    await deleteCategoryRequest(id)
    categories.value = categories.value.filter((category) => category.id !== id)
  }

  onMounted(load)

  return { categories, loading, error, reload: load, addCategory, removeCategory }
}
