import type { TranslateResult } from 'vue-i18n';
import has from 'lodash/has';
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

      if (path && has(this.$i18n.messages[this.$i18n.locale], path))
        return this.$t(path, params).toString();

      return content.en ? replaceParams(content.en, params) : '';
    },

    /* TranslateResult has a rather convoluted type hierarchy as it represents both
     actual localised strings and the message file structure.

     This function will throw an error if the TranslateResult argument is not a plain message. */
    asPlainString(result: TranslateResult): string {
      if (typeof result === 'string') return result;

      throw new Error('Expected the translation result to be a plain string');
    },
  },
});
