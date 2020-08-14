import { checkSchema } from 'express-validator';
import validate from '@/http/requests/validate';
import recaptcha from '@/http/rules/recaptcha';

export default validate(
  checkSchema({
    email: {
      in: ['body'],
      errorMessage: 'Email must be filled in.',
      isEmail: true,
      isEmpty: { negated: true },
    },
    recaptcha: {
      in: ['body'],
      custom: {
        options: async (value): Promise<void> => recaptcha(value),
      },
    },
  })
);
