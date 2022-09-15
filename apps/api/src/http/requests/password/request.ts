import { checkSchema } from 'express-validator';

import { typeErrorMessage, validate } from '@intake24/api/http/requests/util';
import { captcha } from '@intake24/api/http/rules';
import ioc from '@intake24/api/ioc';

import { authHeaders } from '../generic';

const config = ioc.resolve('servicesConfig');

export default validate(
  checkSchema({
    ...authHeaders,
    email: {
      in: ['body'],
      errorMessage: typeErrorMessage('email._'),
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
