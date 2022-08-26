import { checkSchema } from 'express-validator';

import { errorMessage, validate } from '@intake24/api/http/requests/util';

export default validate(
  checkSchema({
    name: {
      in: ['body'],
      errorMessage: errorMessage('validation.surveys.requestHelp.name'),
      isString: true,
      isEmpty: { negated: true },
    },
    phone: {
      in: ['body'],
      errorMessage: errorMessage('validation.surveys.requestHelp.phone'),
      isString: true,
      isEmpty: { negated: true },
    },
  })
);
