import { Resource } from '@/types/vue-router';

const routes: string[] = ['create', 'detail', 'edit'];

const resources: Resource[] = [
  // Admin
  {
    group: 'local',
    name: 'languages',
    icon: 'fas fa-language',
    api: 'admin/languages',
    generateRoutes: true,
    routes: [...routes],
  },
  {
    group: 'local',
    name: 'locales',
    icon: 'fas fa-map-marked-alt',
    api: 'admin/locales',
    generateRoutes: true,
    routes: [...routes],
  },
  {
    group: 'surveyMgmt',
    name: 'schemes',
    icon: 'fas fa-route',
    api: 'admin/schemes',
    generateRoutes: true,
    routes: [...routes, 'questions'],
  },
  {
    group: 'surveyMgmt',
    name: 'surveys',
    icon: 'fas fa-poll',
    api: 'admin/surveys',
    generateRoutes: true,
    routes: [...routes, 'respondents', 'mgmt', 'submissions', 'data-export'],
  },
  // System
  {
    group: 'system',
    name: 'tasks',
    icon: 'fas fa-tasks',
    api: 'admin/tasks',
    generateRoutes: true,
    routes: [...routes],
  },
  // ACL
  {
    group: 'acl',
    name: 'users',
    icon: 'fas fa-fw fa-users',
    api: 'admin/users',
    generateRoutes: true,
    routes: [...routes],
  },
  {
    group: 'acl',
    name: 'roles',
    icon: 'far fa-fw fa-id-badge',
    api: 'admin/roles',
    generateRoutes: true,
    routes: [...routes],
  },
  {
    group: 'acl',
    name: 'permissions',
    icon: 'far fa-fw fa-eye-slash',
    api: 'admin/permissions',
    generateRoutes: true,
    routes: [...routes],
  },
];

export default resources;
