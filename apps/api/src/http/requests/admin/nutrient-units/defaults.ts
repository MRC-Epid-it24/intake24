import type { Schema } from 'express-validator';

import { typeErrorMessage } from '@intake24/api/http/requests/util';

const defaults: Schema = {
  description: {
    in: ['body'],
    errorMessage: typeErrorMessage('string.max', { max: 512 }),
    isString: { bail: true },
    isEmpty: { negated: true, bail: true },
    isLength: { bail: true, options: { max: 512 } },
  },
  symbol: {
    in: ['body'],
    errorMessage: typeErrorMessage('string.max', { max: 32 }),
    isString: { bail: true },
    isEmpty: { negated: true, bail: true },
    isLength: { bail: true, options: { max: 32 } },
  },
};

export default defaults;
