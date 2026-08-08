import { request } from '@/api/http'
import { endpoints } from '@/constants/endpoint'
import type { ApiResponse } from '@/models/api'
import type {
  Assignment,
  AssignmentPayload,
  Course,
  CoursePayload,
  LessonPayload,
  Lesson,
  LessonFile,
  QuizPayload,
  Quiz,
  SectionPayload,
  Section,
} from '@/models/course'

interface RawCourse {
  ID: string
  MentorID: string
  CategoryID: string
  LevelID: string
  Title: string
  Slug: string
  Description: string
  Thumbnail: string
  Price: number
  Duration: number
  Status: string
  Category?: { ID: string; Name: string; Slug: string; Icon?: string } | null
  Level?: { ID: string; Name: string; Slug: string } | null
}

function toCourse(raw: RawCourse): Course {
  const level =
    raw.Level?.Slug === 'intermediate' || raw.Level?.Slug === 'advanced'
      ? raw.Level.Slug
      : 'beginner'
  return {
    id: raw.ID,
    slug: raw.Slug,
    title: raw.Title,
    description: raw.Description,
    category_id: raw.CategoryID,
    thumbnail: raw.Thumbnail || undefined,
    price: raw.Price,
    level,
    duration: raw.Duration,
    status: raw.Status === 'published' ? 'published' : 'draft',
    sections: [],
  }
}

export const courseApi = {
  async list(): Promise<Course[]> {
    const response = await request<ApiResponse<RawCourse[]>>(endpoints.courses.list)
    return (response.data ?? []).map(toCourse)
  },

  async create(payload: CoursePayload): Promise<Course> {
    const response = await request<ApiResponse<RawCourse>>(endpoints.courses.list, {
      method: 'POST',
      body: payload,
    })
    return toCourse(response.data)
  },

  async get(id: string): Promise<Course> {
    const response = await request<ApiResponse<RawCourse>>(endpoints.courses.detail(id))
    return toCourse(response.data)
  },

  async update(id: string, payload: CoursePayload): Promise<Course> {
    const response = await request<ApiResponse<RawCourse>>(endpoints.courses.detail(id), {
      method: 'PUT',
      body: payload,
    })
    return toCourse(response.data)
  },

  async remove(id: string): Promise<void> {
    await request<ApiResponse<null>>(endpoints.courses.detail(id), { method: 'DELETE' })
  },

  async publish(slug: string): Promise<void> {
    await request<ApiResponse<null>>(endpoints.courses.status(slug), {
      method: 'PATCH',
      body: { status: 'published' },
    })
  },

  async updateStatus(slug: string, status: 'draft' | 'published'): Promise<void> {
    await request<ApiResponse<null>>(endpoints.courses.status(slug), {
      method: 'PATCH',
      body: { status },
    })
  },

  async createSection(courseId: string, payload: SectionPayload): Promise<Section> {
    const response = await request<ApiResponse<Section>>(endpoints.courses.sections(courseId), {
      method: 'POST',
      body: payload,
    })
    return { ...response.data, lessons: response.data.lessons ?? [] }
  },

  async updateSection(courseId: string, sectionId: string, payload: SectionPayload): Promise<Section> {
    const response = await request<ApiResponse<Section>>(
      endpoints.courses.sectionDetail(courseId, sectionId),
      { method: 'PUT', body: payload },
    )
    return { ...response.data, lessons: response.data.lessons ?? [] }
  },

  async deleteSection(courseId: string, sectionId: string): Promise<void> {
    await request<ApiResponse<null>>(endpoints.courses.sectionDetail(courseId, sectionId), {
      method: 'DELETE',
    })
  },

  async createLesson(courseId: string, sectionId: string, payload: LessonPayload): Promise<Lesson> {
    const response = await request<ApiResponse<Lesson>>(endpoints.courses.lessons(courseId, sectionId), {
      method: 'POST',
      body: payload,
    })
    return { ...response.data, files: response.data.files ?? [] }
  },

  async updateLesson(
    courseId: string,
    sectionId: string,
    lessonId: string,
    payload: LessonPayload,
  ): Promise<Lesson> {
    const response = await request<ApiResponse<Lesson>>(
      endpoints.courses.lessonDetail(courseId, sectionId, lessonId),
      { method: 'PUT', body: payload },
    )
    return { ...response.data, files: response.data.files ?? [] }
  },

  async deleteLesson(courseId: string, sectionId: string, lessonId: string): Promise<void> {
    await request<ApiResponse<null>>(endpoints.courses.lessonDetail(courseId, sectionId, lessonId), {
      method: 'DELETE',
    })
  },

  async createLessonFile(
    courseId: string,
    sectionId: string,
    lessonId: string,
    file: File,
  ): Promise<LessonFile> {
    const body = new FormData()
    body.append('file', file)
    const response = await request<ApiResponse<LessonFile>>(
      endpoints.courses.lessonFiles(courseId, sectionId, lessonId),
      { method: 'POST', body },
    )
    return response.data
  },

  async deleteLessonFile(
    courseId: string,
    sectionId: string,
    lessonId: string,
    fileId: string,
  ): Promise<void> {
    await request<ApiResponse<null>>(
      endpoints.courses.lessonFileDetail(courseId, sectionId, lessonId, fileId),
      { method: 'DELETE' },
    )
  },

  async createQuiz(
    courseId: string,
    sectionId: string,
    lessonId: string,
    payload: QuizPayload,
  ): Promise<Quiz> {
    const response = await request<ApiResponse<Quiz>>(
      endpoints.courses.lessonQuiz(courseId, sectionId, lessonId),
      { method: 'POST', body: payload },
    )
    return { ...response.data, questions: response.data.questions ?? [] }
  },

  async updateQuiz(
    courseId: string,
    sectionId: string,
    lessonId: string,
    quizId: string,
    payload: QuizPayload,
  ): Promise<Quiz> {
    const response = await request<ApiResponse<Quiz>>(
      endpoints.courses.quizDetail(courseId, sectionId, lessonId, quizId),
      { method: 'PUT', body: payload },
    )
    return { ...response.data, questions: response.data.questions ?? [] }
  },

  async deleteQuiz(courseId: string, sectionId: string, lessonId: string, quizId: string): Promise<void> {
    await request<ApiResponse<null>>(
      endpoints.courses.quizDetail(courseId, sectionId, lessonId, quizId),
      { method: 'DELETE' },
    )
  },

  async createAssignment(
    courseId: string,
    sectionId: string,
    lessonId: string,
    payload: AssignmentPayload,
  ): Promise<Assignment> {
    const response = await request<ApiResponse<Assignment>>(
      endpoints.courses.lessonAssignment(courseId, sectionId, lessonId),
      { method: 'POST', body: payload },
    )
    return response.data
  },

  async updateAssignment(
    courseId: string,
    sectionId: string,
    lessonId: string,
    assignmentId: string,
    payload: AssignmentPayload,
  ): Promise<Assignment> {
    const response = await request<ApiResponse<Assignment>>(
      endpoints.courses.assignmentDetail(courseId, sectionId, lessonId, assignmentId),
      { method: 'PUT', body: payload },
    )
    return response.data
  },

  async deleteAssignment(
    courseId: string,
    sectionId: string,
    lessonId: string,
    assignmentId: string,
  ): Promise<void> {
    await request<ApiResponse<null>>(
      endpoints.courses.assignmentDetail(courseId, sectionId, lessonId, assignmentId),
      { method: 'DELETE' },
    )
  },
}
