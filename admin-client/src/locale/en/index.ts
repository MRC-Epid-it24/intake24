import { LocaleMessageObject } from 'vue-i18n';
import common from './common';
import locales from './locales';
import permissions from './permissions';
import roles from './roles';
import schemes from './schemes';
import surveys from './surveys';
import users from './users';

const messages: LocaleMessageObject = {
  common,
  locales,
  permissions,
  roles,
  schemes,
  surveys,
  users,
};

export default messages;
