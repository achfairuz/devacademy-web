# PRD: Standardisasi Snake Case API Response

**Status:** DRAFT
**Tanggal:** 2026-08-17
**Target:** Frontend Developer
**Deadline:** Segera (backend sudah live)

---

## 1. Ringkasan

Backend API telah melakukan standarisasi naming convention pada semua JSON response menjadi **snake_case**. Karena domain models frontend juga sudah snake_case, **API contracts dan mappers tidak lagi diperlukan** dan harus dihapus. Frontend cukup melakukan type assertion langsung.

---

## 2. Background

Sebelumnya, terdapat ketidak konsistenan pada response API:
- Beberapa endpoint mengembalikan response dengan **snake_case** (contoh: `full_name`, `total_modules`, `created_at`)
- Endpoint lain mengembalikan response dengan **PascalCase** (contoh: `FullName`, `TotalModules`, `CreatedAt`)

Backend sekarang sudah konsisten menggunakan **snake_case** untuk semua endpoint.

---

## 3. Arsitektur Frontend

### Sebelum (lama)
```
HTTP Client (axios)
    ↓
API Modules (src/api/modules/*.ts)
    ↓
API Contracts (src/api/contracts/*.ts)  ← PascalCase (HAPUS)
    ↓
Mappers (src/api/mappers/*.ts)         ← Konversi PascalCase → snake_case (HAPUS)
    ↓
Domain Models (src/models/*.ts)        ← snake_case ✓
    ↓
Hooks / Stores / Components            ← snake_case ✓
```

### Sesudah (baru)
```
HTTP Client (axios)
    ↓
API Modules (src/api/modules/*.ts)     ← Type assertion langsung ke domain model
    ↓
Domain Models (src/models/*.ts)        ← snake_case ✓
    ↓
Hooks / Stores / Components            ← snake_case ✓
```

### Yang Perlu Dilakukan

| Aksi | File |
|------|------|
| **HAPUS** | `src/api/contracts/` (seluruh directory) |
| **HAPUS** | `src/api/mappers/` (seluruh directory) |
| **UPDATE** | `src/api/modules/*.ts` - hapus import contracts & mappers, gunakan type assertion |
| **FIX** | `src/models/category.ts` - `createdAt` → `created_at` |
| **FIX** | `src/models/levels.ts` - `createdAt` → `created_at` |
| **EXTEND** | `src/models/auth.ts` - tambah field baru |
| **REVIEW** | `src/models/course.ts` - pastikan field sesuai backend |

---

## 4. Field Mapping Lengkap

Semua field di bawah merujuk pada **JSON key** yang dikembalikan backend.

### 4.1 User

| Field | Type | Notes |
|-------|------|-------|
| `id` | `string` | |
| `full_name` | `string` | Sebelumnya `FullName` di beberapa endpoint |
| `username` | `string` | **NEW** |
| `email` | `string` | |
| `phone` | `string` | **NEW** |
| `avatar` | `string` | |
| `role` | `string` | `admin` / `mentor` / `student` |
| `status` | `string` | **NEW** |
| `email_verified` | `boolean` | **NEW** |
| `created_at` | `string` | **NEW** |
| `updated_at` | `string` | **NEW** |
| ~~`password`~~ | - | **HIDDEN** - tidak di-response |
| ~~`deleted_at`~~ | - | **HIDDEN** - tidak di-response |

### 4.2 Course

| Field | Type |
|-------|------|
| `id` | `string` |
| `mentor_id` | `string` |
| `category_id` | `string` |
| `level_id` | `string` |
| `title` | `string` |
| `slug` | `string` |
| `description` | `string` |
| `thumbnail` | `string` |
| `price` | `number` |
| `duration` | `number` |
| `status` | `string` |
| `created_at` | `string` |
| `updated_at` | `string` |
| `mentor` | `object \| null` |
| `category` | `object \| null` |
| `level` | `object \| null` |
| `sections` | `array \| null` |

### 4.3 CourseSection

| Field | Type |
|-------|------|
| `id` | `string` |
| `course_id` | `string` |
| `title` | `string` |
| `order_number` | `number` |

### 4.4 Lesson

| Field | Type |
|-------|------|
| `id` | `string` |
| `section_id` | `string` |
| `title` | `string` |
| `description` | `string` |
| `video_url` | `string` |
| `duration` | `number` |
| `order_number` | `number` |
| `is_preview` | `boolean` |

### 4.5 LessonFile

| Field | Type |
|-------|------|
| `id` | `string` |
| `lesson_id` | `string` |
| `file_name` | `string` |
| `file_url` | `string` |
| `file_size` | `number` |

### 4.6 Quiz

| Field | Type |
|-------|------|
| `id` | `string` |
| `lesson_id` | `string` |
| `title` | `string` |
| `passing_score` | `number` |

### 4.7 QuizQuestion

| Field | Type |
|-------|------|
| `id` | `string` |
| `quiz_id` | `string` |
| `question` | `string` |
| `question_type` | `string` |

### 4.8 QuizOption

| Field | Type |
|-------|------|
| `id` | `string` |
| `question_id` | `string` |
| `option_text` | `string` |
| `is_correct` | `boolean` |

### 4.9 QuizAttempt

| Field | Type |
|-------|------|
| `id` | `string` |
| `quiz_id` | `string` |
| `user_id` | `string` |
| `score` | `number` |
| `status` | `string` |
| `started_at` | `string` |
| `finished_at` | `string` |

### 4.10 Assignment

| Field | Type |
|-------|------|
| `id` | `string` |
| `lesson_id` | `string` |
| `title` | `string` |
| `description` | `string` |
| `due_date` | `string` |

### 4.11 AssignmentSubmission

| Field | Type |
|-------|------|
| `id` | `string` |
| `assignment_id` | `string` |
| `student_id` | `string` |
| `file_url` | `string` |
| `score` | `number` |
| `feedback` | `string` |
| `submitted_at` | `string` |

### 4.12 Enrollment

| Field | Type |
|-------|------|
| `id` | `string` |
| `user_id` | `string` |
| `course_id` | `string` |
| `enrolled_at` | `string` |
| `completed_at` | `string` |

### 4.13 LessonProgress

| Field | Type |
|-------|------|
| `id` | `string` |
| `enrollment_id` | `string` |
| `lesson_id` | `string` |
| `is_completed` | `boolean` |
| `watched_second` | `number` |

### 4.14 Category

| Field | Type |
|-------|------|
| `id` | `string` |
| `name` | `string` |
| `slug` | `string` |
| `icon` | `string` |
| `created_at` | `string` |

### 4.15 Level

| Field | Type |
|-------|------|
| `id` | `string` |
| `name` | `string` |
| `slug` | `string` |
| `created_at` | `string` |

### 4.16 Certificate

| Field | Type |
|-------|------|
| `id` | `string` |
| `user_id` | `string` |
| `course_id` | `string` |
| `certificate_number` | `string` |
| `certificate_url` | `string` |
| `issued_at` | `string` |

### 4.17 SubscriptionPlan

| Field | Type |
|-------|------|
| `id` | `string` |
| `name` | `string` |
| `price` | `number` |
| `duration_month` | `number` |
| `max_courses` | `number` |

### 4.18 UserSubscription

| Field | Type |
|-------|------|
| `id` | `string` |
| `user_id` | `string` |
| `plan_id` | `string` |
| `start_date` | `string` |
| `end_date` | `string` |
| `status` | `string` |

### 4.19 Payment

| Field | Type |
|-------|------|
| `id` | `string` |
| `user_subscription_id` | `string` |
| `amount` | `number` |
| `payment_method` | `string` |
| `payment_gateway` | `string` |
| `transaction_id` | `string` |
| `status` | `string` |
| `paid_at` | `string` |

---

## 5. File yang Perlu Diubah

### 5.1 HAPUS (HIGH PRIORITY)

| File | Alasan |
|------|--------|
| `src/api/contracts/course.ts` | Contract PascalCase tidak lagi diperlukan |
| `src/api/contracts/levels.ts` | Contract PascalCase tidak lagi diperlukan |
| `src/api/mappers/course.ts` | Mapper tidak lagi diperlukan |
| `src/api/mappers/levels.ts` | Mapper tidak lagi diperlukan |

### 5.2 UPDATE API Modules (HIGH PRIORITY)

| File | Aksi |
|------|------|
| `src/api/modules/course.ts` | Hapus import contracts & mappers. Response langsung di-cast ke domain model. |
| `src/api/modules/auth.ts` | Hapus inline `RawUser`/`RawAuthData`. Hapus `toUser()` mapper. Cast langsung ke `User`. |
| `src/api/modules/category.ts` | Hapus inline `RawCategory`. Hapus `toCategory()` mapper. Cast langsung ke `Category`. |
| `src/api/modules/levels.ts` | Hapus import contract & mapper. Cast langsung ke `Level`. |

### 5.3 FIX Domain Models (MEDIUM PRIORITY)

| File | Aksi | Detail |
|------|------|--------|
| `src/models/category.ts` | **FIX** | `createdAt` → `created_at` |
| `src/models/levels.ts` | **FIX** | `createdAt` → `created_at` |
| `src/models/auth.ts` | **EXTEND** | Tambah: `username`, `phone`, `status`, `email_verified`, `created_at`, `updated_at` |
| `src/models/course.ts` | **REVIEW** | Pastikan field `question` (bukan `question_text`) sesuai backend |

### 5.4 NEW Types (MEDIUM PRIORITY)

Buat type definitions baru:

| File | Entity |
|------|--------|
| `src/models/quiz.ts` | `QuizAttempt` |
| `src/models/enrollment.ts` | `Enrollment`, `LessonProgress` |
| `src/models/certificate.ts` | `Certificate` |
| `src/models/subscription.ts` | `SubscriptionPlan`, `UserSubscription`, `Payment` |
| `src/models/assignment.ts` | `AssignmentSubmission` |

### 5.5 REVIEW Hooks/Stores/Services (LOW PRIORITY)

| File | Aksi |
|------|------|
| `src/stores/auth.ts` | Review field usage |
| `src/services/authService.ts` | Review serialize/deserialize |
| `src/hooks/useCourseBuilder.ts` | Review property access |
| `src/hooks/useCourses.ts` | Review property access |
| `src/hooks/useCourseDetail.ts` | Review property access |

---

## 6. Contoh Response

### GET /courses
```json
{
  "status": 200,
  "message": "courses retrieved",
  "data": [
    {
      "id": "79eaf3e2-78cb-4322-84f1-3388c75560d2",
      "mentor_id": "2bd29041-c2a4-4fbb-a3f0-c724026f6634",
      "category_id": "c76e359d-d7b7-4ff1-b12d-c31ef7ca02ad",
      "level_id": "092ceaaa-30e5-4941-ad10-7e58d5ca7ac9",
      "title": "Belajar Golang dari Dasar",
      "slug": "belajar-golang-dari-dasar",
      "description": "Belajar bahasa pemrograman Go mulai dari nol hingga siap membuat aplikasi.",
      "thumbnail": "",
      "price": 150000,
      "duration": 12,
      "status": "published",
      "created_at": "2026-08-08T15:08:38.677981+07:00",
      "updated_at": "2026-08-13T09:07:43.338427+07:00",
      "mentor": {
        "id": "2bd29041-c2a4-4fbb-a3f0-c724026f6634",
        "full_name": "Mentor DevAcademy",
        "username": "mentor",
        "email": "mentor@devacademy.com",
        "avatar": "",
        "role": "mentor"
      },
      "category": {
        "id": "c76e359d-d7b7-4ff1-b12d-c31ef7ca02ad",
        "name": "Backend Development",
        "slug": "backend-development",
        "icon": "server"
      },
      "level": {
        "id": "092ceaaa-30e5-4941-ad10-7e58d5ca7ac9",
        "name": "Beginner",
        "slug": "beginner"
      },
      "sections": null
    }
  ]
}
```

---

## 7. Strategi Implementasi

### Phase 1: Hapus Contracts & Mappers (Estimasi: 30 menit)

1. Hapus `src/api/contracts/course.ts`
2. Hapus `src/api/contracts/levels.ts`
3. Hapus `src/api/mappers/course.ts`
4. Hapus `src/api/mappers/levels.ts`

### Phase 2: Update API Modules (Estimasi: 1-2 jam)

**`src/api/modules/course.ts`** - Contoh perubahan:

```typescript
// SEBELUM
import { toCourse, toCourseDetail } from '@/api/mappers/course'
import type { RawCourse, RawCourseDetail } from '@/api/contracts/course'

async list(): Promise<Course[]> {
  const response = await request<ApiResponse<RawCourse[]>>(endpoints.courses.list)
  return (response.data ?? []).map(toCourse)
}

// SESUDAH
import type { Course, CourseDetail } from '@/models/course'

async list(): Promise<Course[]> {
  const response = await request<ApiResponse<Course[]>>(endpoints.courses.list)
  return response.data ?? []
}

async getDetail(id: string): Promise<CourseDetail> {
  const response = await request<ApiResponse<CourseDetail>>(endpoints.courses.detail(id))
  return response.data
}
```

**`src/api/modules/auth.ts`** - Contoh perubahan:

```typescript
// SEBELUM
interface RawUser { ID: string; Name: string; Email: string; Role: string; Avatar?: string }
function toUser(raw: UserLike): User { ... }

// SESUDAH
import type { User } from '@/models/auth'

// Langsung cast response ke User
export function fetchCurrentUser(): Promise<User> {
  return request<User>(endpoints.auth.me)
}
```

**`src/api/modules/category.ts`** - Contoh perubahan:

```typescript
// SEBELUM
interface RawCategory { id?: string; ID?: string; name?: string; Name?: string; ... }
function toCategory(raw: RawCategory): Category { ... }

// SESUDAH
import type { Category } from '@/models/category'

export async function getCategories(): Promise<Category[]> {
  const response = await request<ApiResponse<Category[]>>(endpoints.categories.list)
  return response.data ?? []
}
```

### Phase 3: Fix Domain Models (Estimasi: 30 menit)

1. **`src/models/category.ts`**:
```typescript
// SEBELUM
export interface Category {
  id: string
  name: string
  slug: string
  icon?: string
  createdAt: string  // ← camelCase
}

// SESUDAH
export interface Category {
  id: string
  name: string
  slug: string
  icon?: string
  created_at: string  // ← snake_case
}
```

2. **`src/models/levels.ts`**:
```typescript
// SEBELUM
export interface Level {
  id: string
  name: string
  slug: string
  createdAt: string  // ← camelCase
}

// SESUDAH
export interface Level {
  id: string
  name: string
  slug: string
  created_at: string  // ← snake_case
}
```

3. **`src/models/auth.ts`** - tambah field:
```typescript
export interface User {
  id: string
  full_name: string       // sebelumnya 'name'
  username: string        // NEW
  email: string
  phone?: string          // NEW
  avatar?: string
  role: UserRole
  status?: string         // NEW
  email_verified?: boolean // NEW
  created_at?: string     // NEW
  updated_at?: string     // NEW
}
```

4. **`src/models/course.ts`** - review field:
   - `QuizQuestion.question` sudah benar (sesuai backend `question`)
   - `LessonFile` field perlu disesuaikan: `file_name`, `file_url`, `file_size`

### Phase 4: New Types (Estimasi: 1 jam)

```typescript
// src/models/enrollment.ts
export interface Enrollment {
  id: string
  user_id: string
  course_id: string
  enrolled_at: string
  completed_at?: string
}

export interface LessonProgress {
  id: string
  enrollment_id: string
  lesson_id: string
  is_completed: boolean
  watched_second: number
}

// src/models/certificate.ts
export interface Certificate {
  id: string
  user_id: string
  course_id: string
  certificate_number: string
  certificate_url: string
  issued_at: string
}

// src/models/subscription.ts
export interface SubscriptionPlan {
  id: string
  name: string
  price: number
  duration_month: number
  max_courses: number
}

export interface UserSubscription {
  id: string
  user_id: string
  plan_id: string
  start_date: string
  end_date: string
  status: string
}

export interface Payment {
  id: string
  user_subscription_id: string
  amount: number
  payment_method: string
  payment_gateway: string
  transaction_id: string
  status: string
  paid_at: string
}
```

### Phase 5: Testing (Estimasi: 1-2 jam)

1. `npm run typecheck` - pastikan tidak ada TypeScript error
2. `npm run lint` - pastikan tidak ada lint error
3. `npm run test` - pastikan semua test pass
4. Manual testing:
   - Login / Register
   - Course listing
   - Course detail
   - Course builder (create / edit)
   - Quiz functionality
   - Assignment functionality

---

## 7. Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
|--------|--------|----------|
| Breaking changes pada production | HIGH | Deploy frontend dan backend bersamaan (coordinated release) |
| Field yang belum di-handle | MEDIUM | Optional chaining (`?.`) pada semua field |
| Test regression | MEDIUM | Jalankan semua test sebelum deploy |
| localStorage cache (user session) | LOW | Clear session setelah deploy |

---

## 8. Checklist Testing

- [ ] `npm run typecheck` - Tidak ada error
- [ ] `npm run lint` - Tidak ada warning/error
- [ ] `npm run test` - Semua test pass
- [ ] Login berhasil
- [ ] Register berhasil
- [ ] Course listing tampil benar
- [ ] Course detail tampil benar
- [ ] Course builder (create/edit) berfungsi
- [ ] Quiz berfungsi
- [ ] Assignment berfungsi
- [ ] Category listing tampil benar
- [ ] Level listing tampil benar
- [ ] User profile tampil benar
- [ ] Navigation berfungsi
- [ ] Error handling berfungsi (401, 403, 404, 500)
