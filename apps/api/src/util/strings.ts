import slugify from 'slugify';
import trim from 'lodash/trim';
import trimEnd from 'lodash/trimEnd';
import validator from 'validator';

export const btoa = (object: any): string => Buffer.from(JSON.stringify(object)).toString('base64');

export const toSimpleName = (name?: string | null): string | null =>
  name ? slugify(name, { replacement: ' ', lower: true }) : null;

/**
 * Check whether string is a BigInt
 *
 * @param {*} value
 * @returns {boolean}
 */
export const isStringBigInt = (value: any): boolean => {
  if (typeof value === 'number' || typeof value === 'bigint') return true;

  if (typeof value !== 'string') return false;

  try {
    BigInt(value);
    return true;
  } catch (err) {
    throw new Error('Value is not BigInt.');
  }
};

/**
 * Determine if URL is external (not relative)
 * covers both absolute URLs & IPs
 *
 * @param {string} url
 * @param {validator.IsURLOptions} options
 * @returns {boolean}
 */
export const isUrlAbsolute = (url: string, options?: validator.IsURLOptions): boolean =>
  validator.isURL(url, options);

/**
 * Get survey frontend URL
 *
 * @param {string} base
 * @param {string} survey
 * @param {string} [override]
 * @returns {string}
 */
export const getSurveyUrl = (base: string, survey: string, override?: string | null): string => {
  if (override) return trimEnd(override, '/');

  if (isUrlAbsolute(survey)) return trimEnd(survey, '/');

  return [base, survey].map((item) => trim(item, '/')).join('/');
};
