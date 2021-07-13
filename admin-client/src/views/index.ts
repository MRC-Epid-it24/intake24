import { Dictionary } from '@common/types';
import authentication from './authentication';
import dashboard from './Dashboard.vue';
import profile from './Profile.vue';
import images from './images';
import jobs from './jobs';
import languages from './languages';
import locales from './locales';
import schemes from './schemes';
import schemeQuestions from './scheme-questions';
import signInLogs from './sign-in-logs';
import surveys from './surveys';
import permissions from './permissions';
import roles from './roles';
import tasks from './tasks';
import users from './users';

const views: Dictionary = {
  authentication,
  dashboard,
  profile,
  images,
  jobs,
  languages,
  locales,
  schemes,
  'scheme-questions': schemeQuestions,
  'sign-in-logs': signInLogs,
  surveys,
  permissions,
  roles,
  tasks,
  users,
};

export default views;
