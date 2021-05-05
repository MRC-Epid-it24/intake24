import Vue from 'vue';
import { Dictionary, LocaleTranslation } from '@common/types';

export type LocaleContent = {
  getLocaleContent<T>(content: LocaleTranslation<T>): T;
  getLocaleString(content: LocaleTranslation<string | null>, fallbackPath: string, replace?: Dictionary<string>): string;
};

export default Vue.extend({
  methods: {
    getLocaleContent<T>(content: LocaleTranslation<T>): T {
      return content[this.$i18n.locale] ?? content.en;
    },
    getLocaleString(
      content: LocaleTranslation<string | null>,
      fallbackPath: string,
      replace: Dictionary<string> = {}
    ): string {
      let str = this.getLocaleContent(content);

      if (str == null) return this.$t(fallbackPath, replace).toString();

      for (const [key, value] of Object.entries(replace)) {
        str = str.replace(`{${key}}`, value);
      }

      return str;
    },
  },
});
