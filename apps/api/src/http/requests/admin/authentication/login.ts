import { checkSchema } from 'express-validator';

import { typeErrorMessage, validate } from '@intake24/api/http/requests/util';

import { userAgent } from '../../generic';

export default validate(
  checkSchema({
    'user-agent': userAgent,
    email: {
      in: ['body'],
      errorMessage: typeErrorMessage('string._'),
      isString: true,
      isEmpty: { negated: true },
      toLowerCase: true,
    },
    password: {
      in: ['body'],
      errorMessage: typeErrorMessage('string._'),
      isString: true,
      isEmpty: { negated: true },
    },
  })
);
