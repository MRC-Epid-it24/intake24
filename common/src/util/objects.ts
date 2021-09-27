import deepmerge from 'deepmerge';
import copy from 'fast-copy';

export { default as copy } from 'fast-copy';

export const merge = <T1, T2 = T1>(x: Partial<T1>, y: Partial<T2>): T1 & T2 =>
  deepmerge<T1, T2>(x, y, {
    arrayMerge: (destinationArray, sourceArray) => copy(sourceArray),
  });
