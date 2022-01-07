import Vue from 'vue';

export default Vue.extend({
  methods: {
    async setLanguage(app: 'admin' | 'survey', languageId: string) {
      const {
        data: { messages, textDirection },
      } = await this.$http.get(`i18n/${languageId}`, { params: { app } });

      this.$root.$i18n.setLocaleMessage(languageId, messages);
      this.$root.$i18n.locale = languageId;
      this.$vuetify.rtl = textDirection === 'rtl';
      this.$ls.set('language', languageId);
    },
  },
});
