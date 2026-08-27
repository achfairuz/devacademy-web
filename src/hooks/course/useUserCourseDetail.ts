import { computed, ref } from 'vue'

import { courseApi } from '@/api/modules/course'
import { getCategories } from '@/api/modules/category'
import { ApiError } from '@/api/http'
import type { Course, CourseDetail } from '@/models/course'
import { formatRupiah } from '@/utils/formatters'

const RELATED_LIMIT = 3

export function useUserCourseDetail() {
  const course = ref<CourseDetail | null>(null)
  const categoryName = ref('')
  const relatedCourses = ref<Course[]>([])
  const loading = ref(false)
  const loadError = ref<string | null>(null)

  const totalLessons = computed(() =>
    course.value
      ? course.value.sections.reduce((total, section) => total + section.lessons.length, 0)
      : 0,
  )

  const completedLessons = computed(() =>
    course.value && course.value.progress != null && totalLessons.value > 0
      ? Math.round((course.value.progress / 100) * totalLessons.value)
      : 0,
  )

  function applyCompletion() {
    if (!course.value) return
    const done = completedLessons.value
    let count = 0
    for (const section of course.value.sections) {
      for (const lesson of section.lessons) {
        lesson.completed = count < done
        count += 1
      }
    }
  }

  const displayedPrice = computed(() => {
    const price = course.value?.price ?? 0
    return price > 0 ? formatRupiah(price) : 'Gratis'
  })

  async function load(slug: string) {
    loading.value = true
    loadError.value = null
    try {
      const [data, categories, allCourses] = await Promise.all([
        courseApi.getDetailBySlug(slug),
        getCategories().catch(() => []),
        courseApi.list().catch(() => []),
      ])
      console.log('[course-detail] Loaded data:', data)
      course.value = data
      applyCompletion()
      categoryName.value =
        categories.find((category) => category.id === data.category_id)?.name ?? ''
      relatedCourses.value = allCourses.filter((item) => item.slug !== slug).slice(0, RELATED_LIMIT)
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

  return {
    course,
    categoryName,
    relatedCourses,
    loading,
    loadError,
    totalLessons,
    completedLessons,
    displayedPrice,
    load,
  }
}
