import { checkSchema } from 'express-validator';
import validate from '@/http/requests/validate';

export default validate(
  checkSchema({
    email: {
      in: ['body'],
      errorMessage: 'Email must be filled in.',
      isString: true,
      isEmpty: { negated: true },
    },
    password: {
      in: ['body'],
      errorMessage: 'Password must be filled in.',
      isString: true,
      isEmpty: { negated: true },
    },
  })
);
