import { checkSchema } from 'express-validator';

import validate from '@intake24/api/http/requests/validate';

export default validate(
  checkSchema({
    username: {
      in: ['body'],
      errorMessage: 'Username must be filled in.',
      isString: true,
      isEmpty: { negated: true },
    },
    password: {
      in: ['body'],
      errorMessage: 'Password must be filled in.',
      isString: true,
      isEmpty: { negated: true },
    },
    survey: {
      in: ['body'],
      errorMessage: 'Survey must be selected.',
      isString: true,
      isEmpty: { negated: true },
    },
  })
);
