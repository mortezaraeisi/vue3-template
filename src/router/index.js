import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '../stores/user-store';
import privateRoutes from './private-routes';
import publicRoutes from './public-routes';
import adminRoutes from './admin-routes';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: publicRoutes.concat(privateRoutes).concat(adminRoutes),
});

router.beforeEach((to, from, next) => {
  const { isLoggedIn, isAdmin } = useUserStore();
  if (to.fullPath.startsWith('/public') || to.name === 'NotFound') {
    next();
    return;
  }
  if (!isLoggedIn) {
    next({ name: 'Login', replace: true });
    return;
  }
  if (to.fullPath.startsWith('/admin') && !isAdmin) {
    next({ name: 'NotAuthorized' });
    return;
  }
  next();
});

export default router;
