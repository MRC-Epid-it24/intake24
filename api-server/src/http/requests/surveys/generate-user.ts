import { checkSchema } from 'express-validator';
import validate from '@/http/requests/validate';
import { reCaptcha } from '@/http/rules';

export default validate(
  checkSchema({
    reCaptchaToken: {
      in: ['body'],
      custom: {
        options: async (value): Promise<void> => reCaptcha(value),
      },
    },
  })
);
