import { checkSchema } from 'express-validator';

import { typeErrorMessage, validate } from '@intake24/api/http/requests/util';

import { userAgent } from '../../generic';

export default validate(
  checkSchema({
    'user-agent': userAgent,
    code: {
      in: ['body'],
      errorMessage: typeErrorMessage('string._'),
      isString: true,
      isEmpty: { negated: true },
    },
    state: {
      in: ['body'],
      errorMessage: typeErrorMessage('string._'),
      isString: true,
      isEmpty: { negated: true },
    },
  })
);
