import { checkSchema } from 'express-validator';

import {
  customTypeErrorMessage,
  typeErrorMessage,
  validate,
} from '@intake24/api/http/requests/util';

import defaults from './defaults';

export default validate(
  checkSchema({
    ...defaults,
    email: {
      in: ['body'],
      errorMessage: typeErrorMessage('email._'),
      isEmail: true,
      toLowerCase: true,
    },
    emailConfirm: {
      in: ['body'],
      errorMessage: typeErrorMessage('email._'),
      isEmail: { bail: true },
      toLowerCase: true,
      custom: {
        options: async (value, meta): Promise<void> => {
          if (value !== meta.req.body.email)
            throw new Error(customTypeErrorMessage('match._', meta, { match: 'email' }));
        },
      },
    },
  })
);
