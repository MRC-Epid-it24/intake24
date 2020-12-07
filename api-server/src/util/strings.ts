import slugify from 'slugify';
import validator from 'validator';

export const btoa = (object: any): string => Buffer.from(JSON.stringify(object)).toString('base64');

export const toSimpleName = (name?: string | null): string | null =>
  name ? slugify(name, { replacement: ' ', lower: true }) : null;

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
