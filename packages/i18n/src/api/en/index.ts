import type { LocaleMessages } from 'vue-i18n';

import rateLimit from './rate-limit.json';
import validation from './validation';

const messages: LocaleMessages = {
  validation,
  rateLimit,
};

export default messages;
