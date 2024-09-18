import { computed, onMounted, watch } from 'vue';
import Vuetify from 'vuetify/lib';

import type { I18nLanguageEntry, I18nLanguageListEntry } from '@intake24/common/types/http';
import { defaultMessages, loadAppLanguage, useI18n } from '@intake24/i18n';

import type { HttpClient } from '../types';
import { useApp } from '../stores';

export function useLanguage(app: 'admin' | 'survey', http: HttpClient, vuetify: Vuetify['framework']) {
  const appStore = useApp();
  const { i18n } = useI18n();

  const fallbackLanguages = computed(() => {
    const { fallbackLocale } = i18n;
    if (!fallbackLocale)
      return [];

    if (typeof fallbackLocale === 'string')
      return [fallbackLocale];

    return Array.isArray(fallbackLocale) ? fallbackLocale : Object.keys(fallbackLocale);
  });

  const getLanguages = (languageId: string): string[] => [
    ...new Set(
      [languageId, languageId.split('-')[0], ...fallbackLanguages.value].filter(Boolean),
    ),
  ];

  const hasLanguage = (languageId: string) => i18n.availableLocales.includes(languageId);

  const isRrlLanguage = (languageId: string) => ['ar'].includes(languageId);

  const updateAppWithLanguage = (languageId: string, isRtl?: boolean) => {
    i18n.locale = languageId;
    vuetify.rtl = typeof isRtl !== 'undefined' ? isRtl : isRrlLanguage(languageId);
    document.querySelector('html')?.setAttribute('lang', languageId);
    http.axios.defaults.headers.common['Accept-Language'] = languageId;
  };

  const setLanguage = async (languageId: string) => {
    if (languageId === i18n.locale)
      return;

    let language = languageId || appStore.lang;
    let isRrl = isRrlLanguage(language);

    try {
      const {
        data: { code, messages, textDirection },
      } = await http.get<I18nLanguageEntry>(`i18n/${language}`, { params: { app } });

      if (Object.keys(messages).length) {
        i18n.setLocaleMessage(code, messages);
        defaultMessages.setMessages(code, messages);
      }

      language = code;
      isRrl = textDirection === 'rtl';
    }
    catch {
      //
    }

    for (const lang of getLanguages(language)) {
      await loadAppLanguage(app, lang);

      if (hasLanguage(lang)) {
        updateAppWithLanguage(lang, isRrl);
        appStore.setLanguage(lang);
        break;
      }
    }
  };

  watch(() => appStore.lang, async (val) => {
    await setLanguage(val);
  });

  onMounted(async () => {
    const { data } = await http.get<I18nLanguageListEntry[]>('i18n');
    appStore.setLanguages(data);

    await setLanguage(appStore.lang || navigator.language || navigator.userLanguage);
  });
}
