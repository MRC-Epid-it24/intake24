/* eslint-disable import/prefer-default-export */

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
