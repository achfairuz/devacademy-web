import { ref } from 'vue'

import {
  createCategory as createCategoryRequest,
  deleteCategory as deleteCategoryRequest,
  getCategories,
} from '@/api/modules/category'
import type { Category } from '@/models/category'

export function useCategoryController() {
  const categories = ref<Category[]>([])
  const loading = ref(false)

  async function loadCategories() {
    loading.value = true
    try {
      categories.value = await getCategories()
    } finally {
      loading.value = false
    }
  }

  async function addCategory(payload: { name: string }): Promise<Category> {
    const created = await createCategoryRequest(payload)
    categories.value = [...categories.value, created]
    return created
  }

  async function removeCategory(id: string) {
    await deleteCategoryRequest(id)
    categories.value = categories.value.filter((category) => category.id !== id)
  }

  return { categories, loading, loadCategories, addCategory, removeCategory }
}
