import Vue from 'vue';

export default Vue.extend({
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
        } = await this.$http.get(`i18n/${languageId}`, { params: { app } });

        if (Object.keys(messages).length) this.$root.$i18n.setLocaleMessage(languageId, messages);

        this.$root.$i18n.locale = languageId;
        this.$ls.set('language', languageId);
        this.$vuetify.rtl = textDirection === 'rtl';

        languageSet = true;
      } catch {
        //
      }

      if (languageSet) return;

      // If language not updated, try local data
      if (Object.keys(this.$root.$i18n.messages).includes(languageId)) {
        this.$root.$i18n.locale = languageId;
        this.$ls.set('language', languageId);
        this.$vuetify.rtl = this.isRrlLocale(languageId);
      }
    },
  },
});
