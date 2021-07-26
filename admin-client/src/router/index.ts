import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import pluralize from 'pluralize';
import views from '@/views';
import resources from './resources';

const generateResourceRoutes = (
  resourceName: string,
  pathSegments: string[],
  viewsPath: any,
  parent?: string
) => {
  const routerRoutes: RouteConfig[] = [];

  const resourceRoutes = Object.keys(viewsPath);
  const name = parent ? `${parent}-${resourceName}` : resourceName;
  const title = parent ? `${parent}.${resourceName}` : resourceName;
  const identifier = parent ? `${pluralize.singular(resourceName)}Id` : 'id';

  const meta = { module: { current: resourceName, parent } };

  resourceRoutes.forEach((action) => {
    const perm = parent ? `${parent}-${resourceName}` : `${resourceName}-${action}`;

    if (action === 'browse') {
      routerRoutes.push({
        path: pathSegments.join('/'),
        name,
        component: viewsPath[action],
        meta: { ...meta, action, title: `${title}.title`, perm },
        props: true,
      });
      return;
    }

    if (action === 'create') {
      routerRoutes.push({
        path: [...pathSegments, action].join('/'),
        name: `${name}-${action}`,
        component: viewsPath[action],
        meta: { ...meta, action, title: `${title}.${action}`, perm },
        props: true,
      });
      return;
    }

    if (typeof viewsPath[action] === 'function') {
      routerRoutes.push({
        path: [...pathSegments, `:${identifier}`, action === 'read' ? undefined : action]
          .filter(Boolean)
          .join('/'),
        name: `${name}-${action}`,
        component: viewsPath[action],
        meta: { ...meta, action, perm },
        props: true,
      });
    }

    if (typeof viewsPath[action] === 'object') {
      routerRoutes.push(
        ...generateResourceRoutes(action, [...pathSegments, ':id', action], viewsPath[action], name)
      );
    }
  });

  return routerRoutes;
};

Vue.use(VueRouter);

const { authentication } = views;

const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'login',
    component: authentication.login,
    meta: { module: { current: 'login' }, public: true, title: 'common.login' },
  },
  {
    path: '/password',
    name: 'password-request',
    component: authentication.passwordRequest,
    meta: { module: { current: 'password' }, public: true, title: 'users.password.reset._' },
  },
  {
    path: '/password/reset/:token',
    name: 'password-reset',
    component: authentication.passwordReset,
    meta: { module: { current: 'password' }, public: true, title: 'users.password.reset._' },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: views.dashboard,
    meta: { module: { current: 'dashboard' }, action: 'browse', title: 'dashboard._' },
  },
  {
    path: '/profile',
    name: 'profile',
    component: views.profile,
    meta: { module: { current: 'profile' }, action: 'browse', title: 'profile._' },
  },
];

resources.forEach((item) => {
  const { name, path = name, generateRoutes } = item;
  if (!generateRoutes) return;

  const pathSegments = path.split('/');
  const resourceViews = pathSegments.reduce((acc, seg) => {
    return acc[seg];
  }, views);

  const [first, ...rest] = pathSegments;
  routes.push(...generateResourceRoutes(name, [`/${first}`, ...rest], resourceViews));
});

const router = new VueRouter({
  mode: 'history',
  base: process.env.VUE_APP_BASE_URL ?? '/',
  routes,
});

export default router;
