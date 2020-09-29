import { Resource } from '@/types/vue-router';

const routes: string[] = ['create', 'detail', 'edit'];

const resources: Resource[] = [
  // Admin
  {
    group: 'surveyMgmt',
    name: 'locales',
    icon: 'fas fa-globe',
    api: 'v3/admin/locales',
    generateRoutes: true,
    routes: [...routes],
  },
  {
    group: 'surveyMgmt',
    name: 'schemes',
    icon: 'fas fa-route',
    api: 'v3/admin/schemes',
    generateRoutes: true,
    routes: [...routes, 'questions'],
  },
  {
    group: 'surveyMgmt',
    name: 'surveys',
    icon: 'fas fa-poll',
    api: 'v3/admin/surveys',
    generateRoutes: true,
    routes: [...routes, 'respondents', 'mgmt'],
  },
  // ACL
  {
    group: 'acl',
    name: 'users',
    icon: 'fas fa-fw fa-users',
    api: 'v3/admin/users',
    generateRoutes: true,
    routes: [...routes],
  },
  {
    group: 'acl',
    name: 'roles',
    icon: 'far fa-fw fa-id-badge',
    api: 'v3/admin/roles',
    generateRoutes: true,
    routes: [...routes],
  },
  {
    group: 'acl',
    name: 'permissions',
    icon: 'far fa-fw fa-eye-slash',
    api: 'v3/admin/permissions',
    generateRoutes: true,
    routes: [...routes],
  },
];

export default resources;
