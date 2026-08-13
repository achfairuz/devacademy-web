# API — DevAcademy Web

> Kontrak API backend yang dipakai frontend. Base URL dari `VITE_API_BASE_URL` (default `/api`).
> Semua request melewati `src/api/http.ts` (Axios + interceptor Bearer token).

## Format Respons Umum

```ts
interface ApiResponse<T> {
  status: number
  message: string
  data: T
  errors: string | Record<string, string[]> | null
}
```

Error dilempar sebagai `ApiError { status, message, payload }` (`src/api/http.ts`).

## 1. Autentikasi — `src/api/modules/auth.ts`

### `POST /auth/login`
- Payload: `{ email, password }`
- Response `data`: `{ token, user: { ID, Name, Email, Role, Avatar? } }`
- Di-map ke `AuthData { token, user: User }`.

### `POST /auth/register`
- Payload: `{ name, email, password }`
- Mengembalikan `message` (dipakai untuk pesan sukses di halaman login).

### `GET /auth/me`
- Response `data`: objek user (mendukung bentuk `ID`/`Name` atau `id`/`name`).
- Dipakai `fetchCurrentUser()` di store auth.

## 2. Kategori — `src/api/modules/category.ts`

| Fungsi | Endpoint | Metode | Keterangan |
| --- | --- | --- | --- |
| `getCategories()` | `/categories` | GET | List kategori |
| `createCategory({ name, icon? })` | `/categories` | POST | `application/x-www-form-urlencoded` |
| `deleteCategory(id)` | `/categories/:id` | DELETE | — |

Mapping: `RawCategory { ID, Name, Slug, Icon?, CreatedAt }` → `Category`.

## 3. Kursus — `src/api/modules/course.ts`

### List & CRUD header

| Fungsi | Endpoint | Metode |
| --- | --- | --- |
| `list()` | `/courses` | GET |
| `create(payload)` | `/courses` | POST |
| `get(id)` | `/courses/:id` | GET |
| `getDetail(id)` | `/courses/:id` | GET |
| `getDetailBySlug(slug)` | `/courses/slug/:slug` | GET |
| `update(id, payload)` | `/courses/:id` | PUT |
| `remove(id)` | `/courses/:id` | DELETE |
| `publish(slug)` | `/courses/slug/:slug/status` | PATCH `{ status: 'published' }` |
| `updateStatus(slug, status)` | `/courses/slug/:slug/status` | PATCH |

`list()`/`get()` di-map ke model `Course` (menyaring level ke `beginner|intermediate|advanced` dan status ke `draft|published`).
`getDetail()` mengembalikan `CourseDetail` apa adanya (mentor, category, level, sections + lessons lengkap).

### Section

| Fungsi | Endpoint |
| --- | --- |
| `createSection(courseId, payload)` | `POST /courses/:courseId/sections` |
| `updateSection(courseId, sectionId, payload)` | `PUT /courses/:courseId/sections/:sectionId` |
| `deleteSection(courseId, sectionId)` | `DELETE /courses/:courseId/sections/:sectionId` |

Payload section: `{ title, order_number }`.

### Lesson

| Fungsi | Endpoint |
| --- | --- |
| `createLesson(courseId, sectionId, payload)` | `POST /courses/:cid/sections/:sid/lessons` |
| `updateLesson(courseId, sectionId, lessonId, payload)` | `PUT …/lessons/:lid` |
| `deleteLesson(courseId, sectionId, lessonId)` | `DELETE …/lessons/:lid` |

Payload lesson: `{ title, description, video_url?, duration, order_number, is_preview }`.

### File

| Fungsi | Endpoint |
| --- | --- |
| `createLessonFile(courseId, sectionId, lessonId, file)` | `POST …/lessons/:lid/files` (multipart `FormData`) |
| `deleteLessonFile(courseId, sectionId, lessonId, fileId)` | `DELETE …/files/:fid` |

### Quiz

| Fungsi | Endpoint |
| --- | --- |
| `createQuiz(courseId, sectionId, lessonId, payload)` | `POST …/lessons/:lid/quizzes` |
| `updateQuiz(courseId, sectionId, lessonId, quizId, payload)` | `PUT …/quizzes/:qid` |
| `deleteQuiz(courseId, sectionId, lessonId, quizId)` | `DELETE …/quizzes/:qid` |

Payload quiz: `{ title, passing_score, questions: [{ question_text, type, options: [{ option_text, is_correct }] }] }`.

### Assignment

| Fungsi | Endpoint |
| --- | --- |
| `createAssignment(courseId, sectionId, lessonId, payload)` | `POST …/lessons/:lid/assignments` |
| `updateAssignment(courseId, sectionId, lessonId, assignmentId, payload)` | `PUT …/assignments/:aid` |
| `deleteAssignment(courseId, sectionId, lessonId, assignmentId)` | `DELETE …/assignments/:aid` |

Payload assignment: `{ title, description, due_date }`.

## 4. Struktur `CourseDetail` (respons `GET /courses/:id`)

```ts
{
  id, mentor_id, category_id, level_id,
  title, slug, description, thumbnail, price, duration, status,
  created_at, updated_at,
  mentor:      { id, full_name, username, email, avatar, role },
  category:    { id, name, slug, icon? },
  level:       { id, name, slug },
  sections: [
    {
      id, course_id, title, order_number,
      lessons: [
        {
          id, section_id, title, description, video_url, duration, order_number, is_preview,
          files: LessonFile[],
          quiz: { id, title, passing_score, questions: [
            { id, question, question_type, options: [ { id, option_text } ] }
          ] } | null,
          assignment: { id, title, description, due_date } | null
        }
      ]
    }
  ]
}
```

> Catatan: respons detail memakai `question`/`question_type` (bukan `question_text`/`type`), dan option quiz tidak menyertakan `is_correct`. Model CRUD (payload) berbeda dari model respons detail.

## 5. Endpoint lain yang dipakai

| Fungsi | Endpoint |
| --- | --- |
| `GET /categories` | dropdown kategori di course builder & katalog |

## 6. Catatan Integrasi (gap)

- `courseApi.list()` memakai respons berbentuk `RawCourse` (ID/kebab) → di-map; sedangkan `getDetail()` memakai respons snake_case. Jika backend menyatukan format, `toCourse` perlu disesuaikan.
- Delete section/lesson/quiz/assignment serta upload file **belum dipanggil** dari UI (lihat `course-feature-audit.md`).
