import type { Schema } from 'express-validator';

import { typeErrorMessage } from '@intake24/api/http/requests/util';

export const defaults: Schema = {
  'estimateIn.*': {
    in: ['body'],
    errorMessage: typeErrorMessage('string._', { path: 'estimateIn' }),
    isString: { bail: true },
    isEmpty: { negated: true, bail: true },
  },
  'howMany.*': {
    in: ['body'],
    errorMessage: typeErrorMessage('string._', { path: 'howMany' }),
    isString: { bail: true },
    isEmpty: { negated: true, bail: true },
  },
};
