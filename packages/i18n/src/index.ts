import { i18n } from './i18n';
import { translate } from './util';

export { default as admin } from './admin';
export { default as api } from './api';
export * from './i18n';
export { default as shared } from './shared';
export { default as survey } from './survey';
export * from './util';
export type { LocaleMessageObject, LocaleMessages } from 'vue-i18n';

export const useI18n = () => ({ i18n, translate });
