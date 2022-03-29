import pick from 'lodash/pick';
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import { merge } from '@intake24/common/util';
import admin from './admin';
import survey from './survey';
import shared from './shared';

export type { LocaleMessages, LocaleMessageObject } from 'vue-i18n';

export { default as admin } from './admin';
export { default as survey } from './survey';
export { default as shared } from './shared';

export * from './util';

Vue.use(VueI18n);

const buildWithLocales = ['en'];

export const adminVueI18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: pick(merge(shared, admin), buildWithLocales),
});

export const surveyVueI18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: pick(merge(shared, survey), buildWithLocales),
});
