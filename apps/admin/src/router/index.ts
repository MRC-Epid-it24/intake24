import type { RouteConfig } from 'vue-router';
import { singular } from 'pluralize';
import Vue from 'vue';
import VueRouter from 'vue-router';

import views from '@intake24/admin/views';

import type { Resource } from '../types';
import guards from './guards';
import resources from './resources';

export interface GenerateRoutesOps extends Resource {
  parent?: string;
}

const isVueComponent = (object: any) => {
  if (typeof object === 'function') return true;

  const { render } = object;
  if (render && typeof render === 'function') return true;

  return false;
};

const generateResourceRoutes = (
  resourceName: string,
  pathSegments: string[],
  viewsPath: any,
  options: GenerateRoutesOps
) => {
  const { parent, securable } = options;
  const routerRoutes: RouteConfig[] = [];

  const resourceRoutes = Object.keys(viewsPath);
  const name = parent ? `${parent}-${resourceName}` : resourceName;
  const title =
    parent && resourceName !== 'securables' ? `${parent}.${resourceName}` : resourceName;
  const identifier = parent ? `${singular(resourceName)}Id` : 'id';

  const meta = { module: { current: resourceName, parent } };

  resourceRoutes.forEach((action) => {
    let perm = parent ? `${parent}|${resourceName}` : `${resourceName}|${action}`;
    if (securable) perm = options.name;

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
        meta: { ...meta, action, title: `${title}.${action}`, perm: `${name}|create` },
        props: true,
      });
      return;
    }

    if (isVueComponent(viewsPath[action])) {
      routerRoutes.push({
        path: [...pathSegments, `:${identifier}`, action === 'read' ? undefined : action]
          .filter(Boolean)
          .join('/'),
        name: `${name}-${action}`,
        component: viewsPath[action],
        meta: { ...meta, action, title: `${title}.${action}`, perm },
        props: true,
      });
      return;
    }

    if (typeof viewsPath[action] === 'object') {
      routerRoutes.push(
        ...generateResourceRoutes(action, [...pathSegments, ':id', action], viewsPath[action], {
          ...options,
          parent: name,
        })
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
    meta: { module: { current: 'login' }, public: true, title: 'common.login._' },
  },
  {
    path: '/password',
    name: 'password-request',
    component: authentication.passwordRequest,
    meta: { module: { current: 'password' }, public: true, title: 'common.password.reset._' },
  },
  {
    path: '/password/reset/:token',
    name: 'password-reset',
    component: authentication.passwordReset,
    meta: { module: { current: 'password' }, public: true, title: 'common.password.reset._' },
  },
  {
    path: '/verify',
    name: 'verify',
    component: authentication.verify,
    meta: { module: { current: 'verify' }, public: true, title: 'common.login._' },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: views.dashboard,
    meta: { module: { current: 'dashboard' }, action: 'browse', title: 'dashboard._' },
  },
  {
    path: '/user',
    name: 'user',
    component: views.user.profile,
    meta: { module: { current: 'user' }, title: 'user._' },
  },
  // Food databases explorer
  {
    path: '/fdbs',
    name: 'fdbs',
    component: views.fdbs.browse,
    meta: {
      module: { current: 'fdbs' },
      title: 'fdbs.title',
      action: 'browse',
      perm: 'locales',
    },
  },
  {
    path: '/fdbs/:id',
    name: 'fdbs-food-list',
    component: views.fdbs.read,
    meta: {
      module: { current: 'fdbs' },
      title: 'fdbs.food-list.title',
      action: 'food-list',
      perm: 'locales',
    },
    props: true,
    children: [
      {
        path: 'categories/:entryId',
        name: 'fdbs-categories',
        component: views.fdbs.category,
        meta: {
          module: { current: 'categories', parent: 'fdbs' },
          title: 'fdbs.food-list.title',
          action: 'food-list',
          perm: 'locales',
        },
        props: true,
      },
      {
        path: 'foods/:entryId',
        name: 'fdbs-foods',
        component: views.fdbs.food,
        meta: {
          module: { current: 'foods', parent: 'fdbs' },
          title: 'fdbs.food-list.title',
          action: 'food-list',
          perm: 'locales',
        },
        props: true,
      },
    ],
  },
];

if (import.meta.env.VITE_ACL_SIGNUP_ENABLED === 'true') {
  routes.push({
    path: '/signup',
    name: 'signup',
    component: authentication.signup,
    meta: { module: { current: 'signup' }, public: true, title: 'common.signup._' },
  });
}

resources.forEach((item) => {
  const { name, path = name, generateRoutes } = item;
  if (!generateRoutes) return;

  const pathSegments = path.split('/');
  const resourceViews = pathSegments.reduce((acc, seg) => acc[seg], views);

  const [first, ...rest] = pathSegments;
  routes.push(...generateResourceRoutes(name, [`/${first}`, ...rest], resourceViews, item));
});

routes.push({ path: '*', name: '404', redirect: '/' });

const router = new VueRouter({
  mode: 'history',
  base: import.meta.env.VITE_APP_BASE_URL ?? '/',
  routes,
});

guards(router);

export default router;
