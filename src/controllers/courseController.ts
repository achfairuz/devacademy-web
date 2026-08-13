import { ref } from 'vue'

import { courseApi } from '@/api/modules/course'
import type { Course, CourseDetail } from '@/models/course'

export function useCourseController() {
  const courses = ref<Course[]>([])
  const course = ref<CourseDetail | null>(null)
  const loading = ref(false)

  async function loadCourses() {
    loading.value = true
    try {
      courses.value = await courseApi.list()
    } finally {
      loading.value = false
    }
  }

  async function loadCourse(id: string) {
    loading.value = true
    try {
      course.value = await courseApi.getDetail(id)
      return course.value
    } finally {
      loading.value = false
    }
  }

  async function removeCourse(id: string, slug: string) {
    await courseApi.remove(id)
    courses.value = courses.value.filter((item) => item.id !== id)
    if (course.value?.id === id) course.value = null
    return slug
  }

  return { courses, course, loading, loadCourses, loadCourse, removeCourse }
}
