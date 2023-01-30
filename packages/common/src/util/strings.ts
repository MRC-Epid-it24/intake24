import { customAlphabet, nanoid } from 'nanoid';
import { plural } from 'pluralize';

import { isSecurableType } from '../security';

export const capitalize = (string: string): string => string[0].toUpperCase() + string.substring(1);

/**
 * Convert string to kebab case
 *
 * @param {string} string
 */
export const kebabCase = (string: string): string =>
  string
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();

export const getResourceFromSecurable = (securableType: any): string => {
  if (!isSecurableType(securableType)) throw Error('Invalid securable type');

  return kebabCase(plural(securableType));
};

export const getRequestParamFromSecurable = (securableType: any): string => {
  if (!isSecurableType(securableType)) throw Error('Invalid securable type');

  return `${securableType[0].toLowerCase()}${securableType.substring(1)}Id`;
};

/**
 * Generate random string with optional custom size / alphabet
 *
 * @param {number} size
 * @param {(string | null)} [alphabet]
 * @returns {string}
 */
export const randomString = (size: number, alphabet?: string | null): string => {
  if (!alphabet) return nanoid(size);

  return customAlphabet(alphabet, size)();
};

export const offsetToExcelColumn = (offset: number | null): string | null => {
  if (offset === null) return null;

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  let currOffset = offset;

  while (currOffset > letters.length - 1) {
    const d = Math.floor(currOffset / letters.length) - 1;
    const rem = currOffset % letters.length;

    result = letters.charAt(rem) + result;
    currOffset = d;
  }

  return letters.charAt(currOffset) + result;
};

export const excelColumnToOffset = (column: string): number => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const currColumn = column.toUpperCase();
  let result = 0;
  let f = 1;

  for (let i = currColumn.length - 1; i >= 0; i -= 1) {
    result += f * (letters.indexOf(currColumn.charAt(i)) + 1);
    f *= 26;
  }

  return result - 1;
};
