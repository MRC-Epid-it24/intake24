import { defineComponent } from 'vue';
import type { Dictionary, LocaleTranslation } from '@intake24/common/types';

export type LocaleContent = {
  getLocaleContent<T>(content: LocaleTranslation<T>): T;
  getLocaleString(
    content: LocaleTranslation<string | null>,
    fallbackPath: string,
    replace?: Dictionary<string>
  ): string;
};

export default defineComponent({
  methods: {
    getLocaleContent<T>(content: LocaleTranslation<T> | string): T | string {
      if (typeof content === 'string') return content;
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
