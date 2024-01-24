import { addYears, endOfDay, format, isBefore, isFuture } from 'date-fns';
import { checkSchema } from 'express-validator';

import { typeErrorMessage, validate } from '@intake24/api/http/requests/util';

export default validate(
  checkSchema({
    name: {
      in: ['body'],
      errorMessage: typeErrorMessage('string.max', { max: 128 }),
      isString: true,
      isEmpty: { negated: true },
      isLength: { options: { max: 128 } },
    },
    expiresAt: {
      in: ['body'],
      errorMessage: typeErrorMessage('date.between', {
        after: format(new Date(), 'dd/MM/yyyy'),
        before: format(addYears(new Date(), 2), 'dd/MM/yyyy'),
      }),
      isDate: true,
      isEmpty: { negated: true },
      custom: {
        options: (value) =>
          isFuture(new Date(value)) && isBefore(new Date(value), addYears(new Date(), 2)),
      },
      customSanitizer: { options: (value) => endOfDay(new Date(value)) },
    },
  })
);
