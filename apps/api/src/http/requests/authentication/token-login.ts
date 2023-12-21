import { checkSchema } from 'express-validator';

import { typeErrorMessage, validate } from '@intake24/api/http/requests/util';

import { userAgent } from '../generic';

export default validate(
  checkSchema({
    'user-agent': userAgent,
    captcha: {
      in: ['body'],
      errorMessage: typeErrorMessage('string._'),
      isString: true,
      optional: true,
    },
  })
);
