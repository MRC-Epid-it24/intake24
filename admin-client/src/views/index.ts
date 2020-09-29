import { ViewsCollection } from '@/types/vue-router';
import authentication from './authentication';
import dashboard from './Dashboard.vue';
import profile from './Profile.vue';
import locales from './locales';
import schemes from './schemes';
import surveys from './surveys';
import permissions from './permissions';
import roles from './roles';
import users from './users';

const views: ViewsCollection = {
  authentication,
  dashboard,
  profile,
  locales,
  schemes,
  surveys,
  permissions,
  roles,
  users,
};

export default views;
