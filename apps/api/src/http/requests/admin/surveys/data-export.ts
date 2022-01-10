import { checkSchema } from 'express-validator';
import validate from '@intake24/api/http/requests/validate';

export default validate(
  checkSchema({
    startDate: {
      in: ['body'],
      errorMessage: 'Enter valid survey start date.',
      isDate: true,
      isEmpty: { negated: true },
      toDate: true,
    },
    endDate: {
      in: ['body'],
      errorMessage: 'Enter valid survey end date.',
      isDate: true,
      isEmpty: { negated: true },
      toDate: true,
    },
  })
);
