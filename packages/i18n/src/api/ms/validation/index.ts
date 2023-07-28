import type { LocaleMessages } from 'vue-i18n';

import admin from './admin';
import attributes from './attributes';
import surveys from './surveys';
import types from './types';

const messages: LocaleMessages = {
  admin,
  attributes,
  types,
  surveys,
};

export default messages;
