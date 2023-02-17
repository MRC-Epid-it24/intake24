import pick from 'lodash/pick';
import Vue from 'vue';
import VueI18n from 'vue-i18n';

import { merge } from '@intake24/common/util';
import { shared, survey } from '@intake24/i18n';

Vue.use(VueI18n);

const buildWithLocales = ['en'];

const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: pick(merge(shared, survey), buildWithLocales),
});

export default i18n;

export const useI18n = () => i18n;
