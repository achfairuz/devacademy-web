import { ref } from 'vue'

import { courseApi, type CourseCardQuery } from '@/api/modules/course'
import { usePaginatedList } from '@/hooks/common/usePaginatedList'
import type { Course, CourseCardList } from '@/models/course'

const CARD_PAGE_SIZE = 12

const courses = ref<Course[]>([])
let cardQuery: CourseCardQuery = {}

const cardList = usePaginatedList<CourseCardList>(
  (page, pageSize) => courseApi.listCard({ ...cardQuery, page, pageSize }),
  { pageSize: CARD_PAGE_SIZE, errorMessage: 'Gagal memuat kursus.' },
)

export function useCourses() {
  async function load() {
    try {
      courses.value = await courseApi.list()
    } catch (err) {
      console.error('[courses] Gagal memuat kursus.', err)
    }
  }

  async function loadCard(query: CourseCardQuery = {}) {
    cardQuery = query
    await cardList.load(query.page ?? 1)
  }

  async function removeCourse(id: string, slug: string) {
    await courseApi.remove(id)
    courses.value = courses.value.filter((item) => item.id !== id)
    return slug
  }

  return {
    courses,
    coursesCard: cardList.items,
    cardMeta: cardList.meta,
    loading: cardList.loading,
    error: cardList.error,
    reload: load,
    removeCourse,
    loadCard,
  }
}
