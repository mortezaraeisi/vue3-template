export default [
  {
    path: '/admin',
    component: () => import('../layouts/AppLayout.vue'),
    children: [
      {
        path: 'admin-panel',
        name: 'AdminPanel',
        component: () => import('../pages/admin/AdminPanel.vue'),
      },
    ],
  },
];
