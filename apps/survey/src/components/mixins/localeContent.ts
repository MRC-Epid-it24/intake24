import { defineComponent } from 'vue';

import type {
  Dictionary,
  LocaleTranslation,
  RequiredLocaleTranslation,
} from '@intake24/common/types';
import { replaceParams } from '@intake24/i18n';

export type LocaleContentOptions = {
  path?: string;
  params?: Dictionary<string>;
};

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
