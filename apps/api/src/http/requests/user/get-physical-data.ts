import { checkSchema } from 'express-validator';

import validate from '@intake24/api/http/requests/validate';

export default validate(
  checkSchema({
    survey: {
      in: ['query'],
      errorMessage: 'Invalid survey parameter.',
      isString: true,
      optional: true,
    },
  })
);
