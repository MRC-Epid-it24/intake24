import type { Schema } from 'express-validator';

import { typeErrorMessage } from '@intake24/api/http/requests/util';

const defaults: Schema = {
  description: {
    in: ['body'],
    errorMessage: typeErrorMessage('string._'),
    isString: { bail: true },
    isEmpty: { negated: true, bail: true },
  },
  symbol: {
    in: ['body'],
    errorMessage: typeErrorMessage('string._'),
    isString: { bail: true },
    isEmpty: { negated: true, bail: true },
  },
};

export default defaults;
