# Roadmap — DevAcademy Web

> Prioritas kerja untuk menuntaskan frontend DevAcademy. Berdasar `course-feature-audit.md`.

## Fase 1 — Menyambungkan Course CRUD ke Backend (🔴)

1. **Load kurikulum saat edit** — `toCourse` di `src/api/modules/course.ts:50` selalu `sections: []`; `useCourseBuilder.load()` hanya fetch header. Perlukan fetch nested `GET /courses/:id` (model `CourseDetail`) dan mapping ke state builder.
2. **Sinkron delete** — panggil `deleteSection` / `deleteLesson` / `deleteQuiz` / `deleteAssignment` saat item dihapus di UI (fungsi API sudah ada).
3. **Upload & hapus lesson file** — panggil `createLessonFile` (FormData) & `deleteLessonFile` dari `LessonEditorDrawer.vue`; verifikasi `http.ts` terhadap multipart.
4. **Hapus Quiz/Assignment di drawer** — ubah `draft.quiz = undefined` menjadi delete ke backend bila punya id.

## Fase 2 — Ganti Data Mock dengan API (🟡)

5. **Katalog & detail student** — ganti `courseData.ts` di `CourseView.vue` / `CourseDetailView.vue` dengan `courseApi.list()` & `getDetail()`.
6. **Dashboard mentor** — statistik dari API (bukan hardcoded).
7. **Thumbnail** — verifikasi backend menerima data URL atau buat endpoint upload.

## Fase 3 — Penyempurnaan (🟢)

8. **Level dari `GET /levels`** — ganti `COURSE_LEVELS` hardcoded.
9. **Durasi total otomatis** — hitung dari total durasi lesson.
10. **Konten landing riil** — ganti lorem ipsum di `constants/home.ts`.

## Rekomendasi Urutan

1. #3 (load kurikulum saat edit) → 2. #1 (delete sync) → 3. #2 (upload file) → 4. #4 (delete quiz/assignment) → lalu Fase 2 & 3.
