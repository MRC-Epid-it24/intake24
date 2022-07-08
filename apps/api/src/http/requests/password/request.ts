import { checkSchema } from 'express-validator';
import validate from '@intake24/api/http/requests/validate';
import { captcha } from '@intake24/api/http/rules';
import ioc from '@intake24/api/ioc';

const config = ioc.resolve('servicesConfig');

export default validate(
  checkSchema({
    email: {
      in: ['body'],
      errorMessage: 'Email must be filled in.',
      isEmail: true,
      isEmpty: { negated: true },
      toLowerCase: true,
    },
    captcha: {
      in: ['body'],
      custom: {
        options: async (value): Promise<void> => captcha(value, config.captcha),
      },
    },
  })
);
