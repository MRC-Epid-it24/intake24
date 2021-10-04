import { checkSchema } from 'express-validator';
import validate from '@api/http/requests/validate';

export default validate(
  checkSchema({
    tzOffset: {
      in: ['query'],
      errorMessage: `Invalid timezone offset parameter.`,
      isInt: true,
      toInt: true,
    },
  })
);
