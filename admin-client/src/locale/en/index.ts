import { LocaleMessages } from 'vue-i18n';
import common from './common';
import dashboard from './dashboard';
import flags from './flags';
import asServed from './as-served';
import guideImages from './guide-images';
import imageMaps from './image-maps';
import jobs from './jobs';
import languages from './languages';
import locales from './locales';
import profile from './profile';
import permissions from './permissions';
import roles from './roles';
import schemes from './schemes';
import schemeQuestions from './scheme-questions';
import signInLogs from './sign-in-logs';
import surveys from './surveys';
import tasks from './tasks';
import users from './users';

const messages: LocaleMessages = {
  common,
  dashboard,
  flags,
  'as-served': asServed,
  'guide-images': guideImages,
  'image-maps': imageMaps,
  jobs,
  languages,
  locales,
  profile,
  permissions,
  roles,
  schemes,
  'scheme-questions': schemeQuestions,
  'sign-in-logs': signInLogs,
  surveys,
  tasks,
  users,
};

export default messages;
