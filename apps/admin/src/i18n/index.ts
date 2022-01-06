import Vue from 'vue';
import VueI18n from 'vue-i18n';
import { admin as messages } from '@intake24/i18n';

Vue.use(VueI18n);

const browserLanguage = navigator.language || navigator.userLanguage;
const userLanguage = Vue.ls.get('language', browserLanguage);
const fallbackLocale = 'en';

export default new VueI18n({
  locale: userLanguage in messages ? userLanguage : fallbackLocale,
  fallbackLocale,
  messages,
});
