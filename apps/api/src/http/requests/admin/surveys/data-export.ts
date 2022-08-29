import { checkSchema } from 'express-validator';

import { typeErrorMessage, validate } from '@intake24/api/http/requests/util';

export default validate(
  checkSchema({
    startDate: {
      in: ['body'],
      errorMessage: typeErrorMessage('date._'),
      isDate: true,
      isEmpty: { negated: true },
      toDate: true,
    },
    endDate: {
      in: ['body'],
      errorMessage: typeErrorMessage('date._'),
      isDate: true,
      isEmpty: { negated: true },
      toDate: true,
    },
  })
);
