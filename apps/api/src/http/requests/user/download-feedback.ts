import { checkSchema } from 'express-validator';
import validate from '@intake24/api/http/requests/validate';

export default validate(
  checkSchema({
    survey: {
      in: ['query'],
      errorMessage: 'Missing survey parameter.',
      isString: true,
    },
  })
);
