import dompurify from 'dompurify';
import has from 'lodash/has';

import type {
  Dictionary,
  LocaleTranslation,
  RequiredLocaleTranslation,
} from '@intake24/common/types';
import { getObjectNestedKeys } from '@intake24/common/util';

import { i18n } from '../i18n';

/**
 * Merges two translations files together
 * - merge default built-in translation with database message object
 *
 * @param {*} target
 * @param {*} source
 * @returns
 */
export function mergeTranslations(target: any, source: any) {
  if (typeof target === 'undefined')
    return undefined;

  if (typeof source === 'undefined')
    return target;

  if (typeof target === 'string')
    return typeof source === 'string' ? source : target;

  if (Object.prototype.toString.call(target) === '[object Object]') {
    return Object.keys(target).reduce<Record<string, any>>((acc, key) => {
      acc[key] = mergeTranslations(target[key], source[key]);
      return acc;
    }, {});
  }

  return undefined;
}

/**
 * Compares two translation messages objects if they same deeply nested keys
 *
 * @template T1
 * @template T2
 * @param {T1} x
 * @param {T2} y
 * @returns {boolean}
 */
export function compareMessageKeys<
  T1 extends Dictionary = Dictionary,
  T2 extends Dictionary = Dictionary,
>(x: T1, y: T2): boolean {
  const xKeys = getObjectNestedKeys(x);
  const yKeys = getObjectNestedKeys(y);

  return xKeys.length === yKeys.length && xKeys.every(key => yKeys.includes(key));
}

/**
 * Check that input is either string | null | object
 *
 * @param {(string | Record<string, any>)} translation
 * @returns {boolean}
 */
export function validateTranslations(translation: string | Record<string, any>): boolean {
  if (Object.prototype.toString.call(translation) === '[object Object]') {
    for (const value of Object.values(translation)) {
      if (!validateTranslations(value))
        return false;
    }

    return true;
  }

  return typeof translation === 'string' || translation === null;
}

export type I18nParams = Record<
  string,
  string | string[] | readonly string[] | number | number[] | readonly number[]
>;

/**
 * Replace parameters in i18n message
 *
 * @param {string} message
 * @param {I18nParams} [params]
 */
export function replaceParams(message: string, params: I18nParams = {}) {
  return Object.entries(params).reduce((acc, [key, value]) => {
    acc = acc.replace(`{${key}}`, value.toString());
    return acc;
  }, message);
}

export type LocaleContentOptions = {
  path?: string;
  params?: Dictionary<string | number>;
  sanitize?: boolean;
};

export function sanitizeParams(content: Dictionary<string | number>) {
  return Object.entries(content).reduce((acc, [key, value]) => {
    acc[key] = value = dompurify.sanitize(value.toString(), {
      USE_PROFILES: { mathMl: false, svg: false, svgFilters: false, html: false },
    });

    return acc;
  }, {} as Dictionary<string>);
}

export function translate(
  content?: LocaleTranslation | RequiredLocaleTranslation | string,
  options: LocaleContentOptions = {},
): string {
  const { path, sanitize = false } = options;
  let { params = {} } = options;

  if (sanitize)
    params = sanitizeParams(params as Dictionary<string | number>);

  if (typeof content === 'string')
    return replaceParams(content, params);

  const localeContent = content ? content[i18n.locale] : undefined;
  if (localeContent)
    return replaceParams(localeContent, params);

  if (path && has(i18n.messages[i18n.locale], path))
    return i18n.t(path, params).toString();

  const enContent = content?.en;
  if (enContent)
    return replaceParams(enContent, params);

  if (path && has(i18n.messages.en, path))
    return i18n.t(path, params).toString();

  return '';
}

export function translatePath(
  path: string,
  params: Dictionary<string | number> = {},
  sanitize: boolean = false,
) {
  if (sanitize)
    params = sanitizeParams(params as Dictionary<string | number>);
  return i18n.t(path, params).toString();
}
