import { defineComponent } from 'vue';

import type {
  Dictionary,
  LocaleTranslation,
  RequiredLocaleTranslation,
} from '@intake24/common/types';

export type LocaleContentOptions = {
  path?: string;
  params?: Dictionary<string>;
};

export const replaceParams = (content: string, params: Dictionary<string> = {}) =>
  Object.entries(params).reduce((acc, [key, value]) => {
    acc = acc.replace(`{${key}}`, value);
    return acc;
  }, content);

export default defineComponent({
  methods: {
    getLocaleContent(
      content: LocaleTranslation | RequiredLocaleTranslation | string,
      options: LocaleContentOptions = {}
    ): string {
      const { path, params = {} } = options;

      if (typeof content === 'string') return replaceParams(content, params);

      const localeContent = content[this.$i18n.locale];
      if (localeContent) return replaceParams(localeContent, params);

      if (path) return this.$t(path, params).toString();

      return content.en ? replaceParams(content.en, params) : '';
    },
  },
});
