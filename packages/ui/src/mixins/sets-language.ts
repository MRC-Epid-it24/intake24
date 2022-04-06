import { I18nLanguageEntry } from '@intake24/common/types/http';
import { defineComponent } from '@vue/composition-api';
import { useApp } from '../stores';

export default defineComponent({
  methods: {
    isRrlLocale(languageId: string): boolean {
      return ['ar'].includes(languageId);
    },

    async setLanguage(app: 'admin' | 'survey', languageId?: string) {
      const language = languageId || navigator.language || navigator.userLanguage;

      try {
        const {
          data: { id, messages, textDirection },
        } = await this.$http.get<I18nLanguageEntry>(`i18n/${language}`, { params: { app } });

        if (Object.keys(messages).length) this.$root.$i18n.setLocaleMessage(id, messages);

        this.updateAppWithLanguage(id, textDirection === 'rtl');
      } catch {
        if (Object.keys(this.$root.$i18n.messages).includes(language))
          this.updateAppWithLanguage(language);
      }
    },

    updateAppWithLanguage(languageId: string, isRtl?: boolean) {
      const appStore = useApp();

      appStore.setLanguage(languageId);
      this.$root.$i18n.locale = languageId;
      this.$vuetify.rtl = typeof isRtl !== 'undefined' ? isRtl : this.isRrlLocale(languageId);
      document.querySelector('html')?.setAttribute('lang', languageId);
      this.$http.axios.defaults.headers.common['Accept-Language'] = languageId;
    },
  },
});
