import { checkSchema } from 'express-validator';

import { typeErrorMessage, validate } from '@intake24/api/http/requests/util';

export default validate(
  checkSchema({
    tzOffset: {
      in: ['query'],
      errorMessage: typeErrorMessage('int._'),
      isInt: true,
      toInt: true,
    },
  })
);
