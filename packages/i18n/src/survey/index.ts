import type { LocaleMessages } from 'vue-i18n';

import en from './en';
import ms from './ms';
import ta from './ta';
import zh from './zh';

const messages: Record<string, LocaleMessages> = { en, zh, ta, ms };

export default messages;
