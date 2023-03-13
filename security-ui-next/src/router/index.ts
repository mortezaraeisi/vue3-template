import { createRouter, createWebHashHistory } from 'vue-router';
import routes from './routes';
import { useAuthStore } from "../stores/auth-store";

export const router = createRouter({
  history: createWebHashHistory(), routes,
});

router.beforeEach((to, from, next) => {
  if (to.fullPath.startsWith('/public')) {
    next();
    return;
  }
  const authStore = useAuthStore();
  if (authStore.isLoggedIn) {
    next();
    return;
  }

  next({ name: 'Login', replace: true });
});
