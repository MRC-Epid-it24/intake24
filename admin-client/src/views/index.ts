import { ViewsCollection } from '@/types/vue-router';
import authentication from './authentication';
import dashboard from './Dashboard.vue';
import profile from './Profile.vue';
import jobs from './jobs';
import languages from './languages';
import locales from './locales';
import schemes from './schemes';
import surveys from './surveys';
import permissions from './permissions';
import roles from './roles';
import tasks from './tasks';
import users from './users';

const views: ViewsCollection = {
  authentication,
  dashboard,
  profile,
  jobs,
  languages,
  locales,
  schemes,
  surveys,
  permissions,
  roles,
  tasks,
  users,
};

export default views;
