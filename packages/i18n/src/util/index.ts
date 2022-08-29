import type { Dictionary } from '@intake24/common/types';
import { getObjectNestedKeys } from '@intake24/common/util';

/**
 * Merges two translations files together
 * - merge default built-in translation with database message object
 *
 * @param {*} target
 * @param {*} source
 * @returns
 */
export const mergeTranslations = (target: any, source: any) => {
  if (typeof target === 'undefined') return undefined;

  if (typeof source === 'undefined') return target;

  if (typeof target === 'string') return typeof source === 'string' ? source : target;

  if (Object.prototype.toString.call(target) === '[object Object]') {
    return Object.keys(target).reduce<Record<string, any>>((acc, key) => {
      acc[key] = mergeTranslations(target[key], source[key]);
      return acc;
    }, {});
  }

  return undefined;
};

/**
 * Compares two translation messages objects if they same deeply nested keys
 *
 * @template T1
 * @template T2
 * @param {T1} x
 * @param {T2} y
 * @returns {boolean}
 */
export const compareMessageKeys = <T1 = Dictionary, T2 = Dictionary>(x: T1, y: T2): boolean => {
  const xKeys = getObjectNestedKeys(x);
  const yKeys = getObjectNestedKeys(y);

  return xKeys.length === yKeys.length && xKeys.every((key) => yKeys.includes(key));
};

/**
 * Check that input is either string of object of strings
 *
 * @param {(string | Record<string, any>)} translation
 * @returns {boolean}
 */
export const validateTranslations = (translation: string | Record<string, any>): boolean => {
  if (Object.prototype.toString.call(translation) === '[object Object]') {
    for (const value of Object.values(translation)) {
      if (!validateTranslations(value)) return false;
    }
    return true;
  }

  return typeof translation === 'string';
};

export type I18nParams = Record<
  string,
  string | string[] | readonly string[] | number | number[] | readonly number[]
>;

/**
 * Replace parameters in i18n message
 *
 * @param {string} message
 * @param {I18nParams} [params={}]
 */
export const replaceParams = (message: string, params: I18nParams = {}) =>
  Object.entries(params).reduce((acc, [key, value]) => {
    acc = acc.replace(`{${key}}`, value.toString());
    return acc;
  }, message);
