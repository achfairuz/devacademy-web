import type { RouteRecordRaw } from 'vue-router'

import AuthLayout from '@/layouts/AuthLayout.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'landing-page',
        component: () => import('@/views/home/LandingPageView.vue'),
      },

      {
        path: 'user/coming-soon',
        name: 'coming-soon',
        component: () => import('@/views/error/ComingSoonView.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: ':pathMatch(.*)*',
        name: 'not-found',
        component: () => import('@/views/error/NotFoundView.vue'),
      },
    ],
  },
  {
    path: '/',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@/views/auth/LoginView.vue'),
        meta: { guestOnly: true },
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('@/views/auth/RegisterView.vue'),
        meta: { guestOnly: true },
      },
    ],
  },
  {
    path: '/user',
    component: () => import('@/layouts/user/UserLayout.vue'),
    meta: { requiresAuth: true, roles: ['student'] },
    name: 'user',
    children: [
      {
        path: 'profile',
        name: 'profile',
        component: () => import('@/views/profile/ProfileView.vue'),
      },
      {
        path: 'subscription',
        name: 'subscription',
        component: () => import('@/views/user/subscription/SubscriptionView.vue'),
      },
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/user/home/HomeView.vue'),
      },
      {
        path: 'learning',
        name: 'learning',
        component: () => import('@/views/user/learning/LearningView.vue'),
      },
      {
        path: 'courses',
        name: 'courses',
        component: () => import('@/views/user/course/CourseView.vue'),
      },
      {
        path: 'courses/:id',
        name: 'course-detail',
        component: () => import('@/views/user/course/CourseDetailView.vue'),
      },
      {
        path: 'mentors',
        name: 'mentors',
        component: () => import('@/views/error/ComingSoonView.vue'),
      },
      {
        path: 'admin',
        name: 'admin',
        component: () => import('@/views/error/ComingSoonView.vue'),
      },
    ],
  },
  {
    path: '/admin',
    component: () => import('@/layouts/admin/AdminLayout.vue'),
    meta: { requiresAuth: true, roles: ['admin'] },
    name: 'admin',
    children: [
      {
        path: 'dashboard',
        name: 'admin-dashboard',
        component: () => import('@/views/error/ComingSoonView.vue'),
      },
      {
        path: 'categories',
        name: 'admin-categories',
        component: () => import('@/views/admin/category/AdminCategoryView.vue'),
      },
      {
        path: 'courses',
        name: 'admin-courses',
        component: () => import('@/views/error/ComingSoonView.vue'),
      },
      {
        path: 'students',
        name: 'admin-students',
        component: () => import('@/views/error/ComingSoonView.vue'),
      },
      {
        path: 'reviews',
        name: 'admin-reviews',
        component: () => import('@/views/error/ComingSoonView.vue'),
      },
      {
        path: 'profile',
        name: 'admin-profile',
        component: () => import('@/views/profile/ProfileView.vue'),
      },
    ],
  },
  {
    path: '/mentor',
    component: () => import('@/layouts/mentor/MentorLayout.vue'),
    meta: { requiresAuth: true, roles: ['mentor'] },
    name: 'mentor',
    children: [
      {
        path: 'dashboard',
        name: 'mentor-dashboard',
        component: () => import('@/views/mentor/dashboard/MentorDashboardView.vue'),
      },
      {
        path: 'courses',
        name: 'mentor-courses',
        component: () => import('@/views/mentor/course/MentorCoursesView.vue'),
      },
      {
        path: 'courses/add',
        name: 'mentor-course-create',
        component: () => import('@/views/mentor/course/CreateCourseView.vue'),
      },
      {
        path: 'courses/:id/edit',
        name: 'mentor-course-edit',
        component: () => import('@/views/mentor/course/EditCourseView.vue'),
      },
      {
        path: 'categories',
        name: 'mentor-categories',
        component: () => import('@/views/mentor/category/AddCategoryView.vue'),
      },
      {
        path: 'schedule',
        name: 'mentor-schedule',
        component: () => import('@/views/error/ComingSoonView.vue'),
      },
      {
        path: 'students',
        name: 'mentor-students',
        component: () => import('@/views/error/ComingSoonView.vue'),
      },
      {
        path: 'reviews',
        name: 'mentor-reviews',
        component: () => import('@/views/error/ComingSoonView.vue'),
      },
      {
        path: 'profile',
        name: 'mentor-profile',
        component: () => import('@/views/profile/ProfileView.vue'),
      },
    ],
  },
]
