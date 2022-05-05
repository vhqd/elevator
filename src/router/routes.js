const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/index.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/login.vue')
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/pages/about.vue')
  },
  {
    path: '/404',
    name: 'error',
    component: () => import('@/pages/error/index.vue')
  },
  {
    path: "/:catchAll(.*)",
    component: () => import('@/pages/error/index.vue')
  },
];
export default routes;
