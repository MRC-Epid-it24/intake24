import { checkSchema } from 'express-validator';
import validate from '@api/http/requests/validate';
import { reCaptcha } from '@api/http/rules';
import ioc from '@api/ioc';

const config = ioc.resolve('servicesConfig');

export default validate(
  checkSchema({
    reCaptchaToken: {
      in: ['body'],
      custom: {
        options: async (value): Promise<void> => reCaptcha(value, config.reCaptcha),
      },
    },
  })
);
