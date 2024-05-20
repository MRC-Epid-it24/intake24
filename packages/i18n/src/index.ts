import type { LocaleMessages } from 'vue-i18n';

import { Application } from '@intake24/common/types';

import admin from './admin';
import api from './api';
import { defaultMessages, i18n } from './i18n';
import shared from './shared';
import survey from './survey';
import { translate, translatePath } from './util';

export { default as admin } from './admin';
export { default as api } from './api';
export * from './i18n';
export { default as shared } from './shared';
export { default as survey } from './survey';
export * from './util';
export type { LocaleMessageObject, LocaleMessages } from 'vue-i18n';

export const useI18n = () => ({ defaultMessages, i18n, translate, translatePath });

export const defaultI18nMessages: Record<Application, LocaleMessages> = {
  admin: admin.en,
  api: api.en,
  shared: shared.en,
  survey: survey.en,
};
