export const endpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    me: '/auth/me',
  },
  categories: {
    list: '/categories',
    detail: (id: string) => `/categories/${id}`,
  },
  levels: {
    list: '/levels',
    detail: (id: string) => `/levels/${id}`,
  },
  courses: {
    list: '/courses',
    card: '/courses/cards',
    detail: (id: string) => `/courses/${id}`,
    status: (slug: string) => `/courses/slug/${slug}/status`,
    detailsBySlug: (slug: string) => `/courses/slug/${slug}/detail`,
    sections: (courseId: string) => `/courses/${courseId}/sections`,
    sectionDetail: (courseId: string, sectionId: string) =>
      `/courses/${courseId}/sections/${sectionId}`,
    lessons: (courseId: string, sectionId: string) =>
      `/courses/${courseId}/sections/${sectionId}/lessons`,
    lessonDetail: (courseId: string, sectionId: string, lessonId: string) =>
      `/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}`,
    lessonFiles: (courseId: string, sectionId: string, lessonId: string) =>
      `/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}/files`,
    lessonFileDetail: (courseId: string, sectionId: string, lessonId: string, fileId: string) =>
      `/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}/files/${fileId}`,
    lessonQuiz: (courseId: string, sectionId: string, lessonId: string) =>
      `/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}/quizzes`,
    quizDetail: (courseId: string, sectionId: string, lessonId: string, quizId: string) =>
      `/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}/quizzes/${quizId}`,
    lessonAssignment: (courseId: string, sectionId: string, lessonId: string) =>
      `/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}/assignments`,
    assignmentDetail: (
      courseId: string,
      sectionId: string,
      lessonId: string,
      assignmentId: string,
    ) =>
      `/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}/assignments/${assignmentId}`,
  },
} as const
