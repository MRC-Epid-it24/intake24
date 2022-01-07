import Vue from 'vue';
import VueI18n from 'vue-i18n';
import pick from 'lodash/pick';
import { survey } from '@intake24/i18n';

Vue.use(VueI18n);

// TODO: might be configurable list more locales are put into the source code
const buildWithLocales = ['en'];
const messages = pick(survey, buildWithLocales);

export default new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages,
});
