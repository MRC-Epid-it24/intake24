import { checkSchema } from 'express-validator';

import { typeErrorMessage, validate } from '@intake24/api/http/requests/util';

export default validate(
  checkSchema({
    survey: {
      in: ['query'],
      errorMessage: typeErrorMessage('string._'),
      isString: true,
      optional: true,
    },
  })
);
