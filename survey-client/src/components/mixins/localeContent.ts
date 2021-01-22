import Vue from 'vue';
import { LocaleTranslation } from '@common/types';

export type LocaleContent = {
  getLocaleContent<T>(content: LocaleTranslation<T>): T;
};

export default Vue.extend({
  methods: {
    getLocaleContent<T>(content: LocaleTranslation<T>): T {
      return content[this.$i18n.locale] ?? content.en;
    },
  },
});
