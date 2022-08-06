import deepmerge from 'deepmerge';
import copy from 'fast-copy';

import type { Dictionary } from '../types';

export { default as copy } from 'fast-copy';

export const merge = <T1, T2 = T1>(x: Partial<T1>, y: Partial<T2>): T1 & T2 =>
  deepmerge<T1, T2>(x, y, {
    arrayMerge: (destinationArray, sourceArray) => copy(sourceArray),
  });

export const getObjectNestedKeys = <T extends Dictionary>(object: T, prefix?: string) =>
  Object.entries(object).reduce<string[]>((acc, [key, value]) => {
    let items =
      Object.prototype.toString.call(value) === '[object Object]'
        ? getObjectNestedKeys(value, key)
        : [key];

    if (prefix) items = items.map((item) => `${prefix}.${item}`);
    acc.push(...items);
    return acc;
  }, []);
