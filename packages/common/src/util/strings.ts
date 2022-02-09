import { nanoid, customAlphabet } from 'nanoid';

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
