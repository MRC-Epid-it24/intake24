import pick from 'lodash/pick';
import Vue from 'vue';
import VueI18n from 'vue-i18n';

import { mergeMultiple } from '@intake24/common/util';
import { admin, api, shared, survey } from '@intake24/i18n';

Vue.use(VueI18n);

const buildWithLocales = ['en'];

export default new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: pick(mergeMultiple(admin, api, shared, survey), buildWithLocales),
});
