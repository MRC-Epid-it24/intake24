import { checkSchema } from 'express-validator';
import validate from '@/http/requests/validate';
import { reCaptcha } from '@/http/rules';

export default validate(
  checkSchema({
    email: {
      in: ['body'],
      errorMessage: 'Email must be filled in.',
      isEmail: true,
      isEmpty: { negated: true },
      toLowerCase: true,
    },
    recaptcha: {
      in: ['body'],
      custom: {
        options: async (value): Promise<void> => reCaptcha(value),
      },
    },
  })
);
