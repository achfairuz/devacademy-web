export interface Lesson {
  title: string
  duration: string
  type: 'video' | 'article' | 'quiz'
  completed: boolean
}

export interface Module {
  title: string
  lessons: Lesson[]
}

export interface Course {
  id: string
  title: string
  category: 'Programming' | 'Design' | 'Data' | 'Business'
  level: 'Pemula' | 'Menengah' | 'Mahir'
  description: string
  instructor: string
  progress: number
  duration: string
  students: number
  rating: number
  color: string
  price: string
  isEnrolled: boolean
  objectives: string[]
  modulesData: Module[]
}

const categoryColors: Record<Course['category'], string> = {
  Programming: 'bg-primary-500',
  Design: 'bg-blue-500',
  Data: 'bg-emerald-500',
  Business: 'bg-amber-500',
}

export function buildCourse(
  id: string,
  data: Omit<Course, 'color' | 'id' | 'isEnrolled'> & { color?: string; isEnrolled?: boolean },
): Course {
  return {
    id,
    color: data.color ?? categoryColors[data.category],
    isEnrolled: data.isEnrolled ?? false,
    ...data,
  }
}

export const courses: Course[] = [
  buildCourse('js-fundamental', {
    title: 'Fundamental JavaScript',
    category: 'Programming',
    level: 'Pemula',
    description:
      'Kuasi dasar-dasar JavaScript dari variabel, tipe data, hingga konsep modern seperti ES6+ dan async/await. Cocok untuk pemula yang baru memulai perjalanan menjadi developer.',
    instructor: 'Andi Pratama',
    progress: 68,
    duration: '8 jam',
    students: 1240,
    rating: 4.8,
    price: 'Rp 249.000',
    isEnrolled: true,
    objectives: [
      'Memahami sintaks dasar dan tipe data JavaScript',
      'Menguasai function, scope, dan closure',
      'Bekerja dengan array, object, dan ES6+',
      'Memahami async/await dan Promise',
    ],
    modulesData: [
      {
        title: 'Pengenalan JavaScript',
        lessons: [
          { title: 'Apa itu JavaScript?', duration: '12 menit', type: 'video', completed: true },
          { title: 'Setup Environment & Tools', duration: '15 menit', type: 'video', completed: true },
          { title: 'Variabel & Tipe Data', duration: '20 menit', type: 'video', completed: true },
          { title: 'Kuis: Dasar JavaScript', duration: '10 menit', type: 'quiz', completed: true },
        ],
      },
      {
        title: 'Control Flow & Function',
        lessons: [
          { title: 'Conditional & Looping', duration: '18 menit', type: 'video', completed: true },
          { title: 'Function & Arrow Function', duration: '22 menit', type: 'video', completed: true },
          { title: 'Scope & Closure', duration: '16 menit', type: 'article', completed: false },
          { title: 'Latihan: Mini Calculator', duration: '30 menit', type: 'video', completed: false },
        ],
      },
      {
        title: 'Array, Object & ES6+',
        lessons: [
          { title: 'Array Methods Lanjutan', duration: '24 menit', type: 'video', completed: false },
          { title: 'Object & Destructuring', duration: '19 menit', type: 'video', completed: false },
          { title: 'Kuis: ES6+', duration: '12 menit', type: 'quiz', completed: false },
        ],
      },
      {
        title: 'Async JavaScript',
        lessons: [
          { title: 'Callback & Promise', duration: '26 menit', type: 'video', completed: false },
          { title: 'Async/Await', duration: '21 menit', type: 'video', completed: false },
          { title: 'Fetch API & Error Handling', duration: '28 menit', type: 'video', completed: false },
          { title: 'Ujian Akhir Modul', duration: '45 menit', type: 'quiz', completed: false },
        ],
      },
    ],
  }),
  buildCourse('react-frontend', {
    title: 'React & Modern Frontend',
    category: 'Programming',
    level: 'Menengah',
    description:
      'Bangun aplikasi web modern menggunakan React, hooks, state management, hingga deployment. Lengkap dengan studi kasus proyek nyata.',
    instructor: 'Siti Rahma',
    progress: 0,
    duration: '12 jam',
    students: 890,
    rating: 4.9,
    price: 'Rp 349.000',
    isEnrolled: true,
    objectives: [
      'Memahami konsep component & props',
      'Menguasai hooks dan custom hooks',
      'State management dengan Context & Redux',
      'Routing dan deployment production',
    ],
    modulesData: [
      {
        title: 'React Dasar',
        lessons: [
          { title: 'Instalasi & Struktur Proyek', duration: '15 menit', type: 'video', completed: false },
          { title: 'Component & JSX', duration: '25 menit', type: 'video', completed: false },
          { title: 'Props & State', duration: '22 menit', type: 'video', completed: false },
        ],
      },
      {
        title: 'Hooks & Side Effects',
        lessons: [
          { title: 'useState & useEffect', duration: '24 menit', type: 'video', completed: false },
          { title: 'Custom Hooks', duration: '20 menit', type: 'article', completed: false },
          { title: 'Kuis: Hooks', duration: '10 menit', type: 'quiz', completed: false },
        ],
      },
      {
        title: 'State Management',
        lessons: [
          { title: 'Context API', duration: '18 menit', type: 'video', completed: false },
          { title: 'Redux Toolkit', duration: '28 menit', type: 'video', completed: false },
        ],
      },
      {
        title: 'Proyek & Deployment',
        lessons: [
          { title: 'Membangun Aplikasi Todo', duration: '40 menit', type: 'video', completed: false },
          { title: 'Deploy ke Vercel', duration: '18 menit', type: 'video', completed: false },
          { title: 'Ujian Akhir Modul', duration: '50 menit', type: 'quiz', completed: false },
        ],
      },
    ],
  }),
  buildCourse('uiux-design', {
    title: 'UI/UX Design Dasar',
    category: 'Design',
    level: 'Pemula',
    description:
      'Pelajari prinsip desain antarmuka dan pengalaman pengguna, dari riset, wireframe, prototyping, hingga pengujian usability menggunakan Figma.',
    instructor: 'Dewi Lestari',
    progress: 40,
    duration: '6 jam',
    students: 760,
    rating: 4.7,
    price: 'Rp 199.000',
    isEnrolled: true,
    objectives: [
      'Memahami dasar UX research dan user persona',
      'Membuat wireframe dan user flow',
      'Mendesain UI dengan prinsip visual yang baik',
      'Membuat prototype interaktif di Figma',
    ],
    modulesData: [
      {
        title: 'Pengenalan Desain UI/UX',
        lessons: [
          { title: 'UI vs UX: Apa Bedanya?', duration: '10 menit', type: 'video', completed: true },
          { title: 'Prinsip Desain & Heuristik', duration: '18 menit', type: 'video', completed: true },
          { title: 'Kuis: Dasar Desain', duration: '8 menit', type: 'quiz', completed: true },
        ],
      },
      {
        title: 'Riset & Wireframe',
        lessons: [
          { title: 'User Persona & Journey Map', duration: '20 menit', type: 'video', completed: true },
          { title: 'Membuat Wireframe', duration: '25 menit', type: 'video', completed: false },
          { title: 'Latihan: Wireframe App', duration: '30 menit', type: 'video', completed: false },
        ],
      },
      {
        title: 'Visual Design dengan Figma',
        lessons: [
          { title: 'Typography & Color System', duration: '22 menit', type: 'video', completed: false },
          { title: 'Design Tokens & Component', duration: '24 menit', type: 'article', completed: false },
          { title: 'Prototype Interaktif', duration: '26 menit', type: 'video', completed: false },
          { title: 'Ujian Akhir Modul', duration: '40 menit', type: 'quiz', completed: false },
        ],
      },
    ],
  }),
  buildCourse('database-sql', {
    title: 'Database & SQL',
    category: 'Data',
    level: 'Pemula',
    description:
      'Pelajari konsep database relasional, merancang skema, dan menulis query SQL dari dasar hingga advanced join dan indexing.',
    instructor: 'Budi Santoso',
    progress: 25,
    duration: '7 jam',
    students: 650,
    rating: 4.6,
    price: 'Rp 229.000',
    isEnrolled: true,
    objectives: [
      'Memahami konsep database relasional',
      'Menulis query SELECT, JOIN, dan subquery',
      'Merancang skema database yang baik',
      'Optimasi query dengan indexing',
    ],
    modulesData: [
      {
        title: 'Konsep Database',
        lessons: [
          { title: 'Database Relasional', duration: '15 menit', type: 'video', completed: true },
          { title: 'ERD & Relasi Tabel', duration: '20 menit', type: 'video', completed: true },
          { title: 'Kuis: Konsep Database', duration: '10 menit', type: 'quiz', completed: true },
        ],
      },
      {
        title: 'SQL Dasar',
        lessons: [
          { title: 'SELECT, WHERE, ORDER BY', duration: '25 menit', type: 'video', completed: true },
          { title: 'Aggregate Function & GROUP BY', duration: '22 menit', type: 'video', completed: false },
          { title: 'Latihan Query SQL', duration: '35 menit', type: 'video', completed: false },
        ],
      },
      {
        title: 'SQL Lanjutan',
        lessons: [
          { title: 'JOIN & Subquery', duration: '28 menit', type: 'video', completed: false },
          { title: 'Indexing & Performance', duration: '24 menit', type: 'article', completed: false },
          { title: 'Ujian Akhir Modul', duration: '45 menit', type: 'quiz', completed: false },
        ],
      },
    ],
  }),
  buildCourse('python-data', {
    title: 'Data Analysis with Python',
    category: 'Data',
    level: 'Menengah',
    description:
      'Analisis data end-to-end menggunakan Python, Pandas, NumPy, dan visualisasi dengan Matplotlib serta studi kasus nyata.',
    instructor: 'Maya Wijaya',
    progress: 0,
    duration: '10 jam',
    students: 430,
    rating: 4.8,
    price: 'Rp 299.000',
    objectives: [
      'Mengolah data dengan Pandas & NumPy',
      'Data cleaning dan wrangling',
      'Visualisasi data yang informatif',
      'Menarik insight dari data nyata',
    ],
    modulesData: [
      {
        title: 'Python untuk Data',
        lessons: [
          { title: 'Setup Python & Jupyter', duration: '15 menit', type: 'video', completed: false },
          { title: 'NumPy Array & Operasi', duration: '25 menit', type: 'video', completed: false },
        ],
      },
      {
        title: 'Pandas Dasar',
        lessons: [
          { title: 'Series & DataFrame', duration: '24 menit', type: 'video', completed: false },
          { title: 'Data Cleaning', duration: '28 menit', type: 'video', completed: false },
          { title: 'Kuis: Pandas', duration: '12 menit', type: 'quiz', completed: false },
        ],
      },
      {
        title: 'Visualisasi & Insight',
        lessons: [
          { title: 'Matplotlib & Seaborn', duration: '26 menit', type: 'video', completed: false },
          { title: 'Studi Kasus: Sales Data', duration: '35 menit', type: 'video', completed: false },
          { title: 'Ujian Akhir Modul', duration: '45 menit', type: 'quiz', completed: false },
        ],
      },
    ],
  }),
  buildCourse('digital-marketing', {
    title: 'Digital Marketing Essentials',
    category: 'Business',
    level: 'Pemula',
    description:
      'Pahami strategi pemasaran digital modern: SEO, content marketing, social media ads, dan analitik untuk mengembangkan bisnis online.',
    instructor: 'Rina Kurnia',
    progress: 0,
    duration: '5 jam',
    students: 520,
    rating: 4.5,
    price: 'Rp 179.000',
    objectives: [
      'Menyusun strategi digital marketing',
      'Dasar-dasar SEO dan content marketing',
      'Menjalankan iklan di social media',
      'Mengukur performa dengan analitik',
    ],
    modulesData: [
      {
        title: 'Strategi Digital Marketing',
        lessons: [
          { title: 'Funnel Pemasaran Digital', duration: '18 menit', type: 'video', completed: false },
          { title: 'Target Audience & Positioning', duration: '20 menit', type: 'video', completed: false },
        ],
      },
      {
        title: 'SEO & Content',
        lessons: [
          { title: 'SEO On-Page & Off-Page', duration: '22 menit', type: 'video', completed: false },
          { title: 'Strategi Konten', duration: '16 menit', type: 'article', completed: false },
        ],
      },
      {
        title: 'Iklan & Analitik',
        lessons: [
          { title: 'Meta Ads & Google Ads', duration: '24 menit', type: 'video', completed: false },
          { title: 'Google Analytics Dasar', duration: '20 menit', type: 'video', completed: false },
          { title: 'Ujian Akhir Modul', duration: '35 menit', type: 'quiz', completed: false },
        ],
      },
    ],
  }),
  buildCourse('tailwind-css', {
    title: 'Tailwind CSS & Frontend Styling',
    category: 'Programming',
    level: 'Pemula',
    description:
      'Pelajari styling web modern dengan utility-first Tailwind CSS, responsive design, dan integrasi dengan framework frontend.',
    instructor: 'Andi Pratama',
    progress: 0,
    duration: '6 jam',
    students: 380,
    rating: 4.6,
    price: 'Rp 189.000',
    objectives: [
      'Memahami konsep utility-first CSS',
      'Membangun layout responsive',
      'Custom theme & configuration',
      'Integrasi dengan framework',
    ],
    modulesData: [
      {
        title: 'Dasar Tailwind CSS',
        lessons: [
          { title: 'Instalasi & Config', duration: '12 menit', type: 'video', completed: false },
          { title: 'Utility Classes Dasar', duration: '20 menit', type: 'video', completed: false },
        ],
      },
      {
        title: 'Layout & Responsive',
        lessons: [
          { title: 'Flexbox & Grid', duration: '22 menit', type: 'video', completed: false },
          { title: 'Responsive Breakpoints', duration: '18 menit', type: 'video', completed: false },
          { title: 'Latihan: Landing Page', duration: '35 menit', type: 'video', completed: false },
        ],
      },
      {
        title: 'Customization',
        lessons: [
          { title: 'Custom Theme & Colors', duration: '16 menit', type: 'article', completed: false },
          { title: 'Ujian Akhir Modul', duration: '40 menit', type: 'quiz', completed: false },
        ],
      },
    ],
  }),
  buildCourse('nodejs-backend', {
    title: 'Node.js & REST API',
    category: 'Programming',
    level: 'Menengah',
    description:
      'Bangun backend service menggunakan Node.js, Express, autentikasi JWT, dan integrasi database dengan best practices.',
    instructor: 'Budi Santoso',
    progress: 0,
    duration: '11 jam',
    students: 410,
    rating: 4.7,
    price: 'Rp 329.000',
    objectives: [
      'Membangun REST API dengan Express',
      'Implementasi autentikasi JWT',
      'Integrasi dengan database',
      'Deploy API ke production',
    ],
    modulesData: [
      {
        title: 'Pengenalan Node.js',
        lessons: [
          { title: 'Apa itu Node.js?', duration: '12 menit', type: 'video', completed: false },
          { title: 'Module System & NPM', duration: '18 menit', type: 'video', completed: false },
        ],
      },
      {
        title: 'Express & REST API',
        lessons: [
          { title: 'Routing & Middleware', duration: '25 menit', type: 'video', completed: false },
          { title: 'CRUD & Validation', duration: '28 menit', type: 'video', completed: false },
          { title: 'Kuis: Express', duration: '12 menit', type: 'quiz', completed: false },
        ],
      },
      {
        title: 'Auth & Database',
        lessons: [
          { title: 'JWT Authentication', duration: '26 menit', type: 'video', completed: false },
          { title: 'Integrasi MongoDB', duration: '24 menit', type: 'video', completed: false },
          { title: 'Ujian Akhir Modul', duration: '45 menit', type: 'quiz', completed: false },
        ],
      },
    ],
  }),
  buildCourse('mobile-uiux', {
    title: 'Mobile App UI Design',
    category: 'Design',
    level: 'Menengah',
    description:
      'Desain UI aplikasi mobile dari nol dengan Figma, fokus pada pattern desain iOS & Android, hingga design system yang scalable.',
    instructor: 'Dewi Lestari',
    progress: 0,
    duration: '8 jam',
    students: 290,
    rating: 4.8,
    price: 'Rp 259.000',
    objectives: [
      'Memahami pattern desain mobile',
      'Membangun design system',
      'Design adaptive untuk iOS & Android',
      'Persiapan handoff ke developer',
    ],
    modulesData: [
      {
        title: 'Desain Mobile Dasar',
        lessons: [
          { title: 'Material Design & HIG', duration: '20 menit', type: 'video', completed: false },
          { title: 'Komponen Mobile UI', duration: '24 menit', type: 'video', completed: false },
        ],
      },
      {
        title: 'Design System',
        lessons: [
          { title: 'Membangun Design Tokens', duration: '22 menit', type: 'video', completed: false },
          { title: 'Component Library', duration: '26 menit', type: 'article', completed: false },
        ],
      },
      {
        title: 'Proyek Final',
        lessons: [
          { title: 'Studi Kasus: E-commerce App', duration: '40 menit', type: 'video', completed: false },
          { title: 'Handoff & Prototype', duration: '25 menit', type: 'video', completed: false },
          { title: 'Ujian Akhir Modul', duration: '45 menit', type: 'quiz', completed: false },
        ],
      },
    ],
  }),
  buildCourse('machine-learning', {
    title: 'Machine Learning Fundamentals',
    category: 'Data',
    level: 'Mahir',
    description:
      'Dasar-dasar machine learning: supervised & unsupervised learning, evaluasi model, hingga pipeline sederhana menggunakan scikit-learn.',
    instructor: 'Maya Wijaya',
    progress: 0,
    duration: '14 jam',
    students: 310,
    rating: 4.9,
    price: 'Rp 449.000',
    objectives: [
      'Memahami konsep ML & jenis algoritma',
      'Preprocessing data untuk model',
      'Training & evaluasi model',
      'Menghindari overfitting',
    ],
    modulesData: [
      {
        title: 'Konsep Machine Learning',
        lessons: [
          { title: 'Supervised vs Unsupervised', duration: '18 menit', type: 'video', completed: false },
          { title: 'Pipeline ML Dasar', duration: '22 menit', type: 'video', completed: false },
        ],
      },
      {
        title: 'Preprocessing & Features',
        lessons: [
          { title: 'Feature Engineering', duration: '25 menit', type: 'video', completed: false },
          { title: 'Scaling & Encoding', duration: '20 menit', type: 'video', completed: false },
        ],
      },
      {
        title: 'Model & Evaluasi',
        lessons: [
          { title: 'Classification dengan scikit-learn', duration: '30 menit', type: 'video', completed: false },
          { title: 'Evaluasi: Accuracy, Precision, Recall', duration: '24 menit', type: 'video', completed: false },
          { title: 'Ujian Akhir Modul', duration: '50 menit', type: 'quiz', completed: false },
        ],
      },
    ],
  }),
  buildCourse('business-plan', {
    title: 'Business Plan & Startup',
    category: 'Business',
    level: 'Menengah',
    description:
      'Susun business plan yang solid, analisis pasar dan kompetitor, model bisnis, hingga pitching ke investor.',
    instructor: 'Rina Kurnia',
    progress: 0,
    duration: '7 jam',
    students: 250,
    rating: 4.6,
    price: 'Rp 219.000',
    objectives: [
      'Menyusun business model canvas',
      'Analisis pasar & kompetitor',
      'Financial projection',
      'Membuat pitch deck',
    ],
    modulesData: [
      {
        title: 'Ide & Validasi',
        lessons: [
          { title: 'Menemukan & Memvalidasi Ide', duration: '20 menit', type: 'video', completed: false },
          { title: 'Business Model Canvas', duration: '24 menit', type: 'video', completed: false },
        ],
      },
      {
        title: 'Analisis & Finance',
        lessons: [
          { title: 'Market & Competitor Analysis', duration: '22 menit', type: 'video', completed: false },
          { title: 'Financial Projection', duration: '26 menit', type: 'article', completed: false },
        ],
      },
      {
        title: 'Pitching',
        lessons: [
          { title: 'Membuat Pitch Deck', duration: '20 menit', type: 'video', completed: false },
          { title: 'Ujian Akhir Modul', duration: '40 menit', type: 'quiz', completed: false },
        ],
      },
    ],
  }),
  buildCourse('typescript-mastery', {
    title: 'TypeScript Mastery',
    category: 'Programming',
    level: 'Mahir',
    description:
      'Tingkatkan produktivitas coding dengan TypeScript: tipe lanjutan, generics, dekorator, dan integrasi dengan ecosystem modern.',
    instructor: 'Andi Pratama',
    progress: 0,
    duration: '9 jam',
    students: 340,
    rating: 4.9,
    price: 'Rp 289.000',
    objectives: [
      'Menguasai sistem tipe TypeScript',
      'Generics & utility types',
      'Type guarding & narrowing',
      'Integrasi dengan project nyata',
    ],
    modulesData: [
      {
        title: 'TypeScript Dasar',
        lessons: [
          { title: 'Setup & tsconfig', duration: '14 menit', type: 'video', completed: false },
          { title: 'Tipe Dasar & Inference', duration: '22 menit', type: 'video', completed: false },
        ],
      },
      {
        title: 'Advanced Types',
        lessons: [
          { title: 'Generics', duration: '26 menit', type: 'video', completed: false },
          { title: 'Utility Types & Mapped Types', duration: '24 menit', type: 'video', completed: false },
          { title: 'Kuis: Advanced Types', duration: '12 menit', type: 'quiz', completed: false },
        ],
      },
      {
        title: 'Integrasi Proyek',
        lessons: [
          { title: 'TypeScript dengan React', duration: '25 menit', type: 'video', completed: false },
          { title: 'Type Safety untuk API', duration: '20 menit', type: 'article', completed: false },
          { title: 'Ujian Akhir Modul', duration: '45 menit', type: 'quiz', completed: false },
        ],
      },
    ],
  }),
  buildCourse('ecommerce-ui', {
    title: 'UI/UX untuk E-commerce',
    category: 'Design',
    level: 'Menengah',
    description:
      'Rancang pengalaman belanja online yang meningkatkan konversi: product listing, checkout flow, dan optimasi UX berbasis data.',
    instructor: 'Dewi Lestari',
    progress: 0,
    duration: '6 jam',
    students: 200,
    rating: 4.5,
    price: 'Rp 209.000',
    objectives: [
      'Merancang product listing & detail',
      'Optimalisasi checkout flow',
      'UX untuk mengurangi cart abandonment',
      'A/B testing dasar',
    ],
    modulesData: [
      {
        title: 'Pengalaman Belanja',
        lessons: [
          { title: 'User Flow Belanja Online', duration: '18 menit', type: 'video', completed: false },
          { title: 'Product Listing & Detail', duration: '24 menit', type: 'video', completed: false },
        ],
      },
      {
        title: 'Checkout & Optimasi',
        lessons: [
          { title: 'Checkout Flow yang Efektif', duration: '22 menit', type: 'video', completed: false },
          { title: 'A/B Testing & Analitik', duration: '20 menit', type: 'article', completed: false },
          { title: 'Ujian Akhir Modul', duration: '40 menit', type: 'quiz', completed: false },
        ],
      },
    ],
  }),
  buildCourse('git-github', {
    title: 'Git & GitHub untuk Developer',
    category: 'Programming',
    level: 'Pemula',
    description:
      'Kuasai version control dengan Git dan kolaborasi tim menggunakan GitHub: branching, pull request, hingga code review workflow.',
    instructor: 'Andi Pratama',
    progress: 0,
    duration: '5 jam',
    students: 680,
    rating: 4.7,
    price: 'Rp 169.000',
    isEnrolled: true,
    objectives: [
      'Memahami konsep version control',
      'Menguasai branching & merging',
      'Kolaborasi dengan pull request',
      'Workflow development tim',
    ],
    modulesData: [
      {
        title: 'Dasar Git',
        lessons: [
          { title: 'Apa itu Git?', duration: '10 menit', type: 'video', completed: false },
          { title: 'Init, Commit & Log', duration: '20 menit', type: 'video', completed: false },
          { title: 'Kuis: Dasar Git', duration: '8 menit', type: 'quiz', completed: false },
        ],
      },
      {
        title: 'Branch & Merge',
        lessons: [
          { title: 'Branching Strategy', duration: '18 menit', type: 'video', completed: false },
          { title: 'Merge & Resolve Conflict', duration: '24 menit', type: 'video', completed: false },
        ],
      },
      {
        title: 'Kolaborasi GitHub',
        lessons: [
          { title: 'Remote & Push/Pull', duration: '16 menit', type: 'video', completed: false },
          { title: 'Pull Request & Code Review', duration: '22 menit', type: 'video', completed: false },
          { title: 'Ujian Akhir Modul', duration: '35 menit', type: 'quiz', completed: false },
        ],
      },
    ],
  }),
  buildCourse('nextjs-fullstack', {
    title: 'Next.js Fullstack Developer',
    category: 'Programming',
    level: 'Menengah',
    description:
      'Bangun aplikasi fullstack production-ready dengan Next.js App Router, Server Components, API routes, dan optimalisasi performa.',
    instructor: 'Siti Rahma',
    progress: 0,
    duration: '13 jam',
    students: 520,
    rating: 4.9,
    price: 'Rp 379.000',
    objectives: [
      'Memahami App Router & Server Components',
      'Data fetching dan caching',
      'Autentikasi & API routes',
      'Optimalisasi dan deployment',
    ],
    modulesData: [
      {
        title: 'Next.js Dasar',
        lessons: [
          { title: 'App Router & File Structure', duration: '22 menit', type: 'video', completed: false },
          { title: 'Server vs Client Components', duration: '25 menit', type: 'video', completed: false },
        ],
      },
      {
        title: 'Data & API',
        lessons: [
          { title: 'Server Actions & API Routes', duration: '28 menit', type: 'video', completed: false },
          { title: 'Data Fetching & Caching', duration: '24 menit', type: 'video', completed: false },
          { title: 'Kuis: Data Fetching', duration: '12 menit', type: 'quiz', completed: false },
        ],
      },
      {
        title: 'Production',
        lessons: [
          { title: 'Auth dengan NextAuth', duration: '30 menit', type: 'video', completed: false },
          { title: 'Image & Performa Optimalisasi', duration: '20 menit', type: 'article', completed: false },
          { title: 'Deploy ke Vercel', duration: '18 menit', type: 'video', completed: false },
          { title: 'Ujian Akhir Modul', duration: '50 menit', type: 'quiz', completed: false },
        ],
      },
    ],
  }),
  buildCourse('figma-advanced', {
    title: 'Figma Masterclass',
    category: 'Design',
    level: 'Mahir',
    description:
      'Tingkatkan skill desain dengan fitur lanjutan Figma: auto layout, variables, modes, plugin, hingga kolaborasi real-time yang efisien.',
    instructor: 'Dewi Lestari',
    progress: 0,
    duration: '9 jam',
    students: 340,
    rating: 4.8,
    price: 'Rp 279.000',
    objectives: [
      'Menguasai auto layout & variables',
      'Membangun design system scalable',
      'Menggunakan plugin & workflow',
      'Kolaborasi dan versioning',
    ],
    modulesData: [
      {
        title: 'Fitur Lanjutan',
        lessons: [
          { title: 'Auto Layout Lanjutan', duration: '25 menit', type: 'video', completed: false },
          { title: 'Variables & Design Modes', duration: '28 menit', type: 'video', completed: false },
        ],
      },
      {
        title: 'Design System',
        lessons: [
          { title: 'Components & Variants', duration: '26 menit', type: 'video', completed: false },
          { title: 'Design Tokens Terpadu', duration: '24 menit', type: 'article', completed: false },
        ],
      },
      {
        title: 'Workflow Tim',
        lessons: [
          { title: 'Plugin & Automation', duration: '22 menit', type: 'video', completed: false },
          { title: 'Versioning & Kolaborasi', duration: '18 menit', type: 'video', completed: false },
          { title: 'Ujian Akhir Modul', duration: '40 menit', type: 'quiz', completed: false },
        ],
      },
    ],
  }),
  buildCourse('sql-advanced', {
    title: 'SQL Lanjutan & Optimization',
    category: 'Data',
    level: 'Mahir',
    description:
      'Optimasi database produksi: window functions, CTE, query tuning, index strategy, dan transaction isolation untuk sistem yang scalable.',
    instructor: 'Budi Santoso',
    progress: 0,
    duration: '10 jam',
    students: 280,
    rating: 4.8,
    price: 'Rp 319.000',
    objectives: [
      'Window functions & CTE',
      'Query plan & tuning',
      'Strategi indexing',
      'Transactions & concurrency',
    ],
    modulesData: [
      {
        title: 'Advanced Query',
        lessons: [
          { title: 'Window Functions', duration: '28 menit', type: 'video', completed: false },
          { title: 'CTE & Recursive Query', duration: '25 menit', type: 'video', completed: false },
        ],
      },
      {
        title: 'Optimasi',
        lessons: [
          { title: 'EXPLAIN & Query Plan', duration: '24 menit', type: 'video', completed: false },
          { title: 'Index Strategy', duration: '26 menit', type: 'video', completed: false },
          { title: 'Kuis: Optimasi SQL', duration: '12 menit', type: 'quiz', completed: false },
        ],
      },
      {
        title: 'Transaction',
        lessons: [
          { title: 'ACID & Isolation Levels', duration: '22 menit', type: 'article', completed: false },
          { title: 'Ujian Akhir Modul', duration: '45 menit', type: 'quiz', completed: false },
        ],
      },
    ],
  }),
  buildCourse('seo-marketing', {
    title: 'SEO & Content Strategy',
    category: 'Business',
    level: 'Menengah',
    description:
      'Naikkan peringkat website di Google dengan riset keyword, on-page SEO, link building, dan strategi konten yang terukur.',
    instructor: 'Rina Kurnia',
    progress: 0,
    duration: '7 jam',
    students: 380,
    rating: 4.6,
    price: 'Rp 229.000',
    objectives: [
      'Riset keyword yang tepat',
      'Implementasi on-page SEO',
      'Link building & authority',
      'Mengukur hasil dengan tools',
    ],
    modulesData: [
      {
        title: 'Riset Keyword',
        lessons: [
          { title: 'Keyword Research', duration: '22 menit', type: 'video', completed: false },
          { title: 'Search Intent', duration: '18 menit', type: 'video', completed: false },
        ],
      },
      {
        title: 'On-Page & Konten',
        lessons: [
          { title: 'On-Page SEO Elements', duration: '25 menit', type: 'video', completed: false },
          { title: 'Content Pillar & Cluster', duration: '24 menit', type: 'article', completed: false },
        ],
      },
      {
        title: 'Link & Pengukuran',
        lessons: [
          { title: 'Link Building Dasar', duration: '20 menit', type: 'video', completed: false },
          { title: 'Google Search Console', duration: '18 menit', type: 'video', completed: false },
          { title: 'Ujian Akhir Modul', duration: '35 menit', type: 'quiz', completed: false },
        ],
      },
    ],
  }),
  buildCourse('vue3-modern', {
    title: 'Vue 3 & Modern Frontend',
    category: 'Programming',
    level: 'Menengah',
    description:
      'Pelajari Vue 3 Composition API, Pinia state management, Vue Router, dan build aplikasi frontend yang reaktif dan terstruktur.',
    instructor: 'Siti Rahma',
    progress: 0,
    duration: '9 jam',
    students: 460,
    rating: 4.8,
    price: 'Rp 269.000',
    isEnrolled: true,
    objectives: [
      'Composition API & reactivity',
      'State management dengan Pinia',
      'Routing dan guards',
      'Composables & best practices',
    ],
    modulesData: [
      {
        title: 'Vue 3 Dasar',
        lessons: [
          { title: 'Setup & SFC', duration: '15 menit', type: 'video', completed: false },
          { title: 'Composition API & Refs', duration: '26 menit', type: 'video', completed: false },
        ],
      },
      {
        title: 'State & Routing',
        lessons: [
          { title: 'Pinia State Management', duration: '28 menit', type: 'video', completed: false },
          { title: 'Vue Router & Navigation Guards', duration: '24 menit', type: 'video', completed: false },
          { title: 'Kuis: Vue Router', duration: '12 menit', type: 'quiz', completed: false },
        ],
      },
      {
        title: 'Proyek',
        lessons: [
          { title: 'Composables & Utils', duration: '22 menit', type: 'article', completed: false },
          { title: 'Build Aplikasi CRUD', duration: '40 menit', type: 'video', completed: false },
          { title: 'Ujian Akhir Modul', duration: '45 menit', type: 'quiz', completed: false },
        ],
      },
    ],
  }),
  buildCourse('motion-design', {
    title: 'Motion Design & Animation',
    category: 'Design',
    level: 'Menengah',
    description:
      'Hidupkan desain dengan motion: prinsip animasi, easing, micro-interaction, hingga membangun prototype animasi di After Effects & Figma.',
    instructor: 'Dewi Lestari',
    progress: 0,
    duration: '8 jam',
    students: 230,
    rating: 4.7,
    price: 'Rp 249.000',
    objectives: [
      'Prinsip dasar animasi',
      'Timing & easing',
      'Micro-interactions',
      'Prototype animasi',
    ],
    modulesData: [
      {
        title: 'Prinsip Animasi',
        lessons: [
          { title: '12 Prinsip Animasi', duration: '25 menit', type: 'video', completed: false },
          { title: 'Timing, Spacing & Easing', duration: '22 menit', type: 'video', completed: false },
        ],
      },
      {
        title: 'Praktik Motion',
        lessons: [
          { title: 'Micro-interaction UI', duration: '26 menit', type: 'video', completed: false },
          { title: 'Smart Animate di Figma', duration: '20 menit', type: 'video', completed: false },
          { title: 'Kuis: Motion', duration: '10 menit', type: 'quiz', completed: false },
        ],
      },
      {
        title: 'Proyek Animasi',
        lessons: [
          { title: 'Membuat Lottie Animation', duration: '30 menit', type: 'video', completed: false },
          { title: 'Ujian Akhir Modul', duration: '40 menit', type: 'quiz', completed: false },
        ],
      },
    ],
  }),
  buildCourse('data-engineering', {
    title: 'Data Engineering Essentials',
    category: 'Data',
    level: 'Mahir',
    description:
      'Bangun pipeline data dengan Python, SQL, dan Airflow: ETL/ELT, data warehouse, hingga monitoring kualitas data.',
    instructor: 'Maya Wijaya',
    progress: 0,
    duration: '15 jam',
    students: 190,
    rating: 4.9,
    price: 'Rp 489.000',
    objectives: [
      'Memahami arsitektur data modern',
      'Membangun pipeline ETL/ELT',
      'Orkestrasi dengan Airflow',
      'Kualitas & monitoring data',
    ],
    modulesData: [
      {
        title: 'Arsitektur Data',
        lessons: [
          { title: 'Data Pipeline & Warehouse', duration: '26 menit', type: 'video', completed: false },
          { title: 'Data Modeling', duration: '28 menit', type: 'video', completed: false },
        ],
      },
      {
        title: 'Build Pipeline',
        lessons: [
          { title: 'ETL dengan Python', duration: '32 menit', type: 'video', completed: false },
          { title: 'Orkestrasi Airflow', duration: '30 menit', type: 'video', completed: false },
          { title: 'Kuis: Pipeline', duration: '14 menit', type: 'quiz', completed: false },
        ],
      },
      {
        title: 'Quality & Production',
        lessons: [
          { title: 'Data Quality Testing', duration: '24 menit', type: 'article', completed: false },
          { title: 'Monitoring Pipeline', duration: '22 menit', type: 'video', completed: false },
          { title: 'Ujian Akhir Modul', duration: '50 menit', type: 'quiz', completed: false },
        ],
      },
    ],
  }),
  buildCourse('sales-funnel', {
    title: 'Sales Funnel & Conversion',
    category: 'Business',
    level: 'Menengah',
    description:
      'Rancang funnel penjualan yang menghasilkan konversi: landing page, email marketing, remarketing, dan optimasi berbasis data.',
    instructor: 'Rina Kurnia',
    progress: 0,
    duration: '6 jam',
    students: 310,
    rating: 4.6,
    price: 'Rp 219.000',
    objectives: [
      'Membangun funnel yang efektif',
      'Landing page & CRO',
      'Email marketing automation',
      'Analisis konversi',
    ],
    modulesData: [
      {
        title: 'Funnel Dasar',
        lessons: [
          { title: 'Anatomi Sales Funnel', duration: '20 menit', type: 'video', completed: false },
          { title: 'Customer Journey Mapping', duration: '22 menit', type: 'video', completed: false },
        ],
      },
      {
        title: 'Optimasi Konversi',
        lessons: [
          { title: 'Landing Page & CRO', duration: '25 menit', type: 'video', completed: false },
          { title: 'Email Marketing Funnel', duration: '23 menit', type: 'video', completed: false },
        ],
      },
      {
        title: 'Pengukuran',
        lessons: [
          { title: 'Analitik Funnel', duration: '18 menit', type: 'article', completed: false },
          { title: 'Ujian Akhir Modul', duration: '35 menit', type: 'quiz', completed: false },
        ],
      },
    ],
  }),
  buildCourse('kubernetes-devops', {
    title: 'DevOps & Kubernetes Dasar',
    category: 'Programming',
    level: 'Mahir',
    description:
      'Perkenalan DevOps: containerization dengan Docker, orkestrasi Kubernetes, CI/CD pipeline, dan best practices deployment.',
    instructor: 'Budi Santoso',
    progress: 0,
    duration: '14 jam',
    students: 260,
    rating: 4.8,
    price: 'Rp 429.000',
    objectives: [
      'Container dengan Docker',
      'Orkestrasi Kubernetes',
      'Membangun CI/CD pipeline',
      'Deployment strategy',
    ],
    modulesData: [
      {
        title: 'Docker Dasar',
        lessons: [
          { title: 'Container vs VM', duration: '16 menit', type: 'video', completed: false },
          { title: 'Dockerfile & Images', duration: '26 menit', type: 'video', completed: false },
          { title: 'Docker Compose', duration: '22 menit', type: 'video', completed: false },
        ],
      },
      {
        title: 'Kubernetes',
        lessons: [
          { title: 'Arsitektur K8s', duration: '25 menit', type: 'video', completed: false },
          { title: 'Pod, Service & Deployment', duration: '30 menit', type: 'video', completed: false },
          { title: 'Kuis: Kubernetes', duration: '12 menit', type: 'quiz', completed: false },
        ],
      },
      {
        title: 'CI/CD',
        lessons: [
          { title: 'CI/CD dengan GitHub Actions', duration: '28 menit', type: 'video', completed: false },
          { title: 'Ujian Akhir Modul', duration: '50 menit', type: 'quiz', completed: false },
        ],
      },
    ],
  }),
  buildCourse('branding-design', {
    title: 'Brand Identity Design',
    category: 'Design',
    level: 'Pemula',
    description:
      'Bangun identitas merek yang kuat: riset brand, logo design, brand guidelines, hingga penerapan di berbagai media.',
    instructor: 'Dewi Lestari',
    progress: 0,
    duration: '7 jam',
    students: 330,
    rating: 4.7,
    price: 'Rp 239.000',
    objectives: [
      'Riset & strategi brand',
      'Desain logo yang memorable',
      'Menyusun brand guidelines',
      'Aplikasi identitas di media',
    ],
    modulesData: [
      {
        title: 'Strategi Brand',
        lessons: [
          { title: 'Brand Essence & Positioning', duration: '22 menit', type: 'video', completed: false },
          { title: 'Riset Audiens', duration: '20 menit', type: 'video', completed: false },
        ],
      },
      {
        title: 'Logo & Visual',
        lessons: [
          { title: 'Logo Design Process', duration: '28 menit', type: 'video', completed: false },
          { title: 'Color & Typography Brand', duration: '24 menit', type: 'video', completed: false },
          { title: 'Kuis: Brand Visual', duration: '10 menit', type: 'quiz', completed: false },
        ],
      },
      {
        title: 'Guidelines',
        lessons: [
          { title: 'Brand Guidelines Book', duration: '26 menit', type: 'article', completed: false },
          { title: 'Ujian Akhir Modul', duration: '40 menit', type: 'quiz', completed: false },
        ],
      },
    ],
  }),
]
