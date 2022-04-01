import { I18nLanguageEntry } from '@intake24/common/types/http';
import { defineComponent } from '@vue/composition-api';
import { useApp } from '../stores';

export default defineComponent({
  methods: {
    isRrlLocale(languageId: string): boolean {
      return ['ar'].includes(languageId);
    },

    async setLanguage(app: 'admin' | 'survey', languageId: string) {
      let languageSet = false;

      // Fetch locale messages
      try {
        const {
          data: { messages, textDirection },
        } = await this.$http.get<I18nLanguageEntry>(`i18n/${languageId}`, { params: { app } });

        if (Object.keys(messages).length) this.$root.$i18n.setLocaleMessage(languageId, messages);

        this.updateAppWithLanguage(languageId, textDirection === 'rtl');
        languageSet = true;
      } catch {
        //
      }

      if (languageSet) return;

      // If language not updated, try local data
      if (Object.keys(this.$root.$i18n.messages).includes(languageId)) {
        this.updateAppWithLanguage(languageId);
      }
    },

    updateAppWithLanguage(languageId: string, isRtl?: boolean) {
      const appStore = useApp();

      appStore.setLanguage(languageId);
      this.$root.$i18n.locale = languageId;
      this.$vuetify.rtl = typeof isRtl !== 'undefined' ? isRtl : this.isRrlLocale(languageId);

      /*
       * TODO
       * - update http headers
       * - update document lang element
       *
       */
    },
  },
});
