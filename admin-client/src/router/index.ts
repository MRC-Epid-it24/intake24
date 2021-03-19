import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import views from '@/views';
import resources from './resources';

Vue.use(VueRouter);

const { authentication } = views;

const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'login',
    component: authentication.login,
    meta: { module: 'login', public: true, title: 'common.login' },
  },
  {
    path: '/password',
    name: 'password-request',
    component: authentication.passwordRequest,
    meta: { module: 'password', public: true, title: 'users.password.reset._' },
  },
  {
    path: '/password/reset/:token',
    name: 'password-reset',
    component: authentication.passwordReset,
    meta: { module: 'password', public: true, title: 'users.password.reset._' },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: views.dashboard,
    meta: { module: 'dashboard', title: 'dashboard._' },
  },
  {
    path: '/profile',
    name: 'profile',
    component: views.profile,
    meta: { module: 'profile', title: 'profile._' },
  },
];

resources.forEach((item) => {
  if (!item.generateRoutes) return;

  const { name, path = name } = item;
  const meta = { module: name };

  const pathSegments = path.split('/');
  const resourceViews = pathSegments.reduce((acc, seg) => {
    return acc[seg];
  }, views);

  routes.push({
    path: `/${path}`,
    name,
    component: resourceViews.list,
    meta: { ...meta, title: `${name}.index`, perm: `${name}-browse` },
  });

  item.routes.forEach((route) => {
    if (route === 'create') {
      routes.push({
        path: `/${path}/${route}`,
        name: `${name}-${route}`,
        component: resourceViews[route],
        meta: { ...meta, title: `${name}.new`, perm: `${name}-${route}` },
      });
      return;
    }

    routes.push({
      path: `/${path}/:id/${route === 'detail' ? '' : route}`,
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
