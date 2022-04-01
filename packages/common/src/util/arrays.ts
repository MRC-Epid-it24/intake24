/* eslint-disable import/prefer-default-export */

export const arrayToObject = <
  T extends object /* Record<PropertyKey, unknown> */,
  K extends keyof T
>(
  array: T[],
  key: K
): Record<string, T> => Object.fromEntries(array.map((item) => [item[key], item]));
