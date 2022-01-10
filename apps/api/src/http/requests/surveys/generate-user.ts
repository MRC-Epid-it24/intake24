import { checkSchema } from 'express-validator';
import validate from '@intake24/api/http/requests/validate';
import { reCaptcha } from '@intake24/api/http/rules';
import ioc from '@intake24/api/ioc';

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
