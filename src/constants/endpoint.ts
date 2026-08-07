export const endpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    me: '/auth/me',
  },
  categories: {
    list: '/categories',
    detail: (id: string) => `/categories/${id}`,
  },
} as const
