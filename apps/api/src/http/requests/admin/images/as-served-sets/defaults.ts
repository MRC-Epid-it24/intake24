import type { Schema } from 'express-validator';

import { typeErrorMessage } from '@intake24/api/http/requests/util';

const defaults: Schema = {
  description: {
    in: ['body'],
    errorMessage: typeErrorMessage('string.max', { max: 128 }),
    isString: true,
    isEmpty: { negated: true },
    isLength: { bail: true, options: { max: 128 } },
  },
};

export default defaults;
