import type { Schema } from 'express-validator';

import { typeErrorMessage } from '@intake24/api/http/requests/util';

const defaults: Schema = {
  description: {
    in: ['body'],
    errorMessage: typeErrorMessage('string._'),
    isString: true,
    isEmpty: { negated: true },
  },
};

export default defaults;
