import { checkSchema } from 'express-validator';

import { typeErrorMessage, validate } from '@intake24/api/http/requests/util';

export default validate(
  checkSchema({
    preferred: {
      in: ['body'],
      errorMessage: typeErrorMessage('boolean._'),
      isBoolean: { options: { strict: true } },
      toBoolean: true,
    },
  })
);
