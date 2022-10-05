import { checkSchema } from 'express-validator';

import { typeErrorMessage, validate } from '@intake24/api/http/requests/util';

export default validate(
  checkSchema({
    startDate: {
      in: ['body'],
      errorMessage: typeErrorMessage('date._'),
      isDate: true,
      toDate: true,
      optional: { options: { nullable: true } },
    },
    endDate: {
      in: ['body'],
      errorMessage: typeErrorMessage('date._'),
      isDate: true,
      toDate: true,
      optional: { options: { nullable: true } },
    },
  })
);
