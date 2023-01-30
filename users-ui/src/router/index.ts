import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory, RouteLocationNormalized,
} from 'vue-router';

import { useAuthStore } from 'stores/auth-store';
import publicRoutes from './routes';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */
function beforeEachGuard(to: RouteLocationNormalized): any {
  if (to.fullPath.startsWith('/public')) {
    return true;
  }
  const {
    isLoggedIn,
    isAdmin0,
  } = useAuthStore();
  if (!isLoggedIn) {
    return { name: 'SignIn' };
  }
  if (!isAdmin0 && to.fullPath.startsWith('/admin')) {
    return { name: 'ErrorNotAuthorized' };
  }
  return true;
}

export default route((/* { store, ssrContext } */) => {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory);

  const Router = createRouter({
    scrollBehavior: () => ({
      left: 0,
      top: 0,
    }),
    routes: publicRoutes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach(beforeEachGuard);
  return Router;
});
