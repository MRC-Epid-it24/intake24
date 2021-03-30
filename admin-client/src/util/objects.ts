/* eslint-disable import/prefer-default-export */
import deepmerge from 'deepmerge';
import cloneDeep from 'lodash/cloneDeep';

export const merge = <T1, T2 = T1>(x: Partial<T1>, y: Partial<T2>): T1 & T2 =>
  deepmerge<T1, T2>(x, y, {
    arrayMerge: (destinationArray, sourceArray) => cloneDeep(sourceArray),
  });
