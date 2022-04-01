import pick from 'lodash/pick';
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import { merge } from '@intake24/common/util';
import { admin, shared } from '@intake24/i18n';

Vue.use(VueI18n);

const buildWithLocales = ['en'];

export default new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: pick(merge(shared, admin), buildWithLocales),
});
