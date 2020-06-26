import Vue from 'vue';
import VueI18n, { LocaleMessages } from 'vue-i18n';
import en from './en';

Vue.use(VueI18n);

const messages: LocaleMessages = { en };

export default new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages,
});
