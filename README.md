# devacademy-web

Frontend web untuk **DevAcademy** — dibangun dengan Vue 3, Vite, Pinia, Vue Router, dan Tailwind CSS.

## Tech Stack

| Teknologi | Versi | Fungsi |
| --- | --- | --- |
| [Vue 3](https://vuejs.org/) | `rc` | Framework UI (Composition API + `<script setup>`) |
| [Vite](https://vite.dev/) | 8.x | Build tool & dev server |
| [Pinia](https://pinia.vuejs.org/) | 4.x | State management |
| [Vue Router](https://router.vuejs.org/) | 5.x | Routing & route guards |
| [Tailwind CSS](https://tailwindcss.com/) | 4.x | Utility-first CSS |
| [Lucide](https://lucide.dev/) (`@lucide/vue`) | 1.x | Icon library |
| [TypeScript](https://www.typescriptlang.org/) | 6.x | Type safety |
| [Vitest](https://vitest.dev/) | 4.x | Unit testing |
| [ESLint](https://eslint.org/) + [oxlint](https://oxc.rs/) | — | Linting |

## Struktur Proyek

```
src/
├── api/               # HTTP client & request per modul
│   ├── http.ts
│   ├── contracts/     # DTO respons API mentah (Raw*)
│   ├── mappers/       # Konversi kontrak → model domain (toX)
│   └── modules/       # auth.ts, category.ts, course.ts, levels.ts
├── assets/
│   └── main.css       # Tailwind CSS + tema (color tokens)
├── components/
│   ├── base/          # Komponen generik/atomik (BaseButton, dll.)
│   └── common/        # Komponen lintas halaman (AppHeader, dll.)
├── hooks/             # Composables reusable (state + API + navigasi)
│   ├── useAuth.ts
│   ├── useAsync.ts    # State loading/error untuk aksi async
│   └── useForm.ts     # State form + reset
├── layouts/
│   ├── DefaultLayout.vue  # Header + konten utama
│   └── AuthLayout.vue     # Konten di tengah layar (tanpa header)
├── models/            # Type definitions (api, auth)
├── router/
│   ├── index.ts
│   ├── routes.ts      # Definisi route
│   └── guards.ts      # Route guards (requiresAuth / guestOnly)
├── services/          # Abstraksi di atas api (authService)
├── stores/            # Pinia stores (auth)
├── utils/             # Helper murni (formatters)
├── views/             # Halaman, dikelompokkan per fitur
│   ├── home/
│   ├── auth/
│   ├── profile/
│   └── error/
└── __tests__/         # Unit tests
```

### Views per Fitur

Halaman dikelompokkan berdasarkan fiturnya, bukan per jenis:

```
views/
├── home/HomeView.vue        # Beranda
├── auth/LoginView.vue       # Login
├── profile/ProfileView.vue  # Profile (membutuhkan autentikasi)
└── error/NotFoundView.vue   # Halaman 404
```

### Layout

- `DefaultLayout` — dipakai halaman yang menampilkan `AppHeader` (home, profile).
- `AuthLayout` — dipakai halaman auth (login), konten di tengah layar tanpa header.

### Hooks

- `useAuth` — membungkus `useAuthStore` jadi API reaktif (`user`, `isAuthenticated`, `login`, `logout`).
- `useAsync` — mengelola `loading` dan `error` untuk aksi async.
- `useForm` — state form reaktif dengan method `reset()`.

Contoh penggunaan `useAsync` + `useForm` di `LoginView`:

```ts
const { login } = useAuthController()
const { form } = useForm({ email: '', password: '' })
const { loading, error, run } = useAsync(login)
```

## Project Setup

```sh
npm install
```

### Environment Variables

Salin `.env.example` menjadi `.env` lalu sesuaikan:

```sh
cp .env.example .env
```

| Variabel | Deskripsi |
| --- | --- |
| `VITE_API_BASE_URL` | Base URL API yang dipakai `src/api/http.ts` |

## Scripts

```sh
npm run dev            # Dev server dengan hot-reload
npm run build          # Type-check + build produksi
npm run preview        # Preview hasil build
npm run type-check     # Cek tipe dengan vue-tsc
npm run test:unit      # Jalankan unit test (Vitest)
npm run lint           # Lint: oxlint + eslint (dengan --fix)
npm run format         # Format kode dengan Prettier
```

## Routing

| Path | Nama | Layout | Auth |
| --- | --- | --- | --- |
| `/` | `home` | DefaultLayout | — |
| `/profile` | `profile` | DefaultLayout | wajib login |
| `/login` | `login` | AuthLayout | hanya tamu |
| `*` | `not-found` | — | — |
