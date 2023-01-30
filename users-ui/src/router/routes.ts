import { RouteRecordRaw } from 'vue-router';

const publicRoutes: RouteRecordRaw[] = [
  {
    path: '/public',
    component: () => import('layouts/PublicLayout.vue'),
    children: [
      {
        path: 'sign-in',
        name: 'SignIn',
        component: () => import('pages/public/SignIn.vue'),
      },
      {
        path: 'error-not-authorized',
        name: 'ErrorNotAuthorized',
        component: () => import('pages/public/ErrorNotAuthorized.vue'),
      },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/public/ErrorNotFound.vue'),
  },
];

const privateRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue'),
      },
    ],
  },
];

export default publicRoutes.concat(privateRoutes);
