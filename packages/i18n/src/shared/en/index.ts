import type { LocaleMessages } from 'vue-i18n';
import feedback from './feedback';
import prompts from './prompts';
import standardUnits from './standard-units';

const messages: LocaleMessages = {
  feedback,
  prompts,
  'standard-units': standardUnits,
};

export default messages;
