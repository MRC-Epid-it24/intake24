/* eslint-disable import/prefer-default-export */

import validator from 'validator';

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
