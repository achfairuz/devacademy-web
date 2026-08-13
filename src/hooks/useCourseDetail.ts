import { ref } from 'vue'

import { courseApi } from '@/api/modules/course'
import { ApiError } from '@/api/http'
import type { CourseDetail } from '@/models/course'

export function useCourseDetail() {
  const course = ref<CourseDetail | null>(null)
  const loading = ref(false)
  const loadError = ref<string | null>(null)

  async function load(id: string) {
    loading.value = true
    loadError.value = null
    try {
      course.value = await courseApi.getDetail(id)
    } catch (error) {
      console.error('[course-detail] Gagal memuat course.', error)
      loadError.value =
        error instanceof ApiError && error.status === 404
          ? 'Course tidak ditemukan.'
          : 'Gagal memuat detail course.'
    } finally {
      loading.value = false
    }
  }

  return { course, loading, loadError, load }
}
