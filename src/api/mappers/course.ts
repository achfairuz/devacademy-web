import type { RawCourse, RawCourseDetail, RawLessonFile, RawQuiz } from '@/api/contracts/course'
import type {
  Course,
  CourseDetail,
  CourseQuiz,
  LessonFile,
  LessonFileKind,
  QuestionType,
} from '@/models/course'

export function toCourse(raw: RawCourse): Course {
  const levelSlug = raw.level?.slug ?? raw.Level?.Slug ?? ''
  const level = levelSlug === 'intermediate' || levelSlug === 'advanced' ? levelSlug : 'beginner'
  return {
    id: raw.id ?? raw.ID,
    slug: raw.slug ?? raw.Slug,
    title: raw.title ?? raw.Title ?? '',
    description: raw.description ?? raw.Description ?? '',
    category_id: raw.category_id ?? raw.CategoryID ?? '',
    thumbnail: raw.thumbnail ?? raw.Thumbnail,
    price: raw.price ?? raw.Price ?? 0,
    level,
    duration: raw.duration ?? raw.Duration ?? 0,
    status: (raw.status ?? raw.Status) === 'published' ? 'published' : 'draft',
    sections: [],
  }
}

export function toLessonFile(raw: RawLessonFile): LessonFile {
  return {
    id: raw.ID,
    name: raw.FileName ?? raw.Name ?? '',
    size: raw.Size,
    kind: raw.Kind as LessonFileKind | undefined,
    url: raw.FileURL ?? raw.URL,
  }
}

export function toCourseQuiz(raw: RawQuiz): CourseQuiz {
  return {
    id: raw.ID,
    title: raw.Title,
    passing_score: raw.PassingScore,
    questions: (raw.Questions ?? []).map((question) => ({
      id: question.ID,
      question: question.Question,
      question_type: question.QuestionType as QuestionType,
      options: (question.Options ?? []).map((option) => ({
        id: option.ID,
        option_text: option.OptionText,
      })),
    })),
  }
}

export function toCourseDetail(raw: RawCourseDetail): CourseDetail {
  return {
    id: raw.ID,
    mentor_id: raw.MentorID,
    category_id: raw.CategoryID,
    level_id: raw.LevelID,
    title: raw.Title,
    slug: raw.Slug,
    description: raw.Description,
    thumbnail: raw.Thumbnail,
    price: raw.Price,
    duration: raw.Duration,
    status: raw.Status === 'published' ? 'published' : 'draft',
    created_at: raw.CreatedAt,
    updated_at: raw.UpdatedAt,
    mentor: raw.Mentor
      ? {
          id: raw.Mentor.ID,
          full_name: raw.Mentor.FullName,
          username: raw.Mentor.Username,
          email: raw.Mentor.Email,
          avatar: raw.Mentor.Avatar,
          role: raw.Mentor.Role,
        }
      : null,
    category: raw.Category
      ? {
          id: raw.Category.ID,
          name: raw.Category.Name,
          slug: raw.Category.Slug,
          icon: raw.Category.Icon,
        }
      : null,
    level: raw.Level
      ? {
          id: raw.Level.ID,
          name: raw.Level.Name,
          slug: raw.Level.Slug,
        }
      : null,
    sections: (raw.Sections ?? []).map((section) => ({
      id: section.ID,
      course_id: section.CourseID,
      title: section.Title,
      order_number: section.OrderNumber,
      lessons: (section.Lessons ?? []).map((lesson) => ({
        id: lesson.ID,
        section_id: lesson.SectionID,
        title: lesson.Title,
        description: lesson.Description,
        video_url: lesson.VideoURL || undefined,
        duration: lesson.Duration,
        order_number: lesson.OrderNumber,
        is_preview: lesson.IsPreview,
        files: (lesson.Files ?? []).map(toLessonFile),
        quiz: lesson.Quiz ? toCourseQuiz(lesson.Quiz) : null,
        assignment: lesson.Assignment
          ? {
              id: lesson.Assignment.ID,
              title: lesson.Assignment.Title,
              description: lesson.Assignment.Description,
              due_date: lesson.Assignment.DueDate,
            }
          : null,
      })),
    })),
  }
}
