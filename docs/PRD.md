# PRD — DevAcademy Web

> Product Requirements Document untuk frontend web DevAcademy (Vue 3 + Vite).

## 1. Ringkasan Produk

**DevAcademy** adalah platform kursus online (Learning Management System) dengan tiga peran pengguna: **Admin**, **Mentor**, dan **Student**. Frontend ini menyediakan:

- Landing page publik untuk pemasaran.
- Autentikasi (login, registrasi, session).
- Katalog & detail kursus untuk student.
- Learning dashboard, progress belajar, dan manajemen langganan.
- Course builder untuk mentor (buat/edit kursus, section, lesson, quiz, assignment, file).
- Panel admin untuk mengelola kategori.
- Role-based routing dan route guard.

## 2. Tujuan & Ruang Lingkup

### Tujuan
1. Menjadi frontend resmi platform kursus DevAcademy.
2. Memberi alur yang jelas bagi tiga peran: mentor membuat & menerbitkan kursus, student mencari & mengikuti kursus, admin memoderasi data.
3. Offline-first saat backend tidak tersedia (draft kursus tersimpan di `localStorage`).

### Diluar Lingkup (saat ini)
- Payment gateway sungguhan (harga & paket masih mock).
- Forum diskusi (hanya placeholder).
- Streaming video (video berupa URL eksternal).
- Dashboard admin lengkap (sebagian besar masih halaman "coming soon").

## 3. Persona

| Persona | Deskripsi | Kebutuhan utama |
| --- | --- | --- |
| **Student** | Pelajar yang ingin belajar kursus. | Mencari kursus, melihat detail, mengikuti kursus, melihat progress, berlangganan paket. |
| **Mentor** | Pengajar yang membuat konten kursus. | Membuat/mengedit kursus lengkap dengan kurikulum, menerbitkan, mengelola kategori & statistik. |
| **Admin** | Pengelola platform. | Memoderasi kategori, melihat statistik platform, mengelola pengguna/kursus (masih coming soon). |

## 4. Fitur per Peran

### 4.1 Publik (belum login)
- Landing page: hero, fitur, program, testimoni, carousel, footer, CTA.
- Login & registrasi (guest-only).
- Halaman 404.

### 4.2 Student (login, role `student`)
- Dashboard: statistik (kursus diikuti, sertifikat, poin, streak), kursus berjalan, pencapaian, aktivitas mingguan.
- Katalog kursus: pencarian, filter kategori & level, pagination (12/halaman).
- Detail kursus: info, kurikulum per section (dengan expand), harga, daftar kursus terkait, tombol "Daftar Kursus".
- Learning: daftar kursus dimiliki, progress keseluruhan, lesson selesai.
- Subscription: pilih paket Free/Pro/Premium, billing bulanan/tahunan, disimpan di `localStorage`.
- Profile: menampilkan & mengubah nama/email/avatar.

### 4.3 Mentor (login, role `mentor`)
- Dashboard: statistik hardcoded saat ini (kursus, siswa, rating, dsb).
- Daftar kursus: tabel dengan search, filter status (Semua/Terbit/Draft), toggle publish, edit, hapus (delete ke backend + draft lokal).
- **Course Builder** (wizard 3 langkah):
  1. *Course Information* — judul, deskripsi, kategori, level, harga, thumbnail, durasi, status.
  2. *Curriculum* — kelola section & lesson: tambah/rename/hapus/pindah (drag & drop), lesson editor drawer (video URL, file, preview), quiz editor (multiple choice & true/false), assignment editor (due date).
  3. *Review & Publish* — checklist kelengkapan, simpan draft / publish.
  - Draft lokal otomatis (`localStorage`) + sync ke backend (kursus, section, lesson, quiz, assignment).
- Detail kursus (khusus mentor): info lengkap + mentor + ringkasan kurikulum + statistik quiz/tugas.
- Edit kursus: memuat ulang kursus dari backend (header), mengelola kurikulum, publish.
- Kategori: tambah kategori (ikon).
- Profile.

### 4.4 Admin (login, role `admin`)
- Kategori: daftar, tambah, hapus.
- Sisa menu (dashboard, courses, students, reviews) masih "coming soon".
- Profile.

## 5. User Stories & Kriteria Terima

### AUT-01 Login & Registrasi
- **Sebagai** pengguna, **saya ingin** login/registrasi **agar** masuk ke dashboard sesuai peran.
- AC: login valid mengarah ke dashboard peran (`student` → `/user/dashboard`, `mentor` → `/mentor/dashboard`, `admin` → `/admin/categories`); redirect ke halaman asal bila ada `?redirect=`.
- AC: register sukses → kembali ke login dengan pesan.

### AUT-02 Guard
- Halaman `requiresAuth` tanpa login → pindah ke `/login?redirect=...`.
- Halaman `guestOnly` saat sudah login → pindah ke landing.
- Halaman ber-role diakses role lain → pindah ke landing.

### CRS-01 Katalog Kursus (student)
- **Sebagai** student, **saya ingin** mencari & memfilter kursus **agar** menemukan yang relevan.
- AC: filter kategori & level, pencarian teks, pagination 12/halaman, halaman aktif di-reset saat filter berubah.
- *Catatan: saat ini masih memakai data mock `courseData.ts`.*

### CRS-02 Detail Kursus (student)
- AC: menampilkan info kursus, kategori, level, harga, kurikulum per section yang bisa di-expand, status preview per lesson, kursus terkait.

### CRS-03 Detail Kursus (mentor)
- AC: memakai endpoint `GET /courses/:id` (model `CourseDetail`), menampilkan mentor, kategori, level, statistik lesson/quiz/tugas, tombol Edit.

### CRB-01 Course Builder (mentor)
- **Sebagai** mentor, **saya ingin** membuat kursus dengan wizard **agar** prosesnya terpandu.
- AC: validasi step 1 (judul, deskripsi, kategori, harga, level wajib); minimal satu section untuk lanjut; checklist review valid sebelum publish.
- AC: unsaved-changes guard (`beforeunload` + `onBeforeRouteLeave`), autosave draft lokal tiap 1,5 detik.

### CRB-02 Publish
- AC: hanya bisa publish jika semua item checklist valid; setelah publish redirect ke daftar kursus mentor.

### CRB-03 Sync Kurikulum
- AC: create/update course → section → lesson → quiz/assignment berurutan; item yang baru dibuat memakai id dari backend; item bertempel `temp-*` dianggap baru.
- *Gap: delete section/lesson/quiz/assignment ke backend belum disambung (audit #1), upload file belum (audit #2).*

### CAT-01 Kategori (admin & mentor)
- AC: admin dapat tambah & hapus kategori; mentor dapat menambah kategori (ikon).

### LRN-01 Learning (student)
- AC: menampilkan kursus yang dimiliki, progress rata-rata, pelajaran selesai.
- *Saat ini masih mock.*

### SUB-01 Subscription (student)
- AC: memilih paket Free/Pro/Premium, toggle billing bulanan/tahunan, pilihan tersimpan di `localStorage`.

## 6. Non-Functional Requirements

- **Kinerja**: katalog memakai pagination 12/halaman; daftar kursus mentor memakai pencarian & filter sisi klien.
- **Keamanan**: token bearer otomatis dari interceptor; tidak ada secret di repo; password tidak dilog.
- **Reliabilitas**: course builder punya fallback draft lokal saat backend error (`localOnly`).
- **Aksesibilitas**: ikon tombol diberi `aria-label`.
- **Bahasa**: UI berbahasa Indonesia.

## 7. Metrik Kesuksesan (proposal)

- Waktu penyelesaian pembuatan kursus per mentor (dari mulai sampai publish).
- Tingkat penyelesaian kursus (completion rate) per student.
- Konversi free → Pro/Premium (via `SubscriptionView`).
- Error rate pada operasi CRUD kursus.

## 8. Prioritas & Roadmap

| Prioritas | Item |
| --- | --- |
| 🔴 P0 | Sambungan CRUD kursus/section/lesson/quiz/assignment ke backend (delete + upload file) |
| 🟡 P1 | Ganti data mock katalog/learning/dashboard dengan API |
| 🟡 P1 | Statistik dashboard mentor dari API |
| 🟢 P2 | Level dari endpoint `GET /levels`; durasi total otomatis dari lesson |
| 🟢 P2 | Konten landing page riil (saat ini lorem ipsum) |

Lihat `docs/roadmap.md` untuk detail urutan kerja.

## 9. Referensi

- `course-feature-audit.md` — audit gap CRUD kursus frontend vs backend.
- `docs/design.md` — arsitektur & alur data.
- `docs/api.md` — kontrak API.
- `docs/testing.md` — strategi pengujian.
