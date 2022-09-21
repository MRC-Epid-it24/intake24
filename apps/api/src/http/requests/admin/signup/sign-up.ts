import { checkSchema } from 'express-validator';

import { typeErrorMessage, validate } from '@intake24/api/http/requests/util';

import { authHeaders } from '../../generic';
import { email, emailConfirm, name, password, phoneOptional } from '../users/defaults';

export default validate(
  checkSchema({
    ...authHeaders,
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
