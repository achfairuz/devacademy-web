# Audit Fitur Kursus

Daftar kesenjangan (gap) pada fitur kursus: CRUD course, section, lesson, quiz, assignment, dan file — antara frontend (Vue) dengan backend Gin.

## Status Sambungan (Sudah vs Belum)

| # | Item | Status | Prioritas |
|---|------|--------|-----------|
| 3 | Load kurikulum saat edit (fetch sections/lessons/quiz/assignment/files + mapping `RawCourse.Sections`) | Belum dibuat | 🔴 **Tinggi** |
| 1 | Sinkron delete section/lesson/quiz/assignment ke backend (fungsi API sudah ada, belum dipanggil) | Belum disambung | 🔴 **Tinggi** |
| 2 | Upload & hapus lesson files ke backend (`createLessonFile`/`deleteLessonFile` + FormData) | Belum disambung | 🔴 **Tinggi** |
| 4 | Hapus Quiz/Assignment di drawer → delete ke backend (bukan cuma `= undefined`) | Belum disambung | 🟡 Sedang |
| 7 | Thumbnail: verifikasi backend terima data URL, atau buat upload endpoint | Perlu dicek | 🟡 Sedang |
| 5 | Halaman user (`CourseView`, `CourseDetailView`) ganti mock `courseData.ts` → API | Belum disambung | 🟡 Sedang |
| 6 | Dashboard mentor: statistik dari API (bukan hardcoded) | Belum disambung | 🟡 Sedang |
| 8 | Level dari `GET /levels` (ganti `COURSE_LEVELS` hardcoded) | Belum disambung | 🟢 Rendah |
| 9 | Durasi total course dihitung otomatis dari lessons | Belum dibuat | 🟢 Rendah |

## Detail Gap

### 3. Load kurikulum saat edit — 🔴 Tinggi
- `toCourse` di `src/api/modules/course.ts:50` selalu mengisi `sections: []`.
- `load()` di `useCourseBuilder.ts` hanya fetch header course (`GET /courses/:id`), tidak memuat section/lesson/quiz/assignment/files.
- Akibat: mengedit course yang sudah punya kurikulum menampilkan kurikulum kosong.
- Perlu: fetch data nested (endpoint sudah ada di backend) + mapping `RawCourse.Sections`.

### 1. Sinkron delete ke backend — 🔴 Tinggi
- `removeSection` / `removeLesson` di `useCourseBuilder.ts` hanya menghapus dari state lokal.
- Fungsi API `deleteSection` / `deleteLesson` / `deleteQuiz` / `deleteAssignment` sudah ada di `course.ts` tapi tidak pernah dipanggil.
- Akibat: item yang dihapus tetap tersimpan di backend.

### 2. Upload lesson files — 🔴 Tinggi
- `createLessonFile` / `deleteLessonFile` sudah ada di `course.ts` tapi tidak dipanggil.
- File yang ditambahkan di `LessonEditorDrawer.vue` hanya disimpan lokal, hilang saat reload.
- `src/api/http.ts` belum teruji untuk pengiriman `FormData`.

### 4. Hapus Quiz/Assignment di drawer — 🟡 Sedang
- Tombol "Hapus Quiz"/"Hapus Assignment" hanya mengatur `draft.quiz = undefined` / `draft.assignment = undefined` (`LessonEditorDrawer.vue:256,283`), tidak ada panggilan delete ke backend.

### 7. Thumbnail — 🟡 Sedang
- "Upload" hanya mengubah gambar menjadi base64 data URL lokal (`CourseInformationStep.vue:60`).
- Perlu verifikasi apakah backend menerima `thumbnail` berupa data URL, atau perlu endpoint upload.

### 5. Halaman user masih mock — 🟡 Sedang
- `CourseView.vue` (katalog) dan `CourseDetailView.vue` memakai `courseData.ts` (mock), belum `GET /courses` dan `GET /courses/:id`.

### 6. Dashboard mentor hardcoded — 🟡 Sedang
- Statistik di `MentorDashboardView.vue:26` masih array hardcoded, belum diambil dari API.

### 8. Level hardcoded — 🟢 Rendah
- Menggunakan konstanta `COURSE_LEVELS`; endpoint `GET /levels` tidak dipakai.

### 9. Durasi total — 🟢 Rendah
- `duration` course diisi manual; tidak dihitung otomatis dari total durasi lesson.

## Urutan Pengerjaan yang Disarankan

1. **#3** Load kurikulum saat edit
2. **#1** Sinkron delete ke backend
3. **#2** Upload lesson files
4. **#4** Delete quiz/assignment dari drawer
5. Lalu sisanya (#7, #5, #6, #8, #9)
