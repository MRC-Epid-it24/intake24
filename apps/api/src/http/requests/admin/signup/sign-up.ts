import { checkSchema } from 'express-validator';

import { typeErrorMessage, validate } from '@intake24/api/http/requests/util';

import { userAgent } from '../../generic';
import { email, emailConfirm, name, password, phoneOptional } from '../users/defaults';

export default validate(
  checkSchema({
    'user-agent': userAgent,
    email,
    emailConfirm,
    name,
    phone: phoneOptional,
    ...password,
    terms: {
      errorMessage: typeErrorMessage('terms._'),
      isBoolean: true,
      custom: {
        options: async (value): Promise<void> => {
          if (value !== true) throw new Error();
        },
      },
    },
  })
);
