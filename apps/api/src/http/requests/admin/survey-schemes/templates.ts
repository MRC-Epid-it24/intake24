import { checkSchema } from 'express-validator';

import { typeErrorMessage, validate } from '@intake24/api/http/requests/util';

export default validate(
  checkSchema({
    search: {
      in: ['query'],
      errorMessage: typeErrorMessage('string._'),
      isString: true,
      optional: { options: { nullable: true } },
    },
    limit: {
      in: ['query'],
      errorMessage: typeErrorMessage('int.minMax', { min: 1, max: 1000 }),
      isInt: { options: { min: 1, max: 100 } },
      toInt: true,
      optional: { options: { nullable: true } },
    },
  })
);
