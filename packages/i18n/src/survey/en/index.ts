import type { LocaleMessages } from 'vue-i18n';

import breadcrumbs from './breadcrumbs';
import common from './common';
import login from './login';
import portion from './portion';
import profile from './profile';
import recall from './recall';
import survey from './survey';

const messages: LocaleMessages = {
  common,
  login,
  profile,
  recall,
  portion,
  survey,
  breadcrumbs,
};

export default messages;
