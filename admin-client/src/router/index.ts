import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import views from '@/views';
import { Views } from '@/types/vue-router';
import resources from './resources';

Vue.use(VueRouter);

const authViews = views.authentication as Views;

const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'login',
    component: authViews.login,
    meta: { module: 'login', public: true, title: 'common.login' },
  },
  {
    path: '/password',
    name: 'password-request',
    component: authViews.request,
    meta: { module: 'password', public: true, title: 'users.password.reset._' },
  },
  {
    path: '/password/reset/:token',
    name: 'password-reset',
    component: authViews.reset,
    meta: { module: 'password', public: true, title: 'users.password.reset._' },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: views.dashboard,
    meta: { module: 'dashboard', title: 'common.dashboard' },
  },
  {
    path: '/profile',
    name: 'profile',
    component: views.profile,
    meta: { module: 'profile', title: 'common.profile' },
  },
];

resources.forEach((item) => {
  if (!item.generateRoutes) return;

  const { name } = item;
  const meta = { module: name };
  const resourceViews = views[name] as Views;

  routes.push({
    path: `/${name}`,
    name,
    component: resourceViews.list,
    meta: { ...meta, title: `${name}.index`, perm: `${name}-list` },
  });

  item.routes.forEach((route) => {
    if (route === 'create') {
      routes.push({
        path: `/${name}/${route}`,
        name: `${name}-${route}`,
        component: resourceViews[route],
        meta: { ...meta, title: `${name}.new`, perm: `${name}-${route}` },
      });
      return;
    }

    routes.push({
      path: `/${name}/:id/${route === 'detail' ? '' : route}`,
      name: `${name}-${route}`,
      component: resourceViews[route],
      meta: { ...meta, perm: `${name}-${route}` },
      props: true,
    });
  });
});

const router = new VueRouter({
  mode: 'history',
  base: process.env.VUE_APP_BASE_URL ?? '/',
  routes,
});

export default router;
