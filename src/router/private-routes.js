export default [
  {
    path: '/',
    component: () => import('../layouts/AppLayout.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../pages/Dashboard/Dashboard.vue'),
      },
    ],
  },
];
