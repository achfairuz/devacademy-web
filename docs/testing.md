# Testing — DevAcademy Web

> Strategi pengujian dan cara menjalankan test.

## Script

```sh
npm run test:unit      # Jalankan Vitest
npm run type-check     # vue-tsc --build
npm run lint           # oxlint + eslint (dengan --fix)
npm run format         # Prettier (src/)
```

## Runner

- **Vitest** dengan environment `jsdom` (config: `vitest.config.ts`, merge dari `vite.config.ts`).
- Test e2e dikecualikan (belum ada).

## Lokasi Test

- `src/__tests__/App.spec.ts` — smoke test aplikasi.
- `src/components/course-builder/__tests__/CurriculumStep.spec.ts` — unit test komponen `CurriculumStep`.

## Area yang Perlu Ditingkatkan

| Area | Apa yang diuji | Prioritas |
| --- | --- | --- |
| Hook | `useCourseBuilder` (tambah/hapus/pindah section & lesson, validasi, checklist review, payload mapping) | 🔴 Tinggi |
| Hook | `useAuth` / `useAuthController` (redirect per role) | 🟡 Sedang |
| API | Mapping `toCourse`, `toUser`, `toCategory` (kebab ↔ snake_case) | 🟡 Sedang |
| Komponen | `BaseInput`, `BaseSelect`, `BaseToggle`, `BaseConfirmModal` | 🟡 Sedang |
| Komponen | `QuizEditor` (multiple_choice / true_false, opsinya) | 🟡 Sedang |
| View | `CourseDetailView` & `MentorCourseDetailView` (state loading/error/404) | 🟡 Sedang |
| Utils | `formatters` (Rupiah, menit, tanggal), `subscription` | 🟢 Rendah |

## Pola yang Disarankan

- Tes hook yang memanggil API: mock `src/api/modules/*` (vi.mock) lalu verifikasi state.
- Tes komponen: mount dengan `@vue/test-utils`, interaksi element, snapshot tidak wajib.
- Pastikan semua test dijalankan bersama `npm run type-check` sebelum merge.
