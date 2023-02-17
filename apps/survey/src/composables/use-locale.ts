import has from 'lodash/has';

import type {
  Dictionary,
  LocaleTranslation,
  RequiredLocaleTranslation,
} from '@intake24/common/types';
import { replaceParams } from '@intake24/i18n';
import { useI18n } from '@intake24/survey/i18n';

export type LocaleContentOptions = {
  path?: string;
  params?: Dictionary<string>;
};

export const useLocale = () => {
  const getLocaleContent = (
    content: LocaleTranslation | RequiredLocaleTranslation | string,
    options: LocaleContentOptions = {}
  ): string => {
    const { path, params = {} } = options;
    const i18n = useI18n();

    if (typeof content === 'string') return replaceParams(content, params);

    const localeContent = content[i18n.locale];
    if (localeContent) return replaceParams(localeContent, params);

    if (path && has(i18n.messages[i18n.locale], path)) return i18n.t(path, params).toString();

    return content.en ? replaceParams(content.en, params) : '';
  };

  return { getLocaleContent };
};
