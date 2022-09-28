import type { Schema } from 'express-validator';
import { isPlainObject } from 'lodash';

import { customTypeErrorMessage, typeErrorMessage } from '@intake24/api/http/requests/util';

export const defaults: Schema = {
  estimateIn: {
    in: ['body'],
    custom: {
      options: async (value, meta): Promise<void> => {
        if (!isPlainObject(value)) throw new Error(customTypeErrorMessage('object._', meta));
      },
    },
  },
  'estimateIn.*': {
    in: ['body'],
    errorMessage: typeErrorMessage('string._', { path: 'estimateIn' }),
    isString: { bail: true },
    isEmpty: { negated: true, bail: true },
  },
  howMany: {
    in: ['body'],
    custom: {
      options: async (value, meta): Promise<void> => {
        if (!isPlainObject(value)) throw new Error(customTypeErrorMessage('object._', meta));
      },
    },
  },
  'howMany.*': {
    in: ['body'],
    errorMessage: typeErrorMessage('string._', { path: 'howMany' }),
    isString: { bail: true },
    isEmpty: { negated: true, bail: true },
  },
};
