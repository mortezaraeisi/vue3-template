export default [
  {
    path: '/public',
    component: () => import('../layouts/PublicLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('../pages/public/Login.vue'),
      },
      {
        path: 'not-authorized',
        name: 'NotAuthorized',
        component: () => import('../pages/public/NotAuthorized.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../pages/public/NotFound.vue'),
  },
];
