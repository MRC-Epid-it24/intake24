import { checkSchema } from 'express-validator';

import validate from '@intake24/api/http/requests/validate';

export default validate(
  checkSchema({
    name: {
      in: ['body'],
      errorMessage: 'Please provide your name.',
      isString: true,
      isEmpty: { negated: true },
    },
    phone: {
      in: ['body'],
      errorMessage: 'Please provide your phone number.',
      isString: true,
      isEmpty: { negated: true },
    },
  })
);
