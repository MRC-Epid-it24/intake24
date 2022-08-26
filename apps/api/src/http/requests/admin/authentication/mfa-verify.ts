import { checkSchema } from 'express-validator';

import { validate } from '@intake24/api/http/requests/util';

export default validate(
  checkSchema({
    code: {
      in: ['body'],
      errorMessage: 'Missing Duo code.',
      isString: true,
      isEmpty: { negated: true },
    },
    state: {
      in: ['body'],
      errorMessage: 'Missing Duo state.',
      isString: true,
      isEmpty: { negated: true },
    },
  })
);
