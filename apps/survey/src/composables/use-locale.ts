import dompurify from 'dompurify';
import has from 'lodash/has';

import type {
  Dictionary,
  LocaleTranslation,
  RequiredLocaleTranslation,
} from '@intake24/common/types';
import { replaceParams, useI18n } from '@intake24/i18n';

export type LocaleContentOptions = {
  path?: string;
  params?: Dictionary<string | number>;
  sanitize?: boolean;
};

export const useLocale = () => {
  const getLocaleContent = (
    content?: LocaleTranslation | RequiredLocaleTranslation | string,
    options: LocaleContentOptions = {}
  ): string => {
    const { path, params = {}, sanitize = false } = options;
    const i18n = useI18n();

    if (sanitize) {
      for (const key of Object.keys(params)) {
        params[key] = dompurify.sanitize(params[key].toString(), {
          USE_PROFILES: { mathMl: false, svg: false, svgFilters: false, html: false },
        });
      }
    }

    if (typeof content === 'string') return replaceParams(content, params);

    const localeContent = content ? content[i18n.locale] : undefined;
    if (localeContent) return replaceParams(localeContent, params);

    if (path && has(i18n.messages[i18n.locale], path)) return i18n.t(path, params).toString();

    const enContent = content?.en;
    if (enContent) return replaceParams(enContent, params);

    if (path && has(i18n.messages.en, path)) return i18n.t(path, params).toString();

    return '';
  };

  return { getLocaleContent };
};
