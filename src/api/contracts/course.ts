export interface RawCourse {
  id?: string
  ID?: string
  mentor_id?: string
  MentorID?: string
  category_id?: string
  CategoryID?: string
  level_id?: string
  LevelID?: string
  title?: string
  Title?: string
  slug?: string
  Slug?: string
  description?: string
  Description?: string
  thumbnail?: string
  Thumbnail?: string
  price?: number
  Price?: number
  duration?: number
  Duration?: number
  status?: string
  Status?: string
  category?: { id?: string; name?: string; slug?: string; icon?: string } | null
  Category?: { ID?: string; Name?: string; Slug?: string; Icon?: string } | null
  level?: { id?: string; name?: string; slug?: string } | null
  Level?: { ID?: string; Name?: string; Slug?: string } | null
}

export interface RawMentor {
  ID: string
  FullName: string
  Username: string
  Email: string
  Avatar: string
  Role: string
}

export interface RawCategoryRef {
  ID: string
  Name: string
  Slug: string
  Icon?: string
}

export interface RawLevelRef {
  ID: string
  Name: string
  Slug: string
}

export interface RawQuizOption {
  ID: string
  OptionText: string
}

export interface RawQuizQuestion {
  ID: string
  Question: string
  QuestionType: string
  Options: RawQuizOption[] | null
}

export interface RawQuiz {
  ID: string
  Title: string
  PassingScore: number
  Questions: RawQuizQuestion[] | null
}

export interface RawAssignment {
  ID: string
  Title: string
  Description: string
  DueDate: string
}

export interface RawLessonFile {
  ID?: string
  Name?: string
  FileName?: string
  Size?: number
  Kind?: string
  FileURL?: string
  URL?: string
}

export interface RawLesson {
  ID: string
  SectionID: string
  Title: string
  Description: string
  VideoURL: string
  Duration: number
  OrderNumber: number
  IsPreview: boolean
  Files: RawLessonFile[] | null
  Quiz: RawQuiz | null
  Assignment: RawAssignment | null
}

export interface RawSection {
  ID: string
  CourseID: string
  Title: string
  OrderNumber: number
  Lessons: RawLesson[] | null
}

export interface RawCourseDetail {
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
  CreatedAt: string
  UpdatedAt: string
  Mentor?: RawMentor | null
  Category?: RawCategoryRef | null
  Level?: RawLevelRef | null
  Sections: RawSection[] | null
}
