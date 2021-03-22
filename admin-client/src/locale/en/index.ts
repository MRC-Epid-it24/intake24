import { LocaleMessages } from 'vue-i18n';
import common from './common';
import dashboard from './dashboard';
import flags from './flags';
import guideImages from './guide-images';
import jobs from './jobs';
import languages from './languages';
import locales from './locales';
import profile from './profile';
import permissions from './permissions';
import roles from './roles';
import schemes from './schemes';
import surveys from './surveys';
import tasks from './tasks';
import users from './users';

const messages: LocaleMessages = {
  common,
  dashboard,
  flags,
  'guide-images': guideImages,
  jobs,
  languages,
  locales,
  profile,
  permissions,
  roles,
  schemes,
  surveys,
  tasks,
  users,
};

export default messages;
