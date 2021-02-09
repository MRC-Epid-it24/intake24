import Vue from 'vue';
import VueI18n, { LocaleMessages } from 'vue-i18n';
import en from './en';
import de from './de';

Vue.use(VueI18n);

const messages: LocaleMessages = { en, de };

const browserLanguage = navigator.language || navigator.userLanguage;
const userLanguage = Vue.ls.get('language', browserLanguage);
const fallbackLocale = 'en';

export default new VueI18n({
  locale: userLanguage in messages ? userLanguage : fallbackLocale,
  fallbackLocale,
  messages,
});
