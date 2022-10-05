import { checkSchema } from 'express-validator';

import { typeErrorMessage, validate } from '@intake24/api/http/requests/util';

import { userAgent } from '../generic';

export default validate(
  checkSchema({
    'user-agent': userAgent,
    tzOffset: {
      in: ['query'],
      errorMessage: typeErrorMessage('int._'),
      isInt: true,
      toInt: true,
    },
    // TODO: validate survey submission state
    /* submission: {
      in: ['body'],
    } */
  })
);
