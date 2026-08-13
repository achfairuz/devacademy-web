# Design — DevAcademy Web

> Dokumentasi desain teknis (architecture) frontend Vue 3 + Vite + Pinia + Tailwind.

## 1. Tech Stack

| Lapisan | Pilihan |
| --- | --- |
| Framework | Vue 3 (Composition API + `<script setup>`) |
| Build | Vite |
| Routing | Vue Router (route guard global) |
| State | Pinia (store `auth`) |
| HTTP | Axios (custom `request()` wrapper) |
| CSS | Tailwind CSS 4 (color tokens: primary/secondary/surface/heading/text) |
| Icons | `@lucide/vue` |
| Lint | ESLint + oxlint |
| Test | Vitest |
| Type | TypeScript (strict, `vue-tsc`) |

## 2. Arsitektur Folder

```
src/
├── api/               # Klien HTTP + fungsi request per modul
│   ├── http.ts        # Axios wrapper, interceptor auth token, ApiError
│   ├── contracts/     # DTO kontrak respons API mentah (Raw*)
│   └── modules/       # auth.ts, category.ts, course.ts
├── assets/main.css    # Tema Tailwind (color tokens)
├── components/
│   ├── base/          # Komponen atomik: BaseButton, BaseCard, BaseModal,
│   │                  #   BaseInput, BaseSelect, BaseToggle, BaseTabs,
│   │                  #   BaseToast, BaseConfirmModal, BaseDrawer, dll.
│   ├── common/        # Lintas halaman: AppHeader, AppFooter, ImageCarousel,
│   │                  #   AuthTabs, navbar & sidebar per role
│   ├── home/          # TestimonialCard, FeatureCard, ProgramsCard
│   ├── course-builder/ # Wizard + editor: StepperHeader, CourseInformationStep,
│   │                  #   CurriculumStep, SectionItem, LessonItem,
│   │                  #   LessonEditorDrawer, QuizEditor, AssignmentEditor,
│   │                  #   CourseReviewStep, DropdownMenu, drag.ts
│   └── common/…       # AppNavbar (user), MentorSidebar, AdminSidebar
├── hooks/             # Composables reusable (state + API + navigasi)
├── constants/         # endpoint.ts (path API), constans.ts (nav), home.ts (landing)
├── layouts/           # DefaultLayout, AuthLayout, UserLayout, MentorLayout, AdminLayout
├── models/            # Type definition (api, auth, category, course)
├── router/            # routes.ts, guards.ts, index.ts
├── services/          # AuthService (session), courseDraftService (draft lokal)
├── stores/            # auth.ts (Pinia)
├── utils/             # formatters, icon, subscription, clone
└── views/             # Halaman per fitur & per role
```

### Pola Lapisan (dependency direction)

```
views  ──►  hooks  ──►  api/modules  ──►  api/http ──►  axios
   │             │
   │             └──► stores ──► services (localStorage)
   └──► models (hanya type), components (UI)
```

- **Views** tidak memanggil API langsung kecuali melalui `api/modules` atau hooks.
- **Hooks** mengkoordinasikan state + store + router (mis. login → redirect per role).
- **Hooks** memegang state reaktif yang dipakai beberapa view (mis. `useCourses` singleton).

## 3. Alur Autentikasi

```
LoginView ── useAuthController.login ──► store.login ──► api/auth.login ──► POST /auth/login
                                             │
                                             └──► authService.setSession(token, user) → localStorage
Redirect: ?redirect= ada? → ke halaman tsb; tidak → dashboard per role.
```

- `authService` menyimpan `token` & `user` di `localStorage` (kunci `devacademy.access_token`, `devacademy.user`).
- Interceptor Axios menambahkan `Authorization: Bearer <token>`.
- Store `auth` membaca session saat init; jika token ada tapi user tidak valid → `clearSession`.
- Guard global `router.beforeEach` (guards.ts):
  1. `requiresAuth` + tidak login → `/login?redirect=fullPath`
  2. `roles` tidak cocok → landing page
  3. `guestOnly` + sudah login → landing page

## 4. Alur Course Builder (Mentor)

```
CreateCourseView / EditCourseView
        │
        └── useCourseBuilder({ courseId? })
              │
              ├── reactive course (Course)
              ├── steps: 1 Informasi → 2 Kurikulum → 3 Review & Publish
              ├── validateInfo() : wajib judul, deskripsi, kategori, harga, level
              ├── reviewChecklist : judul, deskripsi, kategori, thumbnail, harga,
              │     min 1 section, tiap section min 1 lesson, tiap lesson berjudul,
              │     tiap lesson punya konten (video/file/quiz/assignment), quiz min 1 soal
              ├── autosave draft → courseDraftService (localStorage) tiap 1.5s
              └── persistence:
                    saveDraft() → POST/PUT /courses + syncCurriculum()
                    publish()   → create/update → PATCH status → syncCurriculum()
```

### Sinkronisasi Kurikulum (`syncCurriculum`)

1. Untuk tiap **section**: id `temp-*` = baru (POST), selain itu PUT.
2. Untuk tiap **lesson**: id `temp-*` = baru (POST), selain itu PUT.
3. Quiz/assignment per lesson: PUT jika punya id backend, POST jika baru.

Gagal sebagian operasi → `continue` (tidak menghentikan seluruh sinkronisasi). Error fatal pada save → `localOnly = true`, draft tersimpan lokal.

**Gap yang diketahui** (detail di `course-feature-audit.md`): delete section/lesson/quiz/assignment dan upload/hapus lesson file belum tersambung ke backend.

### Guard unsaved changes

- `beforeunload` memicu konfirmasi bila `dirty`.
- `onBeforeRouteLeave` memblokir navigasi bila `dirty`.

## 5. Data Model (Ringkas)

- **Auth**: `User { id, name, email, role: admin|mentor|student, avatar? }`
- **Course**: `{ id?, slug?, title, description, category_id, thumbnail?, price, level, duration, status, sections }`
- **CourseDetail** (dari `GET /courses/:id`): menambahkan `mentor`, `category`, `level`, `created_at`, `updated_at`, dan `sections[].lessons[]` lengkap dengan `files`, `quiz.questions.options`, `assignment`.
- **Section / Lesson / Quiz / QuizQuestion / QuizOption / Assignment**: struktur pembentuk kurikulum.
- **Payload** (`*Payload`): bentuk kiriman API (memisahkan bentuk edit vs. bentuk hasil GET).

> Naming: API backend memakai kebab `question_type` dsb.; model frontend memakai snake_case yang sama. Model CRUD lokal dan model detail (Course vs CourseDetail) dipisah karena struktur respons berbeda.

## 6. State Management

Hanya satu Pinia store saat ini: `useAuthStore`. State lain memakai `ref`/`reactive` dalam hooks:

| Hook | State | Scope |
| --- | --- | --- |
| `useAuth` | user, isAuthenticated, loading | global (via store) |
| `useCourses` | courses, loading, error | singleton (fetch sekali, di-cache) |
| `useCategories` | categories, loading, error | singleton |
| `useCourseDetail` | course, loading, loadError, load(id) | per-komponen |
| `useCourseBuilder` | course, step, dirty, saving, … | per-komponen |
| `useAsync` | loading, error, run(fn) | per-aksi |
| `useForm` | form reactive + reset | per-form |

## 7. Routing

| Group | Path | Layout | Auth |
| --- | --- | --- | --- |
| Publik | `/`, `/:pathMatch(.*)*` | DefaultLayout | — |
| Auth | `/login`, `/register` | AuthLayout | guestOnly |
| Student | `/user/*` (dashboard, courses, courses/:id, learning, subscription, profile, …) | UserLayout | `student` |
| Mentor | `/mentor/*` (dashboard, courses, courses/:id, courses/:id/edit, categories, …) | MentorLayout | `mentor` |
| Admin | `/admin/*` (categories, …) | AdminLayout | `admin` |

Detail lengkap di `src/router/routes.ts`.

## 8. Komponen Reusable (base)

BaseButton, BaseCard, BaseInput, BaseSelect, BaseTextarea, BaseToggle, BaseTabs, BaseModal, BaseDrawer, BaseConfirmModal, BaseToast, BaseSpinner, BaseTruncateText, RichTextEditor.

Komponen base dipakai konsisten di seluruh halaman untuk menjaga keseragaman UI.

## 9. Desain UI

- Tema: Tailwind v4 dengan custom tokens (`primary`, `secondary`, `surface`, `border`, `heading`, `text`, `text-soft`).
- Landing page: hero gradient (primary → secondary), carousel gambar, kartu fitur/program, testimoni, footer.
- Halaman dalam (user/mentor/admin): sidebar kiri + konten, `BaseCard` untuk panel, badge `rounded-full`, gradient banner untuk hero kursus.
- Bahasa UI: Indonesia.

## 10. Keamanan

- Token JWT di header Authorization via interceptor.
- Tidak ada secret di repo (`.env` di-gitignore, hanya `.env.example`).
- Route guard membatasi akses per role di sisi klien (otorisasi final tetap di backend).
- Nilai `undefined`/`null` token tidak disimpan ke localStorage.
