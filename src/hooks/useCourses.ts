import { onMounted, ref } from 'vue'

import { courseApi } from '@/api/modules/course'
import type { Course } from '@/models/course'

const courses = ref<Course[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
let loaded = false

export function useCourses() {
  async function load() {
    if (loaded) return
    loaded = true
    loading.value = true
    error.value = null
    try {
      courses.value = await courseApi.list()
    } catch (err) {
      console.error('[courses] Gagal memuat kursus.', err)
      error.value = 'Gagal memuat kursus.'
    } finally {
      loading.value = false
    }
  }

  async function removeCourse(id: string, slug: string) {
    await courseApi.remove(id)
    courses.value = courses.value.filter((item) => item.id !== id)
    return slug
  }

  onMounted(load)

  return { courses, loading, error, reload: load, removeCourse }
}
