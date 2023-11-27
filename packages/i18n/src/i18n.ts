import Vue from 'vue';
import VueI18n from 'vue-i18n';

import type { Application } from '@intake24/common/types';

Vue.use(VueI18n);

export const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
});

export const loadAppLanguage = async (app: Application, lang: string) => {
  if (i18n.locale === lang || i18n.availableLocales.includes(lang)) return;

  await Promise.allSettled([
    import(`./${app}/${lang}/index.ts`),
    import(`./shared/${lang}/index.ts`),
  ]).then(([app, shared]) => {
    if (app.status !== 'fulfilled' || shared.status !== 'fulfilled') return;

    i18n.setLocaleMessage(lang, { ...app.value.default, ...shared.value.default });
  });
};

export const loadAdminLanguage = async (lang: string) => loadAppLanguage('admin', lang);

export const loadSurveyLanguage = async (lang: string) => loadAppLanguage('survey', lang);
