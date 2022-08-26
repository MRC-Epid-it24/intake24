import { checkSchema } from 'express-validator';

import { validate } from '@intake24/api/http/requests/util';

export default validate(
  checkSchema({
    email: {
      in: ['body'],
      errorMessage: 'Email must be filled in.',
      isString: true,
      isEmpty: { negated: true },
      toLowerCase: true,
    },
    password: {
      in: ['body'],
      errorMessage: 'Password must be filled in.',
      isString: true,
      isEmpty: { negated: true },
    },
  })
);
