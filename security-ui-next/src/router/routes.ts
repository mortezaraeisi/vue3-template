const publicRoutes = [
  {
    path: '/public',
    component: () => import('../layouts/PublicLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('../pages/public/Login.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('../pages/public/NotFound.vue'),
  },
];

const privateRoutes = [
  {
    path: '/',
    component: () => import('../layouts/AppLayout.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../pages/dashboard/Dashboard.vue'),
      },
      {
        path: 'users-list',
        name: 'UsersList',
        component: () => import('../pages/users/UsersList.vue'),
      },
      {
        path: 'user/:id',
        name: 'User',
        component: () => import('../pages/users/User.vue'),
        children: [
          {
            path: 'info',
            name: 'UserInfo',
            component: () => import('../pages/users/UserInfo.vue'),
          },
          {
            path: 'membership',
            name: 'UserMembership',
            component: () => import('../pages/users/UserMembership.vue'),
          },
          {
            path: 'substitution',
            name: 'UserSubstitution',
            component: () => import('../pages/users/UserSubstitution.vue'),
          },
          {
            path: 'subsets',
            name: 'UserSubsets',
            component: () => import('../pages/users/UserSubsets.vue'),
          },
          {
            path: 'domain',
            name: 'UserDomain',
            component: () => import('../pages/users/UserDomain.vue'),
          },
          {
            path: 'permissions',
            name: 'UserPermissions',
            component: () => import('../pages/users/UserPermissions.vue'),
          },
          {
            path: 'job-location',
            name: 'UserJobLocation',
            component: () => import('../pages/users/UserJobLocation.vue'),
          },
          {
            path: 'auth',
            name: 'UserAuth',
            component: () => import('../pages/users/UserAuth.vue'),
          },
        ]
      },
      {
        path: 'groups-list',
        name: 'GroupsList',
        component: () => import('../pages/groups/GroupsList.vue'),
      },
      {
        path: 'grids-list',
        name: 'GridsList',
        component: () => import('../pages/grids/GridsList.vue'),
      },
      {
        path: 'job-location-list',
        name: 'JobLocationList',
        component: () => import('../pages/jobLocation/JobLocationList.vue'),
      },
      {
        path: 'domains-list',
        name: 'DomainsList',
        component: () => import('../pages/domains/DomainsList.vue'),
      },
      {
        path: 'workspaces-list',
        name: 'WorkspacesList',
        component: () => import('../pages/workspaces/WorkspacesList.vue'),
      },
    ],
  },
];

export default publicRoutes.concat(privateRoutes);
