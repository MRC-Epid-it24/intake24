import { defineComponent } from 'vue';

import type { I18nLanguageEntry, I18nLanguageListEntry } from '@intake24/common/types/http';

import { useApp } from '../stores';

export default defineComponent({
  data() {
    return {
      language: this.$root.$i18n.locale,
      languages: [] as I18nLanguageListEntry[],
    };
  },

  async mounted() {
    const { data } = await this.$http.get<I18nLanguageListEntry[]>('i18n');
    this.languages = data;
  },

  methods: {
    fallbackLanguages(): string[] {
      const { fallbackLocale } = this.$root.$i18n;
      if (!fallbackLocale) return [];

      if (typeof fallbackLocale === 'string') return [fallbackLocale];

      return Array.isArray(fallbackLocale) ? fallbackLocale : Object.keys(fallbackLocale);
    },

    getLanguages(languageId: string): string[] {
      return [
        ...new Set(
          [languageId, languageId.split('-')[0], ...this.fallbackLanguages()].filter(Boolean)
        ),
      ];
    },

    hasLanguage(languageId: string): boolean {
      return this.$root.$i18n.availableLocales.includes(languageId);
    },

    isRrlLanguage(languageId: string): boolean {
      return ['ar'].includes(languageId);
    },

    async setLanguage(app: 'admin' | 'survey', languageId?: string) {
      let language = languageId || useApp().lang;
      let isRrlLanguage = this.isRrlLanguage(language);

      try {
        const {
          data: { id, messages, textDirection },
        } = await this.$http.get<I18nLanguageEntry>(`i18n/${language}`, { params: { app } });

        if (Object.keys(messages).length) this.$root.$i18n.setLocaleMessage(id, messages);

        language = id;
        isRrlLanguage = textDirection === 'rtl';
      } catch {
        //
      }

      for (const lang of this.getLanguages(language)) {
        if (this.hasLanguage(lang)) {
          this.updateAppWithLanguage(lang, isRrlLanguage);
          break;
        }
      }
    },

    updateAppWithLanguage(languageId: string, isRtl?: boolean) {
      useApp().setLanguage(languageId);
      this.$root.$i18n.locale = languageId;
      this.$vuetify.rtl = typeof isRtl !== 'undefined' ? isRtl : this.isRrlLanguage(languageId);
      document.querySelector('html')?.setAttribute('lang', languageId);
      this.$http.axios.defaults.headers.common['Accept-Language'] = languageId;
    },
  },
});
