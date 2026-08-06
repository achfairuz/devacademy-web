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
        path: 'mentor',
        name: 'mentor',
        component: () => import('@/views/error/ComingSoonView.vue'),
      },
      {
        path: 'admin',
        name: 'admin',
        component: () => import('@/views/error/ComingSoonView.vue'),
      },
    ],
  },
]
